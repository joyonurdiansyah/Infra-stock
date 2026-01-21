import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import "../../styles/sidebar.css";

export default function Sidebar({
    collapsed,
    setCollapsed,
    mobileOpen,
    setMobileOpen,
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const menu = [
        { label: "Beranda", icon: "fas fa-home", path: "/dashboard" },
        { label: "PR GP", icon: "fas fa-file-alt", path: "/prgp" },
        { label: "Checklist PR GP", icon: "fas fa-tasks", path: "/prgp-checklist" },
        { label: "Master PR", icon: "fas fa-database", path: "/master-pr" },
    ];

    const activeIndex = menu.findIndex(
        (item) => item.path === location.pathname
    );

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            {/* Overlay */}
            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                id="nav-bar"
                className={`${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""
                    }`}
            >
                <div id="nav-header">
                    <div id="nav-title">
                        <i className="fas fa-codepen me-2"></i>
                        <span>InfraStock</span>
                    </div>

                    <button
                        className="toggle-btn d-none d-lg-block"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <i className="fas fa-bars"></i>
                    </button>

                    <button
                        className="toggle-btn d-lg-none"
                        onClick={() => setMobileOpen(false)}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <hr />

                <div id="nav-content">
                    {activeIndex >= 0 && (
                        <div
                            id="nav-content-highlight"
                            style={{ top: `${activeIndex * 54}px` }}
                        />
                    )}

                    {menu.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-button ${location.pathname === item.path ? "active" : ""
                                }`}
                            onClick={() => setMobileOpen(false)}
                        >
                            <i className={item.icon}></i>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </div>

                <div className="p-3">
                    <button onClick={handleLogout} className="btn btn-danger w-100">
                        <i className="fas fa-sign-out-alt me-2"></i>
                        {!collapsed && "Logout"}
                    </button>
                </div>
            </aside>
        </>
    );
}
