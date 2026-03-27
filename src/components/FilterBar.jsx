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
            placeholder={t('search_studios_placeholder') || "Search..."}
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
          <option value="">{t('all_categories') || "All"}</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{t(cat.title)}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">{t('price_range')}</label>
        <div className="price-inputs">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Min"
            className="filter-input price-input"
          />
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
          <span className="toggle-label">{t('available_only') || "Available"}</span>
        </label>
      </div>

      <style>{`
        .filter-bar {
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: 16px;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: flex-end;
          gap: 1rem;
          box-shadow: var(--shadow-sm);
          width: 100%;
          margin-bottom: 2rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          flex: 1;
        }

        .search-group {
          flex: 1.5;
        }

        .filter-label {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--gray-400);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.85rem;
          color: var(--gray-400);
        }

        .filter-input, .filter-select {
          height: 42px;
          width: 100%;
          padding: 0 1rem;
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: 10px;
          font-size: 0.9rem;
          color: var(--gray-900);
          font-weight: 500;
          transition: all 0.2s var(--ease);
        }

        .filter-input:focus, .filter-select:focus {
          background: var(--white);
          border-color: var(--pink-400);
          box-shadow: 0 0 0 3px rgba(255, 15, 155, 0.05);
        }

        .input-wrapper .filter-input {
          padding-left: 2.4rem;
        }

        .price-inputs {
          display: flex;
          gap: 0.5rem;
        }

        .price-input {
          padding: 0 0.5rem;
          text-align: center;
        }

        .toggle-group {
          flex: 0 0 auto;
          margin-bottom: 0.5rem;
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
        }

        .filter-toggle input {
          display: none;
        }

        .toggle-slider {
          width: 38px;
          height: 20px;
          background: var(--gray-200);
          border-radius: 10px;
          position: relative;
          transition: 0.3s;
        }

        .toggle-slider::before {
          content: '';
          position: absolute;
          width: 14px;
          height: 14px;
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
          transform: translateX(18px);
        }

        .toggle-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--gray-700);
          white-space: nowrap;
        }

        @media (max-width: 1024px) {
          .filter-bar {
            flex-wrap: wrap;
          }
          .filter-group {
            min-width: calc(50% - 0.5rem);
          }
          .search-group {
            min-width: 100%;
          }
          .toggle-group {
            min-width: 100%;
            margin-bottom: 0;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
