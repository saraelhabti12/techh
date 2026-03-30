import React, { useEffect } from 'react';
import { useNotifications } from '../App';
import { formatDistanceToNow } from 'date-fns';
import { FiCheckCircle, FiInfo, FiCalendar, FiXCircle, FiBellOff } from 'react-icons/fi';
import '../styles/globals.css';

const NotificationsPage = () => {
    const { notifications, markRead, markAllRead, fetchNotifications } = useNotifications();

    useEffect(() => {
        fetchNotifications();
        window.scrollTo(0, 0);
    }, [fetchNotifications]);

    const getIcon = (type) => {
        switch (type) {
            case 'reservation_status':
                return <FiCheckCircle size={20} color="var(--available)" />;
            case 'new_reservation':
                return <FiCalendar size={20} color="var(--pink-500)" />;
            case 'reservation_cancelled':
                return <FiXCircle size={20} color="var(--reserved)" />;
            default:
                return <FiInfo size={20} color="var(--gray-400)" />;
        }
    };

    return (
        <div className="notifications-page-container">
            <div className="container" style={{ padding: '4rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
                <header style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '2rem'
                }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)', margin: 0 }}>
                            Notifications
                        </h1>
                        <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                            Stay updated with your latest activities and studio status.
                        </p>
                    </div>
                    {notifications.some(n => !n.is_read) && (
                        <button 
                            onClick={markAllRead}
                            className="btn btn-outline"
                            style={{ fontSize: '0.875rem', fontWeight: 700 }}
                        >
                            Mark all as read
                        </button>
                    )}
                </header>

                <div className="notifications-full-list" style={{ 
                    background: 'white', 
                    borderRadius: '24px', 
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--gray-100)',
                    overflow: 'hidden'
                }}>
                    {notifications.length === 0 ? (
                        <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
                            <div style={{ 
                                width: '64px', 
                                height: '64px', 
                                borderRadius: '50%', 
                                background: 'var(--gray-50)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                color: 'var(--gray-300)'
                            }}>
                                <FiBellOff size={32} />
                            </div>
                            <h3 style={{ color: 'var(--gray-900)', fontWeight: 700 }}>No notifications yet</h3>
                            <p style={{ color: 'var(--gray-500)', maxWidth: '300px', margin: '0.5rem auto' }}>
                                We'll notify you here when there's news about your reservations.
                            </p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div 
                                key={notification.id} 
                                className={`full-notification-item ${!notification.is_read ? 'unread' : ''}`}
                                onClick={() => !notification.is_read && markRead(notification.id)}
                                style={{
                                    padding: '1.5rem 2rem',
                                    borderBottom: '1px solid var(--gray-50)',
                                    display: 'flex',
                                    gap: '1.5rem',
                                    cursor: !notification.is_read ? 'pointer' : 'default',
                                    transition: 'all 0.2s ease',
                                    position: 'relative'
                                }}
                            >
                                <div style={{ 
                                    width: '48px', 
                                    height: '48px', 
                                    borderRadius: '16px', 
                                    background: 'var(--gray-50)', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    {getIcon(notification.type)}
                                </div>
                                
                                <div style={{ flex: 1 }}>
                                    <p style={{ 
                                        margin: 0, 
                                        fontSize: '1rem', 
                                        fontWeight: !notification.is_read ? 700 : 500,
                                        color: !notification.is_read ? 'var(--gray-900)' : 'var(--gray-600)',
                                        lineHeight: 1.5
                                    }}>
                                        {notification.message}
                                    </p>
                                    <span style={{ 
                                        fontSize: '0.85rem', 
                                        color: 'var(--gray-400)',
                                        marginTop: '0.5rem',
                                        display: 'block'
                                    }}>
                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                    </span>
                                </div>

                                {!notification.is_read && (
                                    <div style={{ 
                                        width: '10px', 
                                        height: '10px', 
                                        borderRadius: '50%', 
                                        background: 'var(--pink-500)',
                                        alignSelf: 'center',
                                        boxShadow: '0 0 0 4px var(--pink-50)'
                                    }} />
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>{`
                .full-notification-item:last-child {
                    border-bottom: none;
                }
                .full-notification-item.unread {
                    background: #fffbfe;
                }
                .full-notification-item:hover {
                    background: var(--gray-50);
                }
                .full-notification-item.unread:hover {
                    background: #fff7fd;
                }
                .notifications-page-container {
                    min-height: 80vh;
                    background: var(--gray-25);
                }
            `}</style>
        </div>
    );
};

export default NotificationsPage;
