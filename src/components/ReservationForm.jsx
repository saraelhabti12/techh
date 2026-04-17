import { useState, useCallback, useEffect, useMemo } from "react";
import { createReservation, getStudios, getStudioAvailability, getCategories } from "../api/studioApi";
import Modal from "./Modal";
import Calendar from "./Calendar";
import BookingReceiptModal from "./BookingReceiptModal";
import { useTranslation } from "react-i18next";
import { FaCheck, FaArrowRight, FaArrowLeft, FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaPhone, FaBuilding, FaVideo, FaUsers, FaTrash, FaEdit, FaBox, FaWhatsapp } from 'react-icons/fa';

const SUB_SLOTS = {
  morning: ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
  afternoon: ["13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00"],
  evening: ["19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00", "23:00 - 23:59"],
};

const EQUIPMENT_LIST = ["Cameras", "Lighting", "Microphone", "Lens", "Stabilizers", "Drone", "Decoration"];
const TEAM_LIST = ["Photographer", "Videographer", "Lighting Technician", "Sound Engineer", "Editor"];

const OFFERS = {
  photos: [
    { id: 'photo_5', label: '5 photos', price: 100 },
    { id: 'photo_10', label: '10 photos', price: 170 },
  ],
  videos: [
    { id: 'video_30', label: '30 sec', price: 50 },
    { id: 'video_60', label: '60 sec', price: 100 },
    { id: 'video_90', label: '90 sec', price: 150 },
  ]
};

const PRICING = {
  hour: { equipment: 100 },
  period: {
    morning: { base: 300, lighting: 400, camera: 700 }, // Package prices
    afternoon: { base: 400, lighting: 500, camera: 800 },
    evening: { base: 400, lighting: 500, camera: 800 }
  },
  day: { base: 800, lighting: 1000, camera: 1500 }
};

function pad(n) { return String(n).padStart(2, "0"); }

// ── Sub-components ─────────────────────────────────────────────

function StepPill({ step, current, label }) {
  const done = current > step;
  const active = current === step;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", flex: 1 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.85rem", fontWeight: 700, transition: "all 0.3s",
        background: done ? "var(--grad-cta)"
          : active ? "var(--pink-50)"
          : "var(--gray-50)",
        color: done ? "var(--white)" : active ? "var(--pink-500)" : "var(--gray-400)",
        border: active ? "2px solid var(--pink-500)" : "2px solid transparent",
        boxShadow: active ? "0 0 0 4px rgba(255,15,155,0.1)" : "none",
        transform: active ? 'scale(1.1)' : 'scale(1)'
      }}>
        {done ? <FaCheck size={12} /> : step}
      </div>
      <span style={{
        fontSize: "0.6rem", letterSpacing: "0.02em", textTransform: "uppercase",
        color: active ? "var(--pink-500)" : done ? "var(--gray-900)" : "var(--gray-400)",
        fontWeight: 700,
      }}>
        {label}
      </span>
    </div>
  );
}

function Step1({ data, onChange, categories, t }) {
  const selectedCatObj = categories.find(c => c.id === data.category);
  const catName = (selectedCatObj?.name || "").toLowerCase();
  // More robust detection including "booking" and checking if name contains special space names
  const isSpecial = ["full access", "white space", "girly space", "booking"].some(s => catName.includes(s)) || data.category === 'booking';

  return (
    <div className="animate-step-enter">
      <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>{t("select_category")}</h2>
      <p className="body-sm" style={{ marginBottom: "2rem" }}>{t("select_category_first")}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "1.25rem" }}>
        {categories.map(cat => {
          const isSel = data.category === cat.id;
          return (
            <div key={cat.id} onClick={() => onChange("category", cat.id)}
              className={`booking-card ${isSel ? 'selected' : ''}`}
              style={{
                borderRadius: "20px", padding: "2rem 1rem", textAlign: "center", cursor: "pointer",
                border: `2px solid ${isSel ? "var(--pink-500)" : "var(--gray-100)"}`,
                background: isSel ? "var(--pink-50)" : "var(--white)",
                boxShadow: isSel ? "var(--shadow-md)" : "var(--shadow-xs)",
                transition: "all 0.2s ease-out",
                transform: isSel ? 'translateY(-4px)' : 'none'
              }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{cat.icon}</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: isSel ? "var(--pink-600)" : "var(--gray-900)" }}>
                {cat.name === 'Booking' ? t('Booking') : cat.name}
              </div>
            </div>
          );
        })}
      </div>

      {isSpecial && (
        <div className="animate-fadeIn" style={{ padding: '2rem', background: 'var(--gray-50)', borderRadius: '24px', border: '1px solid var(--gray-200)', marginTop: '2.5rem' }}>
          <h3 className="eyebrow" style={{ marginBottom: '1.5rem', color: 'var(--gray-700)' }}>{t("project_details")}</h3>
          <div className="field" style={{ marginBottom: '1.5rem' }}>
            <label className="field-label" style={{ fontWeight: 700, color: 'var(--gray-700)', display: 'block', marginBottom: '0.5rem' }}>{t("project_name")}</label>
            <input 
              className="field-input field-input-animated" 
              style={{ borderRadius: '12px', border: '1.5px solid var(--gray-200)', height: '52px', background: '#fff' }}
              value={data.project_name || ""} 
              onChange={e => onChange("project_name", e.target.value)} 
              placeholder={t("project_name_placeholder")} 
            />
          </div>
          <div className="field">
            <label className="field-label" style={{ fontWeight: 700, color: 'var(--gray-700)', display: 'block', marginBottom: '0.5rem' }}>{t("project_description")}</label>
            <textarea 
              className="field-input field-input-animated" 
              style={{ height: '120px', padding: '1rem', borderRadius: '12px', border: '1.5px solid var(--gray-200)', resize: 'none', background: '#fff' }}
              value={data.project_description || ""} 
              onChange={e => onChange("project_description", e.target.value)} 
              placeholder={t("project_description_placeholder")} 
            />
          </div>
        </div>
      )}
    </div>
  );
}

function Step2({ data, onChange, studios, loading, categories, t }) {
  const toggleStudio = (s) => {
    onChange("studios", [s]);
    onChange("slots", []);
  };

  return (
    <div className="animate-step-enter">
      <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>{t("select_studio")}</h2>
      <p className="body-sm" style={{ marginBottom: "1.5rem" }}>{t("select_studio_desc")}</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}><span className="spinner" /></div>
      ) : studios.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--gray-50)', borderRadius: '20px', border: '1.5px dashed var(--gray-200)' }}>
          <p style={{ color: 'var(--gray-500)', fontWeight: 500 }}>{t("no_studios_in_category")}</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1.5rem" }}>
          {studios.map(s => {
            const sel = (data.studios || []).some(item => (item?.id === s.id || item === s.id));
            const selectedCatObj = categories.find(c => c.id === data.category);
            const isBookingCategory = selectedCatObj?.name === 'Booking';
            return (
              <div key={s.id} onClick={() => toggleStudio(s)}
                className={`booking-card ${sel ? 'selected' : ''}`}
                style={{
                  borderRadius: "20px", overflow: "hidden", cursor: "pointer",
                  border: `2px solid ${sel ? "var(--pink-500)" : "var(--gray-100)"}`,
                  boxShadow: sel ? "var(--shadow-lg)" : "var(--shadow-sm)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: sel ? 'scale(1.02)' : 'scale(1)',
                  background: "var(--white)"
                }}>
                <div style={{ height: 140, position: 'relative' }}>
                  <img src={s.image} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {sel && (
                    <div style={{ 
                      position: 'absolute', top: '0.75rem', right: '0.75rem', 
                      background: 'var(--pink-500)', color: '#fff', 
                      width: 28, height: 28, borderRadius: '50%', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      border: '2px solid #fff', boxShadow: 'var(--shadow-sm)'
                    }}>
                      <FaCheck size={12} />
                    </div>
                  )}
                </div>
                <div style={{ padding: "1.25rem", background: sel ? "var(--pink-50)" : "var(--white)" }}>
                  <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem", color: sel ? "var(--pink-600)" : "var(--gray-900)" }}>{s.name}</div>
                  {isBookingCategory && (
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: 'var(--pink-500)' }}>{s.price_per_hour} <small style={{ fontSize: '0.7rem', opacity: 0.6 }}>DH/hr</small></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Step3Options({ data, onChange, t }) {
  return (
    <div className="animate-step-enter">
      <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>{t("options")}</h2>
      <p className="body-sm" style={{ marginBottom: "2rem" }}>Select your package and location preferences.</p>

      {/* 1. PACKAGE SELECTION */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 className="eyebrow" style={{ marginBottom: '1.25rem' }}>Package Selection</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Standard Package */}
          <div 
            onClick={() => onChange("package_type", "standard")}
            className={`booking-card ${data.package_type === 'standard' ? 'selected' : ''}`}
            style={{
              padding: '1.5rem', borderRadius: '20px', cursor: 'pointer',
              border: `2px solid ${data.package_type === 'standard' ? 'var(--pink-500)' : 'var(--gray-200)'}`,
              background: data.package_type === 'standard' ? 'var(--pink-50)' : 'var(--white)',
              transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden'
            }}
          >
            {data.package_type === 'standard' && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--pink-500)' }}>
                <FaCheck size={18} />
              </div>
            )}
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: data.package_type === 'standard' ? 'var(--pink-600)' : 'var(--gray-900)' }}>Standard Package</h4>
            <ul style={{ padding: 0, margin: '0 0 1.5rem 0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                <div style={{ color: 'var(--pink-500)', display: 'flex' }}><FaCheck size={10} /></div> 20 Photos
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
                <div style={{ color: 'var(--pink-500)', display: 'flex' }}><FaCheck size={10} /></div> 1 Reel
              </li>
            </ul>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--pink-500)' }}>400 DH</div>
          </div>

          {/* Personalized Package */}
          <div 
            onClick={() => onChange("package_type", "personalized")}
            className={`booking-card ${data.package_type === 'personalized' ? 'selected' : ''}`}
            style={{
              padding: '1.5rem', borderRadius: '20px', cursor: 'pointer',
              border: `2px solid ${data.package_type === 'personalized' ? 'var(--pink-500)' : 'var(--gray-200)'}`,
              background: data.package_type === 'personalized' ? 'var(--pink-50)' : 'var(--white)',
              transition: 'all 0.3s ease', position: 'relative'
            }}
          >
            {data.package_type === 'personalized' && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--pink-500)' }}>
                <FaCheck size={18} />
              </div>
            )}
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem', color: data.package_type === 'personalized' ? 'var(--pink-600)' : 'var(--gray-900)' }}>Personalized Package</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
              Want a custom theme or personalized shooting setup?
            </p>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--pink-500)', background: 'var(--white)', padding: '0.5rem 0.75rem', borderRadius: '8px', display: 'inline-block', border: '1px solid var(--pink-100)' }}>
              Contact us for pricing
            </div>
            <a href="https://wa.me/+212660606903" target="_blank" rel="noopener noreferrer" 
               style={{
                 display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                 marginTop: '1.5rem', padding: '0.85rem 1.25rem', borderRadius: '12px',
                 background: 'var(--grad-cta)', color: 'var(--white)', fontWeight: 700, fontSize: '0.9rem',
                 boxShadow: '0 4px 15px rgba(255, 15, 155, 0.2)', transition: 'all 0.3s ease', 
                 transform: 'translateY(0)', textDecoration: 'none'
               }}
               onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
               onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <FaWhatsapp size={20} /> Chat with us before booking
            </a>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.75rem', textAlign: 'center' }}>
              Need help choosing? Contact us instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Personalized Details */}
      {data.package_type === 'personalized' && (
        <div className="animate-fadeIn" style={{ marginBottom: '2.5rem', padding: '1.75rem', background: 'var(--gray-50)', borderRadius: '24px', border: '1.5px solid var(--gray-200)' }}>
           <div className="field" style={{ marginBottom: '1.5rem' }}>
              <label className="field-label">Theme inspiration / example (Upload Image)</label>
              <input type="file" accept="image/*" onChange={(e) => onChange("theme_image", e.target.files[0])} 
                className="field-input-animated"
                style={{ width: '100%', padding: '0.75rem', background: '#fff', borderRadius: '12px', border: '1px solid var(--gray-200)', fontSize: '0.9rem' }} />
              {data.theme_image && <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', color: 'var(--pink-500)', fontWeight: 600 }}>Selected: {data.theme_image.name}</div>}
           </div>
           <div className="field">
              <label className="field-label">Describe what you want (decoration / photos / videos / setup)</label>
              <textarea 
                className="field-input field-input-animated" 
                style={{ height: '110px', padding: '1rem', borderRadius: '12px', border: '1.5px solid var(--gray-200)', resize: 'none', background: '#fff', fontSize: '0.9rem' }}
                value={data.theme_description || ""} 
                onChange={e => onChange("theme_description", e.target.value)} 
                placeholder="Tell us about your dream setup..." 
              />
           </div>
        </div>
      )}

      {/* 2. LOCATION TYPE */}
      <div>
        <h3 className="eyebrow" style={{ marginBottom: '1.25rem' }}>Location Type</h3>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {['in', 'out'].map(loc => (
            <div key={loc} onClick={() => onChange("location_type", loc)}
              className={`booking-card ${data.location_type === loc ? 'selected' : ''}`}
              style={{
                flex: 1, padding: '1.25rem', borderRadius: '18px', border: `2px solid ${data.location_type === loc ? 'var(--pink-500)' : 'var(--gray-200)'}`,
                background: data.location_type === loc ? 'var(--pink-50)' : 'var(--white)', cursor: 'pointer', 
                display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s'
              }}>
              <div style={{ 
                width: 22, height: 22, borderRadius: '50%', border: `2px solid ${data.location_type === loc ? 'var(--pink-500)' : 'var(--gray-300)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--white)'
              }}>
                {data.location_type === loc && <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--pink-500)' }} />}
              </div>
              <span style={{ fontWeight: 700, color: data.location_type === loc ? 'var(--pink-600)' : 'var(--gray-700)' }}>
                {loc === 'in' ? 'In Studio' : 'Out Studio'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3({ data, onChange, t, isSimplified }) {
  const TIME_SLOTS_PERIODS = [
    { id: "morning",   label: t("morning"),   time: "08:00 - 12:00", icon: <FaCalendarAlt />, start: "08:00", end: "12:00" },
    { id: "afternoon", label: t("afternoon"), time: "13:00 - 18:00",  icon: <FaCalendarAlt />, start: "13:00", end: "18:00" },
    { id: "evening",   label: t("evening"),   time: "19:00 - 23:59",  icon: <FaCalendarAlt />, start: "19:00", end: "23:59" },
  ];

  const PERIOD_PACKAGES = [
    { id: 'base', label: 'Studio Only', equip: [] },
    { id: 'lighting', label: 'Studio + Lighting', equip: ['Lighting'] },
    { id: 'camera', label: 'Studio + Lighting + Camera', equip: ['Lighting', 'Cameras'] },
  ];

  const MODES = [
    { id: "hour", label: t("per_hour") },
    { id: "period", label: t("per_period") },
    { id: "day", label: t("per_day") },
  ];

  const [selectedDate, setSelectedDate] = useState(data.slots.length > 0 ? data.slots[0].date : (new Date().toISOString().split('T')[0]));
  const [period, setPeriod] = useState("morning");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate && data.studios.length > 0) {
      setLoading(true);
      const promises = data.studios.map(s => getStudioAvailability(s?.id || s, selectedDate));
      Promise.all(promises).then(results => {
        const allBooked = results.flatMap(r => r.data.booked_slots || []);
        setBookedSlots(allBooked);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [selectedDate, data.studios]);

  const addSlot = (timeRange) => {
    const [start, end] = timeRange.split(' - ');
    if (data.slots.some(s => s.date === selectedDate && s.start_time === start)) {
      onChange("slots", data.slots.filter(s => !(s.date === selectedDate && s.start_time === start)));
      return;
    }
    const newSlots = data.studios.map(s => ({
      studio_id: Number(s?.id || s),
      date: selectedDate,
      start_time: start, end_time: end,
      price_per_hour: s?.price_per_hour || 100
    }));
    onChange("slots", [...data.slots, ...newSlots]);
  };

  const selectPeriod = (periodId) => {
    const p = TIME_SLOTS_PERIODS.find(item => item.id === periodId);
    const isBooked = bookedSlots.some(b => (p.start < b.end_time && p.end > b.start_time));
    if (isBooked) return;

    const newSlots = data.studios.map(s => ({
      studio_id: Number(s?.id || s),
      date: selectedDate,
      start_time: p.start, end_time: p.end,
      period_id: periodId,
      period_label: p.label
    }));
    onChange("slots", newSlots);
  };

  const toggleDay = () => {
    if (data.slots.some(s => s.date === selectedDate)) {
      onChange("slots", data.slots.filter(s => s.date !== selectedDate));
      return;
    }
    const newSlots = data.studios.map(s => ({
      studio_id: Number(s?.id || s),
      date: selectedDate,
      start_time: "08:00", end_time: "23:59",
      is_full_day: true
    }));
    onChange("slots", [...data.slots, ...newSlots]);
  };

  return (
    <div className="animate-step-enter">
      <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>{t("schedule_time_slots")}</h2>
      
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', background: 'var(--gray-50)', padding: '0.4rem', borderRadius: '14px', maxWidth: '400px' }}>
        {MODES.map(m => (
          <button key={m.id} onClick={() => { onChange("bookingMode", m.id); onChange("slots", []); onChange("equipment", []); }}
            style={{
              flex: 1, padding: '0.6rem', borderRadius: '10px', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.8rem', transition: 'all 0.2s',
              background: data.bookingMode === m.id ? 'var(--white)' : 'transparent',
              color: data.bookingMode === m.id ? 'var(--pink-500)' : 'var(--gray-500)',
              boxShadow: data.bookingMode === m.id ? 'var(--shadow-sm)' : 'none'
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem' }}>
        <div>
          <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          {data.bookingMode === 'day' && (
            <button className={`btn ${data.slots.some(s => s.date === selectedDate) ? 'btn-outline' : 'btn-primary'}`} 
              style={{ width: '100%', marginTop: '1.5rem' }} onClick={toggleDay}>
              {data.slots.some(s => s.date === selectedDate) ? t("remove") : t("add_day")}
            </button>
          )}
        </div>

        <div>
          {data.bookingMode === 'hour' && (
            <>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {TIME_SLOTS_PERIODS.map(p => (
                  <button key={p.id} className={`btn btn-sm ${period === p.id ? 'btn-primary' : 'btn-soft'}`} onClick={() => setPeriod(p.id)} style={{ flex: 1, height: 'auto', padding: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{p.label}</span>
                  </button>
                ))}
              </div>
              {loading ? <div style={{ textAlign: 'center', padding: '2rem' }}><span className="spinner" /></div> : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
                  {SUB_SLOTS[period].map(timeRange => {
                    const [start, end] = timeRange.split(' - ');
                    const isBooked = bookedSlots.some(b => (start < b.end_time && end > b.start_time));
                    const isSelected = data.slots.some(s => s.date === selectedDate && s.start_time === start);
                    return (
                      <button key={timeRange} disabled={isBooked} onClick={() => addSlot(timeRange)}
                        className={`btn ${isSelected ? 'btn-primary' : isBooked ? 'btn-disabled' : 'btn-soft'}`}
                        style={{ padding: '0.75rem 0.5rem', height: 'auto', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700 }}>{start}</span>
                        <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>{end}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {!isSimplified && (
                <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                  {t("studio_price")}: {data.studios[0]?.price_per_hour || 100} DH/hr • {t("equipment_price")}: 100 DH/hr/item
                </p>
              )}
            </>
          )}

          {data.bookingMode === 'period' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {TIME_SLOTS_PERIODS.map(p => {
                  const isSelected = data.slots.some(s => s.date === selectedDate && s.period_id === p.id);
                  const isBooked = bookedSlots.some(b => (p.start < b.end_time && p.end > b.start_time));
                  return (
                    <div key={p.id} onClick={() => !isBooked && selectPeriod(p.id)}
                      className={`booking-card ${isSelected ? 'selected' : isBooked ? 'disabled' : ''}`}
                      style={{
                        padding: '1.5rem 1rem', borderRadius: '20px', textAlign: 'center', cursor: isBooked ? 'not-allowed' : 'pointer',
                        border: `2px solid ${isSelected ? 'var(--pink-500)' : 'var(--gray-200)'}`,
                        background: isSelected ? 'var(--pink-50)' : isBooked ? 'var(--gray-50)' : 'var(--white)',
                        opacity: isBooked ? 0.6 : 1, transition: 'all 0.2s', position: 'relative'
                      }}>
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                        {p.id === 'morning' ? '🌅' : p.id === 'afternoon' ? '☀️' : '🌙'}
                      </div>
                      <div style={{ fontWeight: 800, color: isSelected ? 'var(--pink-600)' : 'var(--gray-800)', fontSize: '1rem' }}>{p.label}</div>
                      <div style={{ fontSize: '0.75rem', color: isSelected ? 'var(--pink-400)' : 'var(--gray-500)', fontWeight: 600 }}>{p.time}</div>
                      {isSelected && (
                        <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', color: 'var(--pink-500)' }}>
                          <FaCheck size={14} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {data.slots.length > 0 && data.slots[0].period_id && (
                <div className="animate-fadeIn">
                  <h3 className="eyebrow" style={{ marginBottom: '1.25rem', color: 'var(--gray-600)' }}>Select Pricing Option</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                    {PERIOD_PACKAGES.map(pkg => {
                      const pId = data.slots[0].period_id;
                      const prices = PRICING.period[pId];
                      const price = pkg.id === 'base' ? prices.base : pkg.id === 'lighting' ? prices.lighting : prices.camera;
                      
                      const hasLighting = data.equipment.includes('Lighting');
                      const hasCamera = data.equipment.includes('Cameras');
                      
                      let isSel = false;
                      if (pkg.id === 'base') isSel = !hasLighting && !hasCamera;
                      else if (pkg.id === 'lighting') isSel = hasLighting && !hasCamera;
                      else if (pkg.id === 'camera') isSel = hasLighting && hasCamera;

                      return (
                        <div key={pkg.id} onClick={() => onChange("equipment", pkg.equip)}
                          className={`booking-card ${isSel ? 'selected' : ''}`}
                          style={{
                            padding: '1.25rem 1.5rem', borderRadius: '18px', cursor: 'pointer',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            border: `2px solid ${isSel ? 'var(--pink-500)' : 'var(--gray-100)'}`,
                            background: isSel ? 'var(--pink-50)' : 'var(--white)',
                            transition: 'all 0.2s'
                          }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ 
                              width: 24, height: 24, borderRadius: '50%', border: `2px solid ${isSel ? 'var(--pink-500)' : 'var(--gray-300)'}`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                              {isSel && <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--pink-500)' }} />}
                            </div>
                            <span style={{ fontWeight: 700, color: isSel ? 'var(--pink-700)' : 'var(--gray-700)' }}>{pkg.label}</span>
                          </div>
                          <div style={{ fontWeight: 800, fontSize: '1.1rem', color: isSel ? 'var(--pink-600)' : 'var(--gray-900)' }}>{price} DH</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {data.bookingMode === 'day' && (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--gray-50)', borderRadius: '20px', border: '1.5px dashed var(--gray-200)' }}>
              <FaCalendarAlt size={40} style={{ color: 'var(--pink-500)', marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ fontWeight: 600, color: 'var(--gray-600)' }}>{t("select_date_from_calendar")}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray-400)', maxWidth: '200px', margin: '0.5rem auto' }}>{t("full_day_booking_desc")}</p>
              {!isSimplified && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--white)', borderRadius: '12px', fontSize: '0.85rem', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>Studio only</span> <b>800 DH</b></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}><span>+ Lighting</span> <b>1000 DH</b></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>+ Lighting + Camera</span> <b>1500 DH</b></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Step4({ data, onChange, t }) {
  return (
    <div className="animate-step-enter">
      <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>{t("services")}</h2>
      <p className="body-sm" style={{ marginBottom: "2rem" }}>Select equipment for your session (100 DH/hr each in Hourly mode).</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
        {EQUIPMENT_LIST.map(eq => {
          const isSel = (data.equipment || []).includes(eq);
          return (
            <div key={eq} onClick={() => {
              const current = data.equipment || [];
              onChange("equipment", isSel ? current.filter(i => i !== eq) : [...current, eq]);
            }}
              className={`booking-card ${isSel ? 'selected' : ''}`}
              style={{
                borderRadius: "16px", padding: "1.25rem", cursor: "pointer",
                border: `2px solid ${isSel ? "var(--pink-500)" : "var(--gray-100)"}`,
                background: isSel ? "var(--pink-50)" : "var(--white)",
                display: 'flex', alignItems: 'center', gap: '1rem', transition: 'all 0.2s'
              }}>
              <div style={{ width: 24, height: 24, borderRadius: '6px', background: isSel ? 'var(--pink-500)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                {isSel && <FaCheck size={12} />}
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: isSel ? 'var(--pink-700)' : 'var(--gray-700)' }}>{t(`equipment_list.${eq}`)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Step5({ data, onChange, t }) {
  return (
    <div className="animate-step-enter">
      <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>{t("confirm_identity")}</h2>
      <p className="body-sm" style={{ marginBottom: "2rem" }}>{t("confirm_desc")}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className="field" style={{ gridColumn: 'span 2' }}>
          <label className="field-label">{t("full_name")}</label>
          <div style={{ position: 'relative' }}>
            <FaUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--pink-500)', opacity: 0.7 }} />
            <input className="field-input field-input-animated" style={{ paddingLeft: '2.8rem' }} value={data.name} onChange={e => onChange("name", e.target.value)} placeholder="Your name" />
          </div>
        </div>
        <div className="field">
          <label className="field-label">{t("email_address")}</label>
          <div style={{ position: 'relative' }}>
            <FaEnvelope style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--pink-500)', opacity: 0.7 }} />
            <input className="field-input field-input-animated" style={{ paddingLeft: '2.8rem' }} value={data.email} onChange={e => onChange("email", e.target.value)} placeholder="john@example.com" />
          </div>
        </div>
        <div className="field">
          <label className="field-label">{t("phone_number")}</label>
          <div style={{ position: 'relative' }}>
            <FaPhone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--pink-500)', opacity: 0.7 }} />
            <input className="field-input field-input-animated" style={{ paddingLeft: '2.8rem' }} value={data.phone} onChange={e => onChange("phone", e.target.value)} placeholder="+212 ..." />
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryBox({ data, totalPrice, totalHours, t, pricingInfo }) {
  const [prevTotal, setPrevTotal] = useState(totalPrice);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (prevTotal !== totalPrice) {
      setAnimate(true);
      setPrevTotal(totalPrice);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalPrice, prevTotal]);

  const hasStudio = data.studios.length > 0;
  const hasSlots = data.slots.length > 0;
  const isBookingFlow = data.category === 'booking';
  const studioRate = data.studios[0]?.price_per_hour || 100;
  const isPersonalizedPackage = data.package_type === 'personalized';

  return (
    <div style={{
      width: '300px', background: 'var(--white)', borderRadius: '24px', padding: '1.5rem',
      border: '1px solid var(--gray-100)', boxShadow: 'var(--shadow-lg)', position: 'sticky', top: '1rem', alignSelf: 'flex-start'
    }}>
      <h4 className="eyebrow" style={{ marginBottom: '1.5rem', color: 'var(--pink-600)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <FaBox /> {t("booking_summary")}
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--gray-500)' }}>Studio</span>
          <span style={{ fontWeight: 700 }}>{hasStudio ? data.studios[0].name : '---'}</span>
        </div>
        {!isBookingFlow && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)' }}>Package</span>
              <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>
                {data.package_type === 'standard' ? 'Standard Package' : 'Personalized Package'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)' }}>Location</span>
              <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{data.location_type === 'in' ? 'In Studio' : 'Out Studio'}</span>
            </div>
          </>
        )}
        {isBookingFlow && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--gray-500)' }}>Mode</span>
            <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{t(`per_${data.bookingMode}`)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--gray-500)' }}>{t("date")}</span>
          <span style={{ fontWeight: 700, textAlign: 'right' }}>{hasSlots ? data.slots[0].date : '---'}</span>
        </div>
        
        {isBookingFlow && data.bookingMode === 'period' && hasSlots && (
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <span style={{ color: 'var(--gray-500)' }}>Period</span>
             <span style={{ fontWeight: 700 }}>{data.slots[0].period_label || '---'}</span>
           </div>
        )}

        {isBookingFlow && data.bookingMode === 'period' && (
           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
             <span style={{ color: 'var(--gray-500)' }}>Selected Package</span>
             <span style={{ fontWeight: 700, color: 'var(--pink-600)', textAlign: 'right' }}>
                {data.equipment.includes('Cameras') ? 'Studio + Lighting + Camera' : 
                 data.equipment.includes('Lighting') ? 'Studio + Lighting' : 'Studio Only'}
             </span>
           </div>
        )}

        {isBookingFlow && data.bookingMode !== 'period' && data.equipment.length > 0 && (
          <div>
            <span style={{ color: 'var(--gray-500)', display: 'block', marginBottom: '0.5rem' }}>{t("selected_equipments")}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {data.equipment.map(eq => (
                <span key={eq} style={{ background: 'var(--gray-50)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600 }}>{eq}</span>
              ))}
            </div>
          </div>
        )}

        {!isBookingFlow && data.package_type === 'standard' && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--gray-500)' }}>Standard Package</span>
            <span style={{ fontWeight: 700 }}>400 DH</span>
          </div>
        )}

        {!isBookingFlow && isPersonalizedPackage && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)' }}>Theme Inspiration</span>
              <span style={{ fontWeight: 700 }}>{data.theme_image ? 'Uploaded' : 'None'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--gray-500)' }}>Theme Description</span>
              <span style={{ fontWeight: 700 }}>{data.theme_description ? 'Provided' : 'None'}</span>
            </div>
          </>
        )}

        <div style={{ borderTop: '1px dashed var(--gray-200)', paddingTop: '1rem', marginTop: '0.5rem' }}>
          <span style={{ color: 'var(--gray-500)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' }}>{t("price_breakdown")}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             {isBookingFlow ? (
               <>
                 {data.bookingMode === 'hour' && (
                   <>
                     <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span>Studio ({totalHours}h)</span>
                       <span>{totalHours * studioRate} DH</span>
                     </div>
                     {data.equipment.length > 0 && (
                       <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                         <span>Equip. ({data.equipment.length}x)</span>
                         <span>{totalHours * data.equipment.length * 100} DH</span>
                       </div>
                     )}
                   </>
                 )}
                 {(data.bookingMode === 'period' || data.bookingMode === 'day') && (
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <span>Package Total</span>
                     <span>{totalPrice} DH</span>
                   </div>
                 )}
               </>
             ) : (
               <>
                 {data.package_type === 'standard' && (
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <span>Standard Package</span>
                     <span>400 DH</span>
                   </div>
                 )}
                 {isPersonalizedPackage && (
                   <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                     <span>Personalized Package</span>
                     <span>Contact Us</span>
                   </div>
                 )}
               </>
             )}
          </div>
        </div>

        <div style={{ background: 'var(--pink-50)', padding: '1rem', borderRadius: '16px', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, color: 'var(--gray-900)' }}>{t("total_amount")}</span>
            <span className={`number-animate ${animate ? 'updated' : ''}`} style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--pink-500)' }}>
              {isPersonalizedPackage ? 'To be discussed after review' : `${totalPrice} DH`}
            </span>
          </div>
          <p style={{ fontSize: '0.65rem', color: 'var(--gray-400)', textAlign: 'right', margin: 0 }}>
            {isPersonalizedPackage ? ' ' : t("taxes_included")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ReservationForm({ preselectedStudio, preselectedDate, onClose }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    serviceType: "studio", category: null, equipment: [], team: [], 
    studios: preselectedStudio ? [preselectedStudio] : [], 
    slots: [], name: "", email: "", phone: "",
    project_name: "", project_description: "",
    bookingMode: "hour",
    location_type: 'in',
    selected_offers: [],
    custom_theme: false,
    custom_theme_file: null
  });
  const [categories, setCategories] = useState([]);
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studiosLoading, setStudiosLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    getCategories().then(res => {
      const apiCats = res?.data || [];
      const bookingCat = { id: 'booking', name: 'Booking', icon: '📅', color: 'var(--grad-cta)' };
      const filteredApiCats = apiCats.filter(c => c.name.toLowerCase() !== 'booking');
      setCategories([bookingCat, ...filteredApiCats]);
    }).catch(err => console.error("Fetch Categories Error:", err));
  }, []);

  useEffect(() => {
    if (step === 2 && data.category) {
      setStudiosLoading(true);
      if (data.category === 'booking') {
        getStudios().then(res => {
          const allStudios = res?.data || [];
          const filtered = allStudios.filter(s => {
            const name = (s.name || '').toLowerCase();
            return name.includes('full') || name.includes('white') || name.includes('girly');
          });
          setStudios(filtered);
          setStudiosLoading(false);
        }).catch(() => setStudiosLoading(false));
      } else {
        getStudios(data.category).then(res => {
          setStudios(res?.data || []);
          setStudiosLoading(false);
        }).catch(() => setStudiosLoading(false));
      }
    }
  }, [step, data.category]);

  const update = (key, val) => setData(p => ({ ...p, [key]: val }));

  const isBookingFlow = data.category === 'booking';

  const pricing = useMemo(() => {
    let totalHours = 0;
    let totalPrice = 0;
    let timePrice = 0;
    const studioRate = data.studios[0]?.price_per_hour || 100;

    if (isBookingFlow) {
      if (data.bookingMode === 'hour') {
        const uniqueSlots = new Set(data.slots.map(s => `${s.date}_${s.start_time}`));
        totalHours = uniqueSlots.size;
        timePrice = (totalHours * studioRate);
        totalPrice = timePrice + (totalHours * data.equipment.length * 100);
      } else if (data.bookingMode === 'period' && data.slots.length > 0) {
        const pId = data.slots[0].period_id;
        const equip = data.equipment;
        const hasLighting = equip.includes('Lighting');
        const hasCamera = equip.includes('Cameras');
        const pPrices = PRICING.period[pId] || PRICING.period.morning;
        
        if (hasLighting && hasCamera) totalPrice = pPrices.camera;
        else if (hasLighting) totalPrice = pPrices.lighting;
        else totalPrice = pPrices.base;
        timePrice = totalPrice;
      } else if (data.bookingMode === 'day' && data.slots.length > 0) {
        const uniqueDays = new Set(data.slots.map(s => s.date)).size;
        const equip = data.equipment;
        const hasLighting = equip.includes('Lighting');
        const hasCamera = equip.includes('Cameras');
        
        let basePrice = PRICING.day.base;
        if (hasLighting && hasCamera) basePrice = PRICING.day.camera;
        else if (hasLighting) basePrice = PRICING.day.lighting;
        
        totalPrice = uniqueDays * basePrice;
        timePrice = totalPrice;
      }
    } else {
      const offerPrice = (data.selected_offers || []).reduce((acc, curr) => acc + curr.price, 0);
      const themePrice = data.custom_theme ? 300 : 0;
      
      const uniqueSlots = new Set(data.slots.map(s => `${s.date}_${s.start_time}`));
      totalHours = uniqueSlots.size;

      if (data.bookingMode === 'hour') {
        timePrice = totalHours * studioRate;
      } else if (data.bookingMode === 'period' && data.slots.length > 0) {
        const pId = data.slots[0].period_id;
        timePrice = (PRICING.period[pId] || PRICING.period.morning).base;
      } else if (data.bookingMode === 'day' && data.slots.length > 0) {
        const uniqueDays = new Set(data.slots.map(s => s.date)).size;
        timePrice = uniqueDays * PRICING.day.base;
      }
      totalPrice = offerPrice + themePrice + timePrice;
    }

    return { totalHours, totalPrice, timePrice };
  }, [data.slots, data.bookingMode, data.equipment, data.category, data.selected_offers, data.custom_theme, isBookingFlow, data.studios]);

  const { totalHours, totalPrice } = pricing;

  const handleNext = async () => {
    if (step === 1) {
      if (!data.category) { alert(t("select_category_first")); return; }
      
      const selectedCatObj = categories.find(c => c.id === data.category);
      const catName = (selectedCatObj?.name || "").toLowerCase();
      const isSpecial = ["full access", "white space", "girly space", "booking"].some(s => catName.includes(s)) || data.category === 'booking';
      
      if (isSpecial) {
        if (!data.project_name || !data.project_description) {
          alert("Please fill in project name and description.");
          return;
        }
      }
      setStep(step + 1);
    } else if (step === 2) {
      if (data.studios.length === 0) { alert(t("errors.select_studio")); return; }
      setStep(step + 1);
    } else if (step === 3) {
      if (isBookingFlow) {
        if (data.slots.length === 0) { alert(t("errors.select_slot")); return; }
      }
      setStep(step + 1);
    } else if (step === 4) {
      if (!isBookingFlow) {
        if (data.slots.length === 0) { alert(t("errors.select_slot")); return; }
      }
      setStep(step + 1);
    } else if (step === 5) {
      if (!data.name || !data.email || !data.phone) { alert(t("errors.fill_contact_details")); return; }
      setLoading(true);
      try {
        const payload = {
          service_type: data.serviceType, equipment: data.equipment, team: data.team,
          name: data.name, email: data.email, phone: data.phone,
          project_name: data.project_name, project_description: data.project_description,
          total_price: totalPrice, booking_mode: data.bookingMode,
          studio_ids: data.studios.map(s => Number(s?.id || s)),
          slots: data.slots.map(s => ({ studio_id: Number(s.studio_id), date: s.date, start_time: s.start_time, end_time: s.end_time })),
          location_type: data.location_type,
          selected_offers: data.selected_offers,
          custom_theme: data.custom_theme,
          category_name: categories.find(c => c.id === data.category)?.name || 'Booking'
        };
        const res = await createReservation(payload);
        setBookingData(res.data || res);
        setStep(6);
      } catch (err) { alert(err.message || t("errors.booking_failed")); } finally { setLoading(false); }
    }
  };

  const STEP_LABELS = isBookingFlow 
    ? [t("category"), t("studios"), t("schedule"), t("services"), t("info")]
    : [t("category"), t("studios"), t("options"), t("schedule"), t("info")];

  return (
    <Modal isOpen={true} onClose={onClose} title={step === 6 ? t("booking_confirmed") : t("reservation")} maxWidth="1100px">
      <div style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
            {[1, 2, 3, 4, 5].map(s => <StepPill key={s} step={s} current={step} label={STEP_LABELS[s-1]} />)}
          </div>

          <div style={{ minHeight: '450px' }}>
            {step === 1 && <Step1 data={data} onChange={update} categories={categories} t={t} />}
            {step === 2 && <Step2 data={data} onChange={update} studios={studios} loading={studiosLoading} categories={categories} t={t} />}
            
            {isBookingFlow ? (
              <>
                {step === 3 && <Step3 data={data} onChange={update} t={t} />}
                {step === 4 && <Step4 data={data} onChange={update} t={t} />}
              </>
            ) : (
              <>
                {step === 3 && <Step3Options data={data} onChange={update} t={t} />}
                {step === 4 && <Step3 data={data} onChange={update} t={t} isSimplified={true} />}
              </>
            )}
            
            {step === 5 && <Step5 data={data} onChange={update} t={t} />}
            {step === 6 && bookingData && <BookingReceiptModal bookingData={bookingData} onClose={onClose} />}
          </div>

          {step < 6 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--gray-100)' }}>
              <button className="btn btn-outline btn-ripple btn-rise" onClick={() => step === 1 ? onClose() : setStep(step - 1)}>
                <FaArrowLeft /> {step === 1 ? t("cancel") : t("back")}
              </button>
              <button className="btn btn-primary btn-lg btn-ripple btn-rise" onClick={handleNext} disabled={loading}>
                {loading ? t("processing") : step === 5 ? t("confirm_reservation") : t("continue")} <FaArrowRight />
              </button>
            </div>
          )}
        </div>

        {step < 6 && <SummaryBox data={data} totalPrice={totalPrice} totalHours={totalHours} t={t} pricingInfo={pricing} />}
      </div>
    </Modal>
  );
}
