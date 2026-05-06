import { useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPolicies, updatePolicyData } from '../../store/slice/policySlice';
import Modal from '../../Components/Modal/Modal';
import Pagination from '../../Components/Pagination/Pagination';
import { Tooltip } from 'react-tooltip';

const Policy = () => {
    const dispatch = useDispatch();
    const { policies, policyTotalCount } = useSelector((state) => state.policy);
    const { uploading } = useSelector((state) => state.loader);

    const [paginationState, setPaginationState] = useState({
        limit: 10,
        offset: 0,
        currentPage: 1
    });
    const [modal, setModal] = useState(false);
    const [formData, setFormData] = useState({ desc: "" });
    const [policyId, setPolicyId] = useState(null);
    const [title, setTitle] = useState("");
    const [errors, setErrors] = useState({});
    const filters = { limit: 50, offset: 0 };

    useEffect(() => {
        dispatch(getPolicies({
            limit: paginationState.limit,
            offset: paginationState.offset
        }));
    }, [dispatch, paginationState.limit, paginationState.offset]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.desc) {
            newErrors.desc = "* Description is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    };

    const handleUpdate = () => {
        if (validateForm()) {
            dispatch(updatePolicyData({ id: policyId, filters, body: formData }));
            setModal(false);
            setFormData({ desc: "" });
            setErrors({});
        }
    };

    const handleEdit = (id, policyTitle, desc) => {
        setErrors({});
        setModal(true);
        setPolicyId(id);
        setTitle(`Edit ${policyTitle}`);
        setFormData({ desc });
    };

    const pageChange = (page) => {
        const offset = paginationState.limit * (page - 1);
        setPaginationState(prev => ({
            ...prev,
            currentPage: page,
            offset: offset,
        }));
    };

    const itemsLimitChange = (limit) => {
        setPaginationState(prev => ({
            ...prev,
            limit: limit,
            offset: 0,
            currentPage: 1
        }));
    };

    const handleRefresh = () => {
        dispatch(getPolicies({
            limit: paginationState.limit,
            offset: paginationState.offset
        }));
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-file"></i>
                    <h2>Policy Management</h2>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <span onClick={handleRefresh} style={{ cursor: 'pointer' }} data-tooltip-id="refresh-tooltip" data-tooltip-content="Refresh">
                    <i className="bx bx-refresh" style={{ fontSize: '35px', color: '#007bff', marginBottom: '8px' }}></i>
                </span>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {policies?.map((item, index) => (
                            <tr key={index}>
                                <td>{paginationState.offset + index + 1}</td>
                                <td>{item.title}</td>
                                <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {item.desc}
                                </td>
                                <td>
                                    <div className="table-action-button">
                                        <div className="action-icon" onClick={() => handleEdit(item.id, item.title, item.desc)} data-tooltip-id="edit-tooltip" data-tooltip-content="Edit">
                                            <i className="bx bx-edit text-info"></i>
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
                totalItem={policyTotalCount || 0}
                limitSelect={true}
                itemsPerPage={paginationState.limit}
                showEllipsisAfter={true}
                visiblePageCount={3}
                onPageChange={pageChange}
                onItemsLimitChange={itemsLimitChange}
            />

            <Modal isOpen={modal} onClose={() => setModal(false)} title={title} width="600px">
                <div className="edit-form">
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name='desc'
                            value={formData.desc}
                            onChange={handleFormChange}
                            className="form-control"
                            rows={8}
                        />
                        {errors.desc && <span className="err-msg">{errors.desc}</span>}
                    </div>

                    <div className="button-group-modal">
                        <button className="confirm-button" onClick={handleUpdate}>
                            {uploading ? "Saving..." : "Save"}
                        </button>
                        <button className="cancel-button" onClick={() => setModal(false)}>Cancel</button>
                    </div>
                </div>
            </Modal>

            <Tooltip id="refresh-tooltip" />
            <Tooltip id="edit-tooltip" />
        </>
    );
};

export default Policy;
