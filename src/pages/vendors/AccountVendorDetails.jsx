
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendorDetail, updateVendorDetails } from '../../store/slice/accountSlice';
import { services } from '../../shared/_services/api_services';
import Modal from '../../Components/Modal/Modal';
import './AccountVendorDetails.scss';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

const formatCurrency = (v) => `₹${(v / 1000).toFixed(0)}k`;

const AccountVendorDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const vendor = useSelector((state) => state.account.selectedVendor);
  const [vendorStats, setVendorStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const { uploading } = useSelector((state) => state.loader);

  useEffect(() => {
    if (id) {
      dispatch(fetchVendorDetail(id));
      fetchVendorStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchVendorStats = async () => {
    try {
      const response = await services.getVendorStats(id);
      setVendorStats(response.data);
    } catch (error) {
      console.error('Error fetching vendor stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const getRevenueStats = () => [
    { label: 'Total Revenue', value: `₹${vendorStats?.totalRevenue?.toLocaleString() || '0'}`, icon: 'bx bx-dollar-circle', color: '#059669' },
    { label: 'Total Bookings', value: vendorStats?.totalBookings || '0', icon: 'bx bxs-calendar-check', color: '#2563eb' },
    { label: 'Avg. Monthly', value: `₹${vendorStats?.averageMonthlyRevenue?.toLocaleString() || '0'}`, icon: 'bx bx-trending-up', color: '#d97706' },
  ];

  const getMonthlyRevenueData = () => {
    if (!vendorStats?.monthly_Revenue_and_Booking_Graph) return [];
    return vendorStats.monthly_Revenue_and_Booking_Graph.map(item => ({
      month: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
      revenue: item.revenue || 0,
      bookings: parseInt(item.bookingCount) || 0,
    }));
  };

  if (!vendor) {
    return (
      <div className="not-found-message">
        <p>Loading vendor data...</p>
        <button className="cancel-button" onClick={() => navigate('/vendors')}>Back to Vendors</button>
      </div>
    );
  }
  const vendorDetail = vendor.vendorDetail?.[0] || {};

  const openEditModal = () => {
    setEditForm({
      name: vendorDetail.name || '',
      email: vendorDetail.email || '',
      aadharNumber: vendorDetail.aadharNumber || '',
      panNumber: vendorDetail.panNumber || '',
      businessName: vendorDetail.businessName || '',
      address: vendorDetail.address || '',
      serviceArea: vendorDetail.serviceArea || '',
    });
    setEditModal(true);
  };

  const handleEditSubmit = () => {
    dispatch(updateVendorDetails(id, editForm));
    setEditModal(false);
  };

  return (
    <>
      <div className="logo-management-card">
        <div className="card-header vendor-details-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="bx bx-info-circle"></i>
            <h2 style={{ margin: 0 }}>Vendor Details</h2>
          </div>
          <button onClick={() => navigate('/vendors')} className="back-button">
            <i className="bx bx-arrow-back"></i>
            Back
          </button>
          <button onClick={openEditModal} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '7px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.1)', color: '#fff',
            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          }}>
            <i className="bx bx-edit" /> Edit Details
          </button>
        </div>
      </div>

      <div className="vendor-details-container">
        {vendorDetail.profile && (
          <div className="vendor-card card-profile">
            <img src={vendorDetail.profile} alt="Vendor Profile" />
          </div>
        )}

        <div className="vendor-grid">
          <div className="vendor-card card-basic">
            <h3><i className="bx bx-info-circle"></i>Basic Information</h3>
            <p><strong>Vendor ID:</strong> {vendor.id}</p>
            <p><strong>Name:</strong> {vendorDetail.name || "-"}</p>
            <p><strong>Phone Number:</strong> {vendor.phoneNumber}</p>
            <p><strong>Email:</strong> {vendorDetail.email || "-"}</p>
            <p><strong>Status:</strong> <span className={`status-badge status-${vendor.status?.toLowerCase()}`}>{vendor.status}</span></p>
          </div>

          <div className="vendor-card card-business">
            <h3><i className="bx bx-briefcase"></i>Business Information</h3>
            <p><strong>Business Name:</strong> {vendorDetail.businessName || "-"}</p>
            <p><strong>Aadhar Number:</strong> {vendorDetail.aadharNumber || "-"}</p>
            <p><strong>PAN Number:</strong> {vendorDetail.panNumber || "-"}</p>
            <p><strong>Service Area:</strong> {vendorDetail.serviceArea || "-"}</p>
          </div>
        </div>

        {vendorDetail.address && (
          <div className="vendor-card card-address">
            <h3><i className="bx bx-map"></i>Address Information</h3>
            <p><strong>Address:</strong> {vendorDetail.address}</p>
          </div>
        )}

        {(vendorDetail.aadharFront || vendorDetail.aadharBack || vendorDetail.pan || vendorDetail.businessProve) && (
          <div className="card-documents">
            <h3><i className="bx bx-file"></i>Documents</h3>
            <div className="documents-grid">
              {vendorDetail.aadharFront && (
                <div className="document-item">
                  <img src={vendorDetail.aadharFront} alt="Aadhar Front" />
                  <p>Aadhar Front</p>
                  <a href={vendorDetail.aadharFront} target="_blank" rel="noopener noreferrer">View</a>
                </div>
              )}
              {vendorDetail.aadharBack && (
                <div className="document-item">
                  <img src={vendorDetail.aadharBack} alt="Aadhar Back" />
                  <p>Aadhar Back</p>
                  <a href={vendorDetail.aadharBack} target="_blank" rel="noopener noreferrer">View</a>
                </div>
              )}
              {vendorDetail.pan && (
                <div className="document-item">
                  <img src={vendorDetail.pan} alt="PAN" />
                  <p>PAN Card</p>
                  <a href={vendorDetail.pan} target="_blank" rel="noopener noreferrer">View</a>
                </div>
              )}
              {vendorDetail.businessProve && (
                <div className="document-item">
                  <img src={vendorDetail.businessProve} alt="Business Proof" />
                  <p>Business Proof</p>
                  <a href={vendorDetail.businessProve} target="_blank" rel="noopener noreferrer">View</a>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="card-metadata">
          <h3><i className="bx bx-time"></i>Metadata</h3>
          <div className="metadata-content">
            <p><strong>Created At:</strong> {new Date(vendor.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(vendor.updatedAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Revenue Section */}
        <div className="vendor-card" style={{ marginTop: '0' }}>
          <h3><i className="bx bx-line-chart"></i>Revenue Overview</h3>

          {/* Mini stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {statsLoading ? (
              <p style={{ color: '#6b7280', fontSize: '13px' }}>Loading stats...</p>
            ) : (
              getRevenueStats().map((s, i) => (
              <div key={i} style={{
                background: '#f9f9f9', border: '1px solid #e5e7eb',
                borderLeft: `4px solid ${s.color}`, borderRadius: '8px',
                padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '8px',
                  background: '#fff', border: '1px solid #e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <i className={s.icon} style={{ fontSize: '20px', color: s.color }}></i>
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '3px' }}>{s.label}</div>
                </div>
              </div>
              ))
            )}
          </div>

          {/* Area Chart - Monthly Revenue */}
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '12px', marginTop: 0 }}>
            Monthly Revenue & Bookings
          </p>
          {statsLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={getMonthlyRevenueData()} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="vRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#092615" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#092615" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="vBkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tickFormatter={formatCurrency} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value, name) => name === 'revenue' ? [`₹${value.toLocaleString()}`, 'Revenue'] : [value, 'Bookings']} />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#092615" strokeWidth={2} fill="url(#vRevGrad)" name="revenue" />
              <Area yAxisId="right" type="monotone" dataKey="bookings" stroke="#2563eb" strokeWidth={2} fill="url(#vBkGrad)" name="bookings" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Vendor Details" width="600px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { label: 'Name', key: 'name', type: 'text' },
            { label: 'Email', key: 'email', type: 'email' },
            { label: 'Aadhar Number', key: 'aadharNumber', type: 'text' },
            { label: 'PAN Number', key: 'panNumber', type: 'text' },
            { label: 'Business Name', key: 'businessName', type: 'text' },
            { label: 'Address', key: 'address', type: 'text' },
            { label: 'Service Area', key: 'serviceArea', type: 'text' },
          ].map(({ label, key, type }) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{label}</label>
              <input
                type={type}
                value={editForm[key] || ''}
                onChange={e => setEditForm(prev => ({ ...prev, [key]: e.target.value }))}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px' }}
              />
            </div>
          ))}
        </div>
        <div className="button-group-modal">
          <button className="confirm-button" onClick={handleEditSubmit}>
            {uploading ? 'Saving...' : 'Save Changes'}
          </button>
          <button className="cancel-button" onClick={() => setEditModal(false)}>Cancel</button>
        </div>
      </Modal>
    </>
  );
};

export default AccountVendorDetails;