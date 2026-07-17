import { Head, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import { SiteFooter, SiteHeader } from '@/components/shared/site-layout';
import { FloorMap } from '@/components/shared/floor-map';
import { QrCodeSvg } from '@/components/ui/qr-code-svg';
import { getOffice, seedOffices } from '@/lib/mock-data';
import { ArrowLeft, MapPin, QrCode } from 'lucide-react';

const PAGE_BG = '#f8f9fb';

function toFloorNumber(floor: number | string): number {
  if (typeof floor === 'number') return floor;
  const normalized = floor.trim().toUpperCase();
  if (normalized === 'GF' || normalized === 'G' || normalized === 'GROUND') return 1;
  const parsed = Number.parseInt(normalized, 10);
  return Number.isNaN(parsed) ? 1 : parsed;
}

function floorLabel(floor: number): string {
  return floor === 1 ? 'Ground Floor' : `Floor ${floor}`;
}

export default function KioskOffices() {
  const selected = useMemo(() => getOffice(seedOffices[0].id) ?? seedOffices[0], []);
  const selectedFloor = toFloorNumber(selected.floor);

  return (
    <>
      <Head title={`${selected.name} — DavaNav`} />
      <div className="flex min-h-screen flex-col" style={{ background: PAGE_BG }}>
        <SiteHeader />

        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <Link
              href="/kiosk/kiosk-directory"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to directory
            </Link>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(340px,380px)] lg:items-start">
              {/* LEFT: Map */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <FloorMap floor={selectedFloor} highlightId={selected.id} />
              </div>

              {/* RIGHT: QR Code -> Services Offered -> Office Details */}
              <div className="space-y-4 lg:sticky lg:top-6">
                {/* QR Code */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    <QrCode className="h-3.5 w-3.5" /> Office QR
                  </div>
                  <div className="mt-4 flex justify-center rounded-xl border border-slate-200 bg-white p-3">
                    <QrCodeSvg value={`davanav://office/${selected.id}`} size={180} />
                  </div>
                </div>

                {/* Services Offered */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Services Offered</div>
                  {selected.services && selected.services.length > 0 ? (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {selected.services.map((service) => (
                        <li key={service} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] text-slate-700">
                          {service}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="mt-2 text-xs text-slate-400">No listed services.</div>
                  )}
                </div>

                {/* Office Details (Location + Office Information) */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Office Details</div>

                  <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-start gap-2 text-slate-700">
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-slate-400" />
                      <div>
                        <div className="font-semibold text-slate-900">{selected.department ?? 'City Hall Building'}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          {floorLabel(selectedFloor)}, Room {selected.room}
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-slate-950">{selected.name}</h2>
                  <div className="mt-1 text-sm text-slate-500">{selected.department ?? 'City Hall Office'}</div>

                  <div className="mt-4 grid gap-3 rounded-xl bg-slate-50 p-4">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Floor</div>
                      <div className="mt-1 text-sm font-semibold text-slate-800">{floorLabel(selectedFloor)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Room</div>
                      <div className="mt-1 text-sm font-semibold text-slate-800">{selected.room}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Hours</div>
                      <div className="mt-1 text-sm font-semibold text-slate-800">
                        {selected.hours ?? 'Mon–Fri, 8AM–5PM'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Contact</div>
                      <div className="mt-1 text-sm font-semibold text-slate-800">
                        {selected.contact ?? 'Contact unavailable'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>    
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}