import { useState } from "react";

const ToolEvents = ({ events, streaming }) => {
  const [expanded, setExpanded] = useState(false);

  if (!events || events.length === 0) return null;

  const summary = buildSummary(events);

  return (
    <div className="thinking-panel">
      <button
        className="thinking-header"
        onClick={() => setExpanded((p) => !p)}
      >
        <span className="thinking-title">{summary}</span>
        <span className={`thinking-chevron ${expanded ? "thinking-chevron--up" : ""}`}>
          &#8964;
        </span>
      </button>

      {expanded && (
        <div className="thinking-steps">
          {events.map((evt, i) => {
            const isLast = i === events.length - 1;
            const isDone = !streaming || !isLast;
            return (
              <div key={i} className="thinking-step">
                <span className={`thinking-icon ${isDone ? "thinking-icon--done" : "thinking-icon--pending"}`}>
                  {isDone ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.2"/>
                      <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                  )}
                </span>
                <span className="thinking-step-text">
                  {evt.type === "call"
                    ? <>Calling tool <code>{evt.name}</code>{evt.args ? ` with ${formatArgs(evt.args)}` : ""}</>
                    : <>Tool <code>{evt.name}</code> returned a result</>
                  }
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function buildSummary(events) {
  const calls = events.filter(e => e.type === "call").map(e => e.name);
  const unique = [...new Set(calls)];
  if (unique.length === 0) return "Used a tool";
  if (unique.length === 1) return `Called ${unique[0]}`;
  return `Called ${unique.slice(0, -1).join(", ")} and ${unique[unique.length - 1]}`;
}

function formatArgs(args) {
  if (!args || typeof args !== "object") return "";
  const entries = Object.entries(args);
  if (entries.length === 0) return "";
  return entries.map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ");
}

export default ToolEvents;