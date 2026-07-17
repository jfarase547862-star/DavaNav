import { Head, Link } from '@inertiajs/react';
import { Activity, BarChart3 } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SuperadminShell } from '@/components/superadmin/superadmin-shell';

const metrics = [
	{ label: 'Response time', value: '220ms', trend: 'Stable' },
	{ label: 'Page load', value: '1.4s', trend: 'Improving' },
	{ label: 'CPU usage', value: '55%', trend: 'Normal' },
	{ label: 'Memory use', value: '4.2 GB', trend: 'Stable' },
];

export default function Performance() {
	return (
		<>
			<Head title="Superadmin — Performance" />
			<SuperadminShell
				title="Performance"
				description="Review key performance metrics and recent system load trends."
				
			>
				<div className="grid gap-4 lg:grid-cols-4">
					{metrics.map((metric) => (
						<Card key={metric.label}>
							<CardContent className="p-5">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
										<Activity className="h-5 w-5 text-blue-600" />
									</div>
									<div className="text-sm text-gray-500">{metric.label}</div>
								</div>
								<div className="mt-3 text-right text-2xl font-semibold text-gray-900">
									{metric.value}
								</div>
								<div className="mt-2 text-right text-sm text-gray-500">
									Trend: {metric.trend}
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<Card className="mt-4">
					<CardHeader>
						<CardTitle>Performance summary</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
							<div className="flex items-center justify-between gap-4">
								<div>
									<p className="text-sm text-gray-500">System load is stable. Recent traffic is within normal bounds.</p>
								</div>
								<Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
									Good
								</Badge>
							</div>
						</div>
						<div className="grid gap-3 sm:grid-cols-2">
							<Button variant="outline" asChild>
								<Link href="/superadmin/dashboard">View dashboard</Link>
							</Button>
							<Button variant="outline" asChild>
								<Link href="/superadmin/backup-recovery">Manage backups</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</SuperadminShell>
		</>
	);
}