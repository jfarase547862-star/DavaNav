import { type Office, seedOffices } from '@/lib/mock-data';
import { MapPin, Navigation } from 'lucide-react';
import { useMemo } from 'react';

type Props = {
  floor: number;
  highlightId?: string;
  showRoute?: boolean;
  onSelect?: (o: Office) => void;
  startCoord?: { x: number; y: number };
};

function toFloorNumber(floor: number | string): number {
  return typeof floor === 'string' ? parseInt(floor, 10) : floor;
}

export function FloorMap({ floor, highlightId, showRoute, onSelect, startCoord = { x: 50, y: 95 } }: Props) {
  const floorOffices = useMemo(
    () => seedOffices.filter((office) => toFloorNumber(office.floor) === floor && office.coords),
    [floor],
  );
  const dest = seedOffices.find((office) => office.id === highlightId);
  const destOnThisFloor = dest && dest.coords && toFloorNumber(dest.floor) === floor;

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border bg-secondary/50 px-4 py-2 text-sm">
        <div className="font-semibold">Floor {floor}</div>
        <div className="text-muted-foreground">{floorOffices.length} seedOffices</div>
      </div>
      <svg viewBox="0 0 100 100" className="block aspect-[5/3] w-full bg-gradient-soft">
        <defs>
          <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 5 0 L 0 0 0 5" fill="none" stroke="oklch(0.92 0.012 245)" strokeWidth="0.2" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        <rect x="5" y="10" width="90" height="80" rx="2" fill="white" stroke="oklch(0.42 0.16 255)" strokeWidth="0.6" />
        <rect x="10" y="48" width="80" height="6" fill="oklch(0.96 0.015 250)" />
        <rect x="46" y="14" width="6" height="74" fill="oklch(0.96 0.015 250)" />
        <rect x="46" y="88" width="6" height="3" fill="oklch(0.62 0.15 155)" />
        <text x="50" y="98" textAnchor="middle" fontSize="2.4" fill="oklch(0.5 0.03 250)">ENTRANCE</text>

        {showRoute && destOnThisFloor && dest?.coords && (
          <g>
            <path
              d={`M ${startCoord.x} ${startCoord.y} L ${startCoord.x} 51 L ${dest.coords.x} 51 L ${dest.coords.x} ${dest.coords.y}`}
              fill="none"
              stroke="oklch(0.42 0.16 255)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="2 1.5"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1.2s" repeatCount="indefinite" />
            </path>
            <circle cx={startCoord.x} cy={startCoord.y} r="1.6" fill="oklch(0.62 0.15 155)" />
          </g>
        )}

        {floorOffices.map((office) => {
          if (!office.coords) return null;
          const isDest = office.id === highlightId;
          return (
            <g key={office.id} onClick={() => onSelect?.(office)} style={{ cursor: onSelect ? 'pointer' : 'default' }}>
              <rect
                x={office.coords.x - 9}
                y={office.coords.y - 5}
                width="18"
                height="10"
                rx="1.2"
                fill={isDest ? 'oklch(0.42 0.16 255)' : 'white'}
                stroke={isDest ? 'oklch(0.42 0.16 255)' : 'oklch(0.42 0.16 255 / 0.5)'}
                strokeWidth="0.4"
              />
              <text x={office.coords.x} y={office.coords.y - 0.5} textAnchor="middle" fontSize="2" fill={isDest ? 'white' : 'oklch(0.28 0.08 255)'} fontWeight="600">
                {office.room}
              </text>
              <text x={office.coords.x} y={office.coords.y + 2.5} textAnchor="middle" fontSize="1.6" fill={isDest ? 'white' : 'oklch(0.5 0.03 250)'}>
                {office.department}
              </text>
              {isDest && (
                <circle cx={office.coords.x} cy={office.coords.y} r="6" fill="none" stroke="oklch(0.42 0.16 255)" strokeWidth="0.4" opacity="0.5">
                  <animate attributeName="r" from="6" to="9" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex items-center gap-4 border-t border-border bg-card px-4 py-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-success" /> You are here</span>
        <span className="flex items-center gap-1.5"><Navigation className="h-3 w-3 text-primary" /> Destination</span>
      </div>
    </div>
  );
}