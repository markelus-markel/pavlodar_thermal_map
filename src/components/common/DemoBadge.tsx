import "./DemoBadge.css";

export function DemoBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`demo-badge ${compact ? "demo-badge--compact" : ""}`}>
      {compact ? "DEMO" : "DEMO DATA — NOT A REAL BUILDING ASSESSMENT"}
    </span>
  );
}
