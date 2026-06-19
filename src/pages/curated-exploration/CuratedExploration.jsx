import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getCuratedExplorations,
    createCuratedExploration,
    updateCuratedExplorationData,
    deleteCuratedExplorationData,
} from "../../store/slice/curatedExplorationSlice";
import Modal from "../../Components/Modal/Modal";
import Pagination from "../../Components/Pagination/Pagination";
import { Tooltip } from "react-tooltip";

const CuratedExploration = () => {
    const dispatch = useDispatch();
    const { curatedExplorations, totalCount } = useSelector((state) => state.curatedExploration);
    const { uploading } = useSelector((state) => state.loader);

    const [paginationState, setPaginationState] = useState({ limit: 10, offset: 0, currentPage: 1, keyword: "" });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [modal, setModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("Create Curated Exploration");
    const [edit, setEdit] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({ title: "", desc: "" });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const imageInputRef = useRef(null);
    const [errors, setErrors] = useState({});
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [detailsModal, setDetailsModal] = useState(false);
    const [selected, setSelected] = useState(null);

    const filters = { limit: paginationState.limit, offset: paginationState.offset, keyword: paginationState.keyword };

    useEffect(() => {
        dispatch(getCuratedExplorations(filters));
    }, [dispatch, paginationState.limit, paginationState.offset, paginationState.keyword]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPaginationState(prev => ({ ...prev, keyword: searchKeyword, offset: 0, currentPage: 1 }));
        }, 700);
        return () => clearTimeout(timer);
    }, [searchKeyword]);

    const validate = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = "* Title is required";
        if (!formData.desc) newErrors.desc = "* Description is required";
        if (!edit && !imageFile) newErrors.image = "* Image is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setErrors(prev => ({ ...prev, image: "" }));
    };

    const buildFormData = () => {
        const fd = new FormData();
        fd.append("title", formData.title);
        fd.append("desc", formData.desc);
        if (imageFile) fd.append("file", imageFile);
        return fd;
    };

    const handleCreateUpdate = () => {
        if (!validate()) return;
        const fd = buildFormData();
        if (edit) {
            dispatch(updateCuratedExplorationData({ id: editId, formData: fd, filters }));
        } else {
            dispatch(createCuratedExploration({ formData: fd, filters }));
        }
        closeModal();
    };

    const closeModal = () => {
        setModal(false);
        setFormData({ title: "", desc: "" });
        setImageFile(null);
        setImagePreview(null);
        setErrors({});
    };

    const handleOpenCreate = () => {
        setEdit(false);
        setEditId(null);
        setModalTitle("Create Curated Exploration");
        setFormData({ title: "", desc: "" });
        setImageFile(null);
        setImagePreview(null);
        setErrors({});
        setModal(true);
    };

    const handleEdit = (item) => {
        setEdit(true);
        setEditId(item.id);
        setModalTitle("Update Curated Exploration");
        setFormData({ title: item.title, desc: item.desc });
        setImageFile(null);
        setImagePreview(item.image || null);
        setErrors({});
        setModal(true);
    };

    const confirmDelete = () => {
        dispatch(deleteCuratedExplorationData({ id: deleteId, filters }));
        setDeleteModal(false);
    };

    const pageChange = (page) => {
        setPaginationState(prev => ({ ...prev, currentPage: page, offset: paginationState.limit * (page - 1) }));
    };

    const itemsLimitChange = (limit) => {
        setPaginationState(prev => ({ ...prev, limit, offset: 0, currentPage: 1 }));
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-compass"></i>
                    <h2>Curated Exploration</h2>
                </div>
            </div>

            <div className="status-and-add-icon" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    style={{ padding: "8px", width: "300px" }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <span onClick={() => dispatch(getCuratedExplorations(filters))} style={{ cursor: "pointer" }} data-tooltip-id="refresh-tooltip" data-tooltip-content="Refresh">
                        <i className="bx bx-refresh" style={{ fontSize: "35px", color: "#007bff", marginBottom: "8px" }}></i>
                    </span>
                    <span onClick={handleOpenCreate} style={{ cursor: "pointer" }} data-tooltip-id="add-tooltip" data-tooltip-content="Add">
                        <i className="bx bxs-plus-circle" style={{ fontSize: "30px", color: "#28a745", marginBottom: "8px" }}></i>
                    </span>
                </div>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {curatedExplorations?.map((item, index) => (
                            <tr key={item.id}>
                                <td>{paginationState.offset + index + 1}</td>
                                <td>
                                    {item.image
                                        ? <img src={item.image} alt="exploration" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }} />
                                        : <span style={{ color: "#9ca3af", fontSize: "12px" }}>No image</span>}
                                </td>
                                <td>{item.title}</td>
                                <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.desc}</td>
                                <td>{new Date(item.createdAt).toLocaleString()}</td>
                                <td>
                                    <div className="table-action-button">
                                        <div className="action-icon" onClick={() => { setSelected(item); setDetailsModal(true); }} data-tooltip-id="view-tooltip" data-tooltip-content="View Details">
                                            <i className="bx bx-info-circle text-olive"></i>
                                        </div>
                                        <div className="action-icon" onClick={() => handleEdit(item)} data-tooltip-id="edit-tooltip" data-tooltip-content="Edit">
                                            <i className="bx bx-edit text-info"></i>
                                        </div>
                                        <div className="action-icon" onClick={() => { setDeleteId(item.id); setDeleteModal(true); }} data-tooltip-id="delete-tooltip" data-tooltip-content="Delete">
                                            <i className="bx bx-trash text-danger"></i>
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
                totalItem={totalCount || 0}
                limitSelect={true}
                itemsPerPage={paginationState.limit}
                showEllipsisAfter={true}
                visiblePageCount={3}
                onPageChange={pageChange}
                onItemsLimitChange={itemsLimitChange}
            />

            {/* Create / Edit Modal */}
            <Modal isOpen={modal} onClose={closeModal} title={modalTitle} width="500px">
                <div className="edit-form">
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleFormChange} className="form-control" />
                        {errors.title && <span className="err-msg">{errors.title}</span>}
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="desc" value={formData.desc} onChange={handleFormChange} className="form-control" rows={3} />
                        {errors.desc && <span className="err-msg">{errors.desc}</span>}
                    </div>
                    <div className="form-group">
                        <label>Image {edit ? "(optional — replaces existing)" : ""}</label>
                        <div
                            onClick={() => imageInputRef.current.click()}
                            style={{
                                height: "120px", borderRadius: "8px", border: "2px dashed #d1d5db",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                cursor: "pointer", overflow: "hidden", background: "#f9fafb",
                                backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
                                backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat",
                            }}
                        >
                            {!imagePreview && (
                                <div style={{ textAlign: "center", color: "#9ca3af" }}>
                                    <i className="bx bx-upload" style={{ fontSize: "24px", display: "block" }}></i>
                                    <span style={{ fontSize: "12px" }}>Click to upload image</span>
                                </div>
                            )}
                        </div>
                        <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                        {imagePreview && (
                            <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                                style={{ marginTop: "6px", padding: "4px 12px", borderRadius: "6px", border: "1px solid #fecaca", background: "#fff", color: "#dc2626", fontSize: "12px", cursor: "pointer" }}>
                                Remove Image
                            </button>
                        )}
                        {errors.image && <span className="err-msg">{errors.image}</span>}
                    </div>
                    <div className="button-group-modal">
                        <button className="confirm-button" onClick={handleCreateUpdate}>{uploading ? "Saving..." : "Save"}</button>
                        <button className="cancel-button" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Confirm Delete" width="500px">
                <div className="delete-confirmation">
                    <p>Are you sure you want to delete this curated exploration?</p>
                    <div className="button-group-modal">
                        <button className="confirm-button" onClick={confirmDelete}>{uploading ? "Deleting..." : "Delete"}</button>
                        <button className="cancel-button" onClick={() => setDeleteModal(false)}>Cancel</button>
                    </div>
                </div>
            </Modal>

            {/* Details Modal */}
            <Modal isOpen={detailsModal} onClose={() => setDetailsModal(false)} title="Curated Exploration Details" width="500px">
                <div className="details-content">
                    {selected && (
                        <>
                            {selected.image && (
                                <div className="detail-item">
                                    <label>Image:</label>
                                    <img src={selected.image} alt="exploration" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
                                </div>
                            )}
                            <div className="detail-item"><label>Title:</label><span>{selected.title}</span></div>
                            <div className="detail-item"><label>Description:</label><span>{selected.desc}</span></div>
                            <div className="detail-item"><label>Created At:</label><span>{new Date(selected.createdAt).toLocaleString()}</span></div>
                            <div className="detail-item"><label>Updated At:</label><span>{new Date(selected.updatedAt).toLocaleString()}</span></div>
                        </>
                    )}
                </div>
                <div className="button-group-modal">
                    <button className="cancel-button" onClick={() => setDetailsModal(false)}>Close</button>
                </div>
            </Modal>

            <Tooltip id="refresh-tooltip" />
            <Tooltip id="add-tooltip" />
            <Tooltip id="view-tooltip" />
            <Tooltip id="edit-tooltip" />
            <Tooltip id="delete-tooltip" />
        </>
    );
};

export default CuratedExploration;
