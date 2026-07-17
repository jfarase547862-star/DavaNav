import { Head, Link } from '@inertiajs/react';
import { Database, RefreshCcw, ShieldCheck, Clock } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SuperadminShell } from '@/components/superadmin/superadmin-shell';

type BackupStatus = 'Completed' | 'Failed';

interface BackupEntry {
	id: number;
	name: string;
	created: string;
	status: BackupStatus;
}

// Replace with data passed down from the controller, e.g. via `usePage().props.backups`
const backups: BackupEntry[] = [
	{ id: 1, name: 'Daily backup', created: 'Today, 3:12 AM', status: 'Completed' },
	{ id: 2, name: 'Weekly snapshot', created: 'Sunday, 12:00 AM', status: 'Completed' },
	{ id: 3, name: 'Pre-release backup', created: 'Yesterday, 9:45 PM', status: 'Completed' },
];

const stats = [
	{ label: 'Last backup', value: 'Today, 3:12 AM', icon: Clock },
	{ label: 'Total backups', value: '18', icon: Database },
	{ label: 'Recovery status', value: 'Ready', icon: ShieldCheck },
];

export default function BackupRecovery() {
	return (
		<>
			<Head title="Superadmin — Backup & Recovery" />
			<SuperadminShell
				title="Backup & Recovery"
				description="Manage backups, restore points, and recovery operations for the system database."
				actions={
					<Button>
						<RefreshCcw className="mr-2 h-4 w-4" /> Create Backup
					</Button>
				}
			>
				<div className="grid gap-4 lg:grid-cols-3">
					{stats.map((item) => {
						const Icon = item.icon;
						return (
							<Card key={item.label}>
								<CardContent className="flex flex-col gap-6 py-5">
									<div className="flex items-center justify-between">
										<span className="text-xs uppercase text-gray-500">{item.label}</span>
										<Icon className="h-5 w-5 text-emerald-600" />
									</div>
									<div className="text-right text-2xl font-semibold text-gray-900">{item.value}</div>
								</CardContent>
							</Card>
						);
					})}
				</div>

				<Card className="mt-4">
					<CardHeader>
						<CardTitle>Backup history</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{backups.map((backup) => (
								<div key={backup.id} className="rounded-xl border border-gray-200 p-4">
									<div className="flex items-center justify-between gap-3">
										<div>
											<div className="font-medium text-gray-900">{backup.name}</div>
											<div className="text-sm text-gray-500">{backup.created}</div>
										</div>
										<Badge
											variant="outline"
											className={
												backup.status === 'Completed'
													? 'border-green-200 bg-green-50 text-green-700'
													: 'border-red-200 bg-red-50 text-red-700'
											}
										>
											{backup.status}
										</Badge>
									</div>
								</div>
							))}
						</div>
						
					</CardContent>
				</Card>
			</SuperadminShell>
		</>
	);
}