import { z } from "zod";
import {
  ACTION_STATUSES,
  BUILDING_TYPES,
  CONFIDENCE_LEVELS,
  CONSTRUCTION_PERIODS,
  CONSUMPTION_DATA_STATUSES,
  HEAT_ZONES,
  INSPECTION_STATUSES,
  KNOWLEDGE_STATUSES,
  MANAGEMENT_FORMS,
  METER_STATUSES,
  MV_STATUSES,
  OBSERVATION_CATEGORIES,
  PASSPORT_STATUSES,
  RENOVATION_REVIEW_STATUSES,
  RISK_STATUSES,
  SOURCE_TYPES,
} from "../types/domain";

const enumOrUnknown = <T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values);

export const provenanceSchema = z.object({
  sourceType: enumOrUnknown(SOURCE_TYPES),
  sourceLabel: z.string().min(1, "источник обязателен"),
  sourceUrl: z.string().url().optional(),
  asOf: z.string().min(4, "дата обязательна"),
  confidence: enumOrUnknown(CONFIDENCE_LEVELS),
  verificationStatus: z.enum(["reported", "verified", "disputed", "unknown"]),
  claimId: z.string().optional(),
});

/**
 * Import-time schema. Intentionally more forgiving than the full domain
 * type (missing enum fields fall back to a safe "unknown" default at the
 * mapping stage rather than being hard-rejected field-by-field), but the
 * following are treated as hard errors, matching FILTER: import rules
 * defined in the task brief.
 */
export const importBuildingSchema = z.object({
  buildingId: z.string().min(1, "Отсутствует Building ID"),
  demo: z.boolean().optional().default(false),
  displayName: z.string().min(1).optional().default(""),
  lat: z
    .number({ error: "Неверные координаты" })
    .gte(-90)
    .lte(90),
  lng: z
    .number({ error: "Неверные координаты" })
    .gte(-180)
    .lte(180),
  locationStatus: z
    .enum(["public_map_reference", "approximate", "verified", "unknown"])
    .optional()
    .default("unknown"),

  buildingType: enumOrUnknown(BUILDING_TYPES).optional().default("unknown"),
  constructionPeriod: enumOrUnknown(CONSTRUCTION_PERIODS).optional().default("unknown"),
  floors: z.number().int().positive().nullable().optional().default(null),
  managementForm: enumOrUnknown(MANAGEMENT_FORMS).optional().default("unknown"),
  heatZone: enumOrUnknown(HEAT_ZONES).optional().default("zone_unassigned"),

  knowledgeStatus: enumOrUnknown(KNOWLEDGE_STATUSES).optional().default("unknown"),
  riskStatus: enumOrUnknown(RISK_STATUSES).optional().default("not_assessed"),
  actionStatus: enumOrUnknown(ACTION_STATUSES).optional().default("data_required"),
  confidence: enumOrUnknown(CONFIDENCE_LEVELS).optional().default("T0"),

  meterStatus: enumOrUnknown(METER_STATUSES).optional().default("unknown"),
  passportStatus: enumOrUnknown(PASSPORT_STATUSES).optional().default("empty"),
  inspectionStatus: enumOrUnknown(INSPECTION_STATUSES).optional().default("not_scheduled"),
  consumptionDataStatus: enumOrUnknown(CONSUMPTION_DATA_STATUSES)
    .optional()
    .default("not_collected"),
  mvStatus: enumOrUnknown(MV_STATUSES).optional().default("not_applicable"),
  renovationReview: enumOrUnknown(RENOVATION_REVIEW_STATUSES)
    .optional()
    .default("not_reviewed"),

  observationCategory: enumOrUnknown(OBSERVATION_CATEGORIES).optional().default("none"),
  observationNote: z.string().optional(),

  lastUpdated: z.string().optional().default(() => new Date().toISOString().slice(0, 10)),
});

export type ImportBuildingInput = z.infer<typeof importBuildingSchema>;

export interface ImportRowError {
  rowIndex: number;
  buildingId?: string;
  messages: string[];
}
