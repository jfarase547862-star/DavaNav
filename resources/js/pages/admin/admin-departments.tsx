import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Plus, Search, Download, Upload, Eye, Edit, Trash2,
    ChevronLeft, ChevronRight, ArrowUpDown, MoreVertical,
} from 'lucide-react';
import { AdminShell } from '@/components/admin/admin-shell';
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
import { Textarea } from '@/components/ui/textarea';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

/**
 * Fields below follow Table 10 (Departments) from the DavaNav Data Model →
 * Interface Mapping doc, Section C:
 *   department_name   -> "Department Name" input
 *   department_type   -> "Internal/External" radio or dropdown
 *   department_oic    -> "Office in Charge" input
 *   description       -> "Description" textarea
 *   contact_no        -> "Contact Number" input
 *   email             -> "Email" input
 *
 * `officeCount` is NOT a Departments column — it's a derived, read-only
 * count sourced from the Offices table (Table 12) via its department_id
 * foreign key, so it's shown in the list but excluded from the form.
 *
 * `floor` and `status` (Active/Inactive) were dropped: floor belongs to
 * Floors/Offices (Tables 11–12), not Departments, and no status field is
 * defined for Table 10 in the data dictionary.
 *
 * department_type doubles as the branch point in Section B of the mapping
 * doc: Internal departments are guided via Navigation Routes (Table 16,
 * A* indoor routing); External departments are guided via External Office
 * (Table 13 — address, jeepney routes, landmark).
 */

type DepartmentType = 'Internal' | 'External';

interface Department {
    id: string;
    department_name: string;
    department_type: DepartmentType;
    department_oic: string;
    description: string;
    contact_no: string;
    email: string;
    officeCount: number; // derived from Offices (department_id FK) — display only
}

interface Props {
    departments?: Department[];
}

const mockDepartments: Department[] = [
    { id: '1', department_name: 'Civil Registry', department_type: 'Internal', department_oic: 'Juan dela Cruz', description: 'Handles birth, marriage, and death registration.', contact_no: '(082) 227-1000', email: 'civilregistry@davaocity.gov.ph', officeCount: 3 },
    { id: '2', department_name: 'Treasury', department_type: 'Internal', department_oic: 'Maria Santos', description: 'Collects local taxes and fees.', contact_no: '(082) 227-1001', email: 'treasury@davaocity.gov.ph', officeCount: 2 },
    { id: '3', department_name: 'Assessor', department_type: 'Internal', department_oic: 'Pedro Reyes', description: 'Assesses real property for taxation.', contact_no: '(082) 227-1002', email: 'assessor@davaocity.gov.ph', officeCount: 4 },
    { id: '4', department_name: 'City Health Office', department_type: 'Internal', department_oic: 'Ana Garcia', description: 'Public health services and clinics.', contact_no: '(082) 227-1003', email: 'health@davaocity.gov.ph', officeCount: 2 },
    { id: '5', department_name: 'City Engineering', department_type: 'Internal', department_oic: 'Carlos Mendoza', description: 'Building permits and public works.', contact_no: '(082) 227-1004', email: 'engineering@davaocity.gov.ph', officeCount: 3 },
    { id: '6', department_name: 'Social Welfare (Satellite)', department_type: 'External', department_oic: 'Rosa Lim', description: 'Satellite office serving Barangay Buhangin residents.', contact_no: '(082) 227-1005', email: 'cswdo.buhangin@davaocity.gov.ph', officeCount: 1 },
    { id: '7', department_name: "Mayor's Office", department_type: 'Internal', department_oic: 'Jose Ramos', description: 'Office of the City Mayor.', contact_no: '(082) 227-1006', email: 'mayor@davaocity.gov.ph', officeCount: 5 },
    { id: '8', department_name: 'Business Permits (One-Stop Shop)', department_type: 'External', department_oic: 'Linda Cruz', description: 'Off-site BPLO branch near SM Ecoland.', contact_no: '(082) 227-1007', email: 'bplo.oss@davaocity.gov.ph', officeCount: 1 },
];

const empty: Department = {
    id: '', department_name: '', department_type: 'Internal', department_oic: '',
    description: '', contact_no: '', email: '', officeCount: 0,
};

function TypeBadge({ type }: { type: DepartmentType }) {
    const isInternal = type === 'Internal';
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                isInternal
                    ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200'
                    : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200'
            }`}
        >
            {type}
        </span>
    );
}

export default function AdminDepartments({ departments: initialDepartments = mockDepartments }: Props) {
    const [departments, setDepartments] = useState<Department[]>(initialDepartments);
    const [q, setQ] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [sortKey, setSortKey] = useState<keyof Department>('department_name');
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
            d.department_name.toLowerCase().includes(q.toLowerCase()) ||
            d.department_oic.toLowerCase().includes(q.toLowerCase())
        );
        if (typeFilter !== 'all') list = list.filter((d) => d.department_type === typeFilter);
        list = [...list].sort((a, b) => {
            const av = String(a[sortKey]);
            const bv = String(b[sortKey]);
            return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        return list;
    }, [departments, q, typeFilter, sortKey, sortAsc]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

    function toggleSort(k: keyof Department) {
        if (sortKey === k) setSortAsc((a) => !a);
        else { setSortKey(k); setSortAsc(true); }
    }

    function openAdd() { setCurrent(empty); setEditOpen(true); }
    function openEdit(d: Department) { setCurrent(d); setEditOpen(true); }

    function save() {
        if (!current.department_name.trim() || !current.department_oic.trim()) {
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
        const header = 'Department Name,Type,Office in Charge,Contact No.,Email,Offices\n';
        const rows = filtered.map((d) =>
            `"${d.department_name}","${d.department_type}","${d.department_oic}","${d.contact_no}","${d.email}","${d.officeCount}"`
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
            <Head title="Department Management — DavaNav Admin" />
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
                        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
                            <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All types</SelectItem>
                                <SelectItem value="Internal">Internal</SelectItem>
                                <SelectItem value="External">External</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <button className="flex items-center gap-1" onClick={() => toggleSort('department_name')}>
                                            Department Name <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </TableHead>
                                    <TableHead>
                                        <button className="flex items-center gap-1" onClick={() => toggleSort('department_type')}>
                                            Type <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </TableHead>
                                    <TableHead>
                                        <button className="flex items-center gap-1" onClick={() => toggleSort('department_oic')}>
                                            Office in Charge <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Offices</TableHead>
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
                                        <TableCell className="font-medium">{d.department_name}</TableCell>
                                        <TableCell><TypeBadge type={d.department_type} /></TableCell>
                                        <TableCell>{d.department_oic}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            <div>{d.contact_no}</div>
                                            <div>{d.email}</div>
                                        </TableCell>
                                        <TableCell>{d.officeCount}</TableCell>
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
                                <Input
                                    value={current.department_name}
                                    onChange={(e) => setCurrent({ ...current, department_name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Internal / External *</Label>
                                <Select
                                    value={current.department_type}
                                    onValueChange={(v) => setCurrent({ ...current, department_type: v as DepartmentType })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Internal">Internal (inside City Hall)</SelectItem>
                                        <SelectItem value="External">External (outside City Hall)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    Internal departments are guided via indoor turn-by-turn navigation.
                                    External departments show address, jeepney routes, and nearest landmark instead.
                                </p>
                            </div>
                            <div className="space-y-1">
                                <Label>Office in Charge *</Label>
                                <Input
                                    value={current.department_oic}
                                    onChange={(e) => setCurrent({ ...current, department_oic: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Description</Label>
                                <Textarea
                                    value={current.description}
                                    onChange={(e) => setCurrent({ ...current, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Contact Number</Label>
                                <Input
                                    value={current.contact_no}
                                    onChange={(e) => setCurrent({ ...current, contact_no: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={current.email}
                                    onChange={(e) => setCurrent({ ...current, email: e.target.value })}
                                />
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
                            <DialogTitle>{current.department_name}</DialogTitle>
                            <DialogDescription>Department details</DialogDescription>
                        </DialogHeader>
                        <dl className="grid grid-cols-2 gap-3 text-sm">
                            <dt className="text-muted-foreground">Type</dt>
                            <dd><TypeBadge type={current.department_type} /></dd>
                            <dt className="text-muted-foreground">Office in Charge</dt><dd>{current.department_oic}</dd>
                            <dt className="text-muted-foreground">Description</dt><dd className="col-span-2">{current.description || '—'}</dd>
                            <dt className="text-muted-foreground">Contact Number</dt><dd>{current.contact_no || '—'}</dd>
                            <dt className="text-muted-foreground">Email</dt><dd>{current.email || '—'}</dd>
                            <dt className="text-muted-foreground">Office Count</dt><dd>{current.officeCount}</dd>
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
                                This will permanently remove "{delTarget?.department_name}". This action cannot be undone.
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