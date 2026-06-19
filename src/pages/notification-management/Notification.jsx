import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import {
    getNotifications,
    createNotification,
    updateNotificationData,
    deleteNotificationData,
} from '../../store/slice/notificationSlice';
import Modal from '../../Components/Modal/Modal';
import Pagination from '../../Components/Pagination/Pagination';
import { Tooltip } from 'react-tooltip';

const Notification = () => {
    const dispatch = useDispatch();
    const { notifications, notificationTotalCount } = useSelector((state) => state.notification);
    const { uploading } = useSelector((state) => state.loader);

    const [paginationState, setPaginationState] = useState({ limit: 10, offset: 0, currentPage: 1 });
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({ title: "", desc: "", accountId: "", app: "USER" });
    const [edit, setEdit] = useState(false);
    const [notificationId, setNotificationId] = useState(null);
    const [title, setTitle] = useState("Create Notification");
    const [errors, setErrors] = useState({});
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const filters = { limit: paginationState.limit, offset: paginationState.offset };

    useEffect(() => {
        dispatch(getNotifications(filters));
    }, [dispatch, paginationState.limit, paginationState.offset]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = "* Title is required";
        if (!formData.desc) newErrors.desc = "* Description is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleCreateUpdate = () => {
        if (!validateForm()) return;
        const body = { title: formData.title, desc: formData.desc, app: formData.app };
        if (!edit && formData.accountId) body.accountId = formData.accountId;
        if (edit) {
            dispatch(updateNotificationData({ id: notificationId, body, filters }));
        } else {
            dispatch(createNotification({ body, filters }));
        }
        closeModal();
    };

    const closeModal = () => {
        setModal(false);
        setFormData({ title: "", desc: "", accountId: "", app: "USER" });
        setErrors({});
    };

    const handleCreateOpenModal = () => {
        setEdit(false);
        setTitle("Create Notification");
        setFormData({ title: "", desc: "", accountId: "", app: "USER" });
        setErrors({});
        setModal(true);
    };

    const handleEdit = (item) => {
        setEdit(true);
        setNotificationId(item.id);
        setTitle("Update Notification");
        setFormData({ title: item.title, desc: item.desc, accountId: item.accountId || "", app: item.app || "USER" });
        setErrors({});
        setModal(true);
    };

    const handleDeleteModal = (id) => {
        setDeleteId(id);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        dispatch(deleteNotificationData({ id: deleteId, filters }));
        setDeleteModal(false);
    };

    const pageChange = (page) => {
        setPaginationState((prev) => ({
            ...prev,
            currentPage: page,
            offset: prev.limit * (page - 1),
        }));
    };

    const itemsLimitChange = (limit) => {
        setPaginationState({ limit, offset: 0, currentPage: 1 });
    };

    const handleRefresh = () => {
        dispatch(getNotifications(filters));
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-bell"></i>
                    <h2>Notification Management</h2>
                </div>
            </div>

            <div className='status-and-add-icon' style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', gap: '20px', alignItems: 'center' }}>
                <span onClick={handleRefresh} style={{ cursor: 'pointer' }} data-tooltip-id="refresh-tooltip" data-tooltip-content="Refresh">
                    <i className="bx bx-refresh" style={{ fontSize: '35px', color: '#007bff', marginBottom: '8px' }}></i>
                </span>
                <span onClick={handleCreateOpenModal} style={{ cursor: 'pointer' }} data-tooltip-id="add-tooltip" data-tooltip-content="Add Notification">
                    <i className="bx bxs-plus-circle" style={{ fontSize: '30px', color: '#28a745', marginBottom: '8px' }}></i>
                </span>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Account ID</th>
                            <th>App</th>
                            <th>Read</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notifications?.map((item, index) => (
                            <tr key={item.id}>
                                <td>{paginationState.offset + index + 1}</td>
                                <td>{item.title}</td>
                                <td>{item.desc?.substring(0, 60)}{item.desc?.length > 60 ? '...' : ''}</td>
                                <td>{item.accountId ?? <span style={{ color: '#9ca3af', fontSize: '12px' }}>N/A</span>}</td>
                                <td>{item.app ?? "-"}</td>
                                <td>
                                    <span className={`status-badge status-${item.read ? 'active' : 'pending'}`}>
                                        {item.read ? 'Read' : 'Unread'}
                                    </span>
                                </td>
                                <td>{new Date(item.createdAt).toLocaleString()}</td>
                                <td>
                                    <div className="table-action-button">
                                        <div className="action-icon" onClick={() => handleEdit(item)} data-tooltip-id="edit-tooltip" data-tooltip-content="Edit">
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
                totalItem={notificationTotalCount || 0}
                limitSelect={true}
                itemsPerPage={paginationState.limit}
                showEllipsisAfter={true}
                visiblePageCount={3}
                onPageChange={pageChange}
                onItemsLimitChange={itemsLimitChange}
            />

            <Modal isOpen={modal} onClose={closeModal} title={title} width="500px">
                <div className="edit-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            className="form-control"
                        />
                        {errors.title && <span className="err-msg">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="desc"
                            value={formData.desc}
                            onChange={handleFormChange}
                            className="form-control"
                            rows="4"
                        />
                        {errors.desc && <span className="err-msg">{errors.desc}</span>}
                    </div>

                    <div className="form-group">
                        <label>App</label>
                        <select name="app" value={formData.app} onChange={handleFormChange} className="form-control">
                            <option value="USER">USER</option>
                            <option value="VENDOR">VENDOR</option>
                        </select>
                    </div>

                    {!edit && (
                        <div className="form-group">
                            <label>Account ID <span style={{ color: '#9ca3af', fontSize: '12px' }}>(optional)</span></label>
                            <input
                                type="text"
                                name="accountId"
                                value={formData.accountId}
                                onChange={handleFormChange}
                                className="form-control"
                                placeholder="Leave empty to send to all"
                            />
                        </div>
                    )}

                    <div className="button-group-modal">
                        <button className="confirm-button" onClick={handleCreateUpdate}>
                            {uploading ? "Saving..." : "Save"}
                        </button>
                        <button className="cancel-button" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Confirm Delete" width="450px">
                <div className="delete-confirmation">
                    <p>Are you sure you want to delete this notification?</p>
                    <div className="button-group-modal">
                        <button className="confirm-button" onClick={confirmDelete}>
                            {uploading ? "Deleting..." : "Delete"}
                        </button>
                        <button className="cancel-button" onClick={() => setDeleteModal(false)}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Tooltip id="refresh-tooltip" />
            <Tooltip id="add-tooltip" />
            <Tooltip id="edit-tooltip" />
            <Tooltip id="delete-tooltip" />
        </>
    );
};

export default Notification;
