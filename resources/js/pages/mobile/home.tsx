import { Head, Link } from "@inertiajs/react";
import { AppHeader } from "@/components/mobile/AppHeader";
import { Footer } from "@/components/mobile/Footer";

import {
  QrCode,
  Building2,
  Search,
  Compass,
  Map,
  Star,
  Bell,
  User,
  Accessibility,
  ArrowRight,
} from "lucide-react";

type Card = { to: string; icon: typeof QrCode; title: string; desc: string; accent?: boolean };

const cards: Card[] = [
  { to: "/m/scan", icon: QrCode, title: "Scan QR", desc: "Detect my location", accent: true },
  { to: "/m/directory", icon: Building2, title: "Office Directory", desc: "Browse all offices" },
  { to: "/m/directory", icon: Search, title: "Search Office", desc: "By name or department" },
  { to: "/m/search", icon: Compass, title: "Search Service", desc: "Find the right office" },
  { to: "/m/map", icon: Map, title: "Interactive Map", desc: "Ground & Second floors" },
];

export default function Dashboard() {
  return (
    <>
      <Head title="Visitor Dashboard — Navix" />
      <AppHeader title="Good day, Visitor" subtitle="Davao City Hall · Main Building" />
      <main className="px-4 pt-4">
        {/* Hero scan card */}
        <Link
          href="/scan"
          className="block overflow-hidden rounded-3xl text-gov-blue-foreground shadow-[var(--shadow-elevated)] [background-image:var(--gradient-hero)]"
        >
          <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5">
            <div className="min-w-0">
              <div className="text-xs font-medium text-gov-gold">Quickest way to start</div>
              <h2 className="mt-1 text-xl font-bold">Scan a QR to set your location</h2>
              <p className="mt-1 text-xs text-white/80">Available at all City Hall entrances and office signage.</p>
              <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-gov-gold px-3 py-1 text-xs font-semibold text-gov-gold-foreground">
                Open scanner <ArrowRight className="h-3 w-3" />
              </span>
            </div>
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/15">
              <QrCode className="h-8 w-8" />
            </div>
          </div>
        </Link>

        {/* Quick action grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.title}
              href={c.to}
              className="group flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-gov-blue/30 hover:shadow-[var(--shadow-elevated)]"
            >
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.accent ? "bg-gov-gold text-gov-gold-foreground" : "bg-gov-blue-soft text-gov-blue"}`}>
                <c.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-foreground">{c.title}</div>
                <div className="truncate text-[11px] text-muted-foreground">{c.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tip card */}
        <div className="mt-5 rounded-2xl border border-dashed border-gov-blue/30 bg-gov-blue-soft/40 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-gov-blue">Tip</div>
          <div className="mt-1 text-sm text-foreground/85">
            Not sure where to go? Try{" "}
            <Link href="/search" className="font-semibold text-gov-blue underline-offset-2 hover:underline">
              Search by Service
            </Link>{" "}
            — type something like "business permit" or "birth certificate".
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}