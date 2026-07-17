import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { ArrowLeft, Download, Search, Activity, Users, Building2, CalendarClock, QrCode as QrIcon } from 'lucide-react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { seedScanLogs, seedQrCodes, seedOffices, timeAgo } from '@/lib/mock-data';

const PAGE_SIZE = 10;

/**
 * Scan-history view across ALL QR codes.
 * Route: /admin/admin-qr-scan-history (optionally ?qr=<id> to preselect a QR filter)
 *
 * Pulled out of the QR Management dialog because scan logs are the one
 * entity here that grows unbounded — this page owns filtering, pagination,
 * and export, while the QR page dropdown just links here.
 */
export default function QrScanHistoryPage() {
    const initialQr = useMemo(() => new URLSearchParams(window.location.search).get('qr') ?? 'all', []);

    const [qrFilter, setQrFilter] = useState(initialQr);
    const [officeFilter, setOfficeFilter] = useState('all');
    const [q, setQ] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [page, setPage] = useState(1);

    const officeName = (id: string | null) => seedOffices.find((o) => o.id === id)?.name ?? '—';
    const qrLabel = (id: string) => seedQrCodes.find((x) => x.id === id)?.label ?? id;
    const qrCode = (id: string) => seedQrCodes.find((x) => x.id === id)?.code ?? id;

    const filtered = useMemo(() => {
        let list = [...seedScanLogs];
        if (qrFilter !== 'all') list = list.filter((l) => l.qrId === qrFilter);
        if (officeFilter !== 'all') list = list.filter((l) => l.officeId === officeFilter);
        if (q.trim()) list = list.filter((l) => l.sessionId.toLowerCase().includes(q.toLowerCase()));
        if (from) list = list.filter((l) => l.scannedAt >= from);
        if (to) list = list.filter((l) => l.scannedAt <= `${to}T23:59:59`);
        return list.sort((a, b) => (a.scannedAt < b.scannedAt ? 1 : -1));
    }, [qrFilter, officeFilter, q, from, to]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const uniqueSessions = new Set(filtered.map((l) => l.sessionId)).size;
    const topOffice = useMemo(() => {
        const counts = new Map<string, number>();
        filtered.forEach((l) => {
            if (!l.officeId) return;
            counts.set(l.officeId, (counts.get(l.officeId) ?? 0) + 1);
        });
        let best: string | null = null, bestCount = 0;
        counts.forEach((c, id) => { if (c > bestCount) { best = id; bestCount = c; } });
        return best ? officeName(best) : '—';
    }, [filtered]);

    function exportCsv() {
        const rows = ['qr_label,qr_code,session_id,office,scanned_at', ...filtered.map((l) =>
            `${qrLabel(l.qrId)},${qrCode(l.qrId)},${l.sessionId},${officeName(l.officeId)},${l.scannedAt}`)];
        const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = qrFilter === 'all' ? 'all-scan-history.csv' : `${qrCode(qrFilter)}-scan-history.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Scan history exported');
    }

    function resetFilters() {
        setQrFilter('all'); setOfficeFilter('all'); setQ(''); setFrom(''); setTo(''); setPage(1);
    }

    const hasActiveFilters = qrFilter !== 'all' || officeFilter !== 'all' || q || from || to;

    return (
        <>
            <Head title="Scan History — DavaNav Admin" />
            <AdminShell
                title="Scan History"
                description={qrFilter === 'all' ? 'Scans across all QR codes.' : `Filtered to ${qrLabel(qrFilter)}`}
                breadcrumbs={[{ label: 'QR Codes', to: '/admin/admin-qr-code' }, { label: 'Scan History' }]}
                actions={
                    <div className="flex gap-2">
                        <Link href="/admin/admin-qr-code">
                            <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to QR Codes</Button>
                        </Link>
                        <Button variant="outline" onClick={exportCsv}>
                            <Download className="mr-2 h-4 w-4" /> Export CSV
                        </Button>
                    </div>
                }
            >


                <Card className="flex flex-col overflow-hidden p-0">
                    {/* Filters */}
                    <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
                        <div className="relative min-w-[200px] flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                value={q}
                                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                                placeholder="Search by session ID…"
                                className="pl-9"
                            />
                        </div>
                        <Select value={qrFilter} onValueChange={(v) => { setQrFilter(v); setPage(1); }}>
                            <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All QR codes</SelectItem>
                                {seedQrCodes.map((qr) => <SelectItem key={qr.id} value={qr.id}>{qr.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Select value={officeFilter} onValueChange={(v) => { setOfficeFilter(v); setPage(1); }}>
                            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All offices</SelectItem>
                                {seedOffices.map((o) => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                            <CalendarClock className="h-4 w-4" />
                        </div>
                        <Input type="date" value={from} onChange={(e) => { setFrom(e.target.value); setPage(1); }} className="w-40" />
                        <span className="text-xs text-gray-400">to</span>
                        <Input type="date" value={to} onChange={(e) => { setTo(e.target.value); setPage(1); }} className="w-40" />
                        {hasActiveFilters && (
                            <Button variant="ghost" size="sm" onClick={resetFilters}>Clear</Button>
                        )}
                        <span className="ml-auto text-xs text-gray-400">
                            {filtered.length} scan{filtered.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>QR Code</TableHead>
                                <TableHead>Session ID</TableHead>
                                <TableHead>Office</TableHead>
                                <TableHead>Scanned</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paged.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="py-16 text-center text-gray-400">
                                        No scans match these filters.
                                    </TableCell>
                                </TableRow>
                            )}
                            {paged.map((log) => (
                                <TableRow key={log.logId}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <QrIcon className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <div className="font-medium">{qrLabel(log.qrId)}</div>
                                                <div className="font-mono text-xs text-gray-400">{qrCode(log.qrId)}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{log.sessionId}</TableCell>
                                    <TableCell>{officeName(log.officeId)}</TableCell>
                                    <TableCell className="text-gray-500">{timeAgo(log.scannedAt)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {filtered.length > PAGE_SIZE && (
                        <div className="flex items-center justify-between border-t px-4 py-3 text-xs text-gray-500">
                            <span>Page {page} of {totalPages}</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                                    Previous
                                </Button>
                                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </AdminShell>
        </>
    );
}