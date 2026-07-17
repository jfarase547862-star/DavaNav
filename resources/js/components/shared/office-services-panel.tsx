import type { OfficeService } from '@/types/service';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, ListChecks } from 'lucide-react';

interface Props {
  services: OfficeService[];
  compact?: boolean;
}

export function OfficeServicesPanel({ services, compact = false }: Props) {
  if (services.length === 0) {
    return <p className="text-sm text-muted-foreground">No services listed for this office.</p>;
  }

  if (compact) {
    return (
      <ul className="flex flex-wrap gap-1.5">
        {services.map((service) => (
          <li
            key={service.service_id}
            className="rounded-md bg-muted px-2 py-1 text-[11px] text-foreground/80"
          >
            {service.service_name}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-3">
      {services.map((service) => (
        <li
          key={service.service_id}
          className="rounded-xl border border-border bg-secondary/30 p-4"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground">{service.service_name}</h4>
            <Badge
              variant="outline"
              className={
                service.status === 'Active'
                  ? 'border-success/40 text-success'
                  : 'border-muted-foreground/30 text-muted-foreground'
              }
            >
              {service.status}
            </Badge>
          </div>

          {service.description && (
            <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
          )}

          <dl className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            <div className="flex items-start gap-2 rounded-lg border border-border bg-card px-3 py-2">
              <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <div>
                <dt className="font-semibold uppercase tracking-wide text-foreground/70">Requirements</dt>
                <dd className="mt-0.5 text-foreground/80">{service.requirements}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border border-border bg-card px-3 py-2">
              <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <div>
                <dt className="font-semibold uppercase tracking-wide text-foreground/70">Processing time</dt>
                <dd className="mt-0.5 text-foreground/80">{service.processing_time}</dd>
              </div>
            </div>
          </dl>

          <div className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            <ListChecks className="h-3 w-3" />
            Service ID {service.service_id} · Office ID {service.office_id}
          </div>
        </li>
      ))}
    </ul>
  );
}
