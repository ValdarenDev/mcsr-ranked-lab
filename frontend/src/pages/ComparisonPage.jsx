import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import "../css/global.css";

export default function ComparisonPage() {
    const { state } = useLocation();
    const { players, filters } = state || { players: [], filters: [] };

    return (
        <Layout>
            <div className="compare-container">
                <h1 className="compare-title">Compare Players</h1>

                <h3>Players:</h3>
                <ul>
                    {players.map((p, index) => (
                        <li key={index}>{p || "(empty)"}</li>
                    ))}
                </ul>

                <h3>Filters Applied</h3>
                <ul>
                    {filters.length > 0 ? (
                        filters.map((f, index) => <li key={index}>{f}</li>)
                    ) : (
                        <li>No filters selected</li>
                    )}
                </ul>

                <div className="comparison-results mc-panel">
                    <p>Comparison logic will go here</p>
                    <p>fetch stats for each player and compare them</p>
                </div>
            </div>
        </Layout>
    );
}