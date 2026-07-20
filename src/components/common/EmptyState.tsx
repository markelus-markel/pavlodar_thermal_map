import type { ReactNode } from "react";
import "./EmptyState.css";

interface EmptyStateProps {
  code: string;
  message: string;
  action?: ReactNode;
  compact?: boolean;
}

/**
 * Generic empty/error state renderer following ERROR_AND_EMPTY_STATES.md:
 * every state names its machine code and never implies "zero" when data is
 * simply missing.
 */
export function EmptyState({ code, message, action, compact = false }: EmptyStateProps) {
  return (
    <div className={`empty-state ${compact ? "empty-state--compact" : ""}`}>
      <div className="empty-state__code">{code}</div>
      <div className="empty-state__message">{message}</div>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
