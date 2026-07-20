import { useState } from "react";
import { X } from "lucide-react";
import type { BuildingRecord } from "../../types/domain";
import { ThreeStatusRow } from "../common/ThreeStatusRow";
import { DemoBadge } from "../common/DemoBadge";
import { ProvenanceChip } from "../common/ProvenanceChip";
import { EmptyState } from "../common/EmptyState";
import { FieldValue } from "./FieldValue";
import {
  BUILDING_TYPE_LABELS,
  CONSTRUCTION_PERIOD_LABELS,
  CONSUMPTION_LABELS,
  HEAT_ZONE_LABELS,
  INSPECTION_LABELS,
  MANAGEMENT_LABELS,
  METER_LABELS,
  MV_LABELS,
  OBSERVATION_LABELS,
  PASSPORT_LABELS,
  RENOVATION_LABELS,
} from "../../domain/statusRegistry";
import { heatSources } from "../../data/heatSources";
import "./BuildingCard.css";

type TabId = "overview" | "connection" | "systems" | "observations" | "economics" | "sources";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Обзор" },
  { id: "connection", label: "Подключение" },
  { id: "systems", label: "Системы" },
  { id: "observations", label: "Наблюдения" },
  { id: "economics", label: "Экономика" },
  { id: "sources", label: "Источники" },
];

const SYSTEM_STATUS_LABEL: Record<string, string> = {
  unknown: "Неизвестно",
  reported: "Заявлено",
  observed: "Наблюдалось",
  verified: "Подтверждено",
  poor: "Плохое",
  adequate: "Удовлетворительное",
  good: "Хорошее",
};

const GATE_LABEL: Record<string, string> = {
  not_opened: "Не открыт",
  open: "Открыт",
  blocked: "Заблокирован",
  passed: "Пройден",
};

const CAPEX_LABEL: Record<string, string> = {
  not_estimated: "Не оценено",
  draft: "Черновик",
  reviewed: "Проверено",
};

export function BuildingCard({
  building,
  onClose,
}: {
  building: BuildingRecord;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<TabId>("overview");
  const heatSource = heatSources.find((hs) => hs.id === building.connection.heatSourceId);

  return (
    <aside className="building-card" aria-label={`Карточка ${building.buildingId}`}>
      <header className="building-card__header">
        <div>
          <div className="building-card__id-row">
            <span className="building-card__id">{building.buildingId}</span>
            {building.demo && <DemoBadge compact />}
          </div>
          <div className="building-card__name">{building.displayName}</div>
        </div>
        <button className="building-card__close" onClick={onClose} aria-label="Закрыть карточку" type="button">
          <X size={18} />
        </button>
      </header>

      {building.demo && (
        <div className="building-card__demo-banner">DEMO DATA — NOT A REAL BUILDING ASSESSMENT</div>
      )}

      <div className="building-card__statuses">
        <ThreeStatusRow building={building} size="sm" />
      </div>

      <nav className="building-card__tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`building-card__tab ${tab === t.id ? "building-card__tab--active" : ""}`}
            onClick={() => setTab(t.id)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="building-card__body">
        {tab === "overview" && (
          <div className="building-card__grid">
            <FieldValue label="Тип дома" value={BUILDING_TYPE_LABELS[building.buildingType]} />
            <FieldValue label="Период строительства" value={CONSTRUCTION_PERIOD_LABELS[building.constructionPeriod]} />
            <FieldValue
              label="Этажность"
              value={building.floors != null ? String(building.floors) : ""}
              status={building.floors == null ? "tbd" : "normal"}
            />
            <FieldValue label="Форма управления" value={MANAGEMENT_LABELS[building.managementForm]} />
            <FieldValue label="Зона теплоснабжения" value={HEAT_ZONE_LABELS[building.heatZone]} />
            <FieldValue label="Дата обновления" value={building.lastUpdated} />
            <FieldValue label="Статус паспорта" value={PASSPORT_LABELS[building.passportStatus]} />
            <FieldValue label="Статус обследования" value={INSPECTION_LABELS[building.inspectionStatus]} />
            <FieldValue
              label="Геометрия"
              value={
                building.locationStatus === "approximate"
                  ? "Приблизительная (демо-размещение)"
                  : building.locationStatus === "public_map_reference"
                  ? "Публичная картографическая база, не подтверждено официально"
                  : building.locationStatus === "verified"
                  ? "Подтверждена"
                  : ""
              }
              status={building.locationStatus === "unknown" ? "tbd" : "normal"}
            />
          </div>
        )}

        {tab === "connection" && (
          <div className="building-card__grid">
            <FieldValue
              label="Источник тепла"
              value={heatSource ? heatSource.name : ""}
              status={heatSource ? "normal" : "tbd"}
              hint="Связь дом → источник не установлена в демонстрационном наборе."
            />
            <FieldValue
              label="Точка подключения"
              value={building.connection.connectionPointId ?? ""}
              status={building.connection.connectionPointId ? "normal" : "tbd"}
            />
            <FieldValue
              label="Граница ответственности"
              value={
                building.connection.responsibilityBoundaryStatus === "documented"
                  ? "Документирована"
                  : building.connection.responsibilityBoundaryStatus === "disputed"
                  ? "Оспаривается"
                  : ""
              }
              status={building.connection.responsibilityBoundaryStatus === "unknown" ? "tbd" : "normal"}
            />
            <FieldValue label="Статус счётчика" value={METER_LABELS[building.meterStatus]} />
            <FieldValue label="Полнота данных потребления" value={CONSUMPTION_LABELS[building.consumptionDataStatus]} />
          </div>
        )}

        {tab === "systems" && (
          <div className="building-card__grid">
            <FieldValue
              label="Тепловой узел"
              value={SYSTEM_STATUS_LABEL[building.systems.heatUnitStatus]}
              status={building.systems.heatUnitStatus === "unknown" ? "tbd" : "normal"}
            />
            <FieldValue
              label="Изоляция труб"
              value={SYSTEM_STATUS_LABEL[building.systems.pipeInsulationStatus]}
              status={building.systems.pipeInsulationStatus === "unknown" ? "tbd" : "normal"}
            />
            <FieldValue
              label="Арматура"
              value={SYSTEM_STATUS_LABEL[building.systems.valvesStatus]}
              status={building.systems.valvesStatus === "unknown" ? "tbd" : "normal"}
            />
            <FieldValue
              label="Подвал"
              value={SYSTEM_STATUS_LABEL[building.systems.basementStatus]}
              status={building.systems.basementStatus === "unknown" ? "tbd" : "normal"}
            />
            <FieldValue
              label="Оболочка здания"
              value={SYSTEM_STATUS_LABEL[building.systems.envelopeStatus]}
              status={building.systems.envelopeStatus === "unknown" ? "tbd" : "normal"}
            />
          </div>
        )}

        {tab === "observations" && (
          <div className="building-card__grid">
            <FieldValue label="Категория наблюдения" value={OBSERVATION_LABELS[building.observationCategory]} />
            {building.observationNote ? (
              <div className="building-card__note">{building.observationNote}</div>
            ) : (
              <EmptyState code="NO_DATA" message="Данных ещё нет, не «0»." compact />
            )}
            <FieldValue label="Дефекты" value="" status="tbd" hint="Подтверждённых дефектов в демо-наборе не зарегистрировано." />
          </div>
        )}

        {tab === "economics" && (
          <div className="building-card__grid">
            <FieldValue
              label="Пакет мероприятий"
              value={building.economics.measurePackage === "unknown" ? "" : building.economics.measurePackage}
              status={building.economics.measurePackage === "unknown" ? "tbd" : "normal"}
            />
            <FieldValue label="CAPEX" value={CAPEX_LABEL[building.economics.capexStatus]} />
            <FieldValue label="OPEX" value={CAPEX_LABEL[building.economics.opexStatus]} />
            <FieldValue label="Economic gate" value={GATE_LABEL[building.economics.economicGate]} />
            <FieldValue label="Готовность M&V" value={MV_LABELS[building.mvStatus]} />
            <FieldValue label="Реновация" value={RENOVATION_LABELS[building.renovationReview]} />
            {building.economics.economicGate === "not_opened" && (
              <EmptyState
                code="EVIDENCE_INCOMPLETE"
                message="Экономический расчёт заблокирован до открытия economic gate."
                compact
              />
            )}
          </div>
        )}

        {tab === "sources" && (
          <div className="building-card__grid">
            <ProvenanceChip provenance={building.provenance} />
            {building.demo && (
              <p className="building-card__demo-note">
                Все значения в этой карточке синтетические и созданы для демонстрации интерфейса. Они не
                описывают реальное здание и не являются официальным обследованием.
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
