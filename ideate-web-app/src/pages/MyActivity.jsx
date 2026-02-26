import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../Styles/MyActivity.css";

export default function MyActivity() {

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    { name: "Admin", role: "Administrator" };

  const [activeTab, setActiveTab] = useState("all");
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    const savedIdeas =
      JSON.parse(localStorage.getItem("ideas")) || [];
    setIdeas(savedIdeas);
  }, []);

  /* ===== STATUS FILTERS ===== */

  const pendingIdeas = ideas.filter(
    (idea) => idea.status === "pending"
  );

  const approvedIdeas = ideas.filter(
    (idea) => idea.status === "approved"
  );

  const reviewedIdeas = ideas.filter(
    (idea) => idea.status === "reviewed"
  );

  /* ===== SELECT IDEAS BASED ON TAB ===== */

  const filteredIdeas =
    activeTab === "all"
      ? ideas
      : activeTab === "pending"
      ? pendingIdeas
      : activeTab === "approved"
      ? approvedIdeas
      : reviewedIdeas;

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="profile-page">

      <Navbar user={user} />

      <div className="profile-layout">

        {/* ===== LEFT SIDEBAR ===== */}
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
              <div className="profile-role">Administrator</div>
            </div>
          </div>

        </aside>

        {/* ===== RIGHT CONTENT ===== */}
        <main className="profile-main">

          {/* ===== METRICS ===== */}
          <div className="metrics-row">

            <div className="metric-card metric-blue">
              <div>
                <div className="metric-label">Total Ideas</div>
                <div className="metric-value">
                  {ideas.length}
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div>
                <div className="metric-label">Pending</div>
                <div className="metric-value">
                  {pendingIdeas.length}
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div>
                <div className="metric-label">Approved</div>
                <div className="metric-value">
                  {approvedIdeas.length}
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div>
                <div className="metric-label">Reviewed</div>
                <div className="metric-value">
                  {reviewedIdeas.length}
                </div>
              </div>
            </div>

          </div>

          {/* ===== TABS + TABLE ===== */}
          <div className="tabs-card">

            <div className="tabs-nav">

              <button
                className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All Ideas
              </button>

              <button
                className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
                onClick={() => setActiveTab("pending")}
              >
                Pending
              </button>

              <button
                className={`tab-btn ${activeTab === "approved" ? "active" : ""}`}
                onClick={() => setActiveTab("approved")}
              >
                Approved
              </button>

              <button
                className={`tab-btn ${activeTab === "reviewed" ? "active" : ""}`}
                onClick={() => setActiveTab("reviewed")}
              >
                Reviewed
              </button>

            </div>

            <div className="ideas-table">

              <div className="ideas-table-head">
                <div>Idea Title</div>
                <div>Submitted By</div>
                <div>Status</div>
                <div>Date</div>
              </div>

              {filteredIdeas.map((idea, index) => (
                <div key={index} className="ideas-row">

                  <div>
                    <div className="idea-title">
                      {idea.title}
                    </div>
                    <div className="idea-branch">
                      {idea.category || idea.department}
                    </div>
                  </div>

                  <div className="idea-submitter">
                    {idea.author}
                  </div>

                  <div className={`status-badge ${idea.status}`}>
                    {idea.status}
                  </div>

                  <div className="idea-date">
                    {idea.postedAt || "—"}
                  </div>

                </div>
              ))}

              {filteredIdeas.length === 0 && (
                <div style={{ padding: 20 }}>
                  No ideas found.
                </div>
              )}

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}