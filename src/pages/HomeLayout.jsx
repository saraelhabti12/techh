import React, { useState, useEffect, useRef } from 'react';
import HeroBanner from '../components/HeroBanner';
import FilterBar from '../components/FilterBar';
import Calendar from '../components/Calendar';
import CategorySection from '../components/CategorySection';
import StudioList from '../components/StudioList';

export default function HomeLayout({ openBook }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [showCards, setShowCards] = useState(false);
  
  // Combined Filters State
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    availableOnly: false
  });

  const cardsSectionRef = useRef(null);

  const handleSelectCategory = (catId) => {
    const newCat = selectedCategory === catId ? null : catId;
    setSelectedCategory(newCat);
    
    // 'booking' shows all studios (empty category filter)
    const filterCat = newCat === 'booking' ? '' : (newCat || '');
    setFilters(prev => ({ ...prev, category: filterCat }));
    
    if (newCat) {
      setShowCards(true);
    } else {
      setShowCards(false);
    }
  };

  // Sync category from FilterBar back to local state
  useEffect(() => {
    if (filters.category && filters.category !== selectedCategory) {
        setSelectedCategory(filters.category);
        setShowCards(true);
    }
    
    if (filters.search || filters.minPrice || filters.maxPrice || filters.availableOnly) {
        setShowCards(true);
    }
  }, [filters]);

  return (
    <div className="home-page-root">
      {/* 1. TOP BANNER (Full Width) */}
      <HeroBanner 
        onReserve={() => openBook()} 
        onExplore={() => {}}
      />

      {/* 2. FILTER BAR (Full Width, Centered Content) */}
      <div className="filter-wrapper">
        <div className="container">
          <FilterBar filters={filters} setFilters={setFilters} />
        </div>
      </div>

      {/* 3. MAIN CONTENT SECTION */}
      <div className="layout-container">
        
        {/* LEFT FIXED CALENDAR (MAX LEFT) */}
        <aside className="calendar-sidebar">
          <div className="calendar-sticky-box">
            <h3 className="sidebar-title">Select Date</h3>
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onAvailabilityLoad={setAvailability}
            />
            <div className="sidebar-hint">
               <span className="dot dot-available"></span> Available
               <span className="dot dot-reserved" style={{ marginLeft: '1rem' }}></span> Reserved
            </div>
          </div>
        </aside>

        {/* CENTERED CATEGORIES & CARDS */}
        <main className="main-content">
          <section className="categories-section">
            <CategorySection 
              selectedCategory={selectedCategory} 
              onSelectCategory={handleSelectCategory} 
            />
          </section>

          <div 
            ref={cardsSectionRef} 
            className={`cards-display-container ${showCards ? 'visible' : 'hidden'}`}
          >
            <div className="cards-header">
               <h2 className="font-display">
                {selectedCategory === 'booking' ? 'All Studios' : 
                 selectedCategory ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Spaces` : 
                 'Studios'}
               </h2>
            </div>

            <StudioList
                selectedDate={selectedDate}
                selectedCategory={filters.category}
                availability={availability}
                onBook={openBook}
                externalFilters={filters}
            />
          </div>
        </main>

      </div>

      <style>{`
        .home-page-root {
          background: var(--gray-50);
          min-height: 100vh;
        }

        .filter-wrapper {
          padding: 2rem 0;
          background: var(--white);
          border-bottom: 1px solid var(--gray-200);
          margin-bottom: 3rem;
        }

        .layout-container {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 5rem;
        }

        /* Calendar Sidebar - Max Left & Fixed/Sticky */
        .calendar-sidebar {
          position: absolute;
          left: 40px;
          top: 0;
          width: 350px;
          height: 100%;
          pointer-events: none;
        }

        .calendar-sticky-box {
          position: sticky;
          top: 100px;
          pointer-events: auto;
          background: var(--white);
          padding: 1.5rem;
          border-radius: var(--r-xl);
          border: 1px solid var(--gray-200);
          box-shadow: var(--shadow-sm);
        }

        .sidebar-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 1.25rem;
        }

        .sidebar-hint {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--gray-500);
        }

        /* Main Content - Centered */
        .main-content {
          width: 100%;
          max-width: 1200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 2rem;
          z-index: 1;
        }

        .categories-section {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-bottom: 4rem;
        }

        .cards-display-container {
          width: 100%;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .cards-display-container.hidden {
          opacity: 0;
          transform: translateY(30px);
          pointer-events: none;
          height: 0;
          overflow: hidden;
        }

        .cards-display-container.visible {
          opacity: 1;
          transform: translateY(0);
          height: auto;
        }

        .cards-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--pink-100);
          display: inline-block;
          margin-left: auto;
          margin-right: auto;
          width: fit-content;
        }

        .cards-header h2 {
          font-size: 2rem;
          color: var(--gray-900);
          text-transform: capitalize;
        }

        /* Responsive Layout */
        @media (max-width: 1300px) {
          .calendar-sidebar {
            position: relative;
            left: 0;
            width: 100%;
            max-width: 600px;
            height: auto;
            margin-bottom: 3rem;
            order: -1;
          }
          .calendar-sticky-box {
            position: static;
          }
          .layout-container {
            padding: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
}
