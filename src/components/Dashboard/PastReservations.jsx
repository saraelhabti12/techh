import React from 'react';
import ReservationCard from './ReservationCard';
import EmptyState from './EmptyState';
import { FaHistory } from 'react-icons/fa';

const PastReservations = ({ reservations }) => {
    return (
        <section>
            <div className="section-title">
                <h3>Past Reservations</h3>
            </div>
            
            {reservations.length === 0 ? (
                <EmptyState
                    message="No history yet"
                    description="Your previous bookings will appear here once completed."
                    icon={FaHistory}
                />
            ) : (
                <div className="reservations-list">
                    {reservations.map((reservation) => (
                        <ReservationCard
                            key={reservation.booking_reference}
                            reservation={reservation}
                            type="past"
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default PastReservations;
