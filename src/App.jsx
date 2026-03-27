import { useState, useCallback, createContext, useContext, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./styles/globals.css";
import "./styles/Layout.css";

import Navbar          from "./components/Navbar";
import Footer          from "./components/Footer";
import HomeLayout      from "./pages/HomeLayout";
import ReservationForm from "./components/ReservationForm";
import AboutCompany    from "./components/AboutCompany";
import OffersPage      from "./pages/OffersPage";
import StudioPage      from "./pages/StudioPage";
import AuthModal       from "./components/AuthModal";
import Sidebar         from "./components/Sidebar";

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
import { getFavorites, addFavorite, removeFavorite } from "./api/favoriteApi";
import { getNotifications, markRead, markAllRead } from "./api/notificationApi";
import ReservationDetailsPage from "./pages/ReservationDetailsPage";

// ── Auth Context ──────────────────────────────────────────────
const AuthContext = createContext(null);
export { AuthContext };
export const useAuth = () => useContext(AuthContext);

// ── Favorites Context ─────────────────────────────────────────
const FavoritesContext = createContext(null);
export { FavoritesContext };
export const useFavorites = () => useContext(FavoritesContext);

// ── Notifications Context ─────────────────────────────────────
const NotificationsContext = createContext(null);
export { NotificationsContext };
export const useNotifications = () => useContext(NotificationsContext);

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

function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }
    try {
      const response = await getFavorites();
      setFavorites(response.data || []);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (studioId) => {
    if (!isAuthenticated) return false;

    const isFav = favorites.some(f => f.id === studioId);
    try {
      if (isFav) {
        await removeFavorite(studioId);
        setFavorites(prev => prev.filter(f => f.id !== studioId));
      } else {
        await addFavorite(studioId);
        // Optimistically update or re-fetch. Let's re-fetch to get full studio data if needed, 
        // or just update if we have the data. For now, re-fetch is safer.
        fetchFavorites();
      }
      return true;
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      return false;
    }
  };

  const isFavorite = (studioId) => favorites.some(f => f.id === studioId);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, fetchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }
    try {
      const response = await getNotifications();
      setNotifications(response.data || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
    // Refresh every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkRead = async (id) => {
    try {
      await markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markRead: handleMarkRead, markAllRead: handleMarkAllRead, fetchNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <NotificationsProvider>
          <AppContent />
        </NotificationsProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const [selectedDate,   setSelectedDate]   = useState(null);
  const [showReservation, setShowReservation] = useState(false);
  const [preStudio,      setPreStudio]      = useState(null);
  const [toast,          setToast]          = useState(null);
  
  // Sidebar State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availability, setAvailability] = useState(null);

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
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarExpanded(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (location.state?.openReservation && !showReservation) {
      openBook(location.state.preselectedStudio ?? null);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, showReservation, navigate, openBook]);

  const isHomePage = location.pathname === '/';

  return (
    <div className="app-container">
      <div className="navbar-wrapper">
        <Navbar onBook={openBook} onAuth={handleAuth} />
      </div>
      
      <div className="app-layout">
        {/* GLOBAL SIDEBAR */}
        <Sidebar 
          isExpanded={isSidebarExpanded}
          onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onAvailabilityLoad={setAvailability}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          showCards={isHomePage}
        />

        <div className="main-content-wrapper">
          <div className="page-content">
            <Routes>
              <Route path="/" element={
                <HomeLayout 
                  openBook={openBook} 
                  onAuth={handleAuth}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  availability={availability}
                  setAvailability={setAvailability}
                />
              } />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/about" element={<AboutCompany />} />
              <Route path="/studio/:id" element={<StudioPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/dashboard/*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/reservations/:bookingReference" element={<ProtectedRoute><ReservationDetailsPage /></ProtectedRoute>} />
              
              <Route element={<AdminRoute />}>
                <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
                <Route path="/admin/dashboard/studios/add" element={<AdminStudioForm />} />
                <Route path="/admin/dashboard/studios/edit/:id" element={<AdminStudioForm />} />
                <Route path="/admin/dashboard/users/:id/history" element={<AdminUserHistory />} />
              </Route>

              <Route path="/reserve-studio" element={<ReservationTrigger openBook={openBook} navigate={navigate} />} />
            </Routes>
          </div>
        </div>
      </div>

      <div className="footer-wrapper">
        <Footer />
      </div>

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
    </div>
  );
}

const ReservationTrigger = ({ openBook, navigate }) => {
  useEffect(() => {
    openBook();
    navigate('/', { replace: true, state: { openReservation: true } });
  }, [openBook, navigate]);
  return null;
};
