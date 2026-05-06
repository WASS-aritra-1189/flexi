import { useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    getCities,
    createCity,
    updateCityData,
    updateCityStatus
} from '../../store/slice/citySlice';
import { getStates } from '../../store/slice/stateSlice';
import Modal from '../../Components/Modal/Modal';
import Pagination from '../../Components/Pagination/Pagination';
import { Tooltip } from 'react-tooltip';

const City = () => {
    const dispatch = useDispatch();
    const { cities, totalCount } = useSelector((state) => state.city);
    const { states } = useSelector((state) => state.state);
    const { uploading } = useSelector((state) => state.loader);

    const [paginationState, setPaginationState] = useState({
        limit: 10,
        offset: 0,
        currentPage: 1,
        keyword: ""
    });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", stateId: "" });
    const [edit, setEdit] = useState(false);
    const [cityId, setCityId] = useState(null);
    const [title, setTitle] = useState("Create City");
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("ACTIVE");
    const [stateFilter, setStateFilter] = useState(states[0]?.id);
    const [statusModal, setStatusModal] = useState(false);
    const [cityStatus, setCityStatus] = useState("");
    const [statusCityId, setStatusCityId] = useState(null);
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);
    const filters = { limit: 50, offset: 0, keyword: searchKeyword, status, stateId: stateFilter || "" };

    useEffect(() => {
        dispatch(getStates({ limit: 50, offset: 0, keyword: "", status: "ACTIVE" }));
    }, [dispatch]);

    useEffect(() => {
        if (states && states.length > 0 && !stateFilter) {
            setStateFilter(states[0].id);
        }
    }, [states]);

    useEffect(() => {
        dispatch(getCities({
            limit: paginationState.limit,
            offset: paginationState.offset,
            keyword: paginationState.keyword,
            status: status,
            stateId: stateFilter || ""
        }));
    }, [dispatch, paginationState.limit, paginationState.offset, paginationState.keyword, status, stateFilter]);

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
            newErrors.name = "* City Name is required";
        }
        if (!edit && !formData.stateId) {
            newErrors.stateId = "* State is required";
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
                dispatch(updateCityData({ id: cityId, filters, body: { name: formData.name } }));
            } else {
                dispatch(createCity({ body: formData, filters }));
            }
            setModal(false);
            setFormData({ name: "", stateId: "" });
            setErrors({});
        }
    };

    const handleCreateOpenModal = () => {
        setModal(true);
        setEdit(false);
        setTitle("Create City");
        setFormData({ name: "", stateId: states && states.length > 0 ? states[0].id : "" });
        setErrors({});
    };

    const handleEdit = (id) => {
        setErrors({});
        setModal(true);
        setCityId(id);
        setEdit(true);
        setTitle("Update City");
        const cityToEdit = cities.find(item => item.id === id);
        if (cityToEdit) {
            setFormData({ name: cityToEdit.name, stateId: cityToEdit.stateId });
        }
    };

    const handleStatusModal = (id, currentStatus) => {
        setStatusCityId(id);
        setCityStatus(currentStatus);
        setStatusModal(true);
    };

    const closeStatusModal = () => {
        setStatusModal(false);
    };

    const onValueChange = (e) => {
        setCityStatus(e.target.value);
    };

    const changeSaveStatus = () => {
        dispatch(updateCityStatus({ id: statusCityId, filters, body: { status: cityStatus } }));
        closeStatusModal();
    };

    const handleViewDetails = (city) => {
        setSelectedCity(city);
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
        dispatch(getCities({
            limit: paginationState.limit,
            offset: paginationState.offset,
            keyword: paginationState.keyword,
            status: status,
            stateId: stateFilter || ""
        }));
    };

    const getStateName = (stateId) => {
        const state = states.find(s => s.id === stateId);
        return state ? state.name : "-";
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-buildings"></i>
                    <h2>City Management</h2>
                </div>
            </div>

            <div className='status-and-add-icon' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by city name..."
                    value={searchKeyword}
                    onChange={handleKeywordChange}
                    style={{ padding: '8px', width: '300px' }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <span onClick={handleRefresh} style={{ cursor: 'pointer' }} data-tooltip-id="refresh-tooltip" data-tooltip-content="Refresh">
                        <i className="bx bx-refresh" style={{ fontSize: '35px', color: '#007bff', marginBottom: '8px' }}></i>
                    </span>

                    <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} style={{ padding: '8px' }}>
                        <option value="">All States</option>
                        {states?.map(state => (
                            <option key={state.id} value={state.id}>{state.name}</option>
                        ))}
                    </select>

                    <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '8px' }}>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DEACTIVE">DEACTIVE</option>
                        <option value="DELETED">DELETED</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                        <option value="PENDING">PENDING</option>
                    </select>

                    <span onClick={handleCreateOpenModal} style={{ cursor: 'pointer' }} data-tooltip-id="add-tooltip" data-tooltip-content="Add City">
                        <i className="bx bxs-plus-circle" style={{ fontSize: '30px', color: '#28a745', marginBottom: "8px" }}></i>
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>City Name</th>
                            <th>State</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cities?.map((item, index) => (
                            <tr key={index}>
                                <td>{paginationState.offset + index + 1}</td>
                                <td>{item.name}</td>
                                <td>{getStateName(item.stateId)}</td>
                                <td>
                                    <span className={`status-badge status-${item.status?.toLowerCase()}`}>
                                        {item.status}
                                    </span>
                                </td>
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

                    {!edit && (
                        <div className="form-group">
                            <label>State</label>
                            <select
                                name='stateId'
                                value={formData.stateId}
                                onChange={handleFormChange}
                                className="form-control"
                            >
                                <option value="">Select State</option>
                                {states?.map(state => (
                                    <option key={state.id} value={state.id}>{state.name}</option>
                                ))}
                            </select>
                            {errors.stateId && <span className="err-msg">{errors.stateId}</span>}
                        </div>
                    )}

                    <div className="form-group">
                        <label>City Name</label>
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
                        <input id='active' type='radio' name='status' checked={cityStatus === 'ACTIVE'} onChange={onValueChange} value='ACTIVE' />
                        <label htmlFor='active'>ACTIVE</label>
                    </div>
                    <div className='status-option status-deactive'>
                        <input id='deactive' type='radio' name='status' checked={cityStatus === 'DEACTIVE'} onChange={onValueChange} value='DEACTIVE' />
                        <label htmlFor='deactive'>DEACTIVE</label>
                    </div>
                    <div className='status-option status-deleted'>
                        <input id='deleted' type='radio' name='status' checked={cityStatus === 'DELETED'} onChange={onValueChange} value='DELETED' />
                        <label htmlFor='deleted'>DELETED</label>
                    </div>
                    <div className='status-option status-suspended'>
                        <input id='suspended' type='radio' name='status' checked={cityStatus === 'SUSPENDED'} onChange={onValueChange} value='SUSPENDED' />
                        <label htmlFor='suspended'>SUSPENDED</label>
                    </div>
                    <div className='status-option status-pending'>
                        <input id='pending' type='radio' name='status' checked={cityStatus === 'PENDING'} onChange={onValueChange} value='PENDING' />
                        <label htmlFor='pending'>PENDING</label>
                    </div>
                </div>
                <div className="button-group-modal">
                    <button className="confirm-button" onClick={changeSaveStatus}>Confirm</button>
                    <button className="cancel-button" onClick={closeStatusModal}>Cancel</button>
                </div>
            </Modal>

            <Modal isOpen={detailsModal} onClose={() => setDetailsModal(false)} title="City Details" width="500px">
                <div className="details-content">
                    {selectedCity && (
                        <>
                            <div className="detail-item">
                                <label>City Name:</label>
                                <span>{selectedCity.name}</span>
                            </div>
                            <div className="detail-item">
                                <label>State:</label>
                                <span>{getStateName(selectedCity.stateId)}</span>
                            </div>
                            <div className="detail-item">
                                <label>Status:</label>
                                <span className={`status-badge status-${selectedCity.status?.toLowerCase()}`}>
                                    {selectedCity.status}
                                </span>
                            </div>
                            <div className="detail-item">
                                <label>Created At:</label>
                                <span>{new Date(selectedCity.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="detail-item">
                                <label>Updated At:</label>
                                <span>{new Date(selectedCity.updatedAt).toLocaleString()}</span>
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

export default City;
