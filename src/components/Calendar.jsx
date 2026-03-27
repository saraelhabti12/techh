import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";

/**
 * Calendar
 * ─ Interactive monthly calendar with real-time availability from API.
 * Props:
 *   selectedDate  string | null   "YYYY-MM-DD"
 *   onSelectDate  (dateStr) → void
 *   onAvailabilityLoad (data) → void
 */

function pad(n) { return String(n).padStart(2, "0"); }
function fmt(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

export default function Calendar({ selectedDate, onSelectDate, onAvailabilityLoad }) {
  const { t } = useTranslation();
  const MONTHS = t('months', { returnObjects: true });
  const WDAYS = t('wdays', { returnObjects: true });

  const today  = new Date();
  const [viewY, setViewY] = useState(today.getFullYear());
  const [viewM, setViewM] = useState(today.getMonth());
  const [loading, setLoading] = useState(false);
  const [availMap, setAvailMap] = useState({}); // date → availability[]

  const fetchMonthAvail = useCallback(async () => {
    setLoading(true);
    try {
      const { getAvailability } = await import("../api/studioApi");
      
      const newAvailMap = {};
      const dim = new Date(viewY, viewM + 1, 0).getDate();
      
      // Fetch availability for each day in the month
      const promises = [];
      for (let d = 1; d <= dim; d++) {
        const ds = fmt(viewY, viewM, d);
        if (ds < fmt(today.getFullYear(), today.getMonth(), today.getDate())) continue;
        promises.push(getAvailability(ds));
      }
      
      const results = await Promise.all(promises);
      results.forEach(res => {
        const data = res?.data || [];
        if (data.length > 0) {
          newAvailMap[data[0].date] = data;
        }
      });
      
      setAvailMap(prev => ({ ...prev, ...newAvailMap }));
      
      if (selectedDate && newAvailMap[selectedDate]) {
        onAvailabilityLoad?.(newAvailMap[selectedDate]);
      }
    } catch (e) {
      console.error("Calendar fetch error:", e);
    } finally {
      setLoading(false);
    }
  }, [viewY, viewM, selectedDate, onAvailabilityLoad]); // eslint-disable-line

  useEffect(() => {
    fetchMonthAvail();
  }, [fetchMonthAvail]); // re-fetch when month changes

  // Load current selectedDate availability into parent component if it changes
  useEffect(() => {
    if (selectedDate && availMap[selectedDate]) {
      onAvailabilityLoad?.(availMap[selectedDate]);
    }
  }, [selectedDate, availMap, onAvailabilityLoad]);

  const handleDayClick = (dateStr) => {
    onSelectDate(dateStr);
  };

  // Build calendar grid
  const firstDay     = new Date(viewY, viewM, 1).getDay();
  const daysInMonth  = new Date(viewY, viewM + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => {
    if (viewM === 0) { setViewM(11); setViewY(y => y - 1); }
    else setViewM(m => m - 1);
  };
  const nextMonth = () => {
    if (viewM === 11) { setViewM(0); setViewY(y => y + 1); }
    else setViewM(m => m + 1);
  };

  // Determine per-day dot color
  const getDayMeta = (day) => {
    const ds = fmt(viewY, viewM, day);
    const avail = availMap[ds];
    if (!avail || avail.length === 0) return { hasData: false };
    
    // Check if ANY studio is available on this date
    const anyAvail = avail.some(a => a.status === "available" || a.status === "partially_reserved");
    // All studios are "reserved" (full day)
    const allReserved = avail.every(a => a.status === "reserved");
    
    return { hasData: true, anyAvail, allReserved, ds };
  };

  const todayStr = fmt(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="calendar-card" style={{ border: 'none', boxShadow: 'none', background: 'transparent', width: '100%' }}>
      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 0 12px 0",
        borderBottom: "1.5px solid var(--gray-100)",
        marginBottom: "16px"
      }}>
        <button className="btn btn-outline" style={{ width: 32, height: 32, padding: 0, borderRadius: '8px', fontSize: '1rem' }} onClick={prevMonth}>
          ‹
        </button>

        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "14px", fontWeight: "800", color: "var(--gray-900)", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {MONTHS[viewM]} {viewY}
          </div>
        </div>

        <button className="btn btn-outline" style={{ width: 32, height: 32, padding: 0, borderRadius: '8px', fontSize: '1rem' }} onClick={nextMonth}>
          ›
        </button>
      </div>

      {/* ── Weekday labels ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(7, 1fr)",
        padding: "0 0 10px 0",
        gap: "4px"
      }}>
        {WDAYS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", color: "var(--gray-400)" }}>
            {d}
          </div>
        ))}
      </div>

      {/* ── Day cells ── */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(7, 1fr)", 
        gap: "8px", /* USER REQUESTED gap: 8px */
        justifyItems: 'center'
      }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`e${idx}`} style={{ width: '100%', aspectRatio: '1/1' }} />;
          const ds     = fmt(viewY, viewM, day);
          const isPast = ds < todayStr;
          const isToday= ds === todayStr;
          const isSel  = ds === selectedDate;
          const meta   = getDayMeta(day);

          let classes = "calendar-day";
          if (isPast) classes += " past";
          if (isToday) classes += " today";
          if (isSel) classes += " selected";

          return (
            <div
              key={day}
              className={classes}
              onClick={() => !isPast && handleDayClick(ds)}
              title={ds}
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                position: "relative",
                fontWeight: isSel || isToday ? "800" : "600",
                cursor: isPast ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
            >
              {day}
              {/* Availability dot */}
              {meta.hasData && !isPast && (
                <span className={`dot ${meta.allReserved ? "dot-reserved" : meta.anyAvail ? "dot-available" : ""}`} style={{
                  position: "absolute",
                  bottom: "6px",
                  width: "5px",
                  height: "5px",
                  background: isSel ? "#fff" : undefined
                }} />
              )}
            </div>
          );
        })}
      </div>
      
      {loading && (
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
           <span style={{ fontSize: '10px', color: 'var(--pink-500)', fontWeight: '700', textTransform: 'uppercase' }}>{t('Updating availability...')}</span>
        </div>
      )}
    </div>
  );
}