/**
 * HouseMaster Pavlodar Thermal Map — domain types.
 *
 * These types implement the three-status model required by
 * DESIGN_SYSTEM_PRINCIPLES.md and GIS_MAP_SPEC.md:
 * Knowledge, Risk and Action are independent axes. They must never be
 * merged into a single "good/bad building" color or score.
 *
 * `null` / `"unknown"` always means "not known", never "zero" or "safe".
 */

export const KNOWLEDGE_STATUSES = [
  "unknown",
  "reported",
  "inspected",
  "documented",
  "verified",
] as const;
export type KnowledgeStatus = (typeof KNOWLEDGE_STATUSES)[number];

export const RISK_STATUSES = [
  "not_assessed",
  "low",
  "medium",
  "high",
  "specialist_required",
] as const;
export type RiskStatus = (typeof RISK_STATUSES)[number];

export const ACTION_STATUSES = [
  "none",
  "data_required",
  "inspection_required",
  "quick_win",
  "engineering_assessment",
  "modernization_candidate",
  "renovation_review",
  "verification_pending",
  "effect_verified",
] as const;
export type ActionStatus = (typeof ACTION_STATUSES)[number];

export const CONFIDENCE_LEVELS = ["T0", "T1", "T2", "T3", "T4"] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export const BUILDING_TYPES = [
  "soviet_standard",
  "modernized",
  "new_construction",
  "individual_project",
  "unknown",
] as const;
export type BuildingType = (typeof BUILDING_TYPES)[number];

export const CONSTRUCTION_PERIODS = [
  "before_1960",
  "1960_1979",
  "1980_1999",
  "2000_2015",
  "after_2015",
  "unknown",
] as const;
export type ConstructionPeriod = (typeof CONSTRUCTION_PERIODS)[number];

export const MANAGEMENT_FORMS = [
  "osi",
  "simple_partnership",
  "management_company",
  "other",
  "unknown",
] as const;
export type ManagementForm = (typeof MANAGEMENT_FORMS)[number];

export const METER_STATUSES = [
  "not_installed",
  "installed_uncalibrated",
  "installed_calibrated",
  "unknown",
] as const;
export type MeterStatus = (typeof METER_STATUSES)[number];

export const PASSPORT_STATUSES = [
  "empty",
  "identity_only",
  "topology_linked",
  "baseline_measured",
  "inspected",
  "cause_assessed",
  "post_work_verified",
] as const;
export type PassportStatus = (typeof PASSPORT_STATUSES)[number];

export const INSPECTION_STATUSES = [
  "not_scheduled",
  "scheduled",
  "in_progress",
  "completed",
  "blocked",
] as const;
export type InspectionStatus = (typeof INSPECTION_STATUSES)[number];

export const CONSUMPTION_DATA_STATUSES = [
  "not_collected",
  "partial",
  "complete_unvalidated",
  "complete_validated",
] as const;
export type ConsumptionDataStatus = (typeof CONSUMPTION_DATA_STATUSES)[number];

export const MV_STATUSES = [
  "not_applicable",
  "baseline_pending",
  "baseline_set",
  "intervention_in_progress",
  "post_measurement_pending",
  "effect_verified",
] as const;
export type MvStatus = (typeof MV_STATUSES)[number];

export const RENOVATION_REVIEW_STATUSES = [
  "not_reviewed",
  "under_review",
  "candidate",
  "approved",
  "not_applicable",
] as const;
export type RenovationReviewStatus = (typeof RENOVATION_REVIEW_STATUSES)[number];

export const HEAT_ZONES = [
  "zone_tec1_south",
  "zone_tec2_central",
  "zone_tec3_north",
  "zone_unassigned",
] as const;
export type HeatZone = (typeof HEAT_ZONES)[number];

export const OBSERVATION_CATEGORIES = [
  "none",
  "underheating",
  "overheating",
  "distribution_imbalance",
  "moisture",
  "basement_condition",
] as const;
export type ObservationCategory = (typeof OBSERVATION_CATEGORIES)[number];

/** Source-type classification shown in provenance UI (not a raw locator). */
export const SOURCE_TYPES = [
  "public_document",
  "operator_statement",
  "field_inspection",
  "resident_report",
  "public_map_reference",
  "demo_synthetic",
] as const;
export type SourceType = (typeof SOURCE_TYPES)[number];

export interface Provenance {
  sourceType: SourceType;
  sourceLabel: string;
  sourceUrl?: string;
  asOf: string; // ISO date
  confidence: ConfidenceLevel;
  verificationStatus: "reported" | "verified" | "disputed" | "unknown";
  claimId?: string;
}

/**
 * A single multi-family residential building (MKD) record as shown on the
 * map and in the Building Card. Field presentation mirrors
 * BUILDING_CARD_SPEC.md: every value carries provenance, not just raw data.
 */
export interface BuildingRecord {
  buildingId: string; // e.g. DEMO-PVL-001
  demo: boolean;
  displayName: string;
  lat: number;
  lng: number;
  locationStatus: "public_map_reference" | "approximate" | "verified" | "unknown";

  buildingType: BuildingType;
  constructionPeriod: ConstructionPeriod;
  floors: number | null;
  managementForm: ManagementForm;
  heatZone: HeatZone;

  knowledgeStatus: KnowledgeStatus;
  riskStatus: RiskStatus;
  actionStatus: ActionStatus;
  confidence: ConfidenceLevel;

  meterStatus: MeterStatus;
  passportStatus: PassportStatus;
  inspectionStatus: InspectionStatus;
  consumptionDataStatus: ConsumptionDataStatus;
  mvStatus: MvStatus;
  renovationReview: RenovationReviewStatus;

  observationCategory: ObservationCategory;
  observationNote?: string;

  lastUpdated: string; // ISO date

  connection: {
    heatSourceId: string | null;
    connectionPointId: string | null;
    responsibilityBoundaryStatus: "documented" | "disputed" | "unknown";
  };

  systems: {
    heatUnitStatus: "unknown" | "reported" | "observed" | "verified";
    pipeInsulationStatus: "unknown" | "poor" | "adequate" | "good";
    valvesStatus: "unknown" | "reported" | "observed" | "verified";
    basementStatus: "unknown" | "reported" | "observed" | "verified";
    envelopeStatus: "unknown" | "reported" | "observed" | "verified";
  };

  economics: {
    measurePackage: "none" | "P0" | "P1" | "P2" | "P3" | "P4" | "P5" | "unknown";
    capexStatus: "not_estimated" | "draft" | "reviewed";
    opexStatus: "not_estimated" | "draft" | "reviewed";
    economicGate: "not_opened" | "open" | "blocked" | "passed";
  };

  provenance: Provenance;
}

/** Approximate / public-reference infrastructure point (heat sources). */
export interface HeatSourceRecord {
  id: string;
  name: string;
  operator: string;
  lat: number;
  lng: number;
  locationStatus: "public_map_reference" | "approximate";
  verification: "not_officially_confirmed" | "officially_confirmed";
  installedCapacityGcalH: number | null;
  provenance: Provenance;
}

/** Schematic (non-cadastral) line representing the TM-20A project. */
export interface SchematicLineRecord {
  id: string;
  name: string;
  geometryStatus: "schematic";
  coordinates: [number, number][];
  description: string;
  provenance: Provenance;
}

export type MapLayerId =
  | "buildings"
  | "buildings_demo"
  | "heat_zones"
  | "heat_sources"
  | "tm20a"
  | "knowledge_level"
  | "heat_observations"
  | "recommended_actions"
  | "network_mains"
  | "connection_points"
  | "restriction_zones"
  | "modernization_projects"
  | "mv"
  | "renovation";

export interface MapLayerDefinition {
  id: MapLayerId;
  labelRu: string;
  hasData: boolean;
  emptyStateMessage?: string;
  required: boolean;
}
