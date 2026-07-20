import { describe, expect, it } from "vitest";
import { importBuildings } from "../services/importService";

const validGeoJson = JSON.stringify({
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [76.97, 52.28] },
      properties: {
        buildingId: "TEST-001",
        demo: true,
        displayName: "Test building",
        knowledgeStatus: "reported",
        riskStatus: "not_assessed",
        actionStatus: "data_required",
      },
    },
  ],
});

describe("importBuildings — GeoJSON", () => {
  it("imports a valid feature collection", () => {
    const result = importBuildings("sample.geojson", validGeoJson);
    expect(result.format).toBe("geojson");
    expect(result.validBuildings).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
    expect(result.validBuildings[0].buildingId).toBe("TEST-001");
  });
});

describe("importBuildings — CSV", () => {
  const header =
    "buildingId,demo,displayName,lat,lng,locationStatus,buildingType,constructionPeriod,floors,managementForm,heatZone,knowledgeStatus,riskStatus,actionStatus,confidence,meterStatus,passportStatus,inspectionStatus,consumptionDataStatus,mvStatus,renovationReview,observationCategory,lastUpdated";

  it("imports a valid CSV row", () => {
    const row =
      "CSV-001,true,CSV building,52.28,76.97,approximate,soviet_standard,1960_1979,5,management_company,zone_tec2_central,reported,not_assessed,data_required,T1,unknown,identity_only,not_scheduled,not_collected,not_applicable,not_reviewed,none,2026-07-10";
    const result = importBuildings("sample.csv", `${header}\n${row}\n`);
    expect(result.validBuildings).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });

  it("flags a missing Building ID", () => {
    const row =
      ",true,No ID,52.28,76.97,approximate,soviet_standard,1960_1979,5,management_company,zone_tec2_central,reported,not_assessed,data_required,T1,unknown,identity_only,not_scheduled,not_collected,not_applicable,not_reviewed,none,2026-07-10";
    const result = importBuildings("sample.csv", `${header}\n${row}\n`);
    expect(result.validBuildings).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].messages.join(" ")).toMatch(/Building ID/);
  });

  it("flags invalid coordinates", () => {
    const row =
      "CSV-002,true,Bad coords,999,76.97,approximate,soviet_standard,1960_1979,5,management_company,zone_tec2_central,reported,not_assessed,data_required,T1,unknown,identity_only,not_scheduled,not_collected,not_applicable,not_reviewed,none,2026-07-10";
    const result = importBuildings("sample.csv", `${header}\n${row}\n`);
    expect(result.validBuildings).toHaveLength(0);
    expect(result.errors[0].messages.join(" ")).toMatch(/координаты/i);
  });

  it("flags unknown enum values", () => {
    const row =
      "CSV-003,true,Bad enum,52.28,76.97,approximate,soviet_standard,1960_1979,5,management_company,zone_tec2_central,super_verified,not_assessed,data_required,T1,unknown,identity_only,not_scheduled,not_collected,not_applicable,not_reviewed,none,2026-07-10";
    const result = importBuildings("sample.csv", `${header}\n${row}\n`);
    expect(result.validBuildings).toHaveLength(0);
    expect(result.errors[0].messages.join(" ")).toMatch(/Неизвестное значение/);
  });

  it("flags duplicate Building IDs", () => {
    const row1 =
      "CSV-004,true,Dup 1,52.28,76.97,approximate,soviet_standard,1960_1979,5,management_company,zone_tec2_central,reported,not_assessed,data_required,T1,unknown,identity_only,not_scheduled,not_collected,not_applicable,not_reviewed,none,2026-07-10";
    const row2 =
      "CSV-004,true,Dup 2,52.29,76.98,approximate,soviet_standard,1960_1979,5,management_company,zone_tec2_central,reported,not_assessed,data_required,T1,unknown,identity_only,not_scheduled,not_collected,not_applicable,not_reviewed,none,2026-07-10";
    const result = importBuildings("sample.csv", `${header}\n${row1}\n${row2}\n`);
    expect(result.validBuildings).toHaveLength(1);
    expect(result.duplicateIds).toContain("CSV-004");
  });

  it("rejects unsupported file formats", () => {
    const result = importBuildings("sample.txt", "hello");
    expect(result.format).toBe("unsupported");
    expect(result.errors).toHaveLength(1);
  });
});
