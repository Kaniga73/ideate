import { useState } from "react";
import "../styles/Login.css";
import companyLogo from "../assets/companyLogo.png";

export default function LoginPage() {

  const [role, setRole] = useState("employee");
  const [showPass, setShowPass] = useState(false);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const idLabel = role === "admin" ? "Admin ID" : "Employee ID";
  const idPlaceholder =
    role === "admin" ? "Enter Admin ID" : "Enter Employee ID";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `http://localhost:3001/users?loginId=${loginId}&password=${password}&role=${role}`
      );

      const data = await response.json();

      if (data.length === 0) {
        setError("Invalid credentials");
        return;
      }

      const user = data[0];

      alert(`Welcome ${user.name} `);
      console.log("Logged in user:", user);

      // Later we will redirect to dashboard

    } catch (err) {
      setError("Server not running");
    }
  };

  return (
    <div className="page">
      <div className="card">

        {/* LEFT SECTION */}
        <div className="left">
          <div className="brand">
            <img
              src={companyLogo}
              alt="Company Logo"
              className="companylogo"
            />
            <h1>
              Where <span className="greatmindstext">Great Minds</span> Meet!
            </h1>
            <p className="logintext">
              Unlocking the collective intelligence of our organization to drive meaningful innovation and sustainable growth.
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="right">

          {/* Sliding Switch */}
          <div className="switch">
            <div className={`slider ${role}`} />
            <button type="button" onClick={() => setRole("employee")}>
              Employee
            </button>
            <button type="button" onClick={() => setRole("admin")}>
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            <label>{idLabel}</label>
            <input
              type="text"
              placeholder={idPlaceholder}
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
            />

            <label>Password</label>
            <div className="password-box">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button className="login-btn">Login</button>

          </form>
        </div>
      </div>
    </div>
  );
}
