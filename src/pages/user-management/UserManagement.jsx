import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserList } from "../../store/slice/accountSlice";
import Modal from "../../Components/Modal/Modal";
import Pagination from "../../Components/Pagination/Pagination";
import { Tooltip } from "react-tooltip";

const UserManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userList, userListCount } = useSelector((state) => state.account);
    const { uploading } = useSelector((state) => state.loader);

    const [paginationState, setPaginationState] = useState({
        limit: 10,
        offset: 0,
        currentPage: 1,
        keyword: "",
    });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [status, setStatus] = useState("");
    const [statusModal, setStatusModal] = useState(false);
    const [stateStatus, setStateStatus] = useState("");
    const [statusUserId, setStatusUserId] = useState(null);

    const statusList = ["PENDING", "ACTIVE", "DEACTIVE", "DELETED"];

    useEffect(() => {
        dispatch(
            fetchUserList({
                limit: paginationState.limit,
                offset: paginationState.offset,
                keyword: paginationState.keyword,
                status,
            })
        );
    }, [dispatch, paginationState.limit, paginationState.offset, paginationState.keyword, status]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPaginationState((prev) => ({ ...prev, keyword: searchKeyword, offset: 0, currentPage: 1 }));
        }, 700);
        return () => clearTimeout(timer);
    }, [searchKeyword]);

    const handleStatusModal = (id, currentStatus) => {
        setStatusUserId(id);
        setStateStatus(currentStatus);
        setStatusModal(true);
    };

    // const changeSaveStatus = () => {
    //     dispatch(
    //         changeUserStatus(
    //             { accountId: statusUserId, status: stateStatus },
    //             { limit: paginationState.limit, offset: paginationState.offset, keyword: paginationState.keyword, status }
    //         )
    //     );
    //     setStatusModal(false);
    // };

    const pageChange = (page) => {
        setPaginationState((prev) => ({ ...prev, currentPage: page, offset: prev.limit * (page - 1) }));
    };

    const itemsLimitChange = (limit) => {
        setPaginationState((prev) => ({ ...prev, limit, offset: 0, currentPage: 1 }));
    };

    const handleRefresh = () => {
        dispatch(fetchUserList({ limit: paginationState.limit, offset: paginationState.offset, keyword: paginationState.keyword, status }));
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-user"></i>
                    <h2>User Management</h2>
                </div>
            </div>

            <div className="status-and-add-icon" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search by name, phone, email..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    style={{ padding: "8px", width: "300px" }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <span onClick={handleRefresh} style={{ cursor: "pointer" }} data-tooltip-id="refresh-tooltip" data-tooltip-content="Refresh">
                        <i className="bx bx-refresh" style={{ fontSize: "35px", color: "#007bff", marginBottom: "8px" }}></i>
                    </span>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: "8px" }}>
                        <option value="">All</option>
                        {statusList.map((st) => (
                            <option key={st} value={st}>{st}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Profile</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>DOB</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userList?.map((user, index) => (
                            <tr key={user.id}>
                                <td>{paginationState.offset + index + 1}</td>
                                <td>
                                    {user.userDetail?.[0]?.image ? (
                                        <img
                                            src={user.userDetail[0].image}
                                            alt="Profile"
                                            style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <i className="bx bx-user" style={{ fontSize: "20px", color: "#666" }}></i>
                                        </div>
                                    )}
                                </td>
                                <td>{user.userDetail?.[0]?.name || "-"}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{user.userDetail?.[0]?.email || "-"}</td>
                                <td>{user.userDetail?.[0]?.dob || "-"}</td>
                                <td>{user.userDetail?.[0]?.address || "-"}</td>
                                <td>
                                    <span className={`status-badge status-${user.status?.toLowerCase()}`}>{user.status}</span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="table-action-button">
                                        <div
                                            className="action-icon"
                                            onClick={() => navigate(`/users/${user.id}/payment-history`)}
                                            data-tooltip-id="payment-tooltip"
                                            data-tooltip-content="Payment History"
                                        >
                                            <i className="bx bx-credit-card text-primary"></i>
                                        </div>
                                        <div
                                            className="action-icon"
                                            onClick={() => navigate(`/users/${user.id}/booking-history`)}
                                            data-tooltip-id="booking-tooltip"
                                            data-tooltip-content="Booking History"
                                        >
                                            <i className="bx bx-calendar text-success"></i>
                                        </div>
                                    </div>
                                </td>
                                {/* <td>
                                    <div className="table-action-button">
                                        <div className="action-icon" onClick={() => handleStatusModal(user.id, user.status)} data-tooltip-id="status-tooltip" data-tooltip-content="Change Status">
                                            <i className="bx bx-cog text-warning"></i>
                                        </div>
                                    </div>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={paginationState.currentPage}
                totalItem={userListCount || 0}
                limitSelect={true}
                itemsPerPage={paginationState.limit}
                showEllipsisAfter={true}
                visiblePageCount={3}
                onPageChange={pageChange}
                onItemsLimitChange={itemsLimitChange}
            />

            {/* <Modal isOpen={statusModal} onClose={() => setStatusModal(false)} title="Status" width="600px">
                <div className="status-container-horizontal">
                    {["ACTIVE", "DEACTIVE", "DELETED", "SUSPENDED", "PENDING"].map((s) => (
                        <div key={s} className={`status-option status-${s.toLowerCase()}`}>
                            <input id={s} type="radio" name="status" checked={stateStatus === s} onChange={(e) => setStateStatus(e.target.value)} value={s} />
                            <label htmlFor={s}>{s}</label>
                        </div>
                    ))}
                </div>
                <div className="button-group-modal">
                    <button className="confirm-button" onClick={changeSaveStatus}>{uploading ? "Saving..." : "Confirm"}</button>
                    <button className="cancel-button" onClick={() => setStatusModal(false)}>Cancel</button>
                </div>
            </Modal> */}

            <Tooltip id="refresh-tooltip" />
            <Tooltip id="payment-tooltip" />
            <Tooltip id="booking-tooltip" />
            <Tooltip id="status-tooltip" />
        </>
    );
};

export default UserManagement;
