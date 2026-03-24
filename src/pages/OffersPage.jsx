import React, { useState, useEffect } from 'react';
import { getOffers } from '../api/studioApi';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    getOffers()
      .then(res => setOffers(res?.data || res))
      .catch(err => console.error("Failed to fetch offers:", err));
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getIcon = (title, defaultIcon) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('creator')) return '🎥';
    if (lowerTitle.includes('weekend')) return '📅';
    if (lowerTitle.includes('first') || lowerTitle.includes('welcome')) return '✨';
    return defaultIcon || '🎁';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff5f8 0%, #f3e8ff 100%)',
      paddingBottom: '5rem',
      animation: 'fadeIn 0.8s ease-out'
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .offer-card:hover {
            transform: translateY(-10px) scale(1.03);
            box-shadow: 0 20px 40px rgba(230, 0, 168, 0.15);
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          .gradient-text {
            background: linear-gradient(90deg, #E600A8 0%, #7c3aed 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .btn-gradient {
            background: linear-gradient(90deg, #E600A8 0%, #7c3aed 100%);
            transition: all 0.3s ease;
          }
          .btn-gradient:hover {
            opacity: 0.9;
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(230, 0, 168, 0.4);
          }
        `}
      </style>

      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #E600A8 0%, #7c3aed 100%)',
        padding: '6rem 2rem',
        textAlign: 'center',
        color: '#fff',
        marginBottom: '4rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-10%',
          width: '40%',
          height: '200%',
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(100px)',
          borderRadius: '50%'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ 
            textTransform: 'uppercase', 
            letterSpacing: '3px', 
            fontSize: '0.9rem', 
            marginBottom: '1rem',
            fontWeight: '600',
            opacity: 0.9
          }}>Exclusive Deals</p>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: '800', 
            marginBottom: '1.5rem',
            letterSpacing: '-1px'
          }}>Special Offers & Bundles</h1>
          <p style={{ 
            maxWidth: '700px', 
            margin: '0 auto', 
            fontSize: '1.2rem', 
            opacity: 0.9,
            lineHeight: '1.6'
          }}>
            Premium packages tailored for your creative journey. Unlock your full potential with our limited-time studio experiences.
          </p>
        </div>
      </div>

      <div className="section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '2.5rem',
          justifyContent: 'center'
        }}>
          {offers.map(offer => (
            <div 
              key={offer.id} 
              className="offer-card glass-effect"
              style={{
                borderRadius: '24px',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                position: 'relative',
              }}
            >
              {offer.label && (
                <span style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'rgba(230, 0, 168, 0.1)',
                  color: '#E600A8',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  textTransform: 'uppercase'
                }}>
                  {offer.label}
                </span>
              )}

              <div>
                <div style={{ 
                  fontSize: '3rem', 
                  marginBottom: '1.5rem',
                  background: '#fff',
                  width: '70px',
                  height: '70px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '20px',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
                }}>
                  {getIcon(offer.title, offer.icon)}
                </div>
                
                <h3 style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '800', 
                  marginBottom: '0.75rem', 
                  color: '#1a1a1a' 
                }}>{offer.title}</h3>
                
                <p style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: '#E600A8', 
                  marginBottom: '1rem' 
                }}>{offer.tagline}</p>
                
                <p style={{ 
                  fontSize: '0.95rem', 
                  color: '#666', 
                  lineHeight: '1.6',
                  marginBottom: '2rem'
                }}>{offer.description}</p>
              </div>

              <div>
                {offer.promo && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#999', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Promo Code</p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: '#fff',
                      padding: '0.5rem 0.5rem 0.5rem 1.2rem',
                      borderRadius: '12px',
                      border: '1px dashed #F6B1D5',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{
                        color: '#E600A8',
                        fontWeight: '800',
                        fontSize: '1.1rem',
                        letterSpacing: '1px'
                      }}>{offer.promo}</span>
                      <button 
                        onClick={() => handleCopy(offer.promo)}
                        style={{
                          background: copiedCode === offer.promo ? '#4caf50' : '#E600A8',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {copiedCode === offer.promo ? 'COPIED!' : 'COPY'}
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-end', 
                  justifyContent: 'space-between',
                  marginTop: '1rem'
                }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#999', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                      {offer.price ? 'Special Price' : 'Benefit'}
                    </p>
                    <span className="gradient-text" style={{
                      fontSize: '2.2rem',
                      fontWeight: '900',
                      fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}>
                      {offer.price ? `${offer.price} MAD` : offer.discount ? `${offer.discount}% OFF` : 'Exclusive'}
                    </span>
                  </div>
                </div>

                <button className="btn-gradient" style={{
                  width: '100%',
                  marginTop: '2rem',
                  padding: '1.2rem',
                  borderRadius: '16px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(230, 0, 168, 0.2)'
                }}>
                  Use Offer Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
