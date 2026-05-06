import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createBlogAction, updateBlogAction, updateBlogImageAction } from "../../store/slice/blogSlice";

const SectionCard = ({ icon, iconColor, title, children }) => (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{
            padding: '12px 18px', borderBottom: '1px solid #e5e7eb',
            background: '#f9fafb', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
            <i className={icon} style={{ fontSize: '16px', color: iconColor }}></i>
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>{title}</span>
        </div>
        <div style={{ padding: '18px' }}>{children}</div>
    </div>
);

const Field = ({ label, required, hint, error, children }) => (
    <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#111827' }}>
                {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
            </label>
            {hint && <span style={{ fontSize: '11px', color: '#9ca3af' }}>{hint}</span>}
        </div>
        {children}
        {error && <span style={{ display: 'block', fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>{error}</span>}
    </div>
);

const inputStyle = {
    width: '100%', padding: '9px 12px', border: '1px solid #d1d5db',
    borderRadius: '6px', fontSize: '13px', color: '#111827',
    background: '#fff', boxSizing: 'border-box', outline: 'none',
    fontFamily: 'inherit',
};

const defaultFilters = { limit: 10, offset: 0, status: 'PENDING', keyword: '' };

const BlogCreate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const existingBlog = location.state?.blog;
    const isEdit = !!existingBlog;
    const imageInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: "", author: "", desc: "", shortDesc: "", date: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (existingBlog) {
            setFormData({
                title: existingBlog.title || "",
                author: existingBlog.author || "",
                desc: existingBlog.desc || "",
                shortDesc: existingBlog.shortDesc || "",
                date: existingBlog.date || "",
            });
            if (existingBlog.imagePath) setImagePreview(existingBlog.imagePath);
        }
    }, []);

    const validate = () => {
        const e = {};
        if (!formData.title.trim()) e.title = "* Title is required";
        if (!formData.author.trim()) e.author = "* Author is required";
        if (!formData.desc.trim()) e.desc = "* Description is required";
        if (!formData.shortDesc.trim()) e.shortDesc = "* Short description is required";
        if (!formData.date) e.date = "* Date is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(p => ({ ...p, [name]: value }));
        setErrors(p => ({ ...p, [name]: "" }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleSubmit = () => {
        if (!validate()) return;
        if (isEdit) {
            dispatch(updateBlogAction({ id: existingBlog.id, body: formData, filters: defaultFilters }));
            if (imageFile) {
                const fd = new FormData();
                fd.append('file', imageFile);
                dispatch(updateBlogImageAction({ id: existingBlog.id, formData: fd, filters: defaultFilters }));
            }
        } else {
            dispatch(createBlogAction({ body: formData, filters: defaultFilters }));
        }
        navigate('/blogs');
    };

    const wordCount = formData.desc.trim() ? formData.desc.trim().split(/\s+/).length : 0;

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="bx bx-news"></i>
                        <h2 style={{ margin: 0 }}>{isEdit ? "Edit Blog Post" : "Create New Blog Post"}</h2>
                    </div>
                    <button onClick={() => navigate('/blogs')} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '7px 16px', borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.25)',
                        background: 'rgba(255,255,255,0.12)', color: '#fff',
                        fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                    }}>
                        <i className="bx bx-arrow-back"></i> Back
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 290px', gap: '16px', alignItems: 'start' }}>

                {/* LEFT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <SectionCard icon="bx bx-heading" iconColor="#062c15" title="Blog Title">
                        <Field label="Title" required error={errors.title}>
                            <input
                                name="title" value={formData.title} onChange={handleChange}
                                placeholder="Enter an engaging blog title..."
                                style={{ ...inputStyle, fontSize: '15px', fontWeight: '600', padding: '10px 12px' }}
                            />
                        </Field>
                    </SectionCard>

                    <SectionCard icon="bx bx-align-left" iconColor="#0891b2" title="Short Description">
                        <Field label="Short Description" required error={errors.shortDesc}>
                            <textarea
                                name="shortDesc" value={formData.shortDesc} onChange={handleChange}
                                placeholder="Brief summary of the blog..."
                                rows={3}
                                style={{ ...inputStyle, resize: 'vertical' }}
                            />
                        </Field>
                    </SectionCard>

                    <SectionCard icon="bx bx-edit-alt" iconColor="#2563eb" title="Blog Content">
                        <Field label="Full Description" required hint={`${wordCount} words`} error={errors.desc}>
                            <textarea
                                name="desc" value={formData.desc} onChange={handleChange}
                                placeholder="Write your full blog content here..."
                                rows={16}
                                style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.75', fontSize: '14px' }}
                            />
                        </Field>
                    </SectionCard>
                </div>

                {/* RIGHT COLUMN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <SectionCard icon="bx bx-send" iconColor="#062c15" title="Publish">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button onClick={handleSubmit} style={{
                                width: '100%', padding: '10px 0', borderRadius: '7px', border: 'none',
                                background: '#062c15', color: '#fff', fontSize: '13px',
                                fontWeight: '700', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            }}>
                                <i className="bx bx-check-circle" style={{ fontSize: '16px' }}></i>
                                {isEdit ? "Update Blog" : "Save Blog"}
                            </button>
                            <button onClick={() => navigate('/blogs')} style={{
                                width: '100%', padding: '10px 0', borderRadius: '7px',
                                border: '1px solid #fecaca', background: '#fff',
                                color: '#dc2626', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                            }}>
                                <i className="bx bx-x" style={{ fontSize: '16px' }}></i> Cancel
                            </button>
                        </div>
                    </SectionCard>

                    <SectionCard icon="bx bx-user" iconColor="#2563eb" title="Author & Date">
                        <Field label="Author" required error={errors.author}>
                            <input
                                name="author" value={formData.author} onChange={handleChange}
                                placeholder="Author name..."
                                style={inputStyle}
                            />
                        </Field>
                        <Field label="Date" required error={errors.date} style={{ marginBottom: 0 }}>
                            <input
                                type="date" name="date" value={formData.date} onChange={handleChange}
                                style={inputStyle}
                            />
                        </Field>
                    </SectionCard>

                    <SectionCard icon="bx bx-image" iconColor="#7c3aed" title="Blog Image">
                        <div
                            onClick={() => imageInputRef.current.click()}
                            style={{
                                height: '120px', borderRadius: '8px', border: '2px dashed #d1d5db',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', overflow: 'hidden', background: '#f9fafb',
                                backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                                backgroundSize: 'cover', backgroundPosition: 'center',
                            }}
                        >
                            {!imagePreview && (
                                <div style={{ textAlign: 'center', color: '#9ca3af' }}>
                                    <i className="bx bx-upload" style={{ fontSize: '28px', display: 'block' }}></i>
                                    <span style={{ fontSize: '12px' }}>Click to upload image</span>
                                </div>
                            )}
                        </div>
                        <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                        {imagePreview && (
                            <button onClick={() => { setImageFile(null); setImagePreview(null); }} style={{
                                marginTop: '8px', width: '100%', padding: '6px', borderRadius: '6px',
                                border: '1px solid #fecaca', background: '#fff', color: '#dc2626',
                                fontSize: '12px', cursor: 'pointer',
                            }}>Remove Image</button>
                        )}
                    </SectionCard>

                    {/* Live Preview */}
                    <SectionCard icon="bx bx-show" iconColor="#7c3aed" title="Live Preview">
                        <div style={{
                            height: '90px', background: imagePreview ? `url(${imagePreview}) center/cover` : 'linear-gradient(135deg, #062c15, #0a4a24)',
                            borderRadius: '8px', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', marginBottom: '12px',
                        }}>
                            {!imagePreview && <i className="bx bx-news" style={{ fontSize: '36px', color: 'rgba(255,255,255,0.25)' }}></i>}
                        </div>
                        <p style={{
                            margin: '0 0 6px', fontSize: '13px', fontWeight: '700',
                            color: formData.title ? '#111827' : '#9ca3af',
                            lineHeight: 1.4, fontStyle: formData.title ? 'normal' : 'italic',
                        }}>
                            {formData.title || 'No title yet...'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#6b7280', marginBottom: '8px' }}>
                            <i className="bx bx-user" style={{ fontSize: '12px' }}></i>
                            <span>{formData.author || 'Unknown Author'}</span>
                            {formData.date && <><span style={{ color: '#d1d5db' }}>•</span><span>{formData.date}</span></>}
                        </div>
                        <p style={{
                            margin: 0, fontSize: '11px', color: '#6b7280', lineHeight: 1.6,
                            display: '-webkit-box', WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            fontStyle: formData.shortDesc ? 'normal' : 'italic',
                        }}>
                            {formData.shortDesc || 'No short description yet...'}
                        </p>
                    </SectionCard>
                </div>
            </div>
        </>
    );
};

export default BlogCreate;
