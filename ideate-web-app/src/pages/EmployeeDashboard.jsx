import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import IdeaCard from "../components/IdeaCard";   // ✅ imported component
import "../Styles/EmployeeDashboard.css";
import IdeateLogo from "../assets/IdeateLogo.png";   // ✅ imported image


// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_IDEAS = [
  {
    id: 1,
    title: "Eco-friendly Packaging Initiative",
     category: "AI / Machine Learning", 
    description:
      "Implementing 100% biodegradable materials for all shipping containers by the end of Q4 2024 to meet sustainability goals...",
    status: "APPROVED",
    
    upvotes: 242,
    pledgedHours: 120,
    totalHours: 150,
    author: "Sarah Chen",
    department: "LOGISTICS OPERATIONS",
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
  {
    id: 3,
    title: "Virtual Coffee Roulette",
     category: "AI / Machine Learning", 
    description:
      "A random matching system to encourage cross-departmental networking sessions and remote...",
    status: "APPROVED",
    upvotes: 891,
    pledgedHours: 80,
    totalHours: 80,
    author: "Jamie Vales",
    department: "HR & CULTURE",
    postedAt: "1 week ago",
  },
  {
    id: 4,
    title: "Dark Mode Everything",
     category: "AI / Machine Learning", 
    description:
      "Updating all internal legacy tools to support dark mode to improve accessibility and developer focus...",
    status: "NEW",
    upvotes: 12,
    pledgedHours: 0,
    totalHours: 300,
    author: "Elena Rossi",
    department: "UI/UX DESIGN",
    postedAt: "4 hours ago",
  },
  {
    id: 5,
    title: "Solar Panel Installation",
     category: "AI / Machine Learning", 
    description:
      "Feasibility study for rooftop solar arrays on all HQ buildings to reduce energy costs and carbon...",
    status: "PENDING",
    upvotes: 48,
    pledgedHours: 12,
    totalHours: 40,
    author: "David Wu",
    department: "FACILITIES",
    postedAt: "3 days ago",
  },
];


// ─── Start Here Card ──────────────────────────────────────────────────────────
function StartHereCard({ onSubmit }) {
  return (
    <div className="start-here-card">
      <div className="start-here-card__icon-wrap">
        <img
          src={IdeateLogo}
          alt="Idea"
          className="start-here-card__icon"
        />
          
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


// ─── Main Page ────────────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortTab, setSortTab] = useState("Most Popular");

  const filteredIdeas = MOCK_IDEAS
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

      {/* Navbar */}
      <Navbar user={user} />

      {/* Page Body */}
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


        {/* Search Bar */}
        <div className="search-bar-wrapper">
          <svg
            className="search-bar__icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            className="search-bar__input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ideas, keywords, or contributors..."
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


        {filteredIdeas.length === 0 && (
          <p className="empty-state">No ideas match your search.</p>
        )}

      </div>
    </div>
  );
}
