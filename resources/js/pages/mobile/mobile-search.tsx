import { Head } from '@inertiajs/react';
import { AppHeader } from "@/components/mobile/AppHeader";
import { Footer } from "@/components/mobile/Footer";
import { OfficeCard } from "@/components/mobile/OfficeCard";
import { offices } from "@/lib/mock-data";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

// Inertia page wrapper
export default function DirectoryPageWrapper() {
  return (
    <>
      <Head title="Office Directory — DavaNav" />
      <DirectoryPage />
    </>
  );
}

const FILTERS = ["All", "Internal", "External", "Floor 1", "Floor 2"] as const;
type Filter = (typeof FILTERS)[number];

function DirectoryPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return offices.filter((o) => {
      const internal = !!o.internal;
      if (filter === "Internal" && !internal) return false;
      if (filter === "External" && internal) return false;
      if (filter === "Floor 1" && !(internal && Number(o.floor) === 1)) return false;
      if (filter === "Floor 2" && !(internal && Number(o.floor) === 2)) return false;
      if (!query) return true;
      return (
        o.name.toLowerCase().includes(query) ||
        (o.department ?? '').toLowerCase().includes(query) ||
        (o.services ?? []).some((s) => s.toLowerCase().includes(query))
      );
    });
  }, [q, filter]);

  return (
    <>
      <AppHeader title="Office Directory" subtitle={`${filtered.length} offices`} back />
      <main className="bg-slate-50 px-4 pt-4 pb-24">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          <label className="flex items-center gap-2.5 rounded-xl bg-slate-100 px-3.5 py-3">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by office, department, or service…"
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="mt-3 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                  filter === f
                    ? "bg-[#0b3d84] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 pb-4">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
              No offices match your search.
            </div>
          ) : (
            filtered.map((o) => <OfficeCard key={o.id} office={o} />)
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}