import { useState } from "react";
import "../styles/Login.css";
import companyLogo from "../assets/companyLogo.png";


export default function LoginPage() {

  const [role, setRole] = useState("employee");
  const [showPass, setShowPass] = useState(false);

  const idLabel = role === "admin" ? "Admin ID" : "Employee ID";
  const idPlaceholder = role === "admin"
    ? "Enter Admin ID"
    : "Enter Employee ID";


  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Login as ${role}`);
  };

  return (
    <div className="page">

      <div className="card">

        {/* LEFT SECTION */}
        <div className="left">
          <div className="brand">
            <img src={companyLogo} alt="Company Logo" className="companylogo" />
            <h1 >
              Where <span className="greatmindstext">Great Minds</span> Meet!
            </h1>
            <p className="logintext">Unlocking the collective intelligence of our organization to drive meaningful innovation and sustainable growth.</p>

          </div>
        </div>


        {/* RIGHT SECTION */}
        <div className="right">


          {/* Sliding Switch */}
          <div className="switch">
            <div className={`slider ${role}`} />
            <button onClick={() => setRole("employee")}>Employee</button>
            <button onClick={() => setRole("admin")}>Admin</button>
          </div>

          <form onSubmit={handleSubmit}>
            <label>{idLabel}</label>
            <input type="text" placeholder={idPlaceholder} required />

            <label>Password</label>
            <div className="password-box">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter password"
                required
              />
            </div>



            <button className="login-btn" >Login</button>

          </form>

        </div>

      </div>

    </div>
  );
}
