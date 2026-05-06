import { useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    getPropertyRules,
    createPropertyRule,
    updatePropertyRuleData,
    deletePropertyRuleData
} from '../../store/slice/policySlice';
import Modal from '../../Components/Modal/Modal';
import Pagination from '../../Components/Pagination/Pagination';
import { Tooltip } from 'react-tooltip';

const PropertyRule = () => {
    const dispatch = useDispatch();
    const { propertyRules, propertyRuleTotalCount } = useSelector((state) => state.policy);
    const { uploading } = useSelector((state) => state.loader);

    const [paginationState, setPaginationState] = useState({
        limit: 10,
        offset: 0,
        currentPage: 1,
        keyword: ""
    });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({ type: "", policy: "" });
    const [edit, setEdit] = useState(false);
    const [ruleId, setRuleId] = useState(null);
    const [title, setTitle] = useState("Create Property Rule");
    const [errors, setErrors] = useState({});
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedRule, setSelectedRule] = useState(null);
    const filters = { limit: 50, offset: 0, keyword: searchKeyword };

    useEffect(() => {
        dispatch(getPropertyRules({
            limit: paginationState.limit,
            offset: paginationState.offset,
            keyword: paginationState.keyword
        }));
    }, [dispatch, paginationState.limit, paginationState.offset, paginationState.keyword]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPaginationState(prev => ({
                ...prev,
                keyword: searchKeyword,
                offset: 0,
                currentPage: 1
            }));
        }, 700);
        return () => clearTimeout(timer);
    }, [searchKeyword]);

    const handleKeywordChange = (e) => {
        setSearchKeyword(e.target.value);
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData.type) {
            newErrors.type = "* Type is required";
        }
        if (!formData.policy) {
            newErrors.policy = "* Policy is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const handleCreateUpdate = () => {
        if (validateForm()) {
            if (edit) {
                dispatch(updatePropertyRuleData({ id: ruleId, filters, body: formData }));
            } else {
                dispatch(createPropertyRule({ body: formData, filters }));
            }
            setModal(false);
            setFormData({ type: "", policy: "" });
            setErrors({});
        }
    };

    const handleCreateOpenModal = () => {
        setModal(true);
        setEdit(false);
        setTitle("Create Property Rule");
        setFormData({ type: "", policy: "" });
        setErrors({});
    };

    const handleEdit = (id) => {
        setErrors({});
        setModal(true);
        setRuleId(id);
        setEdit(true);
        setTitle("Update Property Rule");
        const ruleToEdit = propertyRules.find(item => item.id === id);
        if (ruleToEdit) {
            setFormData({ type: ruleToEdit.type, policy: ruleToEdit.policy });
        }
    };

    const handleDeleteModal = (id) => {
        setDeleteId(id);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        dispatch(deletePropertyRuleData({ id: deleteId, filters }));
        setDeleteModal(false);
    };

    const handleViewDetails = (rule) => {
        setSelectedRule(rule);
        setDetailsModal(true);
    };

    const pageChange = (page) => {
        const offset = paginationState.limit * (page - 1);
        setPaginationState(prev => ({
            ...prev,
            currentPage: page,
            offset: offset,
        }));
    };

    const itemsLimitChange = (limit) => {
        setPaginationState(prev => ({
            ...prev,
            limit: limit,
            offset: 0,
            currentPage: 1
        }));
    };

    const handleRefresh = () => {
        dispatch(getPropertyRules({
            limit: paginationState.limit,
            offset: paginationState.offset,
            keyword: paginationState.keyword
        }));
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-list-check"></i>
                    <h2>Property Rule Management</h2>
                </div>
            </div>

            <div className='status-and-add-icon' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by type or policy..."
                    value={searchKeyword}
                    onChange={handleKeywordChange}
                    style={{ padding: '8px', width: '300px' }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span onClick={handleRefresh} style={{ cursor: 'pointer' }} data-tooltip-id="refresh-tooltip" data-tooltip-content="Refresh">
                        <i className="bx bx-refresh" style={{ fontSize: '35px', color: '#007bff', marginBottom: '8px' }}></i>
                    </span>

                    <span onClick={handleCreateOpenModal} style={{ cursor: 'pointer' }} data-tooltip-id="add-tooltip" data-tooltip-content="Add Property Rule">
                        <i className="bx bxs-plus-circle" style={{ fontSize: '30px', color: '#28a745', marginBottom: "8px" }}></i>
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Type</th>
                            <th>Policy</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {propertyRules?.map((item, index) => (
                            <tr key={index}>
                                <td>{paginationState.offset + index + 1}</td>
                                <td>{item.type}</td>
                                <td>{item.policy}</td>
                                <td>{new Date(item.createdAt).toLocaleString()}</td>
                                <td>{new Date(item.updatedAt).toLocaleString()}</td>
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
                totalItem={propertyRuleTotalCount || 0}
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
                        <label>Type</label>
                        <input
                            type="text"
                            name='type'
                            value={formData.type}
                            onChange={handleFormChange}
                            className="form-control"
                        />
                        {errors.type && <span className="err-msg">{errors.type}</span>}
                    </div>

                    <div className="form-group">
                        <label>Policy</label>
                        <textarea
                            name='policy'
                            value={formData.policy}
                            onChange={handleFormChange}
                            className="form-control"
                            rows={4}
                        />
                        {errors.policy && <span className="err-msg">{errors.policy}</span>}
                    </div>

                    <div className="button-group-modal">
                        <button className="confirm-button" onClick={handleCreateUpdate}>
                            {uploading ? "Saving..." : "Save"}
                        </button>
                        <button className="cancel-button" onClick={() => setModal(false)}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Confirm Delete" width='500px'>
                <div className="delete-confirmation">
                    <p>Are you sure you want to delete this property rule?</p>
                    <div className="button-group-modal">
                        <button className="confirm-button" onClick={confirmDelete}>
                            {uploading ? "Deleting..." : "Delete"}
                        </button>
                        <button className="cancel-button" onClick={() => setDeleteModal(false)}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={detailsModal} onClose={() => setDetailsModal(false)} title="Property Rule Details" width="500px">
                <div className="details-content">
                    {selectedRule && (
                        <>
                            <div className="detail-item">
                                <label>Type:</label>
                                <span>{selectedRule.type}</span>
                            </div>
                            <div className="detail-item">
                                <label>Policy:</label>
                                <span>{selectedRule.policy}</span>
                            </div>
                            <div className="detail-item">
                                <label>Created At:</label>
                                <span>{new Date(selectedRule.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="detail-item">
                                <label>Updated At:</label>
                                <span>{new Date(selectedRule.updatedAt).toLocaleString()}</span>
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

export default PropertyRule;
