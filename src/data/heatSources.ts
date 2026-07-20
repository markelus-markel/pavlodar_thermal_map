import type { HeatSourceRecord } from "../types/domain";

/**
 * Verified public context: heat source markers.
 *
 * Coordinates are NOT taken from an official akimat/PTS cadastral source
 * (none was found in the attached evidence pack). They are taken from a
 * public map reference database (Global Energy Monitor / GEM.wiki, itself
 * citing satellite-imagery placement), per the task constraint:
 *
 *   location_status: public_map_reference
 *   verification: not_officially_confirmed
 *
 * Installed thermal capacity figures (Gcal/h) come from EVIDENCE_SUMMARY.md
 * / TM_20A_CASE.md (public, dated sources), not from the map reference.
 */
export const heatSources: HeatSourceRecord[] = [
  {
    id: "HS-TEC1",
    name: "ТЭЦ-1 АО «Алюминий Казахстана»",
    operator: "АО «Алюминий Казахстана» (ERG)",
    lat: 52.249928,
    lng: 77.059423,
    locationStatus: "public_map_reference",
    verification: "not_officially_confirmed",
    installedCapacityGcalH: 1182,
    provenance: {
      sourceType: "public_map_reference",
      sourceLabel: "Global Energy Monitor — Global Coal Plant Tracker (GEM.wiki)",
      sourceUrl: "https://www.gem.wiki/Pavlodar-1_power_station",
      asOf: "2026-06-19",
      confidence: "T2",
      verificationStatus: "unknown",
      claimId: "CLM-GEM-TEC1-LOC",
    },
  },
  {
    id: "HS-TEC2",
    name: "ТЭЦ-2 АО «ПАВЛОДАРЭНЕРГО»",
    operator: "АО «ПАВЛОДАРЭНЕРГО» (ЦАЭК)",
    lat: 52.322482,
    lng: 76.966342,
    locationStatus: "public_map_reference",
    verification: "not_officially_confirmed",
    installedCapacityGcalH: 332,
    provenance: {
      sourceType: "public_map_reference",
      sourceLabel: "Global Energy Monitor — Global Coal Plant Tracker (GEM.wiki)",
      sourceUrl: "https://www.gem.wiki/Pavlodar-2_power_station",
      asOf: "2026-05-13",
      confidence: "T2",
      verificationStatus: "unknown",
      claimId: "CLM-GEM-TEC2-LOC",
    },
  },
  {
    id: "HS-TEC3",
    name: "ТЭЦ-3 АО «ПАВЛОДАРЭНЕРГО»",
    operator: "АО «ПАВЛОДАРЭНЕРГО» (ЦАЭК)",
    lat: 52.366612,
    lng: 76.934487,
    locationStatus: "public_map_reference",
    verification: "not_officially_confirmed",
    installedCapacityGcalH: 1154,
    provenance: {
      sourceType: "public_map_reference",
      sourceLabel: "Global Energy Monitor — Global Coal Plant Tracker (GEM.wiki)",
      sourceUrl: "https://www.gem.wiki/Pavlodar-3_power_station",
      asOf: "2026-05-13",
      confidence: "T2",
      verificationStatus: "unknown",
      claimId: "CLM-GEM-TEC3-LOC",
    },
  },
];
