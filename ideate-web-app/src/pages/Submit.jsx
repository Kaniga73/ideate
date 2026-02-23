import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Submit.css";

const Submit = () => {
  const navigate = useNavigate();

  const employee =
    JSON.parse(localStorage.getItem("user")) ||
    { name: "Guest", role: "Employee" };

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !category || !description) {
      Swal.fire({
        icon: "warning",
        title: "Please fill all fields!",
        confirmButtonColor: "#4ac7f5",
      });
      return;
    }

    /* ✅ NEW IDEA OBJECT */
    const newIdea = {
      id: Date.now(),
      title,
      category,
      description,
      author: employee.name,     // ✅ IMPORTANT
      department: employee.role, // ✅ IMPORTANT
      status: "PENDING",
      upvotes: 0,
      pledgedHours: 0,
      totalHours: 100,
      postedAt: new Date().toLocaleDateString(),
    };

    /* GET EXISTING IDEAS */
    const existingIdeas =
      JSON.parse(localStorage.getItem("ideas")) || [];

    /* SAVE UPDATED LIST */
    const updatedIdeas = [newIdea, ...existingIdeas];
    localStorage.setItem("ideas", JSON.stringify(updatedIdeas));

    Swal.fire({
      icon: "success",
      title: "Idea Submitted Successfully!",
      text: "Your idea is now visible in dashboard.",
      confirmButtonColor: "#4ac7f5",
    }).then(() => {
      navigate("/employee-dashboard");
    });
  };

  return (
    <div className="submit-container">

      {/* Back Button */}
      <div className="back-btn-outside" onClick={() => navigate(-1)}>
        ←
      </div>

      <div className="submit-card">

        <h2 className="greatminds-text">Submit New Idea</h2>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Idea Title</label>
            <input
              type="text"
              placeholder="Enter idea title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="8"
              placeholder="Describe your idea..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-btn">
            Submit Idea
          </button>

        </form>
      </div>
    </div>
  );
};

export default Submit;