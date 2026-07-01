import { Head, Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { SiteFooter, SiteHeader } from '@/components/site-layout';
import { ScanLine, Camera, QrCode } from 'lucide-react';
import { seedOffices } from "@/lib/mock-data";
const BLUE = '#1a4fa0';

export default function Scan() {
  const [scanning, setScanning] = useState(false);
  const [matched, setMatched] = useState<string | null>(null);

  useEffect(() => {
    if (!scanning) return;
    const t = setTimeout(() => {
      const pick = seedOffices[Math.floor(Math.random() * seedOffices.length)];
      setMatched(pick.id);
      setScanning(false);
    }, 2200);
    return () => clearTimeout(t);
  }, [scanning]);

  const match = seedOffices.find((o) => o.id === matched);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: '#f8f9fb' }}>
      <Head title="Scan QR" />
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">

          {/* Page heading */}
          <h1 className="text-4xl font-bold text-slate-950">Scan Office QR</h1>
          <p className="mt-2 text-slate-500">
            Point your camera at the QR code posted at any office or hallway.
          </p>

          {/* Scanner card */}
          <div
            className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white"
            style={{ boxShadow: '0 4px 24px rgba(15,23,42,0.08)' }}
          >
            {/* Viewfinder */}
            <div
              className="relative w-full"
              style={{
                aspectRatio: '16/9',
                background: '#0a1628',
              }}
            >
              {/* Corner brackets */}
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative h-56 w-56">
                  {[
                    'top-0 left-0 border-l-[3px] border-t-[3px]',
                    'top-0 right-0 border-r-[3px] border-t-[3px]',
                    'bottom-0 left-0 border-l-[3px] border-b-[3px]',
                    'bottom-0 right-0 border-r-[3px] border-b-[3px]',
                  ].map((c) => (
                    <span
                      key={c}
                      className={`absolute h-8 w-8 rounded-sm ${c}`}
                      style={{ borderColor: '#3b82f6' }}
                    />
                  ))}

                  {/* Scan line */}
                  {scanning && (
                    <>
                      <style>{`
                        @keyframes scan {
                          0%, 100% { transform: translateY(0) }
                          50%       { transform: translateY(224px) }
                        }
                      `}</style>
                      <div
                        className="absolute left-0 right-0 top-0 h-0.5"
                        style={{
                          background: '#3b82f6',
                          boxShadow: '0 0 12px 2px rgba(59,130,246,0.6)',
                          animation: 'scan 2s ease-in-out infinite',
                        }}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Status pill */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-4 py-1.5 text-sm text-white backdrop-blur-sm">
                {scanning ? 'Scanning…' : 'Camera ready'}
              </div>
            </div>

            {/* Bottom bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Camera className="h-4 w-4 text-slate-400" />
                Prototype simulator
              </div>

              <button
                onClick={() => { setMatched(null); setScanning(true); }}
                disabled={scanning}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                style={{ background: BLUE }}
              >
                <ScanLine className="h-4 w-4" />
                {scanning ? 'Scanning…' : 'Simulate Scan'}
              </button>
            </div>
          </div>

          {/* Match result */}
          {match && (
            <div
              className="mt-6 rounded-2xl border bg-white p-5"
              style={{
                borderColor: '#bbf7d0',
                background: '#f0fdf4',
                boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
              }}
            >
              <div className="flex items-center gap-2" style={{ color: '#16a34a' }}>
                <QrCode className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-widest">QR detected</span>
              </div>
              <div className="mt-2 text-xl font-bold text-slate-950">{match.name}</div>
              <div className="text-sm text-slate-500">
                Floor {match.floor} · {match.room}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={`/office/${match.id}`}
                  className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ background: BLUE }}
                >
                  View Office
                </Link>
                <Link
                  href={`/map?to=${match.id}`}
                  className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Navigate on Map
                </Link>
              </div>
            </div>
          )}

          {/* Directory fallback */}
          <div
            className="mt-6 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500"
            style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.04)' }}
          >
            Or jump straight to the{' '}
            <Link
              href="/directory"
              className="font-medium underline underline-offset-2 transition hover:opacity-80"
              style={{ color: BLUE }}
            >
              Office Directory
            </Link>
            .
          </div>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}