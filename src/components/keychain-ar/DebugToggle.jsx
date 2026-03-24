export default function DebugToggle({ showLogs, setShowLogs }) {
  return (
    <div style={{ position: "absolute", top: 14, right: 14, zIndex: 10002, pointerEvents: "auto" }}>
      <button onClick={() => setShowLogs(v => !v)} style={{
        background: "rgba(0,0,0,0.6)", color: "#666",
        border: "1px solid #333", borderRadius: 6,
        padding: "4px 8px", fontSize: 10,
        fontFamily: "monospace", cursor: "pointer",
      }}>
        {showLogs ? "✕" : "dbg"}
      </button>
    </div>
  );
}