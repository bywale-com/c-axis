import React from "react";

/** Circular arrow control — same SVG/hover behavior as home tiles & news cards */
export const ArrowButton: React.FC<{ href?: string; light?: boolean }> = ({ href = "#", light }) => (
  <a className={`hq-arrow-btn${light ? " hq-arrow-btn--light" : ""}`} href={href} aria-label="Navigate">
    <span className="hq-arrow-btn__icon">
      <svg width="28" height="21" viewBox="0 0 29 23" fill="none">
        <line y1="11.5" x2="28" y2="11.5" stroke="currentColor" />
        <path d="M16 1L28 11.5L16 22" stroke="currentColor" />
      </svg>
    </span>
  </a>
);
