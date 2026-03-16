import { useState, useEffect } from "react";
import StudioCard from "./StudioCard";
import { getStudios } from "../api/studioApi";

/**
 * StudioList
 * ─ Renders the studio grid and an inline detail modal.
 *   Shows availability status when `availability` prop is supplied.
 * Props:
 *   selectedDate  string | null
 *   availability  {studio_id, status, price}[]
 *   onBook        (studio) → void
 */
export default function StudioList({ selectedDate, availability, onBook }) {
  const [studios, setStudios] = useState([]);
  const [detail,  setDetail]    = useState(null);
  const [imgIdx,  setImgIdx]    = useState(0);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Fetches all studios when the component mounts, ensuring studios are displayed by default.
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
  }, []); // Empty dependency array means this runs once on mount

  // Helper to find availability for a given studio ID from the `availability` prop.
  const avail = (studioId) => availability?.find(a => a.studio_id === studioId);

  // Compute counts
  const availableCount = availability ? availability.filter(a => a.status === "available").length : 0;
  const reservedCount = availability ? availability.filter(a => a.status === "reserved").length : 0;

  return (
    <div id="studios">
      {/* Date banner - Renders only when a date is selected. */}
      {/* This section displays availability information for the selected date. */}
      {selectedDate && (
        <div className="availability-banner animate-fadeIn">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.2rem" }}>📅</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", color: "var(--gray-900)" }}>
              Availability for <strong>{new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</strong>
            </span>
          </div>
          <div style={{ display: "flex", gap: "1.25rem", fontSize: "0.85rem", fontWeight: 500 }}>
            {availability && (
              <>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--available)" }}>
                  <span className="dot dot-available" />
                  {availableCount} Available
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--reserved)" }}>
                  <span className="dot dot-reserved" />
                  {reservedCount} Reserved
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Studio grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1.5rem",
      }}>
        {loading ? (
          // Simple Skeleton loader for cards
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
          (studios || []).map((s, i) => {
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
      {detail && (
        <div
          className="modal-overlay"
          onClick={e => e.target === e.currentTarget && setDetail(null)}
        >
          <div className="modal-panel" style={{ maxWidth: 720 }}>
            {/* Hero image with gallery dots */}
            <div style={{ position: "relative", height: 340, overflow: "hidden", borderRadius: "var(--r-xl) var(--r-xl) 0 0" }}>
              <img
                src={detail.gallery?.[imgIdx] || detail.image}
                alt={detail.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity 0.4s ease" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
              }} />

              {/* Gallery dots */}
              {detail.gallery?.length > 1 && (
                <div style={{
                  position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
                  display: "flex", gap: "0.5rem",
                }}>
                  {detail.gallery.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)} style={{
                      width: i === imgIdx ? 24 : 8, height: 8, borderRadius: 50,
                      background: i === imgIdx ? "#fff" : "rgba(255,255,255,0.6)",
                      border: "none", cursor: "pointer", transition: "all 0.3s ease",
                      padding: 0,
                    }} />
                  ))}
                </div>
              )}

              {/* Close button */}
              <button
                onClick={() => setDetail(null)}
                style={{
                  position: "absolute", top: 16, right: 16,
                  background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)",
                  border: "none", borderRadius: "50%",
                  width: 36, height: 36, cursor: "pointer", fontSize: "1.1rem",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gray-900)",
                  transition: "background 0.2s"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#fff"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.9)"}
              >✕</button>

              {/* Name on image */}
              <div style={{ position: "absolute", bottom: 24, left: 24 }}>
                <div className="heading-lg" style={{ color: "#fff", marginBottom: "0.2rem" }}>{detail.name}</div>
                <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>{detail.tagline}</div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "2rem" }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem",
              }}>
                <div>
                  <span className="heading-lg" style={{ color: detail.color || "var(--pink-500)", fontWeight: 600 }}>MAD {detail.price_per_hour}</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--gray-500)", marginLeft: "0.25rem" }}>/ hour</span>
                  <span style={{ fontSize: "0.8rem", color: "var(--gray-400)", marginLeft: "0.75rem", borderLeft: "1px solid var(--gray-300)", paddingLeft: "0.75rem" }}>
                    Min {detail.min_hours}h
                  </span>
                </div>
                <span className="tag tag-available" style={{ fontSize: "0.8rem", padding: "0.4rem 1rem" }}>
                  <span className="dot dot-available" style={{ background: "var(--available)" }} /> Available
                </span>
              </div>

              <p className="body-md" style={{ marginBottom: "2rem" }}>
                {detail.description}
              </p>

              <h4 className="eyebrow" style={{ marginBottom: "1rem" }}>What's Included</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "2.5rem" }}>
                 {(detail.features || []).map(f => (
                  <span key={f} className="tag tag-pink" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>
                    ✓ {f}
                  </span>
                ))}
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button className="btn btn-outline btn-lg" style={{ flex: 1 }} onClick={() => setDetail(null)}>Close</button>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ flex: 2 }}
                  onClick={() => { setDetail(null); onBook?.(detail); }}
                >
                  Book This Studio →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}