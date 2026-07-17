import { Head, Link } from '@inertiajs/react';
import { CloudRain, GitBranch, Layers, Clock } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SuperadminShell } from '@/components/superadmin/superadmin-shell';

const deployments = [
	{ id: 1, version: 'v2.4.1', environment: 'Production', status: 'Success', when: '12 mins ago' },
	{ id: 2, version: 'v2.4.0', environment: 'Staging', status: 'Success', when: '1 day ago' },
	{ id: 3, version: 'v2.3.8', environment: 'Production', status: 'Failed', when: '3 days ago' },
];

export default function Deployment() {
	return (
		<>
			<Head title="Superadmin — Deployment" />
			<SuperadminShell
				title="Deployment"
				description="Monitor deployment activity, history, and release readiness for the system."
				actions={
					<Button asChild>
						<Link href="/superadmin/backup-recovery">
							<CloudRain className="mr-2 h-4 w-4" /> Start Backup
						</Link>
					</Button>
				}
			>


				<Card className="mt-4">
					<CardHeader>
						<CardTitle>Deployment history</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="min-w-full divide-y divide-gray-200 text-sm">
								<thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
									<tr>
										<th className="px-4 py-3">Version</th>
										<th className="px-4 py-3">Environment</th>
										<th className="px-4 py-3">Status</th>
										<th className="px-4 py-3">When</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100 bg-white">
									{deployments.map((item) => (
										<tr key={item.id}>
											<td className="px-4 py-3 font-medium text-gray-900">{item.version}</td>
											<td className="px-4 py-3 text-gray-600">{item.environment}</td>
											<td className="px-4 py-3">
												<Badge variant="outline" className={item.status === 'Success' ? 'text-green-700' : 'text-red-700'}>
													{item.status}
												</Badge>
											</td>
											<td className="px-4 py-3 text-gray-600">{item.when}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</SuperadminShell>
		</>
	);
}