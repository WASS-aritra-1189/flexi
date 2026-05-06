import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchVendorList, changeVendorStatus } from "../../store/slice/accountSlice";
import Modal from "../../Components/Modal/Modal";
import Pagination from "../../Components/Pagination/Pagination";
import { Tooltip } from 'react-tooltip';

const AccountVendor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vendorList, vendorListCount } = useSelector((state) => state.account);
  // console.log("vendorList", vendorList);
  const { uploading } = useSelector((state) => state.loader);

  const [paginationState, setPaginationState] = useState({
    limit: 10,
    offset: 0,
    currentPage: 1,
    keyword: ""
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [statusModal, setStatusModal] = useState(false);
  const [stateStatus, setStateStatus] = useState("");
  const [statusVendorId, setStatusVendorId] = useState(null);
  const filters = {
    limit: 50,
    offset: 0,
    keyword: searchKeyword,
    status
  };

  const statusList = ["PENDING", "ACTIVE", "DEACTIVE", "DELETED"]

  useEffect(() => {
    dispatch(fetchVendorList({
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

  const handleStatusModal = (id, currentStatus) => {
    setStatusVendorId(id);
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
    dispatch(changeVendorStatus(
      { accountId: statusVendorId, status: stateStatus },
      filters
    ));
    closeStatusModal();
  };

  const handleViewDetails = (vendor) => {
    navigate(`/vendors/${vendor.id}`, { state: { vendor } });
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
    dispatch(fetchVendorList({
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
          <i className="bx bx-store"></i>
          <h2>Vendor Management</h2>
        </div>
      </div>

      <div className='status-and-add-icon' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name, phone, email..."
          value={searchKeyword}
          onChange={handleKeywordChange}
          style={{ padding: '8px', width: '300px' }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span onClick={handleRefresh} style={{ cursor: 'pointer' }} data-tooltip-id="refresh-tooltip" data-tooltip-content="Refresh">
            <i className="bx bx-refresh" style={{ fontSize: '35px', color: '#007bff', marginBottom: '8px' }}></i>
          </span>

          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '8px' }}>
            <option value="">All</option>
            {statusList.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="membership-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Profile</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Business Name</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendorList?.map((vendor, index) => (
              <tr key={vendor.id}>
                <td>{paginationState.offset + index + 1}</td>
                <td>
                  {vendor.vendorDetail?.[0]?.profile ? (
                    <img
                      src={vendor.vendorDetail[0].profile}
                      alt="Profile"
                      style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className="bx bx-user" style={{ fontSize: "20px", color: "#666" }}></i>
                    </div>
                  )}
                </td>
                <td>{vendor.vendorDetail?.[0]?.name || "-"}</td>
                <td>{vendor.phoneNumber}</td>
                <td>{vendor.vendorDetail?.[0]?.email || "-"}</td>
                <td>{vendor.vendorDetail?.[0]?.businessName || "-"}</td>
                <td>
                  <span className={`status-badge status-${vendor.status?.toLowerCase()}`}>
                    {vendor.status}
                  </span>
                </td>
                <td>{new Date(vendor.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="table-action-button">
                    <div className="action-icon" onClick={() => handleViewDetails(vendor)} data-tooltip-id="view-tooltip" data-tooltip-content="View Details">
                      <i className="bx bx-info-circle text-olive"></i>
                    </div>
                    <div className="action-icon" onClick={() => handleStatusModal(vendor.id, vendor.status)} data-tooltip-id="status-tooltip" data-tooltip-content="Change Status">
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
        totalItem={vendorListCount || 0}
        limitSelect={true}
        itemsPerPage={paginationState.limit}
        showEllipsisAfter={true}
        visiblePageCount={3}
        onPageChange={pageChange}
        onItemsLimitChange={itemsLimitChange}
      />

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
          <button className="confirm-button" onClick={changeSaveStatus}>
            {uploading ? "Saving..." : "Confirm"}
          </button>
          <button className="cancel-button" onClick={closeStatusModal}>Cancel</button>
        </div>
      </Modal>

      <Tooltip id="refresh-tooltip" />
      <Tooltip id="view-tooltip" />
      <Tooltip id="status-tooltip" />
    </>
  );
};

export default AccountVendor;