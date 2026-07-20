import { importBuildingSchema, type ImportRowError } from "../schemas/buildingSchema";
import type { BuildingRecord } from "../types/domain";
import { parseCsv } from "../utils/csv";
import { coerceRowTypes, extractRawBuildingCandidate } from "../utils/geojson";

export type ImportFormat = "geojson" | "json" | "csv" | "unsupported";

export interface ImportResult {
  format: ImportFormat;
  totalRows: number;
  validBuildings: BuildingRecord[];
  errors: ImportRowError[];
  duplicateIds: string[];
}

export function detectFormat(filename: string, text: string): ImportFormat {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".csv")) return "csv";
  if (lower.endsWith(".geojson")) return "geojson";
  if (lower.endsWith(".json")) {
    try {
      const parsed = JSON.parse(text);
      if (parsed && parsed.type === "FeatureCollection") return "geojson";
      return "json";
    } catch {
      return "unsupported";
    }
  }
  return "unsupported";
}

function rawRowsFromText(format: ImportFormat, text: string): unknown[] {
  if (format === "csv") {
    return parseCsv(text);
  }
  const parsed = JSON.parse(text);
  if (format === "geojson") {
    if (parsed?.type !== "FeatureCollection" || !Array.isArray(parsed.features)) {
      throw new Error("Ожидался GeoJSON FeatureCollection");
    }
    return parsed.features;
  }
  // json: accept either an array or { buildings: [...] }
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed?.buildings)) return parsed.buildings;
  throw new Error("Ожидался массив объектов или { buildings: [...] }");
}

function toBuildingRecord(input: ReturnType<typeof importBuildingSchema.parse>): BuildingRecord {
  return {
    buildingId: input.buildingId,
    demo: input.demo,
    displayName: input.displayName || input.buildingId,
    lat: input.lat,
    lng: input.lng,
    locationStatus: input.locationStatus,
    buildingType: input.buildingType,
    constructionPeriod: input.constructionPeriod,
    floors: input.floors,
    managementForm: input.managementForm,
    heatZone: input.heatZone,
    knowledgeStatus: input.knowledgeStatus,
    riskStatus: input.riskStatus,
    actionStatus: input.actionStatus,
    confidence: input.confidence,
    meterStatus: input.meterStatus,
    passportStatus: input.passportStatus,
    inspectionStatus: input.inspectionStatus,
    consumptionDataStatus: input.consumptionDataStatus,
    mvStatus: input.mvStatus,
    renovationReview: input.renovationReview,
    observationCategory: input.observationCategory,
    observationNote: input.observationNote,
    lastUpdated: input.lastUpdated,
    connection: {
      heatSourceId: null,
      connectionPointId: null,
      responsibilityBoundaryStatus: "unknown",
    },
    systems: {
      heatUnitStatus: "unknown",
      pipeInsulationStatus: "unknown",
      valvesStatus: "unknown",
      basementStatus: "unknown",
      envelopeStatus: "unknown",
    },
    economics: {
      measurePackage: "unknown",
      capexStatus: "not_estimated",
      opexStatus: "not_estimated",
      economicGate: "not_opened",
    },
    provenance: {
      sourceType: "resident_report",
      sourceLabel: "Импортировано пользователем в текущей сессии",
      asOf: input.lastUpdated,
      confidence: input.confidence,
      verificationStatus: "reported",
    },
  };
}

export function importBuildings(filename: string, text: string): ImportResult {
  const format = detectFormat(filename, text);
  if (format === "unsupported") {
    return {
      format,
      totalRows: 0,
      validBuildings: [],
      errors: [{ rowIndex: -1, messages: ["Неподдерживаемый формат файла. Используйте .geojson, .json или .csv"] }],
      duplicateIds: [],
    };
  }

  let rawRows: unknown[];
  try {
    rawRows = rawRowsFromText(format, text);
  } catch (e) {
    return {
      format,
      totalRows: 0,
      validBuildings: [],
      errors: [{ rowIndex: -1, messages: [e instanceof Error ? e.message : "Ошибка чтения файла"] }],
      duplicateIds: [],
    };
  }

  const errors: ImportRowError[] = [];
  const validBuildings: BuildingRecord[] = [];
  const seenIds = new Set<string>();
  const duplicateIds = new Set<string>();

  rawRows.forEach((raw, idx) => {
    const candidate = extractRawBuildingCandidate(raw);
    if (!candidate) {
      errors.push({ rowIndex: idx, messages: ["Строка не является объектом"] });
      return;
    }
    const coerced = coerceRowTypes(candidate);
    const result = importBuildingSchema.safeParse(coerced);
    if (!result.success) {
      const messages = result.error.issues.map((issue) => {
        const path = issue.path.join(".");
        if (path === "lat" || path === "lng") return "Неверные координаты";
        if (path === "buildingId") return "Отсутствует Building ID";
        if (issue.code === "invalid_value") return `Неизвестное значение поля «${path}»`;
        return `${path || "поле"}: ${issue.message}`;
      });
      errors.push({
        rowIndex: idx,
        buildingId: typeof coerced.buildingId === "string" ? coerced.buildingId : undefined,
        messages: [...new Set(messages)],
      });
      return;
    }

    const buildingId = result.data.buildingId;
    if (seenIds.has(buildingId)) {
      duplicateIds.add(buildingId);
      errors.push({
        rowIndex: idx,
        buildingId,
        messages: [`Повторяющийся Building ID: ${buildingId}`],
      });
      return;
    }
    seenIds.add(buildingId);
    validBuildings.push(toBuildingRecord(result.data));
  });

  return {
    format,
    totalRows: rawRows.length,
    validBuildings,
    errors,
    duplicateIds: [...duplicateIds],
  };
}
