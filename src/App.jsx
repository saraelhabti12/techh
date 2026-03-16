import { useState, useCallback, createContext, useContext, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./styles/globals.css";

import Navbar          from "./components/Navbar";
import Footer          from "./components/Footer";
import Calendar        from "./components/Calendar";
import StudioList      from "./components/StudioList";
import ReservationForm from "./components/ReservationForm";
import AboutCompany    from "./components/AboutCompany";
import OffersPage      from "./pages/OffersPage";
import StudioPage      from "./pages/StudioPage";

// Auth related imports
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import Dashboard       from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { getUser } from "./api/authApi";
import ReservationDetailsPage from "./pages/ReservationDetailsPage"; // New import

// ── Auth Context ──────────────────────────────────────────────
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// ── Toast helper ──────────────────────────────────────────────
function Toast({ message, onDone }) {
  useState(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); });
  return (
    <div style={{
      position: "fixed", bottom: "1.75rem", right: "1.75rem", zIndex: 900,
      background: "#fff", borderLeft: "4px solid var(--available)",
      borderRadius: "var(--r-md)", padding: "0.9rem 1.3rem",
      fontSize: "0.83rem", boxShadow: "var(--shadow-md)",
      animation: "fadeUp 0.3s ease", display: "flex", alignItems: "center", gap: "0.5rem",
      maxWidth: 320,
    }}>
      <span style={{ fontSize: "1rem" }}>✓</span> {message}
    </div>
  );
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const userData = await getUser();
          setUser(userData.user);
        } catch (err) {
          console.error("Failed to fetch user on mount:", err);
          localStorage.removeItem("authToken");
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const loginUser = useCallback(async (token, userData) => {
    localStorage.setItem("authToken", token);
    setUser(userData);
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const authState = { user, setUser, loading, loginUser, logoutUser, isAuthenticated: !!user };

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const [selectedDate,   setSelectedDate]   = useState(null);
  const [availability,   setAvailability]   = useState(null);
  const [showReservation, setShowReservation] = useState(false);
  const [preStudio,      setPreStudio]      = useState(null);
  const [toast,          setToast]          = useState(null);
  const navigate = useNavigate();

  const { isAuthenticated, loading: authLoading } = useAuth(); // Use auth context here
  const location = useLocation();

  const openBook = useCallback((studio = null) => {
    if (!isAuthenticated) {
      navigate("/login");
      setToast("Please log in to make a reservation.");
      return;
    }
    setPreStudio(studio);
    setShowReservation(true);
  }, [isAuthenticated, navigate]);

  const closeBook = useCallback(() => {
    setShowReservation(false);
    setPreStudio(null);
  }, []);

  useEffect(() => {
    // Support opening reservation intent from other pages (e.g., Dashboard → Home)
    if (location.state?.openReservation && !showReservation) {
      openBook(location.state.preselectedStudio ?? null);

      // Clear the state so this doesn't re-trigger on back/forward
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, showReservation, navigate, openBook]);

  return (
    <>
      {/* ── Navigation ── */}
      <Navbar onBook={openBook} />

      <Routes>
        <Route path="/" element={
          <>
            {/* ── Homepage Content (Calendar + Studio List) ── */}
            <section id="homepage-content" className="section" style={{ background: "var(--gray-50)" }}>
              <div>
                {/* Two-col: Calendar + Studios */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "320px 1fr", // Calendar fixed width on left
                  gap: "2.5rem",
                  alignItems: "start",
                }}>
                  {/* Calendar (sticky on desktop) */}
                  <div style={{ position: "sticky", top: "76px" }}>
                    <Calendar
                      selectedDate={selectedDate}
                      onSelectDate={setSelectedDate}
                      onAvailabilityLoad={setAvailability}
                    />
                  </div>

                  {/* Studio grid */}
                  <StudioList
                    selectedDate={selectedDate}
                    availability={availability}
                    onBook={openBook}
                  />
                </div>
              </div>

              {/* Responsive collapse to single col */}
              <style>{`
                @media (max-width: 900px) {
                  #homepage-content .container > div:last-child {
                    grid-template-columns: 1fr !important;
                  }
                  #homepage-content .container > div:last-child > div:first-child {
                    position: static !important;
                  }
                }
              `}</style>
            </section>
          </>
        } />
        {/* Route for Offers page, accessible via Navbar */}
        <Route path="/offers" element={<OffersPage />} />
        {/* Route for About page, accessible via Navbar */}
        <Route path="/about" element={<AboutCompany />} />
        <Route path="/studio/:id" element={<StudioPage />} />
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Nested Dashboard Routes */}
        <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/reservations/:bookingReference" element={<ProtectedRoute><ReservationDetailsPage /></ProtectedRoute>} />
        {/* Route to trigger reservation modal */}
        <Route path="/reserve-studio" element={<ReservationTrigger openBook={openBook} navigate={navigate} />} />
      </Routes>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Reservation Modal ── */}
      {showReservation && (
        <ReservationForm
          preselectedStudio={preStudio}
          preselectedDate={selectedDate}
          onClose={closeBook}
        />
      )}

      {/* ── Toast ── */}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}

// New component to handle the reservation trigger logic
const ReservationTrigger = ({ openBook, navigate }) => {
  useEffect(() => {
    openBook();
    navigate('/', { replace: true, state: { openReservation: true } });
  }, [openBook, navigate]);

  return null; // This component doesn't render anything visible
};