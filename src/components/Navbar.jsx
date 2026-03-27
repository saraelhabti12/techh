import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../App"; // Import useAuth context
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { FiUser, FiChevronDown, FiLogOut, FiSettings, FiGrid } from "react-icons/fi";

/**
 * Navbar
 * ─ Sticky, blur-on-scroll header with professional layout.
 * Props:
 *   onBook  () → void   open the reservation wizard
 *   onAuth  (mode) → void  open the auth modal
 */
export default function Navbar({ onBook, onAuth }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, logoutUser, user } = useAuth(); // Use auth context
  const { t } = useTranslation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const publicLinks = [
    { to: "/",        label: "Home" },
    { to: "/offers",  label: "Offers" },
    { to: "/about",   label: t("about") },
  ];

  const dashboardPath = user?.is_admin ? "/admin/dashboard" : "/dashboard";

  const handleNavLinkClick = (action) => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    if (action) action(); // Execute action if provided (e.g., logout)
  };

  return (
    <>
      <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <div
          className="container"
          style={{
            height: 64, display: "flex", // Reduced from 72
            alignItems: "center", justifyContent: "space-between",
          }}
        >
          {/* Brand */}
          <Link to="/" className="nav-logo-text" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <img 
              src="https://chatgpt.com/backend-api/estuary/content?id=file_0000000004807246b759bff43c95eaf4&ts=492758&p=fs&cid=1&sig=bad48e32482ca41ad3b70fc7d5e7921499a305dab5b54b19ea5333074e69d060&v=0" 
              alt="" 
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
            />
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.3px', color: 'var(--gray-900)' }}>
              Tech<span style={{ color: 'var(--pink-500)', fontStyle: 'italic' }}>Studio</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "1rem" }} className="nav-desktop">
            {publicLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => handleNavLinkClick()}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                style={{ fontSize: '0.875rem', padding: '0.5rem 0.8rem' }}
              >
                {label}
              </NavLink>
            ))}
            <LanguageSwitcher />
          </nav>

          {/* CTA + Burger */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            
            {!isAuthenticated ? (
              <button
                className="btn btn-outline btn-sm nav-desktop"
                onClick={() => onAuth('login')}
                style={{ fontWeight: 700, padding: "0.45rem 1.1rem", fontSize: '0.8rem' }}
              >
                Sign In
              </button>
            ) : (
              <div style={{ position: 'relative' }} className="nav-desktop" ref={dropdownRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'var(--gray-50)',
                    border: '1px solid var(--gray-200)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  className="user-btn"
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'var(--grad-cta)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    {user?.name?.charAt(0).toUpperCase() || <FiUser />}
                  </div>
                  <FiChevronDown style={{ 
                    transition: 'transform 0.2s ease',
                    transform: userMenuOpen ? 'rotate(180deg)' : 'none',
                    color: 'var(--gray-600)'
                  }} />
                </button>

                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--gray-100)' }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: 'var(--gray-900)' }}>{user?.name}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gray-500)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                    </div>
                    
                    <Link to={dashboardPath} className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <FiGrid size={16} />
                      Dashboard
                    </Link>
                    
                    <Link to="/dashboard/profile" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                      <FiSettings size={16} />
                      Profile Settings
                    </Link>
                    
                    <button 
                      onClick={() => { logoutUser(); setUserMenuOpen(false); }} 
                      className="dropdown-item logout"
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              className="btn btn-primary btn-sm nav-desktop"
              onClick={onBook}
              style={{ fontWeight: 700, padding: "0.45rem 1.1rem", fontSize: '0.8rem' }}
            >
              {t("book_now")}
            </button>

            {/* Mobile burger */}
            <div className="nav-mobile" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <LanguageSwitcher />
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  background: "var(--white)", border: "1px solid var(--gray-200)",
                  borderRadius: "8px", padding: "0.5rem",
                  display: "flex", flexDirection: "column",
                  gap: "4px", cursor: "pointer",
                  boxShadow: "var(--shadow-xs)"
                }}
                aria-label="Toggle menu"
              >
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    display: "block", width: 18, height: "2px",
                    background: menuOpen ? "var(--gray-900)" : "var(--gray-700)",
                    borderRadius: 2, transition: "all 0.3s var(--ease)",
                    transform: menuOpen
                      ? i === 0 ? "rotate(45deg) translate(4px, 4px)"
                      : i === 2 ? "rotate(-45deg) translate(4px, -4px)"
                      : "scaleX(0)"
                      : "none",
                  }} />
                ))}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className="nav-mobile"
          style={{
            overflow: "hidden",
            transition: "max-height 0.3s var(--ease)",
            maxHeight: menuOpen ? "400px" : "0",
            background: "var(--white)",
            borderBottom: menuOpen ? "1px solid var(--gray-100)" : "none"
          }}
        >
          <div className="nav-mobile-menu" style={{ padding: "1rem" }}>
            {publicLinks.map(({ to, label }) => (
              <NavLink 
                key={to} 
                to={to}
                className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavLinkClick()}
                style={{ fontSize: '0.9rem', padding: '0.75rem 0' }}
              >
                {label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <>
                <NavLink
                  to={dashboardPath}
                  className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavLinkClick()}
                  style={{ fontSize: '0.9rem', padding: '0.75rem 0' }}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/dashboard/profile"
                  className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`}
                  onClick={() => handleNavLinkClick()}
                  style={{ fontSize: '0.9rem', padding: '0.75rem 0' }}
                >
                  Profile Settings
                </NavLink>
                <button
                  onClick={() => { logoutUser(); setMenuOpen(false); }}
                  className="nav-mobile-link"
                  style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", textAlign: "left", width: "100%", color: "var(--reserved)", fontSize: '0.9rem', padding: '0.75rem 0' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); onAuth('login'); }}
                className="nav-mobile-link"
                style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", textAlign: "left", width: "100%", fontSize: '0.9rem', padding: '0.75rem 0' }}
              >
                Sign In
              </button>
            )}
            
            <div style={{ padding: "1rem 0 0.5rem" }}>
              <button
                className="btn btn-primary btn-md"
                style={{ width: "100%", padding: "0.75rem", fontSize: '0.9rem' }}
                onClick={() => { setMenuOpen(false); onBook(); }}
              >
                {t("book_now")}
              </button>
            </div>
          </div>
        </div>
      </header>

      <style>{`
        @media (min-width: 768px) { .nav-mobile { display: none !important; } }
        @media (max-width: 767px) { .nav-desktop { display: none !important; } }
        .nav-link { transition: all 0.2s ease; }
        .nav-mobile-link { display: block; text-decoration: none; color: var(--gray-700); font-weight: 600; border-bottom: 1px solid var(--gray-50); }
        .nav-mobile-link.active { color: var(--pink-500); }
        
        .user-btn:hover {
          border-color: var(--pink-300) !important;
          background: var(--pink-50) !important;
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: var(--white);
          border: 1px solid var(--gray-200);
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
          min-width: 200px;
          z-index: 1000;
          padding: 0.5rem 0;
          overflow: hidden;
          animation: dropdownFade 0.2s var(--ease);
        }

        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: var(--gray-700);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 0.2s ease;
          width: 100%;
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
        }

        .dropdown-item:hover {
          background: var(--pink-50);
          color: var(--pink-500);
        }

        .dropdown-item.logout {
          color: var(--reserved);
          border-top: 1px solid var(--gray-100);
          margin-top: 0.25rem;
          padding-top: 0.75rem;
        }

        .dropdown-item.logout:hover {
          background: var(--reserved-bg);
          color: var(--reserved);
        }
      `}</style>
    </>
  );
}
