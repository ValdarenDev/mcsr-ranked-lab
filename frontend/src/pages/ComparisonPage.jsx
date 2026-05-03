import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPlayerProfile } from "../logic/compareLogic";
import Layout from "../components/Layout";
import "../css/global.css";
import InlineExplain from "../components/InlineExplain";

const DEFAULT_EXPLANATIONS = {
  "Elo": "A rating system that updates after each match to estimate player skill.",
  "ELO Rating": "A rating system that updates after each match to estimate player skill.",
  "Personal Best (PB)": "The player's fastest valid completion time recorded on their profile.",
  "Personal Best": "The player's fastest valid completion time recorded on their profile.",
  "Win-Loss Record": "A simple tally of wins and losses from recorded runs.",
  "W-L Record": "A simple tally of wins and losses from recorded runs.",
  "Win Streak": "A sequence of consecutive wins (or losses) a player currently has.",
  "Run": "An individual match or attempt recorded in the run history.",
  "Forfeit": "A match that ended without a valid completion, often excluded from PB calculations.",
  "Rank": "A global position based on performance relative to other players.",
  "Recent Trends": "Charts and summaries that show how performance has changed over time.",
  "Run History": "A chronological list of recorded runs and match results."
};

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

    const visibleFilterText = (rawFilter) => {
        if (rawFilter && typeof rawFilter === "object") {
            if (typeof rawFilter.label === "string") return rawFilter.label;
            try { return JSON.stringify(rawFilter); } catch (e) { return String(rawFilter); }
        }
        const key = String(rawFilter ?? "");
        return DEFAULT_EXPLANATIONS[key] ?? key;
    }

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
                        {(Array.isArray(filters) && filters.length > 0) ? (
                            filters.map((f, index) => {
                                const termProp = (typeof f === "string") ? f : (f?.label ?? String(f));
                                return (
                                <div className="filter-item" key={index} style={{ marginBottom: 8 }}>
                                    <InlineExplain term={termProp}>
                                    {termProp}
                                    </InlineExplain>
                                </div>
                                );
                            })
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