import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { SiteFooter, SiteHeader } from '@/components/site-layout';
import { MapLibreFloorMap, indoorRooms, CITY_HALL_NAME } from '@/components/maplibre-floor-map';
import { seedOffices, getOffice } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Search, Navigation, MapPin, ChevronDown, ZoomIn } from 'lucide-react';

const BLUE = '#1a4fa0';

const pillBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 36,
  padding: '0 18px',
  borderRadius: 9999,
  fontSize: 14,
  fontWeight: 500,
  cursor: 'pointer',
  border: '1px solid #d1d5db',
  background: '#ffffff',
  color: '#374151',
  transition: 'all 0.15s',
};

const pillActive: React.CSSProperties = {
  ...pillBase,
  background: BLUE,
  color: '#ffffff',
  border: `1px solid ${BLUE}`,
};

export default function KioskMap() {
  const [q, setQ] = useState('');
  const [destId, setDestId] = useState<string>(seedOffices[0].id);
  const initialFloor = getOffice(destId)?.floor ?? 1;
  const [floor, setFloor] = useState<number>(Number(initialFloor));
  const dest = getOffice(destId);
  const results = useMemo(
    () =>
      seedOffices.filter(
        (office) => !q || office.name.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <>
      <Head title="Interactive Map" />
      <div className="flex min-h-screen flex-col" style={{ background: '#f8f9fb' }}>
        <SiteHeader />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

            {/* Page title */}
            <h1 className="text-4xl font-bold text-slate-950">Interactive Map</h1>
            <p className="mt-2 text-slate-500">Pick a destination and follow the route.</p>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">

              {/* ── Map area ── */}
              <div className="space-y-4">

                {/* Floor pills */}
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 2, 3].map((f) => (
                    <button
                      key={f}
                      style={floor === f ? pillActive : pillBase}
                      onClick={() => setFloor(f)}
                    >
                      Floor {f}
                    </button>
                  ))}
                </div>

                {/* Floor map — MapLibre: outdoor basemap + indoor overlay when zoomed in */}
                <div className="overflow-hidden rounded-2xl border border-slate-200" style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.06)' }}>
                  <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
                    <ZoomIn className="h-3.5 w-3.5" />
                    Scroll to zoom in for the indoor floor view
                  </div>
                  <MapLibreFloorMap
                    floor={floor}
                    highlightId={
                      dest
                        ? indoorRooms.find(
                            (r) => Number(dest.floor) === r.floor && r.room === dest.room,
                          )?.id
                        : undefined
                    }
                    onSelect={(roomId) => {
                      const room = indoorRooms.find((r) => r.id === roomId);
                      if (!room) return;
                      const matched = seedOffices.find(
                        (o) => Number(o.floor) === room.floor && o.room === room.room,
                      );
                      if (matched) {
                        setDestId(matched.id);
                        setFloor(Number(matched.floor));
                      }
                    }}
                  />
                </div>

                {/* Nearby offices */}
                <div>
                  <h3 className="text-lg font-bold text-slate-950">
                    Nearby Offices on Floor {floor}
                  </h3>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {seedOffices
                      .filter((office) => Number(office.floor) === floor)
                      .map((office) => (
                        <Link
                          key={office.id}
                          href={`/kiosk/office/${office.id}`}
                          className="rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                          style={{ boxShadow: '0 2px 6px rgba(15,23,42,0.05)' }}
                        >
                          <div className="text-xs text-slate-400">{office.room}</div>
                          <div className="mt-1 font-semibold text-slate-950">{office.name}</div>
                          <div className="mt-1 text-xs text-slate-400">{office.department}</div>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>

              {/* ── Sidebar ── */}
              <aside className="space-y-4">

                {/* Search + office list card */}
                <div
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                  style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.06)' }}
                >
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search destination"
                      className="h-10 rounded-xl border-slate-200 bg-white pl-9 text-sm focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>

                  <div className="mt-3 max-h-72 space-y-0.5 overflow-auto">
                    {results.map((office) => {
                      const active = destId === office.id;
                      return (
                        <button
                          key={office.id}
                          onClick={() => {
                            setDestId(office.id);
                            setFloor(Number(office.floor));
                          }}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
                          style={
                            active
                              ? { background: BLUE, color: '#ffffff' }
                              : { color: '#374151' }
                          }
                        >
                          <span className="truncate font-medium">{office.name}</span>
                          <span
                            className="ml-2 shrink-0 text-xs font-semibold"
                            style={{ color: active ? 'rgba(255,255,255,0.75)' : '#9ca3af' }}
                          >
                            F{office.floor}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-1 flex justify-center text-slate-300">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>

                {/* Destination card */}
                {dest && (
                  <div
                    className="rounded-2xl border border-slate-200 bg-white p-5"
                    style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.06)' }}
                  >
                    <div
                      className="text-xs font-semibold uppercase tracking-widest"
                      style={{ color: BLUE }}
                    >
                      Destination
                    </div>
                    <div className="mt-1 text-xl font-bold text-slate-950">{dest.name}</div>
                    <div className="text-sm text-slate-500">
                      Floor {dest.floor} · {dest.room}
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Route
                      </div>
                      <ol className="mt-2 space-y-1.5 text-sm text-slate-700">
                        <li>1. Start at {CITY_HALL_NAME} main entrance</li>
                        <li>2. Take central corridor</li>
                        {Number(dest.floor) !== 1 && (
                          <li>3. Use stairs / elevator to Floor {dest.floor}</li>
                        )}
                        <li>
                          {Number(dest.floor) !== 1 ? 4 : 3}. Arrive at {dest.room}
                        </li>
                      </ol>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          ~{30 + Number(dest.floor) * 20} m
                        </span>
                        <span>~ {Number(dest.floor) + 1} min walk</span>
                      </div>
                    </div>

                    <Link
                      href={`/kiosk/office/${dest.id}`}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                      style={{ background: BLUE }}
                    >
                      <Navigation className="h-4 w-4" />
                      View Office
                    </Link>
                  </div>
                )}
              </aside>

            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}