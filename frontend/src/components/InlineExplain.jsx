import React, { useRef, useState, useEffect } from "react";

/**
 * Inline Explanation:
 * - term: string (title shown in popup header; optional if children text is used)
 * - explanation: string (required or will try to lookup from DEFAULT_EXPLANATIONS)
 * - children: node (text to render inline; if omitted, term is used)
 * 
 * - hover: shows a small CSS tooltip (via data-explain)
 * - click: opens a small anchored popup with an X to dismiss
 */

const DEFAULT_EXPLANATIONS = {
    "Elo": "A rating system that updates after each match to estimate player skill.",
    "ELO Rating": "A rating system that updates after each match to estimate player skill.",
    "Personal Best (PB)": "The player's fastest valid completion time recorded on their profile.",
    "Personal Best": "The player's fastest valid completion time recorded on their profile.",
    "Win-Loss Record": "A simple tally of wins and losses from recorded runs.",
    "W-L Record": "A simple tally of wins and losses from recorded runs.",
    "Win Streak": "A sequence of consecutive wins (or losses) a player currently has.",
    "Run": "An individual match or attempt recorded in the run history.",
    "Forfeit": "A match that ended without a valid completion, often excludede from PB calculations.",
    "Rank": "A global position based on performance relative to other players.",
    "Recent Trends": "Charts and summaries that show how performance has changed over time.",
    "Run History": "A chronological list of recorded runs and match results."
};

export default function InlineExplain({ term, explanation, children }) {
    const text = (children && typeof children === "string") ? children : (term || "");
    const explain = explanation || DEFAULT_EXPLANATIONS[text] || DEFAULT_EXPLANATIONS[term] || null;

    const elRef = useRef(null);
    const popupRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0, arrow: "bottom" });

    const positionPopup = () => {
        const anchor = elRef.current;
        const popup = popupRef.current;
        if (!anchor || !popup) return;

        const rect = anchor.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        const margin = 8;
        const viewportW = document.documentElement.clientWidth;
        const viewportH = document.documentElement.clientHeight;

        let top = window.scrollY + rect.top - popupRect.height - margin;
        let left = window.scrollX + rect.left + (rect.width / 2) - (popupRect.width / 2);
        let arrow = "bottom";

        if (top < window.scrollY + 10) {
            top = window.scrollY + rect.bottom + margin;
            arrow = "top";
        }

        if (left < 8) left = 8;
        if (left + popupRect.width > window.scrollX + viewportW - 8) {
            left = window.scrollX + viewportW - popupRect.width - 8;
        }

        setPos({ top, left, arrow });
    };

    useEffect(() => {
        if (!open) return;
        const onDocClick = (ev) => {
            if (popupRef.current && !popupRef.current.contains(ev.target) && elRef.current && !elRef.current.contains(ev.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("click", onDocClick);
        window.addEventListener("resize", positionPopup);
        window.addEventListener("scroll", positionPopup, true);
        return () => {
            document.removeEventListener("click", onDocClick);
            window.removeEventListener("resize", positionPopup);
            window.removeEventListener("scroll", positionPopup, true);
        };
    }, [open]);

    useEffect(() => {
        if (open) {
            requestAnimationFrame(positionPopup);
        }
    }, [open]);

    const onKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((s) => !s);
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    return (
        <>
            <span
                ref={elRef}
                className="highlight-term"
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-expanded={open}
                data-explain={explain || ""}
                onClick={(e) => { e.stopPropagation(); setOpen((s) => !s); }}
                onKeyDown={onKeyDown}
            >
                {children || term}
            </span>

            {open && (
                <div
                    ref={popupRef}
                    className={`inline-explain-popup ${pos.arrow === "top" ? "arrow-top" : "arrow-bottom"}`}
                    style={{ top: `${pos.top}px`, left: `${pos.left}px`, position: "absolute"}}
                    role="dialog"
                    aria-label={`${term || children} explanation`}
                >
                    <div className="popup-row">
                        <div className="popup-title">{term || children}</div>
                        <button
                            className="popup-close"
                            aria-label="Close explanation"
                            onClick={() => setOpen(false)}
                        >
                            ✕
                        </button>
                    </div>
                    <div className="popup-body">
                        {explain || "No explanation available."}
                    </div>
                </div>
            )}
        </>
    );
}