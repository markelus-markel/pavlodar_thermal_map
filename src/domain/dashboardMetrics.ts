import type { BuildingRecord } from "../types/domain";

export interface DashboardMetrics {
  total: number;
  demoCount: number;
  dataInsufficient: number; // knowledge = unknown or reported only
  inspected: number; // inspection completed
  inspectionRequired: number; // action = inspection_required
  quickWins: number; // action = quick_win
  engineeringAssessment: number; // action = engineering_assessment
  modernizationCandidates: number; // action = modernization_candidate
  mvReady: number; // mvStatus effect_verified or post_measurement_pending
}

/**
 * All figures are derived from the currently loaded/filtered GeoJSON —
 * never hardcoded — per DASHBOARD_SPEC.md KPI contract.
 */
export function computeDashboardMetrics(buildings: BuildingRecord[]): DashboardMetrics {
  return {
    total: buildings.length,
    demoCount: buildings.filter((b) => b.demo).length,
    dataInsufficient: buildings.filter(
      (b) => b.knowledgeStatus === "unknown" || b.knowledgeStatus === "reported"
    ).length,
    inspected: buildings.filter((b) => b.inspectionStatus === "completed").length,
    inspectionRequired: buildings.filter((b) => b.actionStatus === "inspection_required").length,
    quickWins: buildings.filter((b) => b.actionStatus === "quick_win").length,
    engineeringAssessment: buildings.filter((b) => b.actionStatus === "engineering_assessment")
      .length,
    modernizationCandidates: buildings.filter(
      (b) => b.actionStatus === "modernization_candidate"
    ).length,
    mvReady: buildings.filter(
      (b) => b.mvStatus === "effect_verified" || b.mvStatus === "post_measurement_pending"
    ).length,
  };
}
