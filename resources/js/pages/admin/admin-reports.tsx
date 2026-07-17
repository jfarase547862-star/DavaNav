import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
	Activity, QrCode, MonitorSmartphone, FileText, Download, Loader2, CalendarRange,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type ReportKind = 'system-usage' | 'qr-activity' | 'kiosk-interaction';
type ReportFormat = 'pdf' | 'csv';
type DateRange = '7d' | '30d' | '90d';

interface GeneratedReport {
	id: string;
	kind: ReportKind;
	format: ReportFormat;
	range: DateRange;
	generatedAt: Date;
}

interface ReportTypeDef {
	kind: ReportKind;
	title: string;
	description: string;
	icon: typeof Activity;
}

// ── Definitions ───────────────────────────────────────────────────────────────

const REPORT_TYPES: ReportTypeDef[] = [
	{
		kind: 'system-usage',
		title: 'System Usage',
		description: 'Admin logins, page views, and overall platform activity.',
		icon: Activity,
	},
	{
		kind: 'qr-activity',
		title: 'QR Code Scan Activity',
		description: 'Scan volume, top-performing codes, and location breakdowns.',
		icon: QrCode,
	},
	{
		kind: 'kiosk-interaction',
		title: 'Kiosk Interaction Analytics',
		description: 'Navigation requests, session duration, and kiosk touchpoints.',
		icon: MonitorSmartphone,
	},
];

const RANGE_LABELS: Record<DateRange, string> = {
	'7d': 'Last 7 days',
	'30d': 'Last 30 days',
	'90d': 'Last 90 days',
};

function reportTitle(kind: ReportKind) {
	return REPORT_TYPES.find((r) => r.kind === kind)?.title ?? kind;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ReportsPage() {
	const [range, setRange] = useState<DateRange>('30d');
	const [format, setFormat] = useState<ReportFormat>('pdf');
	const [generatingKind, setGeneratingKind] = useState<ReportKind | null>(null);
	const [reports, setReports] = useState<GeneratedReport[]>([
		{
			id: 'r-1001',
			kind: 'qr-activity',
			format: 'pdf',
			range: '30d',
			generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
		},
		{
			id: 'r-1000',
			kind: 'system-usage',
			format: 'csv',
			range: '7d',
			generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 74),
		},
	]);

	function handleGenerate(kind: ReportKind) {
		setGeneratingKind(kind);
		// Simulated report generation — replace with a real API call, e.g.
		// router.post('/admin/reports', { kind, range, format })
		setTimeout(() => {
			const newReport: GeneratedReport = {
				id: `r-${Math.floor(Math.random() * 9000 + 1000)}`,
				kind,
				format,
				range,
				generatedAt: new Date(),
			};
			setReports((prev) => [newReport, ...prev]);
			setGeneratingKind(null);
		}, 1400);
	}

	return (
		<>
			<Head title="Reports — DavaNav Admin" />
			<AdminShell
				title="Reports"
				description="Generate reports for system usage, QR code scan activity, and kiosk interaction analytics."
				breadcrumbs={[{ label: 'Reports' }]}
			>
				{/* Filters */}
				<Card className="mb-6">
					<CardContent className="flex flex-wrap items-center gap-4 p-4">
						<div className="flex items-center gap-2">
							<CalendarRange className="h-4 w-4 text-gray-400" />
							<span className="text-sm text-gray-500">Date range</span>
							<Select value={range} onValueChange={(v) => setRange(v as DateRange)}>
								<SelectTrigger className="w-36">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{(Object.keys(RANGE_LABELS) as DateRange[]).map((r) => (
										<SelectItem key={r} value={r}>{RANGE_LABELS[r]}</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex items-center gap-2">
							<FileText className="h-4 w-4 text-gray-400" />
							<span className="text-sm text-gray-500">Format</span>
							<Select value={format} onValueChange={(v) => setFormat(v as ReportFormat)}>
								<SelectTrigger className="w-28">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="pdf">PDF</SelectItem>
									<SelectItem value="csv">CSV</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Report type cards */}
				<div className="mb-6 grid gap-4 lg:grid-cols-3">
					{REPORT_TYPES.map((r) => {
						const Icon = r.icon;
						const isGenerating = generatingKind === r.kind;
						return (
							<Card key={r.kind}>
								<CardContent className="p-5">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
											<Icon className="h-5 w-5 text-blue-600" />
										</div>
										<h3 className="font-semibold text-gray-900">{r.title}</h3>
									</div>
									<p className="mt-3 text-sm text-gray-500">{r.description}</p>
									<Button
										className="mt-4 w-full"
										variant="outline"
										disabled={isGenerating}
										onClick={() => handleGenerate(r.kind)}
									>
										{isGenerating ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
											</>
										) : (
											<>
												<FileText className="mr-2 h-4 w-4" /> Generate report
											</>
										)}
									</Button>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* History */}
				<Card>
					<CardHeader>
						<CardTitle>Generated reports</CardTitle>
					</CardHeader>
					<CardContent>
						{reports.length === 0 ? (
							<p className="py-6 text-center text-sm text-gray-400">
								No reports generated yet.
							</p>
						) : (
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200 text-sm">
									<thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
										<tr>
											<th className="px-4 py-3">Report</th>
											<th className="px-4 py-3">Range</th>
											<th className="px-4 py-3">Format</th>
											<th className="px-4 py-3">Generated</th>
											<th className="px-4 py-3 text-right">Action</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100 bg-white">
										{reports.map((r) => (
											<tr key={r.id}>
												<td className="px-4 py-3 font-medium text-gray-900">
													{reportTitle(r.kind)}
												</td>
												<td className="px-4 py-3 text-gray-600">{RANGE_LABELS[r.range]}</td>
												<td className="px-4 py-3">
													<Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 uppercase">
														{r.format}
													</Badge>
												</td>
												<td className="px-4 py-3 text-gray-600">
													{r.generatedAt.toLocaleString()}
												</td>
												<td className="px-4 py-3 text-right">
													<Button size="sm" variant="ghost">
														<Download className="mr-1.5 h-3.5 w-3.5" /> Download
													</Button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</CardContent>
				</Card>
			</AdminShell>
		</>
	);
}