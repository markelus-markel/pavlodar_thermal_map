import { useRef, useState } from "react";
import { X, Upload } from "lucide-react";
import { importBuildings, type ImportResult } from "../../services/importService";
import type { BuildingRecord } from "../../types/domain";
import "./ImportModal.css";

interface Props {
  onClose: () => void;
  onImport: (buildings: BuildingRecord[]) => void;
}

export function ImportModal({ onClose, onImport }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [imported, setImported] = useState(false);

  async function handleFile(file: File) {
    const text = await file.text();
    setFileName(file.name);
    setResult(importBuildings(file.name, text));
    setImported(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function confirmImport() {
    if (!result) return;
    onImport(result.validBuildings);
    setImported(true);
  }

  return (
    <div className="import-modal__backdrop" onClick={onClose}>
      <div className="import-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <header className="import-modal__header">
          <h2>Импорт данных</h2>
          <button className="import-modal__close" onClick={onClose} type="button" aria-label="Закрыть">
            <X size={18} />
          </button>
        </header>

        <div className="import-modal__body">
          <p className="import-modal__intro">
            Поддерживаются форматы GeoJSON, JSON и CSV. Данные импортируются только в текущую сессию
            браузера и не сохраняются на сервер.
          </p>

          <div
            className="import-modal__dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <Upload size={22} aria-hidden="true" />
            <span>{fileName ?? "Перетащите файл сюда или нажмите, чтобы выбрать"}</span>
            <input
              ref={inputRef}
              type="file"
              accept=".geojson,.json,.csv"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>

          <div className="import-modal__samples">
            Примеры файлов:{" "}
            <a href="/sample-data/sample-buildings.geojson" download>
              sample-buildings.geojson
            </a>
            {", "}
            <a href="/sample-data/sample-buildings.csv" download>
              sample-buildings.csv
            </a>
            {", "}
            <a href="/sample-data/sample-buildings-with-errors.csv" download>
              sample-buildings-with-errors.csv
            </a>
          </div>

          {result && (
            <div className="import-modal__result">
              <div className="import-modal__stats">
                <span>Формат: {result.format.toUpperCase()}</span>
                <span>Строк: {result.totalRows}</span>
                <span className="import-modal__stats--ok">Валидных: {result.validBuildings.length}</span>
                <span className="import-modal__stats--err">Ошибок: {result.errors.length}</span>
              </div>

              {result.errors.length > 0 && (
                <div className="import-modal__errors">
                  <div className="import-modal__errors-title">Ошибки</div>
                  <ul>
                    {result.errors.slice(0, 20).map((err, i) => (
                      <li key={i}>
                        Строка {err.rowIndex + 1}
                        {err.buildingId ? ` (${err.buildingId})` : ""}: {err.messages.join("; ")}
                      </li>
                    ))}
                  </ul>
                  {result.errors.length > 20 && (
                    <div className="import-modal__more">…и ещё {result.errors.length - 20}</div>
                  )}
                </div>
              )}

              {result.validBuildings.length > 0 && (
                <div className="import-modal__preview">
                  <div className="import-modal__errors-title">
                    Предпросмотр ({Math.min(5, result.validBuildings.length)} из{" "}
                    {result.validBuildings.length})
                  </div>
                  <table className="import-modal__table">
                    <thead>
                      <tr>
                        <th>Building ID</th>
                        <th>Название</th>
                        <th>Knowledge</th>
                        <th>Risk</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.validBuildings.slice(0, 5).map((b) => (
                        <tr key={b.buildingId}>
                          <td>{b.buildingId}</td>
                          <td>{b.displayName}</td>
                          <td>{b.knowledgeStatus}</td>
                          <td>{b.riskStatus}</td>
                          <td>{b.actionStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        <footer className="import-modal__footer">
          {imported ? (
            <span className="import-modal__success">
              Импортировано {result?.validBuildings.length ?? 0} объектов в текущую сессию.
            </span>
          ) : (
            <button
              className="import-modal__confirm"
              type="button"
              disabled={!result || result.validBuildings.length === 0}
              onClick={confirmImport}
            >
              Импортировать {result ? `(${result.validBuildings.length})` : ""}
            </button>
          )}
          <button className="import-modal__cancel" type="button" onClick={onClose}>
            {imported ? "Закрыть" : "Отмена"}
          </button>
        </footer>
      </div>
    </div>
  );
}
