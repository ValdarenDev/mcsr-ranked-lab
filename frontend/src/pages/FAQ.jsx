import React, { useState } from "react";
import Layout from "../components/Layout";
import "../css/global.css";
import InlineExplain from "../components/InlineExplain";

export default function FAQ() {
    const [openItems, setOpenItems] = useState([]);

    const toggle = (index) => {
        if (openItems.includes(index)) {
            setOpenItems(openItems.filter((i) => i !== index));
        } else {
            setOpenItems([...openItems, index]);
        }
    };

    const faqs = [
        {
            q: "What is MCSR Ranked Analyzer?",
            a: "It's a tool that lets you look up any player's ranked stats, trends, win/loss history, and performance over time."
        },
        {
            q: "What is Minecraft Speed Running?",
            a: "Minecraft Speed Running (MCSR) is a competitive ladder where players race to complete a Minecraft seed as quickly as possible. Players are matched against each other of similar skill and earn or lose rating based on performance."
        },
        {
            q: "How does ranked work?",
            a: "Players queue into a match, receive the same seed, and race to finish. The faster player wins and gains rating; the slower player loses rating."
        },
        {
            q: "What is the seed type?",
            a: "Ranked matches use fixed seeds per match so both players compete on identical terrain and structures."
        },
        {
            q: "What counts as a completed run?",
            a: "A run is considered complete when the player enters the End portal and defeats the Ender Dragon."
        },
        {
            q: "How is matchmaking determined?",
            a: "Players are matched based on ELO rating and queue availability."
        },
        {
            q: "Why did I gain or lose so much ELO?",
            a: "ELO changes depend on the rating difference between players. Upsets (beating a higher-rated player) give more players."
        },
        {
            q: "What is a win streak?",
            a: "A win streak is the number of consecutive matches you've won. They are tracked for statistical purposes but do not affect rating."
        },
        {
            q: "Why is my profile not showing?",
            a: "Your profile may not appear if you have not played ranked matches yet, changed your IGN recently, or the API has not updated."
        },
        {
            q: "How often do stats update?",
            a: "Stats update automatically when new match data is processed by the MCSR API."
        },
        {
            q: "What are recent trends?",
            a: "Trends show how your performance changes over time, including rating movement, win/loss patterns, and average completion times."
        },
        {
            q: "Why is my IGN not found?",
            a: "Make sure your userame is spelled exactly as it appears in Minecraft. If you recently changed your name, the API may take time to update."
        },
        {
            q: "Do I need an account?",
            a: "This MCSR platform, like most MCSR platforms, use your Minecraft IGN as your identity. No separate account is required."
        },
        {
            q: "Where does the data come from?",
            a: "All data is pulled from the official MCSR Ranked API and updated in real time."
        },
    ];

    const HIGHLIGHT_TERMS = [
        "Elo",
        "Elo Rating",
        "Personal Best (PB)",
        "Personal Best",
        "Win-Loss Record",
        "W-L Record",
        "Win Streak",
        "Run",
        "Forfeit",
        "Rank",
        "Recent Trends",
        "Run History"
    ];

    const renderHighlights = (text) => {
        if (!text || typeof text !== "string") return text;

        // Sort longest first so multi-word terms match correctly
        const sorted = [...HIGHLIGHT_TERMS].sort((a, b) => b.length - a.length);

        // Escape regex characters
        const escaped = sorted.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

        // Whole-word match only using \b boundaries
        const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");

        const parts = text.split(regex);

        return parts.map((part, i) => {
            if (!part) return null;
            
            const match = sorted.find(t => t.toLowerCase() === part.toLowerCase());
            if (match) {
                return <InlineExplain key={i} term={match}>{part}</InlineExplain>;
            }

            return <React.Fragment key={i}>{part}</React.Fragment>;
        });
    };
    
    return (
        <Layout>
            <p className="faq-top-links">
                <a href="/">Search Player</a>
                <span className="faq-separator"> | </span>
                <a href="/compare">Compare Players</a>
            </p>

            <div className="faq-container">
                <h1 className="faq-title">FAQ</h1>

                {faqs.map((item, index) => {
                    const isOpen = openItems.includes(index);

                    return (
                        <div 
                        key={index} 
                        className={`faq-item ${isOpen ? "open" : ""}`}
                        onClick={() => toggle(index)}
                        >
                            <h3 className="faq-question">
                                {item.q}
                                <span className="faq-arrow">{isOpen ? " ▲" : " ▼"}</span>
                            </h3>

                            <div className="faq-answer">
                                <p>{renderHighlights(item.a)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Layout>
    );
}