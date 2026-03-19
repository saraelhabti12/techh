import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaUserEdit } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const WelcomeHeader = ({ userName }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div className="welcome-header animate-fadeIn">
            <div>
                <h2>{t('welcome_back')}, {userName || 'Creative'}!</h2>
                <p>{t('manage_bookings')}</p>
            </div>
            <div className="welcome-actions">
                <button
                    onClick={() => navigate('/reserve-studio')}
                    className="btn btn-primary btn-md"
                >
                    <FaPlus /> {t('reserve_studio')}
                </button>
                <button
                    onClick={() => navigate('/dashboard/profile')}
                    className="btn btn-outline btn-md"
                >
                    <FaUserEdit /> {t('edit_profile')}
                </button>
            </div>
        </div>
    );
};

export default WelcomeHeader;
