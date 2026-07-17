import { type BreadcrumbItem } from '@/types';

export function AppHeader({ children, breadcrumbs }: { children?: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    return <header className="border-b">{children}</header>;
}
