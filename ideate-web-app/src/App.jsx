import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Submit from "./pages/Submit";
import Profile from "./pages/Profile";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/submit-idea" element={<Submit />} />
          <Route path="/profile" element={<Profile />} />
        
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
