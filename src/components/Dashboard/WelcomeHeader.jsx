import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaUserEdit } from 'react-icons/fa';

const WelcomeHeader = ({ userName }) => {
    const navigate = useNavigate();

    return (
        <div className="welcome-header animate-fadeIn">
            <div>
                <h2>Welcome, {userName || 'Creative'}!</h2>
                <p>Manage your studio bookings and account effortlessly.</p>
            </div>
            <div className="welcome-actions">
                <button
                    onClick={() => navigate('/reserve-studio')}
                    className="btn btn-primary btn-md"
                >
                    <FaPlus /> Reserve Studio
                </button>
                <button
                    onClick={() => navigate('/dashboard/profile')}
                    className="btn btn-outline btn-md"
                >
                    <FaUserEdit /> Edit Profile
                </button>
            </div>
        </div>
    );
};

export default WelcomeHeader;
