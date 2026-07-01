import { Link } from "@inertiajs/react";
import { ArrowLeft, Bell } from "lucide-react";

export function AppHeader({
  title,
  subtitle,
  back = false,
  rightSlot,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  rightSlot?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid max-w-2xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
        {back ? (
          <button
            onClick={() => window.history.back()}
            aria-label="Back"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        ) : (
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gov-blue text-gov-blue-foreground font-bold">
            N
          </div>
        )}
        <div className="min-w-0">
          <div className="truncate text-base font-semibold text-foreground">{title}</div>
          {subtitle && <div className="truncate text-xs text-muted-foreground">{subtitle}</div>}
        </div>
        <div className="shrink-0">
          {rightSlot ?? (
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="relative grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-accent"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-gov-gold" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}