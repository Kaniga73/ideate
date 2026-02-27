import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import IdeaCard from "../components/IdeaCard";
import "../Styles/EmployeeDashboard.css";
import IdeateLogo from "../assets/IdeateLogo.png";

// Default Ideas
const DEFAULT_IDEAS = [
  {
    id: 1,
    title: "Eco-friendly Packaging Initiative",
    category: "Sustainability",
    description: "Using biodegradable packaging materials.",
    status: "APPROVED",
    upvotes: 20,
    pledgedHours: 50,
    totalHours: 100,
    author: "Sarah",
    department: "Logistics",
    postedAt: "2 days ago",
  },
  {
    id: 2,
    title: "AI-Powered Support Desk",
    category: "AI / Machine Learning",
    description:
      "Using large language models to automate internal IT support ticketing and common FAQ...",
    status: "PENDING",
    upvotes: 156,
    pledgedHours: 45,
    totalHours: 200,
    author: "Mark Taylor",
    department: "ENGINEERING",
    postedAt: "5 days ago",
  },
];

// Start Here Card
function StartHereCard({ onSubmit }) {
  return (
    <div className="start-here-card">
      <div className="start-here-card__icon-wrap">
        <img src={IdeateLogo} alt="Idea" className="start-here-card__icon" />
      </div>

      <h3 className="start-here-card__title">Have a better idea?</h3>
      <p className="start-here-card__subtitle">
        Submit your innovation and start collaborating.
      </p>

      <button className="start-here-btn" onClick={onSubmit}>
        Start Here
      </button>
    </div>
  );
}

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [sortTab, setSortTab] = useState("Most Popular");
  const [ideas, setIdeas] = useState([]);

  // ✅ Proper Role Protection
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));

    if (!loggedUser) {
      navigate("/");
      return;
    }

    // 🔥 If admin tries to open employee page
    if (loggedUser.role === "admin") {
      navigate("/admin-dashboard");
      return;
    }

    setUser(loggedUser);

    const savedIdeas = localStorage.getItem("ideas");
    setIdeas(savedIdeas ? JSON.parse(savedIdeas) : DEFAULT_IDEAS);

  }, [navigate]);

  // Prevent render before role check
  if (!user) return null;

  // Filter + Sort
  const filteredIdeas = ideas
    .filter(
      (i) =>
        i.title.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase()) ||
        i.author.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortTab === "Most Popular" ? b.upvotes - a.upvotes : 0
    );

  return (
    <div className="dashboard">
      <Navbar user={user} />

      <div className="page-body">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-header__title">Employee Idea Feed</h1>
            <p className="page-header__subtitle">
              Join the community in driving internal innovation.
            </p>
          </div>

          <div className="sort-tabs">
            {["Most Popular", "Recent"].map((tab) => (
              <button
                key={tab}
                className={`sort-tab ${
                  sortTab === tab ? "sort-tab--active" : ""
                }`}
                onClick={() => setSortTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="search-bar-wrapper">
          <input
            className="search-bar__input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ideas..."
          />
        </div>

        {/* Ideas Grid */}
        <div className="ideas-grid">
          <StartHereCard onSubmit={() => navigate("/submit-idea")} />

          {filteredIdeas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              onDetails={(id) => navigate(`/ideas/${id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}