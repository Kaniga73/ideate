import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/Submit.css";

const Submit = () => {
  const navigate = useNavigate();

  const employee = {
    name: "Kavi Priya",
    role: "Software Developer"
  };

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !category || !description) {
      Swal.fire({
        icon: "warning",
        title: "Please fill all fields!",
        confirmButtonColor: "#4ac7f5"
      });
      return;
    }

    // ✅ Create full idea object (same structure as dashboard ideas)
    const newIdea = {
      id: Date.now(), // unique id
      title,
      category,
      description,
      status: "PENDING",
      upvotes: 0,
      pledgedHours: 0,
      totalHours: 100,
      author: employee.name,
      department: employee.role,
      postedAt: "Just now",
    };

    // ✅ Get existing ideas from localStorage
    const existingIdeas =
      JSON.parse(localStorage.getItem("ideas")) || [];

    // ✅ Add new idea
    const updatedIdeas = [newIdea, ...existingIdeas];

    // ✅ Save back to localStorage
    localStorage.setItem("ideas", JSON.stringify(updatedIdeas));

    Swal.fire({
      icon: "success",
      title: "Idea Submitted Successfully!",
      text: "Your idea is now visible in dashboard.",
      confirmButtonColor: "#4ac7f5"
    }).then(() => {
      navigate("/employee-dashboard");
    });
  };

  return (
    <div className="submit-container">
      <div className="submit-card">

        <div className="back-btn" onClick={() => navigate(-1)}>
          ←
        </div>

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
              rows="4"
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