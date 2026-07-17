import { useEffect, useMemo, useState } from "react";
import { Button } from '@/components/ui/button';
import {
  ArrowUp,
  ArrowRight as ArrowRightIcon,
  ArrowLeft as ArrowLeftIcon,
  MapPin,
  Flag,
  ChevronsUp,
  DoorOpen,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Navigation,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type Direction = "start" | "straight" | "right" | "left" | "stairs" | "arrive";

type Step = {
  direction: Direction;
  title: string;
  detail: string;
  distance: number;
};

const ICONS: Record<Direction, React.ComponentType<any>> = {
  start: DoorOpen,
  straight: ArrowUp,
  right: ArrowRightIcon,
  left: ArrowLeftIcon,
  stairs: ChevronsUp,
  arrive: Flag,
};

interface TurnByTurnGuideProps extends Readonly<{
  steps: string[];
  activeIndex: number;
  totalDistance: number;
  totalMinutes: number;
  floorLabel: string;
  onSelectStep: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onRecalculate: () => void;
}> {}

function mapToSteps(steps: string[], totalDistance: number): Step[] {
  const distancePerStep = Math.max(1, Math.floor(totalDistance / Math.max(steps.length, 1)));

  return steps.map((title, idx) => {
    let direction: Direction = "straight";
    const lowerTitle = title.toLowerCase();

    if (idx === 0) direction = "start";
    else if (idx === steps.length - 1) direction = "arrive";
    else if (lowerTitle.includes("right")) direction = "right";
    else if (lowerTitle.includes("left")) direction = "left";
    else if (lowerTitle.includes("stair") || lowerTitle.includes("elevator")) direction = "stairs";

    const distance = idx === steps.length - 1 ? 0 : distancePerStep;

    return {
      direction,
      title,
      detail: title,
      distance,
    };
  });
}

export function TurnByTurnGuide({
  steps: stepStrings,
  activeIndex,
  totalDistance,
  totalMinutes,
  floorLabel,
  onSelectStep,
  onPrev,
  onNext,
  onRecalculate,
}: Readonly<TurnByTurnGuideProps>) {
  const steps = useMemo(() => mapToSteps(stepStrings, totalDistance), [stepStrings, totalDistance]);
  // Autoplay defaults OFF - elderly users generally want to read each
  // instruction and move at their own pace, not have the guide advance for them.
  const [playing, setPlaying] = useState(false);
  const [routeOpen, setRouteOpen] = useState(false);

  const total = steps.length;
  const step = total > 0 ? steps[activeIndex] : null;
  const Icon = step ? ICONS[step.direction] : DoorOpen;

  const walkedDistance = total > 0 ? steps.slice(0, activeIndex + 1).reduce((a, s) => a + s.distance, 0) : 0;
  const progress = Math.round((walkedDistance / Math.max(totalDistance, 1)) * 100);
  const remaining = Math.max(0, totalDistance - walkedDistance);
  const etaMin = Math.max(1, Math.round(remaining / 55));

  useEffect(() => {
    if (!playing || !step) return;
    if (activeIndex >= total - 1) return;
    // Slower pace when autoplay is on (was 3.2s) so there's time to read and look up.
    const t = setTimeout(() => onNext(), 6000);
    return () => clearTimeout(t);
  }, [playing, activeIndex, total, onNext, step]);

  const arrived = activeIndex === total - 1;
  const isFirst = activeIndex <= 0;
  const isLast = activeIndex >= total - 1;

  const getStepLabel = () => {
    if (!step) return "";
    if (arrived) return "You have arrived";
    if (step.distance > 0) return `In ${step.distance} meters`;
    return "Current step";
  };

  if (!step) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gov-blue to-gov-blue/80 px-3 py-2 text-black">
        <div className="flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide">
          <Navigation className="h-4 w-4 text-black" /> Directions
        </div>
        <div className="text-sm font-medium opacity-95">
          Step {activeIndex + 1} of {total}
        </div>
      </div>

      {/* Instruction - the most important content, given the most visual weight */}
      <div className="flex items-center gap-3 px-3 py-3">
        <div
          className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl border-2 ${
            arrived ? "border-success bg-success/10 text-success" : "border-primary bg-primary/10 text-primary"
          }`}
        >
          <Icon className="h-8 w-8" strokeWidth={2.5} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {getStepLabel()}
          </div>
          <h3 className="text-lg font-bold leading-snug text-gray-900">{step.title}</h3>
          <p className="text-sm text-gray-600">{floorLabel}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-3 pb-2">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-600 gap-2">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {walkedDistance}m walked</span>
          <span>{progress}%</span>
          <span className="flex items-center gap-1">About {etaMin} min left <Flag className="h-3.5 w-3.5" /></span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-gold transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Controls - large tap targets (44px+) for easier, more accurate tapping */}
      <div className="grid grid-cols-3 gap-2 border-t border-gray-200 bg-gray-50 px-3 py-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onPrev}
          disabled={isFirst}
          aria-label="Previous step"
          className="h-11 text-sm font-semibold"
        >
          <SkipBack className="mr-1 h-4 w-4" /> Back
        </Button>
        {arrived ? (
          <Button
            size="sm"
            onClick={onRecalculate}
            aria-label="Replay directions"
            className="h-11 text-sm font-semibold bg-gov-blue text-black hover:bg-gov-blue/90"
          >
            <RotateCcw className="mr-1 h-4 w-4" /> Replay
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause automatic advance" : "Advance steps automatically"}
            className="h-11 text-sm font-semibold bg-gov-blue text-black hover:bg-gov-blue/90"
          >
            {playing ? <><Pause className="mr-1 h-4 w-4" /> Pause</> : <><Play className="mr-1 h-4 w-4" /> Auto</>}
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={onNext}
          disabled={isLast}
          aria-label="Next step"
          className="h-11 text-sm font-semibold"
        >
          Next <SkipForward className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Route overview toggle - full-size, clearly labeled, not a tiny link */}
      <button
        type="button"
        onClick={() => setRouteOpen((o) => !o)}
        aria-expanded={routeOpen}
        className="flex w-full items-center justify-center gap-1.5 border-t border-gray-200 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        {routeOpen ? (
          <>Hide full route <ChevronUp className="h-4 w-4" /></>
        ) : (
          <>See all steps <ChevronDown className="h-4 w-4" /></>
        )}
      </button>

      {/* Route overview - collapsed by default so the map stays in view */}
      {routeOpen && (
        <div className="border-t border-gray-200 px-3 py-2 max-h-56 overflow-y-auto">
          <ol className="space-y-1.5">
            {steps.map((s, i) => {
              const StepIcon = ICONS[s.direction];
              const isStepDone = i < activeIndex;
              const isStepActive = i === activeIndex;

              const getBorderClass = () => {
                if (isStepActive) return "border-primary bg-primary/5";
                if (isStepDone) return "border-transparent bg-gray-100";
                return "border-gray-200 hover:bg-gray-50";
              };

              const getTextClass = () => {
                if (isStepActive) return "font-semibold text-gray-900";
                if (isStepDone) return "text-gray-500 line-through";
                return "text-gray-700";
              };

              const getBadgeClass = () => {
                if (isStepDone) return "bg-success/15 text-success";
                if (isStepActive) return "bg-primary text-white";
                return "bg-gray-200 text-gray-600";
              };

              return (
                <button
                  key={`step-${s.direction}-${i}`}
                  type="button"
                  onClick={() => onSelectStep(i)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectStep(i);
                    }
                  }}
                  className={`flex w-full items-center gap-2.5 rounded border px-2.5 py-2 text-sm transition-colors ${getBorderClass()} ${getTextClass()}`}
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${getBadgeClass()}`}>
                    <StepIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 text-left truncate">{s.title}</span>
                  {s.distance > 0 && <span className="shrink-0 text-xs text-gray-500">{s.distance}m</span>}
                </button>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}