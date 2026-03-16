import React from 'react';
import ReservationCard from './ReservationCard';
import EmptyState from './EmptyState';
import { FaHistory } from 'react-icons/fa'; // Icon for past reservations

const PastReservations = ({ reservations }) => {
    return (
        <div>
            <h3>Past Bookings</h3>
            {reservations.length === 0 ? (
                <EmptyState
                    message="You have no past reservations."
                    description="Your previous bookings will appear here."
                    icon={FaHistory}
                />
            ) : (
                <div>
                    {reservations.map((reservation) => (
                        <ReservationCard
                            key={reservation.booking_reference}
                            reservation={reservation}
                            type="past"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PastReservations;
