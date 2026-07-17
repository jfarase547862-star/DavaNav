import { Link, usePage, router } from "@inertiajs/react";
import {
  LayoutDashboard, Building2, Building, Map, Network, QrCode, BarChart3,
  Users, ShieldCheck, Bell, Settings, LogOut, Menu, ChevronRight, ArrowLeft,
  Search, Home, X, FileText, History,
} from "lucide-react";
import { useState, type ReactNode, type ComponentType } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { type PageProps } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { to: "/admin/admin-dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Facilities",
    items: [
      { to: "/admin/admin-offices", label: "Office Management", icon: Building2 },
      { to: "/admin/admin-departments", label: "Department Management", icon: Building },
      { to: "/admin/admin-floor-maps", label: "Floor Maps", icon: Map },
      { to: "/admin/admin-nodes", label: "Navigation Nodes", icon: Network },
      { to: "/admin/admin-qr-code", label: "QR Code Management", icon: QrCode },
    ],
  },
  {
    label: "Insights",
    items: [
      { to: "/admin/admin-analytics", label: "Analytics", icon: BarChart3 },
      { to: "/admin/admin-reports", label: "Reports", icon: FileText },
      { to: "/admin/admin-scan-history", label: "Scan History", icon: History },

    ],
  },
  {
    label: "Configuration",
    items: [
      { to: "/admin/admin-settings", label: "Settings", icon: Settings },
    ],
  },
];

const NAV = NAV_GROUPS.flatMap((group) => group.items);

export interface AdminShellProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
  children: ReactNode;
}

export function AdminShell({ title, description, breadcrumbs = [], actions, children }: AdminShellProps) {
  const { auth, url } = usePage<PageProps & { url: string }>().props;
  const currentUrl = usePage().url;
  const [open, setOpen] = useState(true);

  const isActive = (to: string, exact?: boolean) =>
    exact ? currentUrl === to : currentUrl === to || currentUrl.startsWith(to + "/");

  function handleLogout() {
    router.post("/logout");
  }

  const user = auth?.user;

  return (
    <div className="flex min-h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-gray-900 text-white transition-all duration-200",
          open ? "w-64" : "w-0 -translate-x-full md:w-16 md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-yellow-400 font-bold text-gray-900">N</div>
          {open && (
            <div className="leading-tight">
              <div className="text-sm font-semibold">DavaNav Solution</div>
              <div className="text-[11px] text-white/60">Davao City Hall</div>
            </div>
          )}
          {open && (
            <button onClick={() => setOpen(false)} className="ml-auto text-white/60 hover:text-white md:hidden">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2">
          {NAV_GROUPS.map((group, groupIndex) => (
            <div key={group.label} className={cn(groupIndex > 0 && "mt-4")}>
              {open ? (
                <div className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  {group.label}
                </div>
              ) : (
                groupIndex > 0 && <div className="mx-3 mb-2 border-t border-white/10" />
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.to, item.exact);
                return (
                  <Link
                    key={item.to}
                    href={item.to}
                    className={cn(
                      "mb-1 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      active
                      ? "bg-yellow-400 text-gray-900 font-medium"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {open && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

       
      </aside>

      {/* Main content */}
      <div className={cn("flex min-h-screen w-full flex-col transition-all duration-200", open ? "md:pl-64" : "md:pl-16")}>
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-white px-4 shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => setOpen((o) => !o)}>
            <Menu className="h-5 w-5" />
          </Button>

          

          <div className="ml-auto flex items-center gap-2">
            <Link href="/admin/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-xs font-semibold text-gray-900">
                   {(user?.name ?? "A").charAt(0)}
                  </div>
                  <div className="hidden text-left md:block">
                    <div className="text-xs font-medium leading-tight">{user?.name}</div>
                    <div className="text-[10px] text-gray-400">Administrator</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <div className="mb-4 flex items-center gap-1 text-xs text-gray-400">
              <Link href="/admin/dashboard" className="flex items-center gap-1 hover:text-gray-700">
                <Home className="h-3 w-3" /> Admin
              </Link>
              {breadcrumbs.map((b, i) => (
                <span key={i} className="flex items-center gap-1">
                  <ChevronRight className="h-3 w-3" />
                  {b.to
                    ? <Link href={b.to} className="hover:text-gray-700">{b.label}</Link>
                    : <span className="text-gray-700">{b.label}</span>
                  }
                </span>
              ))}
            </div>
          )}

          {/* Page header */}
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {breadcrumbs.length > 0 && (
                <Button variant="outline" size="icon" onClick={() => window.history.back()} className="mt-1">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
                {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
              </div>
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
          </div>

          {children}
        </main>

        <footer className="border-t bg-white px-4 py-3 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} DavaNav Solution — Davao City Hall. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Active" ? "bg-green-50 text-green-700 border-green-200" :
    status === "Inactive" ? "bg-gray-100 text-gray-500 border-gray-200" :
    "bg-gray-100 text-gray-500";
  return <Badge variant="outline" className={cn(color)}>{status}</Badge>;
}