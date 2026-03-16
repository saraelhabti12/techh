import React from 'react';
import { FaCalendarAlt, FaCalendarCheck, FaCalendarTimes, FaCalendarMinus } from 'react-icons/fa'; // Added FaCalendarMinus for upcoming

const StatsCards = ({ reservations }) => {
    if (!reservations) {
        return null; // Or a loading spinner
    }

    const totalBookings = reservations.length;
    const now = new Date();

    const toDateTime = (res) => {
        const slot = res.time_slot ? res.time_slot.split(' - ')[0] : '';
        return new Date(`${res.date} ${slot}`);
    };

    const upcomingBookings = reservations.filter(res => {
        const dt = toDateTime(res);
        return !isNaN(dt) && dt >= now && res.status !== 'cancelled';
    }).length;

    const completedBookings = reservations.filter(res => {
        const dt = toDateTime(res);
        // A booking is completed if its date/time is in the past and it was not cancelled.
        return !isNaN(dt) && dt < now && res.status !== 'cancelled';
    }).length;

    const cancelledBookings = reservations.filter(res => res.status === 'cancelled').length;

    const stats = [
        { label: 'Total Bookings', value: totalBookings, icon: <FaCalendarAlt /> },
        { label: 'Upcoming', value: upcomingBookings, icon: <FaCalendarMinus /> }, // Changed to FaCalendarMinus for distinction
        { label: 'Completed', value: completedBookings, icon: <FaCalendarCheck /> },
        { label: 'Cancelled', value: cancelledBookings, icon: <FaCalendarTimes /> },
    ];

    return (
        <div>
            {stats.map((stat, index) => (
                <div key={index}>
                    <div>
                        {stat.icon}
                    </div>
                    <div>
                        <div>{stat.value}</div>
                        <div>{stat.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
