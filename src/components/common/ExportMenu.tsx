import { exportToCsv, exportToGeoJson, downloadTextFile } from "../../services/exportService";
import type { BuildingRecord } from "../../types/domain";
import "./ExportMenu.css";

interface Props {
  buildings: BuildingRecord[];
  onClose: () => void;
}

export function ExportMenu({ buildings, onClose }: Props) {
  function handleGeoJson() {
    downloadTextFile(
      "housemaster-pavlodar-export.geojson",
      exportToGeoJson(buildings),
      "application/geo+json"
    );
    onClose();
  }
  function handleCsv() {
    downloadTextFile("housemaster-pavlodar-export.csv", exportToCsv(buildings), "text/csv");
    onClose();
  }

  return (
    <div className="export-menu__backdrop" onClick={onClose}>
      <div className="export-menu" onClick={(e) => e.stopPropagation()}>
        <div className="export-menu__title">Экспорт текущей выборки ({buildings.length})</div>
        <button type="button" className="export-menu__item" onClick={handleGeoJson}>
          GeoJSON (.geojson)
        </button>
        <button type="button" className="export-menu__item" onClick={handleCsv}>
          CSV (.csv)
        </button>
        <p className="export-menu__note">Экспортируются только безопасные публичные поля.</p>
      </div>
    </div>
  );
}
