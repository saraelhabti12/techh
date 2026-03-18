import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAdminUserDetail } from '../api/adminApi';
import { 
    FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaShieldAlt, 
    FaBan, FaHistory, FaCalendarAlt, FaExternalLinkAlt 
} from 'react-icons/fa';

const AdminUserHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAdminUserDetail(id)
            .then(res => setUser(res.data))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div style={{ padding: "4rem", textAlign: "center" }}>
            <span className="spinner spinner-purple" />
            <p style={{ marginTop: "1rem", color: "var(--gray-500)" }}>Loading user profile...</p>
        </div>
    );

    if (!user) return <div style={{ padding: '2rem' }}>User not found.</div>;

    return (
        <div className="animate-fadeUp">
            <button 
                onClick={() => navigate('/admin/dashboard/users')}
                className="btn btn-ghost"
                style={{ marginBottom: '2rem' }}
            >
                <FaArrowLeft /> Back to Users
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Profile Card */}
                <div style={{ 
                    background: '#fff', 
                    borderRadius: '24px', 
                    overflow: 'hidden', 
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--gray-100)'
                }}>
                    <div style={{ background: 'var(--grad-cta)', padding: '3rem 2rem', textAlign: 'center' }}>
                        <div style={{ 
                            width: 100, height: 100, borderRadius: '50%', 
                            background: '#fff', margin: '0 auto 1.5rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.5rem', color: 'var(--pink-500)',
                            boxShadow: 'var(--shadow-lg)'
                        }}>
                            <FaUser />
                        </div>
                        <h3 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>{user.name}</h3>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Customer since Mar 2026</p>
                    </div>

                    <div style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--pink-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pink-500)' }}>
                                    <FaEnvelope size={14} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user.email}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--pink-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pink-500)' }}>
                                    <FaPhone size={14} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>Phone Number</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user.phone || 'Not provided'}</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--pink-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pink-500)' }}>
                                    <FaShieldAlt size={14} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>Account Status</div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <span className={`tag ${user.is_admin ? 'tag-purple' : 'tag-gray'}`}>
                                            {user.is_admin ? 'Admin' : 'Regular'}
                                        </span>
                                        {user.is_banned && <span className="tag tag-reserved">Banned</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Section */}
                <div style={{ 
                    background: '#fff', 
                    borderRadius: '24px', 
                    padding: '2.5rem', 
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--gray-100)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <FaHistory style={{ color: 'var(--pink-500)' }} />
                        <h4 className="heading-md" style={{ margin: 0 }}>Reservation History</h4>
                        <span style={{ 
                            background: 'var(--pink-50)', 
                            color: 'var(--pink-500)', 
                            padding: '0.2rem 0.75rem', 
                            borderRadius: '50px', 
                            fontSize: '0.8rem', 
                            fontWeight: 700 
                        }}>
                            {user.reservations?.length || 0} Total
                        </span>
                    </div>

                    <div style={{ border: '1px solid var(--gray-100)', borderRadius: '16px', overflow: 'hidden' }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "var(--gray-50)", borderBottom: '1px solid var(--gray-100)' }}>
                                    <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontSize: "0.75rem", color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 700 }}>Reference</th>
                                    <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontSize: "0.75rem", color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 700 }}>Studio</th>
                                    <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontSize: "0.75rem", color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 700 }}>Date & Time</th>
                                    <th style={{ padding: "1.25rem 1.5rem", textAlign: "right", fontSize: "0.75rem", color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: 700 }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {user.reservations?.map(r => (
                                    <tr key={r.id} style={{ borderBottom: "1px solid var(--gray-50)", transition: 'background 0.2s' }}>
                                        <td style={{ padding: "1.25rem 1.5rem" }}>
                                            <div style={{ fontWeight: 700, color: 'var(--pink-500)', fontSize: '0.95rem' }}>#{r.booking_reference}</div>
                                        </td>
                                        <td style={{ padding: "1.25rem 1.5rem" }}>
                                            <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>{r.studio?.name}</div>
                                        </td>
                                        <td style={{ padding: "1.25rem 1.5rem" }}>
                                            <div style={{ fontSize: "0.9rem", display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
                                                <FaCalendarAlt size={12} color="var(--gray-400)" /> {r.date}
                                            </div>
                                            <div style={{ fontSize: "0.75rem", color: 'var(--gray-500)', marginTop: '0.2rem' }}>
                                                {r.time_slot || 'N/A'}
                                            </div>
                                        </td>
                                        <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>
                                            <span className={`tag tag-${r.status === 'confirmed' ? 'available' : r.status === 'cancelled' ? 'reserved' : 'purple'}`} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                                                {r.status.toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(!user.reservations || user.reservations.length === 0) && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center", padding: "5rem", color: "var(--gray-400)" }}>
                                            <FaCalendarAlt size={40} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                            <p>No reservations found in history.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserHistory;
