import React from 'react'

function ScanLine() {
  return (
    <div style={{
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 999,
      padding: "12px 26px",
      color: "rgba(255,255,255,0.6)",
      fontSize: 12,
      fontFamily: "monospace",
      letterSpacing: "0.1em",
      animation: "pulse-opacity 1.5s infinite",
    }}>
      INITIALIZING SPATIAL ENGINE…
    </div>
  );
}

export default ScanLine