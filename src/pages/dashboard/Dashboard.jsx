import { useState, useEffect } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend, BarChart, Bar
} from "recharts";
import { services } from "../../shared/_services/api_services";
import Loader from "../../Components/Loader/Loader";

const statCards = [
    { label: "Total Users", icon: "bx bxs-user-account", value: "0", color: "#2563eb", borderColor: "#2563eb" },
    { label: "Total Vendors", icon: "bx bx-store", value: "0", color: "#7c3aed", borderColor: "#7c3aed" },
    { label: "Total Bookings", icon: "bx bxs-calendar-check", value: "0", color: "#d97706", borderColor: "#d97706" },
    { label: "Commission / Margin", icon: "bx bx-trending-up", value: "0%", color: "#059669", borderColor: "#059669" },
    { label: "Total Rooms", icon: "bx bx-bed", value: "0", color: "#0891b2", borderColor: "#0891b2" },
    { label: "Free Rooms", icon: "bx bxs-door-open", value: "0", color: "#16a34a", borderColor: "#16a34a" },
    { label: "Occupied Rooms", icon: "bx bx-door-open", value: "0", color: "#dc2626", borderColor: "#dc2626" },
    { label: "Total Revenue Till Date", icon: "bx bx-dollar-circle", value: "₹0", color: "#ea580c", borderColor: "#ea580c" },
];

// Placeholder data — replace with real API data
const monthlyRevenueData = [
    { month: "Jan", revenue: 42000, bookings: 18 },
    { month: "Feb", revenue: 58000, bookings: 24 },
    { month: "Mar", revenue: 35000, bookings: 15 },
    { month: "Apr", revenue: 71000, bookings: 30 },
    { month: "May", revenue: 63000, bookings: 27 },
    { month: "Jun", revenue: 89000, bookings: 38 },
    { month: "Jul", revenue: 95000, bookings: 42 },
    { month: "Aug", revenue: 78000, bookings: 33 },
    { month: "Sep", revenue: 110000, bookings: 47 },
    { month: "Oct", revenue: 98000, bookings: 41 },
    { month: "Nov", revenue: 125000, bookings: 54 },
    { month: "Dec", revenue: 140000, bookings: 60 },
];

const vendorRevenueData = [
    { vendor: "Vendor A", revenue: 85000, commission: 8500 },
    { vendor: "Vendor B", revenue: 62000, commission: 6200 },
    { vendor: "Vendor C", revenue: 110000, commission: 11000 },
    { vendor: "Vendor D", revenue: 47000, commission: 4700 },
    { vendor: "Vendor E", revenue: 93000, commission: 9300 },
    { vendor: "Vendor F", revenue: 71000, commission: 7100 },
];

const formatCurrency = (value) => `₹${(value / 1000).toFixed(0)}k`;

const Dashboard = () => {
    const [activeChart, setActiveChart] = useState("area");
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await services.getDashboardStats();
            setStats(response.data);
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatCards = () => [
        { label: "Total Users", icon: "bx bxs-user-account", value: stats?.totalUsers || "0", color: "#2563eb", borderColor: "#2563eb" },
        { label: "Total Vendors", icon: "bx bx-store", value: stats?.totalVendors || "0", color: "#7c3aed", borderColor: "#7c3aed" },
        { label: "Total Bookings", icon: "bx bxs-calendar-check", value: stats?.totalBookings || "0", color: "#d97706", borderColor: "#d97706" },
        { label: "Total Rooms", icon: "bx bx-bed", value: stats?.totalRooms?.toLocaleString() || "0", color: "#0891b2", borderColor: "#0891b2" },
        { label: "Total Inventory", icon: "bx bx-package", value: stats?.totalInventory || "0", color: "#8b5cf6", borderColor: "#8b5cf6" },
        { label: "Free Inventory", icon: "bx bxs-door-open", value: stats?.freeInventory || "0", color: "#16a34a", borderColor: "#16a34a" },
        { label: "Occupied Inventory", icon: "bx bx-door-open", value: stats?.occupiedInventory || "0", color: "#dc2626", borderColor: "#dc2626" },
        { label: "Total Revenue", icon: "bx bx-dollar-circle", value: `₹${stats?.totalVendorRevenue?.toLocaleString() || "0"}`, color: "#ea580c", borderColor: "#ea580c" },
    ];

    const getMonthlyRevenueData = () => {
        if (!stats?.monthly_Revenue_and_Booking_Graph) return [];
        return stats.monthly_Revenue_and_Booking_Graph.map(item => ({
            month: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
            revenue: item.revenue || 0,
            bookings: parseInt(item.bookingCount) || 0,
        }));
    };

    const getVendorRevenueData = () => {
        if (!stats?.vendor_Revenue_Breakdown_Graph) return [];
        return stats.vendor_Revenue_Breakdown_Graph
            .filter(item => item.earnings !== null)
            .map(item => ({
                vendor: item.vendorName,
                revenue: item.earnings || 0,
            }));
    };

    if (loading) return <Loader loading={loading} />;

    return (
        <div className="dashboard">
            <div className="logo-management-card" style={{ marginBottom: '28px' }}>
                <div className="card-header">
                    <i className="bx bxs-dashboard"></i>
                    <h2>Dashboard</h2>
                </div>
            </div>

            {/* Stat Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '16px',
                marginBottom: '28px',
            }}>
                {getStatCards().map((card, index) => (
                    <div key={index} style={{
                        background: '#fff',
                        border: '1px solid #e5e7eb',
                        borderLeft: `4px solid ${card.color}`,
                        borderRadius: '8px',
                        padding: '18px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                    }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '8px',
                            background: '#f9f9f9', border: '1px solid #e5e7eb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <i className={card.icon} style={{ fontSize: '22px', color: card.color }}></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', lineHeight: 1, marginBottom: '4px' }}>
                                {card.value}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                                {card.label}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Revenue History - Area Chart */}
            <div style={{
                background: '#fff', borderRadius: '14px', padding: '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0',
                marginBottom: '24px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>
                            Revenue History
                        </h3>
                        <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
                            Monthly revenue & bookings overview
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => setActiveChart("area")}
                            style={{
                                padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                fontSize: '13px', fontWeight: '600',
                                background: activeChart === "area" ? "#092615" : "#f3f4f6",
                                color: activeChart === "area" ? "#fff" : "#6b7280",
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Area
                        </button>
                        <button
                            onClick={() => setActiveChart("bar")}
                            style={{
                                padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                fontSize: '13px', fontWeight: '600',
                                background: activeChart === "bar" ? "#092615" : "#f3f4f6",
                                color: activeChart === "bar" ? "#fff" : "#6b7280",
                                transition: 'all 0.2s ease',
                            }}
                        >
                            Bar
                        </button>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    {activeChart === "area" ? (
                        <AreaChart data={getMonthlyRevenueData()} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#092615" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#092615" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="bookingsGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="left" tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <Tooltip formatter={(value, name) => name === "revenue" ? [`₹${value.toLocaleString()}`, "Revenue"] : [value, "Bookings"]} />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#092615" strokeWidth={2.5} fill="url(#revenueGrad)" name="revenue" />
                            <Area yAxisId="right" type="monotone" dataKey="bookings" stroke="#f97316" strokeWidth={2.5} fill="url(#bookingsGrad)" name="bookings" />
                        </AreaChart>
                    ) : (
                        <BarChart data={getMonthlyRevenueData()} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                            <Tooltip formatter={(value, name) => name === "revenue" ? [`₹${value.toLocaleString()}`, "Revenue"] : [value, "Bookings"]} />
                            <Legend />
                            <Bar dataKey="revenue" fill="#092615" radius={[6, 6, 0, 0]} name="revenue" />
                            <Bar dataKey="bookings" fill="#f97316" radius={[6, 6, 0, 0]} name="bookings" />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Vendor Revenue Breakdown */}
            <div style={{
                background: '#fff', borderRadius: '14px', padding: '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #f0f0f0',
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>
                        Vendor Revenue Breakdown
                    </h3>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
                        Revenue vs commission per vendor
                    </p>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={getVendorRevenueData()} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="vendor" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Earnings" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
