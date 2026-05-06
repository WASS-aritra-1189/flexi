import { useState } from "react";
import Modal from "../../Components/Modal/Modal";
import Pagination from "../../Components/Pagination/Pagination";
import { Tooltip } from "react-tooltip";
import "./ContactUs.scss";

// Mock data — replace with API call via Redux slice
const MOCK_MESSAGES = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", subject: "Booking Issue", message: "I made a booking last week but haven't received a confirmation email. Can you please check?", status: "UNREAD", createdAt: "2025-01-10T09:23:00Z" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", subject: "Refund Request", message: "I cancelled my trip 5 days ago and still haven't received my refund. Please look into this urgently.", status: "READ", createdAt: "2025-01-11T14:05:00Z" },
    { id: 3, name: "Carol White", email: "carol@example.com", subject: "Payment Failed", message: "My payment keeps failing at checkout even though my card is valid. Please help.", status: "REPLIED", createdAt: "2025-01-12T08:47:00Z" },
    { id: 4, name: "David Lee", email: "david@example.com", subject: "Account Access", message: "I cannot log into my account. The password reset email is not arriving.", status: "UNREAD", createdAt: "2025-01-13T11:30:00Z" },
    { id: 5, name: "Eva Martinez", email: "eva@example.com", subject: "Trip Modification", message: "I would like to change the dates of my upcoming trip. Is that possible?", status: "READ", createdAt: "2025-01-14T16:20:00Z" },
];

const STATUS_COLORS = {
    UNREAD: "status-pending",
    READ: "status-active",
    REPLIED: "status-deactive",
};

const ContactUs = () => {
    const [messages] = useState(MOCK_MESSAGES);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [paginationState, setPaginationState] = useState({ limit: 10, offset: 0, currentPage: 1 });
    const [detailsModal, setDetailsModal] = useState(false);
    const [replyModal, setReplyModal] = useState(false);
    const [selectedMsg, setSelectedMsg] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [replyError, setReplyError] = useState("");

    const filtered = messages.filter(m => {
        const matchesSearch =
            m.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            m.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            m.subject.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchesStatus = filterStatus === "ALL" || m.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const paginated = filtered.slice(paginationState.offset, paginationState.offset + paginationState.limit);

    const handleView = (msg) => {
        setSelectedMsg(msg);
        setDetailsModal(true);
    };

    const handleReplyOpen = (msg) => {
        setSelectedMsg(msg);
        setReplyText("");
        setReplyError("");
        setReplyModal(true);
    };

    const handleReplySend = () => {
        if (!replyText.trim()) {
            setReplyError("* Reply message is required");
            return;
        }
        // TODO: dispatch reply API action
        setReplyModal(false);
    };

    const pageChange = (page) => {
        setPaginationState(prev => ({ ...prev, currentPage: page, offset: prev.limit * (page - 1) }));
    };

    const itemsLimitChange = (limit) => {
        setPaginationState({ limit, offset: 0, currentPage: 1 });
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-envelope"></i>
                    <h2>Contact Us — User Messages</h2>
                </div>
            </div>

            <div className="status-and-add-icon" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search by name, email or subject..."
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                    style={{ padding: "8px", width: "300px" }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "8px" }}>
                        <option value="ALL">ALL</option>
                        <option value="UNREAD">UNREAD</option>
                        <option value="READ">READ</option>
                        <option value="REPLIED">REPLIED</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Received At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
                                    No messages found.
                                </td>
                            </tr>
                        ) : paginated.map((msg, index) => (
                            <tr key={msg.id} className={msg.status === "UNREAD" ? "contact-row-unread" : ""}>
                                <td>{paginationState.offset + index + 1}</td>
                                <td style={{ fontWeight: msg.status === "UNREAD" ? 700 : 400 }}>{msg.name}</td>
                                <td>{msg.email}</td>
                                <td style={{ fontWeight: msg.status === "UNREAD" ? 700 : 400 }}>{msg.subject}</td>
                                <td>{msg.message.substring(0, 50)}{msg.message.length > 50 ? "..." : ""}</td>
                                <td>
                                    <span className={`status-badge ${STATUS_COLORS[msg.status]}`}>
                                        {msg.status}
                                    </span>
                                </td>
                                <td>{new Date(msg.createdAt).toLocaleString()}</td>
                                <td>
                                    <div className="table-action-button">
                                        <div className="action-icon" onClick={() => handleView(msg)} data-tooltip-id="view-tooltip" data-tooltip-content="View Message">
                                            <i className="bx bx-info-circle text-olive"></i>
                                        </div>
                                        <div className="action-icon" onClick={() => handleReplyOpen(msg)} data-tooltip-id="reply-tooltip" data-tooltip-content="Reply">
                                            <i className="bx bx-reply text-info"></i>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={paginationState.currentPage}
                totalItem={filtered.length}
                limitSelect={true}
                itemsPerPage={paginationState.limit}
                showEllipsisAfter={true}
                visiblePageCount={3}
                onPageChange={pageChange}
                onItemsLimitChange={itemsLimitChange}
            />

            {/* View Details Modal */}
            <Modal isOpen={detailsModal} onClose={() => setDetailsModal(false)} title="Message Details" width="600px">
                {selectedMsg && (
                    <div className="details-content">
                        <div className="detail-item"><label>Name:</label><span>{selectedMsg.name}</span></div>
                        <div className="detail-item"><label>Email:</label><span>{selectedMsg.email}</span></div>
                        <div className="detail-item"><label>Subject:</label><span>{selectedMsg.subject}</span></div>
                        <div className="detail-item"><label>Status:</label>
                            <span className={`status-badge ${STATUS_COLORS[selectedMsg.status]}`}>{selectedMsg.status}</span>
                        </div>
                        <div className="detail-item"><label>Received At:</label><span>{new Date(selectedMsg.createdAt).toLocaleString()}</span></div>
                        <div className="detail-item contact-message-full"><label>Message:</label><span>{selectedMsg.message}</span></div>
                    </div>
                )}
                <div className="button-group-modal">
                    <button className="confirm-button" onClick={() => { setDetailsModal(false); handleReplyOpen(selectedMsg); }}>
                        <i className="bx bx-reply" style={{ marginRight: "6px" }}></i>Reply
                    </button>
                    <button className="cancel-button" onClick={() => setDetailsModal(false)}>Close</button>
                </div>
            </Modal>

            {/* Reply Modal */}
            <Modal isOpen={replyModal} onClose={() => setReplyModal(false)} title="Reply to Message" width="600px">
                {selectedMsg && (
                    <div className="edit-form">
                        <div className="form-group">
                            <label>To</label>
                            <input type="text" className="form-control" value={`${selectedMsg.name} <${selectedMsg.email}>`} disabled />
                        </div>
                        <div className="form-group">
                            <label>Subject</label>
                            <input type="text" className="form-control" value={`Re: ${selectedMsg.subject}`} disabled />
                        </div>
                        <div className="form-group">
                            <label>Reply</label>
                            <textarea
                                className="form-control"
                                rows="5"
                                placeholder="Write your reply here..."
                                value={replyText}
                                onChange={e => { setReplyText(e.target.value); setReplyError(""); }}
                            />
                            {replyError && <span className="err-msg">{replyError}</span>}
                        </div>
                        <div className="button-group-modal">
                            <button className="confirm-button" onClick={handleReplySend}>
                                <i className="bx bx-send" style={{ marginRight: "6px" }}></i>Send Reply
                            </button>
                            <button className="cancel-button" onClick={() => setReplyModal(false)}>Cancel</button>
                        </div>
                    </div>
                )}
            </Modal>

            <Tooltip id="view-tooltip" />
            <Tooltip id="reply-tooltip" />
        </>
    );
};

export default ContactUs;
