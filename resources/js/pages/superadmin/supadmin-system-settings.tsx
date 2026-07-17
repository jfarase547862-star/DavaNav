import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, Cog, Server, SlidersHorizontal, BarChart3 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SuperadminShell } from '@/components/superadmin/superadmin-shell';

const settingsItems = [
	{ id: 1, name: 'Authentication Policy', description: 'Require multi-factor authentication for all admins.', status: 'Enabled' },
	{ id: 2, name: 'Email Deliverability', description: 'Notification email gateway configuration.', status: 'Healthy' },
	{ id: 3, name: 'Access Controls', description: 'Role-based permissions and admin approval flows.', status: 'Configured' },
	{ id: 4, name: 'System Alerts', description: 'Monitoring and alert delivery settings.', status: 'Active' },
];


export default function SystemSettings() {
	return (
		<>
			<Head title="Superadmin — System Settings" />
			<SuperadminShell
				title="System Settings"
				description="Configure system-wide policies, alerts, and security settings for the superadmin console."
				actions={
					<Button variant="outline" asChild>
						<Link href="/superadmin/audit-logs">
							<BarChart3 className="mr-2 h-4 w-4" /> Audit Logs
						</Link>
					</Button>
				}
			>
				<div className="grid gap-4 lg:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>System health</CardTitle>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
							{[
								{ label: 'Security', value: 'Strong', icon: ShieldCheck },
								{ label: 'Performance', value: 'Optimal', icon: Cog },
								{ label: 'Uptime', value: '99.9%', icon: Server },
								{ label: 'Policy Status', value: 'Enforced', icon: SlidersHorizontal },
							].map((item) => {
								const Icon = item.icon;
								return (
									<div key={item.label} className="rounded-lg border border-gray-200 p-4">
										<div className="flex items-center gap-3">
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
												<Icon className="h-5 w-5 text-blue-600" />
											</div>
											<div className="text-sm text-gray-500">{item.label}</div>
										</div>
										<div className="mt-3 text-right text-2xl font-semibold text-gray-900">
											{item.value}
										</div>
									</div>
								);
							})}
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Active policies</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{settingsItems.map((item) => (
								<div key={item.id} className="rounded-xl border border-gray-200 p-4">
									<div className="flex items-center justify-between gap-3">
										<div>
											<h3 className="font-semibold text-gray-900">{item.name}</h3>
											<p className="text-sm text-gray-500">{item.description}</p>
										</div>
										<Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
											{item.status}
										</Badge>
									</div>
								</div>
							))}
						</CardContent>
					</Card>
				</div>
			</SuperadminShell>
		</>
	);
}