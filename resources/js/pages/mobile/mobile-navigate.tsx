import { Head, Link, router } from "@inertiajs/react";
import { AppHeader } from "@/components/mobile/AppHeader";
import { Footer } from "@/components/mobile/Footer";
import { TurnByTurnGuide } from "@/components/mobile/turn-by-turn-guide";
import { MapLibreFloorMap } from "@/components/shared/maplibre-floor-map";
import { Button } from "@/components/ui/button";
import { getOffice, FLOOR_LAYOUT } from "@/lib/mock-data";
import {
  buildGrid,
  dijkstra,
  doorCell,
  pathDistanceMeters,
  pathToSteps,
  walkingTimeMinutes,
  type Cell,
} from "@/lib/pathfinding";
import {
  Clock,
  Footprints,
  MapPin,
  RotateCcw,
  Sparkles,
  Route as RouteIcon,
  Eye,
  Type,
  Volume2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const BLUE = "#1a4fa0";

type Lang = "ENG" | "CEB" | "FIL";

// Closest widely-supported speechSynthesis voice per language.
// Cebuano has no dedicated voice in most browsers, so it falls back to Filipino.
const SPEECH_LANG: Record<Lang, string> = {
  ENG: "en-US",
  CEB: "fil-PH",
  FIL: "fil-PH",
};

// Inertia page wrapper — `officeId` arrives as a page prop from the route/controller
export default function NavigatePageWrapper({ officeId }: Readonly<{ officeId: string }>) {
  return (
    <>
      <Head title="Indoor Navigation — DavaNav" />
      <NavigatePage officeId={officeId} />
    </>
  );
}

function NavigatePage({ officeId }: Readonly<{ officeId: string }>) {
  const office = getOffice(officeId);
  const [phase, setPhase] = useState<"analyzing" | "ready">("analyzing");
  const [activeStep, setActiveStep] = useState(0);
  const [textSize, setTextSize] = useState<"normal" | "large">("normal");
  const [language, setLanguage] = useState<Lang>("ENG");
  const [voiceGuide, setVoiceGuide] = useState(false);

  useEffect(() => {
    if (!office) return;
    if (!office.internal) {
      router.visit(`/accessibility/${officeId}`, { preserveState: true, replace: true });
    }
  }, [office, officeId]);

  useEffect(() => {
    setActiveStep(0);
  }, [officeId]);

  // Scale the whole page's rem-based Tailwind text (including inside
  // TurnByTurnGuide) by bumping the root font-size, so "Large text" actually
  // enlarges every step instruction rather than just this toggle's own label.
  useEffect(() => {
    document.documentElement.style.fontSize = textSize === "large" ? "112.5%" : "100%";
    return () => {
      document.documentElement.style.fontSize = "100%";
    };
  }, [textSize]);

  // A* still powers the distance / walk-time / step-by-step stats,
  // even though the visual map below is the static BlueprintMap.
  const plan = useMemo(() => {
    if (!office?.internal) return null;
    const dest = doorCell(office);
    const stairs: Cell = { x: 7, y: 4 };
    if (Number(office.floor) === 1) {
      const grid = buildGrid(1);
      const res = dijkstra(grid, FLOOR_LAYOUT.entrance, dest);
      return {
        ground: res,
        second: null as null | ReturnType<typeof dijkstra>,
      };
    } else {
      const g1 = buildGrid(1);
      const r1 = dijkstra(g1, FLOOR_LAYOUT.entrance, stairs);
      const g2 = buildGrid(2);
      const r2 = dijkstra(g2, stairs, dest);
      return { ground: r1, second: r2 };
    }
  }, [office]);

  useEffect(() => {
    if (!plan) return;
    setPhase("analyzing");
    const t = setTimeout(() => setPhase("ready"), 1400);
    return () => clearTimeout(t);
  }, [plan]);

  const steps = useMemo(() => {
    if (!plan || !office) return [];
    return [
      ...pathToSteps(plan.ground.path, plan.second ? "the Staircase" : office.name),
      ...(plan.second
        ? ["Take the stairs to the Second Floor.", ...pathToSteps(plan.second.path, office.name)]
        : []),
    ];
  }, [plan, office]);

  // Voice guide: read the active instruction aloud whenever it changes.
  useEffect(() => {
    if (!voiceGuide) return;
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const text = steps[activeStep];
    if (!text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LANG[language];
    window.speechSynthesis.speak(utterance);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [voiceGuide, activeStep, steps, language]);

  if (!office) {
    return (
      <>
        <AppHeader title="Office not found" back />
        <main className="px-4 pt-4">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
            We couldn't find that office.
          </div>
          <Link
            href="/directory"
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#0b3d84] py-3 text-sm font-semibold text-white"
          >
            Back to Directory
          </Link>
        </main>
      </>
    );
  }

  if (!office.internal || !plan) {
    return null;
  }

  const distance = pathDistanceMeters(plan.ground.path) + (plan.second ? pathDistanceMeters(plan.second.path) : 0);
  const minutes = walkingTimeMinutes(distance);

  return (
    <>
      <AppHeader
        title={office.shortName ?? office.name}
        subtitle={`Floor ${Number(office.floor) === 1 ? "1 · Ground" : "2 · Second"}`}
        back
      />
      <main className="space-y-4 px-4 pt-4 pb-24">
        {/* Accessibility bar — compact single row */}
        <section className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card px-3 py-2 shadow-[var(--shadow-card)]">
          <Eye className="h-4 w-4 shrink-0 text-gov-blue" />

          <div className="flex overflow-hidden rounded-full border border-slate-200">
            {(["ENG", "CEB", "FIL"] satisfies Lang[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLanguage(item)}
                className="h-7 px-2.5 text-[11px] font-bold transition"
                style={
                  language === item
                    ? { background: BLUE, color: "#ffffff" }
                    : { background: "transparent", color: "#64748b" }
                }
              >
                {item}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setTextSize((current) => (current === "normal" ? "large" : "normal"))}
            className="flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            <Type className="h-3.5 w-3.5 text-gov-blue" />
            {textSize === "large" ? "LARGE" : "NORMAL"}
          </button>

          <button
            type="button"
            onClick={() => setVoiceGuide((value) => !value)}
            className="flex h-7 items-center gap-1 rounded-full border border-slate-200 px-2.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-50"
          >
            <Volume2 className="h-3.5 w-3.5 text-gov-blue" />
            {voiceGuide ? "ON" : "OFF"}
          </button>
        </section>

        {/* Route summary */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]">
          {phase === "analyzing" ? (
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 animate-pulse place-items-center rounded-full bg-gov-blue-soft text-gov-blue">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground">Computing shortest route…</div>
                <div className="text-xs text-muted-foreground">A* pathfinding · visualizing explored cells</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              <Stat icon={<Footprints className="h-4 w-4" />} label="Distance" value={`${distance} m`} />
              <Stat icon={<Clock className="h-4 w-4" />} label="Walk time" value={`~${Math.max(1, Math.round(minutes))} min`} />
              <Stat icon={<MapPin className="h-4 w-4" />} label="Floors" value={plan.second ? "1 → 2" : "Ground"} />
            </div>
          )}
        </div>

        <TurnByTurnGuide
          steps={steps}
          activeIndex={activeStep}
          totalDistance={distance}
          totalMinutes={Math.max(1, Math.round(minutes))}
          floorLabel={`Floor ${office.floor}`}
          onSelectStep={setActiveStep}
          onPrev={() => setActiveStep((prev) => Math.max(0, prev - 1))}
          onNext={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
          onRecalculate={() => {
            setPhase("analyzing");
            setTimeout(() => setPhase("ready"), 1400);
          }}
        />

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
          <div className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">
            Indoor map
          </div>
          <div className="h-[420px] w-full">
            <MapLibreFloorMap floor={Number(office.floor)} highlightId={office.id} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Stat({ icon, label, value }: Readonly<{ icon: React.ReactNode; label: string; value: string }>) {
  return (
    <div className="rounded-xl bg-gov-blue-soft/50 p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-gov-blue">
        {icon} {label}
      </div>
      <div className="mt-1 text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}