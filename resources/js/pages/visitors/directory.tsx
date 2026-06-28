import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';  
import { SiteFooter, SiteHeader } from '@/components/site-layout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Phone, Clock, ArrowRight } from 'lucide-react';


const departments = [
  'Civil Registry',
  'Treasury',
  'Assessor',
  'Health',
  'Engineering',
  'Social Welfare',
  "Mayor's Office",
  'Business Permits',
];

const offices = [
  {
    id: 'civil-registry',
    name: 'Civil Registry Office',
    department: 'Civil Registry',
    services: ['Birth certificates', 'Marriage certificates', 'Death certificates'],
    description: 'Handles birth, marriage, and death certificates and related civil documents.',
    hours: 'Mon–Fri, 8:00 AM – 5:00 PM',
    contact: '(02) 8123-4501',
    floor: 1,
    room: 'Room 101',
  },
  {
    id: 'treasury',
    name: 'Treasury Office',
    department: 'Treasury',
    services: ['Tax payments', 'Revenue collection'],
    description: 'Collection of taxes, fees, and other government revenues.',
    hours: 'Mon–Fri, 8:00 AM – 5:00 PM',
    contact: '(02) 8123-4502',
    floor: 1,
    room: 'Room 105',
  },
  {
    id: 'business-permits',
    name: 'Business Permits & Licensing',
    department: 'Assessor',
    services: ['Permit issuance', 'License renewals'],
    description: 'Issuance and renewal of business permits and licenses.',
    hours: 'Mon–Fri, 8:00 AM – 5:00 PM',
    contact: '(02) 8123-4503',
    floor: 2,
    room: 'Room 201',
  },
];

const BLUE = '#1a4fa0';
const BLUE_LIGHT_BG = '#dbeafe';
const BLUE_LIGHT_TEXT = '#1e40af';

export default function Directory() {
  const [q, setQ] = useState('');
  const [floor, setFloor] = useState<number | null>(null);
  const [dept, setDept] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return offices.filter((office) => {
      const matchesQ =
        !q ||
        `${office.name} ${office.department} ${office.services.join(' ')}`
          .toLowerCase()
          .includes(q.toLowerCase());
      const matchesF = floor == null || office.floor === floor;
      const matchesD = !dept || office.department === dept;
      return matchesQ && matchesF && matchesD;
    });
  }, [q, floor, dept]);

  const floors = [1, 2, 3];

  /* Shared pill button styles */
  const pillBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    padding: '0 16px',
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

  return (
    <>
      <Head title="Office Directory" />
      <div className="flex min-h-screen flex-col" style={{ background: '#f8f9fb' }}>
        <SiteHeader />

        <main className="flex-1">

          {/* ── Header band ── */}
          <div
            className="border-b border-slate-200"
            style={{
              background: 'linear-gradient(135deg, #deeaf8 0%, #e8f2fb 50%, #f0f6fd 100%)',
            }}
          >
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
              <h1 className="text-4xl font-bold text-slate-950 sm:text-5xl">Office Directory</h1>
              <p className="mt-2 text-slate-500">Find any office, department, or service.</p>

              {/* Search */}
              <div className="relative mt-6 max-w-2xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search offices, services, or departments..."
                  className="h-12 rounded-xl border-slate-200 bg-white pl-10 text-base shadow-sm focus:border-blue-400 focus:ring-blue-400/20"
                />
                {q && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-2 max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                    {filtered.slice(0, 5).map((office) => (
                      <Link
                        key={office.id}
                        href={`/office/${office.id}`}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <span>{office.name}</span>
                        <span className="text-xs text-slate-400">Floor {office.floor}</span>
                      </Link>
                    ))}
                    {filtered.length === 0 && (
                      <div className="px-4 py-3 text-sm text-slate-400">No matches</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Filters + Cards ── */}
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: '#6b7280' }}
              >
                Floor:
              </span>
              <button
                style={floor == null ? pillActive : pillBase}
                onClick={() => setFloor(null)}
              >
                All
              </button>
              {floors.map((f) => (
                <button
                  key={f}
                  style={floor === f ? pillActive : pillBase}
                  onClick={() => setFloor(f)}
                >
                  Floor {f}
                </button>
              ))}

              <span
                className="ml-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: '#6b7280' }}
              >
                Dept:
              </span>
              <button
                style={!dept ? pillActive : pillBase}
                onClick={() => setDept(null)}
              >
                All
              </button>
              {departments.map((d) => (
                <button
                  key={d}
                  style={dept === d ? pillActive : pillBase}
                  onClick={() => setDept(d)}
                >
                  {d}
                </button>
              ))}
            </div>
            

            {/* Office cards */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((office) => (
                <Link
                  key={office.id}
                  href={`/office/${office.id}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  style={{ boxShadow: '0 2px 8px rgba(15,23,42,0.06)' }}
                >
                  {/* Card top row */}
                  <div className="flex items-center justify-between">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{ background: BLUE_LIGHT_BG, color: BLUE_LIGHT_TEXT }}
                    >
                      Floor {office.floor}
                    </span>
                    <span className="text-xs text-slate-400">{office.room}</span>
                  </div>

                  {/* Title + description */}
                  <h3 className="mt-3 text-lg font-bold leading-tight text-slate-950">
                    {office.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">
                    {office.description}
                  </p>

                  {/* Meta info */}
                  <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {office.hours}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      {office.contact}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {office.department}
                    </div>
                  </div>

                  {/* Footer link */}
                  <div
                    className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-sm font-medium"
                    style={{ color: BLUE }}
                  >
                    View details
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full rounded-xl border border-dashed border-slate-200 p-10 text-center text-slate-400">
                  No offices match your filters.
                </div>
              )}
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}