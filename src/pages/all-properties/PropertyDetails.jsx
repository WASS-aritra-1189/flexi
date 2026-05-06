import { useNavigate, useLocation } from 'react-router-dom';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip as RechartTooltip, ResponsiveContainer,
    BarChart, Bar, Legend
} from 'recharts';

const MONTHLY_BOOKINGS = [
    { month: 'Jan', bookings: 12, revenue: 54000, cancellations: 2 },
    { month: 'Feb', bookings: 18, revenue: 81000, cancellations: 1 },
    { month: 'Mar', bookings: 9, revenue: 40500, cancellations: 3 },
    { month: 'Apr', bookings: 24, revenue: 108000, cancellations: 2 },
    { month: 'May', bookings: 21, revenue: 94500, cancellations: 1 },
    { month: 'Jun', bookings: 30, revenue: 135000, cancellations: 4 },
    { month: 'Jul', bookings: 27, revenue: 121500, cancellations: 2 },
    { month: 'Aug', bookings: 35, revenue: 157500, cancellations: 3 },
    { month: 'Sep', bookings: 29, revenue: 130500, cancellations: 1 },
    { month: 'Oct', bookings: 38, revenue: 171000, cancellations: 2 },
    { month: 'Nov', bookings: 33, revenue: 148500, cancellations: 3 },
    { month: 'Dec', bookings: 42, revenue: 189000, cancellations: 2 },
];

const formatCurrency = (v) => `Rs.${(v / 1000).toFixed(0)}k`;

const STATUS_COLORS = {
    ACTIVE: { bg: "rgba(34,197,94,0.1)", color: "#16a34a" },
    DEACTIVE: { bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
    PENDING: { bg: "rgba(245,158,11,0.1)", color: "#d97706" },
};

const TYPE_ICONS = {
    Villa: "bx bx-home-heart", Resort: "bx bx-building", Cottage: "bx bx-home",
    Hotel: "bx bx-hotel", Camp: "bx bx-trip", Houseboat: "bx bx-water",
    Haveli: "bx bx-landmark", Lodge: "bx bx-tree", Bungalow: "bx bx-home-circle", Homestay: "bx bxs-home",
};

const PropertyDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const property = location.state?.property;

    if (!property) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>No property data found.</p>
                <button className="cancel-button" onClick={() => navigate('/all-properties')}>Back to Properties</button>
            </div>
        );
    }

    const occupied = property.rooms - property.freeRooms;
    const occupancyPct = Math.round((occupied / property.rooms) * 100);

    return (
        <>
            {/* Header */}
            <div className="logo-management-card">
                <div className="card-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="bx bx-buildings"></i>
                        <h2 style={{ margin: 0 }}>Property Details</h2>
                    </div>
                    <button
                        onClick={() => navigate('/all-properties')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '7px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                            background: 'rgba(255,255,255,0.1)', color: '#fff',
                            fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                        }}
                    >
                        <i className="bx bx-arrow-back"></i> Back
                    </button>
                </div>
            </div>

            {/* Hero Banner */}
            <div style={{
                height: '180px', background: 'linear-gradient(135deg, #062c15, #0a4a24)',
                borderRadius: '10px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', position: 'relative', marginBottom: '20px',
            }}>
                <i className={TYPE_ICONS[property.type] || 'bx bx-home'} style={{ fontSize: '80px', color: 'rgba(255,255,255,0.15)' }}></i>
                <div style={{ position: 'absolute', bottom: '20px', left: '24px' }}>
                    <h2 style={{ margin: 0, color: '#fff', fontSize: '22px', fontWeight: '700' }}>{property.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <span style={{
                            padding: '3px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                            background: 'rgba(255,255,255,0.15)', color: '#fff',
                        }}>{property.type}</span>
                        <span style={{
                            padding: '3px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700',
                            background: STATUS_COLORS[property.status]?.bg,
                            color: STATUS_COLORS[property.status]?.color,
                        }}>{property.status}</span>
                    </div>
                </div>
                <div style={{ position: 'absolute', bottom: '20px', right: '24px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: '#6ee7b7' }}>
                        ₹{property.price.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginLeft: '4px' }}>/night</span>
                </div>
            </div>

            {/* Stat Cards Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                    { label: 'Total Rooms', value: property.rooms, icon: 'bx bx-bed', color: '#2563eb' },
                    { label: 'Free Rooms', value: property.freeRooms, icon: 'bx bxs-door-open', color: '#16a34a' },
                    { label: 'Occupied', value: occupied, icon: 'bx bx-door-open', color: '#dc2626' },
                    { label: 'Occupancy', value: `${occupancyPct}%`, icon: 'bx bx-trending-up', color: '#d97706' },
                    { label: 'Rating', value: `${property.rating}/5`, icon: 'bx bxs-star', color: '#f59e0b' },
                    { label: 'Price/Night', value: `₹${property.price.toLocaleString()}`, icon: 'bx bx-dollar-circle', color: '#059669' },
                ].map((s, i) => (
                    <div key={i} style={{
                        background: '#fff', border: '1px solid #e5e7eb',
                        borderLeft: `4px solid ${s.color}`, borderRadius: '8px',
                        padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '8px',
                            background: '#f9f9f9', border: '1px solid #e5e7eb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                            <i className={s.icon} style={{ fontSize: '18px', color: s.color }}></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', lineHeight: 1 }}>{s.value}</div>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{s.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

                {/* Basic Info */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
                    <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bx bx-info-circle" style={{ color: '#2563eb' }}></i> Basic Information
                    </h4>
                    <div className="details-content">
                        <div className="detail-item"><label style={{ color: '#111827', fontWeight: '700' }}>Property Name:</label><span style={{ color: '#1f2937', fontWeight: '600' }}>{property.name}</span></div>
                        <div className="detail-item"><label style={{ color: '#111827', fontWeight: '700' }}>Type:</label><span style={{ color: '#1f2937', fontWeight: '600' }}>{property.type}</span></div>
                        <div className="detail-item"><label style={{ color: '#111827', fontWeight: '700' }}>Location:</label><span style={{ color: '#1f2937', fontWeight: '600' }}>{property.location}</span></div>
                        <div className="detail-item"><label style={{ color: '#111827', fontWeight: '700' }}>Status:</label>
                            <span className={`status-badge status-${property.status?.toLowerCase()}`}>{property.status}</span>
                        </div>
                    </div>
                </div>

                {/* Vendor Info */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
                    <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bx bx-store" style={{ color: '#7c3aed' }}></i> Vendor Information
                    </h4>
                    <div className="details-content">
                        <div className="detail-item"><label style={{ color: '#111827', fontWeight: '700' }}>Vendor Name:</label><span style={{ color: '#1f2937', fontWeight: '600' }}>{property.vendor}</span></div>
                        <div className="detail-item"><label style={{ color: '#111827', fontWeight: '700' }}>Rating:</label>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                {[1, 2, 3, 4, 5].map(s => (
                                    <i key={s} className={s <= Math.round(property.rating) ? 'bx bxs-star' : 'bx bx-star'}
                                        style={{ fontSize: '14px', color: '#f59e0b' }}></i>
                                ))}
                                <span style={{ fontSize: '13px', color: '#1f2937', fontWeight: '600' }}>{property.rating}</span>
                            </span>
                        </div>
                        <div className="detail-item"><label style={{ color: '#111827', fontWeight: '700' }}>Price/Night:</label><span style={{ color: '#1f2937', fontWeight: '600' }}>Rs.{property.price.toLocaleString()}</span></div>
                    </div>
                </div>
            </div>

            {/* Room Occupancy Bar */}
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
                <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="bx bx-bed" style={{ color: '#059669' }}></i> Room Occupancy
                </h4>
                <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="bx bx-bed" style={{ color: '#059669' }}></i> Room Occupancy
                </h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                    <span>{occupied} occupied of {property.rooms} total rooms</span>
                    <span style={{ fontWeight: '700', color: occupancyPct > 80 ? '#dc2626' : '#059669' }}>{occupancyPct}% occupied</span>
                </div>
                <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%', borderRadius: '999px',
                        width: `${occupancyPct}%`,
                        background: occupancyPct > 80 ? '#dc2626' : occupancyPct > 50 ? '#d97706' : '#16a34a',
                        transition: 'width 0.4s ease',
                    }} />
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                    {[
                        { label: 'Free', value: property.freeRooms, color: '#16a34a', bg: '#f0fdf4' },
                        { label: 'Occupied', value: occupied, color: '#dc2626', bg: '#fef2f2' },
                        { label: 'Total', value: property.rooms, color: '#2563eb', bg: '#eff6ff' },
                    ].map((r, i) => (
                        <div key={i} style={{
                            flex: 1, background: r.bg, borderRadius: '8px',
                            padding: '10px', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '20px', fontWeight: '700', color: r.color }}>{r.value}</div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>{r.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking Dynamics */}
            <div style={{ marginTop: '20px' }}>

                {/* Booking summary stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    {[
                        { label: 'Total Bookings', value: MONTHLY_BOOKINGS.reduce((a, b) => a + b.bookings, 0), icon: 'bx bxs-calendar-check', color: '#2563eb' },
                        { label: 'Total Revenue', value: `Rs.${(MONTHLY_BOOKINGS.reduce((a, b) => a + b.revenue, 0) / 1000).toFixed(0)}k`, icon: 'bx bx-dollar-circle', color: '#059669' },
                        { label: 'Cancellations', value: MONTHLY_BOOKINGS.reduce((a, b) => a + b.cancellations, 0), icon: 'bx bx-x-circle', color: '#dc2626' },
                        { label: 'Avg/Month', value: Math.round(MONTHLY_BOOKINGS.reduce((a, b) => a + b.bookings, 0) / 12), icon: 'bx bx-trending-up', color: '#d97706' },
                    ].map((s, i) => (
                        <div key={i} style={{
                            background: '#fff', border: '1px solid #e5e7eb',
                            borderLeft: `4px solid ${s.color}`, borderRadius: '8px',
                            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px',
                        }}>
                            <div style={{
                                width: '36px', height: '36px', borderRadius: '8px',
                                background: '#f9f9f9', border: '1px solid #e5e7eb',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <i className={s.icon} style={{ fontSize: '18px', color: s.color }}></i>
                            </div>
                            <div>
                                <div style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', lineHeight: 1 }}>{s.value}</div>
                                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Area Chart - Monthly Bookings & Revenue */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>Monthly Bookings & Revenue</p>
                    <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#6b7280' }}>Booking count vs revenue trend over the year</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={MONTHLY_BOOKINGS} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <defs>
                                <linearGradient id="bookGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#092615" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#092615" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="right" orientation="right" tickFormatter={formatCurrency} tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <RechartTooltip formatter={(value, name) => name === 'revenue' ? [`Rs.${value.toLocaleString()}`, 'Revenue'] : [value, name.charAt(0).toUpperCase() + name.slice(1)]} />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="bookings" stroke="#092615" strokeWidth={2.5} fill="url(#bookGrad)" name="bookings" />
                            <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#revGrad)" name="revenue" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart - Bookings vs Cancellations */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>Bookings vs Cancellations</p>
                    <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#6b7280' }}>Monthly comparison of confirmed bookings and cancellations</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={MONTHLY_BOOKINGS} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <RechartTooltip />
                            <Legend />
                            <Bar dataKey="bookings" fill="#092615" radius={[4, 4, 0, 0]} name="Bookings" />
                            <Bar dataKey="cancellations" fill="#dc2626" radius={[4, 4, 0, 0]} name="Cancellations" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
};

export default PropertyDetails;
