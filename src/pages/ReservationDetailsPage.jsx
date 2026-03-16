import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyReservations, cancelReservation as cancelReservationApi } from '../api/authApi';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { FaCalendarAlt, FaClock, FaTag, FaDollarSign, FaCreditCard, FaImage, FaDownload, FaTimesCircle } from 'react-icons/fa';

const ReservationDetailsPage = () => {
    const { bookingReference } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReservationDetails = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getMyReservations(); // Assuming this returns all reservations
            const foundReservation = response.data.find(res => res.booking_reference === bookingReference);

            if (foundReservation) {
                setReservation(foundReservation);
                setError('');
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

    const handleCancelReservation = async () => {
        if (window.confirm('Are you sure you want to cancel this reservation?')) {
            try {
                await cancelReservationApi(bookingReference);
                alert('Reservation cancelled successfully!');
                navigate('/dashboard'); // Go back to dashboard after cancelling
            } catch (err) {
                setError(err.message || 'Failed to cancel reservation.');
            }
        }
    };

    const handleDownloadInvoice = () => {
        alert('Downloading invoice... (Not implemented)');
        // In a real application, this would trigger an API call to get the invoice PDF/data
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div>
                    <p>Loading reservation details...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div>
                    <p>{error}</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!reservation) {
        return (
            <DashboardLayout>
                <div>
                    <p>No reservation details available.</p>
                </div>
            </DashboardLayout>
        );
    }

    const isCancellable = reservation.status !== 'cancelled'; // Simple logic for now

    return (
        <DashboardLayout>
            <div>
                <h2>Reservation Details</h2>

                {reservation.studio_image && (
                    <div>
                        <img src={reservation.studio_image} alt={reservation.studio} />
                    </div>
                )}

                <div>
                    <p><FaImage /> <span>Studio Name:</span> {reservation.studio}</p>
                    <p><FaTag /> <span>Booking Reference:</span> {reservation.booking_reference}</p>
                    <p><FaCalendarAlt /> <span>Date:</span> {reservation.date}</p>
                    <p><FaClock /> <span>Time:</span> {reservation.time_slot}</p>
                    {reservation.total_price && <p><FaDollarSign /> <span>Total Price:</span> ${reservation.total_price}</p>}
                    {reservation.equipment && <p><FaCreditCard /> <span>Selected Equipment:</span> {reservation.equipment}</p>}
                    <p>
                        <span>Status:</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                            {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                        </span>
                    </p>
                </div>

                <div>
                    <button
                        onClick={handleDownloadInvoice}
                       
                    >
                        <FaDownload /> Download Invoice
                    </button>
                    {isCancellable && (
                        <button
                            onClick={handleCancelReservation}
                           
                        >
                            <FaTimesCircle /> Cancel Booking
                        </button>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ReservationDetailsPage;
