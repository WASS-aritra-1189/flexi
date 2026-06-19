import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { services } from "../../shared/_services/api_services";
import Pagination from "../../Components/Pagination/Pagination";

const statusList = ["", "WAITING", "CONFIRMED", "CANCELLED", "COMPLETED"];

const UserBookingHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({ result: [], total: 0 });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const [paginationState, setPaginationState] = useState({ limit: 10, offset: 0, currentPage: 1 });

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await services.getUserBookingHistory(id, {
                    limit: paginationState.limit,
                    offset: paginationState.offset,
                    status,
                });
                setData(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id, paginationState.limit, paginationState.offset, status]);

    const pageChange = (page) => {
        setPaginationState((prev) => ({ ...prev, currentPage: page, offset: prev.limit * (page - 1) }));
    };

    const itemsLimitChange = (limit) => {
        setPaginationState((prev) => ({ ...prev, limit, offset: 0, currentPage: 1 }));
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-calendar"></i>
                    <h2>Booking History</h2>
                    <span
                        onClick={() => navigate(-1)}
                        style={{ marginLeft: "auto", cursor: "pointer", color: "#007bff", fontSize: "14px" }}
                    >
                        ← Back
                    </span>
                </div>
            </div>

            <div className="status-and-add-icon" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                <select value={status} onChange={(e) => { setStatus(e.target.value); setPaginationState((p) => ({ ...p, offset: 0, currentPage: 1 })); }} style={{ padding: "8px" }}>
                    {statusList.map((s) => (
                        <option key={s} value={s}>{s === "" ? "All" : s}</option>
                    ))}
                </select>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Property</th>
                            <th>Location</th>
                            <th>Quantity</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Hours</th>
                            <th>Pay Status</th>
                            <th>Booking Status</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={10} style={{ textAlign: "center" }}>Loading...</td></tr>
                        ) : data.result.length === 0 ? (
                            <tr><td colSpan={10} style={{ textAlign: "center" }}>No booking history found.</td></tr>
                        ) : (
                            data.result.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{paginationState.offset + index + 1}</td>
                                    <td style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        {item.property?.propertyImage?.[0]?.image && (
                                            <img
                                                src={item.property.propertyImage[0].image}
                                                alt="property"
                                                style={{ width: "36px", height: "36px", borderRadius: "4px", objectFit: "cover" }}
                                            />
                                        )}
                                        {item.property?.name || "-"}
                                    </td>
                                    <td>{item.property ? `${item.property.city}, ${item.property.state}` : "-"}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.checkIn ? new Date(item.checkIn).toLocaleDateString() : "-"}</td>
                                    <td>{item.checkOut ? new Date(item.checkOut).toLocaleDateString() : "-"}</td>
                                    <td>{item.hours ?? "-"}</td>
                                    <td>
                                        <span className={`status-badge status-${item.payStatus?.toLowerCase()}`}>{item.payStatus}</span>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${item.status?.toLowerCase()}`}>{item.status}</span>
                                    </td>
                                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={paginationState.currentPage}
                totalItem={data.total || 0}
                limitSelect={true}
                itemsPerPage={paginationState.limit}
                showEllipsisAfter={true}
                visiblePageCount={3}
                onPageChange={pageChange}
                onItemsLimitChange={itemsLimitChange}
            />
        </>
    );
};

export default UserBookingHistory;
