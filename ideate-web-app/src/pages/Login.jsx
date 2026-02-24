import { useState } from "react";
import "../styles/Login.css";
import companyLogo from "../assets/companyLogo.png";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {
   const navigate = useNavigate(); 

  const [role, setRole] = useState("employee");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const idLabel = role === "admin" ? "Admin ID" : "Employee ID";
  const idPlaceholder =
    role === "admin" ? "Enter Admin ID" : "Enter Employee ID";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanLoginId = loginId.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      // ✅ fetch only by role
      const response = await fetch(
        `http://127.0.0.1:3001/users?role=${role}`
      );

      const users = await response.json();
      console.log("Users from server:", users);

      // ✅ check manually
      const matchedUser = users.find(
        (user) =>
          user.loginId.toLowerCase() === cleanLoginId &&
          user.password === cleanPassword
      );

      if (!matchedUser) {
        setError("Invalid credentials");
        return;
      }
      localStorage.setItem("user", JSON.stringify(matchedUser));
      setSuccessMsg(`Welcome ${matchedUser.name}!`);

        setTimeout(() => {
      if (matchedUser.role === "employee") {
      navigate("/employee-dashboard");
        } 
    else if (matchedUser.role === "admin") {
    navigate("/admin-dashboard");
}
    }, 1000);

    } catch (err) {
      console.error("FETCH ERROR:", err);
      setError("Server not running");
    }
  };

  return (
    <div className="page">
      {successMsg && <div className="success-toast">{successMsg}</div>}

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
                type="password"
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