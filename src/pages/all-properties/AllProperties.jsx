import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchVendorList, fetchVendorProperties, changePropertyStatus, editProperty } from "../../store/slice/accountSlice";
import Pagination from "../../Components/Pagination/Pagination";
import Modal from "../../Components/Modal/Modal";
import { Tooltip } from "react-tooltip";

const ITEMS_PER_PAGE = 10;
const PROPERTY_STATUSES = ["ACTIVE", "DEACTIVE", "PENDING", "REJECTED"];

const AllProperties = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { vendorList, vendorListCount, vendorProperties, vendorPropertiesCount } = useSelector((state) => state.account);

    const [view, setView] = useState("vendors"); // "vendors" | "properties"
    const [selectedVendor, setSelectedVendor] = useState(null);

    // vendor pagination
    const [vendorPage, setVendorPage] = useState({ limit: ITEMS_PER_PAGE, offset: 0, currentPage: 1, keyword: "" });
    const [vendorSearch, setVendorSearch] = useState("");
    const [vendorStatus, setVendorStatus] = useState("ACTIVE");

    // property pagination
    const [propPage, setPropPage] = useState({ limit: ITEMS_PER_PAGE, offset: 0, currentPage: 1, keyword: "" });
    const [propSearch, setPropSearch] = useState("");
    const [propStatus, setPropStatus] = useState("ACTIVE");

    // property modals
    const [statusModal, setStatusModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [editForm, setEditForm] = useState({});
    const { uploading } = useSelector((state) => state.loader);

    useEffect(() => {
        dispatch(fetchVendorList({ limit: vendorPage.limit, offset: vendorPage.offset, keyword: vendorPage.keyword, status: vendorStatus }));
    }, [dispatch, vendorPage.limit, vendorPage.offset, vendorPage.keyword, vendorStatus]);

    useEffect(() => {
        const t = setTimeout(() => setVendorPage(p => ({ ...p, keyword: vendorSearch, offset: 0, currentPage: 1 })), 600);
        return () => clearTimeout(t);
    }, [vendorSearch]);

    useEffect(() => {
        if (view === "properties" && selectedVendor) {
            dispatch(fetchVendorProperties(selectedVendor.id, { limit: propPage.limit, offset: propPage.offset, status: propStatus, keyword: propPage.keyword }));
        }
    }, [dispatch, view, selectedVendor, propPage.limit, propPage.offset, propPage.keyword, propStatus]);

    useEffect(() => {
        const t = setTimeout(() => setPropPage(p => ({ ...p, keyword: propSearch, offset: 0, currentPage: 1 })), 600);
        return () => clearTimeout(t);
    }, [propSearch]);

    const handleVendorClick = (vendor) => {
        setSelectedVendor(vendor);
        setPropPage({ limit: ITEMS_PER_PAGE, offset: 0, currentPage: 1, keyword: "" });
        setPropSearch("");
        setPropStatus("ACTIVE");
        setView("properties");
    };

    const handleBack = () => {
        setView("vendors");
        setSelectedVendor(null);
    };

    const propFilters = { limit: propPage.limit, offset: propPage.offset, status: propStatus, keyword: propPage.keyword };

    const openStatusModal = (property) => {
        setSelectedProperty(property);
        setSelectedStatus(property.status);
        setStatusModal(true);
    };

    const openEditModal = (property) => {
        setSelectedProperty(property);
        setEditForm({
            name: property.name || "",
            checkInTime: property.checkInTime || "",
            checkOutTime: property.checkOutTime || "",
            contactPersonName: property.contactPersonName || "",
            contactPersonMobile: property.contactPersonMobile || "",
        });
        setEditModal(true);
    };

    const handleStatusSave = () => {
        dispatch(changePropertyStatus(selectedProperty.id, { status: selectedStatus }, selectedVendor.id, propFilters));
        setStatusModal(false);
    };

    const handleEditSave = () => {
        dispatch(editProperty(selectedProperty.id, editForm, selectedVendor.id, propFilters));
        setEditModal(false);
    };

    const renderStars = (count) =>
        [1, 2, 3, 4, 5].map(s => (
            <i key={s} className={s <= count ? "bx bxs-star" : "bx bx-star"} style={{ fontSize: "13px", color: "#f59e0b" }} />
        ));

    if (view === "properties") {
        return (
            <>
                <div className="logo-management-card">
                    <div className="card-header">
                        <i className="bx bx-buildings" />
                        <h2>
                            <span onClick={handleBack} style={{ cursor: "pointer", color: "#059669", marginRight: "6px" }}>
                                All Properties
                            </span>
                            / {selectedVendor?.vendorDetail?.[0]?.businessName || selectedVendor?.vendorDetail?.[0]?.name || "Vendor"}
                        </h2>
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                    <button onClick={handleBack} style={{ padding: "7px 16px", borderRadius: "6px", border: "1px solid #e5e7eb", background: "#f9f9f9", cursor: "pointer", fontWeight: 600 }}>
                        <i className="bx bx-arrow-back" style={{ marginRight: "6px" }} />Back
                    </button>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <input
                            type="text"
                            placeholder="Search properties..."
                            value={propSearch}
                            onChange={e => setPropSearch(e.target.value)}
                            style={{ padding: "8px", width: "240px" }}
                        />
                        <select value={propStatus} onChange={e => { setPropStatus(e.target.value); setPropPage(p => ({ ...p, offset: 0, currentPage: 1 })); }} style={{ padding: "8px" }}>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="DEACTIVE">DEACTIVE</option>
                            <option value="PENDING">PENDING</option>
                            <option value="">All</option>
                        </select>
                        <span style={{ fontSize: "13px", color: "#6b7280" }}>{vendorPropertiesCount} properties</span>
                    </div>
                </div>

                {vendorProperties?.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
                        <i className="bx bx-buildings" style={{ fontSize: "48px", display: "block", marginBottom: "12px" }} />
                        No properties found.
                    </div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                        {vendorProperties?.map(property => (
                            <div key={property.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "box-shadow 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"}
                            >
                                {/* Image */}
                                <div style={{ height: "150px", background: "linear-gradient(135deg, #062c15, #0a4a24)", position: "relative", overflow: "hidden" }}>
                                    {property.propertyImage?.[0]?.image ? (
                                        <img src={property.propertyImage[0].image} alt={property.name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
                                    ) : (
                                        <i className="bx bx-hotel" style={{ fontSize: "52px", color: "rgba(255,255,255,0.3)", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
                                    )}
                                    <span style={{ position: "absolute", top: "10px", right: "10px", padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 700, background: property.status === "ACTIVE" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", color: property.status === "ACTIVE" ? "#16a34a" : "#dc2626" }}>
                                        {property.status}
                                    </span>
                                    {property.hotelStar && (
                                        <span style={{ position: "absolute", top: "10px", left: "10px", padding: "3px 8px", borderRadius: "12px", fontSize: "11px", background: "rgba(0,0,0,0.45)", color: "#fbbf24", fontWeight: 700 }}>
                                            {"★".repeat(property.hotelStar)}
                                        </span>
                                    )}
                                </div>

                                <div style={{ padding: "14px 16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                                        <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#1f2937", textTransform: "capitalize" }}>{property.name}</h4>
                                        {property.avgRating && (
                                            <span style={{ fontSize: "12px", fontWeight: 700, color: "#f59e0b" }}>⭐ {property.avgRating}</span>
                                        )}
                                    </div>

                                    <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "8px" }}>
                                        <i className="bx bx-map-pin" style={{ color: "#dc2626" }} /> {property.area}, {property.city}
                                    </div>

                                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                                        {property.propertyFacility?.slice(0, 3).map(f => (
                                            <span key={f.id} style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "10px", background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                                                {f.propertyAmenity?.name}
                                            </span>
                                        ))}
                                        {property.propertyFacility?.length > 3 && (
                                            <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "10px", background: "#f3f4f6", color: "#6b7280" }}>
                                                +{property.propertyFacility.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <div style={{ fontSize: "11px", color: "#6b7280" }}>
                                            <i className="bx bx-time" /> {property.checkInTime} – {property.checkOutTime}
                                        </div>
                                        <div style={{ display: "flex", gap: "6px" }}>
                                            <button
                                                onClick={() => openStatusModal(property)}
                                                style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #e5e7eb", background: "#f9f9f9", fontSize: "12px", fontWeight: 600, color: "#374151", cursor: "pointer" }}
                                                data-tooltip-id="prop-status-tooltip"
                                                data-tooltip-content="Change Status"
                                            >
                                                <i className="bx bx-cog" />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(property)}
                                                style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #e5e7eb", background: "#f9f9f9", fontSize: "12px", fontWeight: 600, color: "#374151", cursor: "pointer" }}
                                                data-tooltip-id="prop-edit-tooltip"
                                                data-tooltip-content="Edit Property"
                                            >
                                                <i className="bx bx-edit" />
                                            </button>
                                            <button
                                                onClick={() => navigate("/all-properties/details", { state: { property } })}
                                                style={{ padding: "5px 14px", borderRadius: "6px", border: "1px solid #e5e7eb", background: "#f9f9f9", fontSize: "12px", fontWeight: 600, color: "#374151", cursor: "pointer" }}
                                                data-tooltip-id="prop-tooltip"
                                                data-tooltip-content="View Details"
                                            >
                                                <i className="bx bx-info-circle" style={{ marginRight: "4px" }} />Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <Pagination
                    currentPage={propPage.currentPage}
                    totalItem={vendorPropertiesCount || 0}
                    limitSelect={true}
                    itemsPerPage={propPage.limit}
                    showEllipsisAfter={true}
                    visiblePageCount={3}
                    onPageChange={(page) => setPropPage(p => ({ ...p, currentPage: page, offset: p.limit * (page - 1) }))}
                    onItemsLimitChange={(limit) => setPropPage(p => ({ ...p, limit, offset: 0, currentPage: 1 }))}
                />

                {/* Status Modal */}
                <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title="Change Property Status" width="500px">
                    <div className="status-container-horizontal">
                        {PROPERTY_STATUSES.map((s) => (
                            <div key={s} className={`status-option status-${s.toLowerCase()}`}>
                                <input id={`prop-status-${s}`} type="radio" name="propStatus" checked={selectedStatus === s} onChange={() => setSelectedStatus(s)} value={s} />
                                <label htmlFor={`prop-status-${s}`}>{s}</label>
                            </div>
                        ))}
                    </div>
                    <div className="button-group-modal">
                        <button className="confirm-button" onClick={handleStatusSave} disabled={uploading}>{uploading ? "Saving..." : "Confirm"}</button>
                        <button className="cancel-button" onClick={() => setStatusModal(false)}>Cancel</button>
                    </div>
                </Modal>

                {/* Edit Modal */}
                <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Property" width="500px">
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {[
                            { label: "Property Name", key: "name" },
                            { label: "Check-In Time", key: "checkInTime" },
                            { label: "Check-Out Time", key: "checkOutTime" },
                            { label: "Contact Person Name", key: "contactPersonName" },
                            { label: "Contact Person Mobile", key: "contactPersonMobile" },
                        ].map(({ label, key }) => (
                            <div key={key}>
                                <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>{label}</label>
                                <input
                                    value={editForm[key] || ""}
                                    onChange={(e) => setEditForm((p) => ({ ...p, [key]: e.target.value }))}
                                    style={{ width: "100%", padding: "8px" }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="button-group-modal">
                        <button className="confirm-button" onClick={handleEditSave} disabled={uploading}>{uploading ? "Saving..." : "Update"}</button>
                        <button className="cancel-button" onClick={() => setEditModal(false)}>Cancel</button>
                    </div>
                </Modal>

                <Tooltip id="prop-tooltip" />
                <Tooltip id="prop-status-tooltip" />
                <Tooltip id="prop-edit-tooltip" />
            </>
        );
    }

    // Vendors list view
    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-buildings" />
                    <h2>All Properties</h2>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
                <input
                    type="text"
                    placeholder="Search vendors..."
                    value={vendorSearch}
                    onChange={e => setVendorSearch(e.target.value)}
                    style={{ padding: "8px", width: "300px" }}
                />
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <select value={vendorStatus} onChange={e => { setVendorStatus(e.target.value); setVendorPage(p => ({ ...p, offset: 0, currentPage: 1 })); }} style={{ padding: "8px" }}>
                        <option value="">All</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="PENDING">PENDING</option>
                        <option value="DEACTIVE">DEACTIVE</option>
                    </select>
                    <span style={{ fontSize: "13px", color: "#6b7280" }}>{vendorListCount} vendors</span>
                </div>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Business Name</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendorList?.map((vendor, index) => (
                            <tr key={vendor.id}>
                                <td>{vendorPage.offset + index + 1}</td>
                                <td>
                                    {vendor.vendorDetail?.[0]?.profile ? (
                                        <img src={vendor.vendorDetail[0].profile} alt="Profile" style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} />
                                    ) : (
                                        <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <i className="bx bx-user" style={{ fontSize: "18px", color: "#666" }} />
                                        </div>
                                    )}
                                </td>
                                <td>{vendor.vendorDetail?.[0]?.name || "-"}</td>
                                <td>{vendor.vendorDetail?.[0]?.businessName || "-"}</td>
                                <td>{vendor.phoneNumber}</td>
                                <td>
                                    <span className={`status-badge status-${vendor.status?.toLowerCase()}`}>{vendor.status}</span>
                                </td>
                                <td>
                                    <div className="table-action-button">
                                        <div className="action-icon" onClick={() => handleVendorClick(vendor)} data-tooltip-id="vendor-prop-tooltip" data-tooltip-content="View Properties">
                                            <i className="bx bx-buildings text-olive" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={vendorPage.currentPage}
                totalItem={vendorListCount || 0}
                limitSelect={true}
                itemsPerPage={vendorPage.limit}
                showEllipsisAfter={true}
                visiblePageCount={3}
                onPageChange={(page) => setVendorPage(p => ({ ...p, currentPage: page, offset: p.limit * (page - 1) }))}
                onItemsLimitChange={(limit) => setVendorPage(p => ({ ...p, limit, offset: 0, currentPage: 1 }))}
            />
            <Tooltip id="vendor-prop-tooltip" />
        </>
    );
};

export default AllProperties;
