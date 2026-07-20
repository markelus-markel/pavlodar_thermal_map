import { useMemo, useState, useCallback } from "react";
import demoBuildingsRaw from "../data/demoBuildings.json";
import type { BuildingRecord } from "../types/domain";
import { applyFilters, EMPTY_FILTER_STATE, type FilterState } from "../domain/filters";

const demoBuildings = demoBuildingsRaw as BuildingRecord[];

export function useBuildingData() {
  const [importedBuildings, setImportedBuildings] = useState<BuildingRecord[]>([]);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTER_STATE);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

  const allBuildings = useMemo(
    () => [...demoBuildings, ...importedBuildings],
    [importedBuildings]
  );

  const filteredBuildings = useMemo(
    () => applyFilters(allBuildings, filters),
    [allBuildings, filters]
  );

  const selectedBuilding = useMemo(
    () => allBuildings.find((b) => b.buildingId === selectedBuildingId) ?? null,
    [allBuildings, selectedBuildingId]
  );

  const addImportedBuildings = useCallback((buildings: BuildingRecord[]) => {
    setImportedBuildings((prev) => {
      const existingIds = new Set(prev.map((b) => b.buildingId).concat(demoBuildings.map((b) => b.buildingId)));
      const fresh = buildings.filter((b) => !existingIds.has(b.buildingId));
      return [...prev, ...fresh];
    });
  }, []);

  const resetFilters = useCallback(() => setFilters(EMPTY_FILTER_STATE), []);

  return {
    allBuildings,
    filteredBuildings,
    filters,
    setFilters,
    resetFilters,
    selectedBuilding,
    selectedBuildingId,
    setSelectedBuildingId,
    addImportedBuildings,
    importedCount: importedBuildings.length,
  };
}
