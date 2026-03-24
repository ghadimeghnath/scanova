import React from 'react'

function ScanPrompt() {
   return (
    <div style={{
      background: "rgba(0,0,0,0.82)",
      backdropFilter: "blur(16px)",
      border: "1px solid rgba(0,229,255,0.4)",
      borderRadius: 16,
      padding: "14px 24px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      boxShadow: "0 0 30px rgba(0,229,255,0.15)",
    }}>
      {/* Animated scan icon */}
      <div style={{ position: "relative", width: 28, height: 28, flexShrink: 0 }}>
        <div style={{
          position: "absolute", inset: 0,
          border: "2px solid #00e5ff",
          borderRadius: 4,
        }} />
        <div style={{
          position: "absolute", left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg,transparent,#00e5ff,transparent)",
          top: "40%",
          animation: "scan-move 1.2s ease-in-out infinite alternate",
        }} />
      </div>
      <div>
        <div style={{ color: "#fff", fontSize: 13, fontFamily: "'Georgia',serif", fontWeight: 700, letterSpacing: "0.05em" }}>
          Scanning surface…
        </div>
        <div style={{ color: "rgba(0,229,255,0.7)", fontSize: 11, fontFamily: "monospace", marginTop: 2 }}>
          Point at floor · Tap cyan ring to place
        </div>
      </div>
    </div>
  );
}

export default ScanPrompt