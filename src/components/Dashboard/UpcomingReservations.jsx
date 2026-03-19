import React from 'react';
import ReservationCard from './ReservationCard';
import EmptyState from './EmptyState';
import { FaCalendarPlus } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const UpcomingReservations = ({ reservations, onCancel }) => {
    const { t } = useTranslation();

    return (
        <section style={{ marginBottom: '3.5rem' }}>
            <div className="section-title">
                <h3>{t('upcoming_reservations')}</h3>
            </div>

            {reservations.length === 0 ? (
                <EmptyState
                    message={t('no_upcoming_title')}
                    description={t('no_upcoming_desc')}
                    buttonText={t('explore_studios')}
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
