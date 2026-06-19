import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPropertyPartners } from "../../store/slice/partnerSlice";
import Pagination from "../../Components/Pagination/Pagination";
import Modal from "../../Components/Modal/Modal";
import { Tooltip } from "react-tooltip";

const PropertyPartner = () => {
    const dispatch = useDispatch();
    const { propertyPartners, propertyPartnerTotal } = useSelector((state) => state.partner);

    const [paginationState, setPaginationState] = useState({ limit: 10, offset: 0, currentPage: 1, keyword: "" });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [detailsModal, setDetailsModal] = useState(false);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        dispatch(getPropertyPartners({ limit: paginationState.limit, offset: paginationState.offset, keyword: paginationState.keyword }));
    }, [dispatch, paginationState.limit, paginationState.offset, paginationState.keyword]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setPaginationState(prev => ({ ...prev, keyword: searchKeyword, offset: 0, currentPage: 1 }));
        }, 700);
        return () => clearTimeout(timer);
    }, [searchKeyword]);

    const pageChange = (page) => {
        setPaginationState(prev => ({ ...prev, currentPage: page, offset: paginationState.limit * (page - 1) }));
    };

    const itemsLimitChange = (limit) => {
        setPaginationState(prev => ({ ...prev, limit, offset: 0, currentPage: 1 }));
    };

    const handleRefresh = () => {
        dispatch(getPropertyPartners({ limit: paginationState.limit, offset: paginationState.offset, keyword: paginationState.keyword }));
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-building-house"></i>
                    <h2>Property Partners</h2>
                </div>
            </div>

            <div className="status-and-add-icon" style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search by name, email, phone..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    style={{ padding: "8px", width: "300px" }}
                />
                <span onClick={handleRefresh} style={{ cursor: "pointer" }} data-tooltip-id="refresh-tooltip" data-tooltip-content="Refresh">
                    <i className="bx bx-refresh" style={{ fontSize: "35px", color: "#007bff", marginBottom: "8px" }}></i>
                </span>
            </div>

            <div className="table-container">
                <table className="membership-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Property Name</th>
                            <th>Property Type</th>
                            <th>City</th>
                            <th>State</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {propertyPartners?.map((item, index) => (
                            <tr key={item.id}>
                                <td>{paginationState.offset + index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.phone}</td>
                                <td>{item.email}</td>
                                <td>{item.propertyName}</td>
                                <td>{item.propertyType}</td>
                                <td>{item.city}</td>
                                <td>{item.state}</td>
                                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="table-action-button">
                                        <div className="action-icon" onClick={() => { setSelected(item); setDetailsModal(true); }} data-tooltip-id="view-tooltip" data-tooltip-content="View Details">
                                            <i className="bx bx-info-circle text-olive"></i>
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
                totalItem={propertyPartnerTotal || 0}
                limitSelect={true}
                itemsPerPage={paginationState.limit}
                showEllipsisAfter={true}
                visiblePageCount={3}
                onPageChange={pageChange}
                onItemsLimitChange={itemsLimitChange}
            />

            <Modal isOpen={detailsModal} onClose={() => setDetailsModal(false)} title="Property Partner Details" width="600px">
                {selected && (
                    <div className="details-content">
                        {[
                            ["Name", selected.name],
                            ["Phone", selected.phone],
                            ["Email", selected.email],
                            ["Property Name", selected.propertyName],
                            ["Property Type", selected.propertyType],
                            ["Property Address", selected.propertyAddress],
                            ["City", selected.city],
                            ["State", selected.state],
                            ["Business Reg No.", selected.businessRegNumber],
                            ["GST Number", selected.gstNumber || "-"],
                            ["Created At", new Date(selected.createdAt).toLocaleString()],
                        ].map(([label, value]) => (
                            <div className="detail-item" key={label}>
                                <label>{label}:</label>
                                <span>{value}</span>
                            </div>
                        ))}
                        {selected.userPropertyAmenity?.length > 0 && (
                            <div className="detail-item">
                                <label>Amenities:</label>
                                <span>{selected.userPropertyAmenity.map(a => a.propertyAmenity?.name).join(", ")}</span>
                            </div>
                        )}
                    </div>
                )}
                <div className="button-group-modal">
                    <button className="cancel-button" onClick={() => setDetailsModal(false)}>Close</button>
                </div>
            </Modal>

            <Tooltip id="refresh-tooltip" />
            <Tooltip id="view-tooltip" />
        </>
    );
};

export default PropertyPartner;
