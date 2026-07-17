import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    Users, Settings, Database, Cloud, Zap, AlertCircle,
    Shield, BarChart3, HardDrive, Plus, CheckCircle2,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SuperadminShell } from '@/components/superadmin/superadmin-shell';
import {
    LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

const systemStats = [
    { label: 'Total Admin Accounts', value: 12,   icon: Users,     color: 'text-blue-600 bg-blue-100', href: '/superadmin/supadmin-admin-accounts' },
    { label: 'System Health',        value: '98%', icon: Zap,       color: 'text-blue-600 bg-blue-100', href: '/superadmin/supadmin-performance' },
    { label: 'Active Sessions',      value: 24,    icon: Shield,    color: 'text-blue-600 bg-blue-100', href: '/superadmin/supadmin-system-settings' },
    { label: 'Disk Usage',           value: '67%', icon: HardDrive, color: 'text-blue-600 bg-blue-100', href: '/superadmin/supadmin-backup-recovery' },
];

const dailySystemHealth = [
    { time: 'Mon', uptime: 99.8 },
    { time: 'Tue', uptime: 99.9 },
    { time: 'Wed', uptime: 99.7 },
    { time: 'Thu', uptime: 99.9 },
    { time: 'Fri', uptime: 99.8 },
    { time: 'Sat', uptime: 99.6 },
    { time: 'Sun', uptime: 99.9 },
];

const monthlySystemHealth = [
    { time: 'Jan', uptime: 99.7 },
    { time: 'Feb', uptime: 99.8 },
    { time: 'Mar', uptime: 99.6 },
    { time: 'Apr', uptime: 99.9 },
    { time: 'May', uptime: 99.8 },
    { time: 'Jun', uptime: 99.9 },
];

const UPTIME_PERIODS = [
    { value: 'daily',   label: 'Daily',   data: dailySystemHealth },
    { value: 'monthly', label: 'Monthly', data: monthlySystemHealth },
];

const systemEvents = [
    { id: 1, type: 'Admin Added', user: 'superadmin@davanav.gov', description: 'New admin account created', at: '2 hours ago', status: 'success' },
    { id: 2, type: 'Database Backup', user: 'System', description: 'Full database backup completed', at: '4 hours ago', status: 'success' },
    { id: 3, type: 'Settings Updated', user: 'superadmin@davanav.gov', description: 'Email configuration updated', at: '1 day ago', status: 'success' },
    { id: 4, type: 'Login Attempt', user: 'admin@davanav.gov', description: 'Successful admin login', at: '2 days ago', status: 'info' },
];

const managementItems = [
    { id: 1, name: 'Admin Accounts', status: 'Active', count: 12 },
    { id: 2, name: 'System Settings', status: 'Configured', count: 18 },
    { id: 3, name: 'Database Schema', status: 'Healthy', count: 42 },
    { id: 4, name: 'Deployment', status: 'Running', count: 1 },
    { id: 5, name: 'Performance', status: 'Optimal', count: 7 },
];

function SystemUptimeCard() {
    const [period, setPeriod] = useState<'daily' | 'monthly'>('daily');
    const active = UPTIME_PERIODS.find((p) => p.value === period)!;

    return (
        <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>System Uptime {period === 'daily' ? '— This Week' : '— This Year'}</CardTitle>
                <div className="flex rounded-md border border-border p-0.5">
                    {UPTIME_PERIODS.map((p) => (
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
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={active.data}>
                            <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} domain={[99, 100]} />
                            <Tooltip
                                contentStyle={{
                                    background: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: 8,
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="uptime"
                                stroke="#1a56c4"
                                strokeWidth={2}
                                dot={{ fill: '#1a56c4', r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export default function SuperadminDashboard() {
    return (
        <>
            <Head title="Superadmin Dashboard" />
            <SuperadminShell
                title="System Dashboard"
                description="Manage system-wide settings, admins, and infrastructure."
                actions={
                    <>
                        <Button variant="outline" asChild>
                            <Link href="/superadmin/analytics">
                                <BarChart3 className="mr-2 h-4 w-4" /> System Logs
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/superadmin/admin-accounts">
                                <Plus className="mr-2 h-4 w-4" /> Add Admin
                            </Link>
                        </Button>
                    </>
                }
            >
                {/* System Stats — double as quick links */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {systemStats.map((s) => {
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

                {/* System Health Chart + Events */}
                <div className="mt-6 grid gap-4 lg:grid-cols-3">
                    <SystemUptimeCard />

                    <Card>
                        <CardHeader><CardTitle>System Events</CardTitle></CardHeader>
                        <CardContent className="space-y-3">
                            {systemEvents.map((e) => (
                                <div key={e.id} className="flex items-start gap-3 border-b pb-3 last:border-0 last:pb-0">
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                        e.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                        {e.status === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                    </div>
                                    <div className="flex-1 text-sm">
                                        <div>
                                            <span className="font-medium">{e.type}</span>
                                        </div>
                                        <div className="text-xs text-gray-400">{e.description} • {e.at}</div>
                                    </div>
                                </div>
                            ))}
                            <Link href="/superadmin/supadmin-notifications" className="block text-center text-xs text-blue-600 hover:underline">
                                View all events
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Management Overview
                <Card className="mt-6">
                    <CardHeader><CardTitle>System Components</CardTitle></CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {managementItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between rounded-md border bg-white px-4 py-2">
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
                                            {item.status}
                                        </Badge>
                                        <div>
                                            <div className="text-sm font-medium">{item.name}</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400">{item.count} items</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card> */}
            </SuperadminShell>
        </>
    );
}