import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/site-layout';
import { Button } from '@/components/ui/button';
import {
  QrCode,
  MapPin,
  ShieldCheck,
  ScanLine,
  Building2,
  Accessibility,
  Volume2,
  Type,
  Clock,
} from 'lucide-react';

const BLUE = '#1a4fa0';

export default function LandingPage() {
  const [time, setTime] = useState(new Date());
  const [textSize, setTextSize] = useState<'normal' | 'large'>('normal');
  const [language, setLanguage] = useState<'ENG' | 'CEB' | 'FIL'>('ENG');

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const big = textSize === 'large';

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Head title="Navix Solution — QR-Based Office Navigation" />

      <SiteHeader />

      

      <main className="flex-1">
        {/* ── Hero ── */}
        <section
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #deeaf8 0%, #e8f2fb 40%, #f0f6fd 70%, #ffffff 100%)',
          }}
        >
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
          />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-20 lg:items-center">
            {/* Left copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-slate-700" />
                Davao City Halls
              </span>

              <h1
                className={`mt-6 font-bold tracking-tight text-slate-950 leading-[1.08] ${
                  big ? 'text-6xl sm:text-7xl' : 'text-5xl sm:text-6xl'
                }`}
              >
                Find any office.
                <br />
                <span style={{ color: BLUE }}>Just tap to start.</span>
              </h1>

              <p className={`mt-5 max-w-xl leading-8 text-slate-600 ${big ? 'text-xl' : 'text-lg'}`}>
                Scan a QR code, browse the directory, or tap below to see your route on
                an interactive floor map.
              </p>

              {/* Big touch CTAs — kiosk sized */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <Button
                  asChild
                  style={{ backgroundColor: BLUE, color: '#fff' }}
                  className="h-20 rounded-2xl text-xl font-semibold shadow-md hover:opacity-90 sm:text-2xl"
                >
                  <Link href="/scan" className="inline-flex items-center justify-center gap-3">
                    <ScanLine className="h-7 w-7" />
                    Scan QR Code
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-20 rounded-2xl border-2 border-slate-200 bg-white text-xl font-semibold text-slate-800 shadow-md hover:bg-slate-50 sm:text-2xl"
                >
                  <Link href="/directory" className="inline-flex items-center justify-center gap-3">
                    <Building2 className="h-7 w-7" style={{ color: BLUE }} />
                    Browse Directory
                  </Link>
                </Button>
              </div>

              <p className="mt-6 text-sm text-slate-400">
                Tap anywhere on a card to begin · Idle screen returns after 60 seconds
              </p>
            </div>

            {/* Right card */}
            <div className="relative">
              <div
                className="relative rounded-3xl border border-slate-200 bg-white p-8"
                style={{ boxShadow: '0 24px 64px rgba(15,23,42,0.08), 0 4px 16px rgba(15,23,42,0.04)' }}
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50">
                    <QrCode className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-base font-semibold text-slate-950">Civil Registry Office</div>
                    <div className="text-sm text-slate-500">Floor 1 · Room 101</div>
                  </div>
                  <span
                    className="ml-auto rounded-full px-3 py-1 text-xs font-semibold"
                    style={{ background: '#d1fae5', color: '#065f46' }}
                  >
                    OPEN
                  </span>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                    Walking route
                  </div>
                  <ol className="mt-4 space-y-3 text-base leading-7 text-slate-600">
                    {[
                      'Enter through the main lobby',
                      'Turn left at the central corridor',
                      'Civil Registry is on your right',
                    ].map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="font-semibold" style={{ color: BLUE }}>
                          {i + 1}.
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      32 m
                    </span>
                    <span>~ 45 sec walk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className={`font-bold text-slate-950 ${big ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'}`}>
              Everything visitors need, in one tap
            </h2>
            <p className={`mt-4 text-slate-600 ${big ? 'text-lg' : 'text-base'}`}>
              Designed for clarity, speed, and accessibility.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: QrCode, t: 'QR Code Navigation', d: 'Each office has a unique QR code. Scan to instantly view location and directions.' },
              { icon: MapPin, t: 'Interactive Floor Maps', d: 'See routes highlighted directly on a clean, interactive building map.' },
              { icon: Building2, t: 'Office Directory', d: 'Filter by floor or department. Tap a card for full office details.' },
            ].map((f) => (
              <button
                key={f.t}
                className="rounded-3xl border border-slate-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-blue-50">
                  <f.icon className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className={`mt-4 font-semibold text-slate-950 ${big ? 'text-xl' : 'text-lg'}`}>{f.t}</h3>
                <p className={`mt-2 leading-6 text-slate-600 ${big ? 'text-base' : 'text-sm'}`}>{f.d}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ── Idle / attract footer strip ── */}
        <section className="border-t border-slate-200 bg-slate-50 py-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 text-sm text-slate-500 sm:px-6">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Main Entrance Lobby Kiosk #1 · Online
            </span>
            <span className="italic text-slate-400">"Serving every visitor with clarity and care"</span>
          </div>
        </section>
      </main>

      
    </div>
  );
}