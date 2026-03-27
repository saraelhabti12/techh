import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/HeroBanner.css';

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
    </div>
  );
};

export default HeroBanner;
