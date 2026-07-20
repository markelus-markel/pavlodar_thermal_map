import { useState } from "react";
import { Header } from "./components/common/Header";
import { MapView } from "./components/map/MapView";
import { LayerPanel } from "./components/map/LayerPanel";
import { Legend } from "./components/map/Legend";
import { FilterPanel } from "./components/filters/FilterPanel";
import { BuildingCard } from "./components/building/BuildingCard";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ImportModal } from "./components/import/ImportModal";
import { ExportMenu } from "./components/common/ExportMenu";
import { useBuildingData } from "./hooks/useBuildingData";
import { useTheme } from "./hooks/useTheme";
import type { MapLayerId } from "./types/domain";
import "./App.css";

const DEFAULT_LAYERS: MapLayerId[] = [
  "buildings",
  "buildings_demo",
  "heat_sources",
  "tm20a",
  "knowledge_level",
];

export default function App() {
  const {
    allBuildings,
    filteredBuildings,
    filters,
    setFilters,
    resetFilters,
    selectedBuilding,
    setSelectedBuildingId,
    addImportedBuildings,
  } = useBuildingData();

  const [view, setView] = useState<"map" | "dashboard">("map");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [legendCollapsed, setLegendCollapsed] = useState(false);
  const [layerPanelCollapsed, setLayerPanelCollapsed] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 640
  );
  const [activeLayers, setActiveLayers] = useState<Set<MapLayerId>>(new Set(DEFAULT_LAYERS));
  const { theme, toggleTheme } = useTheme();

  function toggleLayer(id: MapLayerId) {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="app-shell">
      <Header
        view={view}
        onViewChange={setView}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters({ ...filters, searchQuery: q })}
        onImportClick={() => setImportOpen(true)}
        onExportClick={() => setExportOpen(true)}
        onToggleFilters={() => setFiltersOpen((v) => !v)}
        filtersOpen={filtersOpen}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="app-main">
        {view === "map" ? (
          <div className="app-map-area">
            <MapView
              buildings={filteredBuildings}
              activeLayers={activeLayers}
              selectedBuildingId={selectedBuilding?.buildingId ?? null}
              onSelectBuilding={setSelectedBuildingId}
              theme={theme}
            />
            <LayerPanel
              activeLayers={activeLayers}
              onToggle={toggleLayer}
              collapsed={layerPanelCollapsed}
              onToggleCollapsed={() => setLayerPanelCollapsed((v) => !v)}
            />
            <Legend collapsed={legendCollapsed} onToggle={() => setLegendCollapsed((v) => !v)} />
            <div className="app-map-footer">
              Показано {filteredBuildings.length} из {allBuildings.length} объектов · срез данных:
              актуально на 2026-07-20
            </div>
          </div>
        ) : (
          <Dashboard buildings={filteredBuildings} />
        )}

        {filtersOpen && (
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            allBuildings={allBuildings}
            isOpen={filtersOpen}
            onClose={() => setFiltersOpen(false)}
          />
        )}

        {selectedBuilding && !filtersOpen && (
          <BuildingCard building={selectedBuilding} onClose={() => setSelectedBuildingId(null)} />
        )}
      </main>

      {importOpen && (
        <ImportModal onClose={() => setImportOpen(false)} onImport={addImportedBuildings} />
      )}
      {exportOpen && <ExportMenu buildings={filteredBuildings} onClose={() => setExportOpen(false)} />}
    </div>
  );
}
