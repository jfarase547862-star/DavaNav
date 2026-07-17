import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { MapLibreFloorMap, indoorRooms, CITY_HALL_NAME } from '@/components/shared/maplibre-floor-map';
import { getOffice, seedOffices, seedFloors } from '@/lib/mock-data';
import {
  Building2, MapPin, Navigation, Layers3, Pencil, Plus, Trash2, Upload,
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Fields below follow the DavaNav Data Model → Interface Mapping doc, Section C:
 *
 * Table 9. Building → Floor Maps form (Fig. 28), Input form
 *   building_name, address, total_floors, description, status (Active/Inactive)
 *
 * Table 11. Floors → Floor Maps form (Fig. 28), Input form
 *   building_id (Select Building dropdown), floor_number, floor_name,
 *   floor_map (Upload Floor Map file upload)
 *
 * The read-only map/offices view below (interactive floor plan + office list)
 * corresponds to the *display* usage of these same two tables on the
 * Interactive Map screen (Fig. 17, 22) — that part of the page is preserved
 * as-is, with Building/Floor CRUD layered on top so this screen actually
 * fulfills the "Input form" role Fig. 28 is mapped to.
 */

type Status = 'Active' | 'Inactive';

interface BuildingRecord {
  id: string;
  building_name: string;
  address: string;
  total_floors: number;
  description: string;
  status: Status;
}

interface FloorRecord {
  floor_id: string;
  building_id: string;
  floor_number: number;
  floor_name: string;
  floor_map: string | null; // uploaded floor-plan image path
}

const seedBuilding: BuildingRecord = {
  id: 'b1',
  building_name: CITY_HALL_NAME,
  address: 'San Pedro St, Davao City, 8000 Davao del Sur',
  total_floors: seedFloors.length,
  description: 'Main administrative building housing city departments and public-facing offices.',
  status: 'Active',
};

const emptyBuilding: BuildingRecord = {
  id: '', building_name: '', address: '', total_floors: 1, description: '', status: 'Active',
};

const emptyFloor = (buildingId: string): FloorRecord => ({
  floor_id: '', building_id: buildingId, floor_number: 1, floor_name: '', floor_map: null,
});

export default function FloorMaps() {
  const [building, setBuilding] = useState<BuildingRecord>(seedBuilding);
const [floors, setFloors] = useState<FloorRecord[]>(
  seedFloors.map((f) => ({
    floor_id: String(f.floor_id),          // <-- convert number -> string
    building_id: building.id,
    floor_number: f.floor_number,
    floor_name: f.floor_name ?? `Floor ${f.floor_number}`,
    floor_map: (f as any).floor_map ?? null,
  })),
);

  const [selectedFloor, setSelectedFloor] = useState(seedFloors[0]?.floor_number ?? 1);
  const [selectedOfficeId, setSelectedOfficeId] = useState(seedOffices[0].id);

  const [buildingDialogOpen, setBuildingDialogOpen] = useState(false);
  const [buildingDraft, setBuildingDraft] = useState<BuildingRecord>(building);

  const [floorDialogOpen, setFloorDialogOpen] = useState(false);
  const [floorDraft, setFloorDraft] = useState<FloorRecord>(emptyFloor(building.id));
  const [floorDeleteTarget, setFloorDeleteTarget] = useState<FloorRecord | null>(null);
  const [floorDeleteOpen, setFloorDeleteOpen] = useState(false);

  const floorOffices = useMemo(
    () => seedOffices.filter((office) => Number(office.floor) === selectedFloor),
    [selectedFloor],
  );

  const selectedOffice = useMemo(() => {
    const office = getOffice(selectedOfficeId);
    if (office && Number(office.floor) === selectedFloor) return office;
    return floorOffices[0] ?? seedOffices[0];
  }, [floorOffices, selectedFloor, selectedOfficeId]);

  const selectedFloorRecord = useMemo(
    () => floors.find((f) => f.floor_number === selectedFloor),
    [floors, selectedFloor],
  );

  const highlightRoomId = useMemo(() => {
    if (!selectedOffice) return undefined;
    return indoorRooms.find(
      (room) => room.floor === Number(selectedOffice.floor) && room.room === selectedOffice.room,
    )?.id;
  }, [selectedOffice]);

  function openEditBuilding() {
    setBuildingDraft(building);
    setBuildingDialogOpen(true);
  }

  function saveBuilding() {
    if (!buildingDraft.building_name.trim() || !buildingDraft.address.trim()) {
      toast.error('Please complete all required fields');
      return;
    }
    setBuilding(buildingDraft);
    setBuildingDialogOpen(false);
    toast.success('Building details updated');
  }

  function openAddFloor() {
    setFloorDraft(emptyFloor(building.id));
    setFloorDialogOpen(true);
  }

  function openEditFloor(f: FloorRecord) {
    setFloorDraft(f);
    setFloorDialogOpen(true);
  }

  function saveFloor() {
    if (!floorDraft.floor_name.trim() || !floorDraft.floor_number) {
      toast.error('Please complete all required fields');
      return;
    }
    if (floorDraft.floor_id) {
      setFloors((prev) => prev.map((f) => (f.floor_id === floorDraft.floor_id ? floorDraft : f)));
      toast.success('Floor updated');
    } else {
      const newFloor: FloorRecord = { ...floorDraft, floor_id: crypto.randomUUID() };
      setFloors((prev) => [...prev, newFloor].sort((a, b) => a.floor_number - b.floor_number));
      setSelectedFloor(newFloor.floor_number);
      toast.success('Floor added');
    }
    setFloorDialogOpen(false);
  }

  function confirmDeleteFloor(f: FloorRecord) {
    setFloorDeleteTarget(f);
    setFloorDeleteOpen(true);
  }

  function deleteFloor() {
    if (!floorDeleteTarget) return;
    setFloors((prev) => prev.filter((f) => f.floor_id !== floorDeleteTarget.floor_id));
    if (selectedFloor === floorDeleteTarget.floor_number) {
      const remaining = floors.filter((f) => f.floor_id !== floorDeleteTarget.floor_id);
      if (remaining[0]) setSelectedFloor(remaining[0].floor_number);
    }
    toast.success('Floor deleted');
    setFloorDeleteTarget(null);
    setFloorDeleteOpen(false);
  }

  function handleFloorMapUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Demo-only: store the local object URL as the floor_map path.
    // A real implementation would upload the file and persist the returned path.
    setFloorDraft((prev) => ({ ...prev, floor_map: URL.createObjectURL(file) }));
  }

  return (
    <>
      <Head title="Floor Maps — DavaNav Admin" />
      <AdminShell
        title="Floor Maps"
        description="Manage the building and its floors, and inspect the interactive floor plan for each level."
        breadcrumbs={[{ label: 'Floor Maps' }]}
        actions={
          <Button variant="outline">
            <Layers3 className="mr-2 h-4 w-4" /> Floor Plan View
          </Button>
        }
      >
        {/* Building (Table 9) */}
        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Building</CardTitle>
            <Button variant="outline" size="sm" onClick={openEditBuilding}>
              <Pencil className="mr-2 h-3.5 w-3.5" /> Edit Building
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="text-xs font-semibold uppercase    text-gray-400">Building Name</div>
              <div className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                <Building2 className="h-4 w-4 text-blue-600" /> {building.building_name}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase    text-gray-400">Address</div>
              <div className="mt-1 text-sm text-gray-700">{building.address}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase    text-gray-400">Number of Floors</div>
              <div className="mt-1 text-sm text-gray-700">{building.total_floors}</div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase    text-gray-400">Status</div>
              <div className="mt-1">
                <Badge variant={building.status === 'Active' ? 'default' : 'outline'}>{building.status}</Badge>
              </div>
            </div>
            {building.description && (
              <div className="sm:col-span-2 lg:col-span-4">
                <div className="text-xs font-semibold uppercase    text-gray-400">Description</div>
                <div className="mt-1 text-sm text-gray-600">{building.description}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
          {/* Floors (Table 11) */}
          <Card className="h-fit">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Floors</CardTitle>
              <Button variant="ghost" size="icon" onClick={openAddFloor} title="Add Floor">
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {floors.map((floor) => (
                <div
                  key={floor.floor_id}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    selectedFloor === floor.floor_number
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFloor(floor.floor_number);
                      const firstOffice = seedOffices.find(
                        (office) => Number(office.floor) === floor.floor_number,
                      );
                      if (firstOffice) setSelectedOfficeId(firstOffice.id);
                    }}
                    className="flex w-full items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-sm font-semibold">Floor {floor.floor_number}</div>
                      <div className="text-xs text-gray-500">{floor.floor_name}</div>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      {
                        seedOffices.filter(
                          (office) => Number(office.floor) === floor.floor_number,
                        ).length
                      }{' '}
                      offices
                    </Badge>
                  </button>
                  <div className="mt-2 flex items-center gap-1 border-t pt-2">
                    {floor.floor_map ? (
                      <span className="text-[11px] text-gray-500">Floor map uploaded</span>
                    ) : (
                      <span className="text-[11px] text-amber-600">No floor map uploaded</span>
                    )}
                    <div className="ml-auto flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditFloor(floor)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-red-600 hover:text-red-700"
                        onClick={() => confirmDeleteFloor(floor)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardContent className="grid gap-4 p-4 md:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-700">
                    <Building2 className="h-4 w-4" /> {building.building_name}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Floor {selectedFloor}
                    {selectedFloorRecord?.floor_name ? ` — ${selectedFloorRecord.floor_name}` : ''}
                  </h2>
                  <p className="text-sm text-gray-500">
                    The map below mirrors the kiosk experience so staff can review office placement and room highlights for the selected level.
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2 font-semibold text-gray-800">
                    <Navigation className="h-4 w-4 text-blue-600" /> Selected office
                  </div>
                  <div className="mt-2 font-medium text-gray-900">{selectedOffice?.name}</div>
                  <div className="text-xs text-gray-500">{selectedOffice?.room} • Floor {selectedOffice?.floor}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-gray-50/70">
                <CardTitle className="text-base">Interactive map</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid gap-0 lg:grid-cols-[1.15fr_0.45fr]">
                  <div className="min-h-[480px] border-b lg:border-b-0 lg:border-r">
                    <MapLibreFloorMap
                      floor={selectedFloor}
                      highlightId={highlightRoomId}
                      // `floor_map` (selectedFloorRecord?.floor_map) holds the uploaded
                      // floor-plan image path per the data dictionary (Table 11). MapLibreFloorMap
                      // currently renders a vector layer keyed by `floor` number only.
                      // If/when that component supports a raster background or custom
                      // style URL, pass it here, e.g.:
                      //   backgroundImage={selectedFloorRecord?.floor_map ?? undefined}
                      onSelect={(roomId) => {
                        const room = indoorRooms.find((item) => item.id === roomId);
                        if (!room) return;
                        const matched = seedOffices.find(
                          (office) => Number(office.floor) === room.floor && office.room === room.room,
                        );
                        if (matched) {
                          setSelectedFloor(Number(matched.floor));
                          setSelectedOfficeId(matched.id);
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-3 p-4">
                    <div>
                      <div className="text-xs font-semibold uppercase    text-gray-400">Offices on this floor</div>
                      <div className="mt-2 space-y-2">
                        {floorOffices.map((office) => {
                          const active = selectedOffice?.id === office.id;
                          return (
                            <button
                              key={office.id}
                              type="button"
                              onClick={() => setSelectedOfficeId(office.id)}
                              className={`w-full rounded-lg border p-3 text-left transition ${
                                active ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <div className="text-sm font-semibold text-gray-900">{office.name}</div>
                                  <div className="text-xs text-gray-500">{office.room}</div>
                                </div>
                                <MapPin className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {selectedOffice && (
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <div className="text-sm font-semibold text-gray-900">{selectedOffice.name}</div>
                        <div className="mt-1 text-sm text-gray-600">{selectedOffice.description}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Badge variant="outline">{selectedOffice.room}</Badge>
                          <Badge variant="outline">{selectedOffice.hours}</Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Edit Building dialog (Table 9) */}
        <Dialog open={buildingDialogOpen} onOpenChange={setBuildingDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Edit Building</DialogTitle>
              <DialogDescription>Fill in the details below. Fields marked * are required.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label>Building Name *</Label>
                <Input
                  value={buildingDraft.building_name}
                  onChange={(e) => setBuildingDraft({ ...buildingDraft, building_name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Building Address *</Label>
                <Input
                  value={buildingDraft.address}
                  onChange={(e) => setBuildingDraft({ ...buildingDraft, address: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Number of Floors</Label>
                <Input
                  type="number"
                  min={1}
                  value={buildingDraft.total_floors}
                  onChange={(e) => setBuildingDraft({ ...buildingDraft, total_floors: Number(e.target.value) })}
                />
                <p className="text-xs text-muted-foreground">Currently {floors.length} floor(s) defined below.</p>
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Textarea
                  rows={3}
                  value={buildingDraft.description}
                  onChange={(e) => setBuildingDraft({ ...buildingDraft, description: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Status</Label>
                <Select
                  value={buildingDraft.status}
                  onValueChange={(v) => setBuildingDraft({ ...buildingDraft, status: v as Status })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBuildingDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveBuilding}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Floor dialog (Table 11) */}
        <Dialog open={floorDialogOpen} onOpenChange={setFloorDialogOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>{floorDraft.floor_id ? 'Edit Floor' : 'Add Floor'}</DialogTitle>
              <DialogDescription>Fill in the details below. Fields marked * are required.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <div className="space-y-1">
                <Label>Select Building *</Label>
                <Select value={floorDraft.building_id} onValueChange={(v) => setFloorDraft({ ...floorDraft, building_id: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value={building.id}>{building.building_name}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Floor Number *</Label>
                <Input
                  type="number"
                  min={1}
                  value={floorDraft.floor_number}
                  onChange={(e) => setFloorDraft({ ...floorDraft, floor_number: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1">
                <Label>Floor Name *</Label>
                <Input
                  placeholder="e.g., Ground Lobby"
                  value={floorDraft.floor_name}
                  onChange={(e) => setFloorDraft({ ...floorDraft, floor_name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Upload Floor Map</Label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-sm text-muted-foreground hover:border-gray-300">
                  <Upload className="h-4 w-4" />
                  {floorDraft.floor_map ? 'Replace floor map image' : 'Click to upload floor map image'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleFloorMapUpload} />
                </label>
                {floorDraft.floor_map && (
                  <img
                    src={floorDraft.floor_map}
                    alt="Floor map preview"
                    className="mt-2 max-h-40 rounded-md border object-contain"
                  />
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFloorDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveFloor}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirm Delete Floor dialog */}
        <Dialog open={floorDeleteOpen} onOpenChange={setFloorDeleteOpen}>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Delete floor?</DialogTitle>
              <DialogDescription>
                This will permanently remove "{floorDeleteTarget?.floor_name}" (Floor {floorDeleteTarget?.floor_number}). This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFloorDeleteOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={deleteFloor}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </AdminShell>
    </>
  );
}