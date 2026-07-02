import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPayments } from "../../store/slice/paymentSlice";
import Pagination from "../../Components/Pagination/Pagination";
import Modal from "../../Components/Modal/Modal";
import { Tooltip } from "react-tooltip";

const STATUS_STYLE = {
    COMPLETED: { background: "rgba(34,197,94,0.1)", color: "#16a34a" },
    CANCELLED: { background: "rgba(239,68,68,0.1)", color: "#dc2626" },
    PENDING: { background: "rgba(245,158,11,0.1)", color: "#d97706" },
};

const PaymentHistory = () => {
    const dispatch = useDispatch();
    const { payments, total } = useSelector((state) => state.payment);

    const [pagination, setPagination] = useState({ limit: 10, offset: 0, currentPage: 1, keyword: "" });
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        dispatch(fetchAllPayments({ limit: pagination.limit, offset: pagination.offset, keyword: pagination.keyword }));
    }, [dispatch, pagination.limit, pagination.offset, pagination.keyword]);

    useEffect(() => {
        const t = setTimeout(() => setPagination(p => ({ ...p, keyword: search, offset: 0, currentPage: 1 })), 600);
        return () => clearTimeout(t);
    }, [search]);

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-credit-card" />
                    <h2>Payment History</h2>
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search by invoice, transaction, phone..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: "8px", width: "320px" }}
                />
                <span style={{ fontSize: "13px", color: "#6b7280" }}>{total} total payments</span>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Invoice No.</th>
                            <th>Phone</th>
                            <th>Guest Name</th>
                            <th>Amount</th>
                            <th>Mode</th>
                            <th>Coupon</th>
                            <th>Booking Status</th>
                            <th>Payment Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments?.map((item, index) => (
                            <tr key={item.id}>
                                <td>{pagination.offset + index + 1}</td>
                                <td style={{ fontWeight: 600, fontSize: "12px" }}>{item.invoiceNumber}</td>
                                <td>{item.account?.phoneNumber || "-"}</td>
                                <td>{item.bookRoom?.name || "-"}</td>
                                <td style={{ fontWeight: 700, color: "#059669" }}>₹{item.amount?.toLocaleString()}</td>
                                <td>{item.mode}</td>
                                <td>
                                    {item.coupon ? (
                                        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", fontWeight: 600 }}>
                                            {item.coupon.code} ({item.coupon.discount}{item.coupon.discountType === "PERCENTAGE" ? "%" : "₹"} off)
                                        </span>
                                    ) : "-"}
                                </td>
                                <td>
                                    <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 700, ...(STATUS_STYLE[item.bookRoom?.status] || {}) }}>
                                        {item.bookRoom?.status || "-"}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 700, ...(STATUS_STYLE[item.status] || {}) }}>
                                        {item.status}
                                    </span>
                                </td>
                                <td style={{ fontSize: "12px" }}>{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="table-action-button">
                                        <div className="action-icon" onClick={() => { setSelected(item); setModal(true); }} data-tooltip-id="pay-view-tip" data-tooltip-content="View Details">
                                            <i className="bx bx-info-circle text-olive" />
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
                totalItem={total || 0}
                limitSelect={true}
                itemsPerPage={pagination.limit}
                showEllipsisAfter={true}
                visiblePageCount={3}
                onPageChange={page => setPagination(p => ({ ...p, currentPage: page, offset: p.limit * (page - 1) }))}
                onItemsLimitChange={limit => setPagination(p => ({ ...p, limit, offset: 0, currentPage: 1 }))}
            />

            <Modal isOpen={modal} onClose={() => setModal(false)} title="Payment Details" width="620px">
                {selected && (
                    <div className="details-content">
                        {[
                            ["Invoice No.", selected.invoiceNumber],
                            ["Transaction ID", selected.transactionId],
                            ["Order ID", selected.orderId],
                            ["Payment ID", selected.paymentId],
                            ["Amount", `₹${selected.amount?.toLocaleString()}`],
                            ["Mode", selected.mode],
                            ["Payment Status", selected.status],
                            ["Phone", selected.account?.phoneNumber || "-"],
                            ["Guest Name", selected.bookRoom?.name || "-"],
                            ["Guest Phone", selected.bookRoom?.phone || "-"],
                            ["Guest Email", selected.bookRoom?.email || "-"],
                            ["Address", selected.bookRoom?.address || "-"],
                            ["Check-In", selected.bookRoom?.checkIn ? new Date(selected.bookRoom.checkIn).toLocaleDateString() : "-"],
                            ["Check-Out", selected.bookRoom?.checkOut ? new Date(selected.bookRoom.checkOut).toLocaleDateString() : "-"],
                            ["Booking Status", selected.bookRoom?.status || "-"],
                            ["Coupon", selected.coupon ? `${selected.coupon.title} (${selected.coupon.code})` : "-"],
                            ["Discount", selected.coupon ? `${selected.coupon.discount}${selected.coupon.discountType === "PERCENTAGE" ? "%" : "₹"}` : "-"],
                            ["Date", new Date(selected.createdAt).toLocaleString()],
                        ].map(([label, value]) => (
                            <div className="detail-item" key={label}>
                                <label>{label}:</label>
                                <span>{value}</span>
                            </div>
                        ))}
                    </div>
                )}
                <div className="button-group-modal">
                    <button className="cancel-button" onClick={() => setModal(false)}>Close</button>
                </div>
            </Modal>

            <Tooltip id="pay-view-tip" />
        </>
    );
};

export default PaymentHistory;
