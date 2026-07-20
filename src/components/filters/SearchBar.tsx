import { Search } from "lucide-react";
import "./SearchBar.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <div className="search-bar">
      <Search size={15} className="search-bar__icon" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Building ID, название, тип, зона теплоснабжения…"
        aria-label="Поиск по объектам"
        className="search-bar__input"
      />
    </div>
  );
}
