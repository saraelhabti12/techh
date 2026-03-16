import { useState, useEffect } from "react";
import { getOffers, OFFERS } from "../api/studioApi";

/**
 * SpecialOffer
 * ─ Fetches and displays subscription / discount offers.
 * Props:
 *   onBook  () → void
 */
export default function SpecialOffer({ onBook }) {
  const [offers,    setOffers]    = useState(OFFERS);
  const [copied,    setCopied]    = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [showDetailsId, setShowDetailsId] = useState(null);

  useEffect(() => {
    getOffers()
      .then(res => setOffers(res?.data || res))
      .catch(() => setOffers(OFFERS));
  }, []);

  const copyPromo = (promo) => {
    navigator.clipboard?.writeText(promo).catch(() => {});
    setCopied(promo);
    setTimeout(() => setCopied(null), 2200);
  };

  return (
    <section id="offers" style={{
      padding: "5.5rem 0",
      background: "linear-gradient(135deg, #FDF6FA 0%, #FDF6FA 50%, #FDF6FA 100%)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Decorative blobs */}
      {[
        { top: "-100px", right: "-80px",   w: 340, c: "rgba(237,122,170,0.12)"  },
        { bottom: "-80px", left: "-60px",  w: 280, c: "rgba(124,79,224,0.10)"   },
        { top: "40%", left: "50%",         w: 220, c: "rgba(200,160,255,0.08)"  },
      ].map((b, i) => (
        <div key={i} style={{
          position: "absolute", borderRadius: "50%",
          width: b.w, height: b.w,
          background: b.c, filter: "blur(60px)",
          top: b.top, right: b.right, bottom: b.bottom, left: b.left,
          pointerEvents: "none",
        }} />
      ))}

      <div style={{ position: "relative" }}>
        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <p className="eyebrow">Exclusive Deals</p>
          <h2 className="heading-lg" style={{ color: "#1A1A1A" }}>
            Special <span style={{
              background: "linear-gradient(135deg, #FF0F9B, #C4009A)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Offers & Bundles</span>
          </h2>
          <p className="body-md" style={{ maxWidth: 420, margin: "0.7rem auto 0" }}>
            Save more with our curated studio plans and subscription bundles.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}>
          {offers.map((offer, i) => {
            const hov = hoveredId === offer.id;
            return (
              <div
                key={offer.id}
                onMouseEnter={() => setHoveredId(offer.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: "rgba(255,255,255,0.82)",
                  backdropFilter: "blur(14px)",
                  borderRadius: 22,
                  padding: "1.75rem",
                  border: `1.5px solid ${hov ? "#F6B1D5" : "rgba(210,196,252,0.5)"}`,
                  boxShadow: hov ? "0 18px 54px rgba(124,79,224,0.16)" : "0 6px 24px rgba(180,100,200,0.08)",
                  transform: hov ? "translateY(-4px)" : "none",
                  transition: "all 0.28s cubic-bezier(.4,0,.2,1)",
                  position: "relative", overflow: "hidden",
                  animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
                }}
              >
                {/* Discount ribbon */}
                <div style={{
                  position: "absolute", top: 18, right: 18,
                  background: "linear-gradient(135deg, #FF0F9B, #C4009A)",
                  borderRadius: 50, padding: "0.24rem 0.75rem",
                  fontSize: "0.72rem", color: "#fff", fontWeight: 500,
                  letterSpacing: "0.04em",
                }}>
                  {offer.discount}% OFF
                </div>

                {/* Label */}
                {offer.label && (
                  <span className="tag tag-purple" style={{ marginBottom: "0.75rem" }}>
                    {offer.label}
                  </span>
                )}

                <div style={{ fontSize: "1.6rem", marginBottom: "0.75rem" }}>{offer.icon}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem", marginBottom: "0.2rem", color: "#1A1A1A" }}>
                  {offer.title}
                </h3>
                <p style={{ fontSize: "0.76rem", fontStyle: "italic", color: "#C4009A", marginBottom: "0.6rem" }}>
                  {offer.tagline}
                </p>
                <p className="body-sm" style={{ marginBottom: "1.1rem", lineHeight: 1.65 }}>{offer.description}</p>

                {/* Promo code chip */}
                <div
                  onClick={() => copyPromo(offer.promo)}
                  style={{
                    background: "#FDF6FA", borderRadius: 9, padding: "0.5rem 0.85rem",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: "1.2rem", cursor: "pointer", border: "1px solid #F6B1D5",
                    transition: "background 0.18s",
                    userSelect: "none",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#F6B1D5"}
                  onMouseLeave={e => e.currentTarget.style.background = "#FDF6FA"}
                >
                  <span style={{ fontSize: "0.68rem", color: "#C4009A", letterSpacing: "0.07em" }}>PROMO CODE</span>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", color: "#FF0F9B", fontWeight: 600, letterSpacing: "0.08em", fontSize: "0.95rem" }}>
                    {copied === offer.promo ? "✓ Copied!" : offer.promo}
                  </span>
                </div>

                {/* Price tag if flat rate */}
                {offer.price && (
                  <div style={{ marginBottom: "1rem", display: "flex", alignItems: "baseline", gap: "0.4rem" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.7rem", color: "#FF0F9B" }}>MAD {offer.price}</span>
                    <span style={{ fontSize: "0.72rem", color: "#1A1A1A" }}>/ month</span>
                  </div>
                )}

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn btn-outline btn-md" style={{ flex: 1, padding: "0.4rem" }} onClick={() => setShowDetailsId(offer.id)}>
                    Special Details
                  </button>
                  <button className="btn btn-primary btn-md" style={{ flex: 1, padding: "0.4rem" }} onClick={onBook}>
                    Claim Offer →
                  </button>
                </div>

                <p style={{ fontSize: "0.65rem", color: "#1A1A1A", textAlign: "center", marginTop: "0.6rem" }}>
                  Valid until {offer.expires}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Details Modal */}
      {showDetailsId && (
        <div
          className="modal-overlay animate-fadeIn"
          onClick={e => e.target === e.currentTarget && setShowDetailsId(null)}
          style={{ zIndex: 1000 }}
        >
          <div className="modal-panel animate-scaleIn" style={{ padding: "2rem", maxWidth: "500px", margin: "auto" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", marginBottom: "1rem", color: "#1A1A1A" }}>
              Special Client Offer Details
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#1A1A1A", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              As a valued special client, this offer includes priority booking, dedicated support, and additional complimentary setup time. Present your special client ID upon arrival to unlock these exclusive benefits.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-primary btn-md" onClick={() => setShowDetailsId(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}