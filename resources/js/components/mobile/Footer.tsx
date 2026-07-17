import { Link } from "@inertiajs/react";
import { Facebook, Mail, MapPin, Phone, Twitter, Globe } from "lucide-react";
import { BottomNav } from "./BottomNav";

export function Footer() {
  return (
    <>
      <footer id="contact" className="border-t border-border bg-gov-blue text-black">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="text-lg font-bold text-black">DavaNav</div>
              <div className="mt-2 text-sm text-black-100">Indoor navigation for Davao City Hall — find offices, services, and routes quickly.</div>
            </div>

            <div>
              <div className="text-sm font-semibold text-black">Quick links</div>
              <ul className="mt-3 space-y-2 text-sm text-black-100">
                <li>
                  <Link href="/directory" className="text-black-100 hover:text-gold">Directory</Link>
                </li>
                <li>
                  <Link href="/navigate/ancillary-service-unit" className="text-black-100 hover:text-gold">Try navigation</Link>
                </li>
                <li>
                  <Link href="/qr" className="text-black-100 hover:text-gold">QR codes</Link>
                </li>
               
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold text-black">Contact</div>
              <ul className="mt-3 space-y-2 text-sm text-black-100">
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-black-100" /> <span className="text-black-100">City Hall, San Pedro St., Davao City</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-black-100" /> <span className="text-black-100">(082) 221-0000</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-black-100" /> <span className="text-black-100">info@davanav.local</span>
                </li>
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold text-black">Follow</div>
              <div className="mt-3 flex items-center gap-3">
                <a href="#" aria-label="Facebook" className="text-black-100 hover:text-gold">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Twitter" className="text-black-100 hover:text-gold">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Website" className="text-black-100 hover:text-gold">
                  <Globe className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-blue-100 sm:flex-row sm:px-6">
            <div className="text-blue-100">© {new Date().getFullYear()} DavaNav Solution · Davao City Government</div>
            <div className="mt-2 text-sm sm:mt-0 text-blue-100">Built with care · <a href="/privacy" className="underline text-blue-100 hover:text-gold">Privacy</a></div>
          </div>
        </div>
      </footer>
      <BottomNav />
    </>
  );
}