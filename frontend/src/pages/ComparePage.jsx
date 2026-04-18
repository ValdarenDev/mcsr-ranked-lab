import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../css/global.css";

export default function ComparePage() {
  const navigate = useNavigate();
  
  const [players, setPlayers] = useState(["", ""]);
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    "ELO Rating",
    "Win-Loss Record",
    "Personal Best (PB)",
    "Average Completion Time",
    "Recent Trends",
    "Run History"
  ];

  const [selectedFilters, setSelectedFilters] = useState([]);

  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedFilters.length === filterOptions.length) {
      setSelectedFilters([]); // unselect all
    } else {
      setSelectedFilters(filterOptions); // select all
    }
  };

  const handlePlayerChange = (index, value) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  const addPlayer = () => {
    setPlayers([...players, ""]);
  };

  const handleCompare = async () => {
    navigate("/comparison", {
      state: {
        players,
        filters: selectedFilters
      }
    });
  };

  return (
    <Layout>
      <p className="compare-top-link"><a href="/">Search Player</a></p>

      <div className="compare-container">
        <h1 className="compare-title">Compare Players</h1>

        <div className="compare-inputs">
          {players.map((p, index) => (
            <input
              key={index}
              className="mc-input compare-input"
              placeholder={`Player ${index + 1}`}
              value={p}
              onChange={(e) => handlePlayerChange(index, e.target.value)}
            />
          ))}
        </div>

        <div className="compare-buttons">
          <button className="mc-button" onClick={handleCompare}>
            Compare
          </button>

          <button className="mc-button add-player-btn" onClick={addPlayer}>
            + Add Player
          </button>

          <button className="mc-button filter-btn" onClick={() => setShowFilters(!showFilters)}>
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="filter-panel mc-panel">
            <h3>Filter Comparison</h3>

            <label className="filter-option">
              <input
                type="checkbox"
                checked={selectedFilters.length === filterOptions.length}
                onChange={toggleSelectAll}
              />
              Select All
            </label>

            {filterOptions.map((filter) => (
              <label key={filter} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(filter)}
                  onChange={() => toggleFilter(filter)}
                />
                {filter}
              </label>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}