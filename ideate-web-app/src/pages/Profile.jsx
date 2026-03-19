import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../Styles/Profile.css";

export default function Profile() {

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    { name: "Guest", role: "Employee" };

  const [activeTab, setActiveTab] = useState("reviewed");
  const [ideas, setIdeas] = useState([]);

  const pendingIdeas = ideas.filter(
    (idea) => idea.status?.toUpperCase() === "PENDING"
  );

  const approvedIdeas = ideas.filter(
    (idea) => idea.status?.toUpperCase() === "APPROVED"
  );

  const reviewedIdeas = ideas.filter(
    (idea) => idea.status?.toUpperCase() === "REVIEWED"
  );

  useEffect(() => {
    const savedIdeas =
      JSON.parse(localStorage.getItem("ideas")) || [];
    setIdeas(savedIdeas);
  }, []);

  const myIdeas = ideas.filter(
    (idea) =>
      idea.author &&
      idea.author.toLowerCase() === user.name.toLowerCase()
  );

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  // ✅ status badge helper
  const statusClass = {
    APPROVED: "status-badge--approved",
    PENDING: "status-badge--pending",
    REJECTED: "status-badge--rejected",
  };

  const renderStatusBadge = (status) => {
    const key = status?.toUpperCase() || "PENDING";
    return (
      <span className={`status-badge ${statusClass[key] || "status-badge--pending"}`}
        style={{ justifySelf: "start", width: "fit-content" }}
      >
        {key.charAt(0) + key.slice(1).toLowerCase()}
      </span>
    );
  };

  return (
    <div className="profile-page">

      <Navbar user={user} />

      <div className="profile-layout">

        {/* LEFT */}
        <aside className="profile-sidebar">

          <div className="profile-card">
            <div className="profile-card-hero">
              <div className="profile-avatar-ring">
                <div className="profile-avatar-img">
                  {initials}
                  <span className="profile-online-dot" />
                </div>
              </div>
            </div>

            <div className="profile-info">
              <div className="profile-name">{user.name}</div>
              <div className="profile-role">{user.role}</div>
            </div>
          </div>

          <div className="notif-card">
            <div className="notif-header">
              <div>Notifications</div>
              <span className="notif-count">0</span>
            </div>

            <div className="notif-empty">
              <div className="notif-empty-icon">🔔</div>
              <p>You're all caught up!</p>
              <p>No new notifications right now.</p>
            </div>
          </div>

        </aside>

        {/* RIGHT */}
        <main className="profile-main">
          {/* Metrics */}
          <div className="metrics-row">

            <div className="metric-card metric-blue">
              <div>
                <div className="metric-label">Pending Reviews</div>
                <div className="metric-value">{pendingIdeas.length}</div>
              </div>
            </div>

            <div className="metric-card">
              <div>
                <div className="metric-label">Total Ideas</div>
                <div className="metric-value">{ideas.length}</div>
              </div>
            </div>

            <div className="metric-card">
              <div>
                <div className="metric-label">My Submissions</div>
                <div className="metric-value">{myIdeas.length}</div>
              </div>
            </div>

          </div>

          {/* TABLE */}
          <div className="tabs-card">

            <div className="tabs-nav">
              <button
                className={`tab-btn ${activeTab === "reviewed" ? "active" : ""}`}
                onClick={() => setActiveTab("reviewed")}
              >
                Ideas I've Reviewed
              </button>

              <button
                className={`tab-btn ${activeTab === "submissions" ? "active" : ""}`}
                onClick={() => setActiveTab("submissions")}
              >
                My Submissions
              </button>
            </div>

            <div className="ideas-table">

              {/* ✅ Added Status column to header */}
              <div className="ideas-table-head" style={{ gridTemplateColumns: "3fr 2fr 1fr 1fr" }}>
                <div>Idea Title</div>
                <div>Submitted By</div>
                <div>Status</div>  {/* ✅ new */}
                <div>Date</div>
              </div>

              {/* ALL IDEAS */}
              {activeTab === "reviewed" &&
                ideas.map((idea, i) => (
                  <div key={i} className="ideas-row" style={{ gridTemplateColumns: "3fr 2fr 1fr 1fr" }}>
                    <div>
                      <div className="idea-title">{idea.title}</div>
                      <div className="idea-branch">{idea.category || idea.department}</div>
                    </div>

                    <div className="idea-submitter">{idea.author}</div>

                    {/* ✅ Status badge */}
                    {renderStatusBadge(idea.status)}

                    <div className="idea-date">{idea.postedAt || "—"}</div>
                  </div>
                ))}

              {/* MY IDEAS ONLY */}
              {activeTab === "submissions" &&
                myIdeas.map((idea, i) => (
                  <div key={i} className="ideas-row" style={{ gridTemplateColumns: "3fr 2fr 1fr 1fr" }}>
                    <div>
                      <div className="idea-title">{idea.title}</div>
                      <div className="idea-branch">{idea.category || idea.department}</div>
                    </div>

                    <div className="idea-submitter">{idea.author}</div>

                    {/* ✅ Status badge */}
                    {renderStatusBadge(idea.status)}

                    <div className="idea-date">{idea.postedAt || "—"}</div>
                  </div>
                ))}

              {/* EMPTY STATE */}
              {activeTab === "submissions" && myIdeas.length === 0 && (
                <div style={{ padding: 20 }}>No submissions yet.</div>
              )}

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}