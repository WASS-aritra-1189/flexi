import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserList } from '../../store/slice/accountSlice';
import { fetchAllBookings, editBooking, changeBookingStatus, recordBookingPayment } from '../../store/slice/bookingSlice';
import Modal from '../../Components/Modal/Modal';
import Pagination from '../../Components/Pagination/Pagination';
import './BookingManagement.scss';

const BOOKING_STATUSES = ['', 'WAITING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

const BookingManagement = () => {
  const dispatch = useDispatch();
  const { userList, userListCount } = useSelector((s) => s.account);
  const { bookingList, bookingListCount } = useSelector((s) => s.booking);
  const { uploading } = useSelector((s) => s.loader);

  // view: 'users' | 'bookings'
  const [view, setView] = useState('users');
  const [selectedUser, setSelectedUser] = useState(null);

  // users list state
  const [userSearch, setUserSearch] = useState('');
  const [userSearchInput, setUserSearchInput] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [userPagination, setUserPagination] = useState({ limit: 10, offset: 0, currentPage: 1 });

  // bookings list state
  const [statusFilter, setStatusFilter] = useState('');
  const [bookingPagination, setBookingPagination] = useState({ limit: 10, offset: 0, currentPage: 1 });

  // modals
  const [editModal, setEditModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newStatus, setNewStatus] = useState('');
  const [payAmount, setPayAmount] = useState('');

  const bookingFilters = { limit: bookingPagination.limit, offset: bookingPagination.offset, status: statusFilter };

  // debounce user search
  useEffect(() => {
    const t = setTimeout(() => setUserSearch(userSearchInput), 600);
    return () => clearTimeout(t);
  }, [userSearchInput]);

  useEffect(() => {
    dispatch(fetchUserList({ limit: userPagination.limit, offset: userPagination.offset, keyword: userSearch, status: userStatus }));
  }, [dispatch, userPagination.limit, userPagination.offset, userSearch, userStatus]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchAllBookings(selectedUser.id, bookingFilters));
    }
  }, [selectedUser, bookingPagination.limit, bookingPagination.offset, statusFilter]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setStatusFilter('');
    setBookingPagination({ limit: 10, offset: 0, currentPage: 1 });
    setView('bookings');
  };

  const handleBack = () => {
    setView('users');
    setSelectedUser(null);
  };

  // Edit modal
  const openEditModal = (b) => {
    setActiveBooking(b);
    setEditForm({
      quantity: b.quantity || '',
      checkIn: b.checkIn ? b.checkIn.slice(0, 16) : '',
      checkOut: b.checkOut ? b.checkOut.slice(0, 16) : '',
      hours: b.hours || '',
      name: b.name || '',
      email: b.email || '',
      phone: b.phone || '',
      address: b.address || '',
    });
    setEditModal(true);
  };

  const handleEditSubmit = () => {
    dispatch(editBooking(activeBooking.id, editForm, selectedUser.id, bookingFilters, () => setEditModal(false)));
  };

  // Status modal
  const openStatusModal = (b) => {
    setActiveBooking(b);
    setNewStatus(b.status);
    setStatusModal(true);
  };

  const handleStatusSubmit = () => {
    dispatch(changeBookingStatus(activeBooking.id, newStatus, selectedUser.id, bookingFilters, () => setStatusModal(false)));
  };

  // Payment modal
  const openPaymentModal = (b) => {
    setActiveBooking(b);
    setPayAmount('');
    setPaymentModal(true);
  };

  const handlePaymentSubmit = () => {
    if (!payAmount) return;
    dispatch(recordBookingPayment(activeBooking.id, payAmount, selectedUser.id, bookingFilters, () => setPaymentModal(false)));
  };

  // ── USERS VIEW ──────────────────────────────────────────────
  if (view === 'users') {
    return (
      <>
        <div className="logo-management-card">
          <div className="card-header">
            <i className="bx bxs-calendar-check"></i>
            <h2>Booking Management</h2>
          </div>
        </div>

        <div className="status-and-add-icon" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search by name, phone, email..."
            value={userSearchInput}
            onChange={(e) => { setUserSearchInput(e.target.value); setUserPagination((p) => ({ ...p, offset: 0, currentPage: 1 })); }}
            style={{ padding: '8px', width: '300px' }}
          />
          <select
            value={userStatus}
            onChange={(e) => { setUserStatus(e.target.value); setUserPagination((p) => ({ ...p, offset: 0, currentPage: 1 })); }}
            style={{ padding: '8px' }}
          >
            <option value="">All Status</option>
            {['PENDING', 'ACTIVE', 'DEACTIVE', 'DELETED'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
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
                <th>Status</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userList.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center' }}>No users found.</td></tr>
              ) : userList.map((user, i) => (
                <tr key={user.id}>
                  <td>{userPagination.offset + i + 1}</td>
                  <td>
                    {user.userDetail?.[0]?.image ? (
                      <img src={user.userDetail[0].image} alt="Profile" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bx bx-user" style={{ fontSize: '20px', color: '#666' }}></i>
                      </div>
                    )}
                  </td>
                  <td>{user.userDetail?.[0]?.name || '-'}</td>
                  <td>{user.phoneNumber}</td>
                  <td>{user.userDetail?.[0]?.email || '-'}</td>
                  <td><span className={`status-badge status-${user.status?.toLowerCase()}`}>{user.status}</span></td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="table-action-button">
                      <div className="action-icon" onClick={() => handleSelectUser(user)} title="View Bookings">
                        <i className="bx bxs-calendar-check text-olive"></i>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={userPagination.currentPage}
          totalItem={userListCount || 0}
          itemsPerPage={userPagination.limit}
          limitSelect={true}
          showEllipsisAfter={true}
          visiblePageCount={3}
          onPageChange={(page) => setUserPagination((p) => ({ ...p, currentPage: page, offset: p.limit * (page - 1) }))}
          onItemsLimitChange={(limit) => setUserPagination((p) => ({ ...p, limit, offset: 0, currentPage: 1 }))}
        />
      </>
    );
  }

  // ── BOOKINGS VIEW ────────────────────────────────────────────
  return (
    <>
      <div className="logo-management-card">
        <div className="card-header vendor-details-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="bx bxs-calendar-check"></i>
            <h2 style={{ margin: 0 }}>
              Bookings — {selectedUser?.userDetail?.[0]?.name || selectedUser?.phoneNumber}
            </h2>
          </div>
          <button onClick={handleBack} className="back-button">
            <i className="bx bx-arrow-back"></i> Back
          </button>
        </div>
      </div>

      <div className="bm-filters">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setBookingPagination((p) => ({ ...p, offset: 0, currentPage: 1 })); }}
        >
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>{s === '' ? 'All Status' : s}</option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="membership-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Booking ID</th>
              <th>Property</th>
              <th>Location</th>
              <th>Guest</th>
              <th>Qty</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Hrs</th>
              <th>Pay Status</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookingList.length === 0 ? (
              <tr><td colSpan={14} style={{ textAlign: 'center' }}>No bookings found.</td></tr>
            ) : bookingList.map((b, i) => (
              <tr key={b.id}>
                <td>{bookingPagination.offset + i + 1}</td>
                <td><span className="booking-id-badge">{b.bookingId}</span></td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {b.property?.propertyImage?.[0]?.image && (
                      <img src={b.property.propertyImage[0].image} alt="property" style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                    )}
                    {b.property?.name || '-'}
                  </div>
                </td>
                <td>{b.property ? `${b.property.city}, ${b.property.state}` : '-'}</td>
                <td>
                  <div>{b.name || '-'}</div>
                  {b.phone && <div style={{ fontSize: '11px', color: '#6b7280' }}>{b.phone}</div>}
                </td>
                <td>{b.quantity}</td>
                <td>{b.checkIn ? new Date(b.checkIn).toLocaleString() : '-'}</td>
                <td>{b.checkOut ? new Date(b.checkOut).toLocaleString() : '-'}</td>
                <td>{b.hours ?? '-'}</td>
                <td><span className={`status-badge status-${b.payStatus?.toLowerCase()}`}>{b.payStatus}</span></td>
                <td>{b.paidAmount != null ? `₹${b.paidAmount}` : '-'}</td>
                <td>{b.dueAmount != null ? `₹${b.dueAmount}` : '-'}</td>
                <td><span className={`status-badge status-${b.status?.toLowerCase()}`}>{b.status}</span></td>
                <td>
                  <div className="table-action-button">
                    <div className="action-icon" onClick={() => openEditModal(b)} title="Edit Booking">
                      <i className="bx bx-edit text-olive"></i>
                    </div>
                    <div className="action-icon" onClick={() => openStatusModal(b)} title="Update Status">
                      <i className="bx bx-cog text-warning"></i>
                    </div>
                    <div className="action-icon" onClick={() => openPaymentModal(b)} title="Record Payment">
                      <i className="bx bx-dollar-circle" style={{ color: '#059669' }}></i>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={bookingPagination.currentPage}
        totalItem={bookingListCount || 0}
        itemsPerPage={bookingPagination.limit}
        limitSelect={true}
        showEllipsisAfter={true}
        visiblePageCount={3}
        onPageChange={(page) => setBookingPagination((p) => ({ ...p, currentPage: page, offset: p.limit * (page - 1) }))}
        onItemsLimitChange={(limit) => setBookingPagination((p) => ({ ...p, limit, offset: 0, currentPage: 1 }))}
      />

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Booking" width="560px">
        <div className="bm-form-grid">
          {[
            { label: 'Name', key: 'name', type: 'text' },
            { label: 'Phone', key: 'phone', type: 'text' },
            { label: 'Email', key: 'email', type: 'email' },
            { label: 'Quantity', key: 'quantity', type: 'number' },
            { label: 'Hours', key: 'hours', type: 'number' },
            { label: 'Check In', key: 'checkIn', type: 'datetime-local' },
            { label: 'Check Out', key: 'checkOut', type: 'datetime-local' },
          ].map(({ label, key, type }) => (
            <div key={key} className="bm-form-group">
              <label>{label}</label>
              <input type={type} value={editForm[key] || ''} onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="bm-form-group bm-full-width">
            <label>Address</label>
            <input type="text" value={editForm.address || ''} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} />
          </div>
        </div>
        <div className="button-group-modal">
          <button className="confirm-button" onClick={handleEditSubmit} disabled={uploading}>{uploading ? 'Saving...' : 'Save'}</button>
          <button className="cancel-button" onClick={() => setEditModal(false)}>Cancel</button>
        </div>
      </Modal>

      {/* Status Modal */}
      <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title="Update Booking Status" width="420px">
        <div className="status-container-horizontal">
          {BOOKING_STATUSES.filter(Boolean).map((s) => (
            <div key={s} className={`status-option status-${s.toLowerCase()}`}>
              <input id={`bs-${s}`} type="radio" name="bookingStatus" value={s} checked={newStatus === s} onChange={(e) => setNewStatus(e.target.value)} />
              <label htmlFor={`bs-${s}`}>{s}</label>
            </div>
          ))}
        </div>
        <div className="button-group-modal">
          <button className="confirm-button" onClick={handleStatusSubmit} disabled={uploading}>{uploading ? 'Saving...' : 'Confirm'}</button>
          <button className="cancel-button" onClick={() => setStatusModal(false)}>Cancel</button>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={paymentModal} onClose={() => setPaymentModal(false)} title="Record Payment" width="380px">
        <div className="bm-form-group">
          <label>Amount (₹)</label>
          <input type="number" placeholder="Enter amount" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div className="button-group-modal" style={{ marginTop: '16px' }}>
          <button className="confirm-button" onClick={handlePaymentSubmit} disabled={uploading || !payAmount}>{uploading ? 'Saving...' : 'Record Payment'}</button>
          <button className="cancel-button" onClick={() => setPaymentModal(false)}>Cancel</button>
        </div>
      </Modal>
    </>
  );
};

export default BookingManagement;
