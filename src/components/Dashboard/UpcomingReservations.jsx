import React from 'react';
import ReservationCard from './ReservationCard';
import EmptyState from './EmptyState';
import { FaCalendarPlus } from 'react-icons/fa'; // Assuming FaCalendarPlus is a suitable icon for booking

const UpcomingReservations = ({ reservations, onCancel }) => {
    return (
        <div>
            <h3>Upcoming Bookings</h3>
            {reservations.length === 0 ? (
                <EmptyState
                    message="You have no upcoming reservations."
                    description="Looks like your schedule is clear! Why not book a studio?"
                    buttonText="Book Your First Studio"
                    buttonLink="/reserve-studio"
                    icon={FaCalendarPlus}
                />
            ) : (
                <div>
                    {reservations.map((reservation) => (
                        <ReservationCard
                            key={reservation.booking_reference}
                            reservation={reservation}
                            onCancel={onCancel}
                            type="upcoming"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpcomingReservations;
