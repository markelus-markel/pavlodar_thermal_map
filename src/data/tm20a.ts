import type { SchematicLineRecord } from "../types/domain";

/**
 * TM-20A is rendered as a SCHEMATIC line only — a straight reference between
 * the (public-map-reference) TEC-1 marker and an approximate point standing
 * in for NO-52, per TM_20A_CASE.md. This is not a cadastral / as-built
 * trace; no as-built executive geometry was found in the evidence pack.
 */
export const tm20aLine: SchematicLineRecord = {
  id: "TM-20A",
  name: "ТМ-20А: ТЭЦ-1 — НО-52",
  geometryStatus: "schematic",
  coordinates: [
    [77.059423, 52.249928], // TEC-1 (public_map_reference)
    [76.99, 52.27], // schematic intermediate point, not surveyed
    [76.9674, 52.2873], // approximate NO-52 reference point (schematic)
  ],
  description:
    "Новая надземная тепломагистраль DN1000 от ТЭЦ-1 до НО-52, ~5 962 м по проекту, завершена 19.05.2026. " +
    "Линия на карте схематична и не является исполнительной или кадастровой трассой.",
  provenance: {
    sourceType: "public_document",
    sourceLabel: "Карточка проекта МЭКС / TM_20A_CASE.md",
    sourceUrl:
      "https://modernization.kz/ru/projects/stroitelstvo-novoi-teplomagistrali-tm-20a-s-uvelicheniem-propusknoi-sp",
    asOf: "2026-05-19",
    confidence: "T3",
    verificationStatus: "verified",
    claimId: "CLM-035",
  },
};
