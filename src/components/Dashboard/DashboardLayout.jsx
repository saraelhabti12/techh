import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../App';
import { 
    FaUser, FaCalendarAlt, FaStar, FaBell, FaSignOutAlt, 
    FaPlusSquare, FaThLarge, FaChartBar, FaBuilding, FaUsers 
} from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
    const { user, loading, logoutUser } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="spinner spinner-purple"></div>
            </div>
        );
    }

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const isAdmin = user.is_admin;
    const basePath = isAdmin ? "/admin/dashboard" : "/dashboard";

    const userLinks = [
        { to: "/dashboard", label: "Dashboard", icon: <FaThLarge />, end: true },
        { to: "/dashboard/profile", label: "Profile", icon: <FaUser /> },
        { to: "/dashboard/favorites", label: "Favorites", icon: <FaStar /> },
        { to: "/dashboard/notifications", label: "Notifications", icon: <FaBell /> },
    ];

    const adminLinks = [
        { to: "/admin/dashboard", label: "Analytics", icon: <FaChartBar />, end: true },
        { to: "/admin/dashboard/schedules", label: "Schedules", icon: <FaCalendarAlt /> },
        { to: "/admin/dashboard/studios", label: "Studios", icon: <FaBuilding /> },
        { to: "/admin/dashboard/reservations", label: "Reservations", icon: <FaPlusSquare /> },
        { to: "/admin/dashboard/users", label: "Users", icon: <FaUsers /> },
    ];

    const links = isAdmin ? adminLinks : userLinks;

    return (
        <div className="main-dashboard-layout">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">✦</div>
                    <span>TechStudio {isAdmin && <small style={{ fontSize: '0.6rem', opacity: 0.7 }}>ADMIN</small>}</span>
                </div>
                
                <nav>
                    <ul>
                        {links.map((link) => (
                            <li key={link.to}>
                                <NavLink 
                                    to={link.to} 
                                    end={link.end} 
                                    className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                                >
                                    {link.icon} {link.label}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%' }}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="dashboard-main">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
