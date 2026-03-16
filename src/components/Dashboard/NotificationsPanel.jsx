import React from 'react';
import { FaBell } from 'react-icons/fa';

const NotificationsPanel = () => {
    // Simulate notifications for now
    const notifications = [
        { id: 1, message: 'Your reservation tomorrow at 14:00 for Creative Hub Studio.', type: 'info', time: '2 hours ago' },
        { id: 2, message: 'Booking confirmed for March 20 at Sound Wave Studio.', type: 'success', time: '1 day ago' },
        { id: 3, message: 'Upcoming maintenance on March 25. Services may be affected.', type: 'warning', time: '3 days ago' },
    ];

    return (
        <div>
            <div>
                <FaBell />
                <h3>Notifications</h3>
            </div>

            {notifications.length === 0 ? (
                <div>
                    <p>No new notifications.</p>
                </div>
            ) : (
                <div>
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 rounded-md border ${
                                notification.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
                                notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                                'bg-yellow-50 border-yellow-200 text-yellow-800'
                            }`}
                        >
                            <p>{notification.message}</p>
                            <p>{notification.time}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationsPanel;
