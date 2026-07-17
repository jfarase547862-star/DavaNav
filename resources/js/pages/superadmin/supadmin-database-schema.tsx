import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { Database, Columns, LayoutGrid, KeyRound, Search, RefreshCw } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { SuperadminShell } from '@/components/superadmin/superadmin-shell';

type SchemaStatus = 'Good' | 'Warning';

interface SchemaTable {
	id: number;
	number: number; // table number from the data dictionary, e.g. "8" for Users
	name: string;
	records: string;
	foreign_keys: number;
	updated: string;
	status: SchemaStatus;
}

// Replace with data passed down from the controller, e.g. via `usePage().props.tables`
const tables: SchemaTable[] = [
	{ id: 1, number: 8, name: 'User', records: '6', foreign_keys: 0, updated: '2 days ago', status: 'Good' },
	{ id: 2, number: 9, name: 'Building', records: '3', foreign_keys: 0, updated: '5 days ago', status: 'Good' },
	{ id: 3, number: 10, name: 'Departments', records: '18', foreign_keys: 0, updated: '1 day ago', status: 'Good' },
	{ id: 4, number: 11, name: 'Floors', records: '12', foreign_keys: 1, updated: '5 days ago', status: 'Good' },
	{ id: 5, number: 12, name: 'Offices', records: '42', foreign_keys: 1, updated: '1 hour ago', status: 'Good' },
	{ id: 6, number: 13, name: 'External Office', records: '9', foreign_keys: 1, updated: '3 days ago', status: 'Warning' },
	{ id: 7, number: 14, name: 'Services', records: '96', foreign_keys: 1, updated: '1 hour ago', status: 'Good' },
	{ id: 8, number: 15, name: 'QR Codes', records: '42', foreign_keys: 1, updated: '10 mins ago', status: 'Good' },
	{ id: 9, number: 16, name: 'Navigation Routes', records: '31', foreign_keys: 2, updated: '2 hours ago', status: 'Warning' },
	{ id: 10, number: 17, name: 'IP Address', records: '4,180', foreign_keys: 1, updated: '2 mins ago', status: 'Good' },
	{ id: 11, number: 18, name: 'Visitor Session', records: '3,904', foreign_keys: 0, updated: '2 mins ago', status: 'Good' },
	{ id: 12, number: 19, name: 'Scan Logs', records: '12,847', foreign_keys: 3, updated: '2 mins ago', status: 'Good' },
];

export default function DatabaseSchema() {
	const [search, setSearch] = useState('');

	const filteredTables = useMemo(() => {
		const query = search.trim().toLowerCase();
		if (!query) return tables;
		return tables.filter((table) => table.name.toLowerCase().includes(query));
	}, [search]);

	const indexedCount = tables.filter((t) => t.status === 'Good').length;
	const warningCount = tables.length - indexedCount;

	return (
		<>
			<Head title="Superadmin — Database Schema" />
			<SuperadminShell
				title="Database Schema"
				actions={
					<Button variant="outline">
						<RefreshCw className="mr-2 h-4 w-4" /> Run schema check
					</Button>
				}
			>

				<Card className="mt-4">
					<CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<CardTitle>Table health</CardTitle>
						<div className="relative">
							<Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
							<Input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search tables"
								className="pl-8 sm:w-56"
							/>
						</div>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto rounded-lg border border-gray-200">
							<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Table</TableHead>
											<TableHead>Records</TableHead>
											<TableHead>
												<span className="inline-flex items-center gap-1">
													<KeyRound className="h-3.5 w-3.5" /> FKs
												</span>
											</TableHead>
											<TableHead>Updated</TableHead>
											<TableHead>Status</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredTables.length === 0 && (
											<TableRow>
												<TableCell colSpan={5} className="py-8 text-center text-sm text-gray-500">
													No tables match “{search}”.
												</TableCell>
											</TableRow>
										)}
										{filteredTables.map((table) => (
											<TableRow key={table.id}>
												<TableCell className="font-medium text-gray-900">
													<span className="mr-1.5 text-xs text-gray-400">#{table.number}</span>
													{table.name}
												</TableCell>
												<TableCell className="text-gray-600">{table.records}</TableCell>
												<TableCell className="text-gray-600">{table.foreign_keys}</TableCell>
												<TableCell className="text-gray-600">{table.updated}</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className={
															table.status === 'Good'
																? 'text-green-700'
																: 'text-yellow-700'
														}
													>
														{table.status}
													</Badge>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</CardContent>
					</Card>
			</SuperadminShell>
		</>
	);
}