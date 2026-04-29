import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import "../css/global.css";

export default function ComparisonPage() {
    const { state } = useLocation();
    const { players = [], filters = [] } = state || {};

    // Sample data for 4 players
    const sampleData = {
        StupidSteve: {
            rank: 4821,
            elo: 1420,
            pb: "18:20",
            avg: "24:10",
            wl: "62-48",
            streak: 3
        },
        NetherNinja: {
            rank: 1290,
            elo: 1580,
            pb: "16:55",
            avg: "22:40",
            wl: "75-39",
            streak: 5
        },
        Block_Breaker: {
            rank: 5530,
            elo: 1330,
            pb: "19:40",
            avg: "25:30",
            wl: "58-52",
            streak: 1
        },
        Macaroni32: {
            rank: 3012,
            elo: 1495,
            pb: "17:30",
            avg: "23:15",
            wl: "68-44",
            streak: 4
        },
    };

    // Normalize filter names so they match the table keys
    const normalizeFilter = (f) => {
        if (f === "ELO Rating") return "Elo";
        if (f === "Elo") return "Elo";

        if (f === "Personal Best (PB)") return "Personal Best (PB)";
        if (f === "Average Completion Time") return "Average Completion Time";
        if (f === "Win-Loss Record") return "Win-Loss Record";
        if (f === "Rank") return "Rank";
        if (f === "Win Streak") return "Win Streak";

        // Filters that should not appear in table
        if (f === "Recent Trends") return null;
        if (f === "Run History") return null;

        return null;
    }

    // Maps normalized 
    const filterMap = {
        "Rank": { key: "rank", label: "Rank" },
        "Elo": { key: "elo", label: "Elo" },
        "Personal Best (PB)": { key: "pb", label: "Personal Best" },
        "Average Completion Time": { key: "avg", label: "Average Time" },
        "Win-Loss Record": { key: "wl", label: "W-L" },
        "Win Streak": { key: "streak", label: "Streak" },
    }

    // This will only show players that exist in the sample data
    const validPlayers = players.filter(p => sampleData[p]);

    // Filters that actually map to table columns
    const tableFilters = filters
        .map(normalizeFilter)
        .filter(f => f && filterMap[f]);

    return (
        <Layout>
            <div className="compare-container">

                {/* Back to Compare link */}
                <p className="profile-back-link">
                    <a href="/compare">&lt; Back to Compare</a>
                </p>

                <h1 className="compare-title">Compare Players Results</h1>

                {/* Shows the players that were selected */}
                <div className="comparison-block">
                    <h3 className="comparison-heading">Players</h3>
                    <div className="comparison-content">
                        {validPlayers.length > 0 ? (
                            validPlayers.map((p, i) => <p key={i}>{p}</p>)
                        ) : (
                            <p>No valid players selected</p>
                        )}
                    </div>
                </div>
                
                {/* See the filters that were applied */}
                <div className="comparison-block">
                    <h3 className="comparison-heading">Filters Applied</h3>
                    <div className="comparison-content">
                        {filters.length > 0 ? (
                            filters.map((f, index) => <p key={index}>{f}</p>)
                        ) : (
                            <p>No filters selected</p>
                        )}
                    </div>
                </div>
                
                {/* Comparison table */}
                <div className="comparison-results mc-panel">
                    <h3>Player stats comparison</h3>

                    {tableFilters.length === 0 ? (
                        <p>No stat-based filters selected to compare.</p>
                    ) : (
                        <table className="run-table">
                            <thead>
                                <tr>
                                    <th>Player</th>
                                    {tableFilters.map((f, i) => (
                                        <th key={i}>{filterMap[f].label}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {validPlayers.map((p, i) => (
                                    <tr key={i}>
                                        <td>{p}</td>
                                        {tableFilters.map((f, j) => (
                                            <td key={j}>{sampleData[p][filterMap[f].key]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </Layout>
    );
}