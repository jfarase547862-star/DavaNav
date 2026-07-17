export function AppContent({ children, variant }: { children: React.ReactNode; variant?: string }) {
    return <div className="flex-1">{children}</div>;
}

export function AppHeader({ children, variant, breadcrumbs }: { children?: React.ReactNode; variant?: string; breadcrumbs?: any[] }) {
    return <header className="border-b">{children}</header>;
}

export function AppShell({ children, variant }: { children: React.ReactNode; variant?: string }) {
    return <div className={`flex ${variant === 'sidebar' ? 'flex-row' : 'flex-col'} h-screen`}>{children}</div>;
}

export function AppSidebar({ children, variant }: { children?: React.ReactNode; variant?: string }) {
    return <aside className="w-64 border-r">{children}</aside>;
}

export function AppSidebarHeader({ children, variant, breadcrumbs }: { children?: React.ReactNode; variant?: string; breadcrumbs?: any[] }) {
    return <div className="p-4 border-b">{children}</div>;
}
