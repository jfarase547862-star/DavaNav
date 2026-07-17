/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_INDOOREQUAL_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'maplibre-gl-indoorequal' {
  export default class IndoorEqual {
    level: string;
    levels: string[];
    constructor(map: import('maplibre-gl').Map, options?: {
      apiKey?: string;
      url?: string;
      geojson?: Record<string, object>;
      layers?: object[];
      heatmap?: boolean;
    });
    remove(fromRemoveEvent?: boolean): void;
    on(name: string, fn: (...args: unknown[]) => void): void;
    off(name: string, fn: (...args: unknown[]) => void): void;
    onAdd(): HTMLElement;
    onRemove(): void;
    setLevel(level: string): void;
    loadSprite(baseUrl: string, options?: { update?: boolean }): Promise<Record<string, unknown>>;
    setHeatmapVisible(visible: boolean): void;
  }
}
