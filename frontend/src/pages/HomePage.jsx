import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../css/global.css";

export default function Home() {
  const [ign, setIgn] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!ign.trim()) return;
    navigate(`/profile/${encodeURIComponent(ign.trim())}`);
  };

  return (
    <Layout>
      <div className="home-container">
        <h1>Search Player</h1>
        <p className="home-subtitle">Track stats, trends, and performance for any MCSR player.</p>

        <div className="search-row">
          <input
            className="mc-input home-input"
            type="text"
            placeholder="Search IGN..."
            value={ign}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            onChange={(e) => setIgn(e.target.value)}
          ></input>
        </div>

        <button className="mc-button" onClick={handleSearch}>
          Search Player
        </button>
      </div>
    </Layout>
  );
}