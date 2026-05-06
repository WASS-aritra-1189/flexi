import { useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    getStates,
    createState,
    updateStateData,
    updateStateStatus
} from '../../store/slice/stateSlice';
import Modal from '../../Components/Modal/Modal';
import Pagination from '../../Components/Pagination/Pagination';
import { Tooltip } from 'react-tooltip';

const State = () => {
    const dispatch = useDispatch();
    const { states, totalCount } = useSelector((state) => state.state);
    const { uploading } = useSelector((state) => state.loader);

    const [paginationState, setPaginationState] = useState({
        limit: 10,
        offset: 0,
        currentPage: 1,
        keyword: ""
    });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({ name: "" });
    const [edit, setEdit] = useState(false);
    const [stateId, setStateId] = useState(null);
    const [title, setTitle] = useState("Create State");
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("ACTIVE");
    const [statusModal, setStatusModal] = useState(false);
    const [stateStatus, setStateStatus] = useState("");
    const [statusStateId, setStatusStateId] = useState(null);
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedState, setSelectedState] = useState(null);
    const filters = { limit: 50, offset: 0, keyword: searchKeyword, status };

    useEffect(() => {
        dispatch(getStates({
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
        if (!formData.name) {
            newErrors.name = "* State Name is required";
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
                dispatch(updateStateData({ id: stateId, filters, body: formData }));
            } else {
                dispatch(createState({ body: formData, filters }));
            }
            setModal(false);
            setFormData({ name: "" });
            setErrors({});
        }
    };

    const handleCreateOpenModal = () => {
        setModal(true);
        setEdit(false);
        setTitle("Create State");
        setFormData({ name: "" });
        setErrors({});
    };

    const handleEdit = (id) => {
        setErrors({});
        setModal(true);
        setStateId(id);
        setEdit(true);
        setTitle("Update State");
        const stateToEdit = states.find(item => item.id === id);
        if (stateToEdit) {
            setFormData({ name: stateToEdit.name });
        }
    };

    const handleStatusModal = (id, currentStatus) => {
        setStatusStateId(id);
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
        dispatch(updateStateStatus({ id: statusStateId, filters, body: { status: stateStatus } }));
        closeStatusModal();
    };

    const handleViewDetails = (state) => {
        setSelectedState(state);
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
        dispatch(getStates({
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
                    <i className="bx bx-map"></i>
                    <h2>State Management</h2>
                </div>
            </div>

            <div className='status-and-add-icon' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by state name..."
                    value={searchKeyword}
                    onChange={handleKeywordChange}
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

                    <span onClick={handleCreateOpenModal} style={{ cursor: 'pointer' }} data-tooltip-id="add-tooltip" data-tooltip-content="Add State">
                        <i className="bx bxs-plus-circle" style={{ fontSize: '30px', color: '#28a745', marginBottom: "8px" }}></i>
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>State Name</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {states?.map((item, index) => (
                            <tr key={index}>
                                <td>{paginationState.offset + index + 1}</td>
                                <td>{item.name}</td>
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

            <Modal isOpen={modal} onClose={() => setModal(false)} title={title} width="500px">
                <div className="edit-form">
                    <div className="form-group">
                        <label>State Name</label>
                        <input
                            type="text"
                            name='name'
                            value={formData.name}
                            onChange={handleFormChange}
                            className="form-control"
                        />
                        {errors.name && <span className="err-msg">{errors.name}</span>}
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
                <div className='status-container-horizontal'>
                    <div className='status-option status-active'>
                        <input id='active' type='radio' name='status' checked={stateStatus === 'ACTIVE'} onChange={onValueChange} value='ACTIVE' />
                        <label htmlFor='active'>ACTIVE</label>
                    </div>
                    <div className='status-option status-deactive'>
                        <input id='deactive' type='radio' name='status' checked={stateStatus === 'DEACTIVE'} onChange={onValueChange} value='DEACTIVE' />
                        <label htmlFor='deactive'>DEACTIVE</label>
                    </div>
                    <div className='status-option status-deleted'>
                        <input id='deleted' type='radio' name='status' checked={stateStatus === 'DELETED'} onChange={onValueChange} value='DELETED' />
                        <label htmlFor='deleted'>DELETED</label>
                    </div>
                    <div className='status-option status-suspended'>
                        <input id='suspended' type='radio' name='status' checked={stateStatus === 'SUSPENDED'} onChange={onValueChange} value='SUSPENDED' />
                        <label htmlFor='suspended'>SUSPENDED</label>
                    </div>
                    <div className='status-option status-pending'>
                        <input id='pending' type='radio' name='status' checked={stateStatus === 'PENDING'} onChange={onValueChange} value='PENDING' />
                        <label htmlFor='pending'>PENDING</label>
                    </div>
                </div>
                <div className="button-group-modal">
                    <button className="confirm-button" onClick={changeSaveStatus}>Confirm</button>
                    <button className="cancel-button" onClick={closeStatusModal}>Cancel</button>
                </div>
            </Modal>

            <Modal isOpen={detailsModal} onClose={() => setDetailsModal(false)} title="State Details" width="500px">
                <div className="details-content">
                    {selectedState && (
                        <>
                            <div className="detail-item">
                                <label>State Name:</label>
                                <span>{selectedState.name}</span>
                            </div>
                            <div className="detail-item">
                                <label>Status:</label>
                                <span className={`status-badge status-${selectedState.status?.toLowerCase()}`}>
                                    {selectedState.status}
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
            <Tooltip id="status-tooltip" />
        </>
    );
};

export default State;
