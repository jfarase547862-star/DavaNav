import { Link, usePage } from "@inertiajs/react";
import { Home, Search, QrCode, Map } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  to: "/m/home" | "/m/search" | "/m/scan" | "/m/map";
  label: string;
  icon: typeof Home;
  exact?: boolean;
  center?: boolean;
};

const items: NavItem[] = [
  { to: "/m/home", label: "Home", icon: Home, exact: true },
  { to: "/m/search", label: "Search", icon: Search },
  { to: "/m/scan", label: "QR", icon: QrCode, center: true },
  { to: "/m/map", label: "Map", icon: Map },
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
                <span className={cn(
                  "grid h-12 w-12 -translate-y-3 place-items-center rounded-full shadow-[var(--shadow-elevated)] transition-transform",
                  active ? "scale-105 [background-image:var(--gradient-gold)] text-gov-gold-foreground" : "[background-image:var(--gradient-hero)] text-gov-blue-foreground"
                )}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className={cn("text-[10px] font-medium", active ? "text-gov-blue" : "text-muted-foreground")}>{it.label}</span>
              </Link>
            );
          }
          return (
            <Link
              key={it.to}
              href={it.to}
              className="flex flex-col items-center gap-1 py-1"
            >
              <Icon className={cn("h-5 w-5", active ? "text-gov-blue" : "text-muted-foreground")} />
              <span className={cn("text-[10px] font-medium", active ? "text-gov-blue" : "text-muted-foreground")}>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}