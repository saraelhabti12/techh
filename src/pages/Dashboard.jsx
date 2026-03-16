import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { getMyReservations, cancelReservation as cancelReservationApi } from '../api/authApi';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import WelcomeHeader from '../components/Dashboard/WelcomeHeader';
import StatsCards from '../components/Dashboard/StatsCards';
import UpcomingReservations from '../components/Dashboard/UpcomingReservations';
import PastReservations from '../components/Dashboard/PastReservations';
import ProfileCard from '../components/Dashboard/ProfileCard';
import FavoriteStudios from '../components/Dashboard/FavoriteStudios';
import NotificationsPanel from '../components/Dashboard/NotificationsPanel';
import '../styles/globals.css';
import '../styles/dashboard.css';

const Dashboard = () => {
    const { user, loading, logoutUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');
    const [loadingReservations, setLoadingReservations] = useState(true);

    const fetchReservations = useCallback(async () => {
        if (!user) {
            setLoadingReservations(false);
            return;
        }
        try {
            setLoadingReservations(true);
            const response = await getMyReservations();
            setReservations(response.data);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to fetch reservations.');
            setReservations([]);
        } finally {
            setLoadingReservations(false);
        }
    }, [user]);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        } else if (user) {
            fetchReservations();
        }
    }, [user, loading, navigate, fetchReservations]);

    const handleCancelReservation = async (bookingReference) => {
        if (window.confirm('Are you sure you want to cancel this reservation?')) {
            try {
                await cancelReservationApi(bookingReference);
                await fetchReservations(); // Re-fetch to update status
                alert('Reservation cancelled successfully!');
            } catch (err) {
                setError(err.message || 'Failed to cancel reservation.');
            }
        }
    };

    if (loading || loadingReservations) {
        return (
            <div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
            </div>
        );
    }

    const now = new Date();
    const toDateTime = (res) => {
        const slot = res.time_slot ? res.time_slot.split(' - ')[0] : '';
        return new Date(`${res.date} ${slot}`);
    };

    const upcomingReservations = reservations.filter(res => {
        const dt = toDateTime(res);
        return !isNaN(dt) && dt >= now && res.status !== 'cancelled';
    });

    const pastReservations = reservations.filter(res => {
        const dt = toDateTime(res);
        return isNaN(dt) || dt < now || res.status === 'cancelled';
    });

    const isDashboardRoot = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

    return (
        <DashboardLayout>
            <WelcomeHeader userName={user?.name} />
            <StatsCards reservations={reservations} />

            <Routes>
                <Route path="/" element={
                    <>
                        <UpcomingReservations reservations={upcomingReservations} onCancel={handleCancelReservation} />
                        <PastReservations reservations={pastReservations} />
                        <FavoriteStudios />
                        <NotificationsPanel />
                    </>
                } />
                <Route path="profile" element={<ProfileCard />} />
                <Route path="favorites" element={<FavoriteStudios />} />
                <Route path="notifications" element={<NotificationsPanel />} />
            </Routes>

            {/* Render all sections on the root dashboard path, otherwise route content */}
            {isDashboardRoot && (
                <div>
                    {/* The components are now rendered within the Routes above for the default path */}
                </div>
            )}
        </DashboardLayout>
    );
};

export default Dashboard;
