import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Submit from "./pages/Submit";
import Profile from "./pages/Profile";
import IdeaDetails from "./pages/IdeaDetails";
import AdminDashboard from "./pages/AdminDashboard";
import MyActivity from "./pages/MyActivity";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
          <Route path="/submit-idea" element={<Submit />} />
          <Route path="/profile" element={<Profile />} />
          {/* idea detail view */}
          <Route path="/ideas/:id" element={<IdeaDetails />} />
           <Route path="/admin-dashboard" element={<AdminDashboard />} />
           <Route path="/my-activity" element={<MyActivity />} />
      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
