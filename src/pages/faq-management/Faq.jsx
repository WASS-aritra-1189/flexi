import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from "react";
import {
    getFaqs,
    createFaq,
    updateFaqData,
    updateFaqStatus,
    uploadFaqImage
} from '../../store/slice/faqSlice';
import Modal from '../../Components/Modal/Modal';
import Pagination from '../../Components/Pagination/Pagination';
import { Tooltip } from 'react-tooltip';

const Faq = () => {
    const dispatch = useDispatch();
    const { faqs, totalCount } = useSelector((state) => state.faq);
    const { uploading } = useSelector((state) => state.loader);

    const [paginationState, setPaginationState] = useState({
        limit: 10,
        offset: 0,
        currentPage: 1,
        keyword: ""
    });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({ question: "", answer: "" });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const imageInputRef = useRef(null);
    const [edit, setEdit] = useState(false);
    const [faqId, setFaqId] = useState(null);
    const [title, setTitle] = useState("Create FAQ");
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("ACTIVE");
    const [statusModal, setStatusModal] = useState(false);
    const [stateStatus, setStateStatus] = useState("");
    const [statusFaqId, setStatusFaqId] = useState(null);
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState(null);
    const filters = { limit: 100, offset: 0, keyword: searchKeyword, status };
    const statusList = ["ACTIVE", "DEACTIVE", "PENDING", "DELETED", "SUSPENDED"];

    useEffect(() => {
        dispatch(getFaqs({
            limit: paginationState.limit,
            offset: paginationState.offset,
            keyword: paginationState.keyword,
            status: status
        }));
    }, [dispatch, paginationState.limit, paginationState.offset, paginationState.keyword, status]);

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
        if (!formData.question) {
            newErrors.question = "* Question is required";
        }
        if (!formData.answer) {
            newErrors.answer = "* Answer is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleCreateUpdate = () => {
        if (validateForm()) {
            if (edit) {
                dispatch(updateFaqData({ id: faqId, filters, body: formData, imageFile }));
            } else {
                dispatch(createFaq({ body: formData, filters, imageFile }));
            }
            setModal(false);
            setFormData({ question: "", answer: "" });
            setImageFile(null);
            setImagePreview(null);
            setErrors({});
        }
    };

    const handleCreateOpenModal = () => {
        setModal(true);
        setEdit(false);
        setTitle("Create FAQ");
        setFormData({ question: "", answer: "" });
        setImageFile(null);
        setImagePreview(null);
        setErrors({});
    };

    const handleEdit = (id) => {
        setErrors({});
        setModal(true);
        setFaqId(id);
        setEdit(true);
        setTitle("Update FAQ");
        setImageFile(null);
        const faqToEdit = faqs.find(item => item.id === id);
        if (faqToEdit) {
            setFormData({ question: faqToEdit.question, answer: faqToEdit.answer });
            setImagePreview(faqToEdit.image || null);
        }
    };

    const handleStatusModal = (id, currentStatus) => {
        setStatusFaqId(id);
        setStateStatus(currentStatus);
        setStatusModal(true);
    };

    const closeStatusModal = () => {
        setStatusModal(false);
    };

    const onValueChange = (e) => {
        setStateStatus(e.target.value);
    };

    const changeSaveStatus = () => {
        dispatch(updateFaqStatus({ id: statusFaqId, filters, body: { status: stateStatus } }));
        closeStatusModal();
    };

    const handleViewDetails = (faq) => {
        setSelectedFaq(faq);
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
        dispatch(getFaqs({
            limit: paginationState.limit,
            offset: paginationState.offset,
            keyword: paginationState.keyword,
            status: status
        }));
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-help-circle"></i>
                    <h2>FAQ Management</h2>
                </div>
            </div>

            <div className='status-and-add-icon' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by question or answer..."
                    value={searchKeyword}
                    onChange={handleKeywordChange}
                    style={{ padding: '8px', width: '300px' }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span onClick={handleRefresh} style={{ cursor: 'pointer' }} data-tooltip-id="refresh-tooltip" data-tooltip-content="Refresh">
                        <i className="bx bx-refresh" style={{ fontSize: '35px', color: '#007bff', marginBottom: '8px' }}></i>
                    </span>

                    <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '8px' }}>
                        {statusList.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>

                    <span onClick={handleCreateOpenModal} style={{ cursor: 'pointer' }} data-tooltip-id="add-tooltip" data-tooltip-content="Add FAQ">
                        <i className="bx bxs-plus-circle" style={{ fontSize: '30px', color: '#28a745', marginBottom: "8px" }}></i>
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {faqs?.map((item, index) => (
                            <tr key={index}>
                                <td>{paginationState.offset + index + 1}</td>
                                <td>
                                    {item.image
                                        ? <img src={item.image} alt="faq" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                                        : <span style={{ color: '#9ca3af', fontSize: '12px' }}>No image</span>}
                                </td>
                                <td>{item.question}</td>
                                <td>{item.answer?.substring(0, 50)}{item.answer?.length > 50 ? '...' : ''}</td>
                                <td>
                                    <span className={`status-badge status-${item.status?.toLowerCase()}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td>{(new Date(item.createdAt)).toLocaleString()}</td>
                                <td>{(new Date(item.updatedAt)).toLocaleString()}</td>
                                <td>
                                    <div className="table-action-button">
                                        <div className="action-icon" onClick={() => handleViewDetails(item)} data-tooltip-id="view-tooltip" data-tooltip-content="View Details">
                                            <i className="bx bx-info-circle text-olive"></i>
                                        </div>
                                        <div className="action-icon" onClick={() => handleEdit(item.id)} data-tooltip-id="edit-tooltip" data-tooltip-content="Edit">
                                            <i className="bx bx-edit text-info"></i>
                                        </div>
                                        <div className="action-icon" onClick={() => handleStatusModal(item.id, item.status)} data-tooltip-id="status-tooltip" data-tooltip-content="Change Status">
                                            <i className="bx bx-cog text-warning"></i>
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

            <Modal isOpen={modal} onClose={() => setModal(false)} title={title} width="600px">
                <div className="edit-form">
                    <div className="form-group">
                        <label>Question</label>
                        <input
                            type="text"
                            name='question'
                            value={formData.question}
                            onChange={handleFormChange}
                            className="form-control"
                        />
                        {errors.question && <span className="err-msg">{errors.question}</span>}
                    </div>

                    <div className="form-group">
                        <label>Answer</label>
                        <textarea
                            name='answer'
                            value={formData.answer}
                            onChange={handleFormChange}
                            className="form-control"
                            rows="5"
                        />
                        {errors.answer && <span className="err-msg">{errors.answer}</span>}
                    </div>

                    <div className="form-group">
                        <label>Image {edit ? '(optional — replaces existing)' : '(optional)'}</label>
                        <div
                            onClick={() => imageInputRef.current.click()}
                            style={{
                                height: '100px', borderRadius: '8px', border: '2px dashed #d1d5db',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', overflow: 'hidden', background: '#f9fafb',
                                backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                                backgroundSize: 'cover', backgroundPosition: 'center',
                            }}
                        >
                            {!imagePreview && (
                                <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                                    <i className="bx bx-upload" style={{ fontSize: '24px', display: 'block' }}></i>
                                    <span style={{ fontSize: '12px' }}>Click to upload image</span>
                                </div>
                            )}
                        </div>
                        <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        {imagePreview && (
                            <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                                style={{ marginTop: '6px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '12px', cursor: 'pointer' }}>
                                Remove Image
                            </button>
                        )}
                    </div>

                    <div className="button-group-modal">
                        <button className="confirm-button" onClick={handleCreateUpdate}>
                            {uploading ? "Saving..." : "Save"}
                        </button>
                        <button className="cancel-button" onClick={() => setModal(false)}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={statusModal} onClose={closeStatusModal} title="Status" width='600px'>
                <div className="status-container-horizontal">
                    {statusList.map((s) => (
                        <div key={s} className={`status-option status-${s.toLowerCase()}`}>
                            <input id={s} type="radio" name="status" checked={stateStatus === s} onChange={(e) => setStateStatus(e.target.value)} value={s} />
                            <label htmlFor={s}>{s}</label>
                        </div>
                    ))}
                </div>
                <div className="button-group-modal">
                    <button className="confirm-button" onClick={changeSaveStatus}>Confirm</button>
                    <button className="cancel-button" onClick={closeStatusModal}>Cancel</button>
                </div>
            </Modal>

            <Modal isOpen={detailsModal} onClose={() => setDetailsModal(false)} title="FAQ Details" width="600px">
                <div className="details-content">
                    {selectedFaq && (
                        <>
                            <div className="detail-item">
                                <label>Question:</label>
                                <span>{selectedFaq.question}</span>
                            </div>
                            <div className="detail-item">
                                <label>Answer:</label>
                                <span>{selectedFaq.answer}</span>
                            </div>
                            <div className="detail-item">
                                <label>Status:</label>
                                <span className={`status-badge status-${selectedFaq.status?.toLowerCase()}`}>
                                    {selectedFaq.status}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Created At:</label>
                                <span>{new Date(selectedFaq.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="detail-item">
                                <label>Updated At:</label>
                                <span>{new Date(selectedFaq.updatedAt).toLocaleString()}</span>
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
            <Tooltip id="status-tooltip" />
        </>
    );
};

export default Faq;
