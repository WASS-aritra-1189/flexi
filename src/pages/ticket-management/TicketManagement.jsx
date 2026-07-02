import { useEffect, useState } from 'react';
import { services } from '../../shared/_services/api_services';
import { errorHandler, successHandler } from '../../shared/_helper/response_helper';
import Modal from '../../Components/Modal/Modal';
import Pagination from '../../Components/Pagination/Pagination';
import { Tooltip } from 'react-tooltip';

const STATUSES = ['', 'OPEN', 'IN PROGRESS', 'RESOLVED', 'CLOSED'];

const PRIORITY_CLASS = { Low: 'status-active', Medium: 'status-pending', High: 'status-cancelled' };
const STATUS_CLASS = {
  'OPEN': 'status-waiting',
  'IN PROGRESS': 'status-pending',
  'RESOLVED': 'status-active',
  'CLOSED': 'status-deactive',
};

const TicketManagement = () => {
  const [data, setData] = useState({ result: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ limit: 10, offset: 0, currentPage: 1 });

  const [viewModal, setViewModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      setKeyword(keywordInput);
      setPagination((p) => ({ ...p, offset: 0, currentPage: 1 }));
    }, 600);
    return () => clearTimeout(t);
  }, [keywordInput]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await services.getTicket({ limit: pagination.limit, offset: pagination.offset, keyword, status: statusFilter });
      setData(res.data);
    } catch (e) {
      errorHandler(e.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [pagination.limit, pagination.offset, keyword, statusFilter]);

  const openViewModal = (ticket) => {
    setSelected(ticket);
    setViewModal(true);
  };

  const openStatusModal = (ticket) => {
    setSelected(ticket);
    setNewStatus(ticket.status);
    setStatusModal(true);
  };

  const handleStatusSubmit = async () => {
    setSaving(true);
    try {
      await services.updateTicketStatus(selected.id, { status: newStatus });
      successHandler('Ticket status updated!');
      setStatusModal(false);
      fetchTickets();
    } catch (e) {
      errorHandler(e.response);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="logo-management-card">
        <div className="card-header">
          <i className="bx bx-support"></i>
          <h2>Ticket Management</h2>
        </div>
      </div>

      <div className="status-and-add-icon" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by title, category..."
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPagination((p) => ({ ...p, offset: 0, currentPage: 1 })); }}
          style={{ padding: '8px' }}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s === '' ? 'All Status' : s}</option>)}
        </select>
      </div>

      <div className="table-container">
        <table className="membership-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ticket ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Attachment</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : data.result.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center' }}>No tickets found.</td></tr>
            ) : data.result.map((t, i) => (
              <tr key={t.id}>
                <td>{pagination.offset + i + 1}</td>
                <td><span className="booking-id-badge">{t.ticketId}</span></td>
                <td style={{ maxWidth: '200px' }}>{t.title}</td>
                <td>{t.category}</td>
                <td><span className={`status-badge ${PRIORITY_CLASS[t.priority] || ''}`}>{t.priority}</span></td>
                <td>
                  {t.attachment
                    ? <a href={t.attachment} target="_blank" rel="noopener noreferrer"><i className="bx bx-image-alt" style={{ fontSize: '20px', color: '#2563eb' }}></i></a>
                    : <span style={{ color: '#9ca3af', fontSize: '12px' }}>None</span>
                  }
                </td>
                <td><span className={`status-badge ${STATUS_CLASS[t.status] || ''}`}>{t.status}</span></td>
                <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="table-action-button">
                    <div className="action-icon" onClick={() => openViewModal(t)} data-tooltip-id="view-tt" data-tooltip-content="View Details">
                      <i className="bx bx-info-circle text-olive"></i>
                    </div>
                    <div className="action-icon" onClick={() => openStatusModal(t)} data-tooltip-id="status-tt" data-tooltip-content="Update Status">
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
        currentPage={pagination.currentPage}
        totalItem={data.total || 0}
        itemsPerPage={pagination.limit}
        limitSelect={true}
        showEllipsisAfter={true}
        visiblePageCount={3}
        onPageChange={(page) => setPagination((p) => ({ ...p, currentPage: page, offset: p.limit * (page - 1) }))}
        onItemsLimitChange={(limit) => setPagination((p) => ({ ...p, limit, offset: 0, currentPage: 1 }))}
      />

      {/* View Details Modal */}
      <Modal isOpen={viewModal} onClose={() => setViewModal(false)} title="Ticket Details" width="580px">
        {selected && (
          <div className="details-content">
            <div className="detail-item"><label>Ticket ID:</label><span>{selected.ticketId}</span></div>
            <div className="detail-item"><label>Title:</label><span>{selected.title}</span></div>
            <div className="detail-item"><label>Category:</label><span>{selected.category}</span></div>
            <div className="detail-item">
              <label>Priority:</label>
              <span className={`status-badge ${PRIORITY_CLASS[selected.priority] || ''}`}>{selected.priority}</span>
            </div>
            <div className="detail-item">
              <label>Status:</label>
              <span className={`status-badge ${STATUS_CLASS[selected.status] || ''}`}>{selected.status}</span>
            </div>
            <div className="detail-item"><label>Created At:</label><span>{new Date(selected.createdAt).toLocaleString()}</span></div>
            <div className="detail-item contact-message-full"><label>Description:</label><span>{selected.desc}</span></div>
            {selected.attachment && (
              <div className="detail-item">
                <label>Attachment:</label>
                <a href={selected.attachment} target="_blank" rel="noopener noreferrer">View Attachment</a>
              </div>
            )}
          </div>
        )}
        <div className="button-group-modal">
          <button className="confirm-button" onClick={() => { setViewModal(false); openStatusModal(selected); }}>
            <i className="bx bx-cog" style={{ marginRight: '6px' }}></i>Update Status
          </button>
          <button className="cancel-button" onClick={() => setViewModal(false)}>Close</button>
        </div>
      </Modal>

      {/* Status Modal */}
      <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title="Update Ticket Status" width="420px">
        <div className="status-container-horizontal">
          {STATUSES.filter(Boolean).map((s) => (
            <div key={s} className={`status-option status-${s.toLowerCase().replace(' ', '-')}`}>
              <input
                id={`ts-${s}`}
                type="radio"
                name="ticketStatus"
                value={s}
                checked={newStatus === s}
                onChange={(e) => setNewStatus(e.target.value)}
              />
              <label htmlFor={`ts-${s}`}>{s}</label>
            </div>
          ))}
        </div>
        <div className="button-group-modal">
          <button className="confirm-button" onClick={handleStatusSubmit} disabled={saving}>
            {saving ? 'Saving...' : 'Confirm'}
          </button>
          <button className="cancel-button" onClick={() => setStatusModal(false)}>Cancel</button>
        </div>
      </Modal>

      <Tooltip id="view-tt" />
      <Tooltip id="status-tt" />
    </>
  );
};

export default TicketManagement;
