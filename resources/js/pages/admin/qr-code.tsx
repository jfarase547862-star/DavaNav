import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Plus, Search, Download, Printer, Eye, Trash2, RefreshCw, Power, MoreVertical, QrCode as QrIcon } from 'lucide-react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';

// ── Types ─────────────────────────────────────────────────────────────────────

interface QrCode {
    id: string;
    code: string;
    label: string;
    officeId: string | null;
    status: 'Active' | 'Inactive';
    scans: number;
    createdAt: string;
}

interface Office {
    id: string;
    name: string;
    qrAssigned: boolean;
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const seedOffices: Office[] = [
    { id: 'civil-registry',   name: 'Civil Registry Office',        qrAssigned: true  },
    { id: 'treasury',         name: 'Treasury Office',               qrAssigned: true  },
    { id: 'business-permits', name: 'Business Permits & Licensing',  qrAssigned: true  },
    { id: 'assessor',         name: "Assessor's Office",             qrAssigned: true  },
    { id: 'health',           name: 'City Health Office',            qrAssigned: false },
    { id: 'engineering',      name: 'Engineering Office',            qrAssigned: true  },
    { id: 'social-welfare',   name: 'Social Welfare & Development',  qrAssigned: false },
    { id: 'mayors-office',    name: "Mayor's Office",                qrAssigned: true  },
];

const seedQrCodes: QrCode[] = [
    { id: 'q1', code: 'NAVIX-MAIN-ENT', label: 'Main Entrance',      officeId: null,              status: 'Active', scans: 412, createdAt: '2025-05-01' },
    { id: 'q2', code: 'NAVIX-GF-LOBBY', label: 'Ground Floor Lobby', officeId: null,              status: 'Active', scans: 305, createdAt: '2025-05-01' },
    { id: 'q3', code: 'NAVIX-TREAS-01', label: 'Treasurer Office',   officeId: 'treasury',        status: 'Active', scans: 198, createdAt: '2025-05-04' },
    { id: 'q4', code: 'NAVIX-MAYOR-01', label: 'Mayor Office',       officeId: 'mayors-office',   status: 'Active', scans: 142, createdAt: '2025-05-04' },
    { id: 'q5', code: 'NAVIX-ENGR-01',  label: 'Engineering Office', officeId: 'engineering',     status: 'Active', scans: 121, createdAt: '2025-05-10' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const uid = () => `q${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

function StatusBadge({ status }: { status: 'Active' | 'Inactive' }) {
    return (
        <Badge
            variant="outline"
            className={status === 'Active'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-gray-100 text-gray-500 border-gray-200'
            }
        >
            {status}
        </Badge>
    );
}

function QrSquare({ seed, size = 96 }: { seed: string; size?: number }) {
    return (
        <div
            className="grid grid-cols-8 grid-rows-8 gap-0.5 rounded bg-white p-1.5"
            style={{ width: size, height: size }}
        >
            {Array.from({ length: 64 }).map((_, i) => (
                <div
                    key={i}
                    className={
                        (i * 31 + seed.length * 7) % 3 === 0 || i % 9 === 0
                            ? 'bg-gray-900'
                            : 'bg-transparent'
                    }
                />
            ))}
        </div>
    );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function QrPage() {
    const [qrs, setQrs] = useState<QrCode[]>(seedQrCodes);
    const [offices, setOffices] = useState<Office[]>(seedOffices);

    const [q, setQ] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [genOpen, setGenOpen] = useState(false);
    const [genLabel, setGenLabel] = useState('');
    const [genOffice, setGenOffice] = useState('');

    const [previewQr, setPreviewQr] = useState<QrCode | null>(null);
    const [assignTarget, setAssignTarget] = useState<QrCode | null>(null);
    const [assignTo, setAssignTo] = useState('');
    const [delTarget, setDelTarget] = useState<QrCode | null>(null);
    const [historyQr, setHistoryQr] = useState<QrCode | null>(null);

    const filtered = useMemo(() => {
        let list = qrs.filter(
            (x) =>
                x.label.toLowerCase().includes(q.toLowerCase()) ||
                x.code.toLowerCase().includes(q.toLowerCase()),
        );
        if (statusFilter !== 'all') list = list.filter((x) => x.status === statusFilter);
        return list;
    }, [qrs, q, statusFilter]);

    // ── Mutations ─────────────────────────────────────────────────────────────

    function generate() {
        if (!genLabel.trim()) { toast.error('Label is required'); return; }
        const code = `NAVIX-${genLabel.toUpperCase().replace(/\s+/g, '-').slice(0, 14)}`;
        const newQr: QrCode = {
            id: uid(), code, label: genLabel,
            officeId: genOffice || null,
            status: 'Active', scans: 0,
            createdAt: new Date().toISOString().slice(0, 10),
        };
        setQrs((prev) => [newQr, ...prev]);
        if (genOffice) {
            setOffices((prev) => prev.map((o) => o.id === genOffice ? { ...o, qrAssigned: true } : o));
        }
        toast.success('QR code generated');
        setGenOpen(false); setGenLabel(''); setGenOffice('');
    }

    function deactivate(qr: QrCode) {
        setQrs((prev) => prev.map((x) =>
            x.id === qr.id ? { ...x, status: x.status === 'Active' ? 'Inactive' : 'Active' } : x,
        ));
        toast.success(qr.status === 'Active' ? 'QR deactivated' : 'QR activated');
    }

    function replace(qr: QrCode) {
        setQrs((prev) => prev.map((x) =>
            x.id === qr.id ? { ...x, code: `NAVIX-${Date.now().toString(36).toUpperCase()}`, scans: 0 } : x,
        ));
        toast.success('QR replaced with new code');
    }

    function assign() {
        if (!assignTarget) return;
        setQrs((prev) => prev.map((x) =>
            x.id === assignTarget.id ? { ...x, officeId: assignTo || null } : x,
        ));
        if (assignTo) {
            setOffices((prev) => prev.map((o) => o.id === assignTo ? { ...o, qrAssigned: true } : o));
        }
        toast.success('QR assigned');
        setAssignTarget(null); setAssignTo('');
    }

    function downloadQr(qr: QrCode) {
        const blob = new Blob(
            [`Navix QR\nCode: ${qr.code}\nLabel: ${qr.label}\n`],
            { type: 'text/plain' },
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${qr.code}.txt`; a.click();
        URL.revokeObjectURL(url);
        toast.success('Downloaded');
    }

    function del() {
        if (!delTarget) return;
        setQrs((prev) => prev.filter((x) => x.id !== delTarget.id));
        toast.success('QR deleted');
        setDelTarget(null);
    }

    const officeName = (id: string | null) => offices.find((o) => o.id === id)?.name ?? '—';

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            <Head title="QR Code Management — Navix Admin" />
            <AdminShell
                title="QR Code Management"
                description="Generate, assign, print, and track QR codes deployed across City Hall."
                breadcrumbs={[{ label: 'QR Codes' }]}
                actions={
                    <Button onClick={() => setGenOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Generate QR
                    </Button>
                }
            >
                {/* Full-height container — matches floor-maps / nodes layout */}
                <div className="flex flex-col" style={{ height: 'calc(100vh - 160px)', minHeight: 600 }}>
                    <Card className="flex flex-col flex-1 min-h-0 overflow-hidden p-0">

                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b shrink-0">
                            <div className="relative min-w-[220px] flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Search by label or code…"
                                    className="pl-9"
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All status</SelectItem>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-xs text-gray-400">
                                {filtered.length} code{filtered.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Scrollable table */}
                        <div className="flex-1 overflow-auto min-h-0">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                                    <TableRow>
                                        <TableHead>QR</TableHead>
                                        <TableHead>Label</TableHead>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Assigned Office</TableHead>
                                        <TableHead>Scans</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="py-16 text-center text-gray-400">
                                                No QR codes found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filtered.map((qr) => (
                                        <TableRow key={qr.id}>
                                            <TableCell><QrSquare seed={qr.code} size={40} /></TableCell>
                                            <TableCell className="font-medium">{qr.label}</TableCell>
                                            <TableCell className="font-mono text-xs">{qr.code}</TableCell>
                                            <TableCell>{officeName(qr.officeId)}</TableCell>
                                            <TableCell>{qr.scans}</TableCell>
                                            <TableCell><StatusBadge status={qr.status} /></TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => setPreviewQr(qr)}>
                                                            <Eye className="mr-2 h-4 w-4" /> Preview
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => downloadQr(qr)}>
                                                            <Download className="mr-2 h-4 w-4" /> Download
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => window.print()}>
                                                            <Printer className="mr-2 h-4 w-4" /> Print
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { setAssignTarget(qr); setAssignTo(qr.officeId ?? ''); }}>
                                                            <QrIcon className="mr-2 h-4 w-4" /> Assign Office
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => replace(qr)}>
                                                            <RefreshCw className="mr-2 h-4 w-4" /> Replace
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => deactivate(qr)}>
                                                            <Power className="mr-2 h-4 w-4" /> {qr.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setHistoryQr(qr)}>
                                                            <Eye className="mr-2 h-4 w-4" /> Scan History
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setDelTarget(qr)} className="text-red-600">
                                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </div>

                {/* ── Generate dialog ── */}
                <Dialog open={genOpen} onOpenChange={setGenOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Generate QR Code</DialogTitle>
                            <DialogDescription>Create a new QR code and optionally assign it to an office.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3">
                            <div className="space-y-1">
                                <Label>Label *</Label>
                                <Input value={genLabel} onChange={(e) => setGenLabel(e.target.value)} placeholder="e.g. South Lobby" />
                            </div>
                            <div className="space-y-1">
                                <Label>Assign to Office (optional)</Label>
                                <Select value={genOffice} onValueChange={setGenOffice}>
                                    <SelectTrigger><SelectValue placeholder="Select office" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">— None —</SelectItem>
                                        {offices.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setGenOpen(false)}>Cancel</Button>
                            <Button onClick={generate}>Generate</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Preview dialog ── */}
                <Dialog open={!!previewQr} onOpenChange={(o) => !o && setPreviewQr(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{previewQr?.label}</DialogTitle>
                            <DialogDescription className="font-mono">{previewQr?.code}</DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-center py-4">
                            {previewQr && <QrSquare seed={previewQr.code} size={200} />}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => previewQr && downloadQr(previewQr)}>Download</Button>
                            <Button onClick={() => setPreviewQr(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Assign dialog ── */}
                <Dialog open={!!assignTarget} onOpenChange={(o) => !o && setAssignTarget(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Assign QR to Office</DialogTitle>
                            <DialogDescription>Link "{assignTarget?.label}" to an office.</DialogDescription>
                        </DialogHeader>
                        <Select value={assignTo} onValueChange={setAssignTo}>
                            <SelectTrigger><SelectValue placeholder="Select office" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">— Unassign —</SelectItem>
                                {offices.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setAssignTarget(null)}>Cancel</Button>
                            <Button onClick={assign}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Scan history dialog ── */}
                <Dialog open={!!historyQr} onOpenChange={(o) => !o && setHistoryQr(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Scan History — {historyQr?.label}</DialogTitle>
                            <DialogDescription>Recent scans of this QR code.</DialogDescription>
                        </DialogHeader>
                        <div className="max-h-72 space-y-2 overflow-y-auto text-sm">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between rounded-md border px-3 py-2">
                                    <div>Visitor #{2400 + i}</div>
                                    <div className="text-xs text-gray-400">{i * 7 + 2} min ago</div>
                                </div>
                            ))}
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setHistoryQr(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* ── Confirm delete ── */}
                <ConfirmDialog
                    open={!!delTarget}
                    onOpenChange={(o) => !o && setDelTarget(null)}
                    title="Delete QR code?"
                    description={`Remove "${delTarget?.label}" permanently.`}
                    confirmText="Delete"
                    destructive
                    onConfirm={del}
                />
            </AdminShell>
        </>
    );
}