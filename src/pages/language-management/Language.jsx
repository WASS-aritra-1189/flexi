import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import {
    getLanguages,
    createLanguageData,
    updateLanguageData,
    deleteLanguageData,
} from '../../store/slice/languageSlice';
import Modal from '../../Components/Modal/Modal';
import Pagination from '../../Components/Pagination/Pagination';
import { Tooltip } from 'react-tooltip';

const Language = () => {
    const dispatch = useDispatch();
    const { languages, totalCount } = useSelector((state) => state.language);
    const { uploading } = useSelector((state) => state.loader);

    const [paginationState, setPaginationState] = useState({
        limit: 10,
        offset: 0,
        currentPage: 1,
        keyword: ""
    });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", code: "" });
    const [edit, setEdit] = useState(false);
    const [languageId, setLanguageId] = useState(null);
    const [title, setTitle] = useState("Create Language");
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("ACTIVE");
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteLanguageId, setDeleteLanguageId] = useState(null);

    const filters = { limit: paginationState.limit, offset: paginationState.offset, keyword: searchKeyword, status };

    useEffect(() => {
        dispatch(getLanguages({
            limit: paginationState.limit,
            offset: paginationState.offset,
            keyword: paginationState.keyword,
            status,
        }));
    }, [dispatch, paginationState.limit, paginationState.offset, paginationState.keyword, status]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPaginationState(prev => ({ ...prev, keyword: searchKeyword, offset: 0, currentPage: 1 }));
        }, 700);
        return () => clearTimeout(timer);
    }, [searchKeyword]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = "* Language Name is required";
        if (!formData.code) newErrors.code = "* Language Code is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleCreateUpdate = () => {
        if (validateForm()) {
            if (edit) {
                dispatch(updateLanguageData({ id: languageId, filters, body: formData }));
            } else {
                dispatch(createLanguageData({ body: formData, filters }));
            }
            setModal(false);
            setFormData({ name: "", code: "" });
            setErrors({});
        }
    };

    const handleCreateOpenModal = () => {
        setModal(true);
        setEdit(false);
        setTitle("Create Language");
        setFormData({ name: "", code: "" });
        setErrors({});
    };

    const handleEdit = (id) => {
        setErrors({});
        setModal(true);
        setLanguageId(id);
        setEdit(true);
        setTitle("Update Language");
        const item = languages.find(l => l.id === id);
        if (item) setFormData({ name: item.name, code: item.code });
    };

    const handleDeleteModal = (id) => {
        setDeleteLanguageId(id);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        dispatch(deleteLanguageData({ id: deleteLanguageId, filters }));
        setDeleteModal(false);
    };

    const handleViewDetails = (language) => {
        setSelectedLanguage(language);
        setDetailsModal(true);
    };

    const pageChange = (page) => {
        const offset = paginationState.limit * (page - 1);
        setPaginationState(prev => ({ ...prev, currentPage: page, offset }));
    };

    const itemsLimitChange = (limit) => {
        setPaginationState(prev => ({ ...prev, limit, offset: 0, currentPage: 1 }));
    };

    const handleRefresh = () => {
        dispatch(getLanguages({
            limit: paginationState.limit,
            offset: paginationState.offset,
            keyword: paginationState.keyword,
            status,
        }));
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-globe"></i>
                    <h2>Language Management</h2>
                </div>
            </div>

            <div className='status-and-add-icon' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by language name..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    style={{ padding: '8px', width: '300px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span onClick={handleRefresh} style={{ cursor: 'pointer' }} data-tooltip-id="refresh-tooltip" data-tooltip-content="Refresh">
                        <i className="bx bx-refresh" style={{ fontSize: '35px', color: '#007bff', marginBottom: '8px' }}></i>
                    </span>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '8px' }}>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DEACTIVE">DEACTIVE</option>
                        <option value="DELETED">DELETED</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                        <option value="PENDING">PENDING</option>
                    </select>
                    <span onClick={handleCreateOpenModal} style={{ cursor: 'pointer' }} data-tooltip-id="add-tooltip" data-tooltip-content="Add Language">
                        <i className="bx bxs-plus-circle" style={{ fontSize: '30px', color: '#28a745', marginBottom: '8px' }}></i>
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {languages?.map((item, index) => (
                            <tr key={index}>
                                <td>{paginationState.offset + index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.code}</td>
                                <td>
                                    <span className={`status-badge status-${item.status?.toLowerCase()}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="table-action-button">
                                        <div className="action-icon" onClick={() => handleViewDetails(item)} data-tooltip-id="view-tooltip" data-tooltip-content="View Details">
                                            <i className="bx bx-info-circle text-olive"></i>
                                        </div>
                                        <div className="action-icon" onClick={() => handleEdit(item.id)} data-tooltip-id="edit-tooltip" data-tooltip-content="Edit">
                                            <i className="bx bx-edit text-info"></i>
                                        </div>
                                        <div className="action-icon" onClick={() => handleDeleteModal(item.id)} data-tooltip-id="delete-tooltip" data-tooltip-content="Delete">
                                            <i className="bx bx-trash text-danger"></i>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={paginationState.currentPage}
                totalItem={totalCount || 0}
                limitSelect={true}
                itemsPerPage={paginationState.limit}
                showEllipsisAfter={true}
                visiblePageCount={3}
                onPageChange={pageChange}
                onItemsLimitChange={itemsLimitChange}
            />

            <Modal isOpen={modal} onClose={() => setModal(false)} title={title} width="500px">
                <div className="edit-form">
                    <div className="form-group">
                        <label>Language Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="form-control" placeholder="e.g. English" />
                        {errors.name && <span className="err-msg">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                        <label>Language Code</label>
                        <input type="text" name="code" value={formData.code} onChange={handleFormChange} className="form-control" placeholder="e.g. en" />
                        {errors.code && <span className="err-msg">{errors.code}</span>}
                    </div>
                    <div className="button-group-modal">
                        <button className="confirm-button" onClick={handleCreateUpdate}>
                            {uploading ? "Saving..." : "Save"}
                        </button>
                        <button className="cancel-button" onClick={() => setModal(false)}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Language" width="400px">
                <p>Are you sure you want to delete this language?</p>
                <div className="button-group-modal">
                    <button className="confirm-button" onClick={confirmDelete}>Delete</button>
                    <button className="cancel-button" onClick={() => setDeleteModal(false)}>Cancel</button>
                </div>
            </Modal>

            <Modal isOpen={detailsModal} onClose={() => setDetailsModal(false)} title="Language Details" width="500px">
                <div className="details-content">
                    {selectedLanguage && (
                        <>
                            <div className="detail-item">
                                <label>Name:</label>
                                <span>{selectedLanguage.name}</span>
                            </div>
                            <div className="detail-item">
                                <label>Code:</label>
                                <span>{selectedLanguage.code}</span>
                            </div>
                            <div className="detail-item">
                                <label>Status:</label>
                                <span className={`status-badge status-${selectedLanguage.status?.toLowerCase()}`}>
                                    {selectedLanguage.status}
                                </span>
                            </div>
                        </>
                    )}
                </div>
                <div className="button-group-modal">
                    <button className="cancel-button" onClick={() => setDetailsModal(false)}>Close</button>
                </div>
            </Modal>

            <Tooltip id="refresh-tooltip" />
            <Tooltip id="add-tooltip" />
            <Tooltip id="view-tooltip" />
            <Tooltip id="edit-tooltip" />
            <Tooltip id="delete-tooltip" />
        </>
    );
};

export default Language;
