import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { getPolicies, updatePolicyData } from '../../store/slice/policySlice';
import Modal from '../../Components/Modal/Modal';
import Pagination from '../../Components/Pagination/Pagination';
import { Tooltip } from 'react-tooltip';

const PageManagement = () => {
    const dispatch = useDispatch();
    const { policies, policyTotalCount } = useSelector((state) => state.policy);
    const { uploading } = useSelector((state) => state.loader);

    const [paginationState, setPaginationState] = useState({
        limit: 10,
        offset: 0,
        currentPage: 1,
    });
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({ desc: "" });
    const [pageId, setPageId] = useState(null);
    const [modalTitle, setModalTitle] = useState("");
    const [errors, setErrors] = useState({});
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedPage, setSelectedPage] = useState(null);

    const filters = { limit: paginationState.limit, offset: paginationState.offset };

    useEffect(() => {
        dispatch(getPolicies({
            limit: paginationState.limit,
            offset: paginationState.offset,
        }));
    }, [dispatch, paginationState.limit, paginationState.offset]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.desc) newErrors.desc = "* Description is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleUpdate = () => {
        if (validateForm()) {
            dispatch(updatePolicyData({ id: pageId, filters, body: formData }));
            setModal(false);
            setFormData({ desc: "" });
            setErrors({});
        }
    };

    const handleEdit = (item) => {
        setErrors({});
        setPageId(item.id);
        setModalTitle(`Edit - ${item.title}`);
        setFormData({ desc: item.desc });
        setModal(true);
    };

    const handleViewDetails = (item) => {
        setSelectedPage(item);
        setDetailsModal(true);
    };

    const handleRefresh = () => {
        dispatch(getPolicies({
            limit: paginationState.limit,
            offset: paginationState.offset,
        }));
    };

    const pageChange = (page) => {
        const offset = paginationState.limit * (page - 1);
        setPaginationState(prev => ({ ...prev, currentPage: page, offset }));
    };

    const itemsLimitChange = (limit) => {
        setPaginationState(prev => ({ ...prev, limit, offset: 0, currentPage: 1 }));
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-layout"></i>
                    <h2>Page Management</h2>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <span onClick={handleRefresh} style={{ cursor: 'pointer' }} data-tooltip-id="refresh-tooltip" data-tooltip-content="Refresh">
                    <i className="bx bx-refresh" style={{ fontSize: '35px', color: '#007bff', marginBottom: '8px' }}></i>
                </span>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies?.map((item, index) => (
                            <tr key={index}>
                                <td>{paginationState.offset + index + 1}</td>
                                <td>{item.title}</td>
                                <td style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.desc}
                                </td>
                                <td>
                                    <div className="table-action-button">
                                        <div className="action-icon" onClick={() => handleViewDetails(item)} data-tooltip-id="view-tooltip" data-tooltip-content="View Details">
                                            <i className="bx bx-info-circle text-olive"></i>
                                        </div>
                                        <div className="action-icon" onClick={() => handleEdit(item)} data-tooltip-id="edit-tooltip" data-tooltip-content="Edit">
                                            <i className="bx bx-edit text-info"></i>
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
                totalItem={policyTotalCount || 0}
                limitSelect={true}
                itemsPerPage={paginationState.limit}
                showEllipsisAfter={true}
                visiblePageCount={3}
                onPageChange={pageChange}
                onItemsLimitChange={itemsLimitChange}
            />

            <Modal isOpen={modal} onClose={() => setModal(false)} title={modalTitle} width="700px">
                <div className="edit-form">
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="desc"
                            value={formData.desc}
                            onChange={handleFormChange}
                            className="form-control"
                            rows={10}
                        />
                        {errors.desc && <span className="err-msg">{errors.desc}</span>}
                    </div>
                    <div className="button-group-modal">
                        <button className="confirm-button" onClick={handleUpdate}>
                            {uploading ? "Saving..." : "Save"}
                        </button>
                        <button className="cancel-button" onClick={() => setModal(false)}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={detailsModal} onClose={() => setDetailsModal(false)} title="Page Details" width="700px">
                <div className="details-content">
                    {selectedPage && (
                        <>
                            <div className="detail-item">
                                <label>Title:</label>
                                <span>{selectedPage.title}</span>
                            </div>
                            <div className="detail-item" style={{ alignItems: 'flex-start' }}>
                                <label>Description:</label>
                                <span style={{ textAlign: 'left', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                    {selectedPage.desc}
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
            <Tooltip id="view-tooltip" />
            <Tooltip id="edit-tooltip" />
        </>
    );
};

export default PageManagement;
