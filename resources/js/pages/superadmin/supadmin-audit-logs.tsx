import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Download, Search, ShieldAlert, LogIn, Pencil, Trash2, PlusCircle, KeyRound } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { SuperadminShell } from '@/components/superadmin/superadmin-shell';

type AuditAction = 'Login' | 'Create' | 'Update' | 'Delete' | 'Password Reset';

interface AuditLogEntry {
	id: number;
	admin: string;
	email: string;
	action: AuditAction;
	target: string;
	ip_address: string;
	timestamp: string;
}

const actionMeta: Record<AuditAction, { icon: typeof LogIn; className: string }> = {
	Login: { icon: LogIn, className: ' text-blue-700' },
	Create: { icon: PlusCircle, className: 'text-green-700' },
	Update: { icon: Pencil, className: ' text-amber-700' },
	Delete: { icon: Trash2, className: 'text-red-700' },
	'Password Reset': { icon: KeyRound, className: ' text-purple-700' },
};

// Replace with data passed down from the controller, e.g. via `usePage().props.logs`
const auditLogs: AuditLogEntry[] = [
	{ id: 1, admin: 'Maria Santos', email: 'maria.santos@davao.gov.ph', action: 'Login', target: 'Admin Session', ip_address: '203.177.42.10', timestamp: '2026-07-16 08:12:03' },
	{ id: 2, admin: 'Jerome Dizon', email: 'jerome.dizon@davao.gov.ph', action: 'Create', target: 'Office: Business Permits and Licensing', ip_address: '203.177.42.18', timestamp: '2026-07-16 08:40:51' },
	{ id: 3, admin: 'Ana Reyes', email: 'ana.reyes@davao.gov.ph', action: 'Update', target: 'Department: City Treasurer\u2019s Office', ip_address: '112.198.88.5', timestamp: '2026-07-15 16:22:14' },
	{ id: 4, admin: 'Maria Santos', email: 'maria.santos@davao.gov.ph', action: 'Delete', target: 'QR Code: OFF-0042', ip_address: '203.177.42.10', timestamp: '2026-07-15 14:05:37' },
	{ id: 5, admin: 'Paolo Cruz', email: 'paolo.cruz@davao.gov.ph', action: 'Password Reset', target: 'Admin Account: Ana Reyes', ip_address: '180.190.12.44', timestamp: '2026-07-14 09:58:22' },
	{ id: 6, admin: 'Jerome Dizon', email: 'jerome.dizon@davao.gov.ph', action: 'Update', target: 'Floor Map: Building A - 2nd Floor', ip_address: '203.177.42.18', timestamp: '2026-07-13 11:30:09' },
];

const actionFilters = ['All', 'Login', 'Create', 'Update', 'Delete', 'Password Reset'] as const;

export default function AuditLogs() {
	const [search, setSearch] = useState('');
	const [actionFilter, setActionFilter] = useState<(typeof actionFilters)[number]>('All');

	const filteredLogs = useMemo(() => {
		return auditLogs.filter((log) => {
			const matchesAction = actionFilter === 'All' || log.action === actionFilter;
			const query = search.trim().toLowerCase();
			const matchesSearch =
				query.length === 0 ||
				log.admin.toLowerCase().includes(query) ||
				log.email.toLowerCase().includes(query) ||
				log.target.toLowerCase().includes(query) ||
				log.ip_address.includes(query);
			return matchesAction && matchesSearch;
		});
	}, [search, actionFilter]);

	return (
		<>
			<Head title="Superadmin — Audit Logs" />
			<SuperadminShell
				title="Audit Logs"
				description="Review a record of admin actions across the DavaNav system, including logins, edits, and deletions."
				actions={
					<div className="flex gap-2">
						
						<Button variant="outline">
							<Download className="mr-2 h-4 w-4" /> Export CSV
						</Button>
					</div>
				}
			>
				<Card>
					<CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<CardTitle>Activity history</CardTitle>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
							<div className="relative">
								<Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
								<Input
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder="Search admin, target, or IP"
									className="pl-8 sm:w-64"
								/>
							</div>
							<Select value={actionFilter} onValueChange={(value) => setActionFilter(value as typeof actionFilter)}>
								<SelectTrigger className="sm:w-40">
									<SelectValue placeholder="Action" />
								</SelectTrigger>
								<SelectContent>
									{actionFilters.map((action) => (
										<SelectItem key={action} value={action}>
											{action}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto rounded-lg border border-gray-200">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Admin</TableHead>
										<TableHead>Action</TableHead>
										<TableHead>Target</TableHead>
										<TableHead>IP Address</TableHead>
										<TableHead>Timestamp</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredLogs.length === 0 && (
										<TableRow>
											<TableCell colSpan={5} className="py-8 text-center text-sm text-gray-500">
												No matching audit log entries.
											</TableCell>
										</TableRow>
									)}
									{filteredLogs.map((log) => {
										const meta = actionMeta[log.action];
										const Icon = meta.icon;
										return (
											<TableRow key={log.id}>
												<TableCell>
													<div className="font-medium text-gray-900">{log.admin}</div>
													<div className="text-xs text-gray-500">{log.email}</div>
												</TableCell>
												<TableCell>
													<Badge variant="outline" className={meta.className}>
														<Icon className="mr-1 h-3.5 w-3.5" />
														{log.action}
													</Badge>
												</TableCell>
												<TableCell className="text-sm text-gray-700">{log.target}</TableCell>
												<TableCell className="font-mono text-sm text-gray-600">{log.ip_address}</TableCell>
												<TableCell className="text-sm text-gray-500">{log.timestamp}</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>

				<Card className="mt-4 border-amber-200 bg-amber-50/50">
					<CardContent className="flex items-start gap-3 py-4">
						<ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
						<p className="text-sm text-amber-800">
							Audit logs are retained for compliance and security review. Deleting or exporting logs does not remove
							the underlying records used for analytics on the Admin and Analytics Dashboards.
						</p>
					</CardContent>
				</Card>
			</SuperadminShell>
		</>
	);
}