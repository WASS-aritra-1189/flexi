import { useState } from "react";
import Modal from '../../Components/Modal/Modal';
import Pagination from '../../Components/Pagination/Pagination';
import { Tooltip } from 'react-tooltip';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartTooltip, ResponsiveContainer,
    AreaChart, Area, Legend, PieChart, Pie, Cell
} from 'recharts';

const MONTHLY_EARNED = [
    { month: 'Jan', earned: 12400 },
    { month: 'Feb', earned: 18200 },
    { month: 'Mar', earned: 9800 },
    { month: 'Apr', earned: 24600 },
    { month: 'May', earned: 21000 },
    { month: 'Jun', earned: 31500 },
    { month: 'Jul', earned: 28700 },
    { month: 'Aug', earned: 38200 },
    { month: 'Sep', earned: 33400 },
    { month: 'Oct', earned: 42100 },
    { month: 'Nov', earned: 39600 },
    { month: 'Dec', earned: 51000 },
];

const PIE_DATA = [
    { name: 'Percentage Based', value: 68, color: '#092615' },
    { name: 'Flat Fee Based', value: 32, color: '#059669' },
];

const SUMMARY_STATS = [
    { label: 'Total Earned', value: '₹3,50,500', icon: 'bx bx-dollar-circle', color: '#059669' },
    { label: 'This Month', value: '₹51,000', icon: 'bx bx-calendar', color: '#2563eb' },
    { label: 'Avg. Monthly', value: '₹29,208', icon: 'bx bx-trending-up', color: '#d97706' },
    { label: 'Active Rules', value: '5', icon: 'bx bx-check-circle', color: '#7c3aed' },
];

const formatCurrency = (v) => `₹${(v / 1000).toFixed(0)}k`;

const DUMMY_COMMISSIONS = [
    { id: 1, name: "Standard Commission", type: "PERCENTAGE", value: "10", description: "Default commission for all vendors", status: "ACTIVE" },
    { id: 2, name: "Premium Vendor Rate", type: "PERCENTAGE", value: "8", description: "Reduced rate for premium vendors", status: "ACTIVE" },
    { id: 3, name: "Flat Booking Fee", type: "FLAT", value: "500", description: "Fixed fee per booking", status: "ACTIVE" },
    { id: 4, name: "New Vendor Promo", type: "PERCENTAGE", value: "5", description: "Promotional rate for new vendors", status: "ACTIVE" },
    { id: 5, name: "Luxury Property Rate", type: "PERCENTAGE", value: "12", description: "Higher rate for luxury properties", status: "DEACTIVE" },
    { id: 6, name: "Flat Service Charge", type: "FLAT", value: "250", description: "Service charge per transaction", status: "ACTIVE" },
];

const Commission = () => {
    const [commissions, setCommissions] = useState(DUMMY_COMMISSIONS);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [status, setStatus] = useState("ALL");
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({ name: "", type: "PERCENTAGE", value: "", description: "" });
    const [edit, setEdit] = useState(false);
    const [commissionId, setCommissionId] = useState(null);
    const [title, setTitle] = useState("Create Commission");
    const [errors, setErrors] = useState({});
    const [detailsModal, setDetailsModal] = useState(false);
    const [selectedCommission, setSelectedCommission] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteCommissionId, setDeleteCommissionId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const filtered = commissions.filter(c => {
        const matchKeyword = c.name.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchStatus = status === "ALL" || c.status === status;
        return matchKeyword && matchStatus;
    });

    const paginated = filtered.slice((currentPage - 1) * limit, currentPage * limit);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = "* Name is required";
        if (!formData.value) newErrors.value = "* Value is required";
        else if (isNaN(formData.value) || Number(formData.value) < 0) newErrors.value = "* Enter a valid positive number";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleCreateUpdate = () => {
        if (validateForm()) {
            if (edit) {
                setCommissions(prev => prev.map(c => c.id === commissionId ? { ...c, ...formData } : c));
            } else {
                setCommissions(prev => [...prev, { id: Date.now(), ...formData, status: "ACTIVE" }]);
            }
            setModal(false);
            setFormData({ name: "", type: "PERCENTAGE", value: "", description: "" });
            setErrors({});
        }
    };

    const handleCreateOpenModal = () => {
        setModal(true);
        setEdit(false);
        setTitle("Create Commission");
        setFormData({ name: "", type: "PERCENTAGE", value: "", description: "" });
        setErrors({});
    };

    const handleEdit = (id) => {
        setErrors({});
        setModal(true);
        setCommissionId(id);
        setEdit(true);
        setTitle("Update Commission");
        const item = commissions.find(c => c.id === id);
        if (item) setFormData({ name: item.name, type: item.type, value: item.value, description: item.description || "" });
    };

    const handleDeleteModal = (id) => {
        setDeleteCommissionId(id);
        setDeleteModal(true);
    };

    const confirmDelete = () => {
        setCommissions(prev => prev.filter(c => c.id !== deleteCommissionId));
        setDeleteModal(false);
    };

    const handleViewDetails = (commission) => {
        setSelectedCommission(commission);
        setDetailsModal(true);
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-trending-up"></i>
                    <h2>Commission Management</h2>
                </div>
            </div>

            <div className='status-and-add-icon' style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by commission name..."
                    value={searchKeyword}
                    onChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(1); }}
                    style={{ padding: '8px', width: '300px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <select value={status} onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }} style={{ padding: '8px' }}>
                        <option value="ALL">ALL</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DEACTIVE">DEACTIVE</option>
                    </select>
                    <span onClick={handleCreateOpenModal} style={{ cursor: 'pointer' }} data-tooltip-id="add-tooltip" data-tooltip-content="Add Commission">
                        <i className="bx bxs-plus-circle" style={{ fontSize: '30px', color: '#28a745', marginBottom: '8px' }}></i>
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Value</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((item, index) => (
                            <tr key={item.id}>
                                <td>{(currentPage - 1) * limit + index + 1}</td>
                                <td>{item.name}</td>
                                <td>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                                        background: item.type === 'PERCENTAGE' ? 'rgba(37,99,235,0.1)' : 'rgba(5,150,105,0.1)',
                                        color: item.type === 'PERCENTAGE' ? '#2563eb' : '#059669',
                                    }}>
                                        {item.type === 'PERCENTAGE' ? '%' : '₹'} {item.type}
                                    </span>
                                </td>
                                <td><strong>{item.type === 'PERCENTAGE' ? `${item.value}%` : `₹${item.value}`}</strong></td>
                                <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.description || '-'}
                                </td>
                                <td>
                                    <span className={`status-badge status-${item.status?.toLowerCase()}`}>{item.status}</span>
                                </td>
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
                currentPage={currentPage}
                totalItem={filtered.length}
                limitSelect={false}
                itemsPerPage={limit}
                showEllipsisAfter={true}
                visiblePageCount={3}
                onPageChange={(page) => setCurrentPage(page)}
            />

            <Modal isOpen={modal} onClose={() => setModal(false)} title={title} width="500px">
                <div className="edit-form">
                    <div className="form-group">
                        <label>Commission Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleFormChange} className="form-control" placeholder="e.g. Standard Commission" />
                        {errors.name && <span className="err-msg">{errors.name}</span>}
                    </div>
                    <div className="form-group">
                        <label>Type</label>
                        <select name="type" value={formData.type} onChange={handleFormChange} className="form-control">
                            <option value="PERCENTAGE">PERCENTAGE (%)</option>
                            <option value="FLAT">FLAT (₹)</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Value {formData.type === 'PERCENTAGE' ? '(%)' : '(₹)'}</label>
                        <input type="number" name="value" value={formData.value} onChange={handleFormChange} className="form-control" placeholder={formData.type === 'PERCENTAGE' ? 'e.g. 10' : 'e.g. 500'} min="0" />
                        {errors.value && <span className="err-msg">{errors.value}</span>}
                    </div>
                    <div className="form-group">
                        <label>Description <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span></label>
                        <textarea name="description" value={formData.description} onChange={handleFormChange} className="form-control" rows={3} placeholder="Brief description..." />
                    </div>
                    <div className="button-group-modal">
                        <button className="confirm-button" onClick={handleCreateUpdate}>Save</button>
                        <button className="cancel-button" onClick={() => setModal(false)}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Commission" width="400px">
                <p style={{ textAlign: 'center', padding: '10px 0' }}>Are you sure you want to delete this commission?</p>
                <div className="button-group-modal">
                    <button className="confirm-button" onClick={confirmDelete}>Delete</button>
                    <button className="cancel-button" onClick={() => setDeleteModal(false)}>Cancel</button>
                </div>
            </Modal>

            <Modal isOpen={detailsModal} onClose={() => setDetailsModal(false)} title="Commission Details" width="500px">
                <div className="details-content">
                    {selectedCommission && (
                        <>
                            <div className="detail-item"><label>Name:</label><span>{selectedCommission.name}</span></div>
                            <div className="detail-item"><label>Type:</label><span>{selectedCommission.type}</span></div>
                            <div className="detail-item"><label>Value:</label><span>{selectedCommission.type === 'PERCENTAGE' ? `${selectedCommission.value}%` : `₹${selectedCommission.value}`}</span></div>
                            <div className="detail-item"><label>Description:</label><span>{selectedCommission.description || '-'}</span></div>
                            <div className="detail-item"><label>Status:</label><span className={`status-badge status-${selectedCommission.status?.toLowerCase()}`}>{selectedCommission.status}</span></div>
                        </>
                    )}
                </div>
                <div className="button-group-modal">
                    <button className="cancel-button" onClick={() => setDetailsModal(false)}>Close</button>
                </div>
            </Modal>

            <Tooltip id="add-tooltip" />
            <Tooltip id="view-tooltip" />
            <Tooltip id="edit-tooltip" />
            <Tooltip id="delete-tooltip" />

            {/* ── Commission Earned Section ── */}
            <div style={{ marginTop: '32px' }}>

                {/* Summary stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                    {SUMMARY_STATS.map((s, i) => (
                        <div key={i} style={{
                            background: '#fff', border: '1px solid #e5e7eb',
                            borderLeft: `4px solid ${s.color}`, borderRadius: '8px',
                            padding: '16px', display: 'flex', alignItems: 'center', gap: '12px'
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '8px',
                                background: '#f9f9f9', border: '1px solid #e5e7eb',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <i className={s.icon} style={{ fontSize: '20px', color: s.color }}></i>
                            </div>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', lineHeight: 1 }}>{s.value}</div>
                                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '3px' }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Area chart + Pie chart side by side */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>

                    {/* Monthly Earned Area Chart */}
                    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
                        <p style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>
                            Monthly Commission Earned
                        </p>
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={MONTHLY_EARNED} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="earnedGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#092615" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#092615" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                                <RechartTooltip formatter={(v) => [`₹${v.toLocaleString()}`, 'Earned']} />
                                <Area type="monotone" dataKey="earned" stroke="#092615" strokeWidth={2.5} fill="url(#earnedGrad)" name="Earned" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie chart - commission type split */}
                    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
                        <p style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>
                            Commission Type Split
                        </p>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                                    {PIE_DATA.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <RechartTooltip formatter={(v) => `${v}%`} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                            {PIE_DATA.map((d, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#374151' }}>
                                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: d.color, flexShrink: 0 }}></span>
                                    {d.name} — <strong>{d.value}%</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bar chart - per commission rule earned */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', marginTop: '16px' }}>
                    <p style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>
                        Earnings per Commission Rule
                    </p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart
                            data={[
                                { name: 'Standard', earned: 98000 },
                                { name: 'Premium Rate', earned: 74000 },
                                { name: 'Flat Fee', earned: 62500 },
                                { name: 'New Vendor', earned: 41000 },
                                { name: 'Luxury Rate', earned: 35000 },
                                { name: 'Service Charge', earned: 40000 },
                            ]}
                            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <RechartTooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                            <Bar dataKey="earned" fill="#092615" radius={[6, 6, 0, 0]} name="Earned" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
};

export default Commission;
