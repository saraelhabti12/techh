import React from 'react';
import { useTranslation } from 'react-i18next';

const categories = [
  { id: 'content', title: 'Content' },
  { id: 'podcast', title: 'Podcast' },
  { id: 'shooting', title: 'Shooting' },
  { id: 'girly', title: 'Girly Space' },
  { id: 'birthday', title: 'Birthday' },
];

export default function FilterBar({ filters, setFilters }) {
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="filter-bar animate-fadeIn">
      <div className="filter-group search-group">
        <label className="filter-label">{t('search')}</label>
        <div className="input-wrapper">
          <span className="input-icon">🔍</span>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder={t('search_studios_placeholder') || "Search by name..."}
            className="filter-input"
          />
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">{t('category')}</label>
        <select 
          name="category" 
          value={filters.category || ''} 
          onChange={handleChange}
          className="filter-select"
        >
          <option value="">{t('all_categories') || "All Categories"}</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{t(cat.title)}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">{t('price_range')} (MAD)</label>
        <div className="price-inputs">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Min"
            className="filter-input price-input"
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Max"
            className="filter-input price-input"
          />
        </div>
      </div>

      <div className="filter-group toggle-group">
        <label className="filter-toggle">
          <input
            type="checkbox"
            name="availableOnly"
            checked={filters.availableOnly}
            onChange={handleChange}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">{t('available_only') || "Available only"}</span>
        </label>
      </div>

      <style>{`
        .filter-bar {
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: var(--r-xl);
          padding: 1.5rem 2rem;
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          gap: 1.5rem;
          box-shadow: var(--shadow-md);
          margin: 0 auto;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
          min-width: 150px;
        }

        .search-group {
          flex: 1.5;
        }

        .filter-label {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.9rem;
          color: var(--gray-400);
        }

        .filter-input, .filter-select {
          width: 100%;
          padding: 0.85rem 1.25rem;
          background: var(--gray-50);
          border: 1.5px solid var(--gray-100);
          border-radius: 14px;
          font-size: 0.95rem;
          color: var(--gray-900);
          font-weight: 500;
          transition: all 0.3s var(--ease);
        }

        .filter-input:focus, .filter-select:focus {
          background: var(--white);
          border-color: var(--pink-400);
          box-shadow: 0 0 0 4px rgba(255, 15, 155, 0.08);
        }

        .input-wrapper .filter-input {
          padding-left: 2.8rem;
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .price-input {
          padding: 0.85rem 0.5rem;
          text-align: center;
        }

        .price-separator {
          color: var(--gray-300);
          font-weight: 600;
        }

        .toggle-group {
          flex: 0 0 auto;
          min-width: auto;
          padding-bottom: 0.5rem;
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
        }

        .filter-toggle input {
          display: none;
        }

        .toggle-slider {
          width: 44px;
          height: 24px;
          background: var(--gray-200);
          border-radius: 20px;
          position: relative;
          transition: 0.3s;
        }

        .toggle-slider::before {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          background: #fff;
          border-radius: 50%;
          top: 3px;
          left: 3px;
          transition: 0.3s;
        }

        .filter-toggle input:checked + .toggle-slider {
          background: var(--pink-500);
        }

        .filter-toggle input:checked + .toggle-slider::before {
          transform: translateX(20px);
        }

        .toggle-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--gray-700);
        }

        @media (max-width: 900px) {
          .filter-bar {
            padding: 1.25rem;
            gap: 1rem;
          }
          .filter-group {
            min-width: calc(50% - 1rem);
          }
          .search-group {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
