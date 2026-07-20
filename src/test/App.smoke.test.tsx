import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

// jsdom has no WebGL context, so MapLibre GL JS cannot actually initialize a
// map in this test environment. We mock the constructor and the methods our
// MapView calls, which is sufficient to smoke-test that the rest of the
// application shell renders and responds to interaction correctly.
vi.mock("maplibre-gl", () => {
  class FakeMap {
    _listeners: Record<string, ((...args: unknown[]) => void)[]> = {};
    on(event: string, layerOrCb: unknown, cb?: unknown) {
      const handler = (typeof cb === "function" ? cb : layerOrCb) as (...args: unknown[]) => void;
      this._listeners[event] = this._listeners[event] || [];
      this._listeners[event].push(handler);
      if (event === "load") handler();
      return this;
    }
    addControl() {}
    addSource() {}
    addLayer() {}
    setStyle() {}
    once(event: string, cb: (...args: unknown[]) => void) {
      if (event === "style.load") cb();
      return this;
    }
    getSource() {
      return { setData: () => {} };
    }
    getLayer() {
      return true;
    }
    setLayoutProperty() {}
    setFilter() {}
    getCanvas() {
      return { style: {} };
    }
    remove() {}
  }
  class FakeNavigationControl {}
  class FakeAttributionControl {}
  return {
    default: { Map: FakeMap, NavigationControl: FakeNavigationControl, AttributionControl: FakeAttributionControl },
    Map: FakeMap,
    NavigationControl: FakeNavigationControl,
    AttributionControl: FakeAttributionControl,
  };
});

describe("App smoke test", () => {
  it("renders header, map view and default layers without crashing", () => {
    render(<App />);
    expect(screen.getByText("HouseMaster")).toBeInTheDocument();
    expect(screen.getByText("Тепловая карта Павлодара")).toBeInTheDocument();
    expect(screen.getByText("MVP v0.1")).toBeInTheDocument();
    expect(screen.getByRole("application", { name: "Карта Павлодара" })).toBeInTheDocument();
  });

  it("switches to dashboard view and shows computed metrics", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Дашборд"));
    expect(screen.getByText("Всего объектов")).toBeInTheDocument();
    expect(screen.getByText("DEMO-объекты")).toBeInTheDocument();
  });

  it("opens the filter panel and shows result count", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Фильтры"));
    expect(screen.getByText(/Найдено:/)).toBeInTheDocument();
  });

  it("opens the import modal", () => {
    render(<App />);
    fireEvent.click(screen.getByText("Импорт"));
    expect(screen.getByText("Импорт данных")).toBeInTheDocument();
  });

  it("toggles the theme and reflects it via data-theme attribute", () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: /светлую тему|тёмную тему/i });
    const initial = document.documentElement.getAttribute("data-theme");
    fireEvent.click(toggle);
    const after = document.documentElement.getAttribute("data-theme");
    expect(after).not.toBe(initial);
    expect(["dark", "light"]).toContain(after);
  });
});
