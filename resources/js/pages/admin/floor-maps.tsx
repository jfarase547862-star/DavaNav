import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface FloorMap {
    id: string;
    floor: string;
    label: string;
    uploaded: string;
    status: 'Active' | 'Inactive';
    imageUrl: string | null;
}

const mockFloorMaps: FloorMap[] = [
    { id: '1', floor: '1F', label: 'Ground Floor', uploaded: '2024-01-10', status: 'Active', imageUrl: null },
    { id: '2', floor: '2F', label: 'Second Floor', uploaded: '2024-01-11', status: 'Active', imageUrl: null },
    { id: '3', floor: '3F', label: 'Third Floor', uploaded: '2024-01-12', status: 'Active', imageUrl: null },
    { id: '4', floor: '4F', label: 'Fourth Floor', uploaded: '2024-01-13', status: 'Inactive', imageUrl: null },
];

export default function FloorMaps() {
    const [selected, setSelected] = useState<FloorMap>(mockFloorMaps[0]);
    const [zoom, setZoom] = useState(1);

    function resetZoom() { setZoom(1); }

    return (
        <>
            <Head title="Floor Maps — Navix Admin" />
            <AdminShell
                title="Floor Maps"
                description="View and manage floor maps for Davao City Hall."
                breadcrumbs={[{ label: 'Floor Maps' }]}
                actions={
                    <Button>
                        <Upload className="mr-2 h-4 w-4" /> Upload Map
                    </Button>
                }
            >
                {/* Full-height flex container that fills the shell's content area */}
                <div
                    className="flex gap-4"
                    style={{ height: 'calc(100vh - 160px)', minHeight: 600 }}
                >
                    {/* ── Floor selector sidebar ── */}
                    <div className="flex flex-col gap-2 w-52 shrink-0 overflow-y-auto">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 pt-0.5">
                            Floors
                        </h3>
                        {mockFloorMaps.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => { setSelected(f); resetZoom(); }}
                                className={`rounded-lg border p-3 text-left transition-all ${
                                    selected.id === f.id
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <div className="font-semibold text-sm">{f.floor}</div>
                                        <div className="text-xs text-gray-500 mt-0.5">{f.label}</div>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={f.status === 'Active'
                                            ? 'bg-green-50 text-green-700 border-green-200 shrink-0'
                                            : 'bg-gray-100 text-gray-500 border-gray-200 shrink-0'
                                        }
                                    >
                                        {f.status}
                                    </Badge>
                                </div>
                                <div className="text-[10px] text-gray-400 mt-1">
                                    Uploaded {f.uploaded}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* ── Map viewer — fills all remaining space ── */}
                    <Card className="flex flex-col flex-1 min-w-0 overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between py-3 px-4 shrink-0">
                            <CardTitle className="text-base">
                                {selected.floor} — {selected.label}
                            </CardTitle>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                                >
                                    <ZoomOut className="h-4 w-4" />
                                </Button>
                                <span className="text-xs text-gray-500 w-10 text-center">
                                    {Math.round(zoom * 100)}%
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
                                >
                                    <ZoomIn className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" onClick={resetZoom}>
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>

                        <CardContent className="flex flex-col flex-1 min-h-0 p-4 pt-0 gap-3">
                            {/* Scrollable map canvas — takes all remaining card height */}
                            <div className="flex-1 overflow-auto rounded-lg border bg-gray-50 min-h-0">
                                <div
                                    className="flex items-start justify-center transition-transform duration-200"
                                    style={{
                                        transform: `scale(${zoom})`,
                                        transformOrigin: 'top center',
                                        padding: 32,
                                        minHeight: '100%',
                                        minWidth: zoom > 1 ? `${zoom * 100}%` : '100%',
                                    }}
                                >
                                    {selected.imageUrl ? (
                                        <img
                                            src={selected.imageUrl}
                                            alt={`${selected.floor} map`}
                                            className="max-w-full rounded shadow"
                                        />
                                    ) : (
                                        <svg
                                            viewBox="0 0 600 400"
                                            className="w-full rounded shadow-sm"
                                            style={{ background: '#fff', border: '1px solid #e5e7eb' }}
                                        >
                                            <rect x="20" y="20" width="560" height="360" fill="none" stroke="#374151" strokeWidth="3" rx="4" />

                                            <rect x="20" y="160" width="560" height="80" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1" />
                                            <text x="300" y="205" textAnchor="middle" fontSize="11" fill="#9ca3af">Main Corridor</text>

                                            <rect x="20" y="20" width="130" height="140" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
                                            <text x="85" y="85" textAnchor="middle" fontSize="10" fill="#1e40af">Civil Registry</text>
                                            <text x="85" y="100" textAnchor="middle" fontSize="9" fill="#3b82f6">Room 101</text>

                                            <rect x="150" y="20" width="130" height="140" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
                                            <text x="215" y="85" textAnchor="middle" fontSize="10" fill="#1e40af">Treasury</text>
                                            <text x="215" y="100" textAnchor="middle" fontSize="9" fill="#3b82f6">Room 102</text>

                                            <rect x="280" y="20" width="130" height="140" fill="#dbeafe" stroke="#93c5fd" strokeWidth="1.5" />
                                            <text x="345" y="85" textAnchor="middle" fontSize="10" fill="#1e40af">Health Office</text>
                                            <text x="345" y="100" textAnchor="middle" fontSize="9" fill="#3b82f6">Room 103</text>

                                            <rect x="410" y="20" width="170" height="140" fill="#fef9c3" stroke="#fde047" strokeWidth="1.5" />
                                            <text x="495" y="85" textAnchor="middle" fontSize="10" fill="#854d0e">Lobby</text>
                                            <text x="495" y="100" textAnchor="middle" fontSize="9" fill="#a16207">Main Entrance</text>

                                            <rect x="20" y="240" width="130" height="140" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5" />
                                            <text x="85" y="305" textAnchor="middle" fontSize="10" fill="#166534">Engineering</text>
                                            <text x="85" y="320" textAnchor="middle" fontSize="9" fill="#16a34a">Room 104</text>

                                            <rect x="150" y="240" width="130" height="140" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5" />
                                            <text x="215" y="305" textAnchor="middle" fontSize="10" fill="#166534">Social Welfare</text>
                                            <text x="215" y="320" textAnchor="middle" fontSize="9" fill="#16a34a">Room 105</text>

                                            <rect x="280" y="240" width="130" height="140" fill="#dcfce7" stroke="#86efac" strokeWidth="1.5" />
                                            <text x="345" y="305" textAnchor="middle" fontSize="10" fill="#166534">Assessor</text>
                                            <text x="345" y="320" textAnchor="middle" fontSize="9" fill="#16a34a">Room 106</text>

                                            <rect x="410" y="240" width="170" height="140" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="1.5" />
                                            <text x="495" y="305" textAnchor="middle" fontSize="10" fill="#9d174d">Business Permits</text>
                                            <text x="495" y="320" textAnchor="middle" fontSize="9" fill="#be185d">Room 107</text>

                                            <rect x="260" y="168" width="50" height="64" fill="#e0e7ff" stroke="#818cf8" strokeWidth="1.5" rx="2" />
                                            <text x="285" y="200" textAnchor="middle" fontSize="9" fill="#4338ca">Elevator</text>

                                            <rect x="320" y="168" width="40" height="64" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1.5" rx="2" />
                                            <text x="340" y="200" textAnchor="middle" fontSize="9" fill="#92400e">Stairs</text>

                                            <text x="300" y="390" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="500">
                                                {selected.floor} — {selected.label}
                                            </text>
                                        </svg>
                                    )}
                                </div>
                            </div>

                            {/* Legend — pinned to bottom of card */}
                            <div className="flex flex-wrap gap-3 text-xs text-gray-500 shrink-0">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-3 w-3 rounded-sm bg-blue-100 border border-blue-300" />
                                    Offices
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-3 w-3 rounded-sm bg-green-100 border border-green-300" />
                                    Services
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-3 w-3 rounded-sm bg-yellow-100 border border-yellow-300" />
                                    Lobby / Entrance
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-3 w-3 rounded-sm bg-indigo-100 border border-indigo-300" />
                                    Elevator
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-3 w-3 rounded-sm bg-amber-100 border border-amber-300" />
                                    Stairs
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AdminShell>
        </>
    );
}