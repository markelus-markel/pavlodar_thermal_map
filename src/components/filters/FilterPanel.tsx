import { X } from "lucide-react";
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
  PASSPORT_STATUSES,
  RENOVATION_REVIEW_STATUSES,
  RISK_STATUSES,
} from "../../types/domain";
import {
  ACTION_LABELS,
  BUILDING_TYPE_LABELS,
  CONFIDENCE_LABELS,
  CONSTRUCTION_PERIOD_LABELS,
  CONSUMPTION_LABELS,
  HEAT_ZONE_LABELS,
  INSPECTION_LABELS,
  KNOWLEDGE_LABELS,
  MANAGEMENT_LABELS,
  METER_LABELS,
  MV_LABELS,
  PASSPORT_LABELS,
  RENOVATION_LABELS,
  RISK_LABELS,
} from "../../domain/statusRegistry";
import {
  applyFilters,
  countActiveFilters,
  EMPTY_FILTER_STATE,
  type FilterState,
  type MultiSelectFilterKey,
} from "../../domain/filters";
import type { BuildingRecord } from "../../types/domain";
import "./FilterPanel.css";

interface FilterGroupConfig {
  key: MultiSelectFilterKey;
  title: string;
  options: { value: string; label: string }[];
}

const GROUPS: FilterGroupConfig[] = [
  { key: "heatZone", title: "Зона теплоснабжения", options: HEAT_ZONES.map((v) => ({ value: v, label: HEAT_ZONE_LABELS[v] })) },
  { key: "buildingType", title: "Тип дома", options: BUILDING_TYPES.map((v) => ({ value: v, label: BUILDING_TYPE_LABELS[v] })) },
  { key: "constructionPeriod", title: "Период строительства", options: CONSTRUCTION_PERIODS.map((v) => ({ value: v, label: CONSTRUCTION_PERIOD_LABELS[v] })) },
  { key: "managementForm", title: "Форма управления", options: MANAGEMENT_FORMS.map((v) => ({ value: v, label: MANAGEMENT_LABELS[v] })) },
  { key: "meterStatus", title: "Статус счётчика", options: METER_STATUSES.map((v) => ({ value: v, label: METER_LABELS[v] })) },
  { key: "knowledgeStatus", title: "Knowledge status", options: KNOWLEDGE_STATUSES.map((v) => ({ value: v, label: KNOWLEDGE_LABELS[v] })) },
  { key: "confidence", title: "Confidence", options: CONFIDENCE_LEVELS.map((v) => ({ value: v, label: CONFIDENCE_LABELS[v] })) },
  { key: "riskStatus", title: "Risk status", options: RISK_STATUSES.map((v) => ({ value: v, label: RISK_LABELS[v] })) },
  { key: "actionStatus", title: "Action status", options: ACTION_STATUSES.map((v) => ({ value: v, label: ACTION_LABELS[v] })) },
  { key: "passportStatus", title: "Статус паспорта", options: PASSPORT_STATUSES.map((v) => ({ value: v, label: PASSPORT_LABELS[v] })) },
  { key: "inspectionStatus", title: "Статус обследования", options: INSPECTION_STATUSES.map((v) => ({ value: v, label: INSPECTION_LABELS[v] })) },
  { key: "mvStatus", title: "M&V", options: MV_STATUSES.map((v) => ({ value: v, label: MV_LABELS[v] })) },
  { key: "renovationReview", title: "Реновация", options: RENOVATION_REVIEW_STATUSES.map((v) => ({ value: v, label: RENOVATION_LABELS[v] })) },
];

// consumption data status isn't in FilterState per current type but spec
// lists it; kept here for reference/help text only to avoid scope creep on
// the typed filter model. (Included in dashboard/card views instead.)
void CONSUMPTION_DATA_STATUSES;
void CONSUMPTION_LABELS;

interface Props {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  allBuildings: BuildingRecord[];
  isOpen: boolean;
  onClose: () => void;
}

export function FilterPanel({ filters, onChange, onReset, allBuildings, isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const resultCount = applyFilters(allBuildings, filters).length;
  const activeCount = countActiveFilters(filters);

  function toggleValue(key: MultiSelectFilterKey, value: string) {
    const current = filters[key] as string[];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next } as FilterState);
  }

  function removeChip(key: MultiSelectFilterKey, value: string) {
    toggleValue(key, value);
  }

  const activeChips: { key: MultiSelectFilterKey; value: string; label: string }[] = [];
  for (const group of GROUPS) {
    for (const value of filters[group.key]) {
      const opt = group.options.find((o) => o.value === value);
      activeChips.push({ key: group.key, value, label: `${group.title}: ${opt?.label ?? value}` });
    }
  }

  return (
    <aside className="filter-panel" aria-label="Фильтры">
      <div className="filter-panel__header">
        <h2 className="filter-panel__title">Фильтры</h2>
        <button className="filter-panel__close" onClick={onClose} aria-label="Закрыть фильтры" type="button">
          <X size={16} />
        </button>
      </div>

      <div className="filter-panel__summary">
        <span>
          Найдено: <strong>{resultCount}</strong> из {allBuildings.length}
        </span>
        <button
          className="filter-panel__reset"
          type="button"
          onClick={onReset}
          disabled={activeCount === 0 && filters.includeDemo}
        >
          Сбросить фильтры
        </button>
      </div>

      {activeChips.length > 0 && (
        <div className="filter-panel__chips">
          {activeChips.map((chip) => (
            <button
              key={`${chip.key}-${chip.value}`}
              className="filter-chip"
              type="button"
              onClick={() => removeChip(chip.key, chip.value)}
            >
              {chip.label}
              <X size={11} />
            </button>
          ))}
        </div>
      )}

      <label className="filter-panel__demo-toggle">
        <input
          type="checkbox"
          checked={filters.includeDemo}
          onChange={() => onChange({ ...filters, includeDemo: !filters.includeDemo })}
        />
        Показывать демонстрационные объекты
      </label>

      {resultCount === 0 && (
        <div className="filter-panel__empty">
          FILTER_EMPTY — объекты не соответствуют фильтрам. Измените или сбросьте фильтры.
        </div>
      )}

      <div className="filter-panel__groups">
        {GROUPS.map((group) => (
          <details className="filter-group" key={group.key} open={filters[group.key].length > 0}>
            <summary className="filter-group__summary">
              {group.title}
              {filters[group.key].length > 0 && (
                <span className="filter-group__count">{filters[group.key].length}</span>
              )}
            </summary>
            <div className="filter-group__options">
              {group.options.map((opt) => (
                <label key={opt.value} className="filter-group__option">
                  <input
                    type="checkbox"
                    checked={filters[group.key].includes(opt.value as never)}
                    onChange={() => toggleValue(group.key, opt.value)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </details>
        ))}
      </div>
    </aside>
  );
}

export { EMPTY_FILTER_STATE };
