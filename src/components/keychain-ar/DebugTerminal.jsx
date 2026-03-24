export default function DebugTerminal({ logs, logRef }) {
  return (
    <div ref={logRef} style={{
      position: "absolute", top: 12, left: 12, right: 60,
      maxHeight: "38vh", overflowY: "auto",
      background: "rgba(0,0,0,0.92)", border: "1px solid #00FF88",
      borderRadius: 10, padding: "10px 12px",
      fontFamily: "monospace", fontSize: 11,
      color: "#00FF88", whiteSpace: "pre-wrap", wordBreak: "break-all",
      pointerEvents: "none",
    }}>
      <div style={{ color: "#fff", marginBottom: 6, fontWeight: "bold" }}>📟 Debug</div>
      {logs.map((l, i) => (
        <div key={i} style={{
          color: l.includes("❌") ? "#ff6b6b" : l.includes("⚠️") ? "#ffd93d" : l.includes("✅") ? "#00FF88" : "#888",
          lineHeight: 1.5,
        }}>{l}</div>
      ))}
    </div>
  );
}