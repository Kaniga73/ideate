import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import "../Styles/AdminIdeaDetails.css";

export default function AdminIdeaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [idea, setIdea] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [toast, setToast] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (!loggedUser || loggedUser.role !== "admin") {
      navigate("/");
      return;
    }
    setUser(loggedUser);

    const savedIdeas = JSON.parse(localStorage.getItem("ideas")) || [];
    const found = savedIdeas.find((i) => String(i.id) === String(id));
    setIdea(found || null);

    // ✅ Shared ideaMetrics key — same as employee view
    const ideaMetrics = JSON.parse(localStorage.getItem("ideaMetrics") || "{}");
    setComments(ideaMetrics[id]?.comments || []);
  }, [id, navigate]);

  // ── Persist comments helper ──
  const saveComments = (updated) => {
    const ideaMetrics = JSON.parse(localStorage.getItem("ideaMetrics") || "{}");
    ideaMetrics[id] = { ...(ideaMetrics[id] || {}), comments: updated };
    localStorage.setItem("ideaMetrics", JSON.stringify(ideaMetrics));
    setComments(updated);
  };

  // ── Status Update ──
  const updateStatus = (newStatus) => {
    const savedIdeas = JSON.parse(localStorage.getItem("ideas")) || [];
    const updated = savedIdeas.map((i) =>
      String(i.id) === String(id) ? { ...i, status: newStatus } : i
    );
    localStorage.setItem("ideas", JSON.stringify(updated));
    setIdea((prev) => ({ ...prev, status: newStatus }));
    showToast(
      newStatus === "APPROVED"
        ? "✅ Idea approved successfully!"
        : "❌ Idea rejected."
    );
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ── Post top-level Comment ──
  const handlePostComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      id: Date.now(),
      author: user?.name || "Admin",
      role: "Admin",           // ✅ always tag admin comments with role
      text: comment.trim(),
      timestamp: new Date().toLocaleString(),
      isAuthor: false,
      replies: [],
    };
    saveComments([...comments, newComment]);
    setComment("");
  };

  // ── Post Reply ──
  const handlePostReply = (commentId) => {
    if (!replyText.trim()) return;
    const newReply = {
      id: Date.now(),
      author: user?.name || "Admin",
      role: "Admin",           // ✅ always tag admin replies with role
      text: replyText.trim(),
      timestamp: new Date().toLocaleString(),
      isAuthor: false,
    };
    const updated = comments.map((c) =>
      c.id === commentId
        ? { ...c, replies: [...(c.replies || []), newReply] }
        : c
    );
    saveComments(updated);
    setReplyText("");
    setReplyingTo(null);
  };

  if (!user || !idea) return null;

  const progressPercent = idea.totalHours
    ? Math.min(100, Math.round((idea.pledgedHours / idea.totalHours) * 100))
    : 0;

  const initials = idea.author
    ? idea.author.split(" ").map((w) => w[0]).join("").toUpperCase()
    : "?";

  const statusClass =
    idea.status === "APPROVED"
      ? "status-badge--approved"
      : idea.status === "REJECTED"
      ? "status-badge--rejected"
      : "status-badge--pending";

  return (
    <div className="aid-page">
      <AdminNavbar user={user} />

      {toast && <div className="aid-toast">{toast}</div>}

      <div className="aid-layout">
        {/* ══ LEFT ══ */}
        <div className="aid-left">
          <button className="aid-back-btn" onClick={() => navigate("/admin-dashboard")}>
            ← Back
          </button>

          <div className="aid-author-row">
            <div className="aid-avatar">{initials}</div>
            <div>
              <div className="aid-author-name">{idea.author}</div>
              <div className="aid-author-role">{idea.department || "Employee"}</div>
            </div>
            <div className="aid-meta-right">
              <span className={`aid-status-badge ${statusClass}`}>
                {idea.status || "PENDING"}
              </span>
              <span className="aid-posted-at">{idea.postedAt}</span>
            </div>
          </div>

          <div className="aid-category-tag">{idea.category}</div>
          <h2 className="aid-title">{idea.title}</h2>

          <div className="aid-section">
            <h3 className="aid-section-title">Proposed Solution</h3>
            <p className="aid-description">{idea.description}</p>
          </div>

          {idea.image && (
            <div className="aid-section">
              <h3 className="aid-section-title">Attached Media</h3>
              <img src={idea.image} alt="idea" className="aid-idea-img" />
            </div>
          )}

          <div className="aid-stats-row">
            <div className="aid-stat-box">
              <span className="aid-stat-value">▲ {idea.upvotes || 0}</span>
              <span className="aid-stat-label">Community Votes</span>
            </div>
            <div className="aid-stat-box">
              <span className="aid-stat-value">
                {idea.pledgedHours || 0}/{idea.totalHours || 100} hrs
              </span>
              <span className="aid-stat-label">Pledged Hours</span>
            </div>
            <div className="aid-stat-box">
              <span className="aid-stat-value">{progressPercent}%</span>
              <span className="aid-stat-label">Goal Reached</span>
            </div>
          </div>

          <div className="aid-progress-bar-bg">
            <div className="aid-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="aid-progress-label">
            {progressPercent}% of {idea.totalHours || 100} hr goal reached
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="aid-right">

          {/* Approve / Reject */}
          <div className="aid-action-card">
            <h3 className="aid-action-title">Admin Decision</h3>
            <p className="aid-action-subtitle">Review this idea and take action.</p>
            <div className="aid-action-btns">
              <button
                className={`aid-approve-btn ${idea.status === "APPROVED" ? "aid-approve-btn--active" : ""}`}
                onClick={() => updateStatus("APPROVED")}
                disabled={idea.status === "APPROVED"}
              >
                ✓ Approve
              </button>
              <button
                className={`aid-reject-btn ${idea.status === "REJECTED" ? "aid-reject-btn--active" : ""}`}
                onClick={() => updateStatus("REJECTED")}
                disabled={idea.status === "REJECTED"}
              >
                ✕ Reject
              </button>
            </div>
            {idea.status === "APPROVED" && (
              <p className="aid-decision-note aid-decision-note--approved">
                This idea is currently approved.
              </p>
            )}
            {idea.status === "REJECTED" && (
              <p className="aid-decision-note aid-decision-note--rejected">
                This idea has been rejected.
              </p>
            )}
          </div>

          {/* Comments */}
          <div className="aid-comments-card">
            <h3 className="aid-comments-title">
              Discussions
              {comments.length > 0 && (
                <span className="aid-comments-count">{comments.length}</span>
              )}
            </h3>

            <div className="aid-comments-list">
              {comments.length === 0 ? (
                <p className="aid-no-comments">No comments yet.</p>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="aid-comment-item">
                    {/* Avatar — purple for admin, teal for employee */}
                    <div className={`aid-comment-avatar ${c.role === "Admin" ? "aid-comment-avatar--admin" : ""}`}>
                      {c.author?.[0]?.toUpperCase() || "?"}
                    </div>

                    <div className="aid-comment-body">
                      <div className="aid-comment-header">
                        <span className="aid-comment-author">{c.author}</span>
                        {/* ✅ Only show Admin badge if role === "Admin" explicitly */}
                        {c.role === "Admin" && (
                          <span className="aid-badge aid-badge--admin">Admin</span>
                        )}
                        {c.isAuthor && c.role !== "Admin" && (
                          <span className="aid-badge aid-badge--author">Author</span>
                        )}
                        <span className="aid-comment-time">{c.timestamp || c.postedAt}</span>
                      </div>
                      <p className="aid-comment-text">{c.text}</p>

                      {/* Replies */}
                      {c.replies && c.replies.length > 0 && (
                        <div className="aid-replies">
                          {c.replies.map((r) => (
                            <div
                              key={r.id}
                              className={`aid-reply-item ${r.role === "Admin" ? "aid-reply-item--admin" : ""}`}
                            >
                              <div className="aid-comment-header">
                                <span className="aid-reply-author">{r.author}</span>
                                {/* ✅ Only show Admin badge if role === "Admin" explicitly */}
                                {r.role === "Admin" && (
                                  <span className="aid-badge aid-badge--admin">Admin</span>
                                )}
                                {r.isAuthor && r.role !== "Admin" && (
                                  <span className="aid-badge aid-badge--author">Author</span>
                                )}
                                <span className="aid-comment-time">{r.timestamp}</span>
                              </div>
                              <p className="aid-reply-text">{r.text}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Button */}
                      <button
                        className="aid-reply-btn"
                        onClick={() =>
                          setReplyingTo(replyingTo === c.id ? null : c.id)
                        }
                      >
                        ↩ Reply
                      </button>

                      {/* Reply Input */}
                      {replyingTo === c.id && (
                        <div className="aid-reply-input-wrapper">
                          <textarea
                            className="aid-reply-input"
                            placeholder="Write a reply as Admin..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={2}
                          />
                          <div className="aid-reply-actions">
                            <button
                              className="aid-reply-submit-btn"
                              onClick={() => handlePostReply(c.id)}
                            >
                              Post Reply
                            </button>
                            <button
                              className="aid-reply-cancel-btn"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyText("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <textarea
              className="aid-comment-input"
              placeholder="Share your thoughts as admin..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <button className="aid-post-btn" onClick={handlePostComment}>
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}