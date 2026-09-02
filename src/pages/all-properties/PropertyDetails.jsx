import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changePropertyStatus, editProperty } from '../../store/slice/accountSlice';
import Modal from '../../Components/Modal/Modal';

const PROPERTY_STATUSES = ["ACTIVE", "DEACTIVE", "PENDING", "REJECTED"];

const STATUS_COLORS = {
    ACTIVE: { bg: "rgba(34,197,94,0.1)", color: "#16a34a" },
    DEACTIVE: { bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
    PENDING: { bg: "rgba(245,158,11,0.1)", color: "#d97706" },
};

const InfoRow = ({ label, value }) => (
    <div className="detail-item">
        <label style={{ color: '#111827', fontWeight: '700' }}>{label}:</label>
        <span style={{ color: '#1f2937', fontWeight: '600' }}>{value || '-'}</span>
    </div>
);

const PropertyDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const property = location.state?.property;
    const { uploading } = useSelector((state) => state.loader);

    const [statusModal, setStatusModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(property?.status || "");
    const [editForm, setEditForm] = useState({
        name: property?.name || "",
        checkInTime: property?.checkInTime || "",
        checkOutTime: property?.checkOutTime || "",
        contactPersonName: property?.contactPersonName || "",
        contactPersonMobile: property?.contactPersonMobile || "",
    });

    const handleStatusSave = () => {
        dispatch(changePropertyStatus(property.id, { status: selectedStatus }, null, null));
        setStatusModal(false);
    };

    const handleEditSave = () => {
        dispatch(editProperty(property.id, editForm, null, null));
        setEditModal(false);
    };

    if (!property) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ color: '#6b7280', marginBottom: '16px' }}>No property data found.</p>
                <button className="cancel-button" onClick={() => navigate('/all-properties')}>Back to Properties</button>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="logo-management-card">
                <div className="card-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="bx bx-buildings" />
                        <h2 style={{ margin: 0 }}>Property Details</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            onClick={() => setStatusModal(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '7px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.1)', color: '#fff',
                                fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                            }}
                        >
                            <i className="bx bx-cog" /> Status
                        </button>
                        <button
                            onClick={() => setEditModal(true)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '7px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.1)', color: '#fff',
                                fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                            }}
                        >
                            <i className="bx bx-edit" /> Edit
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '7px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                                background: 'rgba(255,255,255,0.1)', color: '#fff',
                                fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                            }}
                        >
                            <i className="bx bx-arrow-back" /> Back
                        </button>
                    </div>
                </div>
            </div>

            {/* Hero Banner */}
            <div style={{
                height: '200px', background: 'linear-gradient(135deg, #062c15, #0a4a24)',
                borderRadius: '10px', position: 'relative', overflow: 'hidden', marginBottom: '20px',
            }}>
                {property.propertyImage?.[0]?.image ? (
                    <img src={property.propertyImage[0].image} alt={property.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />
                ) : (
                    <i className="bx bx-hotel" style={{ fontSize: '80px', color: 'rgba(255,255,255,0.15)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
                )}
                <div style={{ position: 'absolute', bottom: '20px', left: '24px' }}>
                    <h2 style={{ margin: 0, color: '#fff', fontSize: '22px', fontWeight: '700', textTransform: 'capitalize' }}>{property.name}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {property.hotelStar && (
                            <span style={{ padding: '3px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700', background: 'rgba(0,0,0,0.4)', color: '#fbbf24' }}>
                                {'★'.repeat(property.hotelStar)} {property.hotelStar}-Star
                            </span>
                        )}
                        <span style={{
                            padding: '3px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '700',
                            background: STATUS_COLORS[property.status]?.bg,
                            color: STATUS_COLORS[property.status]?.color,
                        }}>{property.status}</span>
                    </div>
                </div>
                {property.avgRating && (
                    <div style={{ position: 'absolute', bottom: '20px', right: '24px', textAlign: 'right' }}>
                        <span style={{ fontSize: '28px', fontWeight: '800', color: '#fbbf24' }}>⭐ {property.avgRating}</span>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{property.totalRating} rating{property.totalRating !== 1 ? 's' : ''}</div>
                    </div>
                )}
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                {[
                    { label: 'Check-In', value: property.checkInTime, icon: 'bx bx-log-in', color: '#2563eb' },
                    { label: 'Check-Out', value: property.checkOutTime, icon: 'bx bx-log-out', color: '#7c3aed' },
                    { label: 'Estd.', value: property.estd, icon: 'bx bx-calendar', color: '#059669' },
                    { label: 'Booking Since', value: property.bookingSince, icon: 'bx bxs-calendar-check', color: '#d97706' },
                    { label: 'Total Likes', value: property.totalLikes ?? 0, icon: 'bx bxs-heart', color: '#dc2626' },
                    { label: 'Avg Rating', value: property.avgRating ? `${property.avgRating}/5` : 'N/A', icon: 'bx bxs-star', color: '#f59e0b' },
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
                            <i className={s.icon} style={{ fontSize: '18px', color: s.color }} />
                        </div>
                        <div>
                            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', lineHeight: 1 }}>{s.value}</div>
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
                        <i className="bx bx-info-circle" style={{ color: '#2563eb' }} /> Basic Information
                    </h4>
                    <div className="details-content">
                        <InfoRow label="Property Name" value={property.name} />
                        <InfoRow label="Ownership" value={property.ownershipType} />
                        <InfoRow label="Location" value={property.location} />
                        <InfoRow label="Area" value={property.area} />
                        <InfoRow label="City" value={property.city} />
                        <InfoRow label="State" value={property.state} />
                        <InfoRow label="Pincode" value={property.pincode} />
                        <InfoRow label="Country" value={property.country} />
                        <InfoRow label="House/Apt" value={property.house_Apt_Num} />
                    </div>
                </div>

                {/* Contact Info */}
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
                    <h4 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bx bx-phone" style={{ color: '#059669' }} /> Contact & Financial
                    </h4>
                    <div className="details-content">
                        <InfoRow label="Contact Person" value={property.contactPersonName} />
                        <InfoRow label="Mobile" value={property.contactPersonMobile} />
                        <InfoRow label="WhatsApp" value={property.contactPersonWp} />
                        <InfoRow label="Bank Acc No." value={property.bankAccNum} />
                        <InfoRow label="IFSC" value={property.ifsc} />
                        <InfoRow label="PAN" value={property.panNum} />
                        <InfoRow label="GST" value={property.gstNum || '-'} />
                        <InfoRow label="TAN" value={property.tanNum || '-'} />
                    </div>
                </div>
            </div>

            {/* Amenities */}
            {property.propertyFacility?.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
                    <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bx bx-check-shield" style={{ color: '#059669' }} /> Amenities
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {property.propertyFacility.map(f => (
                            <span key={f.id} style={{ padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                                {f.propertyAmenity?.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Cancel Policies */}
            {property.propertyBookingCancelPolicy?.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
                    <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bx bx-shield" style={{ color: '#d97706' }} /> Cancellation Policies
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {property.propertyBookingCancelPolicy.map(p => (
                            <div key={p.id} style={{ padding: '10px 14px', borderRadius: '8px', background: '#fffbeb', border: '1px solid #fde68a', fontSize: '13px', color: '#92400e' }}>
                                <i className="bx bx-check" style={{ marginRight: '6px', color: '#d97706' }} />
                                {p.bookingCancelPolicy?.policy}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Property Rules */}
            {property.propertyRule?.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
                    <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bx bx-list-ul" style={{ color: '#7c3aed' }} /> Property Rules
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {property.propertyRule.map(r => (
                            <div key={r.id} style={{ padding: '10px 14px', borderRadius: '8px', background: '#f5f3ff', border: '1px solid #ddd6fe', fontSize: '13px', color: '#5b21b6' }}>
                                <span style={{ fontWeight: '700', marginRight: '6px' }}>{r.propertyRulePolicy?.type}:</span>
                                {r.propertyRulePolicy?.policy}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Registration Doc */}
            {property.registrationDoc && (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
                    <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bx bx-file" style={{ color: '#2563eb' }} /> Registration Document
                    </h4>
                    <a href={property.registrationDoc} target="_blank" rel="noreferrer">
                        <img src={property.registrationDoc} alt="Registration Doc"
                            style={{ maxWidth: '300px', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                            onError={e => { e.target.style.display = 'none'; }}
                        />
                    </a>
                </div>
            )}

            {/* Property Images */}
            {property.propertyImage?.length > 0 && (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '20px' }}>
                    <h4 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="bx bx-image" style={{ color: '#059669' }} /> Property Images
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {property.propertyImage.map(img => (
                            img.image?.match(/\.(mp4|webm|ogg)$/i) ? (
                                <video key={img.id} src={img.image} controls style={{ width: '200px', height: '140px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                            ) : (
                                <a key={img.id} href={img.image} target="_blank" rel="noreferrer">
                                    <img src={img.image} alt="Property" style={{ width: '200px', height: '140px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                                </a>
                            )
                        ))}
                    </div>
                </div>
            )}

            {/* Status Modal */}
            <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title="Change Property Status" width="500px">
                <div className="status-container-horizontal">
                    {PROPERTY_STATUSES.map((s) => (
                        <div key={s} className={`status-option status-${s.toLowerCase()}`}>
                            <input id={`det-status-${s}`} type="radio" name="detPropStatus" checked={selectedStatus === s} onChange={() => setSelectedStatus(s)} value={s} />
                            <label htmlFor={`det-status-${s}`}>{s}</label>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                        { label: 'Property Name', key: 'name' },
                        { label: 'Check-In Time', key: 'checkInTime' },
                        { label: 'Check-Out Time', key: 'checkOutTime' },
                        { label: 'Contact Person Name', key: 'contactPersonName' },
                        { label: 'Contact Person Mobile', key: 'contactPersonMobile' },
                    ].map(({ label, key }) => (
                        <div key={key}>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>{label}</label>
                            <input
                                value={editForm[key] || ''}
                                onChange={(e) => setEditForm((p) => ({ ...p, [key]: e.target.value }))}
                                style={{ width: '100%', padding: '8px' }}
                            />
                        </div>
                    ))}
                </div>
                <div className="button-group-modal">
                    <button className="confirm-button" onClick={handleEditSave} disabled={uploading}>{uploading ? "Saving..." : "Update"}</button>
                    <button className="cancel-button" onClick={() => setEditModal(false)}>Cancel</button>
                </div>
            </Modal>
        </>
    );
};

export default PropertyDetails;
