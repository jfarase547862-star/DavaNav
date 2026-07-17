export function AppSidebarHeader({ children, variant, breadcrumbs }: { children?: React.ReactNode; variant?: string; breadcrumbs?: any[] }) {
    return <div className="p-4 border-b">{children}</div>;
}
