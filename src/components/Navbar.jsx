import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../App"; // Import useAuth context
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

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
  const { isAuthenticated, logoutUser, user } = useAuth(); // Use auth context
  const { t } = useTranslation();

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const publicLinks = [
    { to: "/",        label: "Home" },
    { to: "/offers",  label: "Offers" },
    { to: "/about",   label: t("about") },
  ];

  const dashboardPath = user?.is_admin ? "/admin/dashboard" : "/dashboard";

  const handleNavLinkClick = (action) => {
    setMenuOpen(false);
    if (action) action(); // Execute action if provided (e.g., logout)
  };

  return (
    <>
      <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
        <div
          className="container"
          style={{
            height: 72, display: "flex",
            alignItems: "center", justifyContent: "space-between",
          }}
        >
          {/* Brand */}
          <Link to="/" className="nav-logo-text" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img 
              src="https://chatgpt.com/backend-api/estuary/content?id=file_0000000004807246b759bff43c95eaf4&ts=492758&p=fs&cid=1&sig=bad48e32482ca41ad3b70fc7d5e7921499a305dab5b54b19ea5333074e69d060&v=0" 
              alt="" 
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }} 
            />
            <span style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px', color: 'var(--gray-900)' }}>
              Tech<span style={{ color: 'var(--pink-500)', fontStyle: 'italic' }}>Studio</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "1.5rem" }} className="nav-desktop">
            {publicLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => handleNavLinkClick()}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <NavLink
                to={dashboardPath}
                onClick={() => handleNavLinkClick()}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Dashboard
              </NavLink>
            )}
            <LanguageSwitcher />
          </nav>

          {/* CTA + Burger */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            
            {!isAuthenticated ? (
              <button
                className="btn btn-outline btn-sm nav-desktop"
                onClick={() => onAuth('login')}
                style={{ fontWeight: 600, padding: "0.55rem 1.4rem" }}
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => logoutUser()}
                className="btn btn-soft btn-sm nav-desktop"
                style={{ fontWeight: 600, padding: "0.55rem 1.4rem" }}
              >
                Logout
              </button>
            )}

            <button
              className="btn btn-primary btn-sm nav-desktop"
              onClick={onBook}
              style={{ fontWeight: 600, padding: "0.55rem 1.4rem" }}
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
                  borderRadius: "var(--r-sm)", padding: "0.5rem",
                  display: "flex", flexDirection: "column",
                  gap: "5px", cursor: "pointer",
                  boxShadow: "var(--shadow-xs)"
                }}
                aria-label="Toggle menu"
              >
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    display: "block", width: 20, height: "2px",
                    background: menuOpen ? "var(--gray-900)" : "var(--gray-700)",
                    borderRadius: 2, transition: "all 0.3s var(--ease)",
                    transform: menuOpen
                      ? i === 0 ? "rotate(45deg) translate(5px, 5px)"
                      : i === 2 ? "rotate(-45deg) translate(5px, -5px)"
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
            maxHeight: menuOpen ? "450px" : "0",
          }}
        >
          <div className="nav-mobile-menu">
            {publicLinks.map(({ to, label }) => (
              <NavLink 
                key={to} 
                to={to}
                className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavLinkClick()}
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
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={() => { logoutUser(); setMenuOpen(false); }}
                  className="nav-mobile-link"
                  style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", textAlign: "left", width: "100%", color: "var(--reserved)" }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMenuOpen(false); onAuth('login'); }}
                className="nav-mobile-link"
                style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", textAlign: "left", width: "100%" }}
              >
                Sign In
              </button>
            )}
            
            <div style={{ padding: "1rem 0" }}>
              <button
                className="btn btn-primary btn-md"
                style={{ width: "100%", padding: "0.85rem" }}
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
      `}</style>
    </>
  );
}
