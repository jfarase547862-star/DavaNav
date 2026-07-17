export function AppContent({ children, variant }: { children: React.ReactNode; variant?: string }) {
    return <div className="flex-1">{children}</div>;
}
