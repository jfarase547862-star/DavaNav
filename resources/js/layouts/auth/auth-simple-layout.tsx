import AppLogoIcon from '@/components/shared/app-logo-icon';
import { Link } from '@inertiajs/react';

interface AuthLayoutProps {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="relative min-h-screen overflow-hidden bg-background px-4 py-10 text-[#133E87] sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(19,62,135,0.18),transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(96,139,193,0.16),transparent_22%)]" />
            <div className="relative mx-auto w-full max-w-md">
                <div className="rounded-[2rem] border border-white/20 bg-white/20 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl ring-1 ring-white/10">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium text-slate-900 transition hover:text-slate-800">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-[var(--foreground)] shadow-sm shadow-slate-900/5 backdrop-blur-sm">
                                    <AppLogoIcon className="size-9 fill-current" />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2">
                                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                                <p className="text-sm text-slate-600">{description}</p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
