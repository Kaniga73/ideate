import { useState } from "react";
import "../Styles/IdeaCard.css";


// Helpers
function getInitials(name = "") {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function avatarColor(name = "") {
  const colors = ["#4f8ef7", "#7c3aed", "#0891b2", "#059669", "#d97706"];
  return colors[name.charCodeAt(0) % colors.length];
}

const statusClass = {
  APPROVED: "status-badge--approved",
  PENDING: "status-badge--pending",
  NEW: "status-badge--new",
};

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${statusClass[status] || "status-badge--new"}`}>
      {status}
    </span>
  );
}

function Avatar({ name, size = 36 }) {
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        backgroundColor: avatarColor(name),
        fontSize: size * 0.36,
      }}
    >
      {getInitials(name)}
    </div>
  );
}

function ProgressBar({ value, max }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="progress-bar">
      <div
        className={`progress-bar__fill ${pct >= 100 ? "progress-bar__fill--full" : ""}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function IdeaCard({ idea, onDetails }) {
  const [upvoted, setUpvoted] = useState(false);
  const [votes, setVotes] = useState(idea.upvotes);
  const full = idea.pledgedHours >= idea.totalHours;

  const handleUpvote = (e) => {
    e.stopPropagation();
    setUpvoted((prev) => !prev);
    setVotes((v) => (upvoted ? v - 1 : v + 1));
  };

  return (
    <div className="idea-card" onClick={() => onDetails?.(idea.id)}>
      <div className="idea-card__top">
        <StatusBadge status={idea.status} />
        <button
          className={`upvote-btn ${upvoted ? "upvote-btn--active" : ""}`}
          onClick={handleUpvote}
        >
          <svg width="16" height="16" viewBox="0 0 24 24"
            fill={upvoted ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
          <span className="upvote-btn__count">{votes}</span>
        </button>
      </div>

      <h3 className="idea-card__title">{idea.title}</h3>
      <p className="idea-card__category">{idea.category}</p>
      <p className="idea-card__description">{idea.description}</p>

      <div className="idea-card__author">
        <Avatar name={idea.author} size={34} />
        <div>
          <div className="idea-card__author-name">{idea.author}</div>
          <div className="idea-card__author-dept">{idea.department}</div>
        </div>
      </div>

      <div>
        <div className="pledged-hours__header">
          <span className="pledged-hours__label">PLEDGED HOURS</span>
          <span className={`pledged-hours__value ${full ? "pledged-hours__value--full" : ""}`}>
            {idea.pledgedHours}/{idea.totalHours} hrs
          </span>
        </div>
        <ProgressBar value={idea.pledgedHours} max={idea.totalHours} />
      </div>

      <div className="idea-card__footer">
        <span className="idea-card__time">{idea.postedAt}</span>
        <button
          className="details-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDetails?.(idea.id);
          }}
        >
          Details
        </button>
      </div>
    </div>
  );
}
