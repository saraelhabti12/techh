import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { FaDownload, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

export default function BookingReceiptModal({ bookingData, onClose }) {
  const { t } = useTranslation();
  const receiptRef = useRef();

  const handleDownloadPdf = () => {
    const element = receiptRef.current;
    const opt = {
      margin:       10,
      filename:     `booking-${bookingData?.booking_reference || 'receipt'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const getStatusStyles = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return { background: 'var(--yellow-100)', color: 'var(--yellow-700)' };
      case 'confirmed':
        return { background: 'var(--green-100)', color: 'var(--green-700)' };
      case 'cancelled':
        return { background: 'var(--red-100)', color: 'var(--red-700)' };
      default:
        return { background: 'var(--gray-100)', color: 'var(--gray-700)' };
    }
  };

  const reference = bookingData?.booking_reference || 'N/A';
  const reservations = bookingData?.reservations || [];
  
  const firstRes = reservations[0] || {};
  const userName = firstRes.customer_name || 'N/A';
  const userEmail = firstRes.customer_email || 'N/A';
  const status = firstRes.status || 'pending';
  
  const totalPrice = firstRes.total_price || 0;

  let totalHours = 0;
  const studiosBooked = [];
  reservations.forEach(res => {
     res.slots?.forEach(slot => {
         const studioName = slot.studio?.name || 'Studio';
         studiosBooked.push({
             studioName,
             date: slot.date,
             time: `${slot.start_time} - ${slot.end_time}`
         });

         const h1 = parseInt(slot.start_time.split(':')[0]) || 0;
         const h2 = parseInt(slot.end_time.split(':')[0]) || 0;
         if (h2 > h1) {
             totalHours += (h2 - h1);
         }
     });
  });

  const statusStyles = getStatusStyles(status);

  return (
    <div className="animate-fadeUp" style={{ padding: '0', maxHeight: '80vh', overflowY: 'auto' }}>
      <div 
        ref={receiptRef} 
        style={{ 
          background: 'var(--white)', 
          padding: '1.5rem', 
          borderRadius: '16px', 
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '1.5rem',
          maxWidth: '500px',
          margin: '0 auto 1.5rem'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <FaCheckCircle style={{ color: 'var(--pink-500)', fontSize: '2.5rem', marginBottom: '0.75rem' }} />
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>{t("booking_confirmation")}</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>{t("thank_you")}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--gray-200)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>{t("reference")}</span>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{reference}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>{t("status")}</span>
            <div style={{ 
                ...statusStyles,
                padding: '0.2rem 0.6rem', 
                borderRadius: '999px', 
                fontWeight: 600, 
                fontSize: '0.8rem',
                textTransform: 'capitalize',
                display: 'inline-block',
                marginTop: '0.2rem'
            }}>
              {t(status)}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{t("customer_details")}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--gray-50)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--gray-600)' }}>{t("name")}</span>
              <span style={{ fontWeight: 600 }}>{userName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--gray-600)' }}>{t("email")}</span>
              <span style={{ fontWeight: 600 }}>{userEmail}</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{t("reservation_details")}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {studiosBooked.map((item, index) => (
              <div key={index} style={{ background: 'var(--gray-50)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--gray-100)' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.95rem', color: 'var(--gray-900)' }}>{item.studioName}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--gray-600)' }}>{t("date")}</span>
                  <span style={{ fontWeight: 500 }}>{item.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--gray-600)' }}>{t("time")}</span>
                  <span style={{ fontWeight: 500 }}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--gray-200)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-700)' }}>{t("total_price")}</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pink-500)' }}>MAD {totalPrice}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', maxWidth: '500px', margin: '1rem auto 0' }}>
        <button 
          className="btn btn-outline" 
          onClick={handleDownloadPdf}
          style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}
        >
          <FaDownload /> {t("download_pdf")}
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onClose}
          style={{ padding: '0.6rem 2rem', fontSize: '0.95rem', flex: 1 }}
        >
          {t("done")}
        </button>
      </div>
    </div>
  );
}