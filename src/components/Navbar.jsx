import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../App"; // Import useAuth context

/**
 * Navbar
 * ─ Sticky, blur-on-scroll header with professional layout.
 * Props:
 *   onBook  () → void   open the reservation wizard
 */
export default function Navbar({ onBook }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logoutUser } = useAuth(); // Use auth context

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handle, { passive: true });
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const publicLinks = [
    { to: "/",        label: "Home" },
    { to: "/offers",  label: "Offers" },
    { to: "/about",   label: "About" },
  ];

  const authLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "#logout",    label: "Logout", action: logoutUser },
  ];

  const guestLinks = [
    { to: "/login",   label: "Login" },
    { to: "/register",label: "Register" },
  ];

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
          <Link to="/" className="nav-logo-text">
            <span className="nav-logo-icon">✦</span>
            Tech<em style={{ fontStyle: "italic", color: "var(--pink-500)", paddingRight: "0.2rem" }}>Studio</em>
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
            {isAuthenticated ? (
              <>
                {authLinks.map(({ to, label, action }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => handleNavLinkClick(action)}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    {label}
                  </NavLink>
                ))}
              </>
            ) : (
              <>
                {guestLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => handleNavLinkClick()}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    {label}
                  </NavLink>
                ))}
              </>
            )}
          </nav>

          {/* CTA + Burger */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              className="btn btn-primary btn-sm nav-desktop"
              onClick={onBook}
              style={{ fontWeight: 600, padding: "0.55rem 1.4rem" }}
            >
              Reserve Now
            </button>

            {/* Mobile burger */}
            <button
              className="nav-mobile"
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

        {/* Mobile menu */}
        <div 
          className="nav-mobile"
          style={{
            overflow: "hidden",
            transition: "max-height 0.3s var(--ease)",
            maxHeight: menuOpen ? "400px" : "0",
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
                {authLinks.map(({ to, label, action }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => handleNavLinkClick(action)}
                    className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`}
                  >
                    {label}
                  </NavLink>
                ))}
              </>
            ) : (
              <>
                {guestLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => handleNavLinkClick()}
                    className={({ isActive }) => `nav-mobile-link ${isActive ? 'active' : ''}`}
                  >
                    {label}
                  </NavLink>
                ))}
              </>
            )}
            <button
              className="btn btn-primary btn-md"
              style={{ marginTop: "1rem", width: "100%", padding: "0.85rem" }}
              onClick={() => { setMenuOpen(false); onBook(); }}
            >
              Reserve Now
            </button>
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