import React, { useState, useEffect } from 'react';
import { getOffers } from '../api/studioApi'; // Import the API function to get offers

export default function OffersPage() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    // Fetch offers when the component mounts
    getOffers()
      .then(res => setOffers(res?.data || res))
      .catch(err => console.error("Failed to fetch offers:", err));
  }, []);

  return (
    <div className="section">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p className="eyebrow">Exclusive Deals</p>
        <h2 className="heading-lg">Special Offers & Bundles</h2>
        <p className="body-md" style={{ maxWidth: '600px', margin: '1rem auto 0' }}>
          Explore our limited-time offers and packages designed to enhance your studio experience.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem',
        justifyContent: 'center'
      }}>
        {offers.map(offer => (
          <div key={offer.id} style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 8px 28px rgba(180,100,200,0.1)',
            padding: '2rem',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            border: '1.5px solid #FDF6FA',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#1A1A1A'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#FDF6FA'}
          >
            <div>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '1rem' }}>{offer.icon}</span>
              <p className="eyebrow" style={{ color: offer.label === 'Most Popular' ? '#E600A8' : '#C4009A' }}>{offer.label}</p>
              <h3 className="heading-md" style={{ marginBottom: '0.5rem', color: '#1A1A1A' }}>{offer.title}</h3>
              <p className="body-sm" style={{ color: '#1A1A1A', marginBottom: '1rem' }}>{offer.tagline}</p>
              <p style={{ fontSize: '0.8rem', color: '#1A1A1A', lineHeight: '1.6' }}>{offer.description}</p>
            </div>
            <div style={{ borderTop: '1px solid #FDF6FA', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
              {offer.promo && (
                <div style={{ marginBottom: '1rem' }}>
                  <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>Promo Code</p>
                  <span style={{
                    background: '#FDF6FA',
                    color: '#FF0F9B',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    letterSpacing: '0.05em',
                    fontSize: '0.9rem',
                    border: '1px dashed #F6B1D5',
                  }}>{offer.promo}</span>
                </div>
              )}
              {offer.price && (
                <div>
                  <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>Special Price</p>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.8rem',
                    color: '#E600A8',
                    fontWeight: 600,
                  }}>MAD {offer.price}</span>
                </div>
              )}
               {offer.discount && !offer.price && (
                <div>
                  <p className="eyebrow" style={{ marginBottom: '0.5rem' }}>Discount</p>
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.8rem',
                    color: '#E600A8',
                    fontWeight: 600,
                  }}>{offer.discount}% OFF</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}