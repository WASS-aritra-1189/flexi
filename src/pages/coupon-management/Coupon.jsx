import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { getCoupons, createCoupon, updateCouponData, deleteCouponData } from "../../store/slice/couponSlice";
import Modal from "../../Components/Modal/Modal";
import Pagination from "../../Components/Pagination/Pagination";
import { Tooltip } from "react-tooltip";

const emptyForm = {
  title: "", desc: "", code: "", discountType: "FLAT", discount: "", startDate: "", endDate: "",
};

const Coupon = () => {
  const dispatch = useDispatch();
  const { coupons, totalCount } = useSelector((state) => state.coupon);
  const { uploading } = useSelector((state) => state.loader);

  const [pagination, setPagination] = useState({ limit: 10, offset: 0, currentPage: 1, keyword: "" });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [couponId, setCouponId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const imageInputRef = useRef(null);

  const filters = { limit: pagination.limit, offset: pagination.offset, keyword: pagination.keyword };

  useEffect(() => {
    dispatch(getCoupons(filters));
  }, [dispatch, pagination.limit, pagination.offset, pagination.keyword]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination((prev) => ({ ...prev, keyword: searchKeyword, offset: 0, currentPage: 1 }));
    }, 700);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const validate = () => {
    const e = {};
    if (!formData.title) e.title = "* Title is required";
    if (!formData.code) e.code = "* Code is required";
    if (!formData.discount) e.discount = "* Discount is required";
    if (!formData.startDate) e.startDate = "* Start date is required";
    if (!formData.endDate) e.endDate = "* End date is required";
    if (!edit && !imageFile) e.image = "* Image is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const openCreate = () => {
    setEdit(false);
    setCouponId(null);
    setFormData(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setModal(true);
  };

  const openEdit = (item) => {
    setEdit(true);
    setCouponId(item.id);
    setFormData({
      title: item.title || "",
      desc: item.desc || "",
      code: item.code || "",
      discountType: item.discountType || "FLAT",
      discount: item.discount || "",
      startDate: item.startDate?.slice(0, 10) || "",
      endDate: item.endDate?.slice(0, 10) || "",
    });
    setImageFile(null);
    setImagePreview(item.image || null);
    setErrors({});
    setModal(true);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (edit) {
      dispatch(updateCouponData({ id: couponId, body: formData, imageFile, filters }));
    } else {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      fd.append("file", imageFile);
      dispatch(createCoupon({ formData: fd, filters }));
    }
    setModal(false);
  };

  const confirmDelete = () => {
    dispatch(deleteCouponData({ id: deleteId, filters }));
    setDeleteModal(false);
  };

  return (
    <>
      <div className="logo-management-card">
        <div className="card-header">
          <i className="bx bx-purchase-tag"></i>
          <h2>Coupon Management</h2>
        </div>
      </div>

      <div className="status-and-add-icon" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search coupons..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ padding: "8px", width: "300px" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span onClick={() => dispatch(getCoupons(filters))} style={{ cursor: "pointer" }} data-tooltip-id="refresh-tooltip" data-tooltip-content="Refresh">
            <i className="bx bx-refresh" style={{ fontSize: "35px", color: "#007bff", marginBottom: "8px" }}></i>
          </span>
          <span onClick={openCreate} style={{ cursor: "pointer" }} data-tooltip-id="add-tooltip" data-tooltip-content="Add Coupon">
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
              <th>Code</th>
              <th>Type</th>
              <th>Discount</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons?.map((item, index) => (
              <tr key={item.id}>
                <td>{pagination.offset + index + 1}</td>
                <td>
                  {item.image
                    ? <img src={item.image} alt="coupon" style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "6px" }} />
                    : <span style={{ color: "#9ca3af", fontSize: "12px" }}>No image</span>}
                </td>
                <td>{item.title}</td>
                <td><code>{item.code}</code></td>
                <td>{item.discountType}</td>
                <td>{item.discountType === "FLAT" ? `₹${item.discount}` : `${item.discount}%`}</td>
                <td>{item.startDate?.slice(0, 10)}</td>
                <td>{item.endDate?.slice(0, 10)}</td>
                <td>
                  <div className="table-action-button">
                    <div className="action-icon" onClick={() => openEdit(item)} data-tooltip-id="edit-tooltip" data-tooltip-content="Edit">
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
        currentPage={pagination.currentPage}
        totalItem={totalCount || 0}
        limitSelect={true}
        itemsPerPage={pagination.limit}
        showEllipsisAfter={true}
        visiblePageCount={3}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, currentPage: page, offset: prev.limit * (page - 1) }))}
        onItemsLimitChange={(limit) => setPagination((prev) => ({ ...prev, limit, offset: 0, currentPage: 1 }))}
      />

      {/* Create / Edit Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={edit ? "Update Coupon" : "Create Coupon"} width="620px">
        <div className="edit-form">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-control" />
              {errors.title && <span className="err-msg">{errors.title}</span>}
            </div>
            <div className="form-group">
              <label>Code</label>
              <input type="text" name="code" value={formData.code} onChange={handleChange} className="form-control" />
              {errors.code && <span className="err-msg">{errors.code}</span>}
            </div>
            <div className="form-group">
              <label>Discount Type</label>
              <select name="discountType" value={formData.discountType} onChange={handleChange} className="form-control">
                <option value="FLAT">FLAT</option>
                <option value="PERCENTAGE">PERCENTAGE</option>
              </select>
            </div>
            <div className="form-group">
              <label>Discount</label>
              <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="form-control" />
              {errors.discount && <span className="err-msg">{errors.discount}</span>}
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="form-control" />
              {errors.startDate && <span className="err-msg">{errors.startDate}</span>}
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="form-control" />
              {errors.endDate && <span className="err-msg">{errors.endDate}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="desc" value={formData.desc} onChange={handleChange} className="form-control" rows="3" />
          </div>

          <div className="form-group">
            <label>Image {edit ? "(optional — replaces existing)" : "*"}</label>
            <div
              onClick={() => imageInputRef.current.click()}
              style={{
                height: "100px", borderRadius: "8px", border: "2px dashed #d1d5db",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", overflow: "hidden", background: "#f9fafb",
                backgroundImage: imagePreview ? `url(${imagePreview})` : "none",
                backgroundSize: "cover", backgroundPosition: "center",
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
            {errors.image && <span className="err-msg">{errors.image}</span>}
            {imagePreview && (
              <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }}
                style={{ marginTop: "6px", padding: "4px 12px", borderRadius: "6px", border: "1px solid #fecaca", background: "#fff", color: "#dc2626", fontSize: "12px", cursor: "pointer" }}>
                Remove Image
              </button>
            )}
          </div>

          <div className="button-group-modal">
            <button className="confirm-button" onClick={handleSubmit}>{uploading ? "Saving..." : "Save"}</button>
            <button className="cancel-button" onClick={() => setModal(false)}>Cancel</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)} title="Delete Coupon" width="400px">
        <p style={{ marginBottom: "20px" }}>Are you sure you want to delete this coupon?</p>
        <div className="button-group-modal">
          <button className="confirm-button" style={{ background: "#dc2626" }} onClick={confirmDelete}>Delete</button>
          <button className="cancel-button" onClick={() => setDeleteModal(false)}>Cancel</button>
        </div>
      </Modal>

      <Tooltip id="refresh-tooltip" />
      <Tooltip id="add-tooltip" />
      <Tooltip id="edit-tooltip" />
      <Tooltip id="delete-tooltip" />
    </>
  );
};

export default Coupon;
