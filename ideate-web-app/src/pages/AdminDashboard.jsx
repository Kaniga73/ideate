import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/AdminNavbar";
import "../Styles/AdminDashboard.css";
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
  { id: 2, title: "AI-Powered Support Desk", 
    category: "AI / Machine Learning", 
    description: "Using large language models to automate internal IT support ticketing and common FAQ...", 
    status: "PENDING", upvotes: 156, pledgedHours: 45, totalHours: 200, 
    author: "Mark Taylor", department: "ENGINEERING", postedAt: "5 days ago", },
    
];



export default function AdminDashboard() {

  const navigate = useNavigate();

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    { name: "Guest", role: "Administrator" };

  const [search, setSearch] = useState("");
  const [sortTab, setSortTab] = useState("Most Popular");

  // Load ideas from localStorage
  const [ideas, setIdeas] = useState(() => {
    const saved = localStorage.getItem("ideas");
    return saved ? JSON.parse(saved) : DEFAULT_IDEAS;
  });


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
            <h1 className="page-header__title">Admin Dashboard</h1>
            <p className="page-header__subtitle">
              Manage and review ideas submitted by employees.
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


      </div>
    </div>
  );
}