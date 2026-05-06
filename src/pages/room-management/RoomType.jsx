import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from "react";
import {
    getRoomTypes,
    createRoomType,
    updateRoomTypeData,
    deleteRoomTypeData
} from '../../store/slice/roomSlice';
import Modal from '../../Components/Modal/Modal';
import Pagination from '../../Components/Pagination/Pagination';
import { Tooltip } from 'react-tooltip';

const RoomType = () => {
    const dispatch = useDispatch();
    const { roomTypes, roomTypeTotalCount } = useSelector((state) => state.room);
    const { uploading } = useSelector((state) => state.loader);

    const [paginationState, setPaginationState] = useState({
        limit: 10,
        offset: 0,
        currentPage: 1,
        keyword: ""
    });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({ type: "" });
    const [iconFile, setIconFile] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);
    const iconInputRef = useRef(null);
    const [edit, setEdit] = useState(false);
    const [roomTypeId, setRoomTypeId] = useState(null);
    const [title, setTitle] = useState("Create Room Type");
    const [errors, setErrors] = useState({});
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedRoomType, setSelectedRoomType] = useState(null);
    const filters = { limit: 50, offset: 0, keyword: searchKeyword };

    useEffect(() => {
        dispatch(getRoomTypes({
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
            newErrors.type = "* Room Type is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIconFile(file);
        setIconPreview(URL.createObjectURL(file));
    };

    const handleCreateUpdate = () => {
        if (validateForm()) {
            if (edit) {
                dispatch(updateRoomTypeData({ id: roomTypeId, filters, body: formData, iconFile }));
            } else {
                dispatch(createRoomType({ body: formData, filters }));
            }
            setModal(false);
            setFormData({ type: "" });
            setIconFile(null);
            setIconPreview(null);
            setErrors({});
        }
    };

    const handleCreateOpenModal = () => {
        setModal(true);
        setEdit(false);
        setTitle("Create Room Type");
        setFormData({ type: "" });
        setIconFile(null);
        setIconPreview(null);
        setErrors({});
    };

    const handleEdit = (id) => {
        setErrors({});
        setModal(true);
        setRoomTypeId(id);
        setEdit(true);
        setTitle("Update Room Type");
        setIconFile(null);
        const roomTypeToEdit = roomTypes.find(item => item.id === id);
        if (roomTypeToEdit) {
            setFormData({ type: roomTypeToEdit.type });
            setIconPreview(roomTypeToEdit.icon || null);
        }
    };

    const handleDeleteModal = (id) => {
        setDeleteId(id);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        dispatch(deleteRoomTypeData({ id: deleteId, filters }));
        setDeleteModal(false);
    };

    const handleViewDetails = (roomType) => {
        setSelectedRoomType(roomType);
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
        dispatch(getRoomTypes({
            limit: paginationState.limit,
            offset: paginationState.offset,
            keyword: paginationState.keyword
        }));
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-door-open"></i>
                    <h2>Room Type Management</h2>
                </div>
            </div>

            <div className='status-and-add-icon' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by room type..."
                    value={searchKeyword}
                    onChange={handleKeywordChange}
                    style={{ padding: '8px', width: '300px' }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span onClick={handleRefresh} style={{ cursor: 'pointer' }} data-tooltip-id="refresh-tooltip" data-tooltip-content="Refresh">
                        <i className="bx bx-refresh" style={{ fontSize: '35px', color: '#007bff', marginBottom: '8px' }}></i>
                    </span>

                    <span onClick={handleCreateOpenModal} style={{ cursor: 'pointer' }} data-tooltip-id="add-tooltip" data-tooltip-content="Add Room Type">
                        <i className="bx bxs-plus-circle" style={{ fontSize: '30px', color: '#28a745', marginBottom: "8px" }}></i>
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Icon</th>
                            <th>Room Type</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomTypes?.map((item, index) => (
                            <tr key={index}>
                                <td>{paginationState.offset + index + 1}</td>
                                <td>
                                    {item.icon
                                        ? <img src={item.icon} alt="icon" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} />
                                        : <span style={{ color: '#9ca3af', fontSize: '12px' }}>No icon</span>}
                                </td>
                                <td>{item.type}</td>
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
                totalItem={roomTypeTotalCount || 0}
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
                        <label>Room Type</label>
                        <input
                            type="text"
                            name='type'
                            value={formData.type}
                            onChange={handleFormChange}
                            className="form-control"
                        />
                        {errors.type && <span className="err-msg">{errors.type}</span>}
                    </div>

                    {edit && (
                        <div className="form-group">
                            <label>Icon (optional — replaces existing)</label>
                            <div
                                onClick={() => iconInputRef.current.click()}
                                style={{
                                    height: '100px', borderRadius: '8px', border: '2px dashed #d1d5db',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', overflow: 'hidden', background: '#f9fafb',
                                    backgroundImage: iconPreview ? `url(${iconPreview})` : 'none',
                                    backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                                }}
                            >
                                {!iconPreview && (
                                    <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                                        <i className="bx bx-upload" style={{ fontSize: '24px', display: 'block' }}></i>
                                        <span style={{ fontSize: '12px' }}>Click to upload icon</span>
                                    </div>
                                )}
                            </div>
                            <input ref={iconInputRef} type="file" accept="image/*" onChange={handleIconChange} style={{ display: 'none' }} />
                            {iconPreview && (
                                <button type="button" onClick={() => { setIconFile(null); setIconPreview(null); }}
                                    style={{ marginTop: '6px', padding: '4px 12px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '12px', cursor: 'pointer' }}>
                                    Remove Icon
                                </button>
                            )}
                        </div>
                    )}

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
                    <p>Are you sure you want to delete this room type?</p>
                    <div className="button-group-modal">
                        <button className="confirm-button" onClick={confirmDelete}>
                            {uploading ? "Deleting..." : "Delete"}
                        </button>
                        <button className="cancel-button" onClick={() => setDeleteModal(false)}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={detailsModal} onClose={() => setDetailsModal(false)} title="Room Type Details" width="500px">
                <div className="details-content">
                    {selectedRoomType && (
                        <>
                            <div className="detail-item">
                                <label>Room Type:</label>
                                <span>{selectedRoomType.type}</span>
                            </div>
                            <div className="detail-item">
                                <label>Created At:</label>
                                <span>{new Date(selectedRoomType.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="detail-item">
                                <label>Updated At:</label>
                                <span>{new Date(selectedRoomType.updatedAt).toLocaleString()}</span>
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

export default RoomType;
