import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { SiteHeader } from '@/components/shared/site-layout';
import { MapLibreFloorMap, indoorRooms } from '@/components/shared/maplibre-floor-map';
import { TurnByTurnGuide } from '@/components/mobile/turn-by-turn-guide';
import { seedOffices, getOffice } from '@/lib/mock-data';
import { ZoomIn, Eye, Type, Volume2, ArrowLeft, Layers, Info } from 'lucide-react';

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
  width: '100%',
};

const pillActive: React.CSSProperties = {
  ...pillBase,
  background: BLUE,
  color: '#ffffff',
  border: `1px solid ${BLUE}`,
};

export default function KioskMap() {
  const [destId, setDestId] = useState<string>(seedOffices[0].id);
  const initialFloor = getOffice(destId)?.floor ?? 1;
  const [floor, setFloor] = useState<number>(Number(initialFloor));
  const [activeStep, setActiveStep] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');
  const [language, setLanguage] = useState<'ENG' | 'CEB' | 'FIL'>('ENG');
  const [voiceGuide, setVoiceGuide] = useState(false);
  const dest = getOffice(destId);

  const toggleTextSize = () => {
    setTextSize((current) => (current === 'normal' ? 'large' : 'normal'));
  };

  const nearbyOffices = useMemo(
    () => seedOffices.filter((office) => Number(office.floor) === floor),
    [floor],
  );

  useEffect(() => {
    setActiveStep(0);
  }, [destId]);

  const distance = dest ? 30 + Number(dest.floor) * 18 : 0;
  const eta = dest ? Math.max(1, Math.round(distance / 50)) : 0;
  const steps = dest
    ? [
        'Walk straight for 15 meters from the main entrance.',
        "Turn right near the Treasurer's Office.",
        Number(dest.floor) === 1
          ? 'Continue through Hallway B.'
          : `Take the stairs or elevator up to Floor ${dest.floor}.`,
        `Destination ${dest.name} (${dest.room}) is on your left.`,
      ]
    : [];

  const selectDestination = (officeId: string) => {
    const office = getOffice(officeId);
    if (!office) return;
    setDestId(officeId);
    setFloor(Number(office.floor));
    setNavigating(false);
  };

  return (
    <>
      <Head title="Interactive Map" />
      <div className="flex min-h-screen flex-col" style={{ background: '#f8f9fb' }}>
        <SiteHeader />

        <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 flex-shrink-0" style={{ color: BLUE }} />
              <div>
                <div className="text-sm font-bold tracking-wide text-slate-800">DAVANAV ACCESSIBILITY</div>
                <div className="text-[11px] text-slate-400">Tap options to make screen easier to read</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Language:</span>
              <div className="flex overflow-hidden rounded-full border border-slate-200">
                {(['ENG', 'CEB', 'FIL'] as const).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLanguage(item)}
                    className="h-8 px-3 text-xs font-bold transition"
                    style={
                      language === item
                        ? { background: BLUE, color: '#ffffff' }
                        : { background: 'transparent', color: '#64748b' }
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={toggleTextSize}
                className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Type className="h-3.5 w-3.5" style={{ color: BLUE }} />
                Text Size: {textSize === 'large' ? 'LARGE' : 'NORMAL'}
              </button>

              <button
                type="button"
                onClick={() => setVoiceGuide((value) => !value)}
                className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Volume2 className="h-3.5 w-3.5" style={{ color: BLUE }} />
                <span className="hidden sm:inline">Voice Guide: </span>
                {voiceGuide ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

        </div>

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

            {/* Page title */}
            <h1 className="text-4xl font-bold text-slate-950">Interactive Map</h1>
            <p className="mt-2 text-slate-500">Pick a destination and follow the route.</p>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_300px]">

              {/* ── Map area ── */}
              <div className="space-y-4">

                {navigating ? (
                  /* Back-to-map control so navigation mode isn't a dead end */
                  <button
                    type="button"
                    onClick={() => setNavigating(false)}
                    className="flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to map
                  </button>
                ) : (
                  dest && (
                    <div
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3"
                      style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.06)' }}
                    >
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Selected destination
                        </div>
                        <div className="text-base font-bold text-slate-950">
                          {dest.name} <span className="font-normal text-slate-400">· Floor {dest.floor}, {dest.room}</span>
                        </div>
                      </div>
                      <Link
                        href={`/kiosk/office/${dest.id}`}
                        className="flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-white transition hover:opacity-90"
                        style={{ background: BLUE }}
                      >
                        <Info className="h-4 w-4" />
                        View Office Details
                      </Link>
                    </div>
                  )
                )}

                {navigating && dest ? (
                  <TurnByTurnGuide
                    steps={steps}
                    activeIndex={activeStep}
                    totalDistance={distance}
                    totalMinutes={eta}
                    floorLabel={`Floor ${dest.floor}`}
                    onSelectStep={setActiveStep}
                    onPrev={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                    onNext={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                    onRecalculate={() => {
                      setActiveStep(0);
                    }}
                  />
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-slate-200" style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.06)' }}>
                    <div className="flex items-center gap-1.5 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-500">
                      <ZoomIn className="h-3.5 w-3.5" />
                      Scroll to zoom in for the indoor floor view
                    </div>
                    <MapLibreFloorMap
                      floor={floor}
                      onFloorChange={setFloor}
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
                        if (matched) selectDestination(matched.id);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* ── Sidebar ── */}
              <aside className="space-y-4">

                {/* Nearby floors */}
                <div
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                  style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.06)' }}
                >
                  <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    <Layers className="h-3.5 w-3.5" />
                     Floors
                  </div>
                  <div className="flex flex-col gap-2">
                    {[1, 2, 3].map((f) => (
                      <button
                        key={f}
                        type="button"
                        style={floor === f ? pillActive : pillBase}
                        onClick={() => setFloor(f)}
                      >
                        Floor {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nearby offices - scrollable, filtered by the floor selected above */}
                <div
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                  style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.06)' }}
                >
                  <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Nearby Offices on Floor {floor}
                  </div>
                  <div className="max-h-96 space-y-0.5 overflow-auto">
                    {nearbyOffices.length === 0 && (
                      <div className="px-3 py-6 text-center text-sm text-slate-400">
                        No offices on this floor.
                      </div>
                    )}
                    {nearbyOffices.map((office) => {
                      const active = destId === office.id;
                      return (
                        <button
                          key={office.id}
                          type="button"
                          onClick={() => selectDestination(office.id)}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
                          style={
                            active
                              ? { background: BLUE, color: '#ffffff' }
                              : { color: '#374151' }
                          }
                        >
                          <span className="min-w-0 flex-1 truncate font-medium">{office.name}</span>
                          <span
                            className="ml-2 shrink-0 text-xs font-semibold"
                            style={{ color: active ? 'rgba(255,255,255,0.75)' : '#9ca3af' }}
                          >
                            {office.room}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </aside>

            </div>
          </div>
        </main>


      </div>
    </>
  );
} 