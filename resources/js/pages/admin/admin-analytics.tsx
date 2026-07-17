import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TrendingUp, QrCode, MapPin, Clock } from 'lucide-react';
import {
    Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
    ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';


// ── Types ─────────────────────────────────────────────────────────────────────

interface ChartDef {
    title: string;
    data: Record<string, unknown>[];
    key: string;
    x: string;
    type: 'bar' | 'line' | 'pie';
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const dailyVisitors = [
    { day: 'Mon', visitors: 220 }, { day: 'Tue', visitors: 248 },
    { day: 'Wed', visitors: 195 }, { day: 'Thu', visitors: 270 },
    { day: 'Fri', visitors: 312 }, { day: 'Sat', visitors: 88  }, { day: 'Sun', visitors: 42  },
];

const monthlyVisitors = [
    { month: 'Jan', visitors: 4200 }, { month: 'Feb', visitors: 3980 },
    { month: 'Mar', visitors: 5120 }, { month: 'Apr', visitors: 4760 },
    { month: 'May', visitors: 5340 }, { month: 'Jun', visitors: 5810 },
];

const VISITOR_PERIODS = [
    { value: 'daily',   label: 'Daily',   data: dailyVisitors,   x: 'day',   type: 'bar'  as const },
    { value: 'monthly', label: 'Monthly', data: monthlyVisitors, x: 'month', type: 'bar' as const },
];

const popularDepartments = [
    { name: "Treasurer's",    value: 32 }, { name: 'Business Bureau', value: 22 },
    { name: 'Civil Registrar', value: 18 }, { name: 'Engineering',     value: 14 },
    { name: "Mayor's",         value: 8  }, { name: 'Others',          value: 6  },
];

const peakHours = [
    { hour: '8AM',  scans: 45 }, { hour: '9AM',  scans: 82 }, { hour: '10AM', scans: 96 },
    { hour: '11AM', scans: 78 }, { hour: '12PM', scans: 40 }, { hour: '1PM',  scans: 55 },
    { hour: '2PM',  scans: 88 }, { hour: '3PM',  scans: 72 }, { hour: '4PM',  scans: 59 },
];

const topOffices = [
    { name: 'Civil Registry',       visits: 180 },
    { name: 'Treasury',             visits: 158 },
    { name: 'Business Permits',     visits: 136 },
    { name: "Assessor's",           visits: 114 },
    { name: 'City Health',          visits: 92  },
];

const qrTrend = [
    { name: 'Main Entrance',      scans: 412 },
    { name: 'Ground Floor Lobby', scans: 305 },
    { name: 'Treasurer Office',   scans: 198 },
    { name: 'Mayor Office',       scans: 142 },
    { name: 'Engineering Office', scans: 121 },
];

const navReqs = [
    { week: 'W1', requests: 412 }, { week: 'W2', requests: 489 },
    { week: 'W3', requests: 521 }, { week: 'W4', requests: 605 },
];

const STAT_CARDS = [
    { label: 'Visitors Today', value: '248',         icon: TrendingUp, color: 'text-blue-600 bg-blue-100' },
    { label: 'QR Scans',       value: '615',         icon: QrCode,     color: 'text-blue-600 bg-blue-100' },
    { label: 'Most Visited',   value: "Treasurer's", icon: MapPin,     color: 'text-blue-600 bg-blue-100' },
    { label: 'Avg. Nav Time',  value: '2m 35s',      icon: Clock,      color: 'text-blue-600 bg-blue-100' },
];

const COLORS = [
    'var(--primary)', 'var(--gold)', 'var(--chart-3)',
    'var(--chart-4)', 'var(--chart-5)', 'oklch(0.55 0.05 250)',
];

// Charts other than Visitors, which now gets its own dedicated card with a period filter.
const CHARTS: ChartDef[] = [
    { title: 'Popular Departments',   data: popularDepartments,  key: 'value',    x: 'name',    type: 'pie'  },
    { title: 'Most Visited Offices',  data: topOffices,          key: 'visits',   x: 'name',    type: 'bar'  },
    { title: 'Navigation Requests',   data: navReqs,             key: 'requests', x: 'week',    type: 'line' },
    { title: 'QR Scan Trends',        data: qrTrend,             key: 'scans',    x: 'name',    type: 'bar'  },
    { title: 'Peak Hours',            data: peakHours,           key: 'scans',    x: 'hour',    type: 'bar'  },
];

const tooltipStyle = {
    background: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: 8,
    padding: '8px 12px',
    color: '#1f2937',
    fontSize: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
};

// ── Shared chart renderer ─────────────────────────────────────────────────────

function renderChart(c: ChartDef) {
    if (c.type === 'bar') {
        return (
            <BarChart data={c.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey={c.x} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey={c.key} fill="var(--primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
        );
    }
    if (c.type === 'line') {
        return (
            <LineChart data={c.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey={c.x} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis fontSize={11} stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                    type="monotone" dataKey={c.key}
                    stroke="var(--gold)" strokeWidth={2}
                    dot={{ fill: 'var(--gold)' }}
                />
            </LineChart>
        );
    }
    return (
        <PieChart>
            <Pie data={c.data} dataKey={c.key} nameKey={c.x} cx="50%" cy="50%" outerRadius={80} label>
                {c.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
        </PieChart>
    );
}

function ChartCard({ chart, onOpen }: { chart: ChartDef; onOpen: () => void }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">{chart.title}</CardTitle>
                <Button size="sm" variant="ghost" onClick={onOpen}>Drill down →</Button>
            </CardHeader>
            <CardContent>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart(chart)}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

// ── Visitors card with period filter ──────────────────────────────────────────

function VisitorsChartCard({ onOpen }: { onOpen: (chart: ChartDef) => void }) {
    const [period, setPeriod] = useState<'daily' | 'monthly'>('daily');
    const active = VISITOR_PERIODS.find((p) => p.value === period)!;

    const chart: ChartDef = {
        title: `${active.label} Visitors`,
        data: active.data,
        key: 'visitors',
        x: active.x,
        type: active.type,
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Visitors</CardTitle>
                <div className="flex items-center gap-1">
                    <div className="flex rounded-md border border-border p-0.5">
                        {VISITOR_PERIODS.map((p) => (
                            <button
                                key={p.value}
                                onClick={() => setPeriod(p.value as 'daily' | 'monthly')}
                                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    period === p.value
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => onOpen(chart)}>Drill down →</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart(chart)}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
    const [drill, setDrill] = useState<ChartDef | null>(null);

    return (
        <>
            <Head title="Analytics — DavaNav Admin" />
            <AdminShell
                title="Analytics Dashboard"
                description="Visitor traffic, navigation usage, and QR insights."
                breadcrumbs={[{ label: 'Analytics' }]}
            >


                {/* Tabs */}
                <Tabs defaultValue="visitors">
                    <TabsList>
                        <TabsTrigger value="visitors">Visitors</TabsTrigger>
                        <TabsTrigger value="qr">QR & Navigation</TabsTrigger>
                        <TabsTrigger value="behavior">Behavior</TabsTrigger>
                    </TabsList>

                    <TabsContent value="visitors" className="mt-4">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <VisitorsChartCard onOpen={(c) => setDrill(c)} />
                            <ChartCard chart={CHARTS[0]} onOpen={() => setDrill(CHARTS[0])} />
                        </div>
                    </TabsContent>

                    <TabsContent value="qr" className="mt-4">
                        <div className="grid gap-4 lg:grid-cols-2">
                            {CHARTS.slice(1, 4).map((c) => (
                                <ChartCard key={c.title} chart={c} onOpen={() => setDrill(c)} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="behavior" className="mt-4">
                        <div className="grid gap-4 lg:grid-cols-2">
                            <ChartCard chart={CHARTS[4]} onOpen={() => setDrill(CHARTS[4])} />
                            <Card>
                                <CardHeader><CardTitle>Average Navigation Time</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="flex flex-col items-center gap-2 py-6">
                                        <div className="text-5xl font-bold text-primary">2m 35s</div>
                                        <div className="text-sm text-gray-400">
                                            across 615 navigation sessions this week
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Drill-down dialog */}
                <Dialog open={!!drill} onOpenChange={(o) => !o && setDrill(null)}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>{drill?.title}</DialogTitle>
                            <DialogDescription>Detailed breakdown</DialogDescription>
                        </DialogHeader>
                        {drill && (
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    {renderChart(drill)}
                                </ResponsiveContainer>
                            </div>
                        )}
                        <DialogFooter>
                            <Button onClick={() => setDrill(null)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </AdminShell>
        </>
    );
}