// Mock data for Navix Solution — Davao City Hall

export type Status = "Active" | "Inactive";

export interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  floor: string;
  status: Status;
}

export interface Office {
  id: string;
  name: string;
  // Admin fields
  departmentId?: string;
  qrAssigned?: boolean;
  status?: Status;
  // Public/kiosk fields
  department?: string;
  floor: number | string;
  room: string;
  description?: string;
  services?: string[];
  hours?: string;
  contact?: string;
  email?: string;
  head?: string;
  coords?: { x: number; y: number };
}

export interface QrCode {
  id: string;
  code: string;
  label: string;
  officeId: string | null;
  status: "Active" | "Inactive";
  scans: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "Super Administrator" | "Administrator" | "Staff";
  status: Status;
  lastLogin: string;
}

export interface NavNode {
  id: string;
  label: string;
  type: "Hallway" | "Staircase" | "Elevator" | "Emergency Exit" | "Office";
  floor: string;
  connections: string[];
}

export interface FloorMap {
  id: string;
  floor: string;
  name: string;
  uploaded: string;
  status: Status;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  read: boolean;
  createdAt: string;
}

export interface Activity {
  id: string;
  who: string;
  action: string;
  target: string;
  at: string;
}

// ── Departments ───────────────────────────────────────────────────────────────

export const seedDepartments: Department[] = [
  { id: "d1", name: "Mayor's Office",     description: "Office of the City Mayor.",          head: "Hon. M. Duterte",    floor: "3F", status: "Active" },
  { id: "d2", name: "Treasurer's Office", description: "Tax collection and payments.",        head: "Atty. R. Garcia",    floor: "1F", status: "Active" },
  { id: "d3", name: "City Assessor",      description: "Real property assessment.",           head: "Engr. P. Lim",       floor: "2F", status: "Active" },
  { id: "d4", name: "Engineering Office", description: "City infrastructure & permits.",      head: "Engr. J. Cruz",      floor: "2F", status: "Active" },
  { id: "d5", name: "Business Bureau",    description: "Business permits & licensing.",       head: "Ms. L. Tan",         floor: "1F", status: "Active" },
  { id: "d6", name: "Accounting Office",  description: "City accounting & finance.",          head: "Ms. C. Reyes",       floor: "3F", status: "Active" },
  { id: "d7", name: "Human Resource",     description: "Personnel management.",               head: "Mr. F. Santos",      floor: "3F", status: "Active" },
  { id: "d8", name: "City Planning",      description: "Urban planning & zoning.",            head: "Arch. D. Uy",        floor: "2F", status: "Active" },
  { id: "d9", name: "Civil Registrar",    description: "Birth, marriage, death records.",     head: "Atty. V. Mendoza",   floor: "1F", status: "Active" },
];

export const departments = [
  "Civil Registry",
  "Treasury",
  "Assessor",
  "Health",
  "Engineering",
  "Social Welfare",
  "Mayor's Office",
  "Business Permits",
];

// ── Offices ───────────────────────────────────────────────────────────────────

export const seedOffices: Office[] = [
  {
    id: "civil-registry",
    name: "Civil Registry Office",
    department: "Civil Registry",
    departmentId: "d9",
    floor: 1,
    room: "Room 101",
    status: "Active",
    qrAssigned: true,
    description: "Handles birth, marriage, and death certificates and related civil documents.",
    services: ["Birth Certificate", "Marriage Certificate", "Death Certificate", "CENOMAR", "Late Registration"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(02) 8123-4501",
    email: "civilregistry@gov.ph",
    head: "Atty. Maria Santos",
    coords: { x: 22, y: 68 },
  },
  {
    id: "treasury",
    name: "Treasury Office",
    department: "Treasury",
    departmentId: "d2",
    floor: 1,
    room: "Room 105",
    status: "Active",
    qrAssigned: true,
    description: "Collection of taxes, fees, and other government revenues.",
    services: ["Real Property Tax", "Business Tax", "Community Tax Certificate", "Payments"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(02) 8123-4502",
    email: "treasury@gov.ph",
    head: "Mr. Roberto Cruz",
    coords: { x: 70, y: 68 },
  },
  {
    id: "business-permits",
    name: "Business Permits & Licensing",
    department: "Business Permits",
    departmentId: "d5",
    floor: 2,
    room: "Room 201",
    status: "Active",
    qrAssigned: true,
    description: "Issuance and renewal of business permits and licenses.",
    services: ["New Business Permit", "Renewal", "Closure", "Mayor's Permit"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(02) 8123-4503",
    email: "bplo@gov.ph",
    head: "Engr. Liza Mendoza",
    coords: { x: 22, y: 30 },
  },
  {
    id: "assessor",
    name: "Assessor's Office",
    department: "Assessor",
    departmentId: "d3",
    floor: 2,
    room: "Room 205",
    status: "Active",
    qrAssigned: true,
    description: "Property appraisal and tax declaration.",
    services: ["Tax Declaration", "Property Assessment", "Transfer of Ownership"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(02) 8123-4504",
    email: "assessor@gov.ph",
    head: "Mr. Antonio Reyes",
    coords: { x: 70, y: 30 },
  },
  {
    id: "health",
    name: "City Health Office",
    department: "Health",
    floor: 1,
    room: "Room 110",
    status: "Active",
    qrAssigned: false,
    description: "Public health services, vaccinations, and medical certificates.",
    services: ["Medical Certificate", "Vaccination", "Health Card", "Sanitary Permit"],
    hours: "Mon–Fri, 7:00 AM – 5:00 PM",
    contact: "(02) 8123-4505",
    email: "health@gov.ph",
    head: "Dr. Jenny Lim",
    coords: { x: 46, y: 50 },
  },
  {
    id: "engineering",
    name: "Engineering Office",
    department: "Engineering",
    departmentId: "d4",
    floor: 3,
    room: "Room 301",
    status: "Active",
    qrAssigned: true,
    description: "Building permits, inspections, and infrastructure planning.",
    services: ["Building Permit", "Occupancy Permit", "Inspection"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(02) 8123-4506",
    email: "engineering@gov.ph",
    head: "Engr. Paolo Garcia",
    coords: { x: 25, y: 40 },
  },
  {
    id: "social-welfare",
    name: "Social Welfare & Development",
    department: "Social Welfare",
    floor: 2,
    room: "Room 210",
    status: "Active",
    qrAssigned: false,
    description: "Assistance programs for individuals and families in need.",
    services: ["Financial Assistance", "Solo Parent ID", "Senior Citizen ID", "PWD ID"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(02) 8123-4507",
    email: "swd@gov.ph",
    head: "Ms. Carmen Dela Cruz",
    coords: { x: 68, y: 40 },
  },
  {
    id: "mayors-office",
    name: "Mayor's Office",
    department: "Mayor's Office",
    departmentId: "d1",
    floor: 3,
    room: "Room 305",
    status: "Active",
    qrAssigned: true,
    description: "Office of the City Mayor.",
    services: ["Endorsements", "Certifications", "Public Inquiries"],
    hours: "Mon–Fri, 9:00 AM – 5:00 PM",
    contact: "(02) 8123-4500",
    email: "mayor@gov.ph",
    head: "Hon. Eduardo Villanueva",
    coords: { x: 70, y: 50 },
  },
  // Admin-only entries without full public detail
  { id: "o7", name: "Disbursement",  departmentId: "d6", floor: 3, room: "Room 315", status: "Inactive", qrAssigned: false },
  { id: "o8", name: "HR Front Desk", departmentId: "d7", floor: 3, room: "Room 320", status: "Active",   qrAssigned: true  },
  { id: "o9", name: "Zoning Counter",departmentId: "d8", floor: 2, room: "Room 230", status: "Active",   qrAssigned: false },
];

export function getOffice(id: string) {
  return seedOffices.find((o) => o.id === id);
}

// ── QR Codes ──────────────────────────────────────────────────────────────────

export const seedQrCodes: QrCode[] = [
  { id: "q1", code: "NAVIX-MAIN-ENT", label: "Main Entrance",      officeId: null,            status: "Active", scans: 412, createdAt: "2025-05-01" },
  { id: "q2", code: "NAVIX-GF-LOBBY", label: "Ground Floor Lobby", officeId: null,            status: "Active", scans: 305, createdAt: "2025-05-01" },
  { id: "q3", code: "NAVIX-TREAS-01", label: "Treasurer Office",   officeId: "treasury",      status: "Active", scans: 198, createdAt: "2025-05-04" },
  { id: "q4", code: "NAVIX-MAYOR-01", label: "Mayor Office",       officeId: "mayors-office", status: "Active", scans: 142, createdAt: "2025-05-04" },
  { id: "q5", code: "NAVIX-ENGR-01",  label: "Engineering Office", officeId: "engineering",   status: "Active", scans: 121, createdAt: "2025-05-10" },
];

// ── Users ─────────────────────────────────────────────────────────────────────

export const seedUsers: User[] = [
  { id: "u1", name: "Maria Santos",   email: "msantos@davao.gov.ph", role: "Super Administrator", status: "Active",   lastLogin: "2026-06-26 08:14" },
  { id: "u2", name: "Juan dela Cruz", email: "jcruz@davao.gov.ph",   role: "Administrator",       status: "Active",   lastLogin: "2026-06-25 17:02" },
  { id: "u3", name: "Liza Reyes",     email: "lreyes@davao.gov.ph",  role: "Staff",               status: "Active",   lastLogin: "2026-06-26 09:31" },
  { id: "u4", name: "Pedro Lim",      email: "plim@davao.gov.ph",    role: "Staff",               status: "Inactive", lastLogin: "2026-05-10 10:11" },
];

// ── Navigation Nodes ──────────────────────────────────────────────────────────

export const seedNodes: NavNode[] = [
  { id: "n1", label: "Main Entrance",        type: "Hallway",        floor: "1F", connections: ["n2"] },
  { id: "n2", label: "Lobby Center",         type: "Hallway",        floor: "1F", connections: ["n1", "n3", "n4"] },
  { id: "n3", label: "East Stairs",          type: "Staircase",      floor: "1F", connections: ["n2", "n5"] },
  { id: "n4", label: "Elevator A",           type: "Elevator",       floor: "1F", connections: ["n2", "n6"] },
  { id: "n5", label: "2F Corridor",          type: "Hallway",        floor: "2F", connections: ["n3"] },
  { id: "n6", label: "3F Corridor",          type: "Hallway",        floor: "3F", connections: ["n4"] },
  { id: "n7", label: "Emergency Exit South", type: "Emergency Exit", floor: "1F", connections: ["n2"] },
];

// ── Floor Maps ────────────────────────────────────────────────────────────────

export const seedFloorMaps: FloorMap[] = [
  { id: "f1", floor: "1F", name: "Ground Floor Plan", uploaded: "2025-04-12", status: "Active" },
  { id: "f2", floor: "2F", name: "Second Floor Plan", uploaded: "2025-04-12", status: "Active" },
  { id: "f3", floor: "3F", name: "Third Floor Plan",  uploaded: "2025-04-12", status: "Active" },
];

// ── Notifications ─────────────────────────────────────────────────────────────

export const seedNotifications: Notification[] = [
  { id: "nt1", title: "New QR generated", message: "QR for Cashier Window B was generated.", type: "success", read: false, createdAt: "2026-06-26 09:10" },
  { id: "nt2", title: "Floor map updated", message: "2F plan replaced by J. Cruz.",           type: "info",    read: false, createdAt: "2026-06-26 08:42" },
  { id: "nt3", title: "New user added",    message: "Liza Reyes joined as Staff.",            type: "info",    read: true,  createdAt: "2026-06-25 16:30" },
  { id: "nt4", title: "System alert",      message: "Scheduled maintenance Sunday 2AM.",      type: "warning", read: false, createdAt: "2026-06-25 12:00" },
];

// ── Activity Feed ─────────────────────────────────────────────────────────────

export const seedActivities: Activity[] = [
  { id: "a1", who: "Visitor #2480", action: "scanned QR",      target: "Main Entrance",      at: "2 min ago"  },
  { id: "a2", who: "J. Cruz",       action: "updated office",  target: "Permits Counter",    at: "14 min ago" },
  { id: "a3", who: "M. Santos",     action: "generated QR",    target: "Cashier Window B",   at: "32 min ago" },
  { id: "a4", who: "Visitor #2475", action: "requested route", target: "Treasurer's Office", at: "48 min ago" },
  { id: "a5", who: "L. Reyes",      action: "logged in",       target: "Admin Portal",       at: "1 hr ago"   },
];

// ── Roles & Permissions ───────────────────────────────────────────────────────

export const ROLES = ["Super Administrator", "Administrator", "Staff"] as const;
export const PERMISSIONS = [
  "Manage Offices",
  "Manage Departments",
  "Manage Maps",
  "Manage QR Codes",
  "Manage Users",
  "View Analytics",
  "Edit Settings",
] as const;

export const defaultRolePerms: Record<string, Record<string, boolean>> = {
  "Super Administrator": Object.fromEntries(PERMISSIONS.map((p) => [p, true])),
  Administrator: {
    "Manage Offices": true, "Manage Departments": true, "Manage Maps": true,
    "Manage QR Codes": true, "Manage Users": false, "View Analytics": true, "Edit Settings": false,
  },
  Staff: {
    "Manage Offices": false, "Manage Departments": false, "Manage Maps": false,
    "Manage QR Codes": true, "Manage Users": false, "View Analytics": true, "Edit Settings": false,
  },
};

// ── Analytics ─────────────────────────────────────────────────────────────────

export const stats = {
  totalOffices: seedOffices.length,
  totalQRCodes: seedQrCodes.length,
  totalVisitors: 12847,
  todayVisitors: 342,
  mostVisited: [
    { name: "Civil Registry Office",        visits: 3421 },
    { name: "Business Permits & Licensing", visits: 2890 },
    { name: "Treasury Office",              visits: 2154 },
    { name: "City Health Office",           visits: 1876 },
    { name: "Assessor's Office",            visits: 1432 },
  ],
  weeklyTrend: [120, 180, 240, 220, 310, 280, 342],
};

export const dailyVisitors = [
  { day: "Mon", visitors: 220 }, { day: "Tue", visitors: 248 },
  { day: "Wed", visitors: 195 }, { day: "Thu", visitors: 270 },
  { day: "Fri", visitors: 312 }, { day: "Sat", visitors: 88  }, { day: "Sun", visitors: 42  },
];

export const monthlyVisitors = [
  { month: "Jan", visitors: 4200 }, { month: "Feb", visitors: 3980 },
  { month: "Mar", visitors: 5120 }, { month: "Apr", visitors: 4760 },
  { month: "May", visitors: 5340 }, { month: "Jun", visitors: 5810 },
];

export const popularDepartments = [
  { name: "Treasurer's",    value: 32 }, { name: "Business Bureau", value: 22 },
  { name: "Civil Registrar", value: 18 }, { name: "Engineering",     value: 14 },
  { name: "Mayor's",         value: 8  }, { name: "Others",          value: 6  },
];

export const peakHours = [
  { hour: "8AM",  scans: 45 }, { hour: "9AM",  scans: 82 }, { hour: "10AM", scans: 96 },
  { hour: "11AM", scans: 78 }, { hour: "12PM", scans: 40 }, { hour: "1PM",  scans: 55 },
  { hour: "2PM",  scans: 88 }, { hour: "3PM",  scans: 72 }, { hour: "4PM",  scans: 59 },
];