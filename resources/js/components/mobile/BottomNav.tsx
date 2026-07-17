import { Link, usePage } from "@inertiajs/react";
import { Home, Search, QrCode, Map } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  to: "/mobile/mobile-home" | "/mobile/mobile-search" | "/mobile/mobile-scan" | "/mobile/mobile-map";
  label: string;
  icon: typeof Home;
  exact?: boolean;
  center?: boolean;
};

const items: NavItem[] = [
  { to: "/mobile/mobile-home", label: "Home", icon: Home, exact: true },
  { to: "/mobile/mobile-search", label: "Search", icon: Search },
  { to: "/mobile/mobile-scan", label: "QR", icon: QrCode, center: true },
  { to: "/mobile/mobile-map", label: "Map", icon: Map },
];

export function BottomNav() {
  const { url } = usePage();
  const pathname = url.split("?")[0];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid max-w-2xl grid-cols-4 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {items.map((it) => {
          const Icon = it.icon;
          const active = it.exact ? pathname === it.to : pathname === it.to || pathname.startsWith(it.to + "/");

          if (it.center) {
            return (
              <Link
                key={it.to}
                href={it.to}
                className="flex flex-col items-center justify-end gap-1"
              >
                <span
                  className={cn(
                    "grid h-12 w-12 -translate-y-3 place-items-center rounded-full bg-gradient-to-br from-[#123f7f] to-[#0a2f66] text-white shadow-[0_8px_18px_-4px_rgba(10,47,102,0.55)] transition-transform",
                    active && "scale-110 ring-2 ring-[#0b3d84]/30 ring-offset-2 ring-offset-background",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <span className={cn("text-[10px] font-semibold", active ? "text-gov-blue" : "text-muted-foreground")}>
                  {it.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={it.to}
              href={it.to}
              className="flex flex-col items-center gap-1 py-1"
            >
              <span
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full transition-colors",
                  active && "bg-gov-blue-soft",
                )}
              >
                <Icon
                  className={cn("h-5 w-5", active ? "text-gov-blue" : "text-muted-foreground")}
                  strokeWidth={active ? 2.25 : 2}
                />
              </span>
              <span className={cn("text-[10px] font-medium", active ? "font-semibold text-gov-blue" : "text-muted-foreground")}>
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}