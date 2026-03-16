import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeHeader = ({ userName }) => {
    const navigate = useNavigate();

    const handleReserveStudio = () => {
        navigate('/reserve-studio'); // Updated to new route for consistency
    };

    const handleEditProfile = () => {
        navigate('/dashboard/profile');
    };

    return (
        <div className="welcome-header">
            <div>
                <h2>Welcome, {userName}!</h2>
                <p>Manage your studio bookings and account.</p>
            </div>
            <div className="welcome-actions">
                <button
                    onClick={handleReserveStudio}
                   
                >
                    Reserve Studio
                </button>
                <button
                    onClick={handleEditProfile}
                   
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default WelcomeHeader;
