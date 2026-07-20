import type { KnowledgeStatus, RiskStatus } from "../types/domain";

/**
 * MapLibre paint expressions cannot read CSS custom properties, so this is
 * a deliberate, intentionally-synchronized mirror of the hex values in
 * src/styles/tokens.css. If the palette changes, update both places.
 */
export const KNOWLEDGE_HEX: Record<KnowledgeStatus, string> = {
  unknown: "#5b6673",
  reported: "#6fb3e0",
  inspected: "#3d8fc4",
  documented: "#1c5a8c",
  verified: "#2ba7a1",
};

export const RISK_HEX: Record<RiskStatus, string> = {
  not_assessed: "#5b6673",
  low: "#4fae8a",
  medium: "#d8a638",
  high: "#d97a3d",
  specialist_required: "#c9503f",
};

export const DEMO_HEX = "#b57edc";
export const HEAT_SOURCE_HEX = "#d97a3d";
export const TM20A_HEX = "#d8a638";

/** Light-theme mirror of the same status scales (see tokens.css [data-theme="light"]). */
export const KNOWLEDGE_HEX_LIGHT: Record<KnowledgeStatus, string> = {
  unknown: "#8b96a3",
  reported: "#4f9bd6",
  inspected: "#1f6fa8",
  documented: "#0d3f66",
  verified: "#1d8a84",
};

export const RISK_HEX_LIGHT: Record<RiskStatus, string> = {
  not_assessed: "#8b96a3",
  low: "#2f8f68",
  medium: "#b2811e",
  high: "#c1602c",
  specialist_required: "#b23c2c",
};

export const DEMO_HEX_LIGHT = "#8a4fc4";
export const HEAT_SOURCE_HEX_LIGHT = "#c1602c";
export const TM20A_HEX_LIGHT = "#b2811e";
