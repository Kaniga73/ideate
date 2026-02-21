import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../Styles/IdeaDetails.css";

export default function IdeaDetails() {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [upvoted, setUpvoted] = useState(false);
  const [pledge, setPledge] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")) || { id: 1, name: "Guest" };

  // Initialize data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ideas");
    const ideas = saved ? JSON.parse(saved) : [];
    const found = ideas.find((i) => String(i.id) === String(id));
    
    if (found) {
      setIdea(found);

      // Load idea-specific data from localStorage
      const ideaMetrics = JSON.parse(localStorage.getItem("ideaMetrics") || "{}");
      if (ideaMetrics[id]) {
        setUpvoted(ideaMetrics[id].upvoted || false);
        setPledge(ideaMetrics[id].pledge || 0);
        setComments(ideaMetrics[id].comments || []);
      }

      // Check if in favorites
      const favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
      setIsFavorite(favorites[user.id]?.includes(parseInt(id)) || false);
    }
  }, [id, user.id]);

  // Handle upvote
  const handleUpvote = () => {
    const metrics = JSON.parse(localStorage.getItem("ideaMetrics") || "{}");
    const curr = metrics[id] || {};
    const prevUpvoted = !!curr.upvoted;
    const newUpvoted = !prevUpvoted;

    // Update main idea upvotes
    const ideasRaw = localStorage.getItem("ideas");
    const ideas = ideasRaw ? JSON.parse(ideasRaw) : [];
    const idx = ideas.findIndex((i) => String(i.id) === String(id));
    if (idx !== -1) {
      ideas[idx].upvotes = (ideas[idx].upvotes || 0) + (newUpvoted ? 1 : -1);
      if (ideas[idx].upvotes < 0) ideas[idx].upvotes = 0;
      localStorage.setItem("ideas", JSON.stringify(ideas));
      setIdea(ideas[idx]);
    }

    // persist per-user metrics
    metrics[id] = { ...curr, upvoted: newUpvoted, pledge: curr.pledge || pledge, comments: curr.comments || comments };
    localStorage.setItem("ideaMetrics", JSON.stringify(metrics));
    setUpvoted(newUpvoted);
  };

  // Handle pledge
  const handleConfirmPledge = () => {
    const metrics = JSON.parse(localStorage.getItem("ideaMetrics") || "{}");
    const curr = metrics[id] || {};
    const prevPledge = Number(curr.pledge || 0);
    const newPledge = Number(pledge || 0);
    const delta = newPledge - prevPledge;

    if (delta !== 0) {
      const ideasRaw = localStorage.getItem("ideas");
      const ideas = ideasRaw ? JSON.parse(ideasRaw) : [];
      const idx = ideas.findIndex((i) => String(i.id) === String(id));
      if (idx !== -1) {
        ideas[idx].pledgedHours = (ideas[idx].pledgedHours || 0) + delta;
        if (ideas[idx].pledgedHours < 0) ideas[idx].pledgedHours = 0;
        localStorage.setItem("ideas", JSON.stringify(ideas));
        setIdea(ideas[idx]);
      }
    }

    metrics[id] = { ...curr, upvoted: curr.upvoted || upvoted, pledge: newPledge, comments: curr.comments || comments };
    localStorage.setItem("ideaMetrics", JSON.stringify(metrics));
    setPledge(newPledge);
    alert(`Pledged ${newPledge} hours/week successfully!`);
  };

  // Handle comment post
  const handlePostComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: Date.now(),
      author: user.name,
      text: commentText,
      timestamp: new Date().toLocaleString(),
    };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    saveToLocalStorage({ upvoted, pledge, comments: updatedComments });
    setCommentText("");
  };

  // Handle favorite toggle
  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "{}");
    if (!favorites[user.id]) favorites[user.id] = [];

    if (isFavorite) {
      favorites[user.id] = favorites[user.id].filter((fav) => fav !== parseInt(id));
    } else {
      if (!favorites[user.id].includes(parseInt(id))) {
        favorites[user.id].push(parseInt(id));
      }
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
  };

  // Handle share
  const handleShare = (platform) => {
    const url = `${window.location.origin}/ideas/${id}`;
    const text = `Check out this idea: "${idea.title}"`;

    const shareMap = {
      copy: () => {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      },
      whatsapp: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`);
      },
      twitter: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        );
      },
      facebook: () => {
        window.open(
          `https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        );
      },
      email: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(idea.title)}&body=${encodeURIComponent(text + " " + url)}`;
      },
    };

    shareMap[platform]?.();
    setShowShareMenu(false);
  };

  // Save to localStorage
  const saveToLocalStorage = (data) => {
    const ideaMetrics = JSON.parse(localStorage.getItem("ideaMetrics") || "{}");
    ideaMetrics[id] = data;
    localStorage.setItem("ideaMetrics", JSON.stringify(ideaMetrics));
  };

  if (!idea) return <h2 className="loading">Loading idea...</h2>;

  const progress = Math.min((idea.pledgedHours / idea.totalHours) * 100, 100);
  const votes = idea.upvotes || 0;

  return (
    <div className="dashboard">
      <Navbar user={user} />

      <div className="idea-layout">

        {/* LEFT CONTENT */}
        <div className="idea-content">

          <div className="idea-card">

            {/* Author */}
            <div className="idea-top">
              <div className="idea-user">
                <div className="avatar">{idea.author?.[0]}</div>
                <div>
                  <div className="name">{idea.author}</div>
                  <div className="role">{idea.department}</div>
                </div>
              </div>

              <div className="idea-actions">
                <div className="share-wrapper">
                  <button
                    className="icon-btn"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                  >
                    Share
                  </button>
                  {showShareMenu && (
                    <div className="share-menu">
                      <button onClick={() => handleShare("copy")}>📋 Copy Link</button>
                      <button onClick={() => handleShare("whatsapp")}>💬 WhatsApp</button>
                      <button onClick={() => handleShare("twitter")}>🐦 Twitter</button>
                      <button onClick={() => handleShare("facebook")}>📘 Facebook</button>
                      <button onClick={() => handleShare("email")}>📧 Email</button>
                    </div>
                  )}
                </div>
                <button
                  className={`icon-btn ${isFavorite ? "favorite-active" : ""}`}
                  onClick={handleFavorite}
                >
                  {isFavorite ? "★" : "☆"} Fav
                </button>
              </div>
            </div>

            {/* Title */}
            <p>{idea.category}</p>

            <h1 className="idea-title">{idea.title}</h1>

            {/* Description */}
            <div className="section">
              <h3>Proposed Solution</h3>
              <p>{idea.description}</p>
            </div>

            {/* Image */}
            {idea.image && (
              <div className="section">
                <h3>Attached Media</h3>
                <img src={idea.image} alt="" className="idea-img" />
              </div>
            )}

          </div>

          {/* COMMENTS */}
          <div className="idea-card">
            <h3>Discussion</h3>
            <textarea
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
            <button className="primary-btn" onClick={handlePostComment}>
              Post Comment
            </button>

            {/* Display Comments */}
            <div className="comments-list">
              {comments.length > 0 && <h4 className="comments-header">Comments ({comments.length})</h4>}
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-author">{comment.author}</div>
                  <div className="comment-time">{comment.timestamp}</div>
                  <div className="comment-text">{comment.text}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="idea-sidebar">

          {/* UPVOTE */}
          <div className="side-card">
            <button
              className={`upvote ${upvoted ? "active" : ""}`}
              onClick={handleUpvote}
            >
              ▲ Upvote
            </button>
            <div className="metric">{votes} Votes</div>
          </div>

          {/* PLEDGE */}
          <div className="side-card">
            <h3>Pledge Time</h3>
            <input
              type="range"
              min="1"
              max="10"
              value={pledge}
              onChange={(e) => setPledge(parseInt(e.target.value))}
            />
            <div className="metric">{pledge} hrs / week</div>
            <button className="primary-btn" onClick={handleConfirmPledge}>
              Confirm Pledge
            </button>
          </div>

          {/* IMPACT */}
          <div className="side-card">
            <h3>Impact Progress</h3>
            <div className="progress-bar">
              <div style={{ width: `${progress}%` }} className="progress-fill" />
            </div>
            <div className="metric">
              {idea.pledgedHours}/{idea.totalHours} hrs pledged
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}