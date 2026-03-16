import { useState, useCallback, useEffect } from "react";
import { createReservation, getStudios } from "../api/studioApi";

/**
 * ReservationForm
 * ─ Multi-step booking wizard rendered in a modal.
 * Steps: 1 Service → 2 Studio → 3 Schedule → 4 Basic Info → 5 Confirmation
 */

const TIME_SLOTS = [
  { id: "morning",   label: "Morning",   time: "8:00 AM – 12:00 PM", icon: "🌅", emoji: "Morning light" },
  { id: "afternoon", label: "Afternoon", time: "13:00 PM – 18:00 PM",  icon: "☀️", emoji: "Golden hours" },
  { id: "evening",   label: "Evening",   time: "19:00 PM – 00:00 PM",  icon: "🌙", emoji: "Night vibes" },
];

const SUB_SLOTS = {
  morning: ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
  afternoon: ["13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00"],
  evening: ["19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00", "23:00 - 00:00"],
};

const SERVICES = [
  { id: "studio", label: "Studio Only", icon: "🏢" },
  { id: "equipment", label: "Studio + Equipment", icon: "🎥" },
  { id: "team", label: "Studio + Equipment + Team", icon: "👥" },
];

const EQUIPMENT_LIST = ["Camera", "Lighting", "Microphone", "Tripod", "Green Screen"];
const TEAM_LIST = ["Photographer", "Videographer", "Lighting Technician", "Sound Engineer", "Editor"];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const WDAYS  = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function pad(n) { return String(n).padStart(2, "0"); }
function fmt(y, m, d) { return `${y}-${pad(m+1)}-${pad(d)}`; }

const STEP_LABELS = ["Service", "Studio", "Schedule", "Your Info", "Confirmed"];

// ── Sub-components ─────────────────────────────────────────────

function StepPill({ step, current }) {
  const done = current > step;
  const active = current === step;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.85rem", fontWeight: 600, transition: "all var(--t-base)",
        background: done ? "var(--grad-cta)"
          : active ? "var(--pink-100)"
          : "var(--gray-100)",
        color: done ? "var(--white)" : active ? "var(--pink-500)" : "var(--gray-500)",
        border: active ? "2px solid var(--pink-500)" : "2px solid transparent",
        boxShadow: active ? "0 0 0 4px rgba(255,15,155,0.1)" : "none",
      }}>
        {done ? "✓" : step}
      </div>
      <span style={{
        fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase",
        color: active ? "var(--pink-500)" : done ? "var(--gray-900)" : "var(--gray-400)",
        fontWeight: active || done ? 600 : 500,
      }}>
        {STEP_LABELS[step - 1]}
      </span>
    </div>
  );
}

// Step 1 – Service Type
function Step1({ data, onChange }) {
  const handleServiceClick = (id) => {
    onChange("serviceType", id);
    if (id === "studio") {
      onChange("equipment", []);
      onChange("team", []);
    } else if (id === "equipment") {
      onChange("team", []);
    }
  };

  const toggleItem = (listKey, item) => {
    const current = data[listKey] || [];
    if (current.includes(item)) {
      onChange(listKey, current.filter(i => i !== item));
    } else {
      onChange(listKey, [...current, item]);
    }
  };

  return (
    <div className="animate-fadeUp">
      <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>Select Service Type</h2>
      <p className="body-sm" style={{ marginBottom: "2rem" }}>How can we assist your production today?</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
        {SERVICES.map(s => {
          const sel = data.serviceType === s.id;
          return (
            <div key={s.id} onClick={() => handleServiceClick(s.id)}
              style={{
                borderRadius: "var(--r-md)", padding: "1.5rem 1rem", textAlign: "center", cursor: "pointer",
                border: `1.5px solid ${sel ? "var(--pink-400)" : "var(--gray-200)"}`,
                background: sel ? "var(--pink-50)" : "var(--white)",
                boxShadow: sel ? "var(--shadow-sm)" : "none",
                transition: "all var(--t-fast)",
              }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{s.icon}</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600, color: sel ? "var(--pink-500)" : "var(--gray-700)" }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {(data.serviceType === "equipment" || data.serviceType === "team") && (
        <div className="animate-fadeIn" style={{ marginBottom: "2rem" }}>
          <h4 className="eyebrow">Select Equipment</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {EQUIPMENT_LIST.map(eq => {
              const isSel = (data.equipment || []).includes(eq);
              return (
                <div key={eq} onClick={() => toggleItem("equipment", eq)}
                  style={{
                    borderRadius: "var(--r-sm)", padding: "0.5rem 1rem", cursor: "pointer",
                    border: `1.5px solid ${isSel ? "var(--pink-400)" : "var(--gray-200)"}`,
                    background: isSel ? "var(--grad-cta)" : "var(--white)",
                    color: isSel ? "var(--white)" : "var(--gray-700)",
                    fontSize: "0.85rem", fontWeight: 500,
                    transition: "all var(--t-fast)",
                    boxShadow: isSel ? "var(--shadow-xs)" : "none"
                  }}
                >
                  {eq}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data.serviceType === "team" && (
        <div className="animate-fadeIn">
          <h4 className="eyebrow">Select Team</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {TEAM_LIST.map(tm => {
              const isSel = (data.team || []).includes(tm);
              return (
                <div key={tm} onClick={() => toggleItem("team", tm)}
                  style={{
                    borderRadius: "var(--r-sm)", padding: "0.5rem 1rem", cursor: "pointer",
                    border: `1.5px solid ${isSel ? "var(--pink-400)" : "var(--gray-200)"}`,
                    background: isSel ? "var(--grad-cta)" : "var(--white)",
                    color: isSel ? "var(--white)" : "var(--gray-700)",
                    fontSize: "0.85rem", fontWeight: 500,
                    transition: "all var(--t-fast)",
                    boxShadow: isSel ? "var(--shadow-xs)" : "none"
                  }}
                >
                  {tm}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Step 2 – Studio
function Step2({ data, onChange, studios }) {
  const handleStudioClick = (s) => {
    const selectedStudios = data.studios || [];
    if (selectedStudios.find(sel => sel.id === s.id)) {
      onChange("studios", selectedStudios.filter(sel => sel.id !== s.id));
    } else {
      onChange("studios", [...selectedStudios, s]);
    }
  };

  const totalPrice = (data.studios || []).reduce((sum, s) => sum + Number(s.price_per_hour || 0), 0);

  return (
    <div className="animate-fadeUp">
      <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>Choose Your Studios</h2>
      <p className="body-sm" style={{ marginBottom: "2rem" }}>Select the spaces that fit your vision.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "1rem", marginBottom: "2rem" }}>
        {studios.map(s => {
          const sel = (data.studios || []).some(sel => sel.id === s.id);
          return (
            <div key={s.id} onClick={() => handleStudioClick(s)}
              style={{
                borderRadius: "var(--r-md)", overflow: "hidden", cursor: "pointer",
                border: `2px solid ${sel ? "var(--pink-400)" : "var(--pink-50)"}`,
                boxShadow: sel ? "var(--shadow-md)" : "var(--shadow-xs)",
                transform: sel ? "scale(1.02)" : "scale(1)",
                transition: "all var(--t-base)",
              }}>
              <div style={{ position: "relative", height: 120 }}>
                <img src={s.image} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {sel && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(255,15,155,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ background: "var(--pink-500)", color: "#fff", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", boxShadow: "var(--shadow-sm)" }}>
                      ✓
                    </div>
                  </div>
                )}
              </div>
              <div style={{ padding: "0.85rem", background: sel ? "var(--pink-50)" : "var(--white)" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.25rem", color: "var(--gray-900)" }}>{s.name}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", color: "var(--gray-700)" }}>MAD {s.price_per_hour}<span style={{ fontSize: "0.75rem", color: "var(--gray-500)" }}>/hr</span></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hours */}
      {data.studios && data.studios.length > 0 && (
        <div style={{
          background: "var(--pink-50)",
          borderRadius: "var(--r-sm)", padding: "1.25rem 1.5rem", border: "1px solid var(--pink-200)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--gray-900)" }}>Studios Selected</div>
            <div style={{ fontSize: "0.8rem", color: "var(--gray-500)", marginTop: "0.25rem" }}>
              Total Base Rate
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--pink-500)", fontFamily: "'Cormorant Garamond',serif" }}>
              MAD {totalPrice} <span style={{ fontSize: "0.85rem", color: "var(--gray-500)", fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>/ hr</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Step 3 – Schedule
function Step3({ data, onChange }) {
  const today  = new Date();
  const [vY, setVY] = useState(today.getFullYear());
  const [vM, setVM] = useState(today.getMonth());
  const first = new Date(vY, vM, 1).getDay();
  const dim   = new Date(vY, vM + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= dim; d++) cells.push(d);
  const todayStr = fmt(today.getFullYear(), today.getMonth(), today.getDate());

  const [activeSession, setActiveSession] = useState(null);

  const handleDateClick = (ds) => {
    const dates = data.dates || [];
    if (dates.includes(ds)) {
      onChange("dates", dates.filter(d => d !== ds));
    } else {
      onChange("dates", [...dates, ds]);
    }
  };

  const handleSessionClick = (id) => {
    setActiveSession(prev => prev === id ? null : id);
  };

  const handleSpecificSlotClick = (slot) => {
    const slots = data.timeSlots || [];
    if (slots.includes(slot)) {
      onChange("timeSlots", slots.filter(s => s !== slot));
    } else {
      onChange("timeSlots", [...slots, slot]);
    }
  };

  const isSlotBookedForDate = (slot, sessionId, dateStr) => {
    const { studios = [] } = data;
    if (studios.length === 0) return false;
    for (const s of studios) {
      const hash = s.id + new Date(dateStr).getDate() + sessionId.length;
      if (hash % 4 === 0) return true;
      if (hash % 3 === 0) {
          const allSlots = SUB_SLOTS[sessionId];
          if (slot === allSlots[0] || slot === allSlots[allSlots.length - 1]) return true;
      }
      if (hash % 5 === 0) {
          const allSlots = SUB_SLOTS[sessionId];
          if (slot === allSlots[1]) return true;
      }
    }
    return false;
  };

  const isSlotBooked = (slot, sessionId) => {
    const { dates = [] } = data;
    if (dates.length === 0) return false;
    return dates.some(d => isSlotBookedForDate(slot, sessionId, d));
  };

  return (
    <div className="animate-fadeUp">
      <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>Pick Dates & Times</h2>
      <p className="body-sm" style={{ marginBottom: "2rem" }}>Choose your preferred session dates.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
        {/* Calendar */}
        <div className="calendar-card" style={{ maxWidth: 320, margin: "0 auto", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid var(--pink-50)", background: "var(--white)" }}>
            <button className="btn btn-outline" style={{ width: 32, height: 32, padding: 0 }} onClick={() => vM === 0 ? (setVM(11), setVY(y => y - 1)) : setVM(m => m - 1)}>
              ‹
            </button>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.1rem", fontWeight: 600, color: "var(--gray-900)" }}>{MONTHS[vM]} {vY}</span>
            <button className="btn btn-outline" style={{ width: 32, height: 32, padding: 0 }} onClick={() => vM === 11 ? (setVM(0), setVY(y => y + 1)) : setVM(m => m + 1)}>
              ›
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0.5rem 1rem", borderBottom: "1px solid var(--pink-50)" }}>
            {WDAYS.map(d => <div key={d} className="eyebrow" style={{ textAlign: "center", margin: 0, color: "var(--gray-500)" }}>{d}</div>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "1rem", gap: "4px" }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`e${i}`} />;
              const ds = fmt(vY, vM, day);
              const isPast = ds < todayStr, isSel = (data.dates || []).includes(ds);
              
              let allBooked = false;
              let hasData = false;
              if (!isPast && data.studios && data.studios.length > 0) {
                  hasData = true;
                  let total = 0;
                  let booked = 0;
                  for (const session of TIME_SLOTS) {
                      for (const slot of SUB_SLOTS[session.id]) {
                          total++;
                          if (isSlotBookedForDate(slot, session.id, ds)) booked++;
                      }
                  }
                  allBooked = (booked === total);
              }

              let classes = "calendar-day";
              if (isPast) classes += " past";
              if (isSel) classes += " selected";

              return (
                <div key={day} className={classes} onClick={() => !isPast && handleDateClick(ds)}>
                  {day}
                  {hasData && !isSel && (
                    <span className={`dot ${allBooked ? "dot-reserved" : "dot-available"}`} style={{ position: "absolute", bottom: "10%" }} />
                  )}
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div style={{ padding: "0.85rem", display: "flex", gap: "1rem", justifyContent: "center", borderTop: "1px solid var(--pink-50)", background: "var(--pink-50)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
               <span className="dot dot-available" />
               <span style={{ fontSize: "0.75rem", color: "var(--gray-700)", fontWeight: 500 }}>Available</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
               <span className="dot dot-reserved" />
               <span style={{ fontSize: "0.75rem", color: "var(--gray-700)", fontWeight: 500 }}>Reserved</span>
            </div>
          </div>
        </div>

        {/* Time slots */}
        <div>
          <h4 className="eyebrow" style={{ marginBottom: "1rem" }}>Time Slots</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem", marginBottom: activeSession ? "1.5rem" : 0 }}>
            {TIME_SLOTS.map(ts => {
              const sel = activeSession === ts.id;
              const hasSelectedSubSlots = (data.timeSlots || []).some(slot => SUB_SLOTS[ts.id]?.includes(slot));
              return (
                <div key={ts.id} onClick={() => handleSessionClick(ts.id)}
                  style={{
                    position: "relative",
                    borderRadius: "var(--r-md)", padding: "1rem 0.5rem", textAlign: "center", cursor: "pointer",
                    border: `1.5px solid ${sel || hasSelectedSubSlots ? "var(--pink-400)" : "var(--gray-200)"}`,
                    background: sel || hasSelectedSubSlots ? "var(--pink-50)" : "var(--white)",
                    transition: "all var(--t-fast)",
                    boxShadow: sel ? "var(--shadow-xs)" : "none"
                  }}>
                  <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>{ts.icon}</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: sel || hasSelectedSubSlots ? "var(--pink-500)" : "var(--gray-900)" }}>{ts.label}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--gray-500)", marginTop: "0.2rem" }}>{ts.time}</div>
                  {hasSelectedSubSlots && (
                     <div style={{ position: "absolute", top: -8, right: -8, background: "var(--pink-500)", color: "#fff", borderRadius: "50%", width: 22, height: 22, fontSize: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", boxShadow: "var(--shadow-sm)" }}>
                        ✓
                     </div>
                  )}
                </div>
              );
            })}
          </div>

          {activeSession && SUB_SLOTS[activeSession] && (() => {
            const allSlots = SUB_SLOTS[activeSession];
            const slotsStatus = allSlots.map(slot => ({
              slot,
              booked: isSlotBooked(slot, activeSession)
            }));
            
            const allBooked = slotsStatus.length > 0 && slotsStatus.every(s => s.booked);

            return (
              <div className="animate-fadeIn">
                 <h4 className="eyebrow" style={{ marginBottom: "1rem" }}>Select Specific Times</h4>
                 {allBooked ? (
                    <div style={{ padding: "1.5rem", background: "var(--reserved-bg)", border: "1px solid var(--reserved-border)", borderRadius: "var(--r-sm)", color: "var(--reserved)", fontSize: "0.9rem", textAlign: "center", fontWeight: 500 }}>
                      No available slots for the selected studios on these dates. Please choose another date or studio.
                    </div>
                 ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "0.75rem" }}>
                      {slotsStatus.map(({ slot, booked }) => {
                         const isSlotSel = (data.timeSlots || []).includes(slot);
                         return (
                            <div key={slot} onClick={() => !booked && handleSpecificSlotClick(slot)}
                              style={{
                                borderRadius: "var(--r-sm)", padding: "0.75rem", textAlign: "center", 
                                cursor: booked ? "not-allowed" : "pointer",
                                border: `1.5px solid ${booked ? "var(--gray-200)" : isSlotSel ? "var(--pink-400)" : "var(--gray-200)"}`,
                                background: booked ? "var(--gray-50)" : isSlotSel ? "var(--grad-cta)" : "var(--white)",
                                color: booked ? "var(--gray-400)" : isSlotSel ? "var(--white)" : "var(--gray-900)",
                                fontSize: "0.85rem", fontWeight: 600,
                                transition: "all var(--t-fast)",
                                display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem",
                                boxShadow: isSlotSel ? "var(--shadow-xs)" : "none"
                              }}
                            >
                               {slot}
                               {booked && <span style={{ fontSize: "0.65rem", color: "var(--reserved)", background: "var(--reserved-bg)", padding: "0.15rem 0.5rem", borderRadius: 50, border: "1px solid var(--reserved-border)", fontWeight: 500 }}>Reserved</span>}
                            </div>
                         )
                      })}
                    </div>
                 )}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// Step 4 – Basic Info
function Step4({ data, onChange, errors }) {
  const fields = [
    ["name",  "Full Name",      "text",  "Amina El Fassi"],
    ["email", "Email Address",  "email", "amina@example.com"],
    ["phone", "Phone Number",   "tel",   "+212 6XX-XXXXXX"],
  ];
  return (
    <div className="animate-fadeUp">
      <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>Your Information</h2>
      <p className="body-sm" style={{ marginBottom: "2rem" }}>We'll use this to confirm your booking.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {fields.map(([key, label, type, ph]) => (
          <div key={key} className="field">
            <label className="field-label">{label}</label>
            <input
              className={`field-input${errors[key] ? " has-error" : ""}`}
              type={type} placeholder={ph} value={data[key]}
              onChange={e => onChange(key, e.target.value)}
            />
            {errors[key] && <span className="field-error">{errors[key]}</span>}
          </div>
        ))}
      </div>

      <div style={{
        background: "var(--pink-50)", borderRadius: "var(--r-md)", padding: "1rem 1.25rem",
        marginTop: "2rem", border: "1px solid var(--pink-200)",
        display: "flex", gap: "0.75rem", alignItems: "flex-start",
      }}>
        <span style={{ fontSize: "1.1rem" }}>🔒</span>
        <p style={{ fontSize: "0.8rem", color: "var(--gray-700)", lineHeight: 1.6, margin: 0 }}>
          Your info is securely handled. We never share your personal data with third parties.
        </p>
      </div>
    </div>
  );
}

// Step 5 – Confirmation
function Step5({ data, total, reservationId, onClose }) {
  const tsLabel = (data.timeSlots || []).map(id => TIME_SLOTS.find(t => t.id === id)?.label || id).join(", ") || (data.timeSlots || []).join(", ");
  const date = data.dates && data.dates.length > 0 
    ? data.dates.map(d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })).join(", ") 
    : "—";
  const studioNames = data.studios && data.studios.length > 0 ? data.studios.map(s => s.name).join(", ") : "—";
  const serviceTypeLabel = SERVICES.find(s => s.id === data.serviceType)?.label || "Studio Only";
  
  const rows = [
    ["Reservation ID", reservationId || "—"],
    ["Service",        serviceTypeLabel],
    ["Studios",        studioNames],
  ];

  if (data.equipment && data.equipment.length > 0) rows.push(["Equipment", data.equipment.join(", ")]);
  if (data.team && data.team.length > 0) rows.push(["Team", data.team.join(", ")]);

  rows.push(
    ["Dates",          date],
    ["Time Slots",     tsLabel],
    ["Guest",          data.name],
    ["Email",          data.email],
    ["Phone",          data.phone],
  );

  return (
    <div className="animate-fadeUp" style={{ textAlign: "center" }}>
      {/* Success badge */}
      <div style={{
        margin: "0 auto 1.5rem",
        width: 80, height: 80, borderRadius: "50%",
        background: "var(--grad-cta)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "2.5rem", color: "#fff",
        boxShadow: "var(--shadow-md)",
        animation: "float 3s ease-in-out infinite",
      }}>✓</div>

      <h2 className="heading-lg" style={{ marginBottom: "0.5rem" }}>You're All Set!</h2>
      <p className="body-md" style={{ marginBottom: "2rem", maxWidth: 400, margin: "0 auto 2rem" }}>
        Booking confirmed! A confirmation has been sent to <strong style={{ color: "var(--pink-500)" }}>{data.email}</strong>.
      </p>

      {/* Summary card */}
      <div style={{ background: "var(--white)", borderRadius: "var(--r-md)", border: "1.5px solid var(--pink-100)", marginBottom: "2rem", textAlign: "left", overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ padding: "1rem 1.5rem", background: "var(--pink-50)", borderBottom: "1px solid var(--pink-100)" }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", color: "var(--gray-900)", fontWeight: 600 }}>Booking Summary</span>
        </div>
        <div style={{ padding: "0.5rem 0" }}>
          {rows.map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1.5rem", borderBottom: "1px solid var(--pink-50)" }}>
              <span style={{ fontSize: "0.85rem", color: "var(--gray-500)", fontWeight: 500 }}>{label}</span>
              <span style={{ fontSize: "0.85rem", color: "var(--gray-900)", fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{value}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 1.5rem", background: "var(--pink-50)" }}>
             <span style={{ fontSize: "1rem", color: "var(--gray-900)", fontWeight: 600 }}>Total</span>
             <span style={{ fontSize: "1.2rem", color: "var(--pink-500)", fontFamily: "'Cormorant Garamond',serif", fontWeight: 600 }}>MAD {total}</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button className="btn btn-outline btn-lg" onClick={onClose}>Done</button>
        <button className="btn btn-soft btn-lg" onClick={() => window.print?.()}>🖨 Print</button>
      </div>
      <p style={{ fontSize: "0.8rem", color: "var(--gray-400)", marginTop: "2rem", fontWeight: 500 }}>✦ Thank you for choosing TechStudio ✦</p>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────

const INIT = { serviceType: "studio", equipment: [], team: [], studios: [], dates: [], timeSlots: [], name: "", email: "", phone: "" };

export default function ReservationForm({ preselectedStudio, preselectedDate, onClose }) {
  const [step, setStep]   = useState(1);
  const [data, setData]   = useState({
    ...INIT,
    studios: preselectedStudio ? [preselectedStudio] : [],
    dates:  preselectedDate ? [preselectedDate] : [],
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [resId,   setResId]   = useState(null);
  const [studiosList, setStudiosList] = useState([]);

  useEffect(() => {
    getStudios().then(res => setStudiosList(res?.data || res || [])).catch(() => setStudiosList([]));
  }, []);

  const update = useCallback((key, val) => {
    setData(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: "" }));
  }, []);

  const total = (data.studios || []).reduce((sum, s) => sum + Number(s.price_per_hour || 0), 0);

  const validate = () => {
    const e = {};
    if (step === 1) {
      if (!data.serviceType) e.serviceType = "Please select a service type.";
    } else if (step === 2) {
      if (!data.studios || data.studios.length === 0) e.studios = "Please select at least one studio.";
    } else if (step === 3) {
      if (!data.dates || data.dates.length === 0) e.dates = "Please select at least one date.";
      if (!data.timeSlots || data.timeSlots.length === 0) e.timeSlots = "Please choose at least one time slot.";
    } else if (step === 4) {
      if (!data.name.trim())  e.name  = "Full name is required.";
      if (!data.email.trim() || !/\S+@\S+\.\S+/.test(data.email)) e.email = "Valid email required.";
      if (!data.phone.trim() || data.phone.length < 8) e.phone = "Valid phone required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    if (step === 4) {
      // Submit
      setLoading(true);
      try {
        const res = await createReservation({
          service_type: data.serviceType, equipment: data.equipment, team: data.team,
          studio_ids: data.studios.map(s => s.id), dates: data.dates,
          time_slots: data.timeSlots,
          name: data.name, email: data.email, phone: data.phone,
        });
        setResId(res?.data?.id || res?.id || `TS-${Date.now()}`);
      } catch {
        setResId(`TS-${Date.now()}`); // demo fallback
      } finally {
        setLoading(false);
      }
    }
    setStep(s => s + 1);
  };

  const progress = ((step - 1) / 4) * 100;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && step < 5 && onClose()}>
      <div className="modal-panel" style={{ position: "relative", maxWidth: 760 }}>
        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.25rem 2rem", borderBottom: "1px solid var(--pink-100)",
        }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", color: "var(--gray-900)" }}>
            Tech<em style={{ fontStyle: "italic", color: "var(--pink-500)" }}>Studio</em>
            <span style={{ marginLeft: "0.75rem", fontSize: "0.8rem", color: "var(--gray-500)", fontFamily: "'DM Sans',sans-serif", fontStyle: "normal", letterSpacing: "0.05em", textTransform: "uppercase" }}>Reservation</span>
          </div>
          {step < 5 && (
            <button className="btn btn-outline" onClick={onClose} style={{ width: 36, height: 36, padding: 0, borderRadius: "50%" }}>
              ✕
            </button>
          )}
        </div>

        {/* ── Progress bar ── */}
        {step < 5 && (
          <div className="wizard-progress">
            <div className="wizard-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* ── Step indicators ── */}
        {step < 5 && (
          <div style={{ padding: "1.5rem 2rem 0", display: "flex", justifyContent: "space-between" }}>
            {[1, 2, 3, 4, 5].map(s => <StepPill key={s} step={s} current={step} />)}
          </div>
        )}

        {/* ── Content ── */}
        <div style={{ padding: "2rem" }}>
          {step === 1 && <Step1 data={data} onChange={update} />}
          {step === 2 && <Step2 data={data} onChange={update} studios={studiosList} />}
          {step === 3 && <Step3 data={data} onChange={update} />}
          {step === 4 && <Step4 data={data} onChange={update} errors={errors} />}
          {step === 5 && <Step5 data={data} total={total} reservationId={resId} onClose={onClose} />}

          {/* Errors */}
          {(errors.serviceType || errors.studios || errors.dates || errors.timeSlots) && (
            <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "var(--reserved-bg)", border: "1px solid var(--reserved-border)", borderRadius: "var(--r-sm)" }}>
              <p className="field-error" style={{ margin: 0, fontWeight: 500 }}>
                {errors.serviceType || errors.studios || errors.dates || errors.timeSlots}
              </p>
            </div>
          )}

          {/* Nav */}
          {step < 5 && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--gray-100)" }}>
              {step > 1
                ? <button className="btn btn-outline btn-lg" onClick={() => setStep(s => s - 1)}>← Back</button>
                : <div />
              }
              <button className="btn btn-primary btn-lg"
                onClick={handleNext}
                disabled={loading}
                style={{ minWidth: 160 }}
              >
                {loading
                  ? <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><span className="spinner" />Saving…</span>
                  : step === 4
                  ? "Confirm Booking ✦"
                  : "Continue →"
                }
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
