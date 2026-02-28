import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AdminIdeaDetails.css";

const AdminIdeaDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [idea, setIdea] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const ideas = JSON.parse(localStorage.getItem("ideas")) || [];
    const selectedIdea = ideas.find((idea) => idea.id === Number(id));
    setIdea(selectedIdea);
  }, [id]);

  const updateStatus = (status) => {
    const ideas = JSON.parse(localStorage.getItem("ideas")) || [];

    const updatedIdeas = ideas.map((idea) =>
      idea.id === Number(id)
        ? { ...idea, status: status }
        : idea
    );

    localStorage.setItem("ideas", JSON.stringify(updatedIdeas));
    alert(`Idea ${status}`);
    navigate("/admin-dashboard");
  };

  const sendComment = () => {
    if (!comment.trim()) {
      alert("Please enter comment");
      return;
    }

    const ideas = JSON.parse(localStorage.getItem("ideas")) || [];

    const updatedIdeas = ideas.map((idea) =>
      idea.id === Number(id)
        ? { ...idea, adminComment: comment }
        : idea
    );

    localStorage.setItem("ideas", JSON.stringify(updatedIdeas));
    alert("Comment Sent!");
    setComment("");
  };

  if (!idea) return <h2>Idea Not Found</h2>;

  return (
    <div className="admin-details-container">
      
      {/* Top Section */}
      <div className="idea-card">

        {/* LEFT SIDE - DETAILS */}
        <div className="idea-left">
          <h2>{idea.title}</h2>
          <p><strong>Description:</strong> {idea.description}</p>
          <p><strong>Category:</strong> {idea.category}</p>
          <p><strong>Submitted By:</strong> {idea.submittedBy}</p>
          <p><strong>Status:</strong> {idea.status || "Pending"}</p>
        </div>

        {/* RIGHT SIDE - BUTTONS */}
        <div className="idea-right">
          <button 
            className="approve-btn"
            onClick={() => updateStatus("Approved")}
          >
            Approve
          </button>

          <button 
            className="reject-btn"
            onClick={() => updateStatus("Rejected")}
          >
            Reject
          </button>
        </div>

      </div>

      {/* COMMENT CARD */}
      <div className="comment-card">
        <h3>Send Comment to Employee</h3>

        <textarea
          placeholder="Enter your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button onClick={sendComment} className="comment-btn">
          Send Comment
        </button>
      </div>

    </div>
  );
};

export default AdminIdeaDetails;