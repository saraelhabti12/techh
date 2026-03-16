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
  const isAvailable = !status || status === "available";
  // displayPrice: uses the price from availability if provided, otherwise defaults to studio's price_per_hour
  const displayPrice = price || studio.price_per_hour;

  return (
    <div
      className={`studio-card animate-fadeUp ${!isAvailable ? "reserved" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={() => onDetail?.(studio)}
    >
      {/* ── Image Wrapper ── */}
      <div className="studio-card-img-wrapper">
        <img
          src={studio.image}
          alt={studio.name}
          className="studio-card-img"
        />

        {/* Studio badge (e.g. "Premium", "New") */}
        {studio.badge && (
          <div className="badge-overlay">
            {studio.badge}
          </div>
        )}

        {/* Availability badge */}
        <div className={`status-badge ${isAvailable ? 'available' : 'reserved'}`}>
          <span className="dot" />
          {isAvailable ? "Available" : "Reserved"}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="studio-card-content">
        <div className="studio-card-header">
          <h3 className="studio-card-title">
            {studio.name}
          </h3>
          {studio.rating && (
            <span style={{ fontSize: "0.85rem", color: "#FFD700", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.2rem" }}>
              ★ {studio.rating}
            </span>
          )}
        </div>
        
        <p className="studio-card-tagline">
          {studio.tagline}
        </p>
        
        <p className="studio-card-description line-clamp-3">
          {studio.description}
        </p>

        {/* Features Tags */}
        <div className="studio-card-features">
           {(studio.features || []).slice(0, 3).map(f => (
            <span key={f} className="studio-card-feature-tag">
              {f}
            </span>
          ))}
          { studio.features && studio.features.length > 3 && (
            <span className="studio-card-feature-tag">
              +{studio.features.length - 3} more
            </span>
          )}
        </div>

        {/* Price row + CTA */}
        <div className="studio-card-footer">
          <div>
            <span className="studio-card-price-amount">MAD {displayPrice}</span>
            <span className="studio-card-price-unit">/ hr</span>
          </div>

          <div className="studio-card-actions">
            <button
              className="btn-secondary"
              onClick={e => { e.stopPropagation(); onDetail?.(studio); }}
            >
              Details
            </button>
            {isAvailable ? (
              <button
                className="btn btn-primary"
                onClick={e => { e.stopPropagation(); onBook?.(studio); }}
                style={{ padding: "0.65rem 1.5rem" }}
              >
                Book
              </button>
            ) : (
              <button
                className="btn"
                disabled
                style={{ 
                  background: "var(--gray-100)",
                  color: "var(--gray-500)",
                  cursor: "not-allowed",
                  padding: "0.65rem 1.5rem"
                }}
              >
                Book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}