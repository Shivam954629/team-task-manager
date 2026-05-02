import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <nav
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          {/* Logo */}
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "white",
                }}
              >
                T
              </div>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "white",
                  letterSpacing: "-0.5px",
                }}
              >
                TaskFlow
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              to="/dashboard"
              style={{
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: isActive("/dashboard")
                  ? "#667eea"
                  : "rgba(255,255,255,0.85)",
                background: isActive("/dashboard") ? "white" : "transparent",
                transition: "all 0.2s",
              }}
            >
              Dashboard
            </Link>
            <Link
              to="/projects"
              style={{
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: isActive("/projects")
                  ? "#667eea"
                  : "rgba(255,255,255,0.85)",
                background: isActive("/projects") ? "white" : "transparent",
                transition: "all 0.2s",
              }}
            >
              Projects
            </Link>
          </div>

          {/* User + logout */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "600",
                color: "white",
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.9)",
                fontWeight: "500",
              }}
            >
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
