/**
 * AboutCompany
 * ─ Brand story, image collage, stats, and activity feed.
 */
export default function AboutCompany() {
  const stats = [
    { value: "5+",   label: "Studios"       },
    { value: "200+", label: "Clients"        },
    { value: "3K+",  label: "Sessions"       },
    { value: "4.9★", label: "Rating"        },
  ];

  const activities = [
    { icon: "🎬", title: "Full Access booked",   sub: "2-day commercial shoot for local brand" },
    { icon: "🎙️", title: "Podcast recorded",     sub: "TechTalks Morocco — Episode 14"         },
    { icon: "📸", title: "White Screen session",  sub: "Fashion editorial, 8-hour booking"       },
    { icon: "🌸", title: "Girly Space reserved",  sub: "Beauty influencer content marathon"      },
    { icon: "🎥", title: "Content day wrapped",   sub: "5 YouTube videos in one session"         },
  ];

  const images = [
    {
      src: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&q=75",
      style: { position: "absolute", top: 0, left: 0, width: "68%", height: 300, objectFit: "cover", borderRadius: 20, boxShadow: "0 18px 48px rgba(160,90,220,0.18)" },
    },
    {
      src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=75",
      style: { position: "absolute", bottom: 0, right: 0, width: "52%", height: 210, objectFit: "cover", borderRadius: 20, border: "4px solid #fff", boxShadow: "0 12px 36px rgba(200,120,200,0.18)" },
    },
    {
      src: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400&q=70",
      style: { position: "absolute", top: "28%", left: "58%", width: "30%", height: 140, objectFit: "cover", borderRadius: 14, border: "3px solid #fff", boxShadow: "0 8px 22px rgba(180,100,200,0.15)" },
    },
  ];

  return (
    <section id="about" style={{ padding: "5.5rem 0", background: "#FDF6FA" }}>
      <div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "center",
        }}>
          {/* ── Collage ── */}
          <div style={{ position: "relative", height: 460 }}>
            {images.map((img, i) => (
              <img key={i} src={img.src} alt={`Studio ${i + 1}`} style={img.style} />
            ))}

            {/* Floating badge */}
            <div style={{
              position: "absolute", bottom: 52, left: 0,
              background: "#fff", borderRadius: 14,
              padding: "0.75rem 1.15rem",
              boxShadow: "0 8px 28px rgba(160,90,220,0.16)",
              display: "flex", alignItems: "center", gap: "0.6rem",
              zIndex: 2,
              animation: "float 4s ease-in-out infinite",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #FF0F9B, #C4009A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", color: "#fff",
              }}>✦</div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.95rem", color: "#1A1A1A", lineHeight: 1.2 }}>Since 2026</div>
                <div style={{ fontSize: "0.65rem", color: "#1A1A1A" }}>Tangier, Morocco</div>
              </div>
            </div>
          </div>

          {/* ── Text side ── */}
          <div>
            <p className="eyebrow">About TechStudio</p>
            <h2 className="heading-lg" style={{ marginBottom: "1.2rem", color: "#1A1A1A" }}>
              Where <em style={{ fontStyle: "italic", color: "#FF0F9B" }}>Vision</em><br />
              Becomes Reality
            </h2>
            <p className="body-md" style={{ marginBottom: "1.3rem" }}>
              Founded in Tangier in 2026, TechStudio is a sanctuary for creative professionals. We believe every vision deserves a perfect space — which is why we built five uniquely designed studios for every style of storytelling.
            </p>
            <p className="body-md" style={{ marginBottom: "2rem" }}>
              From intimate podcast sessions to large-scale commercial shoots, our team is dedicated to making every booking seamless, inspiring, and unforgettable.
            </p>

            {/* Stats */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(4,1fr)",
              gap: "0.75rem", marginBottom: "2rem",
            }}>
              {stats.map(({ value, label }) => (
                <div key={label} style={{
                  textAlign: "center",
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 12, padding: "0.9rem 0.5rem",
                  border: "1px solid #FDF6FA",
                  boxShadow: "0 2px 10px rgba(180,100,200,0.06)",
                }}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", color: "#FF0F9B" }}>{value}</div>
                  <div style={{ fontSize: "0.6rem", color: "#1A1A1A", letterSpacing: "0.07em", textTransform: "uppercase", marginTop: "0.15rem" }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Activity feed */}
            <p className="eyebrow" style={{ marginBottom: "0.65rem" }}>Recent Activity</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {activities.map((a, i) => (
                <div key={i} style={{
                  display: "flex", gap: "0.7rem", alignItems: "center",
                  padding: "0.58rem 0.85rem",
                  background: "rgba(255,255,255,0.78)",
                  borderRadius: 10,
                  border: "1px solid #FDF6FA",
                  transition: "background 0.18s",
                  animation: `fadeUp 0.5s ease ${i * 0.07}s both`,
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FDF6FA"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.78)"}
                >
                  <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontSize: "0.8rem", color: "#1A1A1A", fontWeight: 400 }}>{a.title}</div>
                    <div style={{ fontSize: "0.7rem", color: "#1A1A1A" }}>{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Responsive: stack on mobile */}
      <style>{`
        @media (max-width: 900px) {
          #about .container > div {
            grid-template-columns: 1fr !important;
          }
          #about .container > div > div:first-child {
            height: 280px !important;
          }
        }
      `}</style>
    </section>
  );
}