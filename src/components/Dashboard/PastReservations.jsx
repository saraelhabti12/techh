import React from 'react';
import ReservationCard from './ReservationCard';
import EmptyState from './EmptyState';
import { FaHistory } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const PastReservations = ({ reservations }) => {
    const { t } = useTranslation();

    return (
        <section>
            <div className="section-title">
                <h3>{t('past_reservations')}</h3>
            </div>

            {reservations.length === 0 ? (
                <EmptyState
                    message={t('no_history_title')}
                    description={t('no_history_desc')}
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
