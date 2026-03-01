import { useState, useEffect } from "react";
import AdminNavbar from "../components/AdminNavbar";
import "../Styles/Profile.css";

export default function MyActivity() {
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    { name: "Admin", role: "Administrator" };

  const [ideas, setIdeas] = useState([]);

  // Load ideas from localStorage
  useEffect(() => {
    const savedIdeas = JSON.parse(localStorage.getItem("ideas")) || [];
    setIdeas(savedIdeas);
  }, []);

  // Refresh ideas from localStorage
  const refreshIdeas = () => {
    const savedIdeas = JSON.parse(localStorage.getItem("ideas")) || [];
    setIdeas(savedIdeas);
  };

  // Update idea status (Approve / Reject)
  const updateIdeaStatus = (index, newStatus) => {
    const updatedIdeas = [...ideas];
    updatedIdeas[index].status = newStatus.toLowerCase();
    setIdeas(updatedIdeas);
    localStorage.setItem("ideas", JSON.stringify(updatedIdeas));
    refreshIdeas(); // update metrics immediately
  };

  // Filter ideas reviewed by this admin (optional)
  const reviewedIdeas = ideas.filter(
    (idea) => idea.reviewedBy === user.name
  );

  // Metrics
  const totalSubmissions = ideas.length;
  const pendingCount = ideas.filter((i) => i.status === "pending").length;
  const approvedCount = ideas.filter((i) => i.status === "approved").length;
  const rejectedCount = ideas.filter((i) => i.status === "rejected").length;

  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

    const statusClass = {
  approved: "status-badge--approved",
  pending: "status-badge--pending",
  rejected: "status-badge--rejected",
};

  return (
    <div className="profile-page">
      <AdminNavbar user={user} />

      <div className="profile-layout">
        {/* LEFT SIDEBAR */}
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
        </aside>

        {/* RIGHT CONTENT */}
        <main className="profile-main">
          {/* METRICS */}
          <div className="metrics-row">
            <div className="metric-card metric-blue">
              <div>
                <div className="metric-label">Total Submissions</div>
                <div className="metric-value">{totalSubmissions}</div>
              </div>
            </div>

            <div className="metric-card metric-yellow">
              <div>
                <div className="metric-label">Pending</div>
                <div className="metric-value">{pendingCount}</div>
              </div>
            </div>

            <div className="metric-card metric-green">
              <div>
                <div className="metric-label">Approved</div>
                <div className="metric-value">{approvedCount}</div>
              </div>
            </div>

            <div className="metric-card metric-red">
              <div>
                <div className="metric-label">Rejected</div>
                <div className="metric-value">{rejectedCount}</div>
              </div>
            </div>
          </div>

          {/* IDEAS TABLE */}
          <div className="tabs-card">
            <div className="ideas-table">
              <div className="ideas-table-head">
                <div>Idea Title</div>
                <div>Submitted By</div>
                <div>Status</div>
                <div>Date</div>
              </div>

              {ideas.length > 0 ? (
                ideas.map((idea, i) => (
                  <div key={i} className="ideas-row">
                    <div>
                      <div className="idea-title">{idea.title}</div>
                      <div className="idea-branch">{idea.category || idea.department}</div>
                    </div>

                    <div className="idea-submitter">{idea.author}</div>

                 <div className={`status-badge ${statusClass[idea.status.toLowerCase()] || ""}`}>
  {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}


                      {/* Admin Approve/Reject buttons */}
                      {user.role === "Administrator" && (
                        <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
                          {idea.status !== "approved" && (
                            <button
                              onClick={() => updateIdeaStatus(i, "approved")}
                              className="approve-btn"
                            >
                              Approve
                            </button>
                          )}
                          {idea.status !== "rejected" && (
                            <button
                              onClick={() => updateIdeaStatus(i, "rejected")}
                              className="reject-btn"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="idea-date">{idea.postedAt || "—"}</div>
                  </div>
                ))
              ) : (
                <div style={{ padding: 20 }}>No ideas submitted yet.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}