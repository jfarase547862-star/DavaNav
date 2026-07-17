export function AppSidebar({ children, variant }: { children?: React.ReactNode; variant?: string }) {
    return <aside className="w-64 border-r">{children}</aside>;
}
