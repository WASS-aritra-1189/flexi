import { useEffect, useState } from 'react';
import { services } from '../../shared/_services/api_services';
import { errorHandler, successHandler } from '../../shared/_helper/response_helper';
import Modal from '../../Components/Modal/Modal';
import Pagination from '../../Components/Pagination/Pagination';
import { Tooltip } from 'react-tooltip';
import './Ediary.scss';

const Ediary = () => {
  const [data, setData] = useState({ result: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [pagination, setPagination] = useState({ limit: 10, offset: 0, currentPage: 1 });

  const [viewModal, setViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [likes, setLikes] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  // debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setKeyword(keywordInput);
      setPagination((p) => ({ ...p, offset: 0, currentPage: 1 }));
    }, 600);
    return () => clearTimeout(t);
  }, [keywordInput]);

  const fetchEdiary = async () => {
    setLoading(true);
    try {
      const res = await services.getAllEdiary({ limit: pagination.limit, offset: pagination.offset, keyword });
      setData(res.data);
    } catch (e) {
      errorHandler(e.response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEdiary(); }, [pagination.limit, pagination.offset, keyword]);

  const openViewModal = async (entry) => {
    setSelected(entry);
    setActiveImg(0);
    setDetail(null);
    setLikes([]);
    setViewModal(true);
    setDetailLoading(true);
    try {
      const [detailRes, likesRes] = await Promise.all([
        services.getEdiaryDetail(entry.id),
        services.getEdiaryLikes(entry.id),
      ]);
      setDetail(detailRes.data);
      setLikes(likesRes.data?.result || []);
    } catch (e) {
      errorHandler(e.response);
    } finally {
      setDetailLoading(false);
    }
  };

  const openDeleteModal = (entry) => {
    setSelected(entry);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await services.deleteEdiary(selected.id);
      successHandler('Ediary deleted successfully!');
      setDeleteModal(false);
      fetchEdiary();
    } catch (e) {
      errorHandler(e.response);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="logo-management-card">
        <div className="card-header">
          <i className="bx bx-book-open"></i>
          <h2>Ediary Management</h2>
        </div>
      </div>

      <div className="status-and-add-icon" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by title, name..."
          value={keywordInput}
          onChange={(e) => setKeywordInput(e.target.value)}
          style={{ padding: '8px', width: '300px' }}
        />
      </div>

      <div className="table-container">
        <table className="membership-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Date</th>
              <th>Likes</th>
              <th>Comments</th>
              <th>Privacy</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={10} style={{ textAlign: 'center' }}>Loading...</td></tr>
            ) : data.result.length === 0 ? (
              <tr><td colSpan={10} style={{ textAlign: 'center' }}>No entries found.</td></tr>
            ) : data.result.map((e, i) => (
              <tr key={e.id}>
                <td>{pagination.offset + i + 1}</td>
                <td>
                  {e.ediaryImage?.[0]?.image
                    ? <img src={e.ediaryImage[0].image} alt="ediary" style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }} />
                    : <div style={{ width: '44px', height: '44px', borderRadius: '6px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="bx bx-image" style={{ color: '#9ca3af', fontSize: '20px' }}></i>
                      </div>
                  }
                </td>
                <td style={{ fontWeight: 500 }}>{e.title}</td>
                <td>{e.name}</td>
                <td>{e.date}</td>
                <td><span className="ediary-stat"><i className="bx bx-heart"></i> {e.totalLike ?? 0}</span></td>
                <td><span className="ediary-stat"><i className="bx bx-comment"></i> {e.totalComment ?? 0}</span></td>
                <td>
                  <span className={`status-badge ${e.isPrivate ? 'status-deactive' : 'status-active'}`}>
                    {e.isPrivate ? 'Private' : 'Public'}
                  </span>
                </td>
                <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="table-action-button">
                    <div className="action-icon" onClick={() => openViewModal(e)} data-tooltip-id="ed-view" data-tooltip-content="View Details">
                      <i className="bx bx-info-circle text-olive"></i>
                    </div>
                    <div className="action-icon" onClick={() => openDeleteModal(e)} data-tooltip-id="ed-del" data-tooltip-content="Delete">
                      <i className="bx bx-trash" style={{ color: '#ef4444' }}></i>
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
        totalItem={data.total || 0}
        itemsPerPage={pagination.limit}
        limitSelect={true}
        showEllipsisAfter={true}
        visiblePageCount={3}
        onPageChange={(page) => setPagination((p) => ({ ...p, currentPage: page, offset: p.limit * (page - 1) }))}
        onItemsLimitChange={(limit) => setPagination((p) => ({ ...p, limit, offset: 0, currentPage: 1 }))}
      />

      {/* View Detail Modal */}
      <Modal isOpen={viewModal} onClose={() => setViewModal(false)} title="Ediary Details" width="780px">
        {detailLoading ? (
          <div className="ediary-modal-loading"><i className="bx bx-loader-alt bx-spin"></i> Loading...</div>
        ) : detail && (
          <div className="ediary-detail-modal">

            {/* Top: gallery + meta side by side */}
            <div className="ediary-detail-top">

              {/* Left: image gallery */}
              {detail.ediaryImage?.length > 0 && (
                <div className="ediary-detail-gallery">
                  <img src={detail.ediaryImage[activeImg].image} alt="main" className="ediary-detail-main-img" />
                  {detail.ediaryImage.length > 1 && (
                    <div className="ediary-detail-thumbs">
                      {detail.ediaryImage.map((img, idx) => (
                        <img
                          key={img.id}
                          src={img.image}
                          alt={`t${idx}`}
                          className={`ediary-detail-thumb ${activeImg === idx ? 'active' : ''}`}
                          onClick={() => setActiveImg(idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Right: meta info */}
              <div className="ediary-detail-meta">
                <h3 className="ediary-detail-title">{detail.title}</h3>

                <div className="ediary-meta-row">
                  <i className="bx bx-user"></i>
                  <span>{detail.name}</span>
                </div>
                <div className="ediary-meta-row">
                  <i className="bx bx-calendar"></i>
                  <span>{detail.date}</span>
                </div>
                <div className="ediary-meta-row">
                  <i className="bx bx-time"></i>
                  <span>{new Date(detail.createdAt).toLocaleString()}</span>
                </div>
                <div className="ediary-meta-row">
                  <i className="bx bx-lock-alt"></i>
                  <span className={`status-badge ${detail.isPrivate ? 'status-deactive' : 'status-active'}`}>
                    {detail.isPrivate ? 'Private' : 'Public'}
                  </span>
                </div>

                <div className="ediary-detail-stats">
                  <div className="ediary-detail-stat">
                    <i className="bx bx-heart"></i>
                    <strong>{detail.totalLike ?? 0}</strong>
                    <span>Likes</span>
                  </div>
                  <div className="ediary-detail-stat">
                    <i className="bx bx-comment"></i>
                    <strong>{detail.totalComment ?? 0}</strong>
                    <span>Comments</span>
                  </div>
                  <div className="ediary-detail-stat">
                    <i className="bx bx-images"></i>
                    <strong>{detail.ediaryImage?.length ?? 0}</strong>
                    <span>Photos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="ediary-detail-content">
              <p className="ediary-content-label">Content</p>
              <div className={`ediary-content-text-wrap${detail._showMore ? ' expanded' : ''}`}>
                <p className="ediary-content-text">{detail.text}</p>
              </div>
              <button className="ediary-show-more-btn" onClick={() => setDetail((d) => ({ ...d, _showMore: !d._showMore }))}>
                {detail._showMore ? <><i className="bx bx-chevron-up"></i> Show Less</> : <><i className="bx bx-chevron-down"></i> Show More</>}
              </button>
            </div>

            {/* Likes */}
            {likes.length > 0 && (
              <div className="ediary-likes-section">
                <p className="ediary-likes-title"><i className="bx bx-heart"></i> Liked by ({likes.length})</p>
                <div className="ediary-likes-list">
                  {likes.map((l) => (
                    <div key={l.id} className="ediary-like-item">
                      {l.account?.userDetail?.[0]?.image
                        ? <img src={l.account.userDetail[0].image} alt="user" />
                        : <div className="ediary-like-avatar"><i className="bx bx-user"></i></div>
                      }
                      <span>{l.account?.userDetail?.[0]?.name || 'Unknown'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="ediary-comments-section">
              <p className="ediary-comments-title"><i className="bx bx-comment"></i> Comments ({detail.ediaryComment?.length || 0})</p>
              {detail.ediaryComment?.length > 0 ? (
                <div className="ediary-comments-list">
                  {detail.ediaryComment.map((c) => (
                    <div key={c.id} className="ediary-comment-item">
                      <div className="ediary-comment-avatar">
                        {c.account?.userDetail?.[0]?.image
                          ? <img src={c.account.userDetail[0].image} alt="user" />
                          : <div className="ediary-comment-avatar-placeholder"><i className="bx bx-user"></i></div>
                        }
                      </div>
                      <div className="ediary-comment-body">
                        <div className="ediary-comment-header">
                          <span className="ediary-comment-name">{c.account?.userDetail?.[0]?.name || 'Unknown'}</span>
                          {c.likeCount > 0 && (
                            <span className="ediary-comment-likes"><i className="bx bx-heart"></i> {c.likeCount}</span>
                          )}
                        </div>
                        <p className="ediary-comment-text">{c.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="ediary-no-comments">
                  <i className="bx bx-comment-x"></i>
                  <span>No comments yet</span>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="button-group-modal">
          <button className="cancel-button" onClick={() => setViewModal(false)}>Close</button>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Ediary" width="420px">
        <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
          <i className="bx bx-trash" style={{ fontSize: '48px', color: '#ef4444', marginBottom: '12px', display: 'block' }}></i>
          <p style={{ color: '#374151', marginBottom: '4px' }}>Are you sure you want to delete</p>
          <p style={{ fontWeight: 600, color: '#111827' }}>"{selected?.title}"?</p>
          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>This action cannot be undone.</p>
        </div>
        <div className="button-group-modal">
          <button className="confirm-button" style={{ background: '#ef4444', borderColor: '#ef4444' }} onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
          <button className="cancel-button" onClick={() => setDeleteModal(false)}>Cancel</button>
        </div>
      </Modal>

      <Tooltip id="ed-view" />
      <Tooltip id="ed-del" />
    </>
  );
};

export default Ediary;
