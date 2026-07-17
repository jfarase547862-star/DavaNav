import { AppContent } from '@/components/mobile/app-content';
import { AppHeader } from '@/components/shared/app-header';
import { AppShell } from '@/components/shared/app-shell';
import { type BreadcrumbItem } from '@/types';

interface AppHeaderLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppHeaderLayout({ children, breadcrumbs }: AppHeaderLayoutProps) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent>{children}</AppContent>
        </AppShell>
    );
}
