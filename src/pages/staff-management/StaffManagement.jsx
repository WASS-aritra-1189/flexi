import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStaffList,
  createStaff,
  editStaff,
  changeStaffPassword,
  changeStaffStatus,
  removeStaff,
} from "../../store/slice/staffSlice";
import Modal from "../../Components/Modal/Modal";
import Pagination from "../../Components/Pagination/Pagination";
import { Tooltip } from "react-tooltip";

const STAFF_ROLES = ["MANAGER", "STAFF", "SUPERVISOR"];
const STATUS_LIST = ["PENDING", "ACTIVE", "DEACTIVE", "DELETED"];

const defaultForm = { name: "", email: "", mobile: "", staffRole: "STAFF" };

const StaffManagement = () => {
  const dispatch = useDispatch();
  const { staffList, staffListCount } = useSelector((state) => state.staff);
  const { uploading } = useSelector((state) => state.loader);

  const [pagination, setPagination] = useState({ limit: 10, offset: 0, currentPage: 1, keyword: "" });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [form, setForm] = useState(defaultForm);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [password, setPassword] = useState("");

  const filters = { limit: pagination.limit, offset: pagination.offset, keyword: pagination.keyword, status: statusFilter };

  useEffect(() => {
    dispatch(fetchStaffList(filters));
  }, [dispatch, pagination.limit, pagination.offset, pagination.keyword, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination((prev) => ({ ...prev, keyword: searchKeyword, offset: 0, currentPage: 1 }));
    }, 700);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const handleAdd = () => {
    dispatch(createStaff({ mobile: form.mobile, name: form.name, email: form.email, staffRole: form.staffRole }, filters));
    setAddModal(false);
    setForm(defaultForm);
  };

  const handleEdit = () => {
    dispatch(editStaff(selectedId, { name: form.name, email: form.email, staffRole: form.staffRole }, filters));
    setEditModal(false);
  };

  const handlePasswordUpdate = () => {
    dispatch(changeStaffPassword(selectedId, { password }, () => { setPasswordModal(false); setPassword(""); }));
  };

  const handleStatusUpdate = () => {
    dispatch(changeStaffStatus(selectedId, { status: selectedStatus }, filters));
    setStatusModal(false);
  };

  const handleDelete = () => {
    dispatch(removeStaff(selectedId, filters));
    setDeleteModal(false);
  };

  const openEdit = (staff) => {
    setSelectedId(staff.id);
    setForm({
      name: staff.staffDetail?.[0]?.name || "",
      email: staff.staffDetail?.[0]?.email || "",
      mobile: staff.phoneNumber || "",
      staffRole: staff.staffDetail?.[0]?.staffRole || "STAFF",
    });
    setEditModal(true);
  };

  const openStatus = (staff) => {
    setSelectedId(staff.id);
    setSelectedStatus(staff.status);
    setStatusModal(true);
  };

  const openPassword = (id) => { setSelectedId(id); setPasswordModal(true); };
  const openDelete = (id) => { setSelectedId(id); setDeleteModal(true); };

  const pageChange = (page) => setPagination((prev) => ({ ...prev, currentPage: page, offset: prev.limit * (page - 1) }));
  const itemsLimitChange = (limit) => setPagination((prev) => ({ ...prev, limit, offset: 0, currentPage: 1 }));

  return (
    <>
      <div className="logo-management-card">
        <div className="card-header">
          <i className="bx bx-user-pin"></i>
          <h2>Staff Management</h2>
        </div>
      </div>

      <div className="status-and-add-icon" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name, phone, email..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span onClick={() => dispatch(fetchStaffList(filters))} style={{ cursor: "pointer" }} data-tooltip-id="refresh-tooltip" data-tooltip-content="Refresh">
            <i className="bx bx-refresh" style={{ fontSize: "35px", color: "#007bff", marginBottom: "8px" }}></i>
          </span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "8px" }}>
            <option value="">All</option>
            {STATUS_LIST.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="confirm-button" onClick={() => { setForm(defaultForm); setAddModal(true); }}>
            <i className="bx bx-plus"></i> Add Staff
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="membership-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList?.map((staff, index) => (
              <tr key={staff.id}>
                <td>{pagination.offset + index + 1}</td>
                <td>{staff.staffDetail?.[0]?.name || "-"}</td>
                <td>{staff.phoneNumber || "-"}</td>
                <td>{staff.staffDetail?.[0]?.email || "-"}</td>
                <td>{staff.staffDetail?.[0]?.staffRole || "-"}</td>
                <td>
                  <span className={`status-badge status-${staff.status?.toLowerCase()}`}>{staff.status}</span>
                </td>
                <td>{new Date(staff.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="table-action-button">
                    <div className="action-icon" onClick={() => openEdit(staff)} data-tooltip-id="edit-tooltip" data-tooltip-content="Edit">
                      <i className="bx bx-edit text-primary"></i>
                    </div>
                    <div className="action-icon" onClick={() => openPassword(staff.id)} data-tooltip-id="password-tooltip" data-tooltip-content="Change Password">
                      <i className="bx bx-lock text-warning"></i>
                    </div>
                    <div className="action-icon" onClick={() => openStatus(staff)} data-tooltip-id="status-tooltip" data-tooltip-content="Change Status">
                      <i className="bx bx-cog text-success"></i>
                    </div>
                    <div className="action-icon" onClick={() => openDelete(staff.id)} data-tooltip-id="delete-tooltip" data-tooltip-content="Delete">
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
        currentPage={pagination.currentPage}
        totalItem={staffListCount || 0}
        limitSelect={true}
        itemsPerPage={pagination.limit}
        showEllipsisAfter={true}
        visiblePageCount={3}
        onPageChange={pageChange}
        onItemsLimitChange={itemsLimitChange}
      />

      {/* Add Modal */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="Add Staff" width="500px">
        <StaffForm form={form} setForm={setForm} showMobile />
        <div className="button-group-modal">
          <button className="confirm-button" onClick={handleAdd} disabled={uploading}>{uploading ? "Saving..." : "Add"}</button>
          <button className="cancel-button" onClick={() => setAddModal(false)}>Cancel</button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Staff" width="500px">
        <StaffForm form={form} setForm={setForm} />
        <div className="button-group-modal">
          <button className="confirm-button" onClick={handleEdit} disabled={uploading}>{uploading ? "Saving..." : "Update"}</button>
          <button className="cancel-button" onClick={() => setEditModal(false)}>Cancel</button>
        </div>
      </Modal>

      {/* Password Modal */}
      <Modal isOpen={passwordModal} onClose={() => setPasswordModal(false)} title="Change Password" width="400px">
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "6px" }}>New Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "8px" }} />
        </div>
        <div className="button-group-modal">
          <button className="confirm-button" onClick={handlePasswordUpdate} disabled={uploading}>{uploading ? "Saving..." : "Update"}</button>
          <button className="cancel-button" onClick={() => setPasswordModal(false)}>Cancel</button>
        </div>
      </Modal>

      {/* Status Modal */}
      <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title="Change Status" width="500px">
        <div className="status-container-horizontal">
          {STATUS_LIST.map((s) => (
            <div key={s} className={`status-option status-${s.toLowerCase()}`}>
              <input id={`status-${s}`} type="radio" name="staffStatus" checked={selectedStatus === s} onChange={() => setSelectedStatus(s)} value={s} />
              <label htmlFor={`status-${s}`}>{s}</label>
            </div>
          ))}
        </div>
        <div className="button-group-modal">
          <button className="confirm-button" onClick={handleStatusUpdate} disabled={uploading}>{uploading ? "Saving..." : "Confirm"}</button>
          <button className="cancel-button" onClick={() => setStatusModal(false)}>Cancel</button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Staff" width="400px">
        <p>Are you sure you want to delete this staff member?</p>
        <div className="button-group-modal">
          <button className="confirm-button" onClick={handleDelete} disabled={uploading}>{uploading ? "Deleting..." : "Delete"}</button>
          <button className="cancel-button" onClick={() => setDeleteModal(false)}>Cancel</button>
        </div>
      </Modal>

      <Tooltip id="refresh-tooltip" />
      <Tooltip id="edit-tooltip" />
      <Tooltip id="password-tooltip" />
      <Tooltip id="status-tooltip" />
      <Tooltip id="delete-tooltip" />
    </>
  );
};

const StaffForm = ({ form, setForm, showMobile = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
    {showMobile && (
      <div>
        <label style={{ display: "block", marginBottom: "6px" }}>Mobile *</label>
        <input value={form.mobile} onChange={(e) => setForm((p) => ({ ...p, mobile: e.target.value }))} style={{ width: "100%", padding: "8px" }} placeholder="Mobile number" />
      </div>
    )}
    <div>
      <label style={{ display: "block", marginBottom: "6px" }}>Name *</label>
      <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} style={{ width: "100%", padding: "8px" }} placeholder="Full name" />
    </div>
    <div>
      <label style={{ display: "block", marginBottom: "6px" }}>Email</label>
      <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} style={{ width: "100%", padding: "8px" }} placeholder="Email address" />
    </div>
    <div>
      <label style={{ display: "block", marginBottom: "6px" }}>Staff Role *</label>
      <select value={form.staffRole} onChange={(e) => setForm((p) => ({ ...p, staffRole: e.target.value }))} style={{ width: "100%", padding: "8px" }}>
        {STAFF_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>
    </div>
  </div>
);

export default StaffManagement;
