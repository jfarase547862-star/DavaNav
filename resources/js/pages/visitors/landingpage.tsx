import { Head, Link } from '@inertiajs/react';
import { SiteFooter, SiteHeader } from '@/components/site-layout';
import { Button } from '@/components/ui/button';
import { QrCode, MapPin, Search, BarChart3, Accessibility, ShieldCheck, ScanLine, Building2, ArrowRight } from 'lucide-react';

export default function LandingPage() {
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
          {/* Soft radial accent top-right */}
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-[480px] w-[480px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)' }}
          />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28 lg:items-center">

            {/* Left copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-700" />
                Trusted by government offices
              </span>

              <h1 className="mt-5 text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl leading-[1.08]">
                Find any office.
                <br />
                <span style={{ color: '#1a4fa0' }}>Just scan &amp; go.</span>
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                Navix Solution helps visitors navigate government offices with QR codes, interactive floor maps, and step-by-step directions — across mobile, tablet, and desktop.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  style={{ backgroundColor: '#1a4fa0', color: '#fff' }}
                  className="hover:opacity-90"
                >
                  <Link href="/scan" className="inline-flex items-center gap-2">
                    <ScanLine className="h-5 w-5" />
                    Scan a QR Code
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="bg-white border-slate-200 text-slate-800 hover:bg-slate-50">
                  <Link href="/directory">Browse Directory</Link>
                </Button>
              </div>

             
            </div>

            {/* Right card */}
            <div className="relative">
              <div
                className="relative rounded-3xl border border-slate-200 bg-white p-8"
                style={{ boxShadow: '0 24px 64px rgba(15,23,42,0.08), 0 4px 16px rgba(15,23,42,0.04)' }}
              >
                {/* Card header */}
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50">
                    <QrCode className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-950">Civil Registry Office</div>
                    <div className="text-xs text-slate-500">Floor 1 · Room 101</div>
                  </div>
                  <span
                    className="ml-auto rounded-full px-3 py-1 text-[10px] font-semibold"
                    style={{ background: '#d1fae5', color: '#065f46' }}
                  >
                    OPEN
                  </span>
                </div>

                {/* Walking route */}
                <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-500">Walking route</div>
                  <ol className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
                    {[
                      'Enter through the main lobby',
                      'Turn left at the central corridor',
                      'Civil Registry is on your right',
                    ].map((step, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="font-semibold" style={{ color: '#1a4fa0' }}>{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
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
            <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">Everything visitors need, in one scan</h2>
            <p className="mt-4 text-slate-600">Designed for clarity, speed, and accessibility.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: QrCode,      t: 'QR Code Navigation',    d: 'Each office has a unique QR code. Scan to instantly view location and directions.' },
              { icon: MapPin,      t: 'Interactive Floor Maps', d: 'See routes highlighted directly on a clean, interactive building map.' },
              { icon: Building2,   t: 'Office Directory',      d: 'Filter by floor or department. Tap a card for full office details.' },
            ].map((f) => (
              <div
                key={f.t}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50">
                  <f.icon className="h-5 w-5 text-blue-700" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-950">{f.t}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Built for public service ──
        <section className="bg-slate-50 py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">Built for public service</h2>
              <p className="mt-4 text-slate-600">Reduce queues, cut confusion, and give every visitor a clear path — including seniors and first-time visitors.</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {[
                  'Reduces front-desk congestion',
                  'No app installation required',
                  'Works on any smartphone camera',
                  'Multi-floor wayfinding',
                  'Centralized admin control',
                  'Mobile, tablet, and desktop',
                ].map((b) => (
                  <li key={b} className="flex items-center gap-3">
                    <span
                      className="grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: '#1a4fa0' }}
                    >
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
  { k: '98%',   v: 'Visitor satisfaction' },
  { k: '45%', v: 'Front-desk inquiries' },
  { k: '7 min', v: 'Avg. time saved' },
  { k: '24/7',  v: 'Self-service' },
].map((s) => (
  <div key={s.v} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="text-sm text-slate-600">{s.v}</div>
    <div className="mt-2 flex justify-end">
      <div className="text-3xl font-bold" style={{ color: '#1a4fa0' }}>{s.k}</div>
    </div>
  </div>
))}
            </div>
          </div>
        </section> */}

        {/* ── About / Tech stack ──
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#1a4fa0' }}>About</span>
              <h2 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">A SaaS for modern government wayfinding</h2>
              <p className="mt-4 text-slate-600">Navix Solution is a multi-tenant SaaS platform purpose-built for government buildings. From a single dashboard, agencies manage offices, departments, floor maps, and QR codes — while visitors enjoy a seamless, no-install experience.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-950">Tech Stack</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                {[
                  { k: 'Frontend', v: 'React + Tailwind' },
                  { k: 'Backend',  v: 'Laravel API' },
                  { k: 'Database', v: 'MySQL' },
                  { k: 'Maps',     v: 'Floor Map SVG' },
                  { k: 'QR',       v: 'QR Generator' },
                  { k: 'Arch.',    v: 'SaaS Multi-Tenant' },
                ].map((t) => (
                  <div key={t.k} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-[10px] uppercase tracking-widest text-slate-500">{t.k}</div>
                    <div className="mt-1 font-medium text-slate-900">{t.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section> */}

      

      </main>

      <SiteFooter />
    </div>
  );
}