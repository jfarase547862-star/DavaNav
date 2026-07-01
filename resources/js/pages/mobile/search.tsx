import { Head, Link } from "@inertiajs/react";
import { AppHeader } from "@/components/mobile/AppHeader";
import { Footer } from "@/components/mobile/Footer";
import { Button } from "@/components/ui/button";
import { offices, recommendService, serviceIndex } from "@/lib/mock-data";
import { Compass, Sparkles, Navigation, Info, Search } from "lucide-react";
import { useMemo, useState } from "react";

const POPULAR = [
  "Business Permit",
  "Property Tax",
  "Birth Certificate",
  "Marriage License",
  "Building Permit",
  "PWD ID",
];

export default function SearchByService() {
  const [q, setQ] = useState("");
  const results = useMemo(() => recommendService(q), [q]);

  return (
    <>
      <Head title="Search by Service — Navix" />
      <AppHeader title="Search by Service" subtitle="We'll match you to the right office" back />
      <main className="mx-auto w-full max-w-3xl space-y-4 px-4 pt-4 sm:px-6 sm:pt-6 lg:max-w-5xl lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] sm:p-5">
          <label className="flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-gov-blue sm:px-4 sm:py-2.5">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Try 'business permit' or 'birth certificate'…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:text-base"
              autoFocus
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {POPULAR.map((p) => (
              <button
                key={p}
                onClick={() => setQ(p)}
                className="rounded-full bg-gov-blue-soft px-3 py-1 text-xs font-medium text-gov-blue hover:bg-gov-blue hover:text-gov-blue-foreground sm:text-sm"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {q.trim() === "" ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center sm:p-10">
            <Compass className="mx-auto h-8 w-8 text-gov-blue sm:h-10 sm:w-10" />
            <div className="mt-2 text-sm font-medium text-foreground sm:text-base">Smart service recommendations</div>
            <p className="mt-1 text-xs text-muted-foreground sm:mx-auto sm:max-w-md sm:text-sm">
              Describe what you need to do at City Hall. Navix routes you to the correct office automatically.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground sm:p-10 sm:text-base">
            No matching service. Try a different keyword.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {results.slice(0, 4).map((r, i) => {
              const office = offices.find((o) => o.id === r.officeId)!;
              return (
                <div key={r.officeId} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gov-gold">
                    <Sparkles className="h-3.5 w-3.5" /> {i === 0 ? "Recommended" : "Also relevant"}
                  </div>
                  <div className="mt-2 text-base font-bold text-foreground sm:text-lg">{office.name}</div>
                  <div className="text-xs text-muted-foreground sm:text-sm">{office.department} · {office.isInternal ? `Floor ${office.floor}` : "External"}</div>
                  <p className="mt-3 rounded-lg bg-gov-blue-soft/50 px-3 py-2 text-xs text-foreground/85 sm:text-sm">{r.reason}</p>
                  <div className="mt-4 flex gap-2">
                    {office.isInternal ? (
                      <Button asChild variant="hero" className="flex-1">
                        <Link href={`/navigate/${office.id}`}>
                          <Navigation className="h-4 w-4" /> Navigate
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild variant="gold" className="flex-1">
                        <Link href={`/accessibility/${office.id}`}>
                          <Info className="h-4 w-4" /> Accessibility Info
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="rounded-2xl border border-border bg-secondary/50 p-4 sm:p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-gov-blue sm:text-sm">Service index</div>
          <ul className="mt-2 grid grid-cols-1 gap-x-3 gap-y-1.5 text-xs text-foreground/80 sm:grid-cols-2 sm:text-sm lg:grid-cols-3">
            {serviceIndex.flatMap((s) =>
              s.keywords.slice(0, 1).map((kw) => (
                <li key={s.officeId + kw} className="flex items-center justify-between gap-2">
                  <span className="truncate capitalize">{kw}</span>
                  <span className="shrink-0 text-muted-foreground">
                    {offices.find((o) => o.id === s.officeId)?.shortName ?? offices.find((o) => o.id === s.officeId)?.name}
                  </span>
                </li>
              )),
            )}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}