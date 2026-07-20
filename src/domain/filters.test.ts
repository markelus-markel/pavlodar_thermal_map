import { describe, expect, it } from "vitest";
import { applyFilters, EMPTY_FILTER_STATE } from "./filters";
import type { BuildingRecord } from "../types/domain";

function makeBuilding(overrides: Partial<BuildingRecord>): BuildingRecord {
  return {
    buildingId: "B-1",
    demo: true,
    displayName: "Test",
    lat: 52.28,
    lng: 76.97,
    locationStatus: "approximate",
    buildingType: "soviet_standard",
    constructionPeriod: "1960_1979",
    floors: 5,
    managementForm: "management_company",
    heatZone: "zone_tec1_south",
    knowledgeStatus: "reported",
    riskStatus: "not_assessed",
    actionStatus: "data_required",
    confidence: "T1",
    meterStatus: "unknown",
    passportStatus: "identity_only",
    inspectionStatus: "not_scheduled",
    consumptionDataStatus: "not_collected",
    mvStatus: "not_applicable",
    renovationReview: "not_reviewed",
    observationCategory: "none",
    lastUpdated: "2026-01-01",
    connection: { heatSourceId: null, connectionPointId: null, responsibilityBoundaryStatus: "unknown" },
    systems: {
      heatUnitStatus: "unknown",
      pipeInsulationStatus: "unknown",
      valvesStatus: "unknown",
      basementStatus: "unknown",
      envelopeStatus: "unknown",
    },
    economics: {
      measurePackage: "unknown",
      capexStatus: "not_estimated",
      opexStatus: "not_estimated",
      economicGate: "not_opened",
    },
    provenance: {
      sourceType: "demo_synthetic",
      sourceLabel: "test",
      asOf: "2026-01-01",
      confidence: "T1",
      verificationStatus: "unknown",
    },
    ...overrides,
  };
}

describe("applyFilters", () => {
  const buildings = [
    makeBuilding({ buildingId: "A", heatZone: "zone_tec1_south", riskStatus: "low" }),
    makeBuilding({ buildingId: "B", heatZone: "zone_tec2_central", riskStatus: "high" }),
    makeBuilding({ buildingId: "C", heatZone: "zone_tec1_south", riskStatus: "high", demo: false }),
  ];

  it("returns all buildings with no filters", () => {
    expect(applyFilters(buildings, EMPTY_FILTER_STATE)).toHaveLength(3);
  });

  it("filters by single group (OR within group)", () => {
    const result = applyFilters(buildings, {
      ...EMPTY_FILTER_STATE,
      riskStatus: ["low", "high"],
    });
    expect(result).toHaveLength(3);
  });

  it("applies AND across groups", () => {
    const result = applyFilters(buildings, {
      ...EMPTY_FILTER_STATE,
      heatZone: ["zone_tec1_south"],
      riskStatus: ["high"],
    });
    expect(result.map((b) => b.buildingId)).toEqual(["C"]);
  });

  it("excludes demo buildings when includeDemo is false", () => {
    const result = applyFilters(buildings, { ...EMPTY_FILTER_STATE, includeDemo: false });
    expect(result.map((b) => b.buildingId)).toEqual(["C"]);
  });

  it("filters by search query across id/name/type/zone", () => {
    const result = applyFilters(buildings, { ...EMPTY_FILTER_STATE, searchQuery: "tec2" });
    expect(result.map((b) => b.buildingId)).toEqual(["B"]);
  });
});
