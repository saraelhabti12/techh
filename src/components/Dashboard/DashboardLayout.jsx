import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../App';
import { FaUser, FaCalendarAlt, FaStar, FaBell, FaSignOutAlt, FaPlusSquare, FaThLarge } from 'react-icons/fa';

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

    return (
        <div className="main-dashboard-layout">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">✦</div>
                    <span>TechStudio</span>
                </div>
                
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/dashboard" end className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                                <FaThLarge /> Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/profile" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                                <FaUser /> Profile
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/favorites" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                                <FaStar /> Favorites
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/dashboard/notifications" className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
                                <FaBell /> Notifications
                            </NavLink>
                        </li>
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
