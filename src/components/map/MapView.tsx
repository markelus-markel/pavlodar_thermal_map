import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { BuildingRecord, MapLayerId } from "../../types/domain";
import { heatSources } from "../../data/heatSources";
import { tm20aLine } from "../../data/tm20a";
import { MAP_CONFIG } from "../../config/mapConfig";
import {
  KNOWLEDGE_HEX,
  RISK_HEX,
  DEMO_HEX,
  HEAT_SOURCE_HEX,
  TM20A_HEX,
  KNOWLEDGE_HEX_LIGHT,
  RISK_HEX_LIGHT,
  DEMO_HEX_LIGHT,
  HEAT_SOURCE_HEX_LIGHT,
  TM20A_HEX_LIGHT,
} from "../../domain/mapColors";
import type { ThemeMode } from "../../hooks/useTheme";
import "./MapView.css";

interface Props {
  buildings: BuildingRecord[];
  activeLayers: Set<MapLayerId>;
  selectedBuildingId: string | null;
  onSelectBuilding: (id: string) => void;
  theme: ThemeMode;
}

const BUILDINGS_SOURCE = "buildings-source";
const HEAT_SOURCES_SOURCE = "heat-sources-source";
const TM20A_SOURCE = "tm20a-source";

function paletteFor(theme: ThemeMode) {
  return theme === "light"
    ? {
        knowledge: KNOWLEDGE_HEX_LIGHT,
        risk: RISK_HEX_LIGHT,
        demo: DEMO_HEX_LIGHT,
        heatSource: HEAT_SOURCE_HEX_LIGHT,
        tm20a: TM20A_HEX_LIGHT,
        selectionRing: "#16202b",
        labelText: "#16202b",
        labelHalo: "#ffffff",
        heatSourceStroke: "#ffffff",
      }
    : {
        knowledge: KNOWLEDGE_HEX,
        risk: RISK_HEX,
        demo: DEMO_HEX,
        heatSource: HEAT_SOURCE_HEX,
        tm20a: TM20A_HEX,
        selectionRing: "#e7ecf1",
        labelText: "#e7ecf1",
        labelHalo: "#0c1119",
        heatSourceStroke: "#0c1119",
      };
}

export function MapView({
  buildings,
  activeLayers,
  selectedBuildingId,
  onSelectBuilding,
  theme,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const readyRef = useRef(false);
  const onSelectRef = useRef(onSelectBuilding);
  onSelectRef.current = onSelectBuilding;
  const themeRef = useRef(theme);
  const latestStateRef = useRef({ buildings, activeLayers, selectedBuildingId });
  latestStateRef.current = { buildings, activeLayers, selectedBuildingId };

  // Init map once.
  useEffect(() => {
    if (!containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_CONFIG.styles[themeRef.current],
      center: [MAP_CONFIG.center.lng, MAP_CONFIG.center.lat],
      zoom: MAP_CONFIG.zoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
      attributionControl: false,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.addControl(new maplibregl.AttributionControl({ customAttribution: MAP_CONFIG.attribution }));

    map.on("load", () => {
      initLayersAndInteractions(map, themeRef.current, onSelectRef);
      readyRef.current = true;
      mapRef.current = map;
      const { buildings, activeLayers, selectedBuildingId } = latestStateRef.current;
      applyDataAndLayers(map, buildings, activeLayers, selectedBuildingId);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      readyRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch basemap style when theme changes, then rebuild our custom
  // sources/layers (setStyle wipes them) and reapply current data.
  useEffect(() => {
    themeRef.current = theme;
    const map = mapRef.current;
    if (!map || !readyRef.current) return;

    map.setStyle(MAP_CONFIG.styles[theme]);
    map.once("style.load", () => {
      initLayersAndInteractions(map, theme, onSelectRef);
      const { buildings, activeLayers, selectedBuildingId } = latestStateRef.current;
      applyDataAndLayers(map, buildings, activeLayers, selectedBuildingId);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // Push data/layer/selection updates.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    applyDataAndLayers(map, buildings, activeLayers, selectedBuildingId);
  }, [buildings, activeLayers, selectedBuildingId]);

  return <div ref={containerRef} className="map-view" role="application" aria-label="Карта Павлодара" />;
}

function initLayersAndInteractions(
  map: maplibregl.Map,
  theme: ThemeMode,
  onSelectRef: React.MutableRefObject<(id: string) => void>
) {
  const colors = paletteFor(theme);

  map.addSource(BUILDINGS_SOURCE, {
    type: "geojson",
    data: { type: "FeatureCollection", features: [] },
  });

  // Halo (risk ring)
  map.addLayer({
    id: "buildings-risk-ring",
    type: "circle",
    source: BUILDINGS_SOURCE,
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 7, 15, 12],
      "circle-color": "transparent",
      "circle-stroke-width": 2.5,
      "circle-stroke-color": [
        "match",
        ["get", "riskStatus"],
        "not_assessed", colors.risk.not_assessed,
        "low", colors.risk.low,
        "medium", colors.risk.medium,
        "high", colors.risk.high,
        "specialist_required", colors.risk.specialist_required,
        colors.risk.not_assessed,
      ],
    },
  });

  // Fill (knowledge status)
  map.addLayer({
    id: "buildings-knowledge-fill",
    type: "circle",
    source: BUILDINGS_SOURCE,
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 5, 15, 9],
      "circle-color": [
        "match",
        ["get", "knowledgeStatus"],
        "unknown", colors.knowledge.unknown,
        "reported", colors.knowledge.reported,
        "inspected", colors.knowledge.inspected,
        "documented", colors.knowledge.documented,
        "verified", colors.knowledge.verified,
        colors.knowledge.unknown,
      ],
      "circle-stroke-width": ["case", ["get", "demo"], 1.5, 0],
      "circle-stroke-color": colors.demo,
    },
  });

  // Selected building highlight
  map.addLayer({
    id: "buildings-selected",
    type: "circle",
    source: BUILDINGS_SOURCE,
    filter: ["==", ["get", "buildingId"], "__none__"],
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 12, 15, 18],
      "circle-color": "transparent",
      "circle-stroke-width": 2,
      "circle-stroke-color": colors.selectionRing,
      "circle-stroke-opacity": 0.9,
    },
  });

  // TM-20A schematic line
  map.addSource(TM20A_SOURCE, {
    type: "geojson",
    data: {
      type: "Feature",
      properties: { name: tm20aLine.name },
      geometry: { type: "LineString", coordinates: tm20aLine.coordinates },
    },
  });
  map.addLayer({
    id: "tm20a-line",
    type: "line",
    source: TM20A_SOURCE,
    paint: {
      "line-color": colors.tm20a,
      "line-width": 3,
      "line-dasharray": [2, 1.6],
    },
    layout: { visibility: "none" },
  });

  // Heat sources
  map.addSource(HEAT_SOURCES_SOURCE, {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: heatSources.map((hs) => ({
        type: "Feature" as const,
        properties: { id: hs.id, name: hs.name },
        geometry: { type: "Point" as const, coordinates: [hs.lng, hs.lat] },
      })),
    },
  });
  map.addLayer({
    id: "heat-sources-point",
    type: "circle",
    source: HEAT_SOURCES_SOURCE,
    paint: {
      "circle-radius": 9,
      "circle-color": colors.heatSource,
      "circle-stroke-width": 2,
      "circle-stroke-color": colors.heatSourceStroke,
    },
    layout: { visibility: "none" },
  });
  map.addLayer({
    id: "heat-sources-label",
    type: "symbol",
    source: HEAT_SOURCES_SOURCE,
    layout: {
      "text-field": ["get", "name"],
      "text-size": 11,
      "text-offset": [0, 1.4],
      "text-anchor": "top",
      visibility: "none",
    },
    paint: {
      "text-color": colors.labelText,
      "text-halo-color": colors.labelHalo,
      "text-halo-width": 1.2,
    },
  });

  map.on("click", "buildings-knowledge-fill", (e) => {
    const f = e.features?.[0];
    const id = f?.properties?.buildingId as string | undefined;
    if (id) onSelectRef.current(id);
  });
  map.on("mouseenter", "buildings-knowledge-fill", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "buildings-knowledge-fill", () => {
    map.getCanvas().style.cursor = "";
  });
}

function applyDataAndLayers(
  map: maplibregl.Map,
  buildings: BuildingRecord[],
  activeLayers: Set<MapLayerId>,
  selectedBuildingId: string | null
) {
  const showReal = activeLayers.has("buildings");
  const showDemo = activeLayers.has("buildings_demo");
  const visibleBuildings = buildings.filter((b) => (b.demo ? showDemo : showReal));

  const source = map.getSource(BUILDINGS_SOURCE) as maplibregl.GeoJSONSource | undefined;
  if (source) {
    source.setData({
      type: "FeatureCollection",
      features: visibleBuildings.map((b) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [b.lng, b.lat] },
        properties: {
          buildingId: b.buildingId,
          knowledgeStatus: b.knowledgeStatus,
          riskStatus: b.riskStatus,
          demo: b.demo,
        },
      })),
    });
  }

  setVisibility(map, "tm20a-line", activeLayers.has("tm20a"));
  setVisibility(map, "heat-sources-point", activeLayers.has("heat_sources"));
  setVisibility(map, "heat-sources-label", activeLayers.has("heat_sources"));
  setVisibility(map, "buildings-knowledge-fill", activeLayers.has("knowledge_level") || showReal || showDemo);
  setVisibility(map, "buildings-risk-ring", activeLayers.has("knowledge_level") || showReal || showDemo);

  if (map.getLayer("buildings-selected")) {
    map.setFilter("buildings-selected", ["==", ["get", "buildingId"], selectedBuildingId ?? "__none__"]);
  }
}

function setVisibility(map: maplibregl.Map, layerId: string, visible: boolean) {
  if (!map.getLayer(layerId)) return;
  map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
}
