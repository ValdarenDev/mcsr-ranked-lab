import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPlayerProfile } from "../logic/compareLogic";
import Layout from "../components/Layout";
import "../css/global.css";
import InlineExplain from "../components/InlineExplain";

export default function ComparisonPage() {
    const { state } = useLocation();
    const { players = [], filters = [] } = state || {};
    const [playerData, setPlayerData] = useState([]);

    const getProfileValue = (ign, key) => {
        const entry = playerData.find(p => p.ign === ign);
        return entry?.profile?.[key] ?? "—";
    };

    const getPlayerIGN = (ign) => {
        const entry = playerData.find(p => p.ign === ign);
        return entry?.profile?.ign ?? ign;
    };

    useEffect(() => {
        const load = async () => {
            const results = [];

            for (const ign of players) {
                if (!ign.trim()) continue;

                try {
                    const raw = await getPlayerProfile(ign);

                    const profile = {
                        ign: raw[0],
                        rank: raw[1],
                        elo: raw[2],
                        avg: raw[3],
                        streak: raw[4],
                        wl: raw[5],
                        pb: raw[6]
                    };

                    results.push({
                        ign,
                        profile
                    });

                } catch (err) {
                    console.error("Failed to fetch player:", ign, err);
                }
            }

            setPlayerData(results);
        };

        load();
    }, [players]);

    const normalizeFilter = (f) => {
        if (f === "ELO Rating") return "Elo";
        if (f === "Personal Best (PB)") return "Personal Best (PB)";
        if (f === "Average Completion Time") return "Average Completion Time";
        if (f === "Win-Loss Record") return "Win-Loss Record";
        if (f === "Rank") return "Rank";
        if (f === "Win Streak") return "Win Streak";
        return null;
    };

    const filterMap = {
        "Rank": { key: "rank", label: "Rank" },
        "Elo": { key: "elo", label: "Elo" },
        "Personal Best (PB)": { key: "pb", label: "Personal Best" },
        "Average Completion Time": { key: "avg", label: "Average Time" },
        "Win-Loss Record": { key: "wl", label: "W-L" },
        "Win Streak": { key: "streak", label: "Streak" }
    };

    const validPlayers = playerData.map(p => p.ign);

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
                            validPlayers.map((p, i) => <p key={i}>{getPlayerIGN(p)}</p>)
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
                            filters.map((f, index) => <p key={index}><InlineExplain term={f}>{f}</InlineExplain></p>)
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
                                        <td>{getPlayerIGN(p)}</td>
                                        {tableFilters.map((f, j) => (
                                            <td key={j}>
                                                {getProfileValue(p, filterMap[f].key)}
                                            </td>
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