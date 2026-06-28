import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Plus, Search, Download, Upload, Eye, Edit, Trash2,
    ChevronLeft, ChevronRight, ArrowUpDown, MoreVertical,
} from 'lucide-react';
import { AdminShell, StatusBadge } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
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

interface Department {
    id: string;
    name: string;
    head: string;
    floor: string;
    officeCount: number;
    status: 'Active' | 'Inactive';
}

interface Props {
    departments?: Department[];
}

const mockDepartments: Department[] = [
    { id: '1', name: 'Civil Registry', head: 'Juan dela Cruz', floor: '1F', officeCount: 3, status: 'Active' },
    { id: '2', name: 'Treasury', head: 'Maria Santos', floor: '1F', officeCount: 2, status: 'Active' },
    { id: '3', name: 'Assessor', head: 'Pedro Reyes', floor: '2F', officeCount: 4, status: 'Active' },
    { id: '4', name: 'Health', head: 'Ana Garcia', floor: '1F', officeCount: 2, status: 'Active' },
    { id: '5', name: 'Engineering', head: 'Carlos Mendoza', floor: '3F', officeCount: 3, status: 'Inactive' },
    { id: '6', name: 'Social Welfare', head: 'Rosa Lim', floor: '2F', officeCount: 2, status: 'Active' },
    { id: '7', name: "Mayor's Office", head: 'Jose Ramos', floor: '4F', officeCount: 5, status: 'Active' },
    { id: '8', name: 'Business Permits', head: 'Linda Cruz', floor: '2F', officeCount: 2, status: 'Active' },
];

const empty: Department = {
    id: '', name: '', head: '', floor: '1F', officeCount: 0, status: 'Active',
};

export default function AdminDepartments({ departments: initialDepartments = mockDepartments }: Props) {
    const [departments, setDepartments] = useState<Department[]>(initialDepartments);
    const [q, setQ] = useState('');
    const [floorFilter, setFloorFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortKey, setSortKey] = useState<keyof Department>('name');
    const [sortAsc, setSortAsc] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 6;

    const [editOpen, setEditOpen] = useState(false);
    const [viewOpen, setViewOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [delTarget, setDelTarget] = useState<Department | null>(null);
    const [current, setCurrent] = useState<Department>(empty);

    const filtered = useMemo(() => {
        let list = departments.filter((d) =>
            d.name.toLowerCase().includes(q.toLowerCase()) ||
            d.head.toLowerCase().includes(q.toLowerCase())
        );
        if (floorFilter !== 'all') list = list.filter((d) => d.floor === floorFilter);
        if (statusFilter !== 'all') list = list.filter((d) => d.status === statusFilter);
        list = [...list].sort((a, b) => {
            const av = String(a[sortKey]);
            const bv = String(b[sortKey]);
            return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        return list;
    }, [departments, q, floorFilter, statusFilter, sortKey, sortAsc]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

    function toggleSort(k: keyof Department) {
        if (sortKey === k) setSortAsc((a) => !a);
        else { setSortKey(k); setSortAsc(true); }
    }

    function openAdd() { setCurrent(empty); setEditOpen(true); }
    function openEdit(d: Department) { setCurrent(d); setEditOpen(true); }

    function save() {
        if (!current.name.trim() || !current.head.trim()) {
            toast.error('Please complete all required fields');
            return;
        }
        if (current.id) {
            setDepartments((prev) => prev.map((d) => d.id === current.id ? current : d));
            toast.success('Department updated');
        } else {
            setDepartments((prev) => [{ ...current, id: crypto.randomUUID() }, ...prev]);
            toast.success('Department added');
        }
        setEditOpen(false);
    }

    function deleteDepartment() {
        if (!delTarget) return;
        setDepartments((prev) => prev.filter((d) => d.id !== delTarget.id));
        toast.success('Department deleted');
        setDelTarget(null);
        setConfirmOpen(false);
    }

    function exportCsv() {
        const header = 'Name,Head,Floor,Offices,Status\n';
        const rows = filtered.map((d) =>
            `"${d.name}","${d.head}","${d.floor}","${d.officeCount}","${d.status}"`
        ).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'departments.csv'; a.click();
        URL.revokeObjectURL(url);
        toast.success('Exported departments.csv');
    }

    return (
        <>
            <Head title="Department Management — Navix Admin" />
            <AdminShell
                title="Department Management"
                description="Create, edit, and manage all departments across Davao City Hall."
                breadcrumbs={[{ label: 'Department Management' }]}
                actions={
                    <>
                        <Button variant="outline" onClick={() => setImportOpen(true)}>
                            <Upload className="mr-2 h-4 w-4" /> Import
                        </Button>
                        <Button variant="outline" onClick={exportCsv}>
                            <Download className="mr-2 h-4 w-4" /> Export
                        </Button>
                        <Button onClick={openAdd}>
                            <Plus className="mr-2 h-4 w-4" /> Add Department
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
                                placeholder="Search departments…"
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
                                <SelectItem value="4F">4F</SelectItem>
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
                                            Department Name <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </TableHead>
                                    <TableHead>
                                        <button className="flex items-center gap-1" onClick={() => toggleSort('head')}>
                                            Head <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </TableHead>
                                    <TableHead>
                                        <button className="flex items-center gap-1" onClick={() => toggleSort('floor')}>
                                            Floor <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </TableHead>
                                    <TableHead>Offices</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageItems.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                                            No departments match your filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {pageItems.map((d) => (
                                    <TableRow key={d.id}>
                                        <TableCell className="font-medium">{d.name}</TableCell>
                                        <TableCell>{d.head}</TableCell>
                                        <TableCell>{d.floor}</TableCell>
                                        <TableCell>{d.officeCount}</TableCell>
                                        <TableCell><StatusBadge status={d.status} /></TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-white">
                                                    <DropdownMenuItem onClick={() => { setCurrent(d); setViewOpen(true); }}>
                                                        <Eye className="mr-2 h-4 w-4" /> View
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => openEdit(d)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => { setDelTarget(d); setConfirmOpen(true); }}
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
                        <div>{filtered.length} department{filtered.length !== 1 && 's'}</div>
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
                            <DialogTitle>{current.id ? 'Edit Department' : 'Add Department'}</DialogTitle>
                            <DialogDescription>Fill in the details below. Fields marked * are required.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3">
                            <div className="space-y-1">
                                <Label>Department Name *</Label>
                                <Input value={current.name} onChange={(e) => setCurrent({ ...current, name: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <Label>Department Head *</Label>
                                <Input value={current.head} onChange={(e) => setCurrent({ ...current, head: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                                <Label>Floor</Label>
                                <Select value={current.floor} onValueChange={(v) => setCurrent({ ...current, floor: v })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1F">1F</SelectItem>
                                        <SelectItem value="2F">2F</SelectItem>
                                        <SelectItem value="3F">3F</SelectItem>
                                        <SelectItem value="4F">4F</SelectItem>
                                    </SelectContent>
                                </Select>
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
                            <DialogDescription>Department details</DialogDescription>
                        </DialogHeader>
                        <dl className="grid grid-cols-2 gap-3 text-sm">
                            <dt className="text-muted-foreground">Department Head</dt><dd>{current.head}</dd>
                            <dt className="text-muted-foreground">Floor</dt><dd>{current.floor}</dd>
                            <dt className="text-muted-foreground">Office Count</dt><dd>{current.officeCount}</dd>
                            <dt className="text-muted-foreground">Status</dt><dd><StatusBadge status={current.status} /></dd>
                        </dl>
                        <DialogFooter>
                            <Button onClick={() => setViewOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Import Dialog */}
                <Dialog open={importOpen} onOpenChange={setImportOpen}>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle>Import Departments</DialogTitle>
                            <DialogDescription>Upload a CSV file with department records.</DialogDescription>
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
                            <DialogTitle>Delete department?</DialogTitle>
                            <DialogDescription>
                                This will permanently remove "{delTarget?.name}". This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                            <Button variant="destructive" onClick={deleteDepartment}>Delete</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </AdminShell>
        </>
    );
}