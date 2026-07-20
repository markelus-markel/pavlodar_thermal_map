import { describe, expect, it } from "vitest";
import { computeDashboardMetrics } from "./dashboardMetrics";
import demoBuildings from "../data/demoBuildings.json";
import type { BuildingRecord } from "../types/domain";

const buildings = demoBuildings as BuildingRecord[];

describe("demo dataset integrity", () => {
  it("has exactly 24 demo buildings", () => {
    expect(buildings).toHaveLength(24);
  });

  it("all buildings are flagged demo:true", () => {
    expect(buildings.every((b) => b.demo === true)).toBe(true);
  });

  it("all Building IDs follow DEMO-PVL-### and are unique", () => {
    const ids = buildings.map((b) => b.buildingId);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => /^DEMO-PVL-\d{3}$/.test(id))).toBe(true);
  });

  it("all coordinates are within a plausible Pavlodar bounding box", () => {
    for (const b of buildings) {
      expect(b.lat).toBeGreaterThan(52.1);
      expect(b.lat).toBeLessThan(52.45);
      expect(b.lng).toBeGreaterThan(76.75);
      expect(b.lng).toBeLessThan(77.15);
    }
  });
});

describe("computeDashboardMetrics", () => {
  it("computes totals purely from the input array (no hardcoding)", () => {
    const metrics = computeDashboardMetrics(buildings);
    expect(metrics.total).toBe(buildings.length);
    expect(metrics.demoCount).toBe(buildings.filter((b) => b.demo).length);
  });

  it("returns all-zero metrics for an empty input without throwing", () => {
    const metrics = computeDashboardMetrics([]);
    expect(metrics.total).toBe(0);
    expect(metrics.mvReady).toBe(0);
  });
});
