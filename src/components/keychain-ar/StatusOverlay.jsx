import ScanLine from "./ScanLine";
import ScanPrompt from "./ScanPrompt";
import Chip from "./Chip";

export default function StatusOverlay({ status, placed }) {
  return (
    <div style={{
      position: "absolute", bottom: 130, left: "50%",
      transform: "translateX(-50%)", whiteSpace: "nowrap",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
    }}>
      {status === "loading" && <ScanLine />}
      {status === "unsupported" && <Chip color="#ff6b6b">❌ AR not supported on this device</Chip>}
      {status === "error" && <Chip color="#ff6b6b">❌ Failed — tap debug for details</Chip>}
      {status === "ready" && (
        <>
          <Chip pulse accent>✦ &nbsp;Tap ENTER AR below</Chip>
        </>
      )}
      {status === "ar-active" && !placed && (
        <ScanPrompt />
      )}
      {status === "ar-active" && placed && (
        <Chip color="#00FF88" dark>✦ &nbsp;Tap to place again</Chip>
      )}
    </div>
  );
}