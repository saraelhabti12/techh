import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const carouselItems = [
  {
    id: 1,
    name: 'Podcast Studio',
    price: '300 MAD',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    name: 'Photo & Video Studio',
    price: '450 MAD',
    image: 'https://images.unsplash.com/photo-1524169358666-79f22534bd6e?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    name: 'Creative Girly Room',
    price: '350 MAD',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 4,
    name: 'Celebration Space',
    price: '600 MAD',
    image: 'https://images.unsplash.com/photo-1530103862676-fa8c91abe24a?auto=format&fit=crop&q=80&w=800',
  }
];

const HeroBanner = ({ onReserve, onExplore }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-section">
      <div className="hero-container-full">
        {/* Left Side: Content */}
        <div className="hero-content">
          <div className="hero-text-wrapper">
            <div className="hero-badge">
              <span className="dot dot-available"></span>
              {t('Now Available in Tangier')}
            </div>
            <h1 className="hero-title font-display">
              Create. <span className="text-gradient">Record.</span> Shoot.
            </h1>
            <p className="hero-subtitle">
              Professional studios for content, podcasts, and events. 
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-md" onClick={onReserve}>
                {t('Reserve Now')}
              </button>
              <button className="btn btn-outline btn-md" onClick={onExplore}>
                {t('Explore')}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Carousel */}
        <div className="hero-carousel">
          <div className="carousel-wrapper">
            {carouselItems.map((item, index) => (
              <div 
                key={item.id}
                className={`carousel-slide ${index === activeIndex ? 'active' : ''}`}
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="carousel-overlay">
                  <div className="carousel-info">
                    <span className="carousel-name">{item.name}</span>
                    <span className="carousel-price-tag">{item.price} / hr</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          width: 100%;
          background: var(--white);
          border-bottom: 1px solid var(--gray-200);
        }
        
        .hero-container-full {
          display: flex;
          height: 300px; /* Slim horizontal height */
          max-width: 100%;
          margin: 0 auto;
        }

        .hero-content {
          flex: 1.2;
          padding: 0 5%;
          display: flex;
          align-items: center;
          background: var(--grad-hero);
          z-index: 2;
        }

        .hero-text-wrapper {
          max-width: 600px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--white);
          padding: 0.4rem 0.8rem;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--gray-700);
          margin-bottom: 1rem;
          box-shadow: var(--shadow-xs);
          border: 1px solid var(--pink-100);
          text-transform: uppercase;
        }

        .hero-title {
          font-size: 3rem;
          line-height: 1;
          margin-bottom: 0.5rem;
          color: var(--gray-900);
          font-weight: 700;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: var(--gray-500);
          margin-bottom: 1.5rem;
          font-weight: 400;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
        }

        .hero-carousel {
          flex: 0.8;
          position: relative;
          background: var(--gray-100);
        }

        .carousel-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .carousel-slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1s var(--ease);
          display: flex;
          align-items: flex-end;
        }

        .carousel-slide.active {
          opacity: 1;
          z-index: 1;
        }

        .carousel-overlay {
          width: 100%;
          padding: 1.5rem 2.5rem;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
          color: var(--white);
          z-index: 2;
        }

        .carousel-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .carousel-name {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .carousel-price-tag {
          font-size: 0.9rem;
          background: var(--pink-500);
          padding: 0.2rem 0.6rem;
          border-radius: 6px;
          width: fit-content;
          font-weight: 600;
        }

        @media (max-width: 1024px) {
          .hero-title { font-size: 2.5rem; }
        }

        @media (max-width: 800px) {
          .hero-container-full {
            flex-direction: column;
            height: auto;
          }
          .hero-content {
            padding: 3rem 1.5rem;
            flex: none;
          }
          .hero-carousel {
            height: 250px;
            flex: none;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroBanner;
