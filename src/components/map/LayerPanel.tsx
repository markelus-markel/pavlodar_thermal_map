import { mapLayers } from "../../data/layers";
import type { MapLayerId } from "../../types/domain";
import "./LayerPanel.css";

interface Props {
  activeLayers: Set<MapLayerId>;
  onToggle: (id: MapLayerId) => void;
}

export function LayerPanel({ activeLayers, onToggle }: Props) {
  return (
    <div className="layer-panel">
      <div className="layer-panel__title">Слои карты</div>
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
    </div>
  );
}
