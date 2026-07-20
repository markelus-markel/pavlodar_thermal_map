import type { Provenance } from "../../types/domain";
import { CONFIDENCE_LABELS } from "../../domain/statusRegistry";
import "./ProvenanceChip.css";

const SOURCE_TYPE_LABELS: Record<Provenance["sourceType"], string> = {
  public_document: "Публичный документ",
  operator_statement: "Заявление оператора",
  field_inspection: "Полевое обследование",
  resident_report: "Обращение жителей",
  public_map_reference: "Публичная картографическая база",
  demo_synthetic: "Демонстрационные данные",
};

const VERIFICATION_LABELS: Record<Provenance["verificationStatus"], string> = {
  reported: "Заявлено",
  verified: "Подтверждено",
  disputed: "Оспаривается",
  unknown: "Неизвестно",
};

export function ProvenanceChip({ provenance }: { provenance: Provenance }) {
  return (
    <div className="provenance-chip">
      <div className="provenance-chip__row">
        <span className="provenance-chip__source">{SOURCE_TYPE_LABELS[provenance.sourceType]}</span>
        <span className="provenance-chip__sep">·</span>
        <span>{provenance.asOf}</span>
      </div>
      <div className="provenance-chip__row provenance-chip__row--muted">
        <span>{CONFIDENCE_LABELS[provenance.confidence]}</span>
        <span className="provenance-chip__sep">·</span>
        <span>{VERIFICATION_LABELS[provenance.verificationStatus]}</span>
      </div>
      {provenance.sourceLabel && (
        <div className="provenance-chip__row provenance-chip__row--label">{provenance.sourceLabel}</div>
      )}
      {provenance.sourceUrl && (
        <a
          className="provenance-chip__link"
          href={provenance.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          Открыть источник ↗
        </a>
      )}
    </div>
  );
}
