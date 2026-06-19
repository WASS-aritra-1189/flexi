import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { services } from "../../shared/_services/api_services";
import Pagination from "../../Components/Pagination/Pagination";

const UserPaymentHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({ result: [], total: 0 });
    const [loading, setLoading] = useState(false);
    const [paginationState, setPaginationState] = useState({ limit: 10, offset: 0, currentPage: 1, keyword: "" });

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await services.getUserPaymentHistory(id, {
                    limit: paginationState.limit,
                    offset: paginationState.offset,
                    keyword: paginationState.keyword,
                });
                setData(res.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id, paginationState.limit, paginationState.offset, paginationState.keyword]);

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
                    <i className="bx bx-credit-card" style={{ cursor: "pointer" }} onClick={() => navigate(-1)}></i>
                    <h2>Payment History</h2>
                    <span
                        onClick={() => navigate(-1)}
                        style={{ marginLeft: "auto", cursor: "pointer", color: "#007bff", fontSize: "14px" }}
                    >
                        ← Back
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Invoice</th>
                            <th>Transaction ID</th>
                            <th>Amount</th>
                            <th>Mode</th>
                            <th>Status</th>
                            <th>Guest Name</th>
                            <th>Check In</th>
                            <th>Check Out</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={10} style={{ textAlign: "center" }}>Loading...</td></tr>
                        ) : data.result.length === 0 ? (
                            <tr><td colSpan={10} style={{ textAlign: "center" }}>No payment history found.</td></tr>
                        ) : (
                            data.result.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{paginationState.offset + index + 1}</td>
                                    <td>{item.invoiceNumber}</td>
                                    <td>{item.transactionId}</td>
                                    <td>₹{item.amount}</td>
                                    <td>{item.mode}</td>
                                    <td>
                                        <span className={`status-badge status-${item.status?.toLowerCase()}`}>{item.status}</span>
                                    </td>
                                    <td>{item.bookRoom?.name || "-"}</td>
                                    <td>{item.bookRoom?.checkIn ? new Date(item.bookRoom.checkIn).toLocaleDateString() : "-"}</td>
                                    <td>{item.bookRoom?.checkOut ? new Date(item.bookRoom.checkOut).toLocaleDateString() : "-"}</td>
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

export default UserPaymentHistory;
