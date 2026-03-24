import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { 
  getAdminStats, 
  getAdminStudios, 
  deleteAdminStudio,
  getAdminReservations, 
  getAdminReservationDetail,
  getAdminUsers,
  getStudioCalendar,
  updateReservationStatus,
  toggleUserAdmin,
  toggleUserBan
} from "../api/adminApi";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import Modal from "../components/Modal";
import { 
  FaCalendarAlt, FaClock, FaHashtag, FaUser, FaPhone, FaMapMarkerAlt, 
  FaEnvelope, FaShieldAlt, FaBan, FaHistory, FaCheckCircle, 
  FaChartBar, FaBuilding, FaUsers, FaPlus, FaEdit, FaTrash, FaInfoCircle
} from 'react-icons/fa';

/**
 * AdminDashboard
 * ─────────────────────────────────────────────────────────────────────
 */

// ── Modals ───────────────────────────────────────────────────

function ReservationDetailModal({ reservationId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAdminReservationDetail(reservationId)
      .then(res => setData(res.data))
      .catch(err => setError(err.message || "Failed to load reservation details"))
      .finally(() => setLoading(false));
  }, [reservationId]);

  return (
    <Modal 
      isOpen={!!reservationId} 
      onClose={onClose} 
      title={`Reservation Details`}
      maxWidth="850px"
    >
        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center" }}>
            <span className="spinner spinner-purple" />
            <p style={{ marginTop: "1rem", color: "var(--gray-500)" }}>Loading details...</p>
          </div>
        ) : error ? (
          <div style={{ padding: "4rem", textAlign: "center" }}>
            <FaInfoCircle size={48} color="var(--pink-500)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
            <p style={{ color: "var(--gray-500)" }}>{error}</p>
            <button className="btn btn-primary btn-md" style={{ marginTop: '1.5rem' }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <div className="animate-fadeIn">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '2rem',
              padding: '1.5rem',
              background: 'var(--gray-50)',
              borderRadius: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                  <FaHashtag color="var(--pink-500)" size={14} />
                  <span className="eyebrow" style={{ margin: 0 }}>Reference</span>
                </div>
                <h3 className="heading-md" style={{ margin: 0, color: 'var(--pink-500)' }}>{data.booking_reference}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`tag tag-${data.status === 'confirmed' ? 'available' : data.status === 'cancelled' ? 'reserved' : 'purple'}`} style={{ padding: '0.5rem 1rem', borderRadius: '50px' }}>
                  {data.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="detail-section">
                  <h4 className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaUser size={12} /> Customer Information
                  </h4>
                  <div style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid var(--gray-100)', boxShadow: 'var(--shadow-xs)' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{data.user?.name || data.customer_name}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--gray-500)', marginTop: '0.5rem' }}><FaEnvelope size={12} /> {data.user?.email || data.customer_email}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}><FaPhone size={12} /> {data.user?.phone || data.customer_phone || 'No phone'}</div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4 className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaMapMarkerAlt size={12} /> Studio Information
                  </h4>
                  <div style={{ padding: '1.5rem', background: 'var(--pink-50)', borderRadius: '16px', border: '1px solid var(--pink-100)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--pink-600)' }}>{data.studio.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--pink-400)', marginTop: '0.25rem' }}>ID: {data.studio.id}</div>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h4 className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaClock size={12} /> Booked Slots
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {(data.slots || []).map((slot, i) => (
                    <div key={i} style={{ padding: '1rem', background: '#fff', border: '1px solid var(--gray-100)', borderRadius: '12px', boxShadow: 'var(--shadow-xs)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.9rem' }}>
                        <span>{slot.date}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--pink-500)' }}>{slot.session}</span>
                      </div>
                      <div style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{slot.start_time} - {slot.end_time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ 
              marginTop: '2rem', 
              padding: '1.5rem 2rem', 
              background: 'var(--gray-900)', 
              borderRadius: '20px', 
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', opacity: 0.6, textTransform: 'uppercase' }}>Total Price</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{data.total_price} <small style={{ fontSize: '0.8rem' }}>MAD</small></div>
              </div>
              <button className="btn btn-outline" style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.2)', color: '#fff' }} onClick={onClose}>Close Details</button>
            </div>
          </div>
        )}
    </Modal>
  );
}

// ── Views ────────────────────────────────────────────────────

function AnalyticsView() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAdminStats()
      .then(res => setStats(res.data))
      .catch(err => {
        console.error("Failed to fetch admin stats:", err);
        setError(err.message || "Failed to load analytics");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <span className="spinner spinner-purple" />
      <p style={{ marginTop: '1rem', color: 'var(--gray-500)' }}>Compiling metrics...</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <FaShieldAlt size={48} color="var(--pink-500)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
      <h3 className="heading-md" style={{ color: 'var(--gray-900)' }}>{error}</h3>
      <p style={{ marginTop: '1rem', color: 'var(--gray-500)' }}>Please ensure you have administrative permissions.</p>
    </div>
  );

  if (!stats) return null;

  return (
    <div className="animate-fadeUp">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
        <FaChartBar size={24} color="var(--pink-500)" />
        <h2 className="heading-md" style={{ margin: 0 }}>Platform Overview</h2>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {[
          { label: "Total Bookings", val: stats.total_bookings, color: "var(--pink-500)", icon: <FaCalendarAlt /> },
          { label: "Total Revenue", val: `${stats.total_revenue} MAD`, color: "#22c07a", icon: <FaCheckCircle /> },
          { label: "Registered Users", val: stats.total_users, color: "#8A2BE2", icon: <FaUsers /> },
          { label: "Active Studios", val: stats.total_studios, color: "#1A1A1A", icon: <FaBuilding /> },
        ].map(card => (
          <div key={card.label} style={{ background: "#fff", padding: "1.75rem", borderRadius: "24px", border: "1px solid var(--gray-100)", boxShadow: "var(--shadow-sm)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--gray-500)", textTransform: "uppercase", fontWeight: 700, marginBottom: "1rem", display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: card.color }}>{card.icon}</span> {card.label}
            </div>
            <div style={{ fontSize: "1.8rem", fontWeight: 800, color: 'var(--gray-900)' }}>{card.val}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "24px", border: "1px solid var(--gray-100)", boxShadow: 'var(--shadow-sm)' }}>
          <h4 className="heading-md" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FaHistory color="var(--pink-500)" /> Revenue Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.revenue_per_studio.map(s => (
              <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', padding: "1.25rem", borderRadius: '16px', background: 'var(--gray-50)' }}>
                <span style={{ fontWeight: 600 }}>{s.name}</span>
                <span style={{ fontWeight: 700, color: "#22c07a" }}>{s.revenue} MAD</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "#fff", padding: "2rem", borderRadius: "24px", border: "1px solid var(--gray-100)", boxShadow: 'var(--shadow-sm)' }}>
          <h4 className="heading-md" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <FaClock color="var(--pink-500)" /> Recent Activity
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats.upcoming_bookings.map(b => (
              <div key={b.booking_reference} style={{ padding: "1rem", background: 'var(--gray-50)', borderRadius: '12px', display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>{b.user?.name || b.customer_name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray-400)", marginTop: '0.25rem' }}>{b.studio?.name} • {b.date}</div>
                </div>
                <span className={`tag tag-${b.status === "confirmed" ? "available" : "purple"}`} style={{ fontSize: "0.65rem" }}>{b.status.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudioScheduleView() {
  const [studios, setStudios] = useState([]);
  const [selectedStudio, setSelectedStudio] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAdminStudios().then(res => {
      const list = res.data?.data || res.data || res;
      setStudios(list);
      if (list.length > 0) setSelectedStudio(list[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedStudio && selectedDate) {
      setLoading(true);
      getStudioCalendar(selectedStudio, selectedDate, selectedDate)
        .then(res => setSlots(res.data))
        .finally(() => setLoading(false));
    }
  }, [selectedStudio, selectedDate]);

  return (
    <div className="animate-fadeUp">
      <h2 className="heading-md" style={{ marginBottom: "2.5rem" }}>Studio Schedules</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: '1fr 1fr', gap: "1.5rem", marginBottom: "2.5rem", maxWidth: '600px' }}>
        <div className="field">
          <label className="field-label">Select Studio</label>
          <select className="field-input" value={selectedStudio} onChange={e => setSelectedStudio(e.target.value)}>
            {studios.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="field">
          <label className="field-label">Select Date</label>
          <input type="date" className="field-input" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>
      </div>

      <div style={{ background: "#fff", padding: "2.5rem", borderRadius: "24px", border: "1px solid var(--gray-100)", boxShadow: 'var(--shadow-sm)' }}>
        <h4 className="eyebrow" style={{ marginBottom: "2rem" }}>Daily Agenda • {new Date(selectedDate).toLocaleDateString(undefined, { dateStyle: 'full' })}</h4>
        
        {loading ? <div style={{ textAlign: 'center', padding: '2rem' }}><span className="spinner" /></div> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {slots.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "var(--gray-400)", background: "var(--gray-50)", borderRadius: "16px", border: "1px dashed var(--gray-200)" }}>
                <FaCalendarAlt size={32} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p>No reservations scheduled for this day.</p>
              </div>
            ) : slots.map(slot => (
              <div key={slot.id} style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "1.5rem", background: "var(--pink-50)", borderRadius: "16px", border: "1px solid var(--pink-100)" }}>
                <div style={{ width: "140px", fontSize: "0.9rem", fontWeight: 800, color: "var(--pink-600)" }}>
                  {slot.start.split('T')[1]} - {slot.end.split('T')[1]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "1rem", fontWeight: 700 }}>{slot.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray-500)", marginTop: '0.2rem' }}>REF: <span style={{ fontWeight: 700 }}>#{slot.reference}</span></div>
                </div>
                <span className="tag tag-available" style={{ padding: '0.4rem 1rem' }}>{slot.status.toUpperCase()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StudiosView() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStudios = () => {
    setLoading(true);
    getAdminStudios().then(res => setStudios(res.data?.data || res.data || res)).finally(() => setLoading(false));
  };

  useEffect(() => fetchStudios(), []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this studio?")) {
      try {
        await deleteAdminStudio(id);
        fetchStudios();
      } catch (err) {
        alert("Failed to delete studio");
      }
    }
  };

  return (
    <div className="animate-fadeUp">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
        <h2 className="heading-md" style={{ margin: 0 }}>Studio Management</h2>
        <button className="btn btn-primary btn-md" onClick={() => navigate('/admin/dashboard/studios/add')}>
          <FaPlus /> Add New Studio
        </button>
      </div>

      <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid var(--gray-100)", boxShadow: 'var(--shadow-sm)', overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--gray-50)", borderBottom: "1px solid var(--gray-100)" }}>
              <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: 'uppercase', fontWeight: 700 }}>Studio</th>
              <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: 'uppercase', fontWeight: 700 }}>Rate</th>
              <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: 'uppercase', fontWeight: 700 }}>Features</th>
              <th style={{ padding: "1.25rem 1.5rem", textAlign: "right", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: 'uppercase', fontWeight: 700 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem' }}><span className="spinner" /></td></tr> : studios.map(s => (
              <tr key={s.id} style={{ borderBottom: "1px solid var(--gray-50)" }}>
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                    <img src={s.image} alt="" style={{ width: 50, height: 50, borderRadius: "12px", objectFit: "cover", boxShadow: 'var(--shadow-xs)' }} />
                    <div>
                      <div style={{ fontSize: "1rem", fontWeight: 700 }}>{s.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--gray-400)", marginTop: '0.2rem' }}>{s.tagline}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.95rem", fontWeight: 700 }}>{s.price_per_hour} <small>MAD/hr</small></td>
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    {(s.features || []).slice(0, 2).map(f => (
                      <span key={f} className="tag tag-pink" style={{ fontSize: "0.65rem" }}>{f}</span>
                    ))}
                    {(s.features || []).length > 2 && <span className="tag tag-gray" style={{ fontSize: "0.65rem" }}>+{(s.features || []).length - 2}</span>}
                  </div>
                </td>
                <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-soft btn-sm" onClick={() => navigate(`/admin/dashboard/studios/edit/${s.id}`)}>
                      <FaEdit />
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{ color: "var(--reserved)" }} onClick={() => handleDelete(s.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReservationsView() {
  const [res, setRes] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: "", studio_id: "", status: "", search: "" });
  const [studios, setStudios] = useState([]);
  const [selectedResId, setSelectedResId] = useState(null);

  const fetchRes = () => {
    setLoading(true);
    getAdminReservations(filters).then(data => setRes(data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    getAdminStudios().then(res => setStudios(res.data?.data || res.data || res));
  }, []);

  useEffect(() => fetchRes(), [filters]); // eslint-disable-line

  const handleStatus = (id, status) => {
    updateReservationStatus(id, status).then(() => fetchRes());
  };

  return (
    <div className="animate-fadeUp">
      <h2 className="heading-md" style={{ marginBottom: "2.5rem" }}>Reservation Log</h2>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2.5rem", flexWrap: "wrap" }}>
        <input type="date" className="field-input" style={{ width: "180px" }} value={filters.date} onChange={e => setFilters({...filters, date: e.target.value})} />
        <select className="field-input" style={{ width: "200px" }} value={filters.studio_id} onChange={e => setFilters({...filters, studio_id: e.target.value})}>
          <option value="">All Studios</option>
          {studios.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select className="field-input" style={{ width: "160px" }} value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
          <option value="">Any Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <input type="text" className="field-input" placeholder="Search customer or ref..." style={{ flex: 1, minWidth: '200px' }} value={filters.search} onChange={e => setFilters({...filters, search: e.target.value})} />
      </div>

      <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid var(--gray-100)", boxShadow: 'var(--shadow-sm)', overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--gray-50)", borderBottom: "1px solid var(--gray-100)" }}>
              <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: 'uppercase', fontWeight: 700 }}>Ref</th>
              <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: 'uppercase', fontWeight: 700 }}>Customer</th>
              <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: 'uppercase', fontWeight: 700 }}>Studio</th>
              <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: 'uppercase', fontWeight: 700 }}>Status</th>
              <th style={{ padding: "1.25rem 1.5rem", textAlign: "right", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: 'uppercase', fontWeight: 700 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="5" style={{ textAlign: "center", padding: "3rem" }}><span className="spinner" /></td></tr> : res.data.map(r => (
              <tr key={r.id} style={{ borderBottom: "1px solid var(--gray-50)" }}>
                <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.9rem", fontWeight: 800, color: 'var(--pink-500)' }}>#{r.booking_reference}</td>
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700 }}>{r.user?.name || r.customer_name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--gray-400)" }}>{r.user?.email || r.customer_email}</div>
                </td>
                <td style={{ padding: "1.25rem 1.5rem", fontSize: "0.9rem", fontWeight: 500 }}>{r.studio?.name}</td>
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <span className={`tag tag-${r.status === "confirmed" ? "available" : r.status === "cancelled" ? "reserved" : "purple"}`} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                    {r.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", alignItems: 'center' }}>
                    <button className="btn btn-ghost btn-sm" style={{ color: "var(--pink-500)" }} onClick={() => setSelectedResId(r.id)}>
                      <FaInfoCircle /> Details
                    </button>
                    <select 
                      className="field-input"
                      style={{ padding: "0.4rem", height: 'auto', width: '130px', fontSize: '0.75rem' }}
                      value={r.status}
                      onChange={(e) => handleStatus(r.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedResId && <ReservationDetailModal reservationId={selectedResId} onClose={() => setSelectedResId(null)} />}
    </div>
  );
}

function UsersView() {
  const [users, setUsers] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = () => {
    setLoading(true);
    getAdminUsers().then(data => setUsers(data)).finally(() => setLoading(false));
  };

  useEffect(() => fetchUsers(), []);

  const handleToggleAdmin = (id) => {
    toggleUserAdmin(id).then(() => fetchUsers());
  };

  const handleToggleBan = (id) => {
    if (window.confirm("Are you sure you want to change this user's ban status?")) {
      toggleUserBan(id).then(() => fetchUsers());
    }
  };

  return (
    <div className="animate-fadeUp">
      <h2 className="heading-md" style={{ marginBottom: "2.5rem" }}>User Directory</h2>

      <div style={{ background: "#fff", borderRadius: "24px", border: "1px solid var(--gray-100)", boxShadow: 'var(--shadow-sm)', overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--gray-50)", borderBottom: "1px solid var(--gray-100)" }}>
              <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: 'uppercase', fontWeight: 700 }}>Identity</th>
              <th style={{ padding: "1.25rem 1.5rem", textAlign: "left", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: 'uppercase', fontWeight: 700 }}>Permissions</th>
              <th style={{ padding: "1.25rem 1.5rem", textAlign: "right", fontSize: "0.75rem", color: "var(--gray-500)", textTransform: 'uppercase', fontWeight: 700 }}>Administrative Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan="3" style={{ textAlign: "center", padding: "3rem" }}><span className="spinner" /></td></tr> : users.data.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid var(--gray-100)" }}>
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--pink-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pink-500)', fontWeight: 700 }}>
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: "1rem", fontWeight: 700 }}>{u.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--gray-400)" }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1.25rem 1.5rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <span className={`tag ${u.is_admin ? "tag-purple" : "tag-gray"}`} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                      {u.is_admin ? "ADMIN" : "USER"}
                    </span>
                    {u.is_banned && <span className="tag tag-reserved" style={{ padding: '0.4rem 0.8rem', borderRadius: '8px' }}>BANNED</span>}
                  </div>
                </td>
                <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-soft btn-sm" onClick={() => navigate(`/admin/dashboard/users/${u.id}/history`)}>
                      <FaHistory /> View History
                    </button>
                    <button className="btn btn-outline btn-sm" onClick={() => handleToggleAdmin(u.id)}>
                      {u.is_admin ? "Demote" : "Promote"}
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{ color: "var(--reserved)" }} onClick={() => handleToggleBan(u.id)}>
                      <FaBan /> {u.is_banned ? "Revoke Ban" : "Ban User"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main Layout ──────────────────────────────────────────────

export default function AdminDashboard() {
  const location = useLocation();

  return (
    <DashboardLayout>
        <header style={{ marginBottom: "3.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className="heading-lg" style={{ marginBottom: "0.5rem" }}>Admin Console</h1>
            <p className="body-md" style={{ color: 'var(--gray-400)' }}>Platform management & performance monitoring.</p>
          </div>
          <div style={{ display: "flex", gap: "1.25rem", alignItems: 'center' }}>
             <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "1rem", fontWeight: 700 }}>System Admin</div>
                <div style={{ fontSize: "0.75rem", color: "var(--pink-500)", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Control</div>
             </div>
             <div style={{ 
               width: 52, 
               height: 52, 
               borderRadius: "18px", 
               background: "var(--grad-cta)", 
               border: "3px solid #fff", 
               boxShadow: "var(--shadow-md)",
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
               color: '#fff',
               fontSize: '1.25rem'
             }}>
               <FaShieldAlt />
             </div>
          </div>
        </header>

        <Routes>
            <Route index element={<AnalyticsView />} />
            <Route path="schedules" element={<StudioScheduleView />} />
            <Route path="studios" element={<StudiosView />} />
            <Route path="reservations" element={<ReservationsView />} />
            <Route path="users" element={<UsersView />} />
        </Routes>
    </DashboardLayout>
  );
}
