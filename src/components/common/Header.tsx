import { Download, Upload, Map as MapIcon, LayoutDashboard, Sun, Moon } from "lucide-react";
import { SearchBar } from "../filters/SearchBar";
import type { ThemeMode } from "../../hooks/useTheme";
import "./Header.css";

interface Props {
  view: "map" | "dashboard";
  onViewChange: (v: "map" | "dashboard") => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onImportClick: () => void;
  onExportClick: () => void;
  onToggleFilters: () => void;
  filtersOpen: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function Header({
  view,
  onViewChange,
  searchQuery,
  onSearchChange,
  onImportClick,
  onExportClick,
  onToggleFilters,
  filtersOpen,
  theme,
  onToggleTheme,
}: Props) {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__title">HouseMaster</span>
        <span className="app-header__subtitle">Тепловая карта Павлодара</span>
      </div>

      <SearchBar value={searchQuery} onChange={onSearchChange} />

      <div className="app-header__view-switch" role="tablist" aria-label="Режим отображения">
        <button
          type="button"
          role="tab"
          aria-selected={view === "map"}
          className={`app-header__view-btn ${view === "map" ? "app-header__view-btn--active" : ""}`}
          onClick={() => onViewChange("map")}
        >
          <MapIcon size={14} /> Карта
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === "dashboard"}
          className={`app-header__view-btn ${view === "dashboard" ? "app-header__view-btn--active" : ""}`}
          onClick={() => onViewChange("dashboard")}
        >
          <LayoutDashboard size={14} /> Дашборд
        </button>
      </div>

      <button
        type="button"
        className={`app-header__action ${filtersOpen ? "app-header__action--active" : ""}`}
        onClick={onToggleFilters}
      >
        Фильтры
      </button>

      <button type="button" className="app-header__action" onClick={onImportClick}>
        <Upload size={14} /> Импорт
      </button>
      <button type="button" className="app-header__action" onClick={onExportClick}>
        <Download size={14} /> Экспорт
      </button>

      <button
        type="button"
        className="app-header__theme-toggle"
        onClick={onToggleTheme}
        aria-label={theme === "dark" ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
        title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="app-header__badges">
        <span className="app-header__badge app-header__badge--version">MVP v0.1</span>
        <span className="app-header__badge app-header__badge--evidence">Demo / Public Evidence</span>
      </div>
    </header>
  );
}
