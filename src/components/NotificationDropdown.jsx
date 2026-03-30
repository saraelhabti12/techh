import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiCheckCircle, FiInfo, FiCalendar, FiXCircle } from 'react-icons/fi';
import { useNotifications } from '../App';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markRead, markAllRead, fetchNotifications } = useNotifications();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkRead = async (id) => {
        await markRead(id);
    };

    const handleMarkAllRead = async () => {
        await markAllRead();
    };

    const getIcon = (type) => {
        switch (type) {
            case 'reservation_status':
                return <FiCheckCircle color="var(--available)" />;
            case 'new_reservation':
                return <FiCalendar color="var(--pink-500)" />;
            case 'reservation_cancelled':
                return <FiXCircle color="var(--reserved)" />;
            default:
                return <FiInfo color="var(--gray-400)" />;
        }
    };

    return (
        <div className="notification-dropdown-container" ref={dropdownRef}>
            <button 
                className="notification-trigger"
                onClick={() => {
                    setIsOpen(!isOpen);
                    if (!isOpen) fetchNotifications();
                }}
                aria-label="Notifications"
            >
                <FiBell size={20} />
                {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown-menu">
                    <div className="dropdown-header">
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead}>Mark all as read</button>
                        )}
                    </div>

                    <div className="dropdown-body">
                        {notifications.length === 0 ? (
                            <div className="empty-notifications">
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.slice(0, 5).map(notification => (
                                <div 
                                    key={notification.id} 
                                    className={`dropdown-notification-item ${!notification.is_read ? 'unread' : ''}`}
                                    onClick={() => handleMarkRead(notification.id)}
                                >
                                    <div className="notification-icon-wrapper">
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="notification-text">
                                        <p className="message">{notification.message}</p>
                                        <p className="time">
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </p>
                                    </div>
                                    {!notification.is_read && <span className="unread-dot"></span>}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="dropdown-footer">
                        <Link to="/notifications" onClick={() => setIsOpen(false)}>
                            View all notifications
                        </Link>
                    </div>
                </div>
            )}

            <style>{`
                .notification-dropdown-container {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .notification-trigger {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--gray-600);
                    padding: 8px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    transition: all 0.2s ease;
                }

                .notification-trigger:hover {
                    background: var(--gray-100);
                    color: var(--pink-500);
                }

                .unread-badge {
                    position: absolute;
                    top: 2px;
                    right: 2px;
                    background: var(--pink-500);
                    color: white;
                    font-size: 10px;
                    font-weight: 700;
                    padding: 2px 5px;
                    border-radius: 10px;
                    min-width: 16px;
                    border: 2px solid var(--white);
                }

                .notification-dropdown-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    margin-top: 12px;
                    width: 320px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1), 0 6px 10px rgba(0,0,0,0.05);
                    border: 1px solid var(--gray-100);
                    z-index: 1000;
                    overflow: hidden;
                    animation: dropdownFade 0.2s ease-out;
                }

                @keyframes dropdownFade {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .dropdown-header {
                    padding: 12px 16px;
                    border-bottom: 1px solid var(--gray-100);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .dropdown-header h3 {
                    font-size: 0.95rem;
                    font-weight: 700;
                    margin: 0;
                }

                .dropdown-header button {
                    background: none;
                    border: none;
                    color: var(--pink-500);
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                }

                .dropdown-body {
                    max-height: 350px;
                    overflow-y: auto;
                }

                .empty-notifications {
                    padding: 30px 20px;
                    text-align: center;
                    color: var(--gray-400);
                    font-size: 0.9rem;
                }

                .dropdown-notification-item {
                    padding: 12px 16px;
                    display: flex;
                    gap: 12px;
                    border-bottom: 1px solid var(--gray-50);
                    cursor: pointer;
                    transition: background 0.2s ease;
                    position: relative;
                }

                .dropdown-notification-item:hover {
                    background: var(--gray-50);
                }

                .dropdown-notification-item.unread {
                    background: #fffafa;
                }

                .notification-icon-wrapper {
                    flex-shrink: 0;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background: var(--gray-50);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.1rem;
                }

                .notification-text {
                    flex: 1;
                }

                .notification-text .message {
                    font-size: 0.85rem;
                    color: var(--gray-800);
                    margin: 0 0 4px 0;
                    line-height: 1.4;
                }

                .notification-text .time {
                    font-size: 0.75rem;
                    color: var(--gray-400);
                    margin: 0;
                }

                .unread-dot {
                    width: 8px;
                    height: 8px;
                    background: var(--pink-500);
                    border-radius: 50%;
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                }

                .dropdown-footer {
                    padding: 10px;
                    text-align: center;
                    border-top: 1px solid var(--gray-100);
                    background: var(--gray-50);
                }

                .dropdown-footer a {
                    font-size: 0.85rem;
                    color: var(--gray-600);
                    text-decoration: none;
                    font-weight: 600;
                }

                .dropdown-footer a:hover {
                    color: var(--pink-500);
                }
            `}</style>
        </div>
    );
};

export default NotificationDropdown;
