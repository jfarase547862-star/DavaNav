import { useEffect, useRef, useState } from 'react';
import maplibregl, { Map as MLMap, GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// ── Fixed starting point: Davao City Hall ───────────────────────────────────
// San Pedro Street, Poblacion District, Davao City, Philippines
export const CITY_HALL_NAME = 'Davao City Hall';
export const CITY_HALL_COORDS: [number, number] = [125.6128, 7.0644]; // [lon, lat]

const BUILDING_COORDS = CITY_HALL_COORDS;
const BUILDING_ZOOM = 17.5;
const INDOOR_ZOOM_THRESHOLD = 18.2; // switch to indoor overlay past this zoom

// Free public style — no API key required
const BASEMAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

export interface IndoorRoom {
  id: string;
  name: string;
  room: string;
  floor: number;
  // Polygon ring in [lon, lat] pairs, relative offsets around BUILDING_COORDS
  offsets: [number, number][];
}

// Small synthetic offsets (degrees) so rooms sit inside/around the building footprint.
// 0.00003 deg ≈ ~3m at this latitude — enough to lay out a small floor plan.
const U = 0.000035;
function room(id: string, name: string, roomNo: string, floor: number, cx: number, cy: number): IndoorRoom {
  const w = U * 1.3;
  const h = U * 0.9;
  return {
    id,
    name,
    room: roomNo,
    floor,
    offsets: [
      [cx - w, cy - h],
      [cx + w, cy - h],
      [cx + w, cy + h],
      [cx - w, cy + h],
      [cx - w, cy - h],
    ],
  };
}

export const indoorRooms: IndoorRoom[] = [
  room('r102', "Ancillary Service Unit", 'Room 102', 1, -2, -1),
  room('r103', 'Business Permits', 'Room 103', 1, 0, -1),
  room('r104', 'City Veterinary', 'Room 104', 1, 2, -1),
  room('r105', "Civil Registrar's Office", 'Room 105', 1, 4, -1),
  room('r106', 'City Social Welfare', 'Room 106', 1, -4, -1),
  room('r107', 'City Tourism Operations', 'Room 107', 1, -2, 1),
  room('r109', 'Risk Reduction & Mgmt', 'Room 109', 1, 0, 1),
  room('r111', 'Lingap', 'Room 111', 1, 2, 1),
];

function offsetsToLngLat(offsets: [number, number][]): [number, number][] {
  return offsets.map(([dx, dy]) => [
    BUILDING_COORDS[0] + dx * U,
    BUILDING_COORDS[1] + dy * U,
  ]);
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
}

function buildIndoorGeoJSON(floor: number, highlightId?: string) {
  return {
    type: 'FeatureCollection' as const,
    features: indoorRooms
      .filter((r) => r.floor === floor)
      .map((r) => ({
        type: 'Feature' as const,
        properties: {
          id: r.id,
          name: r.name,
          room: r.room,
          highlight: r.id === highlightId,
        },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [offsetsToLngLat(r.offsets)],
        },
      })),
  };
}

interface Props {
  floor: number;
  highlightId?: string;
  onSelect?: (id: string) => void;
}

export function MapLibreFloorMap({ floor, highlightId, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const [error, setError] = useState<string | null>(null);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    if (!isWebGLAvailable()) {
      setError('WebGL is not available in this browser, so the live map cannot render.');
      return;
    }

    let map: MLMap;
    try {
      map = new maplibregl.Map({
        container: containerRef.current,
        style: BASEMAP_STYLE,
        center: BUILDING_COORDS,
        zoom: BUILDING_ZOOM,
        pitch: 0,
        attributionControl: { compact: true },
      });
    } catch (err) {
      console.error('MapLibre failed to initialize:', err);
      setError('The live map could not start in this browser.');
      return;
    }
    mapRef.current = map;

    map.on('error', (e) => {
      console.error('MapLibre error:', e?.error);
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

    map.on('load', () => {
      // Building marker (outdoor view) — fixed starting point
      new maplibregl.Marker({ color: '#1a4fa0' })
        .setLngLat(BUILDING_COORDS)
        .setPopup(new maplibregl.Popup({ offset: 18 }).setText(CITY_HALL_NAME))
        .addTo(map);

      // Indoor rooms source + layers (hidden until zoomed in)
      map.addSource('indoor-rooms', {
        type: 'geojson',
        data: buildIndoorGeoJSON(floor, highlightId) as any,
      });

      map.addLayer({
        id: 'indoor-fill',
        type: 'fill',
        source: 'indoor-rooms',
        paint: {
          'fill-color': [
            'case',
            ['get', 'highlight'],
            '#1a4fa0',
            '#ffffff',
          ],
          'fill-opacity': [
            'case',
            ['get', 'highlight'],
            0.85,
            0.9,
          ],
        },
      });

      map.addLayer({
        id: 'indoor-outline',
        type: 'line',
        source: 'indoor-rooms',
        paint: {
          'line-color': [
            'case',
            ['get', 'highlight'],
            '#1a4fa0',
            '#94a3b8',
          ],
          'line-width': 1.5,
        },
      });

      map.addLayer({
        id: 'indoor-label',
        type: 'symbol',
        source: 'indoor-rooms',
        layout: {
          'text-field': ['get', 'room'],
          'text-size': 11,
          'text-font': ['Noto Sans Bold'],
        },
        paint: {
          'text-color': [
            'case',
            ['get', 'highlight'],
            '#ffffff',
            '#1e3a5f',
          ],
        },
      });

      // Toggle indoor layer visibility by zoom level
      const applyVisibility = () => {
        const zoom = map.getZoom();
        const visible = zoom >= INDOOR_ZOOM_THRESHOLD;
        const vis = visible ? 'visible' : 'none';
        ['indoor-fill', 'indoor-outline', 'indoor-label'].forEach((id) => {
          if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', vis);
        });
      };
      applyVisibility();
      map.on('zoom', applyVisibility);

      // Click on a room
      map.on('click', 'indoor-fill', (e) => {
        const id = e.features?.[0]?.properties?.id as string | undefined;
        if (id) onSelectRef.current?.(id);
      });
      map.on('mouseenter', 'indoor-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'indoor-fill', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update indoor data when floor/highlight changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const src = map.getSource('indoor-rooms') as GeoJSONSource | undefined;
      if (src) src.setData(buildIndoorGeoJSON(floor, highlightId) as any);
    };
    if (map.isStyleLoaded()) apply();
    else map.once('load', apply);
  }, [floor, highlightId]);

  if (error) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl bg-slate-50 px-6 text-center"
        style={{ minHeight: 480 }}
      >
        <p className="text-sm font-medium text-slate-600">Map unavailable</p>
        <p className="max-w-xs text-xs text-slate-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full" style={{ minHeight: 480 }}>
      <div ref={containerRef} className="h-full w-full rounded-2xl" style={{ minHeight: 480 }} />

      {/* Fixed origin badge */}
      <div
        className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow"
        style={{ background: '#1a4fa0', color: '#fff' }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        Start: {CITY_HALL_NAME}
      </div>

      {/* Recenter to City Hall */}
      <button
        onClick={() => {
          mapRef.current?.flyTo({ center: CITY_HALL_COORDS, zoom: BUILDING_ZOOM });
        }}
        className="absolute bottom-3 left-3 z-10 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow hover:bg-slate-50"
      >
        Recenter to City Hall
      </button>
    </div>
  );
}