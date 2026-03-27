import React, { useState, useEffect, useRef } from 'react';
import HeroBanner from '../components/HeroBanner';
import FilterBar from '../components/FilterBar';
import StudioList from '../components/StudioList';
import CategorySection from '../components/CategorySection';

export default function HomeLayout({ 
  openBook, 
  onAuth,
  selectedDate,
  setSelectedDate,
  selectedCategory,
  setSelectedCategory,
  availability,
  setAvailability
}) {
  const [showCards, setShowCards] = useState(false);
  const cardsRef = useRef(null);
  
  // Combined Filters State
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    availableOnly: false
  });

  // Handle local grid category selection
  const handleSelectCategory = (catId) => {
    const newCat = selectedCategory === catId ? null : catId;
    setSelectedCategory(newCat);
  };

  // 1. Sync Prop Category -> Local Filters & Show Cards
  useEffect(() => {
    if (selectedCategory) {
      const filterCat = selectedCategory === 'booking' ? '' : selectedCategory;
      setFilters(prev => ({ ...prev, category: filterCat }));
      setShowCards(true);
      
      // Small delay to ensure DOM is ready before scrolling
      setTimeout(() => {
        if (cardsRef.current) {
          cardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      // If deselected, and other filters are empty, we could hide cards
      if (!filters.search && !filters.minPrice && !filters.maxPrice && !filters.availableOnly) {
        setShowCards(false);
      }
    }
  }, [selectedCategory]);

  // 2. Handle changes from FilterBar
  useEffect(() => {
    if (filters.category && filters.category !== selectedCategory) {
        setSelectedCategory(filters.category);
    }
    if (filters.search || filters.minPrice || filters.maxPrice || filters.availableOnly) {
        setShowCards(true);
    }
  }, [filters]);

  return (
    <div className="home-content-container">
      {/* BANNER */}
      <HeroBanner 
        onReserve={() => openBook()} 
        onExplore={() => {}}
      />

      {/* FILTER BAR */}
      <div className="filter-wrapper" style={{ 
        padding: '20px 30px', 
        background: 'var(--white)', 
        borderBottom: '1px solid var(--gray-200)'
      }}>
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>

      <div className="main-content-inner" style={{ padding: '40px 30px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Categories Grid (Initial View) */}
        <div className={`large-categories-container ${showCards ? 'hidden' : 'visible'}`}>
           <CategorySection 
              mode="grid"
              selectedCategory={selectedCategory} 
              onSelectCategory={handleSelectCategory} 
            />
        </div>

        {/* Studio Results List */}
        <div ref={cardsRef} className={`studio-results-wrapper ${showCards ? 'visible' : 'hidden'}`}>
          <div className="results-header" style={{ marginBottom: '40px' }}>
             <h2 className="font-display" style={{ fontSize: '2.5rem', fontWeight: '800', borderBottom: '2px solid var(--gray-200)', paddingBottom: '1rem' }}>
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
      </div>

      <style>{`
        .home-content-container { width: 100%; position: relative; }
        .large-categories-container { transition: all 0.5s var(--ease); width: 100%; }
        .large-categories-container.hidden { opacity: 0; transform: scale(0.95) translateY(-20px); pointer-events: none; height: 0; margin: 0; overflow: hidden; }
        .studio-results-wrapper { width: 100%; transition: all 0.5s var(--ease); }
        .studio-results-wrapper.hidden { opacity: 0; transform: translateY(30px); pointer-events: none; height: 0; overflow: hidden; }
        
        @media (max-width: 768px) {
          .main-content-inner { padding: 30px 20px !important; }
        }
      `}</style>
    </div>
  );
}
