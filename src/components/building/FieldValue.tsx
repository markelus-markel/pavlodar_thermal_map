import "./FieldValue.css";

interface Props {
  label: string;
  value: string;
  hint?: string;
  status?: "normal" | "tbd" | "not_applicable" | "not_authorized" | "conflicted" | "stale";
}

const STATUS_LABEL: Record<NonNullable<Props["status"]>, string> = {
  normal: "",
  tbd: "TBD",
  not_applicable: "не применимо",
  not_authorized: "нет доступа",
  conflicted: "конфликт данных",
  stale: "устарело",
};

/**
 * Every field in the Building Card follows BUILDING_CARD_SPEC.md field
 * presentation rule: value + unit + status, with TBD / not_applicable /
 * not_authorized / conflicted / stale rendered distinctly rather than as
 * blank or zero.
 */
export function FieldValue({ label, value, hint, status = "normal" }: Props) {
  const isFlag = status !== "normal";
  return (
    <div className="field-value">
      <div className="field-value__label">{label}</div>
      <div className={`field-value__value ${isFlag ? `field-value__value--${status}` : ""}`}>
        {isFlag ? STATUS_LABEL[status] : value}
      </div>
      {hint && <div className="field-value__hint">{hint}</div>}
    </div>
  );
}
