import { Head, Link } from '@inertiajs/react';
import {
    Building, QrCode, TrendingUp,
    Activity as ActivityIcon, MapPin, Plus, BarChart3,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminShell } from '@/components/admin/admin-shell';
import {
    Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

const stats = [
    {
        label: 'Total Departments', value: 8, icon: Building,
        color: 'text-blue-600 bg-blue-100', href: '/admin/admin-departments',
    },
    {
        label: 'Monthly Visitors', value: '5,810', icon: TrendingUp,
        color: 'text-blue-600 bg-blue-100', href: '/admin/admin-analytics',
    },
    {
        label: 'Active Navigation Requests', value: 17, icon: ActivityIcon,
        color: 'text-blue-600 bg-blue-100', href: '/admin/admin-navigation-nodes',
    },
    {
        label: 'Most Visited Office', value: "Treasurer's", icon: MapPin,
        color: 'text-blue-600 bg-blue-100', href: '/admin/admin-offices',
    },
];

const dailyVisitors = [
    { day: 'Mon', visitors: 180 },
    { day: 'Tue', visitors: 220 },
    { day: 'Wed', visitors: 195 },
    { day: 'Thu', visitors: 260 },
    { day: 'Fri', visitors: 248 },
    { day: 'Sat', visitors: 110 },
    { day: 'Sun', visitors: 75 },
];

const seedActivities = [
    { id: 1, who: 'Admin', action: 'added a new office', target: "Mayor's Office", at: '2 mins ago' },
    { id: 2, who: 'Juan', action: 'scanned QR code for', target: 'Civil Registry', at: '10 mins ago' },
    { id: 3, who: 'Maria', action: 'updated floor map for', target: 'Floor 3', at: '25 mins ago' },
    { id: 4, who: 'Admin', action: 'generated QR for', target: 'Health Office', at: '1 hr ago' },
];

const topOffices = [
    { id: 1, name: "Treasurer's Office", floor: 'Floor 2', room: '201' },
    { id: 2, name: 'Civil Registry', floor: 'Floor 1', room: '105' },
    { id: 3, name: "Mayor's Office", floor: 'Floor 4', room: '401' },
    { id: 4, name: 'Health Office', floor: 'Floor 1', room: '110' },
    { id: 5, name: 'Engineering Office', floor: 'Floor 3', room: '302' },
];

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <AdminShell
                title="Dashboard"
                description="Welcome back. Here's an overview of City Hall navigation today."
                actions={
                    <>
                        <Button variant="outline" asChild>
                            <Link href="/admin/admin-analytics">
                                <BarChart3 className="mr-2 h-4 w-4" /> View Analytics
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/admin/admin-offices">
                                <Plus className="mr-2 h-4 w-4" /> Add Office
                            </Link>
                        </Button>
                    </>
                }
            >
                {/* Stat cards — now double as quick links */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((s) => {
                        const Icon = s.icon;
                        return (
                            <Link key={s.label} href={s.href}>
                                <Card className="transition-colors hover:border-blue-300 hover:bg-blue-50/40">
                                    <CardContent className="flex items-center justify-between gap-3 p-4">
                                        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${s.color}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <div className="text-xs text-gray-500">{s.label}</div>
                                            <div className="mt-1 self-end text-xl font-semibold">{s.value}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* Chart + Activities */}
                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Daily Visitors — This Week</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dailyVisitors}>
                                        <defs>
                                            <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#1a56c4" stopOpacity={0.4} />
                                                <stop offset="100%" stopColor="#1a56c4" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                                        <YAxis stroke="#9ca3af" fontSize={12} />
                                        <Tooltip
                                            contentStyle={{
                                                background: '#fff',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: 8,
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="visitors"
                                            stroke="#1a56c4"
                                            strokeWidth={2}
                                            fill="url(#vg)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Recent Activities</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {seedActivities.map((a) => (
                                <div key={a.id} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-600">
                                        {a.who.charAt(0)}
                                    </div>
                                    <div className="flex-1 text-sm">
                                        <div>
                                            <span className="font-medium">{a.who}</span> {a.action}
                                        </div>
                                        <div className="text-xs text-gray-400">{a.target} • {a.at}</div>
                                    </div>
                                </div>
                            ))}
                            <Link href="/admin/admin-notifications" className="block text-center text-xs text-blue-600 hover:underline">
                                View all activity
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Offices
                <Card className="mt-6">
                    <CardHeader><CardTitle>Top Offices by Visit</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {topOffices.map((o, i) => (
                                <div key={o.id} className="flex items-center justify-between rounded-md border bg-white px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="border-yellow-300 text-yellow-700 bg-yellow-50">
                                            #{i + 1}
                                        </Badge>
                                        <div>
                                            <div className="text-sm font-medium">{o.name}</div>
                                            <div className="text-xs text-gray-400">{o.floor} • Room {o.room}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400">{Math.round(180 - i * 22)} visits</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card> */}
            </AdminShell>
        </>
    );
}