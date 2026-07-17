import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    Plus, Search, Download, Upload, Eye, Edit, Trash2, QrCode as QrIcon, MapPin,
    ChevronLeft, ChevronRight, ArrowUpDown, MoreVertical, ClipboardList, X,
} from 'lucide-react';
import { AdminShell, StatusBadge } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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

/**
 * Field-to-screen bindings implemented here follow the DavaNav
 * Data Model → Interface Mapping doc exactly:
 *  - Table 12 (Offices)            -> this screen's core Add/Edit form (Details tab)
 *  - Table 13 (External Office)    -> conditional sub-section, External depts only (Details tab)
 *  - Table 14 (Services)           -> Services tab, nested inside the same Add/Edit Office dialog
 *  - Table 15 (QR Codes)           -> Generate QR dialog
 *  - Table 16 (Navigation Routes)  -> Route dialog, Internal depts only
 */

// ---- Table 10 (Departments) — minimal shape needed to drive the
// Internal/External branch described in Section B of the mapping doc ----
interface Department {
    id: string;
    department_name: string;
    department_type: 'Internal' | 'External';
}

// ---- Table 12. Offices ----
interface Office {
    id: string;
    office_name: string;
    office_code: string;
    department_id: string;
    description: string;
    operating_hrs: string;
    contact_no: string;
    email: string;
    status: 'Active' | 'Inactive';
    // Supplementary, used by internal navigation (Table 16) and QR (Table 15) —
    // not part of Table 12's own field list, kept for indoor routing/display only.
    floor: string;
    room: string;
    qrAssigned: boolean;
    // Table 13. External Office — present only when the parent department is External
    externalOffice?: ExternalOffice;
    // Table 14. Services — offered under this office (office_id FK, edited via the
    // Services tab inside this office's own Add/Edit dialog)
    services: Service[];
}

// ---- Table 13. External Office ----
interface ExternalOffice {
    office_address: string;
    jeepney_routes: string;
    transportation_notes: string;
    nearest_landmark: string;
}

// ---- Table 14. Services ----
// service_id      -> id (PK, auto increment)
// office_id       -> implicit: nested under Office.services (FK -> Offices.office_id)
// service_name    -> service_name (NOT NULL)
// description     -> description (NULL)
// requirements    -> requirements (NULL) — comma-separated list, split for display
// processing_time -> processing_time (NULL)
// status          -> status (NOT NULL)
interface Service {
    id: string;
    service_name: string;
    description: string;
    requirements: string;
    processing_time: string;
    status: 'Active' | 'Inactive';
}

// ---- Table 16. Navigation Routes (internal offices only) ----
interface NavigationRoute {
    from_location: string; // fixed: "Main Entrance"
    office_id: string;
    floor_id: string;
    direction_steps: string[];
    estimated_time: string;
    map_highlight?: string; // set via map-drawing tool, not typed input
}

interface Props {
    offices?: Office[];
    departments?: Department[];
}

const mockDepartments: Department[] = [
    { id: 'd1', department_name: 'Civil Registry', department_type: 'Internal' },
    { id: 'd2', department_name: 'Treasury', department_type: 'Internal' },
    { id: 'd3', department_name: 'Assessor', department_type: 'Internal' },
    { id: 'd4', department_name: "Mayor's Office", department_type: 'Internal' },
    { id: 'd5', department_name: 'Engineering', department_type: 'Internal' },
    { id: 'd6', department_name: 'City Health Office (Field Station)', department_type: 'External' },
    { id: 'd7', department_name: 'Social Welfare (Satellite Office)', department_type: 'External' },
];

const mockOffices: Office[] = [
    {
        id: '1', office_name: 'Civil Registry Office', office_code: 'CRO-01', department_id: 'd1',
        description: 'Handles birth, marriage, and death registration.', operating_hrs: '8:00 AM–5:00 PM',
        contact_no: '(02) 8123-4501', email: 'civilregistry@davaocity.gov.ph', status: 'Active',
        floor: '1F', room: 'Room 101', qrAssigned: true,
        services: [
            { id: 's1', service_name: 'Birth Certificate Request', description: 'Request certified copies of birth certificates.', requirements: 'Valid ID, Request Form', processing_time: '15 mins', status: 'Active' },
        ],
    },
    {
        id: '2', office_name: 'Treasury Office', office_code: 'TRO-01', department_id: 'd2',
        description: 'Collects local taxes and issues payment receipts.', operating_hrs: '8:00 AM–5:00 PM',
        contact_no: '(02) 8123-4502', email: 'treasury@davaocity.gov.ph', status: 'Active',
        floor: '1F', room: 'Room 105', qrAssigned: false, services: [],
    },
    {
        id: '3', office_name: 'Business Permits & Licensing', office_code: 'BPL-01', department_id: 'd3',
        description: 'Processes new and renewed business permits.', operating_hrs: '8:00 AM–5:00 PM',
        contact_no: '(02) 8123-4503', email: 'bpls@davaocity.gov.ph', status: 'Active',
        floor: '2F', room: 'Room 201', qrAssigned: true, services: [],
    },
    {
        id: '4', office_name: 'City Health Office (Field Station)', office_code: 'CHO-FS1', department_id: 'd6',
        description: 'Community health services outside the main City Hall building.', operating_hrs: '8:00 AM–5:00 PM',
        contact_no: '(02) 8123-4504', email: 'health.fieldstation@davaocity.gov.ph', status: 'Active',
        floor: '', room: '', qrAssigned: false,
        externalOffice: {
            office_address: 'Door 3, JP Laurel Ave, Davao City',
            jeepney_routes: 'Ride any "Bankerohan–Sasa" jeepney, alight at JP Laurel corner',
            transportation_notes: '5-minute walk from the jeepney stop; tricycles also available',
            nearest_landmark: 'Beside Davao Doctors Hospital',
        },
        services: [],
    },
    {
        id: '5', office_name: "Mayor's Office", office_code: 'MYO-01', department_id: 'd4',
        description: 'Office of the City Mayor.', operating_hrs: '8:00 AM–5:00 PM',
        contact_no: '(02) 8123-4505', email: 'mayor@davaocity.gov.ph', status: 'Active',
        floor: '4F', room: 'Room 401', qrAssigned: true, services: [],
    },
    {
        id: '6', office_name: 'Engineering Office', office_code: 'ENG-01', department_id: 'd5',
        description: 'Reviews building permits and public works.', operating_hrs: '8:00 AM–5:00 PM',
        contact_no: '(02) 8123-4506', email: 'engineering@davaocity.gov.ph', status: 'Inactive',
        floor: '3F', room: 'Room 302', qrAssigned: false, services: [],
    },
    {
        id: '7', office_name: 'Social Welfare (Satellite Office)', office_code: 'SWO-S1', department_id: 'd7',
        description: 'Assistance and case management, satellite location.', operating_hrs: '8:00 AM–5:00 PM',
        contact_no: '(02) 8123-4507', email: 'swd.satellite@davaocity.gov.ph', status: 'Active',
        floor: '', room: '', qrAssigned: false,
        externalOffice: {
            office_address: 'Rizal St., Barangay 23-C, Davao City',
            jeepney_routes: 'Ride "Agdao–Bankerohan" jeepney, alight at Rizal St.',
            transportation_notes: 'Accessible by tricycle from the jeepney stop',
            nearest_landmark: 'Near Agdao Public Market',
        },
        services: [],
    },
];

const emptyExternal: ExternalOffice = {
    office_address: '', jeepney_routes: '', transportation_notes: '', nearest_landmark: '',
};

const empty: Office = {
    id: '', office_name: '', office_code: '', department_id: '', description: '', operating_hrs: '',
    contact_no: '', email: '', status: 'Active', floor: '1F', room: '', qrAssigned: false, services: [],
};

// Small inline switch — avoids depending on a shadcn Switch component that
// may not be present in every project; implements the "Active/Inactive toggle"
// called for by Table 12 / Table 9 / Table 15 in the mapping doc.
function StatusToggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id?: string }) {
    return (
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-emerald-600' : 'bg-gray-300'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );
}

export default function AdminOffices({ offices: initialOffices = mockOffices, departments = mockDepartments }: Props) {
    const [offices, setOffices] = useState<Office[]>(initialOffices);
    const [q, setQ] = useState('');
    const [floorFilter, setFloorFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState<'all' | 'Internal' | 'External'>('all');
    const [sortKey, setSortKey] = useState<keyof Office>('office_name');
    const [sortAsc, setSortAsc] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 6;

    const [editOpen, setEditOpen] = useState(false);
    const [editTab, setEditTab] = useState<'details' | 'services'>('details');
    const [viewOpen, setViewOpen] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);
    const [routeOpen, setRouteOpen] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [delTarget, setDelTarget] = useState<Office | null>(null);
    const [current, setCurrent] = useState<Office>(empty);
    const [newService, setNewService] = useState<Omit<Service, 'id'>>({
        service_name: '', description: '', requirements: '', processing_time: '', status: 'Active',
    });

    const deptById = (id: string) => departments.find((d) => d.id === id);
    const isExternal = (o: Office) => deptById(o.department_id)?.department_type === 'External';

    const filtered = useMemo(() => {
        let list = offices.filter((o) =>
            o.office_name.toLowerCase().includes(q.toLowerCase()) ||
            o.office_code.toLowerCase().includes(q.toLowerCase()) ||
            o.room.toLowerCase().includes(q.toLowerCase())
        );
        if (floorFilter !== 'all') list = list.filter((o) => o.floor === floorFilter);
        if (statusFilter !== 'all') list = list.filter((o) => o.status === statusFilter);
        if (typeFilter !== 'all') list = list.filter((o) => deptById(o.department_id)?.department_type === typeFilter);
        list = [...list].sort((a, b) => {
            const av = String(a[sortKey]);
            const bv = String(b[sortKey]);
            return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
        });
        return list;
    }, [offices, q, floorFilter, statusFilter, typeFilter, sortKey, sortAsc]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

    function toggleSort(k: keyof Office) {
        if (sortKey === k) setSortAsc((a) => !a);
        else { setSortKey(k); setSortAsc(true); }
    }

    function openAdd() { setCurrent(empty); setEditTab('details'); setEditOpen(true); }
    function openEdit(o: Office) { setCurrent(o); setEditTab('details'); setEditOpen(true); }
    // "Manage Services" from the row menu jumps straight into the Services tab
    // of the same Add/Edit Office dialog, rather than opening a separate popup.
    function openServices(o: Office) { setCurrent(o); setEditTab('services'); setEditOpen(true); }

    function save() {
        if (!current.office_name.trim() || !current.office_code.trim() || !current.department_id) {
            toast.error('Please complete all required fields (Office Name, Office Code, Department)');
            setEditTab('details');
            return;
        }
        if (isExternal(current) && !current.externalOffice) {
            setCurrent((c) => ({ ...c, externalOffice: emptyExternal }));
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
        const header = 'Office Name,Office Code,Department,Type,Operating Hours,Contact,Email,Status\n';
        const rows = filtered.map((o) => {
            const dept = deptById(o.department_id);
            return `"${o.office_name}","${o.office_code}","${dept?.department_name ?? ''}","${dept?.department_type ?? ''}","${o.operating_hrs}","${o.contact_no}","${o.email}","${o.status}"`;
        }).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'offices.csv'; a.click();
        URL.revokeObjectURL(url);
        toast.success('Exported offices.csv');
    }

    // Table 15. QR Codes — office_id, qr_string (auto), qr_image_path (auto), status
    function generateQr(o: Office) {
        setOffices((prev) => prev.map((x) => x.id === o.id ? { ...x, qrAssigned: true } : x));
        toast.success('QR code generated', { description: `Assigned to ${o.office_name}` });
        setQrOpen(false);
    }

    // Table 14. Services — add/remove within the Services tab of the Add/Edit Office dialog.
    // These only touch local `current` state; the office_id FK relationship is implicit
    // because services live nested under this office until Save persists the whole record.
    function addService() {
        if (!newService.service_name.trim()) {
            toast.error('Service name is required');
            return;
        }
        const service: Service = { ...newService, id: crypto.randomUUID() };
        setCurrent((c) => ({ ...c, services: [...c.services, service] }));
        setNewService({ service_name: '', description: '', requirements: '', processing_time: '', status: 'Active' });
    }
    function removeService(id: string) {
        setCurrent((c) => ({ ...c, services: c.services.filter((s) => s.id !== id) }));
    }

    return (
        <>
            <Head title="Office Management — DavaNav Admin" />
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
                                placeholder="Search office name or code…"
                                className="pl-9"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v as any); setPage(1); }}>
                            <SelectTrigger className="w-36"><SelectValue placeholder="Type" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All types</SelectItem>
                                <SelectItem value="Internal">Internal</SelectItem>
                                <SelectItem value="External">External</SelectItem>
                            </SelectContent>
                        </Select>
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
                                        <button className="flex items-center gap-1" onClick={() => toggleSort('office_name')}>
                                            Office Name <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </TableHead>
                                    <TableHead>Office Code</TableHead>
                                    <TableHead>Department</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Operating Hours</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Services</TableHead>
                                    <TableHead>QR</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pageItems.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={10} className="py-12 text-center text-muted-foreground">
                                            No offices match your filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {pageItems.map((o) => {
                                    const dept = deptById(o.department_id);
                                    const external = dept?.department_type === 'External';
                                    return (
                                        <TableRow key={o.id}>
                                            <TableCell className="font-medium">{o.office_name}</TableCell>
                                            <TableCell>{o.office_code}</TableCell>
                                            <TableCell>{dept?.department_name ?? '—'}</TableCell>
                                            <TableCell>
                                                <Badge variant={external ? 'secondary' : 'outline'}>
                                                    {dept?.department_type ?? '—'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{o.operating_hrs}</TableCell>
                                            <TableCell>{o.contact_no}</TableCell>
                                            <TableCell><StatusBadge status={o.status} /></TableCell>
                                            <TableCell>
                                                <button
                                                    className="text-sm text-primary underline-offset-2 hover:underline disabled:cursor-default disabled:text-muted-foreground disabled:no-underline"
                                                    onClick={() => openServices(o)}
                                                >
                                                    {o.services.length} service{o.services.length !== 1 && 's'}
                                                </button>
                                            </TableCell>
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
                                                        <DropdownMenuItem onClick={() => openServices(o)}>
                                                            <ClipboardList className="mr-2 h-4 w-4" /> Manage Services
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { setCurrent(o); setRouteOpen(true); }}>
                                                            <MapPin className="mr-2 h-4 w-4" />
                                                            {external ? 'View Travel Info' : 'Get Navigation Map'}
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
                                    );
                                })}
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

                {/* Add/Edit Office Dialog.
                    Table 12 core fields (+ Table 13 conditional section) live under the
                    "Office Details" tab; Table 14 Services now live under a "Services" tab
                    in this SAME dialog, instead of a separate popup — so everything about
                    one office is edited and saved together in one place. */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto bg-white">
                        <DialogHeader>
                            <DialogTitle>{current.id ? 'Edit Office' : 'Add Office'}</DialogTitle>
                            <DialogDescription>
                                {editTab === 'details'
                                    ? 'Fill in the details below. Fields marked * are required.'
                                    : `Services offered at ${current.office_name || 'this office'}. Shown to visitors before they navigate.`}
                            </DialogDescription>
                        </DialogHeader>

                        {/* Tab switcher */}
                        <div className="flex gap-1 border-b">
                            <button
                                type="button"
                                onClick={() => setEditTab('details')}
                                className={`px-3 py-2 text-sm font-medium transition-colors ${editTab === 'details' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Office Details
                            </button>
                            <button
                                type="button"
                                disabled={!current.id}
                                onClick={() => setEditTab('services')}
                                title={!current.id ? 'Save the office first to add services' : undefined}
                                className={`px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:text-muted-foreground/50 ${editTab === 'services' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Services {current.services.length > 0 && `(${current.services.length})`}
                            </button>
                        </div>

                        {editTab === 'details' && (
                            <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                                {/* Left column */}
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label>Office Name *</Label>
                                        <Input value={current.office_name} onChange={(e) => setCurrent({ ...current, office_name: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Office Code *</Label>
                                        <Input value={current.office_code} onChange={(e) => setCurrent({ ...current, office_code: e.target.value })} placeholder="e.g., CRO-01" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Select Department *</Label>
                                        <Select value={current.department_id} onValueChange={(v) => setCurrent({ ...current, department_id: v })}>
                                            <SelectTrigger><SelectValue placeholder="Choose department" /></SelectTrigger>
                                            <SelectContent>
                                                {departments.map((d) => (
                                                    <SelectItem key={d.id} value={d.id}>
                                                        {d.department_name} ({d.department_type})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Description</Label>
                                        <Textarea rows={3} value={current.description} onChange={(e) => setCurrent({ ...current, description: e.target.value })} />
                                    </div>
                                </div>

                                {/* Right column */}
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Label>Operating Hours</Label>
                                        <Input value={current.operating_hrs} onChange={(e) => setCurrent({ ...current, operating_hrs: e.target.value })} placeholder="e.g., 8:00 AM–5:00 PM" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Contact Number</Label>
                                        <Input value={current.contact_no} onChange={(e) => setCurrent({ ...current, contact_no: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Email</Label>
                                        <Input type="email" value={current.email} onChange={(e) => setCurrent({ ...current, email: e.target.value })} />
                                    </div>

                                    {/* Supplementary indoor-location fields, used by Table 16 routing — internal only */}
                                    {!isExternal(current) && (
                                        <div className="grid grid-cols-2 gap-3">
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
                                                <Label>Room</Label>
                                                <Input value={current.room} onChange={(e) => setCurrent({ ...current, room: e.target.value })} />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between rounded-md border p-3">
                                        <Label htmlFor="status-toggle" className="mb-0">Active / Inactive</Label>
                                        <StatusToggle
                                            id="status-toggle"
                                            checked={current.status === 'Active'}
                                            onChange={(v) => setCurrent({ ...current, status: v ? 'Active' : 'Inactive' })}
                                        />
                                    </div>
                                </div>

                                {/* Table 13. External Office — conditional section, External departments only.
                                    Spans both columns and is itself laid out two-wide to keep height down. */}
                                {isExternal(current) && (
                                    <div className="space-y-3 rounded-md border border-dashed p-3 md:col-span-2">
                                        <div className="text-sm font-medium">External Office Details</div>
                                        <p className="text-xs text-muted-foreground">
                                            Shown to visitors in place of an indoor floor/room location, since this office has no
                                            A*-computed route inside City Hall.
                                        </p>
                                        <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
                                            <div className="space-y-1">
                                                <Label>Address</Label>
                                                <Input
                                                    value={current.externalOffice?.office_address ?? ''}
                                                    onChange={(e) => setCurrent({
                                                        ...current,
                                                        externalOffice: { ...(current.externalOffice ?? emptyExternal), office_address: e.target.value },
                                                    })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Nearest Landmark</Label>
                                                <Input
                                                    value={current.externalOffice?.nearest_landmark ?? ''}
                                                    onChange={(e) => setCurrent({
                                                        ...current,
                                                        externalOffice: { ...(current.externalOffice ?? emptyExternal), nearest_landmark: e.target.value },
                                                    })}
                                                    placeholder="Near [Landmark]"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>How to Get There (Jeepney Routes)</Label>
                                                <Textarea
                                                    rows={3}
                                                    value={current.externalOffice?.jeepney_routes ?? ''}
                                                    onChange={(e) => setCurrent({
                                                        ...current,
                                                        externalOffice: { ...(current.externalOffice ?? emptyExternal), jeepney_routes: e.target.value },
                                                    })}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Transportation Notes</Label>
                                                <Textarea
                                                    rows={3}
                                                    value={current.externalOffice?.transportation_notes ?? ''}
                                                    onChange={(e) => setCurrent({
                                                        ...current,
                                                        externalOffice: { ...(current.externalOffice ?? emptyExternal), transportation_notes: e.target.value },
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {editTab === 'services' && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    {current.services.length === 0 && (
                                        <p className="text-sm text-muted-foreground">No services added yet.</p>
                                    )}
                                    {current.services.map((s) => (
                                        <div key={s.id} className="flex items-start justify-between rounded-md border p-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{s.service_name}</span>
                                                    <Badge variant={s.status === 'Active' ? 'default' : 'secondary'}>{s.status}</Badge>
                                                </div>
                                                {s.description && <p className="text-sm text-muted-foreground">{s.description}</p>}
                                                {s.requirements && (
                                                    <p className="text-xs text-muted-foreground">Requirements: {s.requirements}</p>
                                                )}
                                                {s.processing_time && (
                                                    <p className="text-xs text-muted-foreground">Est. Processing Time: {s.processing_time}</p>
                                                )}
                                            </div>
                                            <Button variant="ghost" size="icon" onClick={() => removeService(s.id)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-2 rounded-md border border-dashed p-3">
                                    <div className="text-sm font-medium">Add Service</div>
                                    <div className="space-y-1">
                                        <Label>Service Name *</Label>
                                        <Input value={newService.service_name} onChange={(e) => setNewService({ ...newService, service_name: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Description</Label>
                                        <Textarea value={newService.description} onChange={(e) => setNewService({ ...newService, description: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <Label>Requirements</Label>
                                        <Input value={newService.requirements} onChange={(e) => setNewService({ ...newService, requirements: e.target.value })} placeholder="Comma-separated, e.g. Valid ID, Application Form" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label>Estimated Processing Time</Label>
                                            <Input value={newService.processing_time} onChange={(e) => setNewService({ ...newService, processing_time: e.target.value })} placeholder="e.g., 15 mins" />
                                        </div>
                                        <div className="flex items-center justify-between rounded-md border p-2">
                                            <Label className="mb-0">Active</Label>
                                            <StatusToggle
                                                checked={newService.status === 'Active'}
                                                onChange={(v) => setNewService({ ...newService, status: v ? 'Active' : 'Inactive' })}
                                            />
                                        </div>
                                    </div>
                                    <Button variant="outline" onClick={addService} className="w-full">
                                        <Plus className="mr-2 h-4 w-4" /> Add Service
                                    </Button>
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setCurrent(empty)}>Reset</Button>
                            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                            <Button onClick={save}>Save Office</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* View Dialog */}
                <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle>{current.office_name}</DialogTitle>
                            <DialogDescription>Office details</DialogDescription>
                        </DialogHeader>
                        <dl className="grid grid-cols-2 gap-3 text-sm">
                            <dt className="text-muted-foreground">Office Code</dt><dd>{current.office_code}</dd>
                            <dt className="text-muted-foreground">Department</dt><dd>{deptById(current.department_id)?.department_name ?? '—'}</dd>
                            <dt className="text-muted-foreground">Type</dt><dd>{deptById(current.department_id)?.department_type ?? '—'}</dd>
                            <dt className="text-muted-foreground">Operating Hours</dt><dd>{current.operating_hrs}</dd>
                            <dt className="text-muted-foreground">Contact</dt><dd>{current.contact_no}</dd>
                            <dt className="text-muted-foreground">Email</dt><dd>{current.email}</dd>
                            <dt className="text-muted-foreground">Status</dt><dd><StatusBadge status={current.status} /></dd>
                            <dt className="text-muted-foreground">Services</dt><dd>{current.services.length}</dd>
                            <dt className="text-muted-foreground">QR Assigned</dt><dd>{current.qrAssigned ? 'Yes' : 'No'}</dd>
                        </dl>
                        {current.description && (
                            <p className="text-sm text-muted-foreground">{current.description}</p>
                        )}
                        <DialogFooter>
                            <Button onClick={() => setViewOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* QR Dialog — Table 15. QR Codes */}
                <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                    <DialogContent className="bg-white">
                        <DialogHeader>
                            <DialogTitle>Generate QR Code</DialogTitle>
                            <DialogDescription>Create and assign a new QR code for {current.office_name}.</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center gap-3 py-4">
                            <div className="grid h-40 w-40 grid-cols-8 grid-rows-8 gap-0.5 rounded border bg-white p-2">
                                {Array.from({ length: 64 }).map((_, i) => (
                                    <div key={i} className={(i * 7 + (current.office_name.length || 1)) % 3 === 0 ? 'bg-gray-900' : 'bg-transparent'} />
                                ))}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                DAVANAV-{current.office_code || current.office_name.toUpperCase().replace(/\s+/g, '-').slice(0, 14)}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setQrOpen(false)}>Cancel</Button>
                            <Button onClick={() => generateQr(current)}>Generate & Assign</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Route / Travel Info Dialog —
                    Table 16. Navigation Routes for Internal offices,
                    Table 13. External Office for External offices (Section B branch) */}
                <Dialog open={routeOpen} onOpenChange={setRouteOpen}>
                    <DialogContent className="bg-white">
                        {isExternal(current) ? (
                            <>
                                <DialogHeader>
                                    <DialogTitle>Travel Info</DialogTitle>
                                    <DialogDescription>
                                        {current.office_name} is outside City Hall — text-based guidance only, no indoor route.
                                    </DialogDescription>
                                </DialogHeader>
                                <dl className="space-y-2 text-sm">
                                    <dt className="text-muted-foreground">Address</dt>
                                    <dd>{current.externalOffice?.office_address || '—'}</dd>
                                    <dt className="text-muted-foreground">How to Get There</dt>
                                    <dd>{current.externalOffice?.jeepney_routes || '—'}</dd>
                                    <dt className="text-muted-foreground">Transportation Notes</dt>
                                    <dd>{current.externalOffice?.transportation_notes || '—'}</dd>
                                    <dt className="text-muted-foreground">Nearest Landmark</dt>
                                    <dd>{current.externalOffice?.nearest_landmark || '—'}</dd>
                                </dl>
                            </>
                        ) : (
                            <>
                                <DialogHeader>
                                    <DialogTitle>Get Navigation Map</DialogTitle>
                                    <DialogDescription>Route from Main Entrance to {current.office_name}.</DialogDescription>
                                </DialogHeader>
                                <dl className="mb-2 grid grid-cols-2 gap-2 text-sm">
                                    <dt className="text-muted-foreground">From</dt><dd>Main Entrance</dd>
                                    <dt className="text-muted-foreground">Destination Office</dt><dd>{current.office_name}</dd>
                                    <dt className="text-muted-foreground">Floor</dt><dd>{current.floor}</dd>
                                    <dt className="text-muted-foreground">Estimated Walking Time</dt><dd>~4 mins</dd>
                                </dl>
                                <ol className="space-y-2 text-sm">
                                    <li>1. Enter through Main Entrance.</li>
                                    <li>2. Walk straight to Lobby Center.</li>
                                    <li>3. Take Elevator A to {current.floor}.</li>
                                    <li>4. Turn right into the corridor.</li>
                                    <li>5. Arrive at Room {current.room} — {current.office_name}.</li>
                                </ol>
                            </>
                        )}
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
                                This will permanently remove "{delTarget?.office_name}". This action cannot be undone.
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