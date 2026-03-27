import { useTranslation } from "react-i18next";
import { FiHeart } from "react-icons/fi";
import { useFavorites } from "../App";

/**
 * StudioCard
 * ─ Individual studio card with CSS-based hover effects and modern layout.
 * Props:
 *   studio       Studio object
 *   status       "available" | "reserved" | null
 *   price        number (may differ from base if API returns override)
 *   onBook       (studio) → void
 *   onDetail     (studio) → void
 *   delay        number  animation stagger delay (ms)
 */
export default function StudioCard({ studio, status, price, onBook, onDetail, delay = 0 }) {
  const { t } = useTranslation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const isAvailable = !status || status === "available";
  // displayPrice: uses the price from availability if provided, otherwise defaults to studio's price_per_hour
  const displayPrice = price || studio.price_per_hour;

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    await toggleFavorite(studio.id);
  };

  const activeFavorite = isFavorite(studio.id);

  return (
    <div
      className={`studio-card animate-fadeUp ${!isAvailable ? "reserved" : ""}`}
      style={{ 
        animationDelay: `${delay}ms`,
        maxWidth: "320px", // USER REQUESTED
        margin: "0 auto",
        width: "100%"
      }}
      onClick={() => onDetail?.(studio)}
    >
      {/* ── Image Wrapper ── */}
      <div className="studio-card-img-wrapper" style={{ height: "220px" }}> {/* USER REQUESTED increase image height */}
        <img
          src={studio.image}
          alt={studio.name}
          className="studio-card-img"
        />

        {/* Favorite Heart Icon */}
        <button
          onClick={handleFavoriteClick}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            zIndex: 30,
            background: 'rgba(255, 255, 255, 0.9)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            transition: 'all 0.2s ease',
            color: activeFavorite ? 'var(--pink-500)' : 'var(--gray-400)'
          }}
          className="favorite-btn"
        >
          <FiHeart 
            size={20} 
            fill={activeFavorite ? 'var(--pink-500)' : 'none'} 
            style={{ transition: 'all 0.2s ease' }}
          />
        </button>

        {/* Availability badge */}
        <div className={`status-badge ${isAvailable ? 'available' : 'reserved'}`} style={{ top: "1rem", right: "1rem", padding: "0.4rem 0.8rem", fontSize: "0.75rem" }}>
          <span className="dot" />
          {isAvailable ? t("available") : t("reserved")}
        </div>

        {/* ── Hover Overlay Actions ── */
        }
        {!isAvailable ? (
           <div className="studio-card-actions" style={{ background: 'rgba(0,0,0,0.6)', cursor: 'not-allowed' }}>
              <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem' }}>Fully Booked</span>
           </div>
        ) : (
          <div className="studio-card-actions" style={{ padding: "1.25rem" }}>
            <button
              className="btn btn-primary btn-md"
              style={{ width: "100%" }}
              onClick={e => { e.stopPropagation(); onBook?.(studio); }}
            >
              {t("book_now")}
            </button>
            <button
              className="btn btn-outline btn-md"
              style={{ width: "100%", background: 'rgba(255,255,255,1)', color: 'var(--gray-900)', borderColor: 'var(--white)' }}
              onClick={e => { e.stopPropagation(); onDetail?.(studio); }}
            >
              {t("view_details")}
            </button>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="studio-card-content" style={{ padding: "1.5rem" }}>
      <div className="studio-card-header" style={{ marginBottom: "0.75rem" }}>
          <h3 className="studio-card-title" style={{ fontSize: "1.25rem" }}> {/* USER REQUESTED 1.25rem (20px) */}
            {studio.name}
          </h3>
          {studio.rating && (
            <span style={{ fontSize: "0.9rem", color: "#FFD700", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
              ★ {studio.rating}
            </span>
          )}
        </div>
        
        <p className="studio-card-tagline" style={{ fontSize: "0.9rem", marginBottom: "1rem", color: "var(--gray-500)", fontWeight: 600 }}>
          {studio.tagline}
        </p>
        
        <p className="studio-card-description line-clamp-2" style={{ fontSize: "0.9rem", marginBottom: "1.25rem", minHeight: "2.8rem", color: "var(--gray-600)" }}>
          {studio.description}
        </p>

        {/* Features Tags */}
        <div className="studio-card-features" style={{ marginBottom: "1.5rem", gap: "0.5rem" }}>
           {(studio.features || []).slice(0, 2).map(f => (
            <span key={f} className="studio-card-feature-tag" style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}>
              {f}
            </span>
          ))}
          { studio.features && studio.features.length > 2 && (
            <span className="studio-card-feature-tag" style={{ padding: "0.4rem 0.75rem", fontSize: "0.75rem" }}>
              +{studio.features.length - 2}
            </span>
          )}
        </div>

        {/* Price row */}
        <div className="studio-card-footer" style={{ paddingTop: "1.25rem" }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
            <span className="studio-card-price-amount" style={{ fontSize: "1.5rem", fontWeight: 800 }}>{displayPrice}</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--gray-700)' }}>MAD</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--gray-400)', fontWeight: 500 }}>/ hr</span>
          </div>
        </div>
      </div>
    </div>
  );
}
