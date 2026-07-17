import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Users, Plus, ShieldCheck, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SuperadminShell } from '@/components/superadmin/superadmin-shell';

interface AdminAccount {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

const adminAccounts: AdminAccount[] = [
    { id: 1, name: 'Aileen Cruz', email: 'aileen@davanav.gov', role: 'Administrator', status: 'Active' },
    { id: 2, name: 'Rafael Santos', email: 'rafael@davanav.gov', role: 'Administrator', status: 'Inactive' },
    { id: 3, name: 'Maya Delos', email: 'maya@davanav.gov', role: 'Administrator', status: 'Active' },
    { id: 4, name: 'Noel Reyes', email: 'noel@davanav.gov', role: 'Administrator', status: 'Pending' },
];

function statusBadgeClass(status: string) {
    if (status === 'Active') return ' text-green-700 ';
    if (status === 'Inactive') return ' text-gray-500';
    return 'text-yellow-700';
}

export default function AdminAccounts() {
    const [selected, setSelected] = useState<AdminAccount | null>(null);

    return (
        <>
            <Head title="Superadmin — Admin Accounts" />
            <SuperadminShell
                title="Admin Accounts"
                description="Manage administrators who have access to the City Hall navigation system."
                actions={
                    <Button asChild>
                        <Link href="/superadmin/supadmin-users">
                            <Plus className="mr-2 h-4 w-4" /> Invite Admin
                        </Link>
                    </Button>
                }
            >
                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Administrator roster</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead>
                                        <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Email</th>
                                            <th className="px-4 py-3">Role</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {adminAccounts.map((account) => (
                                            <tr key={account.id}>
                                                <td className="px-4 py-3 font-medium text-gray-900">{account.name}</td>
                                                <td className="px-4 py-3 text-gray-600">{account.email}</td>
                                                <td className="px-4 py-3 text-gray-600">{account.role}</td>
                                                <td className="px-4 py-3">
                                                    <Badge variant="outline" className={statusBadgeClass(account.status)}>
                                                        {account.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label={`View ${account.name}`}
                                                        onClick={() => setSelected(account)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                    
                </div>

                {/* Account details dialog */}
                <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selected?.name}</DialogTitle>
                            <DialogDescription>Administrator account details</DialogDescription>
                        </DialogHeader>
                        {selected && (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Email</span>
                                    <span className="font-medium text-gray-900">{selected.email}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500">Role</span>
                                    <span className="font-medium text-gray-900">{selected.role}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <Badge variant="outline" className={statusBadgeClass(selected.status)}>
                                        {selected.status}
                                    </Badge>
                                </div>
                            </div>
                        )}
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                            <Button asChild>
                                <Link href="/superadmin/supadmin-users">Manage in Users</Link>
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </SuperadminShell>
        </>
    );
}