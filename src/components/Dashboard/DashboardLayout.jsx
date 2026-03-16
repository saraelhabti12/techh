import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../App';
import { FaUser, FaCalendarAlt, FaStar, FaBell, FaSignOutAlt, FaPlusSquare } from 'react-icons/fa'; // Import icons

const DashboardLayout = ({ children }) => {
    const { user, loading, logoutUser } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div>
                <p>Loading user data...</p>
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
                <div>TechStudio</div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/dashboard">
                                <FaCalendarAlt /> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/profile">
                                <FaUser /> Profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/favorites">
                                <FaStar /> Favorites
                            </Link>
                        </li>
                        <li>
                            <Link to="/dashboard/notifications">
                                <FaBell /> Notifications
                            </Link>
                        </li>
                        <li>
                            <Link to="/reserve-studio">
                                <FaPlusSquare /> Reserve Studio
                            </Link>
                        </li>
                        <li>
                            <button onClick={handleLogout}>
                                <FaSignOutAlt /> Logout
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
