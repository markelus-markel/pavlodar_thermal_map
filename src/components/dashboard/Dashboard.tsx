import { computeDashboardMetrics } from "../../domain/dashboardMetrics";
import type { BuildingRecord } from "../../types/domain";
import { EmptyState } from "../common/EmptyState";
import "./Dashboard.css";

interface Props {
  buildings: BuildingRecord[];
}

export function Dashboard({ buildings }: Props) {
  const m = computeDashboardMetrics(buildings);

  if (buildings.length === 0) {
    return (
      <div className="dashboard">
        <EmptyState code="FILTER_EMPTY" message="Объекты не соответствуют текущим фильтрам." />
      </div>
    );
  }

  const cards: { label: string; value: number; hint?: string }[] = [
    { label: "Всего объектов", value: m.total },
    { label: "DEMO-объекты", value: m.demoCount },
    { label: "Данных недостаточно", value: m.dataInsufficient, hint: "unknown / reported" },
    { label: "Обследовано", value: m.inspected },
    { label: "Требуется осмотр", value: m.inspectionRequired },
    { label: "Quick Wins", value: m.quickWins },
    { label: "Инженерная оценка", value: m.engineeringAssessment },
    { label: "Кандидаты на модернизацию", value: m.modernizationCandidates },
    { label: "Готово к M&V", value: m.mvReady },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__grid">
        {cards.map((c) => (
          <div className="dashboard-card" key={c.label}>
            <div className="dashboard-card__value">{c.value}</div>
            <div className="dashboard-card__label">{c.label}</div>
            {c.hint && <div className="dashboard-card__hint">{c.hint}</div>}
          </div>
        ))}
      </div>
      <p className="dashboard__footnote">
        Показатели рассчитаны из текущего загруженного и отфильтрованного набора данных. Это не
        рейтинг домов или управляющих организаций.
      </p>
    </div>
  );
}
