import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Plus, Search, Download, Upload, Eye, Edit, Trash2, QrCode as QrIcon, MapPin,
    ChevronLeft, ChevronRight, ArrowUpDown, MoreVertical,
} from 'lucide-react';
import { AdminShell, StatusBadge } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Office {
    id: string;
    name: string;
    department: string;
    floor: string;
    room: string;
    contact: string;
    status: 'Active' | 'Inactive';
    qrAssigned: boolean;
}

interface Props {
    offices?: Office[];
}

const mockOffices: Office[] = [
    { id: '1', name: 'Civil Registry Office', department: 'Civil Registry', floor: '1F', room: 'Room 101', contact: '(02) 8123-4501', status: 'Active', qrAssigned: true },
    { id: '2', name: 'Treasury Office', department: 'Treasury', floor: '1F', room: 'Room 105', contact: '(02) 8123-4502', status: 'Active', qrAssigned: false },
    { id: '3', name: 'Business Permits & Licensing', department: 'Assessor', floor: '2F', room: 'Room 201', contact: '(02) 8123-4503', status: 'Active', qrAssigned: true },
    { id: '4', name: 'Health Office', department: 'Health', floor: '1F', room: 'Room 110', contact: '(02) 8123-4504', status: 'Active', qrAssigned: false },
    { id: '5', name: "Mayor's Office", department: "Mayor's Office", floor: '4F', room: 'Room 401', contact: '(02) 8123-4505', status: 'Active', qrAssigned: true },
    { id: '6', name: 'Engineering Office', department: 'Engineering', floor: '3F', room: 'Room 302', contact: '(02) 8123-4506', status: 'Inactive', qrAssigned: false },
    { id: '7', name: 'Social Welfare Office', department: 'Social Welfare', floor: '2F', room: 'Room 210', contact: '(02) 8123-4507', status: 'Active', qrAssigned: false },
    { id: '8', name: 'Assessor Office', department: 'Assessor', floor: '3F', room: 'Room 305', contact: '(02) 8123-4508', status: 'Active', qrAssigned: true },
];

const empty: Office = {
    id: '', name: '', department: '', floor: '1F', room: '', contact: '', status: 'Active', qrAssigned: false,
};

export default function AdminOffices({ offices: initialOffices = mockOffices }: Props) {
    const [offices, setOffices] = useState<Office[]>(initialOffices);
    const [q, setQ] = useState('');
    const [floorFilter, setFloorFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortKey, setSortKey] = useState<keyof Office>('name');
    const [sortAsc, setSortAsc] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 6;

    const [editOpen, setEditOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);
    const [routeOpen, setRouteOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [delTarget, setDelTarget] = useState<Office | null>(null);
    const [current, setCurrent] = useState<Office>(empty);

    const filtered = useMemo(() => {
        let list = offices.filter((o) =>
            o.name.toLowerCase().includes(q.toLowerCase()) ||
            o.room.toLowerCase().includes(q.toLowerCase())
        );
        if (floorFilter !== 'all') list = list.filter((o) => o.floor === floorFilter);
        if (statusFilter !== 'all') list = list.filter((o) => o.status === statusFilter);
        list = [...list].sort((a, b) => {
            const av = String(a[sortKey]);
            const bv = String(b[sortKey]);
            return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        return list;
    }, [offices, q, floorFilter, statusFilter, sortKey, sortAsc]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

    function toggleSort(k: keyof Office) {
        if (sortKey === k) setSortAsc((a) => !a);
        else { setSortKey(k); setSortAsc(true); }
    }

    function openAdd() { setCurrent(empty); setEditOpen(true); }
    function openEdit(o: Office) { setCurrent(o); setEditOpen(true); }

    function save() {
        if (!current.name.trim() || !current.room.trim()) {
            toast.error('Please complete all required fields');
            return;
        }
        if (current.id) {
            setOffices((prev) => prev.map((o) => o.id === current.id ? current : o));
            toast.success('Office updated');
        } else {
            setOffices((prev) => [{ ...current, id: crypto.randomUUID() }, ...prev]);
            toast.success('Office added');
        }
        setEditOpen(false);
    }

    function deleteOffice() {
        if (!delTarget) return;
        setOffices((prev) => prev.filter((o) => o.id !== delTarget.id));
        toast.success('Office deleted');
        setDelTarget(null);
        setConfirmOpen(false);
    }

    function exportCsv() {
        const header = 'Name,Department,Floor,Room,Contact,Status,QR\n';
        const rows = filtered.map((o) =>
            `"${o.name}","${o.department}","${o.floor}","${o.room}","${o.contact}","${o.status}","${o.qrAssigned ? 'Yes' : 'No'}"`
        ).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'offices.csv'; a.click();
        URL.revokeObjectURL(url);
        toast.success('Exported offices.csv');
    }

    function generateQr(o: Office) {
        setOffices((prev) => prev.map((x) => x.id === o.id ? { ...x, qrAssigned: true } : x));
        toast.success('QR code generated', { description: `Assigned to ${o.name}` });
        setQrOpen(false);
    }

    return (
        <>
            <Head title="Office Management — Navix Admin" />
            <AdminShell
                title="Office Management"
                description="Create, edit, and manage all offices across Davao City Hall."
                breadcrumbs={[{ label: 'Office Management' }]}
                actions={
                    <>
                        <Button variant="outline" onClick={() => setImportOpen(true)}>
                            <Upload className="mr-2 h-4 w-4" /> Import
                        </Button>
                        <Button variant="outline" onClick={exportCsv}>
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                        <Button onClick={openAdd}>
                            <Plus className="mr-2 h-4 w-4" /> Add Office
                        </Button>
                    </>
                }
            >
                <Card className="p-4">
                    {/* Filters */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <div className="relative min-w-[220px] flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                value={q}
                                onChange={(e) => { setQ(e.target.value); setPage(1); }}
                                placeholder="Search offices…"
                                className="pl-9"
                            />
                        </div>
                        <Select value={floorFilter} onValueChange={(v) => { setFloorFilter(v); setPage(1); }}>
                            <SelectTrigger className="w-32"><SelectValue placeholder="Floor" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All floors</SelectItem>
                                <SelectItem value="1F">1F</SelectItem>
                                <SelectItem value="2F">2F</SelectItem>
                                <SelectItem value="3F">3F</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                            <SelectTrigger className="w-36"><SelectValue placeholder="Status" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All status</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <button className="flex items-center gap-1" onClick={() => toggleSort('name')}>
                                            Office Name <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>
                                        <button className="flex items-center gap-1" onClick={() => toggleSort('floor')}>
                                            Floor <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </TableHead>
                                    <TableHead>Room</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>QR</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageItems.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="py-12 text-center text-muted-foreground">
                                            No offices match your filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {pageItems.map((o) => (
                                    <TableRow key={o.id}>
                                        <TableCell className="font-medium">{o.name}</TableCell>
                                        <TableCell>{o.department}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{o.floor}</Badge>
                                        </TableCell>
                                        <TableCell>{o.room}</TableCell>
                                        <TableCell>{o.contact}</TableCell>
                                        <TableCell><StatusBadge status={o.status} /></TableCell>
                                        <TableCell>{o.qrAssigned ? 'Yes' : 'No'}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-white">
                                                    <DropdownMenuItem onClick={() => { setCurrent(o); setViewOpen(true); }}>
                                                        <Eye className="mr-2 h-4 w-4" /> View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openEdit(o)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setCurrent(o); setQrOpen(true); }}>
                                                        <QrIcon className="mr-2 h-4 w-4" /> Generate QR
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => { setCurrent(o); setRouteOpen(true); }}>
                                                        <MapPin className="mr-2 h-4 w-4" /> View Route
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => { setDelTarget(o); setConfirmOpen(true); }}
                                                        className="text-red-600"
                                                    >
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

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                        <div>{filtered.length} office{filtered.length !== 1 && 's'}</div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span>Page {page} of {pageCount}</span>
                            <Button variant="outline" size="icon" disabled={page === pageCount} onClick={() => setPage((p) => p + 1)}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Add/Edit Dialog */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle>{current.id ? 'Edit Office' : 'Add Office'}</DialogTitle>
                            <DialogDescription>Fill in the details below. Fields marked * are required.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3">
                            <div className="space-y-1">
                                <Label>Office Name *</Label>
                                <Input value={current.name} onChange={(e) => setCurrent({ ...current, name: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <Label>Department *</Label>
                                <Input value={current.department} onChange={(e) => setCurrent({ ...current, department: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label>Floor</Label>
                                    <Select value={current.floor} onValueChange={(v) => setCurrent({ ...current, floor: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1F">1F</SelectItem>
                                            <SelectItem value="2F">2F</SelectItem>
                                            <SelectItem value="3F">3F</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Room *</Label>
                                    <Input value={current.room} onChange={(e) => setCurrent({ ...current, room: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Contact</Label>
                                <Input value={current.contact} onChange={(e) => setCurrent({ ...current, contact: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <Label>Status</Label>
                                <Select value={current.status} onValueChange={(v) => setCurrent({ ...current, status: v as 'Active' | 'Inactive' })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setCurrent(empty)}>Reset</Button>
                            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                            <Button onClick={save}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* View Dialog */}
                <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle>{current.name}</DialogTitle>
                            <DialogDescription>Office details</DialogDescription>
                        </DialogHeader>
                        <dl className="grid grid-cols-2 gap-3 text-sm">
                            <dt className="text-muted-foreground">Department</dt><dd>{current.department}</dd>
                            <dt className="text-muted-foreground">Floor</dt><dd>{current.floor}</dd>
                            <dt className="text-muted-foreground">Room</dt><dd>{current.room}</dd>
                            <dt className="text-muted-foreground">Contact</dt><dd>{current.contact}</dd>
                            <dt className="text-muted-foreground">Status</dt><dd><StatusBadge status={current.status} /></dd>
                            <dt className="text-muted-foreground">QR Assigned</dt><dd>{current.qrAssigned ? 'Yes' : 'No'}</dd>
                        </dl>
                        <DialogFooter>
                            <Button onClick={() => setViewOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* QR Dialog */}
                <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle>Generate QR Code</DialogTitle>
                            <DialogDescription>Create and assign a new QR code for {current.name}.</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-3 py-4">
                            <div className="grid h-40 w-40 grid-cols-8 grid-rows-8 gap-0.5 rounded border bg-white p-2">
                                {Array.from({ length: 64 }).map((_, i) => (
                                    <div key={i} className={(i * 7 + (current.name.length || 1)) % 3 === 0 ? 'bg-gray-900' : 'bg-transparent'} />
                                ))}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                NAVIX-{current.name.toUpperCase().replace(/\s+/g, '-').slice(0, 14)}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setQrOpen(false)}>Cancel</Button>
                            <Button onClick={() => generateQr(current)}>Generate & Assign</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Route Dialog */}
                <Dialog open={routeOpen} onOpenChange={setRouteOpen}>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle>Route Preview</DialogTitle>
                            <DialogDescription>Suggested route from Main Entrance to {current.name}.</DialogDescription>
                        </DialogHeader>
                        <ol className="space-y-2 text-sm">
                            <li>1. Enter through Main Entrance.</li>
                            <li>2. Walk straight to Lobby Center.</li>
                            <li>3. Take Elevator A to {current.floor}.</li>
                            <li>4. Turn right into the corridor.</li>
                            <li>5. Arrive at Room {current.room} — {current.name}.</li>
                        </ol>
                        <DialogFooter>
                            <Button onClick={() => setRouteOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Import Dialog */}
                <Dialog open={importOpen} onOpenChange={setImportOpen}>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle>Import Offices</DialogTitle>
                            <DialogDescription>Upload a CSV file with office records.</DialogDescription>
                        </DialogHeader>
                        <div className="rounded-md border-2 border-dashed p-8 text-center text-sm text-muted-foreground">
                            <Upload className="mx-auto mb-2 h-8 w-8" />
                            Drag & drop CSV here, or click to browse.
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setImportOpen(false)}>Cancel</Button>
                            <Button onClick={() => { toast.success('Imported 0 records (demo)'); setImportOpen(false); }}>
                                Import
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Confirm Delete Dialog */}
                <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle>Delete office?</DialogTitle>
                            <DialogDescription>
                                This will permanently remove "{delTarget?.name}". This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={deleteOffice}>Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </AdminShell>
        </>
    );
}