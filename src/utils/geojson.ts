import type { BuildingRecord } from "../types/domain";

export interface GeoFeatureCollection {
  type: "FeatureCollection";
  features: GeoFeature[];
}

export interface GeoFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] } | null;
  properties: Record<string, unknown>;
}

export function buildingToFeature(b: BuildingRecord): GeoFeature {
  const { lat, lng, ...properties } = b;
  return {
    type: "Feature",
    geometry: { type: "Point", coordinates: [lng, lat] },
    properties: { ...properties, lat, lng },
  };
}

export function buildingsToFeatureCollection(
  buildings: BuildingRecord[]
): GeoFeatureCollection {
  return {
    type: "FeatureCollection",
    features: buildings.map(buildingToFeature),
  };
}

/** Flatten a BuildingRecord (or partial import row) into raw candidate
 * key/value pairs usable by the import validator, regardless of whether it
 * arrived as a GeoJSON Feature or a plain JSON object. */
export function extractRawBuildingCandidate(
  input: unknown
): Record<string, unknown> | null {
  if (!input || typeof input !== "object") return null;
  const obj = input as Record<string, unknown>;

  if (obj.type === "Feature") {
    const geometry = obj.geometry as
      | { type?: string; coordinates?: unknown }
      | undefined;
    const properties = (obj.properties as Record<string, unknown>) ?? {};
    let lat = properties.lat;
    let lng = properties.lng;
    if (
      geometry &&
      geometry.type === "Point" &&
      Array.isArray(geometry.coordinates) &&
      geometry.coordinates.length === 2
    ) {
      const [glng, glat] = geometry.coordinates as [number, number];
      lat = lat ?? glat;
      lng = lng ?? glng;
    }
    return { ...properties, lat, lng };
  }

  return obj;
}

export function coerceRowTypes(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...row };
  if (typeof out.lat === "string") out.lat = Number(out.lat);
  if (typeof out.lng === "string") out.lng = Number(out.lng);
  if (typeof out.floors === "string" && out.floors !== "") out.floors = Number(out.floors);
  if (out.floors === "") out.floors = null;
  if (typeof out.demo === "string") out.demo = out.demo === "true" || out.demo === "1";
  return out;
}
