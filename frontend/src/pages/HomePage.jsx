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
        <h1>MCSR Ranked Analyzer</h1>

        <input
          className="mc-input"
          type="text"
          placeholder="Search IGN"
          value={ign}
          onChange={(e) => setIgn(e.target.value)}
        ></input>

        <button className="mc-button" onClick={handleSearch}>
          Search
        </button>
      </div>
    </Layout>
  );
}