import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Pagination from '../../Components/Pagination/Pagination';
import { Tooltip } from 'react-tooltip';

const DUMMY_PROPERTIES = [
    { id: 1, name: "Sunrise Villa", type: "Villa", vendor: "Ravi Sharma", location: "Goa", rooms: 8, freeRooms: 3, price: 4500, rating: 4.5, status: "ACTIVE" },
    { id: 2, name: "Ocean Breeze Resort", type: "Resort", vendor: "Priya Hotels", location: "Kerala", rooms: 24, freeRooms: 10, price: 7200, rating: 4.8, status: "ACTIVE" },
    { id: 3, name: "Mountain Retreat", type: "Cottage", vendor: "Himachal Stays", location: "Manali", rooms: 6, freeRooms: 0, price: 3200, rating: 4.2, status: "ACTIVE" },
    { id: 4, name: "City Central Hotel", type: "Hotel", vendor: "Metro Hospitality", location: "Mumbai", rooms: 50, freeRooms: 18, price: 5500, rating: 4.0, status: "ACTIVE" },
    { id: 5, name: "Desert Camp", type: "Camp", vendor: "Rajasthan Tours", location: "Jaisalmer", rooms: 12, freeRooms: 5, price: 2800, rating: 4.6, status: "DEACTIVE" },
    { id: 6, name: "Backwater Houseboat", type: "Houseboat", vendor: "Kerala Cruises", location: "Alleppey", rooms: 4, freeRooms: 2, price: 9000, rating: 4.9, status: "ACTIVE" },
    { id: 7, name: "Heritage Haveli", type: "Haveli", vendor: "Rajputana Stays", location: "Udaipur", rooms: 16, freeRooms: 7, price: 6800, rating: 4.7, status: "ACTIVE" },
    { id: 8, name: "Forest Lodge", type: "Lodge", vendor: "Wild Escapes", location: "Coorg", rooms: 10, freeRooms: 4, price: 3800, rating: 4.3, status: "PENDING" },
    { id: 9, name: "Beachside Bungalow", type: "Bungalow", vendor: "Coastal Stays", location: "Pondicherry", rooms: 5, freeRooms: 1, price: 5200, rating: 4.4, status: "ACTIVE" },
    { id: 10, name: "Hilltop Homestay", type: "Homestay", vendor: "Ooty Homes", location: "Ooty", rooms: 3, freeRooms: 3, price: 2200, rating: 4.1, status: "ACTIVE" },
    { id: 11, name: "Lakeside Cottage", type: "Cottage", vendor: "Nainital Stays", location: "Nainital", rooms: 7, freeRooms: 2, price: 3500, rating: 4.5, status: "ACTIVE" },
    { id: 12, name: "Jungle Safari Camp", type: "Camp", vendor: "Wild India", location: "Jim Corbett", rooms: 15, freeRooms: 6, price: 4100, rating: 4.6, status: "DEACTIVE" },
];

const TYPE_ICONS = {
    Villa: "bx bx-home-heart", Resort: "bx bx-building", Cottage: "bx bx-home",
    Hotel: "bx bx-hotel", Camp: "bx bx-trip", Houseboat: "bx bx-water",
    Haveli: "bx bx-landmark", Lodge: "bx bx-tree", Bungalow: "bx bx-home-circle", Homestay: "bx bxs-home",
};

const STATUS_COLORS = {
    ACTIVE: { bg: "rgba(34,197,94,0.1)", color: "#16a34a" },
    DEACTIVE: { bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
    PENDING: { bg: "rgba(245,158,11,0.1)", color: "#d97706" },
};

const ITEMS_PER_PAGE = 6;

const AllProperties = () => {
    const navigate = useNavigate();
    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);

    const allTypes = [...new Set(DUMMY_PROPERTIES.map(p => p.type))];

    const filtered = DUMMY_PROPERTIES.filter(p => {
        const matchKeyword =
            p.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            p.vendor.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            p.location.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchStatus = statusFilter === "ALL" || p.status === statusFilter;
        const matchType = typeFilter === "ALL" || p.type === typeFilter;
        return matchKeyword && matchStatus && matchType;
    });

    const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-buildings"></i>
                    <h2>All Properties</h2>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <input
                    type="text"
                    placeholder="Search by name, vendor, location..."
                    value={searchKeyword}
                    onChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(1); }}
                    style={{ padding: '8px', width: '300px' }}
                />
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }} style={{ padding: '8px' }}>
                        <option value="ALL">All Types</option>
                        {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} style={{ padding: '8px' }}>
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DEACTIVE">DEACTIVE</option>
                        <option value="PENDING">PENDING</option>
                    </select>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                        {filtered.length} {filtered.length !== 1 ? 'properties' : 'property'} found
                    </span>
                </div>
            </div>

            {/* Cards Grid */}
            {paginated.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
                    <i className="bx bx-buildings" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}></i>
                    No properties found.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                    {paginated.map(property => (
                        <div key={property.id} style={{
                            background: '#fff', border: '1px solid #e5e7eb',
                            borderRadius: '10px', overflow: 'hidden',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                            transition: 'box-shadow 0.2s ease',
                        }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
                        >
                            {/* Card Header */}
                            <div style={{
                                height: '140px', background: 'linear-gradient(135deg, #062c15, #0a4a24)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                            }}>
                                <i className={TYPE_ICONS[property.type] || 'bx bx-home'} style={{ fontSize: '52px', color: 'rgba(255,255,255,0.3)' }}></i>
                                <span style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                                    background: STATUS_COLORS[property.status]?.bg,
                                    color: STATUS_COLORS[property.status]?.color,
                                }}>
                                    {property.status}
                                </span>
                                <span style={{
                                    position: 'absolute', top: '10px', left: '10px',
                                    padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '600',
                                    background: 'rgba(255,255,255,0.15)', color: '#fff',
                                }}>
                                    {property.type}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '14px 16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#1f2937' }}>{property.name}</h4>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#059669' }}>
                                        Rs.{property.price.toLocaleString()}
                                        <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 400 }}>/night</span>
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280', marginBottom: '10px' }}>
                                    <i className="bx bx-map-pin" style={{ color: '#dc2626' }}></i>
                                    {property.location}
                                    <span style={{ margin: '0 4px' }}>•</span>
                                    <i className="bx bx-store" style={{ color: '#2563eb' }}></i>
                                    {property.vendor}
                                </div>

                                {/* Room stats */}
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                                    <div style={{ flex: 1, background: '#f9f9f9', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px 10px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937' }}>{property.rooms}</div>
                                        <div style={{ fontSize: '10px', color: '#6b7280' }}>Total</div>
                                    </div>
                                    <div style={{ flex: 1, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '6px 10px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#16a34a' }}>{property.freeRooms}</div>
                                        <div style={{ fontSize: '10px', color: '#6b7280' }}>Free</div>
                                    </div>
                                    <div style={{ flex: 1, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 10px', textAlign: 'center' }}>
                                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#dc2626' }}>{property.rooms - property.freeRooms}</div>
                                        <div style={{ fontSize: '10px', color: '#6b7280' }}>Occupied</div>
                                    </div>
                                </div>

                                {/* Rating + Action */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <i key={s} className={s <= Math.round(property.rating) ? 'bx bxs-star' : 'bx bx-star'}
                                                style={{ fontSize: '14px', color: '#f59e0b' }}></i>
                                        ))}
                                        <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '2px' }}>{property.rating}</span>
                                    </div>
                                    <button
                                        onClick={() => navigate('/all-properties/details', { state: { property } })}
                                        style={{
                                            padding: '5px 14px', borderRadius: '6px', border: '1px solid #e5e7eb',
                                            background: '#f9f9f9', fontSize: '12px', fontWeight: '600',
                                            color: '#374151', cursor: 'pointer',
                                        }}
                                        data-tooltip-id="view-tooltip"
                                        data-tooltip-content="View Details"
                                    >
                                        <i className="bx bx-info-circle" style={{ marginRight: '4px' }}></i>Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalItem={filtered.length}
                limitSelect={false}
                itemsPerPage={ITEMS_PER_PAGE}
                showEllipsisAfter={true}
                visiblePageCount={3}
                onPageChange={(page) => setCurrentPage(page)}
            />

            <Tooltip id="view-tooltip" />
        </>
    );
};

export default AllProperties;
