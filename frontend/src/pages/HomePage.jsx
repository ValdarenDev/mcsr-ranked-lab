import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../css/global.css";
import InlineExplain from "../components/InlineExplain";
import QuickStartGuide from "../components/QuickStart";

export default function Home() {
  const [showGuide, setShowGuide] = useState(true);
  const [ign, setIgn] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!ign.trim()) return;
    navigate(`/profile/${encodeURIComponent(ign.trim())}`);
  };

  useEffect(() => {
    if (showGuide) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showGuide]);

  return (
    <>
      {showGuide && <QuickStartGuide onClose={() => setShowGuide(false)} />}
      <Layout>
        <p className="compare-top-link"><a href="/compare">Compare Players</a></p>

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

        <p className="faq-link">Questions? <a href="/faq">FAQ</a></p>

        <section id="about-section" className="mc-panel about-section">
          <h2>About MCSR Ranked Analyzer</h2>

          <p>
            MCSR Ranked Analyzer helps players and viewers understand competitive
            performance by aggregating match history, highlighting trends, and comparing players.
            The tool focuses on clarity: quick stats, visual trends, and detailed run history.
          </p>

          <div className="about-columns">
            <div className="about-column">
              <h3>What you'll see:</h3>
              <ul>
                <li><InlineExplain className="highlight-term">Rank</InlineExplain> - a global position based on performance.</li>
                <li><InlineExplain className="highlight-term">Elo</InlineExplain> - a numeric rating that estimates skill.</li>
                <li><InlineExplain className="highlight-term">Personal Best (PB)</InlineExplain> - fastest valid completion time.</li>
                <li><InlineExplain className="highlight-term">Win-Loss Record</InlineExplain> - simple record of wins and losses.</li>
                <li><InlineExplain className="highlight-term">Recent Trends</InlineExplain> - charts that show performance over time.</li>
              </ul>
            </div>
          </div>
          
          <h3>Privacy and data</h3>
          <p>
            We display only public match data and derived statistics. If you want a stat removed
            from your public profile, remove the public runs at the source.
          </p>
        </section>
      </Layout>
    </>
  );
}