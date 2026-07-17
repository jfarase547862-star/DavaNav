import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Link2, Eye, Save, Unlink, MoreVertical } from 'lucide-react';
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
import { useAdminStore, setState, id } from '@/lib/admin-store';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import type { NavNode } from '@/lib/mock-data';

const empty: NavNode = { id: '', label: '', type: 'Hallway', floor: '1F', connections: [] };



export default function NodesPage() {
    const nodes = useAdminStore((s) => s.nodes);
    const [floorFilter, setFloorFilter] = useState('all');
    const [editOpen, setEditOpen] = useState(false);
    const [current, setCurrent] = useState<NavNode>(empty);
    const [delTarget, setDelTarget] = useState<NavNode | null>(null);
    const [connectOpen, setConnectOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    const filtered = useMemo(
        () => floorFilter === 'all' ? nodes : nodes.filter((n) => n.floor === floorFilter),
        [nodes, floorFilter]
    );

    function save() {
        if (!current.label.trim()) { toast.error('Label is required'); return; }
        setState((s) => current.id
            ? { ...s, nodes: s.nodes.map((n) => n.id === current.id ? current : n) }
            : { ...s, nodes: [...s.nodes, { ...current, id: id() }] });
        toast.success(current.id ? 'Node updated' : 'Node created');
        setEditOpen(false);
    }

    function del() {
        if (!delTarget) return;
        setState((s) => ({
            ...s,
            nodes: s.nodes
                .filter((n) => n.id !== delTarget.id)
                .map((n) => ({ ...n, connections: n.connections.filter((c) => c !== delTarget.id) })),
        }));
        toast.success('Node deleted');
        setDelTarget(null);
    }

    function disconnect(from: NavNode, toId: string) {
        setState((s) => ({
            ...s,
            nodes: s.nodes.map((n) =>
                n.id === from.id ? { ...n, connections: n.connections.filter((c) => c !== toId) } :
                n.id === toId   ? { ...n, connections: n.connections.filter((c) => c !== from.id) } : n
            ),
        }));
        toast.success('Connection removed');
    }

    function connectTo(toId: string) {
        if (!current.id || toId === current.id) return;
        setState((s) => ({
            ...s,
            nodes: s.nodes.map((n) =>
                n.id === current.id ? { ...n, connections: Array.from(new Set([...n.connections, toId])) } :
                n.id === toId       ? { ...n, connections: Array.from(new Set([...n.connections, current.id])) } : n
            ),
        }));
        toast.success('Nodes connected');
    }

    const labelOf = (nid: string) => nodes.find((n) => n.id === nid)?.label ?? '—';

    return (
        <>
            <Head title="Navigation Nodes — DavaNav Admin" />
            <AdminShell
                title="Navigation Nodes"
                description="Define hallways, stairs, elevators, exits, and the connections between them."
                breadcrumbs={[{ label: 'Navigation Nodes' }]}
                actions={
                    <>
                        <Button variant="outline" onClick={() => setPreviewOpen(true)}>
                            <Eye className="mr-2 h-4 w-4" /> Preview Route
                        </Button>
                        <Button variant="outline" onClick={() => toast.success('Changes saved')}>
                            <Save className="mr-2 h-4 w-4" /> Save Changes
                        </Button>
                        <Button onClick={() => { setCurrent(empty); setEditOpen(true); }}>
                            <Plus className="mr-2 h-4 w-4" /> Create Node
                        </Button>
                    </>
                }
            >
                {/* Full-height container — matches floor-maps layout */}
                <div
                    className="flex flex-col"
                    style={{ height: 'calc(100vh - 160px)', minHeight: 600 }}
                >
                    <Card className="flex flex-col flex-1 min-h-0 overflow-hidden p-0">
                        {/* Toolbar */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b shrink-0">
                            <Select value={floorFilter} onValueChange={setFloorFilter}>
                                <SelectTrigger className="w-36">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All floors</SelectItem>
                                    <SelectItem value="1F">1F</SelectItem>
                                    <SelectItem value="2F">2F</SelectItem>
                                    <SelectItem value="3F">3F</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className="text-xs text-gray-400 ml-1">
                                {filtered.length} node{filtered.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        {/* Scrollable table — fills all remaining card height */}
                        <div className="flex-1 overflow-auto min-h-0">
                            <Table>
                                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                                    <TableRow>
                                        <TableHead>Label</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Floor</TableHead>
                                        <TableHead>Connections</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-16 text-center text-gray-400">
                                                No nodes found. Create one to get started.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {filtered.map((n) => (
                                        <TableRow key={n.id}>
                                            <TableCell className="font-medium">{n.label}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{n.type}</Badge>
                                            </TableCell>
                                            <TableCell>{n.floor}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {n.connections.length === 0 && (
                                                        <span className="text-xs text-gray-400">—</span>
                                                    )}
                                                    {n.connections.map((c) => (
                                                        <Badge key={c} variant="secondary" className="gap-1">
                                                            {labelOf(c)}
                                                            <button
                                                                onClick={() => disconnect(n, c)}
                                                                className="rounded hover:text-red-500"
                                                                title="Disconnect"
                                                            >
                                                                <Unlink className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => { setCurrent(n); setEditOpen(true); }}>
                                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => { setCurrent(n); setConnectOpen(true); }}>
                                                            <Link2 className="mr-2 h-4 w-4" /> Connect
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => setDelTarget(n)}
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
                    </Card>
                </div>

                {/* ── Dialogs ── */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{current.id ? 'Edit Node' : 'Create Node'}</DialogTitle>
                            <DialogDescription>Define node location and type.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3">
                            <div className="space-y-1">
                                <Label>Label *</Label>
                                <Input
                                    value={current.label}
                                    onChange={(e) => setCurrent({ ...current, label: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label>Type</Label>
                                    <Select
                                        value={current.type}
                                        onValueChange={(v) => setCurrent({ ...current, type: v as NavNode['type'] })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['Hallway', 'Staircase', 'Elevator', 'Emergency Exit', 'Office'].map((t) => (
                                                <SelectItem key={t} value={t}>{t}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1">
                                    <Label>Floor</Label>
                                    <Select
                                        value={current.floor}
                                        onValueChange={(v) => setCurrent({ ...current, floor: v })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1F">1F</SelectItem>
                                            <SelectItem value="2F">2F</SelectItem>
                                            <SelectItem value="3F">3F</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                            <Button onClick={save}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={connectOpen} onOpenChange={setConnectOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Connect "{current.label}"</DialogTitle>
                            <DialogDescription>Select a node to connect.</DialogDescription>
                        </DialogHeader>
                        <div className="max-h-72 space-y-1 overflow-y-auto">
                            {nodes.filter((n) => n.id !== current.id).map((n) => {
                                const connected = current.connections.includes(n.id);
                                return (
                                    <button
                                        key={n.id}
                                        onClick={() => connected ? disconnect(current, n.id) : connectTo(n.id)}
                                        className="flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                                    >
                                        <span>
                                            {n.label}{' '}
                                            <span className="text-xs text-gray-400">({n.type}, {n.floor})</span>
                                        </span>
                                        {connected
                                            ? <Badge>Connected</Badge>
                                            : <Badge variant="outline">Connect</Badge>}
                                    </button>
                                );
                            })}
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setConnectOpen(false)}>Done</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Route Preview</DialogTitle>
                            <DialogDescription>Sample computed route through the graph.</DialogDescription>
                        </DialogHeader>
                        <ol className="space-y-1 text-sm">
                            {nodes.slice(0, 5).map((n, i) => (
                                <li key={n.id}>
                                    {i + 1}. {n.label}{' '}
                                    <span className="text-xs text-gray-400">({n.floor})</span>
                                </li>
                            ))}
                        </ol>
                        <DialogFooter>
                            <Button onClick={() => setPreviewOpen(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <ConfirmDialog
                    open={!!delTarget}
                    onOpenChange={(o) => !o && setDelTarget(null)}
                    title="Delete node?"
                    description={`Remove "${delTarget?.label}" and all its connections.`}
                    confirmText="Delete"
                    destructive
                    onConfirm={del}
                />
            </AdminShell>
        </>
    );
}