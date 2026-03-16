import React from 'react';
import { FaCalendarAlt, FaClock, FaTag, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ReservationCard = ({ reservation, onCancel, type }) => {
    const getStatusClasses = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            {reservation.studio_image && (
                <img src={reservation.studio_image} alt={reservation.studio} />
            )}
            <div>
                <h4>{reservation.studio}</h4>
                <div>
                    <p><FaCalendarAlt /> {reservation.date}</p>
                    <p><FaClock /> {reservation.time_slot}</p>
                    <p><FaTag /> Ref: {reservation.booking_reference}</p>
                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusClasses(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                </div>
                <div>
                    <Link
                        to={`/dashboard/reservations/${reservation.booking_reference}`}
                       
                    >
                        <FaInfoCircle /> View Details
                    </Link>
                    {type === 'upcoming' && reservation.status === 'pending' && (
                        <button
                            onClick={() => onCancel(reservation.booking_reference)}
                           
                        >
                            <FaTimesCircle /> Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReservationCard;
