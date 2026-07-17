import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/mobile/AppHeader';
import { Footer } from '@/components/mobile/Footer';
import { MapLibreFloorMap } from '@/components/shared/maplibre-floor-map';
import { seedOffices, getOffice, seedFloorMaps } from '@/lib/mock-data';
import { Eye, Type, Volume2 } from 'lucide-react';

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

type Lang = 'ENG' | 'CEB' | 'FIL';

export default function MobileMap() {
  const [destId] = useState<string>(seedOffices[0].id);
  const initialFloor = getOffice(destId)?.floor ?? seedFloorMaps[0]?.floorNumber ?? 1;
  const [floor, setFloor] = useState<number>(Number(initialFloor));
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');
  const [language, setLanguage] = useState<Lang>('ENG');
  const [voiceGuide, setVoiceGuide] = useState(false);
  const dest = getOffice(destId);

  // Scale the whole page's rem-based Tailwind text by bumping the root
  // font-size, so "Large text" enlarges labels across the page.
  useEffect(() => {
    document.documentElement.style.fontSize = textSize === 'large' ? '112.5%' : '100%';
    return () => {
      document.documentElement.style.fontSize = '100%';
    };
  }, [textSize]);

  return (
    <>
      <Head title="Interactive Map — DavaNav" />
      <AppHeader title="Interactive Map" subtitle="Find offices and routes inside City Hall" back />

      <main className="mx-auto w-full max-w-5xl bg-slate-50 px-4 pb-24 pt-4">

        {/* Accessibility bar — compact single row */}
        <section className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <Eye className="h-4 w-4 shrink-0 text-gov-blue" />

          <div className="flex overflow-hidden rounded-full border border-slate-200">
            {(['ENG', 'CEB', 'FIL'] satisfies Lang[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLanguage(item)}
                className="h-7 px-2.5 text-[11px] font-bold transition"
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
            onClick={() => setTextSize((current) => (current === 'normal' ? 'large' : 'normal'))}
            className="flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            <Type className="h-3.5 w-3.5 text-gov-blue" />
            {textSize === 'large' ? 'LARGE' : 'NORMAL'}
          </button>

          <button
            type="button"
            onClick={() => setVoiceGuide((value) => !value)}
            className="flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            <Volume2 className="h-3.5 w-3.5 text-gov-blue" />
            {voiceGuide ? 'ON' : 'OFF'}
          </button>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {seedFloorMaps.map((floorMap) => (
              <button
                key={floorMap.id}
                type="button"
                title={floorMap.name}
                style={floor === floorMap.floorNumber ? pillActive : pillBase}
                onClick={() => setFloor(floorMap.floorNumber)}
              >
                Floor {floorMap.floorNumber}
              </button>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 shadow-sm">
            <div className="h-[70vh] min-h-[420px]">
              <MapLibreFloorMap floor={floor} highlightId={dest?.id} onFloorChange={setFloor} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}