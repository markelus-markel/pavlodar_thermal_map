/**
 * Basemap configuration is isolated here so the tile source can be swapped
 * (e.g. for an official/licensed basemap later) without touching map logic.
 */
export const MAP_CONFIG = {
  center: { lat: 52.2873, lng: 76.9674 },
  zoom: 11.4,
  minZoom: 9,
  maxZoom: 18,
  styles: {
    dark: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
    light: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  },
  attribution:
    '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>',
};
