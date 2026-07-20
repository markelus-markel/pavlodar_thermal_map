import type {
  ActionStatus,
  BuildingRecord,
  BuildingType,
  ConfidenceLevel,
  ConstructionPeriod,
  HeatZone,
  InspectionStatus,
  KnowledgeStatus,
  ManagementForm,
  MeterStatus,
  MvStatus,
  PassportStatus,
  RenovationReviewStatus,
  RiskStatus,
} from "../types/domain";

export interface FilterState {
  heatZone: HeatZone[];
  buildingType: BuildingType[];
  constructionPeriod: ConstructionPeriod[];
  managementForm: ManagementForm[];
  meterStatus: MeterStatus[];
  knowledgeStatus: KnowledgeStatus[];
  confidence: ConfidenceLevel[];
  riskStatus: RiskStatus[];
  actionStatus: ActionStatus[];
  passportStatus: PassportStatus[];
  inspectionStatus: InspectionStatus[];
  mvStatus: MvStatus[];
  renovationReview: RenovationReviewStatus[];
  includeDemo: boolean;
  searchQuery: string;
}

export const EMPTY_FILTER_STATE: FilterState = {
  heatZone: [],
  buildingType: [],
  constructionPeriod: [],
  managementForm: [],
  meterStatus: [],
  knowledgeStatus: [],
  confidence: [],
  riskStatus: [],
  actionStatus: [],
  passportStatus: [],
  inspectionStatus: [],
  mvStatus: [],
  renovationReview: [],
  includeDemo: true,
  searchQuery: "",
};

export type MultiSelectFilterKey =
  | "heatZone"
  | "buildingType"
  | "constructionPeriod"
  | "managementForm"
  | "meterStatus"
  | "knowledgeStatus"
  | "confidence"
  | "riskStatus"
  | "actionStatus"
  | "passportStatus"
  | "inspectionStatus"
  | "mvStatus"
  | "renovationReview";

/** Semantics per FILTER_AND_SEARCH_SPEC.md:
 * multi-select within a group = OR; across groups = AND. */
export function applyFilters(buildings: BuildingRecord[], filters: FilterState): BuildingRecord[] {
  const groups: [MultiSelectFilterKey, keyof BuildingRecord][] = [
    ["heatZone", "heatZone"],
    ["buildingType", "buildingType"],
    ["constructionPeriod", "constructionPeriod"],
    ["managementForm", "managementForm"],
    ["meterStatus", "meterStatus"],
    ["knowledgeStatus", "knowledgeStatus"],
    ["confidence", "confidence"],
    ["riskStatus", "riskStatus"],
    ["actionStatus", "actionStatus"],
    ["passportStatus", "passportStatus"],
    ["inspectionStatus", "inspectionStatus"],
    ["mvStatus", "mvStatus"],
    ["renovationReview", "renovationReview"],
  ];

  return buildings.filter((b) => {
    if (!filters.includeDemo && b.demo) return false;

    for (const [filterKey, field] of groups) {
      const selected = filters[filterKey];
      if (selected.length === 0) continue; // no restriction
      const value = b[field] as unknown as string;
      if (!selected.includes(value as never)) return false;
    }

    if (filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.trim().toLowerCase();
      const haystack = [
        b.buildingId,
        b.displayName,
        b.buildingType,
        b.heatZone,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });
}

export function countActiveFilters(filters: FilterState): number {
  const keys: MultiSelectFilterKey[] = [
    "heatZone",
    "buildingType",
    "constructionPeriod",
    "managementForm",
    "meterStatus",
    "knowledgeStatus",
    "confidence",
    "riskStatus",
    "actionStatus",
    "passportStatus",
    "inspectionStatus",
    "mvStatus",
    "renovationReview",
  ];
  return keys.reduce((sum, k) => sum + filters[k].length, 0) + (filters.includeDemo ? 0 : 1);
}
