import { Head, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { SiteHeader, SiteFooter } from '@/components/site-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCodeSvg } from '@/components/ui/qr-code-svg';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
  Navigation,
  QrCode,
  Map as MapIcon,
  Volume2,
} from 'lucide-react';

interface Office {
  id: string;
  name: string;
  description: string;
  floor: number;
  room: string;
  hours: string;
  contact: string;
  email: string;
  head: string;
  services: string[];
}

interface Props {
  office: Office;
}

const BLUE = '#1a4fa0';

const directionSteps = [
  'Enter through the main lobby',
  'Turn left at the central corridor',
  'Pass the staircase and West Elevator',
  'Your destination is on your right',
];

export default function OfficePage({ office: o }: Props) {
  const [activeFloor, setActiveFloor] = useState(o.floor);
  const navRef = useRef<HTMLDivElement>(null);

  const scrollToNav = () => {
    navRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Head title={`${o.name} — Navix`} />
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <Link
            href="/directory"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All offices
          </Link>

          <div className="mt-4 grid gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Office header card */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/15">Floor {o.floor}</Badge>
                      <Badge variant="outline">{o.room}</Badge>
                      <Badge variant="outline" className="border-success/40 text-success">OPEN</Badge>
                    </div>
                    <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">{o.name}</h1>
                    <p className="mt-2 text-muted-foreground">{o.description}</p>
                  </div>
                  <Button size="lg" onClick={scrollToNav}>
                    <Navigation className="mr-2 h-4 w-4" /> Get Navigation Map
                  </Button>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Info icon={Clock} label="Hours" value={o.hours} />
                  <Info icon={Phone} label="Phone" value={o.contact} />
                  <Info icon={Mail} label="Email" value={o.email} />
                  <Info icon={User} label="Office Head" value={o.head} />
                </div>
              </div>

              {/* ── Navigation map ── */}
              <div id="navigation-map" ref={navRef} className="space-y-4">
                {/* Floor selector + map */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      <MapIcon className="h-3.5 w-3.5" />
                      Active Floor:
                    </span>
                    {[1, 2, 3].map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveFloor(f)}
                        className="rounded-full px-4 py-2 text-sm font-semibold transition"
                        style={
                          activeFloor === f
                            ? { background: BLUE, color: '#fff' }
                            : { background: '#f1f5f9', color: '#475569' }
                        }
                      >
                        Floor {f}
                      </button>
                    ))}
                  </div>

                  {/* Blueprint floor map */}
                  <BlueprintMap floor={activeFloor} goalRoom={o.room} goalName={o.name} goalFloor={o.floor} />

                  {/* Legend */}
                  <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#22c55e' }} />
                      You are here
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: BLUE }} />
                      Destination
                    </span>
                  </div>
                </div>


              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* QR code */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <QrCode className="h-3.5 w-3.5" /> Office QR
                </div>
                <div className="mt-4 inline-block rounded-xl border border-border p-2">
                  <QrCodeSvg value={`navix://office/${o.id}`} size={180} />
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Print and post at the entrance to this office.
                </div>
              </div>

              {/* Location details */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h3 className="flex items-center gap-1.5 text-sm font-bold" style={{ color: BLUE }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLUE }} />
                  LOCATION DETAILS
                </h3>
                <dl className="mt-3 space-y-2.5 text-sm">
                  <Row label="Building" value="Main Building" />
                  <Row label="Floor Level" value={`${activeFloor}F`} />
                  <Row label="Room / Area" value={o.room} highlight />
                  <Row label="Officer-In-Charge" value={o.head} />
                </dl>
              </div>

              {/* Step-by-step directions */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="flex items-center gap-1.5 text-sm font-bold" style={{ color: BLUE }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLUE }} />
                    DIRECTIONS
                  </h3>
                  <button className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <Volume2 className="h-3.5 w-3.5" />
                    Read Aloud
                  </button>
                </div>
                <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {directionSteps.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-semibold shrink-0" style={{ color: BLUE }}>
                        {i + 1}.
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Services offered */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h3 className="flex items-center gap-1.5 text-sm font-bold" style={{ color: BLUE }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: BLUE }} />
                  SERVICES OFFERED
                </h3>
                <ul className="mt-3 space-y-2">
                  {o.services.map((s) => (
                    <li
                      key={s}
                      className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm"
                    >
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                        ✓
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

// ── Blueprint floor plan ─────────────────────────────────────────────────────

interface RoomDef {
  id: string;
  label: string;
  col: number; // grid-column-start (1-based)
  row: number; // grid-row-start (1-based)
  colSpan?: number;
  rowSpan?: number;
  dashed?: boolean; // corridor/path highlight
}

const floor1Rooms: RoomDef[] = [
  { id: 'Room 109',    label: 'Risk Reduction and Management Office', col: 5, row: 2, colSpan: 2 },
  { id: 'Room 111',    label: 'Lingap',                               col: 8, row: 2 },
  { id: 'Rehab',       label: 'Davao City Treatment and Rehab',       col: 3, row: 2, colSpan: 2, dashed: true },
  { id: 'Room 106',    label: 'City Social Welfare and Development',  col: 2, row: 3 },
  { id: 'Room 107',    label: 'City Tourism Operations Office',       col: 3, row: 3 },
  { id: 'Room 108',    label: 'City Treasurer',                       col: 4, row: 3 },
  { id: 'Room 104',    label: 'City Veterinary',                      col: 5, row: 3 },
  { id: 'Room 105',    label: "Civil Registrar's Office",             col: 6, row: 3 },
  { id: 'Room GF-001', label: 'Davao City Central 911 Emergency',     col: 8, row: 3 },
  { id: 'Room 102',    label: 'Ancillary Service Unit',               col: 3, row: 4 },
  { id: 'Room 103',    label: 'Business Permits',                     col: 4, row: 4 },
  { id: 'Admin B',     label: 'City Archives and Records',            col: 5, row: 4 },
  { id: 'Room 110',    label: 'City College',                         col: 6, row: 4 },
  { id: 'Room 112',    label: 'City General Services',                col: 7, row: 4 },
  { id: 'Room 113b',   label: 'City Health',                          col: 8, row: 4 },
  { id: 'Room 114b',   label: 'City Information',                     col: 9, row: 4 },
  { id: 'Room 106b',   label: 'Library and Information Center',       col: 10, row: 4 },
  { id: 'GF-Museum',   label: 'Museo Dabawenyo',                      col: 2, row: 5 },
  { id: 'Room GF-04',  label: 'Office for Senior Citizens Affairs',   col: 3, row: 5 },
  { id: 'Room GF-05',  label: 'Public Employment',                    col: 5, row: 5 },
  { id: 'Room GF-06',  label: 'Public Employment (cont.)',            col: 6, row: 5 },
  { id: 'Room 113',    label: 'Public Safety and Security Office',    col: 7, row: 5 },
  { id: 'Room 114',    label: 'Vices Regulation Unit',                col: 9, row: 5 },
];

function BlueprintMap({
  floor,
  goalRoom,
  goalName,
  goalFloor,
}: {
  floor: number;
  goalRoom: string;
  goalName: string;
  goalFloor: number;
}) {
  const rooms = floor === 1 ? floor1Rooms : [];
  const showGoal = floor === goalFloor;

  return (
    <div
      className="relative mt-4 overflow-auto rounded-2xl border border-slate-200"
      style={{ background: '#f8fafc' }}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
        <span className="text-sm font-semibold text-slate-700">Floor {floor}</span>
        <span className="text-xs text-slate-400">{rooms.length} offices</span>
      </div>

      {/* Grid map */}
      <div className="relative p-4" style={{ minHeight: 460 }}>
        {/* Dot grid background */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#cbd5e1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Building outline */}
        <div
          className="relative mx-auto"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, minmax(80px, 1fr))',
            gridTemplateRows: 'repeat(5, auto)',
            gap: 6,
            maxWidth: 900,
          }}
        >
          {/* Elevator/staircase column indicator — center top */}
          <div
            style={{
              gridColumn: '5 / 7',
              gridRow: '1',
              background: '#dde6f5',
              borderRadius: 6,
              height: 32,
            }}
          />

          {rooms.map((r) => {
            const isGoal = showGoal && r.id === goalRoom;
            return (
              <div
                key={r.id}
                style={{
                  gridColumn: `${r.col} / span ${r.colSpan ?? 1}`,
                  gridRow: `${r.row} / span ${r.rowSpan ?? 1}`,
                  background: isGoal ? BLUE : '#ffffff',
                  border: isGoal
                    ? `2px solid ${BLUE}`
                    : r.dashed
                    ? '2px dashed #93afd4'
                    : '1.5px solid #c3d0e8',
                  borderRadius: 8,
                  padding: '8px 10px',
                  minHeight: 58,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div
                  className="text-[11px] font-bold leading-tight"
                  style={{ color: isGoal ? '#fff' : '#1e3a5f' }}
                >
                  {r.id}
                </div>
                <div
                  className="mt-0.5 text-[10px] leading-tight"
                  style={{ color: isGoal ? 'rgba(255,255,255,0.85)' : '#64748b' }}
                >
                  {isGoal ? goalName : r.label}
                </div>
              </div>
            );
          })}

          {/* Dashed route path overlay — vertical connector */}
          <div
            style={{
              gridColumn: '5 / 6',
              gridRow: '2 / 5',
              borderLeft: `2.5px dashed ${BLUE}`,
              pointerEvents: 'none',
              marginLeft: 20,
            }}
          />
        </div>

        {/* ENTRANCE label */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <div
            className="h-4 w-0.5"
            style={{ background: '#22c55e' }}
          />
          <span className="text-xs font-bold tracking-widest text-slate-500">ENTRANCE</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-5 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          You are here
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded" style={{ background: BLUE }} />
          Destination
        </span>
      </div>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
      <Icon className="mt-0.5 h-4 w-4 text-primary" />
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd
        className="text-right text-sm font-semibold"
        style={highlight ? { color: BLUE } : undefined}
      >
        {value}
      </dd>
    </div>
  );
}