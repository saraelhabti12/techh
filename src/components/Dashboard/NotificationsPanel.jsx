import React from 'react';
import { FaBell, FaCheckCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const NotificationsPanel = () => {
    const notifications = [
        { id: 1, message: 'Your reservation tomorrow at 14:00 for The White Loft.', type: 'info', time: '2 hours ago', icon: <FaInfoCircle /> },
        { id: 2, message: 'Booking confirmed for March 20 at Urban Soundstage.', type: 'success', time: '1 day ago', icon: <FaCheckCircle /> },
        { id: 3, message: 'New equipment added to Studio A: 8K Cinema Camera.', type: 'info', time: '3 days ago', icon: <FaInfoCircle /> },
    ];

    return (
        <section>
            <div className="section-title">
                <h3>Recent Notifications</h3>
            </div>

            <div className="notifications-list animate-fadeUp">
                {notifications.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>
                        <p>No new notifications.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div key={notification.id} className="notification-item">
                            <div className={`notification-icon ${notification.type}`}>
                                {notification.icon}
                            </div>
                            <div className="notification-content">
                                <p>{notification.message}</p>
                                <span className="notification-time">{notification.time}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default NotificationsPanel;
