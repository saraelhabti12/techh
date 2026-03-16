import React from 'react';
import ReservationCard from './ReservationCard';
import EmptyState from './EmptyState';
import { FaCalendarPlus } from 'react-icons/fa';

const UpcomingReservations = ({ reservations, onCancel }) => {
    return (
        <section style={{ marginBottom: '3.5rem' }}>
            <div className="section-title">
                <h3>Upcoming Reservations</h3>
            </div>
            
            {reservations.length === 0 ? (
                <EmptyState
                    message="No upcoming sessions"
                    description="Looks like your schedule is clear! Why not book a studio?"
                    buttonText="Explore Studios"
                    buttonLink="/reserve-studio"
                    icon={FaCalendarPlus}
                />
            ) : (
                <div className="reservations-list">
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
        </section>
    );
};

export default UpcomingReservations;
