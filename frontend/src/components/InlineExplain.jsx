import React, { useRef, useState, useEffect } from "react";

/**
 * InlineExplain
 * - Hover: shows a popup
 * - Click: pins the popup (stays until closed or another is clicked).
 * - Only one popup visible at a time across the page.
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
  "Forfeit": "A match that ended without a valid completion, often excluded from PB calculations.",
  "Rank": "A global position based on performance relative to other players.",
  "Recent Trends": "Charts and summaries that show how performance has changed over time.",
  "Run History": "A chronological list of recorded runs and match results."
};

function isExactTermMatch(visibleText, term) {
    if (!visibleText || !term) return False;

    const lower = visibleText.toLowerCase();
    const t = term.toLowerCase();

    return lower == t;
}

/* Module-level singleton to ensure only one popup is visible at a time */
let __INLINE_EXPLAIN_CURRENT = null;
function setCurrent(instance) {
  if (__INLINE_EXPLAIN_CURRENT && __INLINE_EXPLAIN_CURRENT !== instance) {
    try { __INLINE_EXPLAIN_CURRENT.close(); } catch (e) { /* ignore */ }
  }
  __INLINE_EXPLAIN_CURRENT = instance;
}
function clearCurrent(instance) {
  if (__INLINE_EXPLAIN_CURRENT === instance) __INLINE_EXPLAIN_CURRENT = null;
}

/* Helper to toggle body class that hides the small CSS tooltip (::after) */
function setBodyActive(flag) {
  try {
    if (flag) document.body.classList.add("inline-explain-active");
    else document.body.classList.remove("inline-explain-active");
  } catch (e) { /* ignore in non-browser env */ }
}

export default function InlineExplain({ term, explanation, children }) {
  const visibleText = (children && typeof children === "string") ? children : (term || "");
  const explain = explanation || DEFAULT_EXPLANATIONS[visibleText] || DEFAULT_EXPLANATIONS[term] || "";

  const anchorRef = useRef(null);
  const popupRef = useRef(null);

  const [open, setOpen] = useState(false);     // whether popup is rendered
  const [pinned, setPinned] = useState(false); // true when clicked/pinned
  const [pos, setPos] = useState({ top: 0, left: 0, arrow: "bottom" });

  /* Position popup relative to anchor */
  const positionPopup = () => {
    const anchor = anchorRef.current;
    const popup = popupRef.current;
    if (!anchor || !popup) return;

    const rect = anchor.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const margin = 8;
    const viewportW = document.documentElement.clientWidth;

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

  /* Close function used by singleton */
  const closeSelf = () => {
    setOpen(false);
    setPinned(false);
    clearCurrent(instanceAPI);
    // remove body active class when closing (no popup visible)
    // but only remove if this instance was the current one
    if (!__INLINE_EXPLAIN_CURRENT) setBodyActive(false);
  };

  /* Instance API stored for singleton control */
  const instanceAPI = {
    close: closeSelf,
    pin: () => { setPinned(true); setOpen(true); setCurrent(instanceAPI); setBodyActive(true); },
    unpin: () => { setPinned(false); setOpen(false); clearCurrent(instanceAPI); setBodyActive(false); }
  };

  /* Open transient (hover/focus) */
  const openTransient = () => {
    // set as current and show transient popup; body class hides small CSS tooltip globally
    setPinned(false);
    setCurrent(instanceAPI);
    setOpen(true);
    setBodyActive(true);
  };

  /* Open pinned (click) */
  const openPinned = () => {
    setPinned(true);
    setCurrent(instanceAPI);
    setOpen(true);
    // ensure small CSS tooltip is hidden immediately when clicked
    setBodyActive(true);
  };

  /* Click toggles pinned state; clicking should remove the small hover tooltip immediately */
  const onClick = (e) => {
    e.stopPropagation();
    if (pinned && open) {
      closeSelf();
      return;
    }
    openPinned();
  };

  /* Hover/focus handlers for transient popup */
  const onPointerEnter = () => {
    // show transient popup; will close on leave unless pinned
    // If another popup is pinned elsewhere, we still close it (singleton) and show this transient
    openTransient();
  };
  const onPointerLeave = () => {
    if (pinned) return;
    // only close if this instance is current
    if (__INLINE_EXPLAIN_CURRENT === instanceAPI) {
      closeSelf();
    } else {
      setOpen(false);
      setPinned(false);
      // if no other popup is current, remove body active
      if (!__INLINE_EXPLAIN_CURRENT) setBodyActive(false);
    }
  };
  const onFocus = () => openTransient();
  const onBlur = () => { if (!pinned) closeSelf(); };

  /* Keyboard: Enter/Space toggles pinned; Escape closes */
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (pinned && open) closeSelf();
      else openPinned();
    } else if (e.key === "Escape") {
      closeSelf();
    }
  };

  /* Document-level handlers: close on outside click or Escape */
  useEffect(() => {
    const onDocClick = (ev) => {
      if (!open) return;
      if (popupRef.current && popupRef.current.contains(ev.target)) return;
      if (anchorRef.current && anchorRef.current.contains(ev.target)) return;
      // if this instance is current, close it
      if (__INLINE_EXPLAIN_CURRENT === instanceAPI) closeSelf();
      else { setOpen(false); setPinned(false); if (!__INLINE_EXPLAIN_CURRENT) setBodyActive(false); }
    };
    const onKey = (ev) => {
      if (!open) return;
      if (ev.key === "Escape") closeSelf();
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", positionPopup);
    window.addEventListener("scroll", positionPopup, true);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", positionPopup);
      window.removeEventListener("scroll", positionPopup, true);
    };
  }, [open, pinned]);

  /* Reposition when opened */
  useEffect(() => {
    if (open) requestAnimationFrame(positionPopup);
  }, [open]);

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (__INLINE_EXPLAIN_CURRENT === instanceAPI) clearCurrent(instanceAPI);
      // ensure body class removed if no other popup exists
      if (!__INLINE_EXPLAIN_CURRENT) setBodyActive(false);
    };
  }, []);

  const shouldHighlight = isExactTermMatch(visibleText, term);

  return (
    <>
        {shouldHighlight ? (
            <span
                ref={anchorRef}
                className="highlight-term"
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-expanded={open}
                data-explain={explain || ""}
                onClick={onClick}
                onKeyDown={onKeyDown}
                onMouseEnter={onPointerEnter}
                onMouseLeave={onPointerLeave}
                onFocus={onFocus}
                onBlur={onBlur}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
            >
                {visibleText}
            </span>
        ) : (
            <span>{visibleText}</span>
        )}

      {open && (
        <div
          ref={popupRef}
          className={`inline-explain-popup ${pos.arrow === "top" ? "arrow-top" : "arrow-bottom"}${pinned ? " pinned" : ""}`}
          style={{ top: `${pos.top}px`, left: `${pos.left}px`, position: "absolute" }}
          role="dialog"
          aria-label={`${term || children} explanation`}
        >
          <div className="popup-row">
            <div className="popup-title">{term || children}</div>
            <button
              className="popup-close"
              aria-label="Close explanation"
              onClick={(e) => { e.stopPropagation(); closeSelf(); }}
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
