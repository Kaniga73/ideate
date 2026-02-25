import "../Styles/Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";

import logo from "../assets/logo.png"; 

export default function Navbar({ user }) {

  const navigate = useNavigate();
  const location = useLocation(); //get current route

  function getInitials(name = "") {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }

  function avatarColor(name = "") {
    const colors = ["#4f8ef7", "#7c3aed", "#0891b2", "#059669", "#d97706"];
    return colors[name.charCodeAt(0) % colors.length];
  }

  return (
    <nav className="navbar">
      
      {/* Logo */}
      <div className="navbar__logo">
        <div className="navbar__logo-icon">
          <img src={logo} alt="Ideate Logo" className="navbar__logo-img" />
        </div>
        
      </div>

      {/* Center Links */}
      <ul className="navbar__links">

        {/* Dashboard */}
        <li
          className={`navbar__link ${
            location.pathname === "/employee-dashboard"
              ? "navbar__link--active"
              : ""
          }`}
          onClick={() => navigate("/employee-dashboard")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          Dashboard
        </li>

        {/* Profile */}
        <li
  className={`navbar__link ${
    location.pathname === "/profile"
      ? "navbar__link--active"
      : ""
  }`}
  onClick={() => navigate("/profile")}
>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          Contributions
        </li>

      </ul>

      {/* Right Side */}
      <div className="navbar__right">
              <div
                className="navbar__user"
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
>
          <div>
            <div className="navbar__user-name">{user?.name || "Guest"}</div>
            <div className="navbar__user-role">{user?.role || ""}</div>
          </div>

          <div
          className="navbar__avatar"
          onClick={() => navigate("/profile")}
          style={{
            backgroundColor: avatarColor(user?.name || "G"),
            width: 38,
            height: 38,
            fontSize: 38 * 0.36,
            cursor: "pointer",
          }}
        >
          {getInitials(user?.name)}
        </div>
        </div>
      </div>
    </nav>
  );
}