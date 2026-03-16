import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyReservations, cancelReservation as cancelReservationApi } from '../api/authApi';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { FaCalendarAlt, FaClock, FaTag, FaMoneyBillWave, FaTools, FaDownload, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';

const ReservationDetailsPage = () => {
    const { bookingReference } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReservationDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getMyReservations();
            const foundReservation = response.data.find(res => res.booking_reference === bookingReference);

            if (foundReservation) {
                setReservation(foundReservation);
            } else {
                setError('Reservation not found.');
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch reservation details.');
        } finally {
            setLoading(false);
        }
    }, [bookingReference]);

    useEffect(() => {
        fetchReservationDetails();
    }, [fetchReservationDetails]);

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this reservation?')) {
            try {
                await cancelReservationApi(bookingReference);
                alert('Reservation cancelled successfully!');
                navigate('/dashboard');
            } catch (err) {
                alert(err.message || 'Failed to cancel reservation.');
            }
        }
    };

    if (loading) return <DashboardLayout><div className="spinner spinner-purple" style={{ margin: '4rem auto' }}></div></DashboardLayout>;
    if (error || !reservation) return <DashboardLayout><div className="empty-state"><h4>{error || 'Not found'}</h4><button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-md">Back to Dashboard</button></div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="animate-fadeIn">
                <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: '1.5rem' }}>
                    <FaArrowLeft /> Back
                </button>

                <div className="welcome-header">
                    <div>
                        <h2 className="heading-md">Reservation Details</h2>
                        <p>Reference: <span style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{reservation.booking_reference}</span></p>
                    </div>
                    <div className="welcome-actions">
                        <button onClick={() => alert('Invoice feature coming soon!')} className="btn btn-outline btn-md">
                            <FaDownload /> Download Invoice
                        </button>
                        {reservation.status !== 'cancelled' && (
                            <button onClick={handleCancel} className="btn btn-soft btn-md" style={{ color: 'var(--reserved)', borderColor: 'var(--reserved-border)' }}>
                                <FaTimesCircle /> Cancel Booking
                            </button>
                        )}
                    </div>
                </div>

                <div className="profile-container">
                    <div className="card" style={{ overflow: 'hidden' }}>
                        <img 
                            src={reservation.studio_image || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=75'} 
                            alt={reservation.studio} 
                            style={{ width: '100%', height: '240px', objectFit: 'cover' }}
                        />
                        <div style={{ padding: '2rem' }}>
                            <h3 className="heading-md" style={{ marginBottom: '1rem' }}>{reservation.studio}</h3>
                            <span className={`res-status-badge ${reservation.status}`}>
                                {reservation.status}
                            </span>
                        </div>
                    </div>

                    <div className="card" style={{ padding: '2.5rem' }}>
                        <div className="section-title">
                            <h4>Booking Information</h4>
                        </div>

                        <div className="profile-fields">
                            <div className="profile-field-group">
                                <span className="profile-label">Date & Time</span>
                                <span className="profile-value">
                                    <FaCalendarAlt /> {reservation.date}
                                </span>
                                <span className="profile-value" style={{ marginTop: '0.25rem' }}>
                                    <FaClock /> {reservation.time_slot}
                                </span>
                            </div>

                            <div className="profile-field-group">
                                <span className="profile-label">Total Amount</span>
                                <span className="profile-value">
                                    <FaMoneyBillWave /> MAD {reservation.total_price || reservation.price || '---'}
                                </span>
                            </div>

                            <div className="profile-field-group">
                                <span className="profile-label">Equipment & Services</span>
                                <span className="profile-value">
                                    <FaTools /> {reservation.equipment || 'No extra equipment selected'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReservationDetailsPage;
