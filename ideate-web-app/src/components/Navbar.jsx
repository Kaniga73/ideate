import "../Styles/Navbar.css";

import logo from "../assets/logo.png"; 


export default function Navbar({ user = { name: "Alex Morgan", role: "Product Lead" } }) {

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
    <div className="Logo-text">
      <h1 className="font">ideate</h1>

    </div>
    
  </div>

          {/* center */}
        
         <ul className="navbar__links">
  <li className="navbar__link navbar__link--active">
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
  <li className="navbar__link">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
    Profile
  </li>
</ul>
         


      {/* Right Side */}
      <div className="navbar__right">
       

        <div className="navbar__user">
          <div>
            <div className="navbar__user-name">{user.name}</div>
            <div className="navbar__user-role">{user.role}</div>
          </div>
          <div
            className="navbar__avatar"
            style={{
              backgroundColor: avatarColor(user.name),
              width: 38,
              height: 38,
              fontSize: 38 * 0.36,
            }}
          >
            {getInitials(user.name)}
          </div>
        </div>
      </div>
    </nav>
  );
}