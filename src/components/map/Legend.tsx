import {
  KNOWLEDGE_STATUSES,
  RISK_STATUSES,
} from "../../types/domain";
import {
  KNOWLEDGE_COLOR_VAR,
  KNOWLEDGE_LABELS,
  RISK_COLOR_VAR,
  RISK_LABELS,
} from "../../domain/statusRegistry";
import "./Legend.css";

export function Legend({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <div className={`legend ${collapsed ? "legend--collapsed" : ""}`}>
      <button className="legend__toggle" onClick={onToggle} type="button">
        {collapsed ? "Легенда ▲" : "Легенда ▾"}
      </button>
      {!collapsed && (
        <div className="legend__body">
          <p className="legend__principle">
            Цвет дома показывает <strong>полноту знания</strong>, а не качество управления или
            официальный технический статус.
          </p>

          <div className="legend__group">
            <div className="legend__group-title">Knowledge status (заливка маркера)</div>
            {KNOWLEDGE_STATUSES.map((k) => (
              <div className="legend__row" key={k}>
                <span
                  className="legend__swatch"
                  style={{ background: `var(${KNOWLEDGE_COLOR_VAR[k]})` }}
                />
                <span>{KNOWLEDGE_LABELS[k]}</span>
              </div>
            ))}
          </div>

          <div className="legend__group">
            <div className="legend__group-title">Risk status (контур маркера)</div>
            {RISK_STATUSES.map((r) => (
              <div className="legend__row" key={r}>
                <span
                  className="legend__swatch legend__swatch--ring"
                  style={{ borderColor: `var(${RISK_COLOR_VAR[r]})` }}
                />
                <span>{RISK_LABELS[r]}</span>
              </div>
            ))}
          </div>

          <div className="legend__group">
            <div className="legend__row">
              <span className="legend__swatch legend__swatch--demo" />
              <span>DEMO — синтетический демонстрационный объект</span>
            </div>
            <div className="legend__row">
              <span className="legend__swatch legend__swatch--dashed" />
              <span>Approximate — геометрия приблизительная / схематичная</span>
            </div>
            <div className="legend__row">
              <span className="legend__swatch legend__swatch--solid" />
              <span>Verified — геометрия подтверждена</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
