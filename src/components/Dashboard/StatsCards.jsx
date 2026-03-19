import React from 'react';
import { FaCalendarAlt, FaCalendarCheck, FaCalendarTimes, FaCalendarMinus } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const StatsCards = ({ reservations }) => {
    const { t } = useTranslation();
    if (!reservations) return null;

    const now = new Date();
    const toDateTime = (res) => {
        const slot = res.time_slot ? res.time_slot.split(' - ')[0] : '';
        return new Date(`${res.date} ${slot}`);
    };

    const total = reservations.length;
    const upcoming = reservations.filter(res => {
        const dt = toDateTime(res);
        return !isNaN(dt) && dt >= now && res.status !== 'cancelled';
    }).length;
    const completed = reservations.filter(res => {
        const dt = toDateTime(res);
        return !isNaN(dt) && dt < now && res.status !== 'cancelled';
    }).length;
    const cancelled = reservations.filter(res => res.status === 'cancelled').length;

    const stats = [
        { label: t('total_bookings'), value: total, icon: <FaCalendarAlt />, color: 'total' },
        { label: t('upcoming_reservations'), value: upcoming, icon: <FaCalendarMinus />, color: 'upcoming' },
        { label: t('completed'), value: completed, icon: <FaCalendarCheck />, color: 'completed' },
        { label: t('cancelled'), value: cancelled, icon: <FaCalendarTimes />, color: 'cancelled' },
    ];

    return (
        <div className="stats-grid animate-fadeUp">
            {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                    <div className={`stat-icon ${stat.color}`}>
                        {stat.icon}
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
