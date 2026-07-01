import { Link, usePage } from '@inertiajs/react';
import { QrCode, Menu, X } from 'lucide-react';
import { useState } from 'react';

const BLUE = '#1a4fa0';

const navLinks = [
  { label: 'Home',      href: '/kiosk' },
  { label: 'Directory', href: '/kiosk/directory' },
  { label: 'Map',       href: '/kiosk/map' },
];

export function SiteHeader() {
  const { url } = usePage();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/kiosk' ? url === '/kiosk' : url.startsWith(href);

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md"
      style={{ boxShadow: '0 1px 3px rgba(15,23,42,0.06)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link href="/kiosk" className="flex items-center gap-2.5">
          <div
            className="grid h-9 w-9 place-items-center rounded-xl"
            style={{ background: BLUE }}
          >
            <QrCode className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-bold text-slate-950">Navix</div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              GOV NAVIGATION
            </div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                style={
                  active
                    ? { background: '#f1f3f5', color: '#0f172a' }
                    : { color: '#64748b' }
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                  style={
                    active
                      ? { background: '#f1f3f5', color: '#0f172a' }
                      : { color: '#64748b' }
                  }
                >
                  {label}
                </Link>
              );
            })}
            
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <div
                className="grid h-9 w-9 place-items-center rounded-xl"
                style={{ background: BLUE }}
              >
                <QrCode className="h-5 w-5 text-white" />
              </div>
              <span className="text-[15px] font-bold text-slate-950">Navix Solution</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              QR-based wayfinding for modern government offices.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/kiosk" className="hover:text-slate-900">Home</Link></li>
              <li><Link href="/kiosk/directory" className="hover:text-slate-900">Office Directory</Link></li>
              <li><Link href="/kiosk/map" className="hover:text-slate-900">Interactive Map</Link></li>
            </ul>
          </div>

          {/* For Staff */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400">For Staff</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/login" className="hover:text-slate-900">Admin Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>support@navix.gov</li>
              <li>(02) 8123-4500</li>
            </ul>
          </div>

        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} Navix Solution. All rights reserved.
        </div>
      </div>
    </footer>
  );
}