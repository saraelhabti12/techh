import React from 'react';
import { FaCalendarAlt, FaClock, FaTag, FaChevronRight, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ReservationCard = ({ reservation, onCancel, type }) => {
    return (
        <div className="reservation-card animate-fadeUp">
            <div className="res-img-wrapper">
                <img 
                    src={reservation.studio_image || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=75'} 
                    alt={reservation.studio} 
                    className="res-img"
                />
            </div>
            
            <div className="res-content">
                <div className="res-header">
                    <h4 className="res-title">{reservation.studio}</h4>
                    <span className={`res-status-badge ${reservation.status}`}>
                        {reservation.status}
                    </span>
                </div>
                
                <div className="res-details-row">
                    <div className="res-detail-item">
                        <FaCalendarAlt /> {reservation.date}
                    </div>
                    <div className="res-detail-item">
                        <FaClock /> {reservation.time_slot}
                    </div>
                    <div className="res-detail-item">
                        <FaTag /> {reservation.booking_reference}
                    </div>
                </div>
            </div>

            <div className="res-actions">
                <Link
                    to={`/dashboard/reservations/${reservation.booking_reference}`}
                    className="btn btn-soft btn-sm"
                >
                    Details <FaChevronRight />
                </Link>
                
                {type === 'upcoming' && reservation.status === 'pending' && (
                    <button
                        onClick={() => onCancel(reservation.booking_reference)}
                        className="btn btn-ghost btn-sm"
                        style={{ color: 'var(--reserved)' }}
                    >
                        <FaTimesCircle /> Cancel
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReservationCard;
