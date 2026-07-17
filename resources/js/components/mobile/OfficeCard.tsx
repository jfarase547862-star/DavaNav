import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Navigation, Info, Star } from "lucide-react";
import type { Office } from "@/lib/mock-data";
import { getActiveServicesForOffice } from "@/lib/mock-data";
import { OfficeServicesPanel } from "@/components/shared/office-services-panel";
import { useFavorites } from "@/hooks/use-favorites";
import { cn } from "@/lib/utils";

export function OfficeCard({ office }: Readonly<{ office: Office }>) {
  const { isFavorite, toggle } = useFavorites();
  const fav = isFavorite(office.id);
  const floorText = (() => {
    if (!office.internal) return 'External Office';
    return office.floor === 1 ? 'Floor 1 · Ground' : `Floor ${office.floor} · Floor`;
  })();

  const services = getActiveServicesForOffice(office.id);

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
        <div className={cn(
          "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
          office.internal ? "bg-gov-blue-soft text-gov-blue" : "bg-gov-gold-soft text-gov-gold-foreground"
        )}>
          <Building2 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">{office.name}</h3>
          <p className="truncate text-xs text-muted-foreground">{office.department}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
            <span className={cn(
              "rounded-full px-2 py-0.5 font-medium",
              office.internal ? "bg-gov-blue-soft text-gov-blue" : "bg-gov-gold-soft text-gov-gold-foreground"
            )}>
              {floorText}
            </span>
            <span className="rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{office.department ?? 'Office'}</span>
          </div>
        </div>
        <button
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          onClick={() => toggle(office.id)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-accent"
        >
          <Star className={cn("h-4 w-4", fav ? "fill-gov-gold text-gov-gold" : "text-muted-foreground")} />
        </button>
      </div>

      {services.length > 0 && (
        <div className="mt-3">
          <OfficeServicesPanel services={services.slice(0, 3)} compact />
          {services.length > 3 && (
            <p className="mt-1.5 text-[11px] text-muted-foreground">+{services.length - 3} more services</p>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {office.internal ? (
          <Button
            asChild
            size="sm"
            className="flex-1 bg-[#0b3d84] text-white hover:bg-[#0a2f66]"
          >
            <Link href={`/navigate/${office.id}`}>
              <Navigation className="h-4 w-4" /> Navigate
            </Link>
          </Button>
        ) : (
          <Button asChild size="sm" className="flex-1 bg-[#0b3d84] text-white hover:bg-[#0a2f66]">
            <Link href={`/navigate/${office.id}`}>
            <Navigation className="h-4 w-4" /> Navigate
            </Link>
          </Button>
        )}
        {!office.internal && office.contact && (
          <Button variant="outline" size="sm" className="shrink-0" asChild>
            <a href={`tel:${office.contact.replace(/\s/g, "")}`} aria-label="Call office">
              <MapPin className="h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </article>
  );
}