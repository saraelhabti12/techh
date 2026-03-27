import { useState, useEffect, useMemo } from "react";
import StudioCard from "./StudioCard";
import Modal from "./Modal";
import FilterBar from "./FilterBar";
import { getStudios } from "../api/studioApi";
import { useTranslation } from "react-i18next";

/**
 * StudioList
 * ─ Renders the studio grid and an inline detail modal.
 * Props:
 *   selectedDate      string | null
 *   selectedCategory  string | null
 *   availability      {studio_id, status, price}[]
 *   onBook            (studio) → void
 *   externalFilters   object (optional)
 */
export default function StudioList({ selectedDate, selectedCategory, availability, onBook, externalFilters }) {
  const [studios, setStudios] = useState([]);
  const [detail,  setDetail]    = useState(null);
  const [imgIdx,  setImgIdx]    = useState(0);
  const [loading, setLoading]   = useState(true);
  const { t, i18n } = useTranslation();

  // Local state for internal FilterBar if no externalFilters provided
  const [internalFilters, setInternalFilters] = useState({
    search: '',
    category: selectedCategory || '',
    minPrice: '',
    maxPrice: '',
    availableOnly: false
  });

  const activeFilters = externalFilters || internalFilters;

  useEffect(() => {
    setLoading(true);
    getStudios()
      .then(res => {
        setStudios(res?.data || res || []);
        setLoading(false);
      })
      .catch(() => {
        setStudios([]);
        setLoading(false);
      });
  }, []);

  const avail = (studioId) => availability?.find(a => a.studio_id === studioId);
  const availableCount = availability ? availability.filter(a => a.status === "available").length : 0;
  const reservedCount = availability ? availability.filter(a => a.status === "reserved").length : 0;

  // ── Combined Filtering Logic ──
  const filteredStudios = useMemo(() => {
    const { search, category, minPrice, maxPrice, availableOnly } = activeFilters;

    return studios.filter(s => {
      // Category filtering using the new dynamic structure
      if (category) {
        const matchesCategory = s.category?.name === category || s.category_name === category;
        if (!matchesCategory) return false;
      }

      // Search
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && 
          !s.tagline.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // Price
      const price = avail(s.id)?.price || s.price_per_hour;
      if (minPrice && price < parseFloat(minPrice)) return false;
      if (maxPrice && price > parseFloat(maxPrice)) return false;

      // Availability
      if (availableOnly) {
        const status = avail(s.id)?.status || "available";
        if (status !== "available") return false;
      }

      return true;
    });
  }, [studios, activeFilters, availability]);

  return (
    <div id="studios">
      {/* Only show internal FilterBar if no externalFilters provided */}
      {!externalFilters && <FilterBar filters={activeFilters} setFilters={setInternalFilters} />}

      {selectedDate && (
        <div className="availability-banner animate-fadeIn" style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.2rem" }}>📅</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--gray-900)" }}>
              {t('availability_for')} <strong>{new Date(selectedDate + "T00:00:00").toLocaleDateString(i18n.language === 'fr' ? 'fr-FR' : 'en-US', { weekday: "long", month: "long", day: "numeric" })}</strong>
            </span>
          </div>
          <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.85rem", fontWeight: 500 }}>
            {availability && (
              <>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--available)" }}>
                  <span className="dot dot-available" />
                  {availableCount} {t('available')}
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--reserved)" }}>
                  <span className="dot dot-reserved" />
                  {reservedCount} {t('reserved')}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {(activeFilters.search || activeFilters.category || activeFilters.minPrice || activeFilters.maxPrice || activeFilters.availableOnly) && filteredStudios.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--white)', borderRadius: 'var(--r-lg)', border: '1px solid var(--gray-200)', marginBottom: '2rem' }}>
          <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>🔍</span>
          <h3 style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{t('no_studios_match_filters') || "No studios match your filters"}</h3>
          <p style={{ color: 'var(--gray-500)' }}>{t('try_adjusting_filters') || "Try adjusting your filters to find what you're looking for."}</p>
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "24px",
      }}>
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="studio-card" style={{ height: 420 }}>
               <div className="studio-card-img-wrapper" style={{ background: "var(--gray-100)", animation: "pulse 1.5s infinite" }} />
               <div className="studio-card-content" style={{ gap: "1rem" }}>
                  <div style={{ height: "20px", width: "60%", background: "var(--gray-100)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
                  <div style={{ height: "14px", width: "80%", background: "var(--gray-100)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
                  <div style={{ height: "14px", width: "50%", background: "var(--gray-100)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
                  <div style={{ height: "40px", width: "100%", background: "var(--gray-100)", borderRadius: "8px", animation: "pulse 1.5s infinite", marginTop: "auto" }} />
               </div>
             </div>
          ))
        ) : (
          (filteredStudios || []).map((s, i) => {
            const a = avail(s.id);
            return (
              <StudioCard
                key={s.id}
                studio={s}
                status={a?.status || null}
                price={a?.price || null}
                onBook={onBook}
                onDetail={studio => { setDetail(studio); setImgIdx(0); }}
                delay={i * 85}
              />
            );
          })
        )}
      </div>

      {/* ── Detail Modal ── */}
      <Modal isOpen={!!detail} onClose={() => setDetail(null)} maxWidth="850px">
        {detail && (
          <div className="animate-fadeIn">
            <div style={{ position: "relative", height: 380, overflow: "hidden", borderRadius: "16px", marginBottom: "2rem" }}>
              <img
                src={detail.gallery?.[imgIdx] || detail.image}
                alt={detail.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.4s ease" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
              {detail.gallery?.length > 1 && (
                <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: "0.6rem" }}>
                  {detail.gallery.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)} style={{ width: i === imgIdx ? 28 : 10, height: 10, borderRadius: 50, background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.5)", border: "none", cursor: "pointer", transition: "all 0.3s ease", padding: 0 }} />
                  ))}
                </div>
              )}
              <div style={{ position: "absolute", bottom: 30, left: 30 }}>
                <h2 className="font-display" style={{ color: "#fff", marginBottom: "0.4rem", fontSize: "2.5rem", lineHeight: 1 }}>{detail.name}</h2>
                <div style={{ fontSize: "1rem", color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>{detail.tagline}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1.5rem" }}>
              <div>
                <span style={{ fontSize: "2rem", color: "var(--gray-900)", fontWeight: 800 }}>MAD {detail.price_per_hour}</span>
                <span style={{ fontSize: "1rem", color: "var(--gray-500)", marginLeft: "0.4rem" }}>/ hour</span>
                <span style={{ fontSize: "0.9rem", color: "var(--gray-200)", margin: "0 1.5rem" }}>|</span>
                <span style={{ fontSize: "1rem", color: "var(--gray-600)", fontWeight: 500 }}>{t('min_session', { hours: detail.min_hours })}</span>
              </div>
              <span className="tag" style={{ background: 'var(--available-bg)', color: 'var(--available)', fontSize: "0.9rem", padding: "0.6rem 1.2rem", borderRadius: "12px", fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="dot" style={{ background: "var(--available)", width: 8, height: 8 }} /> {t('available_now')}
              </span>
            </div>
            <div style={{ marginBottom: "2.5rem" }}>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-400)', marginBottom: '1rem', fontWeight: 800 }}>{t('about_this_space')}</h4>
              <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "var(--gray-700)", fontWeight: 400 }}>{detail.description}</p>
            </div>
            <div style={{ marginBottom: "3rem" }}>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--gray-400)', marginBottom: '1.25rem', fontWeight: 800 }}>{t('included_amenities')}</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                 {(detail.features || []).map(f => (
                  <span key={f} style={{ padding: "0.6rem 1.25rem", fontSize: "0.9rem", background: "var(--gray-50)", color: "var(--gray-700)", border: "1px solid var(--gray-100)", borderRadius: "12px", fontWeight: 600 }}>✓ {f}</span>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.25rem", paddingTop: '1.5rem', borderTop: '1px solid var(--gray-100)' }}>
              <button className="btn btn-outline" style={{ flex: 1, height: "56px", borderRadius: "14px" }} onClick={() => setDetail(null)}>{t('close')}</button>
              <button className="btn btn-primary" style={{ flex: 2, height: "56px", borderRadius: "14px", fontSize: "1.1rem" }} onClick={() => { setDetail(null); onBook?.(detail); }}>{t('book_this_studio_now')} →</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}