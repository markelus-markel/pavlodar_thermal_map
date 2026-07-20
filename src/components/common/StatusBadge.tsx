import "./StatusBadge.css";

interface StatusBadgeProps {
  label: string;
  value: string;
  colorVar: string;
  size?: "sm" | "md";
}

/**
 * Generic status badge. Always renders text alongside color (accessibility
 * principle: never color alone). `label` is the axis name (Knowledge/Risk/
 * Action), `value` is the human-readable status text.
 */
export function StatusBadge({ label, value, colorVar, size = "md" }: StatusBadgeProps) {
  return (
    <span className={`status-badge status-badge--${size}`} title={`${label}: ${value}`}>
      <span className="status-badge__dot" style={{ background: `var(${colorVar})` }} aria-hidden="true" />
      <span className="status-badge__label">{label}</span>
      <span className="status-badge__value">{value}</span>
    </span>
  );
}
