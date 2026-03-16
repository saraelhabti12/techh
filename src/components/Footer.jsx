/**
 * Footer
 * ─ Small, clean footer with brand, links and contact info.
 */
export default function Footer() {
  const cols = [
    {
      title: "Studios",
      links: ["Full Access Studio", "White Screen Studio", "Girly Space", "Podcast Space", "Content Space"],
    },
     
    {
      title: "Contact",
      links: ["📍 Tangier, Morocco", "📞 +212 6XX-XXXXXX", "✉ techstudio@gmail.com", "🕐 Daily 8am – 24pm"],
    },
  ];

  
  return (
    <footer id="contact" style={{
      background: "linear-gradient(180deg, #FDF6FA 0%, #fff 100%)",
      borderTop: "1px solid #FDF6FA",
    }}>
      {/* Main footer grid */}
      <div style={{ padding: "3rem 1.5rem 2rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "2.5rem",
          marginBottom: "2.5rem",
        }}>
          {/* Brand col */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.42rem", marginBottom: "0.65rem" }}>
              <span style={{
                width: 24, height: 24, borderRadius: "50%",
                background: "linear-gradient(135deg, #FF0F9B, #C4009A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.65rem", color: "#fff",
              }}>✦</span>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.15rem", color: "#1A1A1A" }}>
                Tech<em style={{ fontStyle: "italic", color: "#FF0F9B" }}>Studio</em>
              </span>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#1A1A1A", lineHeight: 1.8, maxWidth: 230 }}>
              Tangier's premier creative studio space for photographers, videographers, podcasters & content creators.
            </p>
            {/* Socials */}
            <div style={{ display: "flex", gap: "0.55rem", marginTop: "1rem" }}>
              {["instagram", "tiktok", "youtube", "twitter"].map(s => (
                <div key={s} style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: "#FDF6FA", border: "1px solid #F6B1D5",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", color: "#C4009A", cursor: "pointer",
                  transition: "all 0.18s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#F6B1D5"; e.currentTarget.style.color = "#FF0F9B"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#FDF6FA"; e.currentTarget.style.color = "#C4009A"; }}
                >
                  {{instagram:"📷",tiktok:"🎵",youtube:"▶",twitter:"✗"}[s]}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map(col => (
            <div key={col.title}>
              <p style={{
                fontSize: "0.63rem", letterSpacing: "0.18em", textTransform: "uppercase",
                color: "#1A1A1A", marginBottom: "0.8rem", fontWeight: 500,
              }}>{col.title}</p>
              <ul style={{ display: "flex", flexDirection: "column", gap: "0.48rem" }}>
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" style={{
                      fontSize: "0.8rem", color: "#1A1A1A", transition: "color 0.18s",
                    }}
                      onMouseEnter={e => e.currentTarget.style.color = "#FF0F9B"}
                      onMouseLeave={e => e.currentTarget.style.color = "#1A1A1A"}
                    >{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid #FDF6FA", paddingTop: "1.2rem",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "0.5rem",
        }}>
          <p style={{ fontSize: "0.71rem", color: "#1A1A1A" }}>
            © 2026 TechStudio. All rights reserved.
          </p>
          <p style={{ fontSize: "0.71rem", color: "#F6B1D5" }}>
            Built for creators ✦
          </p>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}