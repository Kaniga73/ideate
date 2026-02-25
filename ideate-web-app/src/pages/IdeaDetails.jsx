import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../Styles/IdeaDetailsView.css";

export default function IdeaDetails() {
  const { id } = useParams();
  const [idea, setIdea] = useState(null);
  const [upvoted, setUpvoted] = useState(false);
  const [pledge, setPledge] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
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
      isAuthor: user.name === idea.author,
      replies: [],
    };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    saveToLocalStorage({ upvoted, pledge, comments: updatedComments });
    setCommentText("");
  };

  // Handle reply to comment
  const handleReply = (commentId) => {
    if (!replyText.trim()) return;
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [
            ...(comment.replies || []),
            {
              id: Date.now(),
              author: user.name,
              text: replyText,
              timestamp: new Date().toLocaleString(),
              isAuthor: user.name === idea.author,
            },
          ],
        };
      }
      return comment;
    });
    setComments(updatedComments);
    saveToLocalStorage({ upvoted, pledge, comments: updatedComments });
    setReplyText("");
    setReplyingTo(null);
  };

  // Handle favorite toggle
  const handleBack = () => {
    window.history.back();
  };

  const handleFollowUpdates = () => {
    setIsFollowing(!isFollowing);
    alert(isFollowing ? "Unfollowed updates" : "Following updates for this idea!");
  };

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
            <button className="back-btn" onClick={() => window.history.back()}> Back</button>
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
                          <button onClick={() => handleShare("copy")}><i className="fa-solid fa-clipboard"></i> Copy Link</button>
                      <button onClick={() => handleShare("whatsapp")}><i className="fa-brands fa-whatsapp"></i> WhatsApp</button>
                      <button onClick={() => handleShare("twitter")}><i className="fa-brands fa-twitter"></i> Twitter</button>
                      <button onClick={() => handleShare("facebook")}><i className="fa-brands fa-facebook-f"></i> Facebook</button>
                      <button onClick={() => handleShare("email")}><i className="fa-solid fa-envelope"></i> Email</button>
                    </div>
                  )}
                </div>
                <button
                  className={`icon-btn ${isFavorite ? "favorite-active" : ""}`}
                  onClick={handleFavorite}>Fav</button>
              </div>
            </div>

            {/* Title */}
            <p className="category">{idea.category}</p>

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
            <h3 >Discussions</h3>
            <textarea className="commentinputbox"
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
                <div key={comment.id} className={`comment-item ${comment.isAuthor ? "author-comment" : ""}`}>
                  <div className="comment-author">{comment.author} {comment.isAuthor && <span className="author-badge">Author</span>}</div>
                  <div className="comment-time">{comment.timestamp}</div>
                  <div className="comment-text">{comment.text}</div>
                  <button className="reply-btn" onClick={() => setReplyingTo(comment.id)}>
                     Reply
                  </button>
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="replies-section">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className={`reply-item ${reply.isAuthor ? "author-reply" : ""}`}>
                          <div className="reply-author">{reply.author} {reply.isAuthor && <span className="author-badge">Author</span>}</div>
                          <div className="reply-time">{reply.timestamp}</div>
                          <div className="reply-text">{reply.text}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="reply-input-wrapper">
                      <textarea
                        className="reply-input"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      />
                      <div className="reply-actions">
                        <button className="reply-submit-btn" onClick={() => handleReply(comment.id)}>
                          Post Reply
                        </button>
                        <button className="reply-cancel-btn" onClick={() => setReplyingTo(null)}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="idea-sidebar">

          {/* UPVOTE */}
          <div className="side-card">
            <h3>Upvotes</h3>

            <p className="card-text">Show your support for this idea</p>
            <button
              className={`upvote ${upvoted ? "active" : ""}`}
              onClick={handleUpvote}
            >
              ▲ Upvote
            </button>
            <div className="metric"> Community Votes  {votes}</div>
          </div>

          {/* PLEDGE */}
          <div className="side-card">
            <h3>Pledge Time</h3>
            <p className="card-text">Commit your effort to help implement</p>
            <div className="metric hours-text">{pledge} hours per week</div>
            <input
              type="range"
              min="1"
              max="10"
              value={pledge}
              onChange={(e) => setPledge(parseInt(e.target.value))}
            />
            <button className="primary-btn" onClick={handleConfirmPledge}>
              Confirm Pledge
            </button>
          </div>

          {/* IMPACT */}
          <div className="side-card">
            <h3>Impact Progress</h3>
            <div className="metric">
              {idea.pledgedHours}/{idea.totalHours} hrs pledged
            </div>
            <div className="progress-bar">
              <div style={{ width: `${progress}%` }} className="progress-fill" />
            </div>
            
            <p className="card-text">{progress.toFixed(0)}% goal reached</p>
            <button className="follow-btn" onClick={handleFollowUpdates}>
              {isFollowing ? "✓ Following Updates" : " Follow Updates"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}