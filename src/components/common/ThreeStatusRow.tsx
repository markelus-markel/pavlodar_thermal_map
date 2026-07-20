import type { BuildingRecord } from "../../types/domain";
import {
  ACTION_COLOR_VAR,
  ACTION_LABELS,
  KNOWLEDGE_COLOR_VAR,
  KNOWLEDGE_LABELS,
  RISK_COLOR_VAR,
  RISK_LABELS,
} from "../../domain/statusRegistry";
import { StatusBadge } from "./StatusBadge";
import "./ThreeStatusRow.css";

interface Props {
  building: Pick<BuildingRecord, "knowledgeStatus" | "riskStatus" | "actionStatus">;
  size?: "sm" | "md";
}

/**
 * Renders the three independent status axes together but never merges them
 * into a single color/badge, per DESIGN_SYSTEM_PRINCIPLES.md principle 2.
 */
export function ThreeStatusRow({ building, size = "md" }: Props) {
  return (
    <div className="three-status-row">
      <StatusBadge
        label="Знание"
        value={KNOWLEDGE_LABELS[building.knowledgeStatus]}
        colorVar={KNOWLEDGE_COLOR_VAR[building.knowledgeStatus]}
        size={size}
      />
      <StatusBadge
        label="Риск"
        value={RISK_LABELS[building.riskStatus]}
        colorVar={RISK_COLOR_VAR[building.riskStatus]}
        size={size}
      />
      <StatusBadge
        label="Действие"
        value={ACTION_LABELS[building.actionStatus]}
        colorVar={ACTION_COLOR_VAR[building.actionStatus]}
        size={size}
      />
    </div>
  );
}
