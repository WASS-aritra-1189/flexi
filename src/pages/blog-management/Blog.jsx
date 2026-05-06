import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "../../Components/Pagination/Pagination";
import { Tooltip } from "react-tooltip";
import Modal from "../../Components/Modal/Modal";
import { getBlogs, updateBlogStatusAction } from "../../store/slice/blogSlice";

const ITEMS_PER_PAGE = 10;

const Blog = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { blogs, totalCount } = useSelector((state) => state.blog);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("PENDING");
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);

    const filters = {
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
        status: statusFilter,
        keyword: searchKeyword,
    };

    useEffect(() => {
        dispatch(getBlogs(filters));
    }, [currentPage, statusFilter]);

    const handleSearch = () => {
        setCurrentPage(1);
        dispatch(getBlogs({ ...filters, offset: 0 }));
    };

    const handleStatusUpdate = (blog, newStatus) => {
        dispatch(updateBlogStatusAction({
            id: blog.id,
            body: { status: newStatus },
            filters,
        }));
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-news"></i>
                    <h2>Blog Management</h2>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        style={{ padding: '8px', width: '280px' }}
                    />
                    <button onClick={handleSearch} style={{ padding: '8px 14px', background: '#062c15', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        Search
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }} style={{ padding: '8px' }}>
                        <option value="PENDING">PENDING</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DEACTIVE">DEACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                        <option value="DELETED">DELETED</option>
                    </select>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>{totalCount} blog{totalCount !== 1 ? 's' : ''}</span>
                    <span
                        onClick={() => navigate('/blogs/create')}
                        style={{ cursor: 'pointer' }}
                        data-tooltip-id="add-tooltip"
                        data-tooltip-content="Create Blog"
                    >
                        <i className="bx bxs-plus-circle" style={{ fontSize: '30px', color: '#28a745' }}></i>
                    </span>
                </div>
            </div>

            {/* Cards Grid */}
            {blogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
                    <i className="bx bx-news" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}></i>
                    No blogs found.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                    {blogs.map(blog => (
                        <div key={blog.id} style={{
                            background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px',
                            overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                            transition: 'box-shadow 0.2s ease',
                        }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
                        >
                            {/* Card Header */}
                            <div style={{
                                height: '110px', background: blog.image ? `url(${blog.image}) center/cover` : 'linear-gradient(135deg, #062c15, #0a4a24)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                            }}>
                                {!blog.image && <i className="bx bx-news" style={{ fontSize: '44px', color: 'rgba(255,255,255,0.2)' }}></i>}
                                <span style={{
                                    position: 'absolute', top: '10px', right: '10px',
                                    padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700',
                                    background: blog.status === 'ACTIVE' ? 'rgba(34,197,94,0.15)' : blog.status === 'PENDING' ? 'rgba(59,130,246,0.15)' : blog.status === 'SUSPENDED' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                                    color: blog.status === 'ACTIVE' ? '#16a34a' : blog.status === 'PENDING' ? '#2563eb' : blog.status === 'SUSPENDED' ? '#d97706' : '#dc2626',
                                }}>{blog.status}</span>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '14px 16px' }}>
                                <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: '700', color: '#1f2937', lineHeight: 1.4 }}>{blog.title}</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                                    <span><i className="bx bx-user" style={{ marginRight: '3px' }}></i>{blog.author}</span>
                                    <span><i className="bx bx-calendar" style={{ marginRight: '3px' }}></i>{blog.date}</span>
                                </div>
                                <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#6b7280', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {blog.shortDesc}
                                </p>

                                {/* Actions */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
                                    <div className="table-action-button">
                                        <div className="action-icon" onClick={() => navigate('/blogs/details', { state: { blog } })} data-tooltip-id="view-tooltip" data-tooltip-content="View">
                                            <i className="bx bx-info-circle text-olive"></i>
                                        </div>
                                        <div className="action-icon" onClick={() => navigate('/blogs/create', { state: { blog } })} data-tooltip-id="edit-tooltip" data-tooltip-content="Edit">
                                            <i className="bx bx-edit text-info"></i>
                                        </div>
                                        <div className="action-icon" onClick={() => { setSelectedBlog(blog); setDeleteModal(true); }} data-tooltip-id="status-tooltip" data-tooltip-content="Update Status">
                                            <i className="bx bx-transfer text-warning"></i>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Pagination
                currentPage={currentPage}
                totalItem={totalCount}
                limitSelect={false}
                itemsPerPage={ITEMS_PER_PAGE}
                showEllipsisAfter={true}
                visiblePageCount={3}
                onPageChange={(page) => setCurrentPage(page)}
            />

            {/* Status Update Modal */}
            <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Update Blog Status" width="400px">
                <p style={{ textAlign: 'center', padding: '10px 0' }}>
                    Change status for: <strong>{selectedBlog?.title}</strong>
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 20px 10px' }}>
                    {['PENDING', 'ACTIVE', 'DEACTIVE', 'SUSPENDED', 'DELETED'].map(s => (
                        <button key={s} onClick={() => { handleStatusUpdate(selectedBlog, s); setDeleteModal(false); }}
                            style={{
                                padding: '9px', borderRadius: '6px', border: '1px solid #e5e7eb',
                                background: selectedBlog?.status === s ? '#062c15' : '#f9fafb',
                                color: selectedBlog?.status === s ? '#fff' : '#374151',
                                cursor: 'pointer', fontWeight: '600', fontSize: '13px',
                            }}>
                            {s}
                        </button>
                    ))}
                </div>
                <div className="button-group-modal">
                    <button className="cancel-button" onClick={() => setDeleteModal(false)}>Cancel</button>
                </div>
            </Modal>

            <Tooltip id="add-tooltip" />
            <Tooltip id="view-tooltip" />
            <Tooltip id="edit-tooltip" />
            <Tooltip id="status-tooltip" />
        </>
    );
};

export default Blog;
