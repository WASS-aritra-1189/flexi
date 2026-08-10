import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../Components/Modal/Modal";
import Pagination from "../../Components/Pagination/Pagination";
import { Tooltip } from "react-tooltip";
import {
  fetchPoolDetails,
  addPointsToPool,
  distributePointsToUser,
  deductUserPoints,
  fetchPoolTransactions,
  fetchAllTransactions,
  fetchUsersWithPoints,
  fetchUserPointsById,
  clearSelectedUserPoints,
} from "../../store/slice/rewardPoolSlice";

const RewardPool = () => {
  const dispatch = useDispatch();
  const { poolDetails, poolTransactions, poolTransactionsCount, allTransactions, allTransactionsCount, usersWithPoints, usersWithPointsCount, selectedUserPoints } = useSelector((state) => state.rewardPool);
  const { uploading } = useSelector((state) => state.loader);

  const [activeTab, setActiveTab] = useState("pool");
  const [paginationState, setPaginationState] = useState({ limit: 10, offset: 0, currentPage: 1, keyword: "" });
  const [searchKeyword, setSearchKeyword] = useState("");

  // Modals
  const [addPointsModal, setAddPointsModal] = useState(false);
  const [distributeModal, setDistributeModal] = useState(false);
  const [deductModal, setDeductModal] = useState(false);
  const [userPointsModal, setUserPointsModal] = useState(false);

  // Form states
  const [addPointsForm, setAddPointsForm] = useState({ points: "" });
  const [distributeForm, setDistributeForm] = useState({ userId: "", points: "", description: "" });
  const [deductForm, setDeductForm] = useState({ userId: "", points: "", description: "" });

  useEffect(() => {
    dispatch(fetchPoolDetails());
    if (activeTab === "pool") {
      dispatch(fetchPoolTransactions({ limit: paginationState.limit, offset: paginationState.offset }));
    } else if (activeTab === "transactions") {
      dispatch(fetchAllTransactions({ limit: paginationState.limit, offset: paginationState.offset }));
    } else if (activeTab === "users") {
      dispatch(fetchUsersWithPoints({ limit: paginationState.limit, offset: paginationState.offset, keyword: paginationState.keyword }));
    }
  }, [dispatch, activeTab, paginationState.limit, paginationState.offset, paginationState.keyword]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPaginationState((prev) => ({ ...prev, keyword: searchKeyword, offset: 0, currentPage: 1 }));
    }, 700);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const pageChange = (page) => {
    setPaginationState((prev) => ({ ...prev, currentPage: page, offset: prev.limit * (page - 1) }));
  };

  const itemsLimitChange = (limit) => {
    setPaginationState((prev) => ({ ...prev, limit, offset: 0, currentPage: 1 }));
  };

  const handleAddPoints = () => {
    if (!addPointsForm.points || addPointsForm.points <= 0) return;
    dispatch(addPointsToPool(addPointsForm.points, () => {
      setAddPointsForm({ points: "" });
      setAddPointsModal(false);
    }));
  };

  const handleDistribute = () => {
    if (!distributeForm.userId || !distributeForm.points || distributeForm.points <= 0) return;
    dispatch(distributePointsToUser(distributeForm, { limit: paginationState.limit, offset: paginationState.offset, keyword: "" }, () => {
      setDistributeForm({ userId: "", points: "", description: "" });
      setDistributeModal(false);
    }));
  };

  const handleDeduct = () => {
    if (!deductForm.userId || !deductForm.points || deductForm.points <= 0) return;
    dispatch(deductUserPoints(deductForm, { limit: paginationState.limit, offset: paginationState.offset, keyword: "" }, () => {
      setDeductForm({ userId: "", points: "", description: "" });
      setDeductModal(false);
    }));
  };

  const handleViewUserPoints = (userId) => {
    dispatch(fetchUserPointsById(userId));
    setUserPointsModal(true);
  };

  const openDistributeModal = (user) => {
    setDistributeForm({ userId: user.id, points: "", description: "" });
    setDistributeModal(true);
  };

  const openDeductModal = (user) => {
    setDeductForm({ userId: user.id, points: "", description: "" });
    setDeductModal(true);
  };

  const getTotalCount = () => {
    if (activeTab === "pool") return poolTransactionsCount;
    if (activeTab === "transactions") return allTransactionsCount;
    if (activeTab === "users") return usersWithPointsCount;
    return 0;
  };

  const getCurrentData = () => {
    if (activeTab === "pool") return poolTransactions;
    if (activeTab === "transactions") return allTransactions;
    if (activeTab === "users") return usersWithPoints;
    return [];
  };

  const getTransactionTypeBadge = (type) => {
    const badges = {
      ADDED: { class: "status-active", text: "Added" },
      DISTRIBUTED: { class: "status-pending", text: "Distributed" },
      USED: { class: "status-deactive", text: "Used" },
      DEDUCTED: { class: "status-deactive", text: "Deducted" },
    };
    const badge = badges[type] || { class: "", text: type };
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  return (
    <>
      <div className="logo-management-card">
        <div className="card-header">
          <i className="bx bx-gift"></i>
          <h2>Reward Pool Management</h2>
        </div>
      </div>

      {/* Pool Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "20px" }}>
        <div className="stats-card">
          <h3>Total Points</h3>
          <p>{poolDetails?.totalPoints || 0}</p>
        </div>
        <div className="stats-card">
          <h3>Available Points</h3>
          <p>{poolDetails?.availablePoints || 0}</p>
        </div>
        <div className="stats-card">
          <h3>Used Points</h3>
          <p>{poolDetails?.usedPoints || 0}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button className="confirm-button" onClick={() => setAddPointsModal(true)}>
          <i className="bx bx-plus"></i> Add Points to Pool
        </button>
      </div>

      {/* Tabs */}
      <div className="tabs-container" style={{ marginBottom: "20px" }}>
        <button className={`tab-button ${activeTab === "pool" ? "active" : ""}`} onClick={() => setActiveTab("pool")}>
          Pool Transactions
        </button>
        <button className={`tab-button ${activeTab === "transactions" ? "active" : ""}`} onClick={() => setActiveTab("transactions")}>
          All Transactions
        </button>
        <button className={`tab-button ${activeTab === "users" ? "active" : ""}`} onClick={() => setActiveTab("users")}>
          Users with Points
        </button>
      </div>

      {/* Search for Users tab */}
      {activeTab === "users" && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search by name, phone, email..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ padding: "8px", width: "300px" }}
          />
        </div>
      )}

      {/* Data Table */}
      <div className="table-container">
        <table className="membership-table">
          <thead>
            <tr>
              <th>#</th>
              {activeTab === "users" ? (
                <>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Points</th>
                  <th>Actions</th>
                </>
              ) : (
                <>
                  <th>Type</th>
                  <th>Points</th>
                  <th>Description</th>
                  <th>Balance Before</th>
                  <th>Balance After</th>
                  <th>Date</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {getCurrentData()?.map((item, index) => (
              <tr key={item.id}>
                <td>{paginationState.offset + index + 1}</td>
                {activeTab === "users" ? (
                  <>
                    <td>{item.name || "-"}</td>
                    <td>{item.email || "-"}</td>
                    <td>{item.phoneNumber || "-"}</td>
                    <td>{item.totalPoint || 0}</td>
                    <td>
                      <div className="table-action-button">
                        <div className="action-icon" onClick={() => handleViewUserPoints(item.id)} data-tooltip-id="view-tooltip" data-tooltip-content="View Details">
                          <i className="bx bx-eye text-primary"></i>
                        </div>
                        <div className="action-icon" onClick={() => openDistributeModal(item)} data-tooltip-id="distribute-tooltip" data-tooltip-content="Distribute Points">
                          <i className="bx bx-plus-circle text-success"></i>
                        </div>
                        <div className="action-icon" onClick={() => openDeductModal(item)} data-tooltip-id="deduct-tooltip" data-tooltip-content="Deduct Points">
                          <i className="bx bx-minus-circle text-danger"></i>
                        </div>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{getTransactionTypeBadge(item.type)}</td>
                    <td>{item.points}</td>
                    <td>{item.description || "-"}</td>
                    <td>{item.balanceBefore}</td>
                    <td>{item.balanceAfter}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={paginationState.currentPage}
        totalItem={getTotalCount()}
        limitSelect={true}
        itemsPerPage={paginationState.limit}
        showEllipsisAfter={true}
        visiblePageCount={3}
        onPageChange={pageChange}
        onItemsLimitChange={itemsLimitChange}
      />

      {/* Add Points Modal */}
      <Modal isOpen={addPointsModal} onClose={() => setAddPointsModal(false)} title="Add Points to Pool" width="400px">
        <div style={{ marginBottom: "15px" }}>
          <label>Points Amount</label>
          <input
            type="number"
            value={addPointsForm.points}
            onChange={(e) => setAddPointsForm({ points: e.target.value })}
            placeholder="Enter points"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div className="button-group-modal">
          <button className="confirm-button" onClick={handleAddPoints} disabled={uploading}>
            {uploading ? "Adding..." : "Add Points"}
          </button>
          <button className="cancel-button" onClick={() => setAddPointsModal(false)}>Cancel</button>
        </div>
      </Modal>

      {/* Distribute Points Modal */}
      <Modal isOpen={distributeModal} onClose={() => setDistributeModal(false)} title="Distribute Points to User" width="400px">
        <div style={{ marginBottom: "15px" }}>
          <label>User ID</label>
          <input
            type="text"
            value={distributeForm.userId}
            readOnly
            style={{ width: "100%", padding: "8px", marginTop: "5px", background: "#f5f5f5" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Points</label>
          <input
            type="number"
            value={distributeForm.points}
            onChange={(e) => setDistributeForm({ ...distributeForm, points: e.target.value })}
            placeholder="Enter points"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Description (Optional)</label>
          <input
            type="text"
            value={distributeForm.description}
            onChange={(e) => setDistributeForm({ ...distributeForm, description: e.target.value })}
            placeholder="Enter description"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div className="button-group-modal">
          <button className="confirm-button" onClick={handleDistribute} disabled={uploading}>
            {uploading ? "Distributing..." : "Distribute"}
          </button>
          <button className="cancel-button" onClick={() => setDistributeModal(false)}>Cancel</button>
        </div>
      </Modal>

      {/* Deduct Points Modal */}
      <Modal isOpen={deductModal} onClose={() => setDeductModal(false)} title="Deduct Points from User" width="400px">
        <div style={{ marginBottom: "15px" }}>
          <label>User ID</label>
          <input
            type="text"
            value={deductForm.userId}
            readOnly
            style={{ width: "100%", padding: "8px", marginTop: "5px", background: "#f5f5f5" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Points to Deduct</label>
          <input
            type="number"
            value={deductForm.points}
            onChange={(e) => setDeductForm({ ...deductForm, points: e.target.value })}
            placeholder="Enter points"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Reason (Optional)</label>
          <input
            type="text"
            value={deductForm.description}
            onChange={(e) => setDeductForm({ ...deductForm, description: e.target.value })}
            placeholder="Enter reason"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>
        <div className="button-group-modal">
          <button className="confirm-button" onClick={handleDeduct} disabled={uploading}>
            {uploading ? "Deducting..." : "Deduct"}
          </button>
          <button className="cancel-button" onClick={() => setDeductModal(false)}>Cancel</button>
        </div>
      </Modal>

      {/* User Points Detail Modal */}
      <Modal isOpen={userPointsModal} onClose={() => { setUserPointsModal(false); dispatch(clearSelectedUserPoints()); }} title="User Points Details" width="400px">
        {selectedUserPoints && (
          <div>
            <p><strong>User ID:</strong> {selectedUserPoints.id}</p>
            <p><strong>Email:</strong> {selectedUserPoints.email || "-"}</p>
            <p><strong>Phone:</strong> {selectedUserPoints.phoneNumber || "-"}</p>
            <p><strong>Total Points:</strong> {selectedUserPoints.totalPoint || 0}</p>
          </div>
        )}
      </Modal>

      <Tooltip id="view-tooltip" />
      <Tooltip id="distribute-tooltip" />
      <Tooltip id="deduct-tooltip" />

      {/* Custom Styles */}
      <style>{`
        .stats-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .stats-card h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          color: #666;
        }
        .stats-card p {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        .tabs-container {
          display: flex;
          gap: 10px;
          border-bottom: 2px solid #e0e0e0;
        }
        .tab-button {
          padding: 10px 20px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          margin-bottom: -2px;
        }
        .tab-button.active {
          border-bottom-color: #007bff;
          color: #007bff;
          font-weight: bold;
        }
      `}</style>
    </>
  );
};

export default RewardPool;