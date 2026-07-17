import { AppContent } from '@/components/mobile/app-content';
import { AppShell } from '@/components/shared/app-shell';
import { AppSidebar } from '@/components/shared/app-sidebar';
import { AppSidebarHeader } from '@/components/shared/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent>
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
