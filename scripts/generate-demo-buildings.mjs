// One-off generator for demo MKD dataset. Run with: node scripts/generate-demo-buildings.mjs
// Output: src/data/demoBuildings.json
// All buildings are synthetic, non-real, and explicitly flagged demo:true.

import { writeFileSync } from "node:fs";

// Demo zone: a cluster of offset points near central Pavlodar, kept visually
// distinct from the (approximate) real infrastructure markers. These are NOT
// real addresses.
const CENTER = { lat: 52.2873, lng: 76.9674 };

function offset(seedLat, seedLng, i, spread = 0.012) {
  // simple deterministic pseudo-random spread using index
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const rand1 = a - Math.floor(a);
  const b = Math.sin(i * 78.233) * 12543.221;
  const rand2 = b - Math.floor(b);
  return {
    lat: seedLat + (rand1 - 0.5) * spread,
    lng: seedLng + (rand2 - 0.5) * spread * 1.6,
  };
}

const zones = ["zone_tec1_south", "zone_tec2_central", "zone_tec3_north", "zone_unassigned"];

const provenanceDemo = (asOf) => ({
  sourceType: "demo_synthetic",
  sourceLabel: "Синтетический демонстрационный набор HouseMaster MVP",
  asOf,
  confidence: "T1",
  verificationStatus: "unknown",
  claimId: "DEMO-CLAIM",
});

const provenanceReport = (asOf, label) => ({
  sourceType: "resident_report",
  sourceLabel: label,
  asOf,
  confidence: "T1",
  verificationStatus: "reported",
  claimId: "DEMO-CLAIM",
});

const provenanceInspected = (asOf, label) => ({
  sourceType: "field_inspection",
  sourceLabel: label,
  asOf,
  confidence: "T3",
  verificationStatus: "verified",
  claimId: "DEMO-CLAIM",
});

let counter = 0;
function nextId() {
  counter += 1;
  return `DEMO-PVL-${String(counter).padStart(3, "0")}`;
}

const buildings = [];

function pushBuilding(overrides) {
  const idx = counter;
  const { lat, lng } = offset(CENTER.lat, CENTER.lng, idx + 1);
  const base = {
    buildingId: nextId(),
    demo: true,
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6)),
    locationStatus: "approximate",
    buildingType: "soviet_standard",
    constructionPeriod: "1960_1979",
    floors: 5,
    managementForm: "management_company",
    heatZone: zones[idx % zones.length],
    knowledgeStatus: "reported",
    riskStatus: "not_assessed",
    actionStatus: "data_required",
    confidence: "T1",
    meterStatus: "unknown",
    passportStatus: "identity_only",
    inspectionStatus: "not_scheduled",
    consumptionDataStatus: "not_collected",
    mvStatus: "not_applicable",
    renovationReview: "not_reviewed",
    observationCategory: "none",
    lastUpdated: "2026-06-01",
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
    provenance: provenanceDemo("2026-06-01"),
  };
  buildings.push({ ...base, ...overrides, displayName: overrides.displayName });
}

// --- Category 1: 6 typовых советских МКД (базовый фон) ---
for (let i = 1; i <= 6; i++) {
  pushBuilding({
    displayName: `Демо-дом «Типовой-${i}»`,
    buildingType: "soviet_standard",
    constructionPeriod: "1960_1979",
    floors: [4, 5, 5, 9, 5, 4][i - 1],
    managementForm: i % 2 === 0 ? "osi" : "management_company",
    knowledgeStatus: ["unknown", "reported", "reported", "inspected", "unknown", "reported"][i - 1],
    riskStatus: "not_assessed",
    actionStatus: ["data_required", "data_required", "inspection_required", "inspection_required", "data_required", "none"][i - 1],
    confidence: "T1",
    meterStatus: i % 2 === 0 ? "installed_uncalibrated" : "unknown",
    passportStatus: i <= 2 ? "identity_only" : "topology_linked",
    provenance: provenanceDemo("2026-05-20"),
  });
}

// --- Category 2: 4 дома с проблемой подвала ---
for (let i = 1; i <= 4; i++) {
  pushBuilding({
    displayName: `Демо-дом «Подвал-${i}»`,
    buildingType: "soviet_standard",
    constructionPeriod: i <= 2 ? "before_1960" : "1960_1979",
    floors: 4,
    knowledgeStatus: "inspected",
    riskStatus: i === 4 ? "specialist_required" : "medium",
    actionStatus: i === 4 ? "engineering_assessment" : "inspection_required",
    confidence: "T2",
    observationCategory: "basement_condition",
    observationNote: "Полевое наблюдение отмечает влажность и следы подтопления подвала (демонстрационные данные).",
    systems: {
      heatUnitStatus: "reported",
      pipeInsulationStatus: "unknown",
      valvesStatus: "reported",
      basementStatus: "observed",
      envelopeStatus: "unknown",
    },
    passportStatus: "inspected",
    inspectionStatus: "completed",
    provenance: provenanceInspected("2026-04-10", "Полевое обследование (демо)"),
  });
}

// --- Category 3: 4 дома с наблюдениями недотопа ---
for (let i = 1; i <= 4; i++) {
  pushBuilding({
    displayName: `Демо-дом «Недотоп-${i}»`,
    buildingType: "soviet_standard",
    constructionPeriod: "1960_1979",
    floors: [5, 9, 5, 4][i - 1],
    knowledgeStatus: i <= 2 ? "documented" : "reported",
    riskStatus: i === 1 ? "specialist_required" : i <= 3 ? "medium" : "low",
    actionStatus: i === 1 ? "engineering_assessment" : "inspection_required",
    confidence: i <= 2 ? "T2" : "T1",
    observationCategory: "underheating",
    observationNote: "Обезличенные сообщения жителей о недостаточной температуре в отопительный период (демо).",
    passportStatus: i <= 2 ? "baseline_measured" : "topology_linked",
    inspectionStatus: i <= 2 ? "completed" : "scheduled",
    provenance: provenanceReport("2026-01-15", "Обезличенное обращение жителей (демо)"),
  });
}

// --- Category 4: 3 дома с перетопом ---
for (let i = 1; i <= 3; i++) {
  pushBuilding({
    displayName: `Демо-дом «Перетоп-${i}»`,
    buildingType: "soviet_standard",
    constructionPeriod: "1980_1999",
    floors: 9,
    knowledgeStatus: "reported",
    riskStatus: "low",
    actionStatus: "inspection_required",
    confidence: "T1",
    observationCategory: "overheating",
    observationNote: "Наблюдение повышенной температуры в части помещений (демо, не измерение).",
    passportStatus: "identity_only",
    provenance: provenanceReport("2026-02-02", "Обезличенное обращение жителей (демо)"),
  });
}

// --- Category 5: 3 новых или недавно модернизированных дома ---
for (let i = 1; i <= 3; i++) {
  pushBuilding({
    displayName: `Демо-дом «Модерн-${i}»`,
    buildingType: i === 3 ? "new_construction" : "modernized",
    constructionPeriod: i === 3 ? "after_2015" : "2000_2015",
    floors: [9, 12, 16][i - 1],
    knowledgeStatus: "verified",
    riskStatus: "low",
    actionStatus: i === 1 ? "effect_verified" : "verification_pending",
    confidence: "T3",
    meterStatus: "installed_calibrated",
    passportStatus: i === 1 ? "post_work_verified" : "cause_assessed",
    inspectionStatus: "completed",
    consumptionDataStatus: "complete_validated",
    mvStatus: i === 1 ? "effect_verified" : "post_measurement_pending",
    systems: {
      heatUnitStatus: "verified",
      pipeInsulationStatus: "good",
      valvesStatus: "verified",
      basementStatus: "verified",
      envelopeStatus: "verified",
    },
    economics: {
      measurePackage: "P2",
      capexStatus: "reviewed",
      opexStatus: "reviewed",
      economicGate: i === 1 ? "passed" : "open",
    },
    provenance: provenanceInspected("2026-03-01", "Приёмочная проверка после модернизации (демо)"),
  });
}

// --- Category 6: 2 кандидата на углублённое обследование ---
for (let i = 1; i <= 2; i++) {
  pushBuilding({
    displayName: `Демо-дом «Кандидат-${i}»`,
    buildingType: "soviet_standard",
    constructionPeriod: "1960_1979",
    floors: 5,
    knowledgeStatus: "documented",
    riskStatus: "medium",
    actionStatus: "engineering_assessment",
    confidence: "T2",
    observationCategory: i === 1 ? "distribution_imbalance" : "underheating",
    observationNote: "Расхождение между стояками при общем нормальном вводе — требует распределённых замеров (демо).",
    passportStatus: "baseline_measured",
    inspectionStatus: "in_progress",
    economics: {
      measurePackage: "P1",
      capexStatus: "draft",
      opexStatus: "not_estimated",
      economicGate: "open",
    },
    provenance: provenanceInspected("2026-05-05", "Обследование в процессе (демо)"),
  });
}

// --- Category 7: 2 контрольных дома ---
for (let i = 1; i <= 2; i++) {
  pushBuilding({
    displayName: `Демо-дом «Контроль-${i}»`,
    buildingType: "soviet_standard",
    constructionPeriod: "1980_1999",
    floors: 9,
    knowledgeStatus: "verified",
    riskStatus: "not_assessed",
    actionStatus: "none",
    confidence: "T3",
    meterStatus: "installed_calibrated",
    passportStatus: "inspected",
    inspectionStatus: "completed",
    consumptionDataStatus: "complete_validated",
    observationNote: "Контрольный объект без подтверждённых отклонений (демо).",
    provenance: provenanceInspected("2026-04-20", "Контрольное обследование (демо)"),
  });
}

writeFileSync(
  new URL("../src/data/demoBuildings.json", import.meta.url),
  JSON.stringify(buildings, null, 2) + "\n",
  "utf-8"
);

console.log(`Generated ${buildings.length} demo buildings.`);
