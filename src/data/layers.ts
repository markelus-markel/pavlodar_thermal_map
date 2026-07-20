import type { MapLayerDefinition } from "../types/domain";

const EMPTY = "Данные ожидаются после институционального согласования";

export const mapLayers: MapLayerDefinition[] = [
  { id: "buildings", labelRu: "МКД", hasData: true, required: true },
  {
    id: "buildings_demo",
    labelRu: "Демонстрационные объекты",
    hasData: true,
    required: true,
  },
  { id: "heat_zones", labelRu: "Зоны теплоснабжения", hasData: true, required: true },
  { id: "heat_sources", labelRu: "Источники тепла (ТЭЦ-1/2/3)", hasData: true, required: true },
  { id: "tm20a", labelRu: "ТМ-20А", hasData: true, required: true },
  { id: "knowledge_level", labelRu: "Уровень изученности", hasData: true, required: true },
  { id: "heat_observations", labelRu: "Тепловые наблюдения", hasData: true, required: true },
  { id: "recommended_actions", labelRu: "Рекомендуемые действия", hasData: true, required: true },

  {
    id: "network_mains",
    labelRu: "Магистральные сети",
    hasData: false,
    emptyStateMessage: EMPTY,
    required: false,
  },
  {
    id: "connection_points",
    labelRu: "ЦТП / точки подключения",
    hasData: false,
    emptyStateMessage: EMPTY,
    required: false,
  },
  {
    id: "restriction_zones",
    labelRu: "Зоны ограничений",
    hasData: false,
    emptyStateMessage: EMPTY,
    required: false,
  },
  {
    id: "modernization_projects",
    labelRu: "Проекты модернизации",
    hasData: false,
    emptyStateMessage: EMPTY,
    required: false,
  },
  { id: "mv", labelRu: "M&V", hasData: false, emptyStateMessage: EMPTY, required: false },
  {
    id: "renovation",
    labelRu: "Реновация",
    hasData: false,
    emptyStateMessage: EMPTY,
    required: false,
  },
];
