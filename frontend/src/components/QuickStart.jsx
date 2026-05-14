import React from "react";
import "../css/global.css"

export default function QuickStartGuide({ onClose }) {
    return (
        <div className="quickstart-overlay" onClick={onClose}>
            <div className="quickstart-panel" onClick={(e) => e.stopPropagation()}>

                <button className="quickstart-close" onClick={onClose}>×</button>

                <h2 className="quickstart-title">Quick Start Guide</h2>

                <p className="quickstart-text">
                    The MCSR Ranked Analyzer lets you search for players, compare their stats,
                    and view explanations for key performance metrics.
                </p>

                <h3>Search Player</h3>
                <p className="quickstart-text">
                    Use the search bar to look up any player by their IGN. From here, you can view
                    a profile or navigate to the Compare Players tool.
                </p>

                <h3>Profile Page</h3>
                <p className="quickstart-text">
                    After searching for a player, you will be taken to their Profile Page. This page
                    displays detailed stats, personal bests, rankings, and other performance 
                    information. Inline explanations appear on highlighted terms to help you
                    understand each metric. 
                </p>

                <h3>Compare Players</h3>
                <p className="quickstart-text">
                    Enter player names into the search boxes. Add more players with the "+ Add Player"
                    button. Remove players with the × button next to each box.
                </p>

                <h3>Filters</h3>
                <p className="quickstart-text">
                    Open the Filters panel to choose which stats to compare. Toggle individual
                    filters or use "Select All" to enable everything at once.
                </p>

                <h3>Comparison Page</h3>
                <p className="quickstart-text">
                    After selecting players and filters, click Compare to view side-by-side stats.
                    Hover or click highlighted terms to see inline explanations. 
                </p>

                <h3>FAQ Page</h3>
                <p className="quickstart-text">
                    The FAQ Page provides answers to common questions about how stats are calculated,
                    how comparisons work, and what each metric means. This is a great place for users
                    who want deeper explanations or troubleshooting help. 
                </p>

                <button className="quickstart-continue" onClick={onClose}>
                    Continue to Home Page
                </button>
            </div>
        </div>
    );
}