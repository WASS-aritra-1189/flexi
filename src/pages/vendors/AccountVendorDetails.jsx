
import { useNavigate, useLocation } from 'react-router-dom';
import './AccountVendorDetails.scss';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

// Placeholder revenue data — replace with real API data
const monthlyRevenue = [
  { month: 'Jan', revenue: 18000, bookings: 6 },
  { month: 'Feb', revenue: 24000, bookings: 9 },
  { month: 'Mar', revenue: 15000, bookings: 5 },
  { month: 'Apr', revenue: 32000, bookings: 12 },
  { month: 'May', revenue: 28000, bookings: 10 },
  { month: 'Jun', revenue: 41000, bookings: 15 },
  { month: 'Jul', revenue: 38000, bookings: 14 },
  { month: 'Aug', revenue: 52000, bookings: 19 },
  { month: 'Sep', revenue: 47000, bookings: 17 },
  { month: 'Oct', revenue: 61000, bookings: 22 },
  { month: 'Nov', revenue: 55000, bookings: 20 },
  { month: 'Dec', revenue: 70000, bookings: 26 },
];

const revenueStats = [
  { label: 'Total Revenue', value: '₹4,81,000', icon: 'bx bx-dollar-circle', color: '#059669' },
  { label: 'Total Bookings', value: '175', icon: 'bx bxs-calendar-check', color: '#2563eb' },
  { label: 'Avg. Monthly', value: '₹40,083', icon: 'bx bx-trending-up', color: '#d97706' },
  { label: 'Commission Paid', value: '₹48,100', icon: 'bx bx-receipt', color: '#7c3aed' },
];

const formatCurrency = (v) => `₹${(v / 1000).toFixed(0)}k`;

const AccountVendorDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vendor = location.state?.vendor;

  if (!vendor) {
    return (
      <div className="not-found-message">
        <p>No vendor data available</p>
        <button className="cancel-button" onClick={() => navigate('/vendors')}>Back to Vendors</button>
      </div>
    );
  }
  const vendorDetail = vendor.vendorDetail?.[0] || {};

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
            {revenueStats.map((s, i) => (
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
            ))}
          </div>

          {/* Area Chart - Monthly Revenue */}
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '12px', marginTop: 0 }}>
            Monthly Revenue & Bookings
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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

          {/* Bar Chart - Quarter Comparison */}
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: '24px 0 12px' }}>
            Quarterly Revenue Breakdown
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={[
                { quarter: 'Q1', revenue: monthlyRevenue.slice(0,3).reduce((a,b) => a + b.revenue, 0) },
                { quarter: 'Q2', revenue: monthlyRevenue.slice(3,6).reduce((a,b) => a + b.revenue, 0) },
                { quarter: 'Q3', revenue: monthlyRevenue.slice(6,9).reduce((a,b) => a + b.revenue, 0) },
                { quarter: 'Q4', revenue: monthlyRevenue.slice(9,12).reduce((a,b) => a + b.revenue, 0) },
              ]}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#092615" radius={[6, 6, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </>
  );
};

export default AccountVendorDetails;