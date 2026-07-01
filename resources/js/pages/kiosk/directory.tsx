import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { SiteFooter, SiteHeader } from '@/components/site-layout';
import {
  Search,
  MapPin,
  Globe,
  ChevronRight,
  Delete,
  Eye,
  Type,
  Accessibility,
  Volume2,
} from 'lucide-react';
import { seedOffices } from '@/lib/mock-data';

// ── Theme tokens ──────────────────────────────────────────────────────────────
const BLUE        = '#1a4fa0';
const BLUE_SOFT   = '#dbeafe';
const BAND_GRADIENT = 'linear-gradient(135deg, #deeaf8 0%, #e8f2fb 50%, #f0f6fd 100%)';
const PANEL_BG    = '#ffffff';
const PAGE_BG     = '#f8f9fb';
const KEY_BG      = '#eef2f8';
const KEY_BORDER  = '#d6e0ee';

// Derive a short tag list from department name
function tagsFor(o: (typeof seedOffices)[0]): string[] {
  const abbr: Record<string, string[]> = {
    'ancillary-service-unit':                              ['ASU'],
    'barangay-cultural-affairs':                           ['BCCA', 'BARANGAY'],
    'business-bureau':                                     ['BB', 'PERMITS'],
    'city-accountants-office':                             ['CAO', 'FINANCE'],
    'city-administrators-office':                          ['CADM', 'ADMIN'],
    'city-agriculturists-office':                          ['CAGRI', 'AGRI'],
    'city-anti-drug-abuse-council':                        ['CADAC', 'ANTI-DRUG'],
    'city-archives-records-office':                        ['CARO', 'RECORDS'],
    'city-assessors-office':                               ['ASSESS', 'PROPERTY'],
    'city-budget-office':                                  ['CBO', 'BUDGET'],
    'city-college-of-davao':                               ['CCD', 'EDUCATION'],
    'city-cooperative-development-office':                 ['CCDO', 'COOP'],
    'city-economic-enterprise-office':                     ['CEEO', 'ENTERPRISE'],
    'city-engineers-office':                               ['CEO', 'INFRA'],
    'city-environment-natural-resources-office':           ['CENRO', 'ENV'],
    'city-general-services-office':                        ['CGSO', 'SERVICES'],
    'city-health-office':                                  ['CHO', 'HEALTH'],
    'city-information-technology-center':                  ['CITC', 'IT'],
    'city-information-office':                             ['CIO', 'MEDIA'],
    'city-legal-office':                                   ['CLO', 'LEGAL'],
    'city-library-information-center':                     ['CLIC', 'LIBRARY'],
    'city-planning-development-office':                    ['CPDO', 'ZONING'],
    'city-social-welfare-development-office':              ['CSWDO', 'WELFARE'],
    'city-tourism-operations-office':                      ['CTOO', 'TOURISM'],
    'city-transportation-traffic-management-office':       ['CTTMO', 'TRAFFIC'],
    'city-treasurers-office':                              ['CTO', 'REVENUE'],
    'city-veterinarians-office':                           ['CVO', 'ANIMALS'],
    'civil-registrars-office':                             ['CRO', 'RECORDS'],
    'correspondence-record-division':                      ['CRD', 'RECORDS'],
    'davao-city-central-911':                              ['911', 'EMERGENCY'],
    'davao-city-housing-office':                           ['DCHO', 'HOUSING'],
    'davao-city-investment-promotion-center':              ['IPC', 'INVEST'],
    'davao-city-muslim-affairs-office':                    ['DCMAO', 'MUSLIM'],
    'davao-city-treatment-rehabilitation-center':          ['DCTRC', 'REHAB'],
    'disaster-risk-reduction-management-office':           ['DRRMO', 'DISASTER'],
    'educational-benefit-system-unit':                     ['EBSU', 'SCHOLARSHIP'],
    'human-resource-management-office':                    ['HRMO', 'HR'],
    'integrated-gender-development-division':              ['IGDD', 'GENDER'],
    'internal-audit-service-division':                     ['IASD', 'AUDIT'],
    'lingap':                                              ['LINGAP', 'WELFARE'],
    'madrasah-development-promotion-unit':                 ['MDPU', 'MADRASAH'],
    'museo-dabawenyo':                                     ['MUSEO', 'CULTURE'],
    'office-for-senior-citizens-affairs':                  ['OSCA', 'PWD/SENIOR'],
    'office-city-building-official':                       ['OCBO', 'BUILDING'],
    'peace-911':                                           ['PEACE', 'SAFETY'],
    'public-employment-service-office':                    ['PESO', 'JOBS'],
    'public-safety-security-office':                       ['PSSO', 'SAFETY'],
    'sangguniang-panlungsod':                              ['SP', 'LEGISLATIVE'],
    'sports-development-division':                         ['SDD', 'SPORTS'],
    'vices-regulation-unit':                               ['VRU', 'REGULATION'],
  };
  return abbr[o.id] ?? [o.id.toUpperCase().slice(0, 4)];
}

const popularSearches = [
  'Birth Certificate',
  'Business Permit',
  'Real Property Tax',
  'PWD / Senior ID',
  'Health / Clinic',
  'Zoning / Map',
  'Emergency 911',
  'Scholarship',
];

const keyboardRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '-'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '.', '_'],
];

export default function Directory() {
  const [q, setQ]                     = useState('');
  const [selectedId, setSelectedId]   = useState(seedOffices[0].id);
  const [keyboardVisible, setKeyboardVisible] = useState(true);
  const [textSize, setTextSize]       = useState<'normal' | 'large'>('normal');
  const [language, setLanguage]       = useState<'ENG' | 'CEB' | 'FIL'>('ENG');

  const filtered = useMemo(() => {
    if (!q) return seedOffices;
    const needle = q.toLowerCase();
    return seedOffices.filter((o) =>
      `${o.name} ${o.department ?? ''} ${tagsFor(o).join(' ')} ${o.services?.join(' ') ?? ''}`
        .toLowerCase()
        .includes(needle),
    );
  }, [q]);

  const selected =
    seedOffices.find((o) => o.id === selectedId) ??
    filtered[0] ??
    seedOffices[0];

  const big = textSize === 'large';

  const pressKey  = (k: string) => setQ((prev) => prev + k.toLowerCase());
  const backspace = ()           => setQ((prev) => prev.slice(0, -1));

  return (
    <>
      <Head title="Office Directory" />
      <div className="flex min-h-screen flex-col" style={{ background: PAGE_BG }}>
        <SiteHeader />

        {/* ── Accessibility bar ── */}
        <div style={{ background: PANEL_BG, borderBottom: '1px solid #e2e8f0' }}>
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 flex-shrink-0" style={{ color: BLUE }} />
              <div>
                <div className="text-sm font-bold tracking-wide text-slate-800">NAVIX ACCESSIBILITY</div>
                <div className="text-[11px] text-slate-400">WCAG 2.1 &amp; SENIOR ASSIST TOOL</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Language:</span>
              <div className="flex overflow-hidden rounded-full border border-slate-200">
                {(['ENG', 'CEB', 'FIL'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className="h-8 px-3 text-xs font-bold transition"
                    style={
                      language === l
                        ? { background: BLUE, color: '#ffffff' }
                        : { background: 'transparent', color: '#64748b' }
                    }
                  >
                    {l}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setTextSize(big ? 'normal' : 'large')}
                className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Type className="h-3.5 w-3.5" style={{ color: BLUE }} />
                Text Size: {big ? 'LARGE' : 'NORMAL'}
              </button>

              <button className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                <Accessibility className="h-3.5 w-3.5" style={{ color: BLUE }} />
                <span className="hidden sm:inline">Accessible Route: </span>OFF
              </button>

              <button className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                <Volume2 className="h-3.5 w-3.5" style={{ color: BLUE }} />
                <span className="hidden sm:inline">Voice Guide: </span>OFF
              </button>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 pb-2 text-xs text-slate-400 sm:px-6">
            Tap options to make screen easier to read
          </div>
        </div>

        {/* ── Title band ── */}
        <div style={{ background: BAND_GRADIENT, borderBottom: '1px solid #e2e8f0' }}>
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h1
                className={`font-bold tracking-tight text-slate-950 ${
                  big ? 'text-2xl sm:text-3xl lg:text-[32px]' : 'text-xl sm:text-2xl lg:text-[26px]'
                }`}
                style={{ letterSpacing: '0.01em' }}
              >
                DAVAO CITY HALL OFFICE DIRECTORY
              </h1>
              <p
                className={`mt-1 font-medium text-slate-500 ${big ? 'text-sm' : 'text-xs'} uppercase tracking-wide`}
              >
                Search or browse categories to locate government services
              </p>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">

              {/* ── Left: search + keyboard ── */}
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLUE }} />
                      Search Database
                    </span>
                    <button
                      onClick={() => setKeyboardVisible((v) => !v)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      {keyboardVisible ? 'Hide Keyboard' : 'Show Keyboard'}
                    </button>
                  </div>

                  <div className="relative mt-3">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Type office name, room, or keyword..."
                      className={`h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-slate-700 outline-none focus:border-blue-400 ${
                        big ? 'text-base' : 'text-sm'
                      }`}
                    />
                  </div>

                  <div className="mt-4">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                      Popular searches:
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {popularSearches.map((p) => (
                        <button
                          key={p}
                          onClick={() => setQ(p)}
                          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* On-screen keyboard */}
                {keyboardVisible && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
                    <div className="space-y-1.5 sm:space-y-2">
                      {keyboardRows.map((row, i) => (
                        <div key={i} className="flex justify-center gap-1 sm:gap-1.5">
                          {row.map((k) => (
                            <button
                              key={k}
                              onClick={() => pressKey(k)}
                              className="aspect-square min-w-0 max-w-10 flex-1 rounded-lg text-xs font-bold text-slate-700 transition active:scale-95 sm:h-10 sm:w-10 sm:flex-initial sm:text-sm"
                              style={{ background: KEY_BG, border: `1px solid ${KEY_BORDER}` }}
                            >
                              {k}
                            </button>
                          ))}
                        </div>
                      ))}
                      <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                        <button
                          onClick={backspace}
                          className="flex h-10 items-center gap-1.5 rounded-lg px-4 text-xs font-bold text-white"
                          style={{ background: '#dc2626' }}
                        >
                          <Delete className="h-3.5 w-3.5" />
                          DEL
                        </button>
                        <button
                          onClick={() => pressKey(' ')}
                          className="h-10 max-w-[220px] flex-1 rounded-lg text-xs font-bold text-slate-700"
                          style={{ background: KEY_BG, border: `1px solid ${KEY_BORDER}` }}
                        >
                          SPACE
                        </button>
                        <button
                          onClick={() => setQ('')}
                          className="h-10 rounded-lg px-4 text-xs font-bold text-white"
                          style={{ background: BLUE }}
                        >
                          CLEAR
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Right: results + detail ── */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Showing {filtered.length} of {seedOffices.length} offices
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
                  {/* Results list */}
                  <div className="max-h-[320px] space-y-2 overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:max-h-[560px]">
                    {filtered.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => setSelectedId(o.id)}
                        className="block w-full rounded-xl px-3 py-2.5 text-left transition"
                        style={
                          selected?.id === o.id
                            ? { background: BLUE_SOFT, border: `1px solid ${BLUE}33` }
                            : { background: 'transparent' }
                        }
                      >
                        <div className={`font-semibold text-slate-800 ${big ? 'text-sm' : 'text-xs'}`}>
                          {o.name}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400">
                          Floor {o.floor} · {o.room}
                        </div>
                      </button>
                    ))}
                    {filtered.length === 0 && (
                      <div className="p-6 text-center text-xs text-slate-400">No matches found.</div>
                    )}
                  </div>

                  {/* Detail panel */}
                  {selected && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                      {/* Tags */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {tagsFor(selected).map((t) => (
                            <span
                              key={t}
                              className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold tracking-wide text-slate-500"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                          <MapPin className="h-3.5 w-3.5" />
                          INDOOR ROUTE
                        </span>
                      </div>

                      {/* Name + head */}
                      <h2
                        className={`mt-3 font-bold leading-tight ${
                          big ? 'text-2xl sm:text-[28px]' : 'text-lg sm:text-[22px]'
                        }`}
                        style={{ color: BLUE }}
                      >
                        {selected.name}
                      </h2>
                      {selected.head && (
                        <p className="mt-1 text-sm text-slate-500">Head: {selected.head}</p>
                      )}

                      {/* Description */}
                      {selected.description && (
                        <p className={`mt-4 leading-relaxed text-slate-600 ${big ? 'text-base' : 'text-sm'}`}>
                          {selected.description}
                        </p>
                      )}

                      {/* Location grid */}
                      <div className="mt-5 grid grid-cols-1 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-3 sm:gap-4">
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            Floor
                          </div>
                          <div className="mt-1 text-sm font-semibold text-slate-800">
                            {selected.floor}F
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            Room
                          </div>
                          <div className="mt-1 text-sm font-semibold text-slate-800">{selected.room}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                            Hours
                          </div>
                          <div className="mt-1 text-sm font-semibold text-slate-800">
                            {selected.hours ?? 'Mon–Fri, 8AM–5PM'}
                          </div>
                        </div>
                      </div>

                      {/* Services */}
                      {selected.services && selected.services.length > 0 && (
                        <div className="mt-5">
                          <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                            Services offered:
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {selected.services.map((s) => (
                              <span
                                key={s}
                                className="rounded-full border px-3 py-1 text-[11px] font-semibold"
                                style={{ borderColor: '#d1d5db', color: '#475569', background: '#f8fafc' }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      <Link
                        href={`/office/${selected.id}`}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold text-white transition active:scale-[0.99]"
                        style={{ background: BLUE }}
                      >
                        <Globe className="h-4 w-4" />
                        Get Navigation Map
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}