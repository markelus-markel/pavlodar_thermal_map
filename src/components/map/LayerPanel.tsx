import { ChevronDown, ChevronUp, Layers } from "lucide-react";
import { mapLayers } from "../../data/layers";
import type { MapLayerId } from "../../types/domain";
import "./LayerPanel.css";

interface Props {
  activeLayers: Set<MapLayerId>;
  onToggle: (id: MapLayerId) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export function LayerPanel({ activeLayers, onToggle, collapsed, onToggleCollapsed }: Props) {
  return (
    <div className={`layer-panel ${collapsed ? "layer-panel--collapsed" : ""}`}>
      <button className="layer-panel__toggle" onClick={onToggleCollapsed} type="button">
        <Layers size={14} />
        <span>Слои карты</span>
        {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
      {!collapsed && (
        <div className="layer-panel__list">
          {mapLayers.map((layer) => (
            <label key={layer.id} className="layer-panel__item">
              <input
                type="checkbox"
                checked={activeLayers.has(layer.id)}
                onChange={() => onToggle(layer.id)}
              />
              <span className="layer-panel__label">{layer.labelRu}</span>
              {!layer.hasData && <span className="layer-panel__pending">нет данных</span>}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
