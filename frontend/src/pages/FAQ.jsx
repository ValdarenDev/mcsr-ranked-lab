import React, { useState } from "react";
import Layout from "../components/Layout";
import "../css/global.css";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            q: "What is MCSR Ranked Analyzer?",
            a: "It's a tool that lets you look up any player's ranked stats, trends, win/loss history, and performance over time."
        },
        {
            q: "Where does the data come from?",
            a: "All data is pulled from the official MCSR Ranked API and updated in real time."
        },
    ];
    
    return (
        <Layout>
            <p className="faq-top-link"><a href="/">Search Player</a></p>
            
            <div className="faq-container">
                <h1 className="faq-title">FAQ</h1>

                {faqs.map((item, index) => (
                    <div 
                    key={item} 
                    className={`faq-item ${openIndex === index ? "open" : ""}`} 
                    onClick={() => toggle(index)}
                    >
                        <h3 className="faq-question">
                            {item.q}
                            <span className="faq-arrow">{openIndex === index ? " ▲" : " ▼"}</span>
                        </h3>

                        <div className="faq-answer">
                            <p>{item.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}