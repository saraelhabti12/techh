import { useState, useCallback, createContext, useContext, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./styles/globals.css";

import Navbar          from "./components/Navbar";
import Footer          from "./components/Footer";
import HomeLayout      from "./pages/HomeLayout";
import ReservationForm from "./components/ReservationForm";
import AboutCompany    from "./components/AboutCompany";
import OffersPage      from "./pages/OffersPage";
import StudioPage      from "./pages/StudioPage";
import AuthModal       from "./components/AuthModal";

// Auth related imports
import Login           from "./pages/Login";
import Register        from "./pages/Register";
import Dashboard       from "./pages/Dashboard";
import ProtectedRoute  from "./components/ProtectedRoute";
import AdminRoute      from "./components/AdminRoute";
import AdminDashboard  from "./pages/AdminDashboard";
import AdminStudioForm from "./pages/AdminStudioForm";
import AdminUserHistory from "./pages/AdminUserHistory";
import { getUser }     from "./api/authApi";
import ReservationDetailsPage from "./pages/ReservationDetailsPage";

// ── Auth Context ──────────────────────────────────────────────
const AuthContext = createContext(null);
export { AuthContext };
export const useAuth = () => useContext(AuthContext);

// ── Toast helper ──────────────────────────────────────────────
function Toast({ message, onDone }) {
  useState(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); });
  return (
    <div style={{
      position: "fixed", bottom: "1.75rem", right: "1.75rem", zIndex: 1100,
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
          setUser(userData.user || userData.data || userData);
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
    navigate("/");
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
  const [showReservation, setShowReservation] = useState(false);
  const [preStudio,      setPreStudio]      = useState(null);
  const [toast,          setToast]          = useState(null);
  
  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const navigate = useNavigate();
  const { t } = useTranslation();

  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const openBook = useCallback((studio = null) => {
    if (!isAuthenticated) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }
    setPreStudio(studio);
    setShowReservation(true);
  }, [isAuthenticated]);

  const closeBook = useCallback(() => {
    setShowReservation(false);
    setPreStudio(null);
  }, []);

  const handleAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  useEffect(() => {
    if (location.state?.openReservation && !showReservation) {
      openBook(location.state.preselectedStudio ?? null);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, showReservation, navigate, openBook]);

  return (
    <>
      <Navbar onBook={openBook} onAuth={handleAuth} />

      <Routes>
        <Route path="/" element={<HomeLayout openBook={openBook} />} />
        <Route path="/offers" element={<OffersPage />} />
        <Route path="/about" element={<AboutCompany />} />
        <Route path="/studio/:id" element={<StudioPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/reservations/:bookingReference" element={<ProtectedRoute><ReservationDetailsPage /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
          <Route path="/admin/dashboard/studios/add" element={<AdminStudioForm />} />
          <Route path="/admin/dashboard/studios/edit/:id" element={<AdminStudioForm />} />
          <Route path="/admin/dashboard/users/:id/history" element={<AdminUserHistory />} />
        </Route>

        <Route path="/reserve-studio" element={<ReservationTrigger openBook={openBook} navigate={navigate} />} />
      </Routes>

      <Footer />

      {showReservation && (
        <ReservationForm
          preselectedStudio={preStudio}
          preselectedDate={selectedDate}
          onClose={closeBook}
        />
      )}

      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          initialMode={authMode}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}

const ReservationTrigger = ({ openBook, navigate }) => {
  useEffect(() => {
    openBook();
    navigate('/', { replace: true, state: { openReservation: true } });
  }, [openBook, navigate]);
  return null;
};
