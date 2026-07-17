import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/shared/site-layout";
import { getOffice } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FloorMap } from "@/components/shared/floor-map";
import { QrCodeSvg } from "@/components/ui/qr-code-svg";
import { ArrowLeft, MapPin, Phone, Mail, Clock, User, Navigation, QrCode } from "lucide-react";

export const Route = createFileRoute("/office/$officeId")({
  head: ({ params }) => {
    const o = getOffice(params.officeId);
    return { meta: [{ title: `${o?.name ?? "Office"} — DavaNav` }, { name: "description", content: o?.description ?? "" }] };
  },
  loader: ({ params }) => {
    const o = getOffice(params.officeId);
    if (!o) throw notFound();
    return o;
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center">
      <p>Office not found. <Link to="/directory" className="text-primary underline">Back to directory</Link></p>
    </div>
  ),
  errorComponent: ({ error }) => <div className="p-10">Error: {error.message}</div>,
  component: OfficeDetails,
});

function OfficeDetails() {
  const o = Route.useLoaderData();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <Link to="/directory" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> All offices
          </Link>

          <div className="mt-4 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/15">Floor {o.floor}</Badge>
                      <Badge variant="outline">{o.room}</Badge>
                      <Badge variant="outline" className="border-success/40 text-success">OPEN</Badge>
                    </div>
                    <h1 className="mt-3 font-display text-2xl font-bold sm:text-3xl">{o.name}</h1>
                    <p className="mt-2 text-muted-foreground">{o.description}</p>
                  </div>
                  <Button asChild size="lg">
                    <Link to="/map" search={{ to: o.id }}>
                      <Navigation className="mr-2 h-4 w-4" />Navigate
                    </Link>
                  </Button>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Info icon={Clock} label="Hours" value={o.hours} />
                  <Info icon={Phone} label="Phone" value={o.contact} />
                  <Info icon={Mail} label="Email" value={o.email} />
                  <Info icon={User} label="Office Head" value={o.head} />
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h2 className="font-display text-lg font-semibold">Services Offered</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {(o.services ?? []).map((s: string) => (
                    <li key={s} className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">✓</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <FloorMap floor={o.floor} highlightId={o.id} showRoute />
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-center">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <QrCode className="h-3.5 w-3.5" /> Office QR
                </div>
                <div className="mt-4 inline-block rounded-xl border border-border p-2">
                  <QrCodeSvg value={`davanav://office/${o.id}`} size={180} />
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Print and post at the entrance to this office.
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="font-semibold">Location</h3>
                <div className="mt-3 flex items-start gap-2 text-sm">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <div>City Hall Building</div>
                    <div className="text-muted-foreground">Floor {o.floor}, {o.room}</div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3">
      <Icon className="mt-0.5 h-4 w-4 text-primary" />
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="truncate text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}