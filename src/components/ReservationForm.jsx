import { useState, useCallback, useEffect, useMemo } from "react";
import { createReservation, getStudios, getStudioAvailability } from "../api/studioApi";
import Modal from "./Modal";
import Calendar from "./Calendar";
import BookingReceiptModal from "./BookingReceiptModal";
import { useTranslation } from "react-i18next";
import { FaCheck, FaArrowRight, FaArrowLeft, FaCalendarAlt, FaClock, FaUser, FaEnvelope, FaPhone, FaBuilding, FaVideo, FaUsers, FaTrash, FaEdit } from 'react-icons/fa';

const SUB_SLOTS = {
  morning: ["08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
  afternoon: ["13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00", "16:00 - 17:00", "17:00 - 18:00"],
  evening: ["19:00 - 20:00", "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00", "23:00 - 23:59"],
};

const EQUIPMENT_LIST = ["Cameras", "Lighting", "Microphone", "Lens", "Stabilisateurs","Drone"];
const TEAM_LIST = ["Photographer", "Videographer", "Lighting Technician", "Sound Engineer", "Editor"];

function pad(n) { return String(n).padStart(2, "0"); }

// ── Sub-components ─────────────────────────────────────────────

function StepPill({ step, current, label }) {
  const done = current > step;
  const active = current === step;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", flex: 1 }}>
      <div style={{
        width: 36, height: 36, borderRadius: "12px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.9rem", fontWeight: 700, transition: "all 0.3s",
        background: done ? "var(--grad-cta)"
          : active ? "var(--pink-50)"
          : "var(--gray-50)",
        color: done ? "var(--white)" : active ? "var(--pink-500)" : "var(--gray-400)",
        border: active ? "2px solid var(--pink-500)" : "2px solid transparent",
        boxShadow: active ? "0 0 0 4px rgba(255,15,155,0.1)" : "none",
        transform: active ? 'scale(1.1)' : 'scale(1)'
      }}>
        {done ? <FaCheck size={14} /> : step}
      </div>
      <span style={{
        fontSize: "0.65rem", letterSpacing: "0.05em", textTransform: "uppercase",
        color: active ? "var(--pink-500)" : done ? "var(--gray-900)" : "var(--gray-400)",
        fontWeight: 700,
      }}>
        {label}
      </span>
    </div>
  );
}

function Step1({ data, onChange, t }) {
  const SERVICES = [
    { id: "studio", label: t("studio_only"), icon: <FaBuilding /> },
    { id: "equipment", label: t("studio_equipment"), icon: <FaVideo /> },
    { id: "team", label: t("studio_equipment_team"), icon: <FaUsers /> },
  ];

  return (
    <div className="animate-fadeUp">
      <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>{t("service_selection")}</h2>
      <p className="body-sm" style={{ marginBottom: "2.5rem" }}>{t("choose_service")}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "2.5rem" }}>
        {SERVICES.map(s => {
          const sel = data.serviceType === s.id;
          return (
            <div key={s.id} onClick={() => onChange("serviceType", s.id)}
              style={{
                borderRadius: "20px", padding: "2rem 1rem", textAlign: "center", cursor: "pointer",
                border: `2px solid ${sel ? "var(--pink-500)" : "var(--gray-100)"}`,
                background: sel ? "var(--pink-50)" : "var(--white)",
                boxShadow: sel ? "var(--shadow-md)" : "var(--shadow-xs)",
                transition: "all 0.2s ease-out",
                transform: sel ? 'translateY(-4px)' : 'none'
              }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem", color: sel ? "var(--pink-500)" : "var(--gray-300)" }}>{s.icon}</div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: sel ? "var(--pink-500)" : "var(--gray-900)" }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {(data.serviceType === "equipment" || data.serviceType === "team") && (
        <div className="animate-fadeIn" style={{ marginBottom: "2rem" }}>
          <h4 className="eyebrow" style={{ marginBottom: '1rem' }}>{t("additional_equipment")}</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {EQUIPMENT_LIST.map(eq => {
              const isSel = (data.equipment || []).includes(eq);
              const labelKey = eq === "Stabilisateurs" ? "Stabilizers" : eq;
              return (
                <div key={eq} onClick={() => {
                  const current = data.equipment || [];
                  onChange("equipment", isSel ? current.filter(i => i !== eq) : [...current, eq]);
                }}
                  style={{
                    borderRadius: "12px", padding: "0.6rem 1.25rem", cursor: "pointer",
                    border: `1.5px solid ${isSel ? "var(--pink-500)" : "var(--gray-200)"}`,
                    background: isSel ? "var(--grad-cta)" : "var(--white)",
                    color: isSel ? "var(--white)" : "var(--gray-700)",
                    fontSize: "0.85rem", fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                >
                  {t(`equipment_list.${labelKey}`)}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data.serviceType === "team" && (
        <div className="animate-fadeIn" style={{ marginBottom: "2rem" }}>
          <h4 className="eyebrow" style={{ marginBottom: '1rem' }}>{t("select_team_members")}</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {TEAM_LIST.map(member => {
              const isSel = (data.team || []).includes(member);
              const labelKey = member.replace(/ /g, '');
              return (
                <div key={member} onClick={() => {
                  const current = data.team || [];
                  onChange("team", isSel ? current.filter(i => i !== member) : [...current, member]);
                }}
                  style={{
                    borderRadius: "12px", padding: "0.6rem 1.25rem", cursor: "pointer",
                    border: `1.5px solid ${isSel ? "var(--pink-500)" : "var(--gray-200)"}`,
                    background: isSel ? "var(--grad-cta)" : "var(--white)",
                    color: isSel ? "var(--white)" : "var(--gray-700)",
                    fontSize: "0.85rem", fontWeight: 600,
                    transition: "all 0.2s",
                  }}
                >
                  {t(`team_list.${member}`)}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


function Step2({ data, onChange, studios, t }) {
  const toggleStudio = (s) => {
    const current = data.studios || [];
    const exists = current.find(item => item.id === s.id);
    onChange("studios", exists ? current.filter(item => item.id !== s.id) : [...current, s]);
    onChange("slots", []);
  };

  return (
    <div className="animate-fadeUp">
      <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>{t("select_studios")}</h2>
      <p className="body-sm" style={{ marginBottom: "1.5rem" }}>{t("select_studios_desc")}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "1.5rem" }}>
        {studios.map(s => {
          const sel = (data.studios || []).some(item => (item?.id === s.id || item === s.id));
          return (
            <div key={s.id} onClick={() => toggleStudio(s)}
              style={{
                borderRadius: "20px", overflow: "hidden", cursor: "pointer",
                border: `2px solid ${sel ? "var(--pink-500)" : "var(--gray-100)"}`,
                boxShadow: sel ? "var(--shadow-lg)" : "var(--shadow-sm)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: sel ? 'scale(1.02)' : 'scale(1)'
              }}>
              <div style={{ height: 140, position: 'relative' }}>
                <img src={s.image} alt={s.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {sel && <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'var(--pink-500)', color: '#fff', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}><FaCheck size={10} /></div>}
              </div>
              <div style={{ padding: "1.25rem", background: sel ? "var(--pink-50)" : "var(--white)" }}>
                <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.25rem" }}>{s.name}</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: 'var(--pink-500)' }}>{s.price_per_hour} <small style={{ fontSize: '0.7rem', opacity: 0.6 }}>MAD/hr</small></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Step3({ data, onChange, t }) {
  const TIME_SLOTS_PERIODS = [
    { id: "morning",   label: t("morning"),   time: "08:00 - 12:00", icon: <FaCalendarAlt /> },
    { id: "afternoon", label: t("afternoon"), time: "12:00 - 18:00",  icon: <FaCalendarAlt /> },
    { id: "evening",   label: t("evening"),   time: "18:00 - 23:59",  icon: <FaCalendarAlt /> },
  ];

  const [selectedDate, setSelectedDate] = useState(data.slots.length > 0 ? data.slots[0].date : (new Date().toISOString().split('T')[0]));
  const [period, setPeriod] = useState("morning");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSlotKey, setEditingSlotKey] = useState(null);

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
      alert(t("errors.slot_already_added"));
      return;
    }

    const newSlots = data.studios.map(s => {
        const studioId = s?.id || s;
        return {
            studio_id: Number(studioId),
            date: selectedDate,
            start_time: start,
            end_time: end,
            price_per_hour: s?.price_per_hour || 0
        };
    });

    onChange("slots", [...data.slots, ...newSlots]);
  };

  const removeSlot = (date, startTime) => {
    onChange("slots", data.slots.filter(s => !(s.date === date && s.start_time === startTime)));
  };

  const displaySlots = [];
  const seen = new Set();
  data.slots.forEach(s => {
    const key = `${s.date}_${s.start_time}`;
    if (!seen.has(key)) {
      seen.add(key);
      displaySlots.push(s);
    }
  });

  const ALL_TIMES = Object.values(SUB_SLOTS).flat();

  return (
    <div className="animate-fadeUp">
      <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>{t("schedule_time_slots")}</h2>
      <p className="body-sm" style={{ marginBottom: "2rem" }}>{t("schedule_desc")}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        <div>
          <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />
        </div>
        <div>
          <h3 className="eyebrow" style={{ marginBottom: '1rem' }}>{t("select_period")}</h3>
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {TIME_SLOTS_PERIODS.map(p => (
              <button 
                key={p.id} 
                className={`btn ${period === p.id ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setPeriod(p.id)}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.75rem', height: 'auto' }}
              >
                <span style={{ fontSize: '1.2rem' }}>{p.icon}</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{p.label}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{p.time}</span>
              </button>
            ))}
          </div>

          <h3 className="eyebrow" style={{ marginBottom: '1rem' }}>{t("available_slots")}</h3>
          {loading ? (
             <div style={{ textAlign: 'center', padding: '2rem' }}><span className="spinner" /></div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '0.75rem' }}>
              {SUB_SLOTS[period].map(timeRange => {
                const [start, end] = timeRange.split(' - ');
                const isBooked = bookedSlots.some(b => (start < b.end_time && end > b.start_time));
                const isSelected = data.slots.some(s => s.date === selectedDate && s.start_time === start);

                return (
                  <button
                    key={timeRange}
                    disabled={isBooked}
                    onClick={() => addSlot(timeRange)}
                    className={`btn ${isSelected ? 'btn-primary' : isBooked ? 'btn-disabled' : 'btn-soft'}`}
                    style={{ padding: '0.75rem 0.5rem', height: 'auto', display: 'flex', flexDirection: 'column' }}
                  >
                    <span style={{ fontWeight: 700 }}>{start}</span>
                    <span style={{ fontSize: '0.6rem', opacity: 0.7 }}>to {end}</span>
                    {isBooked && <span style={{ fontSize: '0.6rem', opacity: 0.8 }}>{t("reserved")}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <h3 className="eyebrow" style={{ marginBottom: '1rem' }}>{t("selected_slots")}</h3>
      {displaySlots.length > 0 ? (
        <div style={{ border: '1px solid var(--gray-200)', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
              <tr>
                <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--gray-500)', fontWeight: 600 }}>{t("date")}</th>
                <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--gray-500)', fontWeight: 600 }}>{t("time")}</th>
                <th style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--gray-500)', fontWeight: 600, textAlign: 'right' }}>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {displaySlots.map((s) => {
                const key = `${s.date}_${s.start_time}`;
                const isEditing = editingSlotKey === key;
                return (
                  <tr key={key} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{s.date}</td>
                    <td style={{ padding: '1rem' }}>
                      {isEditing ? (
                        <select 
                          className="field-input"
                          style={{ padding: '0.4rem', height: 'auto', minHeight: '36px' }}
                          value={`${s.start_time} - ${s.end_time}`}
                          onChange={(e) => {
                            const [newStart, newEnd] = e.target.value.split(' - ');
                            const newSlots = data.slots.map(slot => {
                              if (slot.date === s.date && slot.start_time === s.start_time) {
                                return { ...slot, start_time: newStart, end_time: newEnd };
                              }
                              return slot;
                            });
                            onChange("slots", newSlots);
                            setEditingSlotKey(null);
                          }}
                        >
                          {ALL_TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      ) : (
                        `${s.start_time} - ${s.end_time}`
                      )}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {isEditing ? (
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditingSlotKey(null)}>
                          {t("cancel")}
                        </button>
                      ) : (
                        <button className="btn btn-ghost btn-sm" style={{ color: 'var(--gray-500)', marginRight: '0.5rem' }} onClick={() => setEditingSlotKey(key)}>
                          <FaEdit />
                        </button>
                      )}
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--reserved)' }} onClick={() => removeSlot(s.date, s.start_time)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--gray-50)', borderRadius: '16px', border: '1px dashed var(--gray-300)', color: 'var(--gray-400)' }}>
          {t("no_slots_selected")}
        </div>
      )}
    </div>
  );
}

function Step4({ data, onChange, totalPrice, totalHours, t }) {
  return (
    <div className="animate-fadeUp">
      <h2 className="heading-md" style={{ marginBottom: "0.5rem" }}>{t("confirm_identity")}</h2>
      <p className="body-sm" style={{ marginBottom: "2.5rem" }}>{t("confirm_desc")}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="field">
          <label className="field-label">{t("full_name")}</label>
          <div style={{ position: 'relative' }}>
            <FaUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input className="field-input" style={{ paddingLeft: '2.8rem' }} value={data.name} onChange={e => onChange("name", e.target.value)} placeholder="John Doe" />
          </div>
        </div>
        <div className="field">
          <label className="field-label">{t("email_address")}</label>
          <div style={{ position: 'relative' }}>
            <FaEnvelope style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input className="field-input" style={{ paddingLeft: '2.8rem' }} value={data.email} onChange={e => onChange("email", e.target.value)} placeholder="john@example.com" />
          </div>
        </div>
        <div className="field">
          <label className="field-label">{t("phone_number")}</label>
          <div style={{ position: 'relative' }}>
            <FaPhone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
            <input className="field-input" style={{ paddingLeft: '2.8rem' }} value={data.phone} onChange={e => onChange("phone", e.target.value)} placeholder="+212 ..." />
          </div>
        </div>

        <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--gray-50)', borderRadius: '16px', border: '1px solid var(--gray-200)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>{t("total_studios")}</span>
                <span style={{ fontWeight: 700 }}>{data.studios.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--gray-500)' }}>{t("total_hours")}</span>
                <span style={{ fontWeight: 700 }}>{totalHours}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1.5px dashed var(--gray-300)' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t("total_price")}</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pink-500)' }}>MAD {totalPrice}</span>
            </div>
        </div>
      </div>
    </div>
  );
}

export default function ReservationForm({ preselectedStudio, preselectedDate, onClose }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    serviceType: "studio", equipment: [], team: [], 
    studios: preselectedStudio ? [preselectedStudio] : [], 
    slots: [], name: "", email: "", phone: ""
  });
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resId, setResId] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    getStudios().then(res => {
        const fetched = res?.data || res || [];
        setStudios(fetched);
        
        if (p => p.studios.length === 1 && (typeof p.studios[0] === 'number' || typeof p.studios[0] === 'string')) {
          setData(p => {
              const found = fetched.find(s => String(s.id) === String(p.studios[0]));
              if (found) return { ...p, studios: [found] };
              return p;
          });
        }
    });
  }, []);

  const update = (key, val) => setData(p => ({ ...p, [key]: val }));

  const totalDurationAndPrice = useMemo(() => {
    let totalHours = 0;
    let totalPrice = 0;
    data.slots.forEach(slot => {
      const h1 = parseInt(slot.start_time.split(':')[0]);
      const h2 = parseInt(slot.end_time.split(':')[0]);
      const diff = h2 - h1;
      totalHours += diff;
      totalPrice += diff * (Number(slot.price_per_hour) || 0);
    });
    return { totalHours, totalPrice };
  }, [data.slots]);

  const { totalHours, totalPrice } = totalDurationAndPrice;

  const handleNext = async () => {
    if (step === 4) {
      if (!data.name || !data.email || !data.phone) {
        alert("Please fill in all contact details.");
        return;
      }
      setLoading(true);
      try {
        const payload = {
          service_type: data.serviceType,
          equipment: data.equipment || [],
          team: data.team || [],
          name: data.name,
          email: data.email,
          phone: data.phone,
          total_price: totalPrice,
          studio_ids: data.studios.map(s => Number(s?.id || s)),
          slots: data.slots.map(s => ({
            studio_id: Number(s.studio_id),
            date: s.date,
            start_time: s.start_time,
            end_time: s.end_time
          }))
        };

        console.log("Reservation Payload:", payload);

        const res = await createReservation(payload);
        setBookingData(res.data || res);
        setResId(res.data?.booking_reference || res.booking_reference || res.data?.id);
        setStep(5);
      } catch (err) {
        console.error("Reservation Error:", err);
        alert(err.message || "Booking failed.");
      } finally {
        setLoading(false);
      }
    } else {
      if (step === 2 && data.studios.length === 0) {
        alert("Please select at least one studio.");
        return;
      }
      if (step === 3 && data.slots.length === 0) {
        alert("Please select at least one time slot.");
        return;
      }
      setStep(step + 1);
    }
  };

  const STEP_LABELS = [t("service"), t("studios"), t("schedule"), t("info"), t("finish")];

  return (
    <Modal isOpen={true} onClose={onClose} title={step === 5 ? t("booking_confirmed") : t("reservation")} maxWidth="900px">
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', padding: '0 1rem' }}>
        {[1, 2, 3, 4].map(s => <StepPill key={s} step={s} current={step} label={STEP_LABELS[s-1]} />)}
      </div>

      <div style={{ minHeight: '400px' }}>
        {step === 1 && <Step1 data={data} onChange={update} t={t} />}
        {step === 2 && <Step2 data={data} onChange={update} studios={studios} t={t} />}
        {step === 3 && <Step3 data={data} onChange={update} t={t} />}
        {step === 4 && <Step4 data={data} onChange={update} totalPrice={totalPrice} totalHours={totalHours} t={t} />}
        
        {step === 5 && bookingData && (
          <BookingReceiptModal bookingData={bookingData} onClose={onClose} />
        )}
      </div>

      {step < 5 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--gray-100)' }}>
          <button className="btn btn-outline" onClick={() => step === 1 ? onClose() : setStep(step - 1)}>
            <FaArrowLeft /> {step === 1 ? t("cancel") : t("back")}
          </button>
          <button className="btn btn-primary btn-lg" onClick={handleNext} disabled={loading}>
            {loading ? t("processing") : step === 4 ? t("confirm_reservation") : t("continue")} <FaArrowRight />
          </button>
        </div>
      )}
    </Modal>
  );
}