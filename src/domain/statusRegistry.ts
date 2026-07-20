import type {
  ActionStatus,
  ConfidenceLevel,
  ConsumptionDataStatus,
  InspectionStatus,
  KnowledgeStatus,
  ManagementForm,
  MeterStatus,
  MvStatus,
  PassportStatus,
  RenovationReviewStatus,
  RiskStatus,
  BuildingType,
  ConstructionPeriod,
  HeatZone,
  ObservationCategory,
} from "../types/domain";

/**
 * Single source of truth for label + color per status value.
 * Colors reference CSS custom properties defined in styles/tokens.css so the
 * palette stays centralized (DESIGN_SYSTEM_PRINCIPLES.md principle 2 & 8).
 */

export const KNOWLEDGE_LABELS: Record<KnowledgeStatus, string> = {
  unknown: "Неизвестно",
  reported: "Есть сообщение",
  inspected: "Осмотрено",
  documented: "Документировано",
  verified: "Подтверждено",
};

export const KNOWLEDGE_COLOR_VAR: Record<KnowledgeStatus, string> = {
  unknown: "--k-unknown",
  reported: "--k-reported",
  inspected: "--k-inspected",
  documented: "--k-documented",
  verified: "--k-verified",
};

export const RISK_LABELS: Record<RiskStatus, string> = {
  not_assessed: "Не оценено",
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
  specialist_required: "Требуется специалист",
};

export const RISK_COLOR_VAR: Record<RiskStatus, string> = {
  not_assessed: "--r-not-assessed",
  low: "--r-low",
  medium: "--r-medium",
  high: "--r-high",
  specialist_required: "--r-specialist",
};

export const ACTION_LABELS: Record<ActionStatus, string> = {
  none: "Нет действия",
  data_required: "Нужны данные",
  inspection_required: "Требуется осмотр",
  quick_win: "Быстрая мера",
  engineering_assessment: "Инженерная оценка",
  modernization_candidate: "Кандидат на модернизацию",
  renovation_review: "Рассмотрение реновации",
  verification_pending: "Ожидает верификации",
  effect_verified: "Эффект подтверждён",
};

export const ACTION_COLOR_VAR: Record<ActionStatus, string> = {
  none: "--a-none",
  data_required: "--a-data",
  inspection_required: "--a-inspection",
  quick_win: "--a-quickwin",
  engineering_assessment: "--a-engineering",
  modernization_candidate: "--a-modernization",
  renovation_review: "--a-renovation",
  verification_pending: "--a-verification",
  effect_verified: "--a-verified",
};

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  T0: "T0 — не подтверждено",
  T1: "T1 — заявлено источником",
  T2: "T2 — частично подтверждено",
  T3: "T3 — подтверждено",
  T4: "T4 — верифицировано независимо",
};

export const METER_LABELS: Record<MeterStatus, string> = {
  not_installed: "Не установлен",
  installed_uncalibrated: "Установлен, поверка истекла",
  installed_calibrated: "Установлен, поверен",
  unknown: "Неизвестно",
};

export const PASSPORT_LABELS: Record<PassportStatus, string> = {
  empty: "Пусто",
  identity_only: "Только идентичность",
  topology_linked: "Топология связана",
  baseline_measured: "Базовые замеры",
  inspected: "Обследовано",
  cause_assessed: "Причина оценена",
  post_work_verified: "Пост-верификация",
};

export const INSPECTION_LABELS: Record<InspectionStatus, string> = {
  not_scheduled: "Не запланирован",
  scheduled: "Запланирован",
  in_progress: "Выполняется",
  completed: "Завершён",
  blocked: "Заблокирован",
};

export const CONSUMPTION_LABELS: Record<ConsumptionDataStatus, string> = {
  not_collected: "Не собраны",
  partial: "Частично",
  complete_unvalidated: "Полные, не проверены",
  complete_validated: "Полные, проверены",
};

export const MV_LABELS: Record<MvStatus, string> = {
  not_applicable: "Не применимо",
  baseline_pending: "Ожидает базовой линии",
  baseline_set: "Базовая линия задана",
  intervention_in_progress: "Мероприятие выполняется",
  post_measurement_pending: "Ожидает пост-замера",
  effect_verified: "Эффект подтверждён",
};

export const RENOVATION_LABELS: Record<RenovationReviewStatus, string> = {
  not_reviewed: "Не рассмотрено",
  under_review: "На рассмотрении",
  candidate: "Кандидат",
  approved: "Утверждено",
  not_applicable: "Не применимо",
};

export const MANAGEMENT_LABELS: Record<ManagementForm, string> = {
  osi: "ОСИ",
  simple_partnership: "Простое товарищество",
  management_company: "УК",
  other: "Другое",
  unknown: "Неизвестно",
};

export const BUILDING_TYPE_LABELS: Record<BuildingType, string> = {
  soviet_standard: "Типовой советский",
  modernized: "Модернизированный",
  new_construction: "Новое строительство",
  individual_project: "Индивидуальный проект",
  unknown: "Неизвестно",
};

export const CONSTRUCTION_PERIOD_LABELS: Record<ConstructionPeriod, string> = {
  before_1960: "До 1960",
  "1960_1979": "1960–1979",
  "1980_1999": "1980–1999",
  "2000_2015": "2000–2015",
  after_2015: "После 2015",
  unknown: "Неизвестно",
};

export const HEAT_ZONE_LABELS: Record<HeatZone, string> = {
  zone_tec1_south: "Южная зона (ТЭЦ-1)",
  zone_tec2_central: "Центральная зона (ТЭЦ-2)",
  zone_tec3_north: "Северная зона (ТЭЦ-3)",
  zone_unassigned: "Зона не определена",
};

export const OBSERVATION_LABELS: Record<ObservationCategory, string> = {
  none: "Нет наблюдений",
  underheating: "Недотоп",
  overheating: "Перетоп",
  distribution_imbalance: "Неравномерность",
  moisture: "Влажность",
  basement_condition: "Состояние подвала",
};
