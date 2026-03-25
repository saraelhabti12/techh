import React from 'react';
import { useTranslation } from 'react-i18next';

const categories = [
  { id: 'booking', title: 'Booking', icon: '📅', color: 'var(--grad-cta)' },
  { id: 'content', title: 'Content', icon: '📸' },
  { id: 'podcast', title: 'Podcast', icon: '🎙️' },
  { id: 'shooting', title: 'Shooting', icon: '📹' },
  { id: 'girly', title: 'Girly Space', icon: '✨' },
  { id: 'birthday', title: 'Birthday', icon: '🎉' },
];

export default function CategorySection({ selectedCategory, onSelectCategory }) {
  const { t } = useTranslation();

  return (
    <div className="category-section container">
      <div className="category-header">
        <h2 className="font-display">{t('Explore Categories')}</h2>
        <p>{t('Find the perfect space for your next project')}</p>
      </div>
      
      <div className="category-grid-large">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`category-card-lg ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
            style={cat.id === 'booking' && selectedCategory === 'booking' ? { background: 'var(--grad-cta)', color: '#fff' } : {}}
          >
            <div className="category-icon-lg">{cat.icon}</div>
            <h3 className="category-title-lg">{t(cat.title)}</h3>
            <div className="category-hover-indicator"></div>
          </div>
        ))}
      </div>

      <style>{`
        .category-section {
          padding: 4rem 0;
          text-align: center;
        }

        .category-header {
          margin-bottom: 3.5rem;
        }

        .category-header h2 {
          font-size: 3rem;
          color: var(--gray-900);
          margin-bottom: 0.75rem;
          font-weight: 800;
        }

        .category-header p {
          color: var(--gray-500);
          font-size: 1.25rem;
        }

        .category-grid-large {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .category-card-lg {
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: 32px;
          padding: 4.5rem 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: var(--shadow-sm);
          position: relative;
          overflow: hidden;
        }

        .category-card-lg:hover {
          transform: translateY(-12px) scale(1.03);
          box-shadow: var(--shadow-xl);
          border-color: var(--pink-300);
        }

        .category-card-lg.active {
          border-color: var(--pink-500);
          background: var(--pink-50);
          box-shadow: 0 0 0 3px var(--pink-500);
        }

        .category-icon-lg {
          font-size: 5rem;
          transition: transform 0.4s var(--ease);
        }

        .category-card-lg:hover .category-icon-lg {
          transform: scale(1.2) rotate(8deg);
        }

        .category-title-lg {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--gray-900);
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .category-card-lg.active .category-title-lg {
           color: var(--pink-600);
        }

        @media (max-width: 1024px) {
          .category-grid-large {
            grid-template-columns: repeat(2, 1fr);
            padding: 0 1.5rem;
            max-width: 800px;
          }
          .category-header h2 { font-size: 2.5rem; }
        }

        @media (max-width: 650px) {
          .category-grid-large {
            grid-template-columns: 1fr;
            max-width: 450px;
          }
          .category-card-lg {
            padding: 3rem 2rem;
          }
          .category-icon-lg { font-size: 4rem; }
          .category-title-lg { font-size: 1.3rem; }
        }
      `}</style>
    </div>
  );
}
