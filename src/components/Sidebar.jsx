import React from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaThLarge } from 'react-icons/fa';
import Calendar from './Calendar';
import CategorySection from './CategorySection';
import { useTranslation } from 'react-i18next';
import '../styles/Sidebar.css';

export default function Sidebar({
  isExpanded,
  onToggle,
  selectedDate,
  onSelectDate,
  onAvailabilityLoad,
  selectedCategory,
  onSelectCategory,
  showCards
}) {
  const { t } = useTranslation();

  const handleHeaderClick = () => {
    if (!isExpanded) {
      onToggle();
    }
  };

  return (
    <>
      <aside className={`home-sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="sidebar-inner">
          
          {/* Toggle Button */}
          <button className="sidebar-toggle" onClick={onToggle} title={isExpanded ? "Collapse" : "Expand"}>
            {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
          </button>

          <div className="sidebar-scroll-content">
            {/* Calendar Section */}
            <div className="sidebar-section">
              <div className="section-header-icon" onClick={handleHeaderClick}>
                <FaCalendarAlt />
                {isExpanded && <span className="section-title">{t('Select Date')}</span>}
              </div>
              
              {isExpanded && (
                <div className="calendar-wrapper-sidebar">
                  <Calendar
                    selectedDate={selectedDate}
                    onSelectDate={onSelectDate}
                    onAvailabilityLoad={onAvailabilityLoad}
                  />
                  <div className="sidebar-hint">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="dot dot-available"></span> {t('Available')}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="dot dot-reserved"></span> {t('Reserved')}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Categories Section */}
            <div className="sidebar-section categories-section">
              <div className="section-header-icon" onClick={handleHeaderClick}>
                <FaThLarge />
                {isExpanded && <span className="section-title">{t('Categories')}</span>}
              </div>

              <div className="categories-wrapper-sidebar">
                <CategorySection 
                  mode={isExpanded ? "list" : "icons"}
                  selectedCategory={selectedCategory} 
                  onSelectCategory={onSelectCategory} 
                />
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-mobile-overlay ${isExpanded ? 'visible' : ''}`}
        onClick={onToggle}
      ></div>
    </>
  );
}
