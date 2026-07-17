import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Settings as SetIcon, Palette, Globe, ShieldCheck, Database, Info, ScrollText, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminStore, setState, resetStore } from '@/lib/admin-store';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';

// ── Types ─────────────────────────────────────────────────────────────────────

type Modal = null | 'general' | 'appearance' | 'language' | 'security' | 'backup' | 'system' | 'about' | 'audit';

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
    const settings = useAdminStore((s) => s.settings);
    const [open, setOpen] = useState<Modal>(null);
    const [restoreOpen, setRestoreOpen] = useState(false);

    const cards: { key: Modal; title: string; desc: string; icon: any }[] = [
        { key: 'backup', title: 'Backup & Restore', desc: 'Export and import system data.', icon: Database },
        { key: 'about', title: 'About', desc: 'DavaNav Solution credits.', icon: FileText },
        { key: 'audit', title: 'Audit Logs', desc: 'Recent system activity.', icon: ScrollText },
    ];

    return (
        <>
            <Head title="Settings — DavaNav Admin" />
            <AdminShell
                title="Settings"
                description="Configure the DavaNav admin portal."
                breadcrumbs={[{ label: 'Settings' }]}
            >
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((c) => {
                        const Icon = c.icon;
                        return (
                            <Card key={c.key} className="cursor-pointer transition-shadow hover:shadow-md" onClick={() => setOpen(c.key)}>
                                <CardHeader>
                                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                                    <CardTitle className="text-base">{c.title}</CardTitle>
                                    <CardDescription>{c.desc}</CardDescription>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>

                {/* Backup */}
                <Dialog open={open === 'backup'} onOpenChange={(o) => !o && setOpen(null)}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Backup & Restore</DialogTitle><DialogDescription>Export the current dataset or restore defaults.</DialogDescription></DialogHeader>
                        <div className="flex flex-col gap-2">
                            <Button onClick={() => {
                                const data = JSON.stringify(useAdminStore.length, null, 2);
                                const blob = new Blob([data], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a'); a.href = url; a.download = `davanav-backup-${Date.now()}.json`; a.click();
                                URL.revokeObjectURL(url);
                                toast.success('Backup downloaded');
                            }}>Download Backup</Button>
                            <Button variant="outline" onClick={() => setRestoreOpen(true)}>Restore to Default Data</Button>
                        </div>
                        <DialogFooter><Button onClick={() => setOpen(null)}>Close</Button></DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* System */}
                <Dialog open={open === 'system'} onOpenChange={(o) => !o && setOpen(null)}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>System Information</DialogTitle><DialogDescription>Build & environment.</DialogDescription></DialogHeader>
                        <dl className="grid grid-cols-2 gap-2 text-sm">
                            <dt className="text-muted-foreground">Version</dt><dd>v2.0.0</dd>
                            <dt className="text-muted-foreground">Build</dt><dd>2026.06.26</dd>
                            <dt className="text-muted-foreground">Environment</dt><dd>Production Prototype</dd>
                            <dt className="text-muted-foreground">Database</dt><dd>Local Mock Store</dd>
                        </dl>
                        <DialogFooter><Button onClick={() => setOpen(null)}>Close</Button></DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* About */}
                <Dialog open={open === 'about'} onOpenChange={(o) => !o && setOpen(null)}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>About DavaNav Solution</DialogTitle><DialogDescription>Indoor wayfinding for Davao City Hall.</DialogDescription></DialogHeader>
                        <p className="text-sm text-muted-foreground">
                            DavaNav Solution helps visitors and staff navigate Davao City Hall through QR codes, indoor maps, and a centralized admin portal.
                        </p>
                        <DialogFooter><Button onClick={() => setOpen(null)}>Close</Button></DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Audit */}
                <Dialog open={open === 'audit'} onOpenChange={(o) => !o && setOpen(null)}>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Audit Logs</DialogTitle><DialogDescription>Recent admin actions.</DialogDescription></DialogHeader>
                        <div className="max-h-72 space-y-2 overflow-y-auto text-sm">
                            {['Generated QR for Cashier B', "Edited Treasurer's office", 'Added user Liza Reyes', 'Replaced 2F floor plan', 'Logged in'].map((t, i) => (
                                <div key={i} className="flex items-center justify-between rounded-md border px-3 py-2">
                                    <span>{t}</span>
                                    <span className="text-xs text-muted-foreground">{i + 1}h ago</span>
                                </div>
                            ))}
                        </div>
                        <DialogFooter><Button onClick={() => setOpen(null)}>Close</Button></DialogFooter>
                    </DialogContent>
                </Dialog>

                <ConfirmDialog
                    open={restoreOpen}
                    onOpenChange={setRestoreOpen}
                    title="Restore default data?"
                    description="All custom edits will be replaced with seed data."
                    confirmText="Restore"
                    destructive
                    onConfirm={() => { resetStore(); toast.success('Restored to defaults'); setRestoreOpen(false); setOpen(null); }}
                />
            </AdminShell>
        </>
    );
}