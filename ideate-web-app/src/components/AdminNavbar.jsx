import "../Styles/AdminNavbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function AdminNavbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  function getInitials(name = "") {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function avatarColor(name = "") {
    const colors = ["#ef4444", "#7c3aed", "#0ea5e9", "#059669", "#f59e0b"];
    return colors[name.charCodeAt(0) % colors.length];
  }

  return (
    <nav className="admin-navbar">
      
      {/* Logo */}
      <div
        className="admin-navbar__logo"
        onClick={() => navigate("/admin-dashboard")}
      >
        <img src={logo} alt="Ideate Logo" className="admin-navbar__logo-img" />
      </div>

      {/* Center Links */}
      <ul className="admin-navbar__links">

        {/* Dashboard */}
        <li
          className={`admin-navbar__link ${
            location.pathname === "/admin-dashboard"
              ? "admin-navbar__link--active"
              : ""
          }`}
          onClick={() => navigate("/admin-dashboard")}
        >
          Dashboard
        </li>

      {/* My Activity */}
<li
  className={`admin-navbar__link ${
    location.pathname === "/my-activity"
      ? "admin-navbar__link--active"
      : ""
  }`}
  onClick={() => navigate("/my-activity")}
>
  My Activity
</li>

     

     

      </ul>

      {/* Right Side */}
      <div className="admin-navbar__right">
      <div
          className="admin-navbar__user"
          onClick={() => navigate("/my-activity")}
        >
          <div>
            <div className="admin-navbar__user-name">
              {user?.name || "Admin"}
            </div>
            <div className="admin-navbar__user-role">
              {user?.role || "Administrator"}
            </div>
          </div>

          <div
            className="admin-navbar__avatar"
            style={{
              backgroundColor: avatarColor(user?.name || "A"),
              width: 38,
              height: 38,
              fontSize: 38 * 0.36,
            }}
          >
            {getInitials(user?.name || "Admin")}
          </div>
        </div>
      </div>
    </nav>
  );
}