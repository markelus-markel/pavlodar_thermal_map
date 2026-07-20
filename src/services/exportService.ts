import type { BuildingRecord } from "../types/domain";
import { toCsv } from "../utils/csv";

/**
 * Only "safe" fields are exported: no raw source locators, no free-text
 * observation notes with potential personal content, no internal claim IDs.
 * Matches DATA_PROVENANCE_UI.md "public summary" principle: source class,
 * date, confidence — not restricted locator/raw evidence.
 */
const SAFE_COLUMNS = [
  "buildingId",
  "demo",
  "displayName",
  "lat",
  "lng",
  "locationStatus",
  "buildingType",
  "constructionPeriod",
  "floors",
  "managementForm",
  "heatZone",
  "knowledgeStatus",
  "riskStatus",
  "actionStatus",
  "confidence",
  "meterStatus",
  "passportStatus",
  "inspectionStatus",
  "consumptionDataStatus",
  "mvStatus",
  "renovationReview",
  "observationCategory",
  "lastUpdated",
  "provenanceSourceType",
  "provenanceAsOf",
] as const;

function toSafeRow(b: BuildingRecord): Record<string, unknown> {
  return {
    buildingId: b.buildingId,
    demo: b.demo,
    displayName: b.displayName,
    lat: b.lat,
    lng: b.lng,
    locationStatus: b.locationStatus,
    buildingType: b.buildingType,
    constructionPeriod: b.constructionPeriod,
    floors: b.floors,
    managementForm: b.managementForm,
    heatZone: b.heatZone,
    knowledgeStatus: b.knowledgeStatus,
    riskStatus: b.riskStatus,
    actionStatus: b.actionStatus,
    confidence: b.confidence,
    meterStatus: b.meterStatus,
    passportStatus: b.passportStatus,
    inspectionStatus: b.inspectionStatus,
    consumptionDataStatus: b.consumptionDataStatus,
    mvStatus: b.mvStatus,
    renovationReview: b.renovationReview,
    observationCategory: b.observationCategory,
    lastUpdated: b.lastUpdated,
    provenanceSourceType: b.provenance.sourceType,
    provenanceAsOf: b.provenance.asOf,
  };
}

export function exportToCsv(buildings: BuildingRecord[]): string {
  return toCsv(buildings.map(toSafeRow), [...SAFE_COLUMNS]);
}

export function exportToGeoJson(buildings: BuildingRecord[]): string {
  const fc = {
    type: "FeatureCollection" as const,
    features: buildings.map((b) => ({
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [b.lng, b.lat] },
      properties: toSafeRow(b),
    })),
  };
  return JSON.stringify(fc, null, 2);
}

export function downloadTextFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
