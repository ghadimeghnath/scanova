import React from 'react'

function Chip({ children, color = "#fff", dark = false, pulse = false, accent = false }) {
 return (
    <div style={{
      background: dark
        ? color
        : accent
          ? "linear-gradient(135deg,rgba(0,229,255,0.15),rgba(0,114,255,0.1))"
          : "rgba(0,0,0,0.82)",
      backdropFilter: "blur(16px)",
      color: dark ? "#000" : color,
      padding: "13px 28px",
      borderRadius: 999,
      border: accent ? "1px solid rgba(0,229,255,0.5)" : `1px solid ${color}44`,
      fontSize: 13,
      fontFamily: "'Georgia', serif",
      fontWeight: 700,
      letterSpacing: "0.06em",
      textAlign: "center",
      animation: pulse ? "pulse-opacity 2s infinite" : "none",
      boxShadow: accent
        ? "0 0 24px rgba(0,229,255,0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
        : `0 0 20px ${color}22`,
    }}>
      {children}
    </div>
  );
}

export default Chip