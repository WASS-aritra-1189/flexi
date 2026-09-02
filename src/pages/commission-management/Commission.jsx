import { useState, useEffect } from "react";
import { services } from '../../shared/_services/api_services';
import { successHandler, errorHandler } from '../../shared/_helper/response_helper';

const Commission = () => {
    const [adminData, setAdminData] = useState(null);
    const [adminLoading, setAdminLoading] = useState(true);
    const [adminCommission, setAdminCommission] = useState("");
    const [adminSaving, setAdminSaving] = useState(false);
    const [adminError, setAdminError] = useState("");

    useEffect(() => {
        fetchAdminCommission();
    }, []);

    const fetchAdminCommission = async () => {
        setAdminLoading(true);
        try {
            const res = await services.getAdminCommission();
            setAdminData(res.data);
            setAdminCommission(res.data.adminCommissionPercentage ?? "");
        } catch (err) {
            errorHandler(err.response);
        } finally {
            setAdminLoading(false);
        }
    };

    const handleAdminCommissionUpdate = async () => {
        const val = Number(adminCommission);
        if (adminCommission === "") { setAdminError("* Commission percentage is required"); return; }
        if (isNaN(val) || val < 0 || val > 100) { setAdminError("* Enter a valid percentage between 0 and 100"); return; }
        setAdminError("");
        setAdminSaving(true);
        try {
            await services.updateAdminCommission(val);
            successHandler("Commission updated successfully!");
            fetchAdminCommission();
        } catch (err) {
            errorHandler(err.response);
        } finally {
            setAdminSaving(false);
        }
    };

    return (
        <>
            <div className="logo-management-card">
                <div className="card-header">
                    <i className="bx bx-trending-up"></i>
                    <h2>Commission Management</h2>
                </div>
            </div>

            {adminLoading ? (
                <div style={{ textAlign: 'center', padding: '30px 0', color: '#6b7280' }}>Loading commission info...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '24px 0' }}>

                    {/* Current rate highlight */}
                    <div style={{ background: 'linear-gradient(135deg, #092615 0%, #1a4a2e 100%)', borderRadius: '10px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <i className="bx bx-percent" style={{ fontSize: '28px', color: '#fff' }}></i>
                        </div>
                        <div>
                            <div style={{ fontSize: '36px', fontWeight: '800', color: '#fff', lineHeight: 1 }}>
                                {adminData?.adminCommissionPercentage ?? 0}%
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>Current Admin Commission Rate</div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>Last updated: {new Date(adminData?.updatedAt).toLocaleString()}</div>
                        </div>
                    </div>

                    {/* Update form */}
                    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '24px' }}>
                        <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '700', color: '#1f2937' }}>Update Admin Commission</p>
                        <p style={{ margin: '0 0 16px', fontSize: '12px', color: '#6b7280' }}>Global commission % applied on all vendor bookings.</p>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Commission Percentage (%)</label>
                            <input
                                type="number"
                                value={adminCommission}
                                onChange={(e) => { setAdminCommission(e.target.value); setAdminError(''); }}
                                className="form-control"
                                placeholder="e.g. 20"
                                min="0"
                                max="100"
                            />
                            {adminError && <span className="err-msg">{adminError}</span>}
                        </div>
                        <button
                            onClick={handleAdminCommissionUpdate}
                            disabled={adminSaving}
                            style={{
                                width: '100%', padding: '10px',
                                background: adminSaving ? '#9ca3af' : '#092615',
                                color: '#fff', border: 'none', borderRadius: '8px',
                                fontSize: '14px', fontWeight: '700', cursor: adminSaving ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {adminSaving ? 'Saving...' : 'Update Commission'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Commission;
