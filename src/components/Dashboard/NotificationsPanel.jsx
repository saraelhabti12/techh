import React from 'react';
import { FaCheckCircle, FaInfoCircle, FaCalendarAlt, FaTimesCircle } from 'react-icons/fa';
import { useNotifications } from '../../App';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPanel = () => {
    const { notifications, markRead, markAllRead } = useNotifications();

    const handleMarkRead = async (id) => {
        await markRead(id);
    };

    const handleMarkAllRead = async () => {
        await markAllRead();
    };

    const getIcon = (type) => {
        switch (type) {
            case 'reservation_status':
                return <FaCheckCircle />;
            case 'new_reservation':
                return <FaCalendarAlt />;
            case 'reservation_cancelled':
                return <FaTimesCircle />;
            default:
                return <FaInfoCircle />;
        }
    };

    const getIconClass = (type) => {
        switch (type) {
            case 'reservation_status':
                return 'success';
            case 'new_reservation':
                return 'info';
            case 'reservation_cancelled':
                return 'cancelled';
            default:
                return 'info';
        }
    };

    return (
        <section>
            <div className="section-title">
                <h3>Recent Notifications</h3>
                {notifications.some(n => !n.is_read) && (
                    <button 
                        onClick={handleMarkAllRead}
                        style={{ 
                            fontSize: '0.8rem', 
                            color: 'var(--pink-500)', 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="notifications-list animate-fadeUp">
                {notifications.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--gray-400)' }}>
                        <p>No notifications yet.</p>
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div 
                            key={notification.id} 
                            className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                            onClick={() => !notification.is_read && handleMarkRead(notification.id)}
                            style={{ cursor: !notification.is_read ? 'pointer' : 'default' }}
                        >
                            <div className={`notification-icon ${getIconClass(notification.type)}`}>
                                {getIcon(notification.type)}
                            </div>
                            <div className="notification-content" style={{ flex: 1 }}>
                                <p style={{ fontWeight: !notification.is_read ? 700 : 400 }}>
                                    {notification.message}
                                </p>
                                <span className="notification-time">
                                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            {!notification.is_read && (
                                <div style={{ 
                                    width: '8px', 
                                    height: '8px', 
                                    borderRadius: '50%', 
                                    background: 'var(--pink-500)',
                                    alignSelf: 'center'
                                }} />
                            )}
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .notification-item.unread {
                    background: var(--pink-50) !important;
                }
                .notification-item.unread:hover {
                    background: var(--pink-100) !important;
                }
                .notification-icon.cancelled {
                    background: var(--reserved-bg);
                    color: var(--reserved);
                }
                .notification-icon.success {
                    background: var(--available-bg);
                    color: var(--available);
                }
            `}</style>
        </section>
    );
};

export default NotificationsPanel;
