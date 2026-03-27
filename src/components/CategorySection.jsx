import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCategories } from '../api/studioApi';

export default function CategorySection({ selectedCategory, onSelectCategory, mode = 'grid' }) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(res => {
        // Ensure we always have the 'Booking' category at the start
        const apiCats = res?.data || [];
        const bookingCat = { id: 'booking', name: 'Booking', icon: '📅', color: 'var(--grad-cta)' };
        
        // Merge and remove duplicates if 'Booking' somehow comes from API too
        const filteredApiCats = apiCats.filter(c => c.name.toLowerCase() !== 'booking');
        setCategories([bookingCat, ...filteredApiCats]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch categories:", err);
        // Fallback static categories if API fails entirely
        const fallback = [
          { id: 'booking', name: 'Booking', icon: '📅', color: 'var(--grad-cta)' },
          { id: 'content', name: 'Content', icon: '📸' },
          { id: 'podcast', name: 'Podcast', icon: '🎙️' },
          { id: 'shooting', name: 'Shooting', icon: '📹' },
          { id: 'girly', name: 'Girly Space', icon: '✨' },
          { id: 'birthday', name: 'Birthday', icon: '🎉' },
        ];
        setCategories(fallback);
        setLoading(false);
      });
  }, []);

  if (loading && mode === 'grid') {
    return (
      <div className="category-section grid">
        <div className="category-header">
          <h2 className="font-display">{t('Explore Categories')}</h2>
          <p>{t('Find the perfect space for your next project')}</p>
        </div>
        <div className="category-container">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="category-card" style={{ height: '300px', animation: 'pulse 1.5s infinite', background: 'var(--gray-50)' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--gray-100)', marginBottom: '1rem' }} />
              <div style={{ width: '120px', height: '24px', background: 'var(--gray-100)', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`category-section ${mode}`}>
      {/* Only show header in Grid mode (Homepage), not in Sidebar */}
      {mode === 'grid' && (
        <div className="category-header">
          <h2 className="font-display">{t('Explore Categories')}</h2>
          <p>{t('Find the perfect space for your next project')}</p>
        </div>
      )}
      
      <div className="category-container">
        {categories.map((cat) => {
          const isBooking = cat.name.toLowerCase() === 'booking';
          const isActive = (isBooking && selectedCategory === 'booking') || 
                          (!isBooking && selectedCategory === cat.name);
          
          return (
            <div
              key={cat.id}
              className={`category-card ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(isBooking ? 'booking' : cat.name)}
              title={mode === 'icons' ? t(cat.name) : ''}
              style={isBooking && isActive ? { background: 'var(--grad-cta)', color: '#fff' } : {}}
            >
              <div className="category-icon">{cat.icon}</div>
              {mode !== 'icons' && (
                <div className="category-info">
                  <h3 className="category-title">{t(cat.name)}</h3>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .category-section {
          width: 100%;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* GRID MODE (Default/Large) */
        .category-section.grid {
          padding: 4rem 0;
          text-align: center;
        }
        .category-section.grid .category-header { margin-bottom: 3.5rem; }
        .category-section.grid .category-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; max-width: 1200px; margin: 0 auto; }
        .category-section.grid .category-card { background: var(--white); border: 1px solid var(--gray-200); border-radius: 32px; padding: 4.5rem 2.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: var(--shadow-sm); position: relative; overflow: hidden; }
        .category-section.grid .category-card:hover { transform: translateY(-12px) scale(1.03); box-shadow: var(--shadow-xl); border-color: var(--pink-300); }
        .category-section.grid .category-card.active { border-color: var(--pink-500); background: var(--pink-50); box-shadow: 0 0 0 3px var(--pink-500); }
        .category-section.grid .category-icon { font-size: 5rem; transition: transform 0.4s var(--ease); }
        .category-section.grid .category-title { font-size: 1.5rem; font-weight: 800; color: var(--gray-900); margin: 0; text-transform: uppercase; letter-spacing: 0.08em; }

        /* LIST MODE (Sidebar) */
        .category-section.list { padding: 0; }
        .category-section.list .category-container { display: flex; flex-direction: column; gap: 8px; }
        .category-section.list .category-card { 
          background: var(--gray-50); 
          border: 1px solid var(--gray-100); 
          border-radius: 10px; 
          padding: 10px 14px; 
          display: flex; 
          flex-direction: row; 
          align-items: center; 
          gap: 12px; 
          cursor: pointer; 
          transition: all 0.2s var(--ease);
        }
        .category-section.list .category-card:hover { 
          background: var(--white); 
          border-color: var(--pink-200); 
          box-shadow: var(--shadow-sm);
        }
        .category-section.list .category-card.active { 
          border-color: var(--pink-500); 
          background: var(--pink-50); 
          color: var(--pink-600);
        }
        .category-section.list .category-icon { font-size: 1.2rem; }
        .category-section.list .category-title { 
          font-size: 14px;
          font-weight: 600; 
          color: inherit; 
          margin: 0; 
        }

        /* ICONS MODE (Collapsed Sidebar) */
        .category-section.icons { padding: 0.5rem 0; }
        .category-section.icons .category-container { display: flex; flex-direction: column; gap: 1rem; align-items: center; }
        .category-section.icons .category-card { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; border: 1px solid var(--gray-200); cursor: pointer; transition: all 0.2s ease; background: var(--white); }
        .category-section.icons .category-card:hover { background: var(--gray-50); border-color: var(--pink-300); transform: scale(1.1); }
        .category-section.icons .category-card.active { border-color: var(--pink-500); background: var(--pink-50); color: var(--pink-600); }
        .category-section.icons .category-icon { font-size: 1.25rem; }

        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}
