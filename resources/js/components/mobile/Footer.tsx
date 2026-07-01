import { Link } from "@inertiajs/react";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import { BottomNav } from "./BottomNav";

export function Footer() {
  return (
    <>
      <footer id="contact" className="border-t border-border bg-gov-blue text-gov-blue-foreground pb-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-gov-gold text-gov-gold-foreground font-bold">
                N
              </div>
              <div className="font-bold">Navix Solution</div>
            </div>
            <p className="mt-4 text-sm text-white/70">
              A digital companion for visitors of the Davao City Hall — built for clarity, accessibility,
              and dignified public service.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold">Explore</div>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li><Link href="/m/home" className="hover:text-gov-gold">Visitor Dashboard</Link></li>              
              <li><Link href="/m/search" className="hover:text-gov-gold">Search</Link></li>
              <li><Link href="/m/map" className="hover:text-gov-gold">Interactive Map</Link></li>
              <li><Link href="/m/scan" className="hover:text-gov-gold">QR Scanner</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold">City Hall</div>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" /> San Pedro Street, Davao City 8000</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /> (082) 227-0000</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /> info@davaocity.gov.ph</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold">Connect</div>
            <p className="mt-3 text-sm text-white/70">Follow official Davao City Government channels for the latest advisories.</p>
            <div className="mt-4 flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-gov-gold hover:text-gov-gold-foreground">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-white/60 sm:flex-row sm:px-6">
            <div>© {new Date().getFullYear()} Navix Solution · Davao City Government</div>
            <div>Prototype build — mock data only</div>
          </div>
        </div>
      </footer>
      <BottomNav />
    </>
  );
}