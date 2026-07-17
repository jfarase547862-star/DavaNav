// Mock data for DavaNav Solution — Davao City Hall

import type { OfficeService } from '@/types/service';

export type Status = "Active" | "Inactive";

export interface Department {
  id: string;
  name: string;
  description: string;
  head: string;
  floor: string;
  status: Status;
}

export type Floor = {
  floor_id: number;
  building_id: number;
  floor_number: number;
  floor_name: string | null;
  floor_map: string | null;
};
 
export const seedFloors: Floor[] = [
  {
    floor_id: 1,
    building_id: 1,
    floor_number: 1,
    floor_name: 'Ground Lobby',
    floor_map: '/floor-maps/floor-1.png',
  },
  {
    floor_id: 2,
    building_id: 1,
    floor_number: 2,
    floor_name: 'Main Offices',
    floor_map: '/floor-maps/floor-2.png',
  },
  {
    floor_id: 3,
    building_id: 1,
    floor_number: 3,
    floor_name: 'Upper Offices',
    floor_map: '/floor-maps/floor-3.png',
  },
];
 
export function getFloor(floorNumber: number, buildingId = 1) {
  return seedFloors.find(
    (f) => f.floor_number === floorNumber && f.building_id === buildingId,
  );
}
export interface Office {
  id: string;
  name: string;
  shortName?: string;   // add this line
  // Admin fields
  departmentId?: string;
  qrAssigned?: boolean;
  status?: Status;
  // Public/kiosk fields
  internal?: boolean;
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
  id: string;              // qr_id (PK)
  code: string;             // short display code, e.g. "DAVANAV-MAIN-ENT"
  label: string;
  officeId: string | null;  // office_id (FK -> Office.id)
  qrString: string;          // qr_string — the actual encoded URL/payload
  qrImagePath: string;       // qr_image_path — file path to the generated QR image
  status: "Active" | "Inactive";
  scans: number;
  createdAt: string;         // generated_at
}

// Base URL the kiosk resolves when a QR is scanned. Swap for the real
// deployed kiosk domain when wiring this up to production.
export const QR_BASE_URL = "https://davanav.davaocity.gov.ph/kiosk";

export function buildQrString(officeId: string | null) {
  return officeId ? `${QR_BASE_URL}?office=${officeId}` : `${QR_BASE_URL}`;
}

export function buildQrImagePath(code: string) {
  return `/qr-codes/${code}.png`;
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

export interface Building {
  buildingId: string;
  name: string;
}

export interface FloorMap {
  id: string;              // floor_id (PK)
  buildingId: string;      // building_id (FK -> Building.buildingId)
  floor: string;            // existing "1F"/"2F"/"3F" display code, used by
                             // seedNodes/seedDepartments — kept for backward compat
  floorNumber: number;      // floor_number — numeric level, matches Office.floor
  name: string;              // floor_name
  mapImage?: string;         // floor_map — file path to the uploaded floor plan image
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
  { id: "d1",  name: "Ancillary Service Unit",                                        description: "Ancillary and support services.",                            head: "Unit Head",             floor: "1F", status: "Active" },
  { id: "d2",  name: "Barangay and Cultural Communities Affairs Division",             description: "Barangay and cultural community relations.",                 head: "Division Head",         floor: "2F", status: "Active" },
  { id: "d3",  name: "Business Bureau",                                                description: "Business permits and licensing.",                            head: "Bureau Head",           floor: "1F", status: "Active" },
  { id: "d4",  name: "City Accountant's Office",                                       description: "City accounting and financial management.",                  head: "City Accountant",       floor: "3F", status: "Active" },
  { id: "d5",  name: "City Administrator's Office",                                    description: "General administration of city operations.",                 head: "City Administrator",    floor: "3F", status: "Active" },
  { id: "d6",  name: "City Agriculturist's Office",                                    description: "Agricultural programs and food security.",                   head: "City Agriculturist",    floor: "2F", status: "Active" },
  { id: "d7",  name: "City Anti-Drug Abuse Council",                                   description: "Anti-drug programs and advocacy.",                           head: "CADAC Head",            floor: "2F", status: "Active" },
  { id: "d8",  name: "City Archives and Records Office",                               description: "Preservation and management of city records.",               head: "City Archivist",        floor: "1F", status: "Active" },
  { id: "d9",  name: "City Assessor's Office",                                         description: "Real property appraisal and assessment.",                    head: "City Assessor",         floor: "2F", status: "Active" },
  { id: "d10", name: "City Budget Office",                                             description: "City budget preparation and management.",                    head: "City Budget Officer",   floor: "3F", status: "Active" },
  { id: "d11", name: "City College of Davao",                                          description: "Higher education institution of Davao City.",                head: "College President",     floor: "—",  status: "Active" },
  { id: "d12", name: "City Cooperative Development Office",                            description: "Cooperative formation and development.",                     head: "Cooperative Officer",   floor: "2F", status: "Active" },
  { id: "d13", name: "City Economic Enterprise Office",                                description: "Management of city economic enterprises.",                   head: "CEEO Head",             floor: "2F", status: "Active" },
  { id: "d14", name: "City Engineer's Office",                                         description: "Infrastructure, building permits, and engineering services.", head: "City Engineer",         floor: "2F", status: "Active" },
  { id: "d15", name: "City Environment and Natural Resources Office",                  description: "Environmental protection and natural resource management.",   head: "CENRO Head",            floor: "2F", status: "Active" },
  { id: "d16", name: "City General Services Office",                                   description: "General support and maintenance services.",                  head: "GSO Head",              floor: "1F", status: "Active" },
  { id: "d17", name: "City Health Office",                                             description: "Public health programs and medical services.",               head: "City Health Officer",   floor: "1F", status: "Active" },
  { id: "d18", name: "City Information Technology Center",                             description: "IT infrastructure and digital services.",                    head: "CITC Head",             floor: "3F", status: "Active" },
  { id: "d19", name: "City Information Office",                                        description: "Public information and communications.",                     head: "City Information Officer","floor": "1F", status: "Active" },
  { id: "d20", name: "City Legal Office",                                              description: "Legal counsel and services for the city.",                   head: "City Legal Officer",    floor: "3F", status: "Active" },
  { id: "d21", name: "City Library and Information Center",                            description: "Public library and information resources.",                  head: "City Librarian",        floor: "1F", status: "Active" },
  { id: "d22", name: "City Planning and Development Office",                           description: "Urban planning, zoning, and development coordination.",      head: "City Planning Officer", floor: "2F", status: "Active" },
  { id: "d23", name: "City Social Welfare and Development Office",                     description: "Social welfare programs and community development.",         head: "CSWDO Head",            floor: "1F", status: "Active" },
  { id: "d24", name: "City Tourism Operations Office",                                 description: "Tourism promotion and visitor services.",                    head: "Tourism Officer",       floor: "1F", status: "Active" },
  { id: "d25", name: "City Transportation and Traffic Management Office",              description: "Traffic management and transport regulation.",               head: "CTTMO Head",            floor: "2F", status: "Active" },
  { id: "d26", name: "City Treasurer's Office",                                        description: "Tax collection and revenue management.",                     head: "City Treasurer",        floor: "1F", status: "Active" },
  { id: "d27", name: "City Veterinarian's Office",                                     description: "Animal care, veterinary services, and livestock programs.",  head: "City Veterinarian",     floor: "1F", status: "Active" },
  { id: "d28", name: "Civil Registrar's Office",                                       description: "Birth, marriage, and death civil records.",                  head: "City Civil Registrar",  floor: "1F", status: "Active" },
  { id: "d29", name: "Correspondence and Record Division",                             description: "Document routing and official correspondence.",              head: "Division Head",         floor: "2F", status: "Active" },
  { id: "d30", name: "Davao City Central 911 Emergency",                               description: "Centralized emergency response dispatch.",                   head: "Operations Head",       floor: "GF", status: "Active" },
  { id: "d31", name: "Davao City Housing Office",                                      description: "Socialized housing and resettlement programs.",              head: "Housing Officer",       floor: "2F", status: "Active" },
  { id: "d32", name: "Davao City Investment Promotion Center",                         description: "Investment promotion and economic development.",             head: "IPC Head",              floor: "2F", status: "Active" },
  { id: "d33", name: "Davao City Muslim Affairs Office",                               description: "Services and programs for the Muslim community.",            head: "Muslim Affairs Head",   floor: "2F", status: "Active" },
  { id: "d34", name: "Davao City Treatment and Rehabilitation Center for Drug Dependents", description: "Drug rehabilitation and treatment services.",            head: "Center Head",           floor: "—",  status: "Active" },
  { id: "d35", name: "Disaster Risk Reduction and Management Office",                  description: "Disaster preparedness, response, and mitigation.",          head: "DRRMO Head",            floor: "1F", status: "Active" },
  { id: "d36", name: "Educational Benefit System Unit",                                description: "Educational assistance and scholarship management.",         head: "Unit Head",             floor: "2F", status: "Active" },
  { id: "d37", name: "Human Resource Management Office",                               description: "Personnel management and HR services.",                     head: "HRMO Head",             floor: "3F", status: "Active" },
  { id: "d38", name: "Integrated Gender and Development Division",                     description: "Gender-responsive programs and policy mainstreaming.",       head: "Division Head",         floor: "2F", status: "Active" },
  { id: "d39", name: "Internal Audit Service Division",                                description: "Internal audit and fiscal accountability.",                  head: "Division Head",         floor: "3F", status: "Active" },
  { id: "d40", name: "Lingap",                                                         description: "Welfare assistance and livelihood programs.",                head: "Lingap Head",           floor: "1F", status: "Active" },
  { id: "d41", name: "Madrasah Comprehensive Development and Promotion Unit",          description: "Madrasah education development and promotion.",              head: "Unit Head",             floor: "2F", status: "Active" },
  { id: "d42", name: "Museo Dabawenyo",                                                description: "Davao City museum and cultural heritage center.",            head: "Museum Curator",        floor: "GF", status: "Active" },
  { id: "d43", name: "Office for Senior Citizens Affairs",                             description: "Senior citizen services and PWD assistance.",               head: "OSCA Head",             floor: "GF", status: "Active" },
  { id: "d44", name: "Office of the City Building Official",                           description: "Building permits, inspection, and code enforcement.",        head: "City Building Official","floor": "2F", status: "Active" },
  { id: "d45", name: "Peace 911",                                                      description: "Peace and order emergency response.",                        head: "Peace 911 Head",        floor: "GF", status: "Active" },
  { id: "d46", name: "Public Employment Service Office",                               description: "Employment facilitation and job placement services.",        head: "PESO Manager",          floor: "1F", status: "Active" },
  { id: "d47", name: "Public Safety and Security Office",                              description: "Public safety enforcement and security management.",         head: "PSSO Head",             floor: "1F", status: "Active" },
  { id: "d48", name: "Sangguniang Panlungsod",                                         description: "City legislative council.",                                  head: "City Council Secretary","floor": "3F", status: "Active" },
  { id: "d49", name: "Sports Development Division",                                    description: "Sports programs and athletic development.",                  head: "Division Head",         floor: "2F", status: "Active" },
  { id: "d50", name: "Vices Regulation Unit",                                          description: "Regulation of vices and related establishments.",            head: "Unit Head",             floor: "1F", status: "Active" },
];

export const departments = seedDepartments.map((d) => d.name);

// ── Offices ───────────────────────────────────────────────────────────────────

export const seedOffices: Office[] = [
  {
    id: "ancillary-service-unit",
    name: "Ancillary Service Unit",
    department: "Ancillary Service Unit",
    departmentId: "d1",
    floor: 1,
    internal: true,
    room: "Room 102",
    status: "Active",
    qrAssigned: false,
    description: "Provides ancillary and general support services for the city hall operations.",
    services: ["Support Services", "Maintenance Coordination", "Utility Management"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1001",
    email: "asu@davaocity.gov.ph",
    head: "Unit Head",
    coords: { x: 10, y: 80 },
  },
  {
    id: "barangay-cultural-affairs",
    name: "Barangay and Cultural Communities Affairs Division",
    department: "Barangay and Cultural Communities Affairs Division",
    departmentId: "d2",
    floor: 2,
    internal: true,
    room: "Room 202",
    status: "Active",
    qrAssigned: false,
    description: "Handles barangay relations and programs for cultural community groups in Davao City.",
    services: ["Barangay Coordination", "Cultural Programs", "Indigenous Peoples Affairs"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1002",
    email: "bcca@davaocity.gov.ph",
    head: "Division Head",
    coords: { x: 20, y: 30 },
  },
  {
    id: "business-bureau",
    name: "Business Bureau",
    department: "Business Bureau",
    departmentId: "d3",
    floor: 1,
    internal: true,
    room: "Room 120",
    status: "Active",
    qrAssigned: true,
    description: "Issuance and renewal of business permits and licenses for Davao City.",
    services: ["New Business Permit", "Business Permit Renewal", "Closure Permit", "Mayor's Permit"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1003",
    email: "bb@davaocity.gov.ph",
    head: "Bureau Head",
    coords: { x: 30, y: 80 },
  },
  {
    id: "city-accountants-office",
    name: "City Accountant's Office",
    department: "City Accountant's Office",
    departmentId: "d4",
    floor: 3,
    internal: true,
    room: "Room 301",
    status: "Active",
    qrAssigned: false,
    description: "Manages city accounting, financial records, and disbursements.",
    services: ["Financial Reporting", "Disbursement", "Pre-Audit", "Payroll Processing"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1004",
    email: "accounting@davaocity.gov.ph",
    head: "City Accountant",
    coords: { x: 10, y: 20 },
  },
  {
    id: "city-administrators-office",
    name: "City Administrator's Office",
    department: "City Administrator's Office",
    departmentId: "d5",
    floor: 3,
    internal: true,
    room: "Room 302",
    status: "Active",
    qrAssigned: false,
    description: "Oversees general administration and coordinates all city government operations.",
    services: ["Administrative Coordination", "Policy Implementation", "Inter-office Liaison"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1005",
    email: "administrator@davaocity.gov.ph",
    head: "City Administrator",
    coords: { x: 20, y: 20 },
  },
  {
    id: "city-agriculturists-office",
    name: "City Agriculturist's Office",
    department: "City Agriculturist's Office",
    departmentId: "d6",
    floor: 2,
    internal: true,
    room: "Room 203",
    status: "Active",
    qrAssigned: false,
    description: "Promotes agricultural development, food security, and farmer welfare in Davao City.",
    services: ["Agricultural Extension", "Farmers Assistance", "Food Security Programs", "Crop Production Support"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1006",
    email: "agriculture@davaocity.gov.ph",
    head: "City Agriculturist",
    coords: { x: 30, y: 30 },
  },
  {
    id: "city-anti-drug-abuse-council",
    name: "City Anti-Drug Abuse Council",
    department: "City Anti-Drug Abuse Council",
    departmentId: "d7",
    floor: 2,
    internal: true,
    room: "Room 204",
    status: "Active",
    qrAssigned: false,
    description: "Leads anti-drug advocacy, prevention programs, and coordination with law enforcement.",
    services: ["Drug Prevention Programs", "Community Advocacy", "Rehabilitation Referral"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1007",
    email: "cadac@davaocity.gov.ph",
    head: "CADAC Head",
    coords: { x: 40, y: 30 },
  },
  {
    id: "city-archives-records-office",
    name: "City Archives and Records Office",
    department: "City Archives and Records Office",
    departmentId: "d8",
    floor: 1,
    internal: true,
    room: "Room 103",
    status: "Active",
    qrAssigned: false,
    description: "Preserves, manages, and provides access to official city government records and archives.",
    services: ["Records Retrieval", "Document Certification", "Archives Access", "Records Management"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1008",
    email: "archives@davaocity.gov.ph",
    head: "City Archivist",
    coords: { x: 40, y: 80 },
  },
  {
    id: "city-assessors-office",
    name: "City Assessor's Office",
    department: "City Assessor's Office",
    departmentId: "d9",
    floor: 2,
    internal: true,
    room: "Room 205",
    status: "Active",
    qrAssigned: true,
    description: "Appraisal and assessment of real property for taxation purposes in Davao City.",
    services: ["Tax Declaration", "Property Assessment", "Transfer of Ownership", "Property Records"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1009",
    email: "assessor@davaocity.gov.ph",
    head: "City Assessor",
    coords: { x: 50, y: 30 },
  },
  {
    id: "city-budget-office",
    name: "City Budget Office",
    department: "City Budget Office",
    departmentId: "d10",
    floor: 3,
    internal: true,
    room: "Room 303",
    status: "Active",
    qrAssigned: false,
    description: "Prepares and manages the annual city budget and monitors fund utilization.",
    services: ["Budget Preparation", "Fund Allocation", "Budget Monitoring", "Financial Planning"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1010",
    email: "budget@davaocity.gov.ph",
    head: "City Budget Officer",
    coords: { x: 30, y: 20 },
  },
  {
    id: "city-college-of-davao",
    name: "City College of Davao",
    department: "City College of Davao",
    departmentId: "d11",
    floor: 1,
    internal: true,
    room: "Admin Building",
    status: "Active",
    qrAssigned: false,
    description: "City-run higher education institution offering affordable tertiary education to Davao residents.",
    services: ["Enrollment", "Scholarships", "Academic Records", "Student Services"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1011",
    email: "ccd@davaocity.gov.ph",
    head: "College President",
    coords: { x: 50, y: 80 },
  },
  {
    id: "city-cooperative-development-office",
    name: "City Cooperative Development Office",
    department: "City Cooperative Development Office",
    departmentId: "d12",
    floor: 2,
    internal: true,
    room: "Room 206",
    status: "Active",
    qrAssigned: false,
    description: "Promotes cooperative formation, registration, and development in the city.",
    services: ["Cooperative Registration", "Training", "Technical Assistance", "Cooperative Financing"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1012",
    email: "cooperative@davaocity.gov.ph",
    head: "Cooperative Officer",
    coords: { x: 60, y: 30 },
  },
  {
    id: "city-economic-enterprise-office",
    name: "City Economic Enterprise Office",
    department: "City Economic Enterprise Office",
    departmentId: "d13",
    floor: 2,
    internal: true,
    room: "Room 207",
    status: "Active",
    qrAssigned: false,
    description: "Manages city-owned economic enterprises and public markets.",
    services: ["Market Stall Management", "Enterprise Monitoring", "Revenue Management"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1013",
    email: "ceeo@davaocity.gov.ph",
    head: "CEEO Head",
    coords: { x: 70, y: 30 },
  },
  {
    id: "city-engineers-office",
    name: "City Engineer's Office",
    department: "City Engineer's Office",
    departmentId: "d14",
    floor: 2,
    internal: true,
    room: "Room 210",
    status: "Active",
    qrAssigned: true,
    description: "Building permits, infrastructure projects, and engineering services for the city.",
    services: ["Building Permit", "Occupancy Permit", "Infrastructure Planning", "Engineering Inspection"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1014",
    email: "engineering@davaocity.gov.ph",
    head: "City Engineer",
    coords: { x: 80, y: 30 },
  },
  {
    id: "city-environment-natural-resources-office",
    name: "City Environment and Natural Resources Office",
    department: "City Environment and Natural Resources Office",
    departmentId: "d15",
    floor: 2,
    internal: true,
    room: "Room 208",
    status: "Active",
    qrAssigned: false,
    description: "Oversees environmental protection and natural resource conservation in Davao City.",
    services: ["Environmental Clearance", "Tree Cutting Permit", "Environmental Programs", "Waste Management"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1015",
    email: "cenro@davaocity.gov.ph",
    head: "CENRO Head",
    coords: { x: 90, y: 30 },
  },
  {
    id: "city-general-services-office",
    name: "City General Services Office",
    department: "City General Services Office",
    departmentId: "d16",
    floor: 1,
    internal: true,
    room: "Room 104",
    status: "Active",
    qrAssigned: false,
    description: "Manages city properties, equipment, and general maintenance services.",
    services: ["Property Management", "Procurement", "Equipment Maintenance", "Janitorial Services"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1016",
    email: "gso@davaocity.gov.ph",
    head: "GSO Head",
    coords: { x: 60, y: 80 },
  },
  {
    id: "city-health-office",
    name: "City Health Office",
    department: "City Health Office",
    departmentId: "d17",
    floor: 1,
    internal: true,
    room: "Room 110",
    status: "Active",
    qrAssigned: true,
    description: "Public health programs, clinics, sanitary permits, and health certifications.",
    services: ["Medical Certificate", "Vaccination", "Health Card", "Sanitary Permit", "Prenatal Care"],
    hours: "Mon–Fri, 7:00 AM – 5:00 PM",
    contact: "(082) 227-1017",
    email: "health@davaocity.gov.ph",
    head: "City Health Officer",
    coords: { x: 70, y: 80 },
  },
  {
    id: "city-information-technology-center",
    name: "City Information Technology Center",
    department: "City Information Technology Center",
    departmentId: "d18",
    floor: 3,
    internal: true,
    room: "Room 304",
    status: "Active",
    qrAssigned: false,
    description: "Manages the city's IT infrastructure, digital systems, and online services.",
    services: ["System Support", "Network Management", "E-Government Services", "Data Management"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1018",
    email: "citc@davaocity.gov.ph",
    head: "CITC Head",
    coords: { x: 40, y: 20 },
  },
  {
    id: "city-information-office",
    name: "City Information Office",
    department: "City Information Office",
    departmentId: "d19",
    floor: 1,
    internal: true,
    room: "Room 105",
    status: "Active",
    qrAssigned: false,
    description: "Handles public information, media relations, and official communications of the city.",
    services: ["Press Releases", "Public Announcements", "Media Coordination", "Publication"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1019",
    email: "info@davaocity.gov.ph",
    head: "City Information Officer",
    coords: { x: 80, y: 80 },
  },
  {
    id: "city-legal-office",
    name: "City Legal Office",
    department: "City Legal Office",
    departmentId: "d20",
    floor: 3,
    internal: true,
    room: "Room 305",
    status: "Active",
    qrAssigned: false,
    description: "Provides legal counsel, opinions, and representation for the city government.",
    services: ["Legal Consultation", "Contract Review", "Legal Opinions", "Litigation Support"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1020",
    email: "legal@davaocity.gov.ph",
    head: "City Legal Officer",
    coords: { x: 50, y: 20 },
  },
  {
    id: "city-library-information-center",
    name: "City Library and Information Center",
    department: "City Library and Information Center",
    departmentId: "d21",
    floor: 1,
    internal: true,
    room: "Room 106",
    status: "Active",
    qrAssigned: false,
    description: "Public library offering reading materials, research resources, and information services.",
    services: ["Library Access", "Research Assistance", "Book Lending", "Digital Resources"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1021",
    email: "library@davaocity.gov.ph",
    head: "City Librarian",
    coords: { x: 90, y: 80 },
  },
  {
    id: "city-planning-development-office",
    name: "City Planning and Development Office",
    department: "City Planning and Development Office",
    departmentId: "d22",
    floor: 2,
    internal: true,
    room: "Room 209",
    status: "Active",
    qrAssigned: true,
    description: "Zoning clearances, land use planning, and development coordination for Davao City.",
    services: ["Zoning Clearance", "Land Use Planning", "Development Permit", "Zoning Certification"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1022",
    email: "cpdo@davaocity.gov.ph",
    head: "City Planning Officer",
    coords: { x: 10, y: 30 },
  },
  {
    id: "city-social-welfare-development-office",
    name: "City Social Welfare and Development Office",
    department: "City Social Welfare and Development Office",
    departmentId: "d23",
    floor: 1,
    internal: true,
    room: "Room 115",
    status: "Active",
    qrAssigned: true,
    description: "Social welfare programs, assistance to indigents, and protective services for vulnerable residents.",
    services: ["Financial Assistance", "Solo Parent ID", "PWD ID", "4Ps Coordination", "AICS"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1023",
    email: "cswdo@davaocity.gov.ph",
    head: "CSWDO Head",
    coords: { x: 10, y: 70 },
  },
  {
    id: "city-tourism-operations-office",
    name: "City Tourism Operations Office",
    department: "City Tourism Operations Office",
    departmentId: "d24",
    floor: 1,
    internal: true,
    room: "Room 107",
    status: "Active",
    qrAssigned: false,
    description: "Tourism promotion, accreditation of establishments, and visitor information services.",
    services: ["Tourism Accreditation", "Visitor Information", "Event Coordination", "Tourism Promotion"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1024",
    email: "tourism@davaocity.gov.ph",
    head: "Tourism Officer",
    coords: { x: 20, y: 70 },
  },
  {
    id: "city-transportation-traffic-management-office",
    name: "City Transportation and Traffic Management Office",
    department: "City Transportation and Traffic Management Office",
    departmentId: "d25",
    floor: 2,
    internal: true,
    room: "Room 211",
    status: "Active",
    qrAssigned: false,
    description: "Traffic management, transport regulation, and road safety enforcement.",
    services: ["Franchise Permit", "Traffic Violation", "Transport Regulation", "Road Safety Programs"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1025",
    email: "cttmo@davaocity.gov.ph",
    head: "CTTMO Head",
    coords: { x: 30, y: 70 },
  },
  {
    id: "city-treasurers-office",
    name: "City Treasurer's Office",
    department: "City Treasurer's Office",
    departmentId: "d26",
    floor: 1,
    internal: true,
    room: "Room 110",
    status: "Active",
    qrAssigned: true,
    description: "Collection of local taxes, fees, and other government revenues.",
    services: ["Real Property Tax", "Business Tax", "Community Tax Certificate", "Revenue Collection"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1026",
    email: "treasurer@davaocity.gov.ph",
    head: "City Treasurer",
    coords: { x: 40, y: 70 },
  },
  {
    id: "city-veterinarians-office",
    name: "City Veterinarian's Office",
    department: "City Veterinarian's Office",
    departmentId: "d27",
    floor: 1,
    internal: true,
    room: "Room 108",
    status: "Active",
    qrAssigned: false,
    description: "Animal care, veterinary services, livestock programs, and rabies control.",
    services: ["Veterinary Services", "Animal Vaccination", "Livestock Programs", "Rabies Control"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1027",
    email: "veterinarian@davaocity.gov.ph",
    head: "City Veterinarian",
    coords: { x: 50, y: 70 },
  },
  {
    id: "civil-registrars-office",
    name: "Civil Registrar's Office",
    department: "Civil Registrar's Office",
    departmentId: "d28",
    floor: 1,
    internal: true,
    room: "Room 105",
    status: "Active",
    qrAssigned: true,
    description: "Handles birth, marriage, and death certificates and related civil documents for Davao City residents.",
    services: ["Birth Certificate", "Marriage Certificate", "Death Certificate", "CENOMAR", "Late Registration"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1028",
    email: "civilregistrar@davaocity.gov.ph",
    head: "City Civil Registrar",
    coords: { x: 60, y: 70 },
  },
  {
    id: "correspondence-record-division",
    name: "Correspondence and Record Division",
    department: "Correspondence and Record Division",
    departmentId: "d29",
    floor: 2,
    internal: true,
    room: "Room 212",
    status: "Active",
    qrAssigned: false,
    description: "Manages official correspondence routing and document records for the city government.",
    services: ["Document Routing", "Official Correspondence", "Record Filing", "Mail Management"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1029",
    email: "records@davaocity.gov.ph",
    head: "Division Head",
    coords: { x: 80, y: 70 },
  },
  {
    id: "davao-city-central-911",
    name: "Davao City Central 911 Emergency",
    department: "Davao City Central 911 Emergency",
    departmentId: "d30",
    floor: 1,
    internal: true,
    room: "Room GF-001",
    status: "Active",
    qrAssigned: true,
    description: "Centralized emergency response dispatch for police, fire, and medical assistance in Davao City.",
    services: ["Emergency Dispatch", "Police Coordination", "Fire Response", "Medical Emergency"],
    hours: "24/7",
    contact: "911",
    email: "central911@davaocity.gov.ph",
    head: "Operations Head",
    coords: { x: 90, y: 70 },
  },
  {
    id: "davao-city-housing-office",
    name: "Davao City Housing Office",
    department: "Davao City Housing Office",
    departmentId: "d31",
    floor: 2,
    internal: true,
    room: "Room 213",
    status: "Active",
    qrAssigned: false,
    description: "Implements socialized housing programs and resettlement for informal settler families.",
    services: ["Housing Application", "Resettlement Programs", "Housing Assistance", "Lot Allocation"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1031",
    email: "housing@davaocity.gov.ph",
    head: "Housing Officer",
    coords: { x: 10, y: 50 },
  },
  {
    id: "davao-city-investment-promotion-center",
    name: "Davao City Investment Promotion Center",
    department: "Davao City Investment Promotion Center",
    departmentId: "d32",
    floor: 2,
    internal: true,
    room: "Room 214",
    status: "Active",
    qrAssigned: false,
    description: "Promotes investment opportunities and facilitates business development in Davao City.",
    services: ["Investment Facilitation", "Business Matching", "Incentive Processing", "Investor Assistance"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1032",
    email: "ipc@davaocity.gov.ph",
    head: "IPC Head",
    coords: { x: 20, y: 50 },
  },
  {
    id: "davao-city-muslim-affairs-office",
    name: "Davao City Muslim Affairs Office",
    department: "Davao City Muslim Affairs Office",
    departmentId: "d33",
    floor: 2,
    internal: true,
    room: "Room 215",
    status: "Active",
    qrAssigned: false,
    description: "Provides services and programs addressing the needs of the Muslim community in Davao City.",
    services: ["Muslim Community Services", "Halal Certification Assistance", "Cultural Programs", "Community Coordination"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1033",
    email: "muslimaffairs@davaocity.gov.ph",
    head: "Muslim Affairs Head",
    coords: { x: 30, y: 50 },
  },
  {
    id: "davao-city-treatment-rehabilitation-center",
    name: "Davao City Treatment and Rehabilitation Center for Drug Dependents",
    department: "Davao City Treatment and Rehabilitation Center for Drug Dependents",
    departmentId: "d34",
    floor: 1,
    internal: true,
    room: "Rehabilitation Building",
    status: "Active",
    qrAssigned: false,
    description: "Provides drug treatment and rehabilitation services for drug dependents in Davao City.",
    services: ["Drug Rehabilitation", "Counseling", "Aftercare Programs", "Family Support"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1034",
    email: "rehab@davaocity.gov.ph",
    head: "Center Head",
    coords: { x: 40, y: 50 },
  },
  {
    id: "disaster-risk-reduction-management-office",
    name: "Disaster Risk Reduction and Management Office",
    department: "Disaster Risk Reduction and Management Office",
    departmentId: "d35",
    floor: 1,
    internal: true,
    room: "Room 109",
    status: "Active",
    qrAssigned: false,
    description: "Leads city-wide disaster preparedness, response, rehabilitation, and mitigation programs.",
    services: ["Disaster Preparedness", "Emergency Response", "Evacuation Coordination", "Hazard Mapping"],
    hours: "24/7",
    contact: "(082) 227-1035",
    email: "drrmo@davaocity.gov.ph",
    head: "DRRMO Head",
    coords: { x: 50, y: 50 },
  },
  {
    id: "educational-benefit-system-unit",
    name: "Educational Benefit System Unit",
    department: "Educational Benefit System Unit",
    departmentId: "d36",
    floor: 2,
    internal: true,
    room: "Room 216",
    status: "Active",
    qrAssigned: false,
    description: "Manages educational assistance, scholarships, and financial benefits for Davao City students.",
    services: ["Scholarship Application", "Educational Assistance", "Beneficiary Enrollment", "Grants Management"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1036",
    email: "ebsu@davaocity.gov.ph",
    head: "Unit Head",
    coords: { x: 60, y: 50 },
  },
  {
    id: "human-resource-management-office",
    name: "Human Resource Management Office",
    department: "Human Resource Management Office",
    departmentId: "d37",
    floor: 3,
    internal: true,
    room: "Room 306",
    status: "Active",
    qrAssigned: false,
    description: "Manages personnel records, recruitment, appointments, and employee welfare programs.",
    services: ["Appointment Processing", "Leave Management", "Personnel Records", "Employee Benefits"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1037",
    email: "hrmo@davaocity.gov.ph",
    head: "HRMO Head",
    coords: { x: 60, y: 20 },
  },
  {
    id: "integrated-gender-development-division",
    name: "Integrated Gender and Development Division",
    department: "Integrated Gender and Development Division",
    departmentId: "d38",
    floor: 2,
    internal: true,
    room: "Room 217",
    status: "Active",
    qrAssigned: false,
    description: "Mainstreams gender-responsive policies and programs across all city government offices.",
    services: ["Gender Sensitivity Training", "GAD Planning", "Women's Programs", "Policy Advocacy"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1038",
    email: "igdd@davaocity.gov.ph",
    head: "Division Head",
    coords: { x: 70, y: 50 },
  },
  {
    id: "internal-audit-service-division",
    name: "Internal Audit Service Division",
    department: "Internal Audit Service Division",
    departmentId: "d39",
    floor: 3,
    internal: true,
    room: "Room 307",
    status: "Active",
    qrAssigned: false,
    description: "Conducts internal audits to ensure fiscal accountability and compliance with regulations.",
    services: ["Internal Audit", "Compliance Review", "Financial Inspection", "Risk Assessment"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1039",
    email: "iasd@davaocity.gov.ph",
    head: "Division Head",
    coords: { x: 70, y: 20 },
  },
  {
    id: "lingap",
    name: "Lingap",
    department: "Lingap",
    departmentId: "d40",
    floor: 1,
    internal: true,
    room: "Room 111",
    status: "Active",
    qrAssigned: false,
    description: "Provides welfare assistance, livelihood support, and relief services to marginalized residents.",
    services: ["Welfare Assistance", "Livelihood Programs", "Relief Distribution", "Crisis Intervention"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1040",
    email: "lingap@davaocity.gov.ph",
    head: "Lingap Head",
    coords: { x: 80, y: 50 },
  },
  {
    id: "madrasah-development-promotion-unit",
    name: "Madrasah Comprehensive Development and Promotion Unit",
    department: "Madrasah Comprehensive Development and Promotion Unit",
    departmentId: "d41",
    floor: 2,
    internal: true,
    room: "Room 218",
    status: "Active",
    qrAssigned: false,
    description: "Supports the development and promotion of madrasah education in Davao City.",
    services: ["Madrasah Support", "Teacher Training", "Curriculum Assistance", "Educational Programs"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1041",
    email: "madrasah@davaocity.gov.ph",
    head: "Unit Head",
    coords: { x: 90, y: 50 },
  },
  {
    id: "museo-dabawenyo",
    name: "Museo Dabawenyo",
    department: "Museo Dabawenyo",
    departmentId: "d42",
    floor: 1,
    internal: true,
    room: "GF – Museum Building",
    status: "Active",
    qrAssigned: false,
    description: "Davao City's official museum showcasing cultural heritage, history, and indigenous traditions.",
    services: ["Museum Tours", "Cultural Exhibits", "Heritage Programs", "Educational Visits"],
    hours: "Mon–Sat, 9:00 AM – 5:00 PM",
    contact: "(082) 227-1042",
    email: "museo@davaocity.gov.ph",
    head: "Museum Curator",
    coords: { x: 10, y: 90 },
  },
  {
    id: "office-for-senior-citizens-affairs",
    name: "Office for Senior Citizens Affairs",
    department: "Office for Senior Citizens Affairs",
    departmentId: "d43",
    floor: 1,
    internal: true,
    room: "Room GF-04",
    status: "Active",
    qrAssigned: true,
    description: "Issuance of senior citizen and PWD identification cards and delivery of related benefits.",
    services: ["Senior Citizen ID", "PWD ID", "Discount Booklet", "Senior Citizen Benefits"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1043",
    email: "osca@davaocity.gov.ph",
    head: "OSCA Head",
    coords: { x: 20, y: 90 },
  },
  {
    id: "office-city-building-official",
    name: "Office of the City Building Official",
    department: "Office of the City Building Official",
    departmentId: "d44",
    floor: 2,
    internal: true,
    room: "Room 219",
    status: "Active",
    qrAssigned: false,
    description: "Issues building permits and enforces the National Building Code within Davao City.",
    services: ["Building Permit", "Demolition Permit", "Fencing Permit", "Building Inspection", "Occupancy Permit"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1044",
    email: "buildingofficial@davaocity.gov.ph",
    head: "City Building Official",
    coords: { x: 30, y: 90 },
  },
  {
    id: "peace-911",
    name: "Peace 911",
    department: "Peace 911",
    departmentId: "d45",
    floor: 1,
    room: "Room GF-05",
    status: "Active",
    qrAssigned: false,
    description: "Rapid peace and order response unit providing community safety and conflict resolution.",
    services: ["Emergency Response", "Community Patrol", "Conflict Mediation", "Peace and Order"],
    hours: "24/7",
    contact: "(082) 227-1045",
    email: "peace911@davaocity.gov.ph",
    head: "Peace 911 Head",
    coords: { x: 40, y: 90 },
  },
  {
    id: "public-employment-service-office",
    name: "Public Employment Service Office",
    department: "Public Employment Service Office",
    departmentId: "d46",
    floor: 1,
    internal: true,
    room: "Room 112",
    status: "Active",
    qrAssigned: false,
    description: "Facilitates job placement, employment coordination, and labor market information services.",
    services: ["Job Placement", "Job Fair", "Employment Referral", "Labor Market Info"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1046",
    email: "peso@davaocity.gov.ph",
    head: "PESO Manager",
    coords: { x: 50, y: 90 },
  },
  {
    id: "public-safety-security-office",
    name: "Public Safety and Security Office",
    department: "Public Safety and Security Office",
    departmentId: "d47",
    floor: 1,
    internal: true,
    room: "Room 113",
    status: "Active",
    qrAssigned: false,
    description: "Enforces public safety, manages security personnel, and coordinates law enforcement programs.",
    services: ["Security Management", "Safety Inspections", "Community Safety Programs", "Watchdog Services"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1047",
    email: "psso@davaocity.gov.ph",
    head: "PSSO Head",
    coords: { x: 60, y: 90 },
  },
  {
    id: "sangguniang-panlungsod",
    name: "Sangguniang Panlungsod",
    department: "Sangguniang Panlungsod",
    departmentId: "d48",
    floor: 3,
    internal: true,
    room: "Room 310",
    status: "Active",
    qrAssigned: false,
    description: "The legislative body of Davao City responsible for enacting local ordinances and resolutions.",
    services: ["Ordinance Filing", "Resolution Requests", "Legislative Sessions", "Public Hearings"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1048",
    email: "sp@davaocity.gov.ph",
    head: "City Council Secretary",
    coords: { x: 80, y: 20 },
  },
  {
    id: "sports-development-division",
    name: "Sports Development Division",
    department: "Sports Development Division",
    departmentId: "d49",
    floor: 2,
    internal: true,
    room: "Room 220",
    status: "Active",
    qrAssigned: false,
    description: "Develops sports programs, manages athletic training, and promotes sports culture in Davao City.",
    services: ["Sports Registration", "Athletic Training", "Sports Events", "Facility Booking"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1049",
    email: "sports@davaocity.gov.ph",
    head: "Division Head",
    coords: { x: 70, y: 90 },
  },
  {
    id: "vices-regulation-unit",
    name: "Vices Regulation Unit",
    department: "Vices Regulation Unit",
    departmentId: "d50",
    floor: 1,
    internal: true,
    room: "Room 114",
    status: "Active",
    qrAssigned: false,
    description: "Regulates establishments involved in vices and enforces related city ordinances.",
    services: ["Establishment Regulation", "Permit Inspection", "Compliance Monitoring", "Ordinance Enforcement"],
    hours: "Mon–Fri, 8:00 AM – 5:00 PM",
    contact: "(082) 227-1050",
    email: "vru@davaocity.gov.ph",
    head: "Unit Head",
    coords: { x: 80, y: 90 },
  },
];

export function getOffice(id: string) {
  return seedOffices.find((o) => o.id === id);
}

// ── Office Services (data dictionary) ─────────────────────────────────────────

export type { OfficeService };

const DEFAULT_SERVICE_REQUIREMENTS =
  'Valid government-issued ID, completed application form, and any supporting documents listed by the office.';
const DEFAULT_SERVICE_PROCESSING_TIME = '1–3 working days';

export const officeNumericIds: Record<string, number> = Object.fromEntries(
  seedOffices.map((office, index) => [office.id, index + 1]),
);

function buildServiceRecord(
  serviceId: number,
  officeId: number,
  serviceName: string,
  status: OfficeService['status'] = 'Active',
): OfficeService {
  return {
    service_id: serviceId,
    office_id: officeId,
    service_name: serviceName,
    description: `Processing and issuance support for ${serviceName.toLowerCase()} at this office branch.`,
    requirements: DEFAULT_SERVICE_REQUIREMENTS,
    processing_time: DEFAULT_SERVICE_PROCESSING_TIME,
    status,
  };
}

export const seedServices: OfficeService[] = seedOffices.flatMap((office, officeIndex) => {
  const officeId = officeIndex + 1;
  return (office.services ?? []).map((serviceName, serviceIndex) =>
    buildServiceRecord(officeId * 100 + serviceIndex + 1, officeId, serviceName),
  );
});

export function getOfficeNumericId(officeId: string): number | undefined {
  return officeNumericIds[officeId];
}

export function getServicesForOffice(officeId: string): OfficeService[] {
  const numericId = getOfficeNumericId(officeId);
  if (!numericId) return [];
  return seedServices.filter((service) => service.office_id === numericId);
}

export function getActiveServicesForOffice(officeId: string): OfficeService[] {
  return getServicesForOffice(officeId).filter((service) => service.status === 'Active');
}

export function getServiceNamesForOffice(officeId: string): string[] {
  return getServicesForOffice(officeId).map((service) => service.service_name);
}

export const FLOOR_LAYOUT = {
  entrance: { x: 1, y: 5 },
  stairs: { x: 7, y: 4 },
  elevator: { x: 6, y: 5 },
} as const;

// `search.tsx` expects an `offices` export (not `seedOffices`) where each
// office has an `isInternal` flag — true for offices physically located
// inside City Hall (navigable on the floor map), false for offices that
// are off-site / external (e.g. City College, Museo Dabawenyo, the
// rehab center) which should instead show "Accessibility Info" rather
// than turn-by-turn navigation.
const EXTERNAL_OFFICE_IDS = new Set([
  "city-college-of-davao",
  "museo-dabawenyo",
  "davao-city-treatment-rehabilitation-center",
  "davao-city-central-911",
  "peace-911",
]);

export const offices: (Office & { isInternal: boolean })[] = seedOffices.map((o) => ({
  ...o,
  isInternal: !EXTERNAL_OFFICE_IDS.has(o.id),
}));

// ── QR Codes ──────────────────────────────────────────────────────────────────

export const seedQrCodes: QrCode[] = [
  { id: "q1", code: "DAVANAV-MAIN-ENT",  label: "Main Entrance",           officeId: null,                                  qrString: buildQrString(null),                                  qrImagePath: buildQrImagePath("DAVANAV-MAIN-ENT"),  status: "Active", scans: 412, createdAt: "2025-05-01" },
  { id: "q2", code: "DAVANAV-GF-LOBBY",  label: "Ground Floor Lobby",      officeId: null,                                  qrString: buildQrString(null),                                  qrImagePath: buildQrImagePath("DAVANAV-GF-LOBBY"),  status: "Active", scans: 305, createdAt: "2025-05-01" },
  { id: "q3", code: "DAVANAV-TREAS-01",  label: "City Treasurer's Office", officeId: "city-treasurers-office",              qrString: buildQrString("city-treasurers-office"),              qrImagePath: buildQrImagePath("DAVANAV-TREAS-01"),  status: "Active", scans: 198, createdAt: "2025-05-04" },
  { id: "q4", code: "DAVANAV-HLTH-01",   label: "City Health Office",      officeId: "city-health-office",                  qrString: buildQrString("city-health-office"),                  qrImagePath: buildQrImagePath("DAVANAV-HLTH-01"),   status: "Active", scans: 175, createdAt: "2025-05-04" },
  { id: "q5", code: "DAVANAV-ENGR-01",   label: "City Engineer's Office",  officeId: "city-engineers-office",               qrString: buildQrString("city-engineers-office"),               qrImagePath: buildQrImagePath("DAVANAV-ENGR-01"),   status: "Active", scans: 142, createdAt: "2025-05-10" },
  { id: "q6", code: "DAVANAV-CIVIL-01",  label: "Civil Registrar's Office",officeId: "civil-registrars-office",             qrString: buildQrString("civil-registrars-office"),             qrImagePath: buildQrImagePath("DAVANAV-CIVIL-01"),  status: "Active", scans: 321, createdAt: "2025-05-10" },
  { id: "q7", code: "DAVANAV-BSNSS-01",  label: "Business Bureau",         officeId: "business-bureau",                     qrString: buildQrString("business-bureau"),                     qrImagePath: buildQrImagePath("DAVANAV-BSNSS-01"),  status: "Active", scans: 289, createdAt: "2025-05-12" },
  { id: "q8", code: "DAVANAV-OSCA-01",   label: "Senior Citizens Affairs", officeId: "office-for-senior-citizens-affairs",  qrString: buildQrString("office-for-senior-citizens-affairs"),  qrImagePath: buildQrImagePath("DAVANAV-OSCA-01"),   status: "Active", scans: 210, createdAt: "2025-05-15" },
];

// ── Users ─────────────────────────────────────────────────────────────────────

export const seedUsers: User[] = [
  { id: "u1", name: "Maria Santos",   email: "msantos@davaocity.gov.ph", role: "Super Administrator", status: "Active",   lastLogin: "2026-06-26 08:14" },
  { id: "u2", name: "Juan dela Cruz", email: "jcruz@davaocity.gov.ph",   role: "Administrator",       status: "Active",   lastLogin: "2026-06-25 17:02" },
  { id: "u3", name: "Liza Reyes",     email: "lreyes@davaocity.gov.ph",  role: "Staff",               status: "Active",   lastLogin: "2026-06-26 09:31" },
  { id: "u4", name: "Pedro Lim",      email: "plim@davaocity.gov.ph",    role: "Staff",               status: "Inactive", lastLogin: "2026-05-10 10:11" },
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

// ── Buildings ─────────────────────────────────────────────────────────────────

export const seedBuildings: Building[] = [
  { buildingId: "b1", name: "Davao City Hall" },
];

// ── Floor Maps ────────────────────────────────────────────────────────────────

export const seedFloorMaps: FloorMap[] = [
  { id: "f1", buildingId: "b1", floor: "1F", floorNumber: 1, name: "Ground Floor Plan", mapImage: "/floor-maps/floor-1.png", uploaded: "2025-04-12", status: "Active" },
  { id: "f2", buildingId: "b1", floor: "2F", floorNumber: 2, name: "Second Floor Plan", mapImage: "/floor-maps/floor-2.png", uploaded: "2025-04-12", status: "Active" },
  { id: "f3", buildingId: "b1", floor: "3F", floorNumber: 3, name: "Third Floor Plan",  mapImage: "/floor-maps/floor-3.png", uploaded: "2025-04-12", status: "Active" },
];

export function getFloorMap(floorNumber: number, buildingId = "b1") {
  return seedFloorMaps.find(
    (f) => f.floorNumber === floorNumber && f.buildingId === buildingId,
  );
}

// ── Notifications ─────────────────────────────────────────────────────────────

export const seedNotifications: Notification[] = [
  { id: "nt1", title: "New QR generated", message: "QR for Cashier Window B was generated.", type: "success", read: false, createdAt: "2026-06-26 09:10" },
  { id: "nt2", title: "Floor map updated", message: "2F plan replaced by J. Cruz.",           type: "info",    read: false, createdAt: "2026-06-26 08:42" },
  { id: "nt3", title: "New user added",    message: "Liza Reyes joined as Staff.",            type: "info",    read: true,  createdAt: "2026-06-25 16:30" },
  { id: "nt4", title: "System alert",      message: "Scheduled maintenance Sunday 2AM.",      type: "warning", read: false, createdAt: "2026-06-25 12:00" },
];

// ── Activity Feed ─────────────────────────────────────────────────────────────

export const seedActivities: Activity[] = [
  { id: "a1", who: "Visitor #2480", action: "scanned QR",      target: "Main Entrance",           at: "2 min ago"  },
  { id: "a2", who: "J. Cruz",       action: "updated office",  target: "Business Bureau",         at: "14 min ago" },
  { id: "a3", who: "M. Santos",     action: "generated QR",    target: "Civil Registrar's Office",at: "32 min ago" },
  { id: "a4", who: "Visitor #2475", action: "requested route", target: "City Treasurer's Office", at: "48 min ago" },
  { id: "a5", who: "L. Reyes",      action: "logged in",       target: "Admin Portal",            at: "1 hr ago"   },
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
    { name: "Civil Registrar's Office",         visits: 3421 },
    { name: "Business Bureau",                   visits: 2890 },
    { name: "City Treasurer's Office",           visits: 2154 },
    { name: "City Health Office",                visits: 1876 },
    { name: "City Assessor's Office",            visits: 1432 },
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
  { name: "City Treasurer's", value: 28 }, { name: "Civil Registrar's", value: 22 },
  { name: "Business Bureau",  value: 18 }, { name: "City Health",        value: 15 },
  { name: "City Assessor's",  value: 10 }, { name: "Others",             value: 7  },
];

export const peakHours = [
  { hour: "8AM",  scans: 45 }, { hour: "9AM",  scans: 82 }, { hour: "10AM", scans: 96 },
  { hour: "11AM", scans: 78 }, { hour: "12PM", scans: 40 }, { hour: "1PM",  scans: 55 },
  { hour: "2PM",  scans: 88 }, { hour: "3PM",  scans: 72 }, { hour: "4PM",  scans: 59 },
];

// ── Service Index & Smart Search ────────────────────────────────────────────

export interface ServiceIndexEntry {
  officeId: string;
  keywords: string[];
}

export interface ServiceRecommendation {
  officeId: string;
  reason: string;
  score: number;
}

// Maps common visitor search terms to the office that handles them.
// The first keyword in each list is treated as the "display" keyword
// in UI components like the Service Index list.
export const serviceIndex: ServiceIndexEntry[] = [
  { officeId: "business-bureau", keywords: ["business permit", "mayor's permit", "new business", "business permit renewal", "closure permit"] },
  { officeId: "city-treasurers-office", keywords: ["property tax", "real property tax", "business tax", "community tax certificate", "cedula", "revenue collection"] },
  { officeId: "civil-registrars-office", keywords: ["birth certificate", "marriage certificate", "marriage license", "death certificate", "cenomar", "late registration"] },
  { officeId: "office-city-building-official", keywords: ["building permit", "demolition permit", "fencing permit", "occupancy permit", "building inspection"] },
  { officeId: "office-for-senior-citizens-affairs", keywords: ["pwd id", "senior citizen id", "discount booklet", "senior citizen benefits"] },
  { officeId: "city-health-office", keywords: ["medical certificate", "vaccination", "health card", "sanitary permit", "prenatal care"] },
  { officeId: "city-assessors-office", keywords: ["tax declaration", "property assessment", "transfer of ownership", "property records"] },
  { officeId: "city-social-welfare-development-office", keywords: ["financial assistance", "solo parent id", "4ps", "aics", "indigent assistance"] },
  { officeId: "city-engineers-office", keywords: ["infrastructure", "engineering inspection", "occupancy permit", "infrastructure planning"] },
  { officeId: "city-planning-development-office", keywords: ["zoning clearance", "land use", "development permit", "zoning certification"] },
  { officeId: "public-employment-service-office", keywords: ["job placement", "job fair", "employment", "labor market"] },
  { officeId: "city-veterinarians-office", keywords: ["veterinary", "animal vaccination", "rabies control", "livestock"] },
  { officeId: "city-transportation-traffic-management-office", keywords: ["franchise permit", "traffic violation", "transport regulation"] },
  { officeId: "davao-city-central-911", keywords: ["emergency", "911", "emergency dispatch", "medical emergency"] },
  { officeId: "city-tourism-operations-office", keywords: ["tourism accreditation", "visitor information", "event coordination"] },
  { officeId: "city-library-information-center", keywords: ["library access", "research assistance", "book lending"] },
  { officeId: "davao-city-housing-office", keywords: ["housing application", "resettlement", "lot allocation"] },
  { officeId: "city-cooperative-development-office", keywords: ["cooperative registration", "cooperative training", "cooperative financing"] },
  { officeId: "educational-benefit-system-unit", keywords: ["scholarship", "educational assistance", "grants"] },
  { officeId: "human-resource-management-office", keywords: ["appointment processing", "leave management", "employee benefits"] },
];

/**
 * Given a free-text query, scores each office by how well its
 * keywords / name / department / services match the query and
 * returns the best matches sorted by relevance, each with a
 * human-readable reason for the recommendation.
 */
export function recommendService(query: string): ServiceRecommendation[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);
  const scored = new Map<string, ServiceRecommendation>();

  const bump = (officeId: string, amount: number, reason: string) => {
    const existing = scored.get(officeId);
    if (existing) {
      existing.score += amount;
      if (amount >= existing.score - amount) existing.reason = reason;
    } else {
      scored.set(officeId, { officeId, score: amount, reason });
    }
  };

  // 1) Match against curated service-index keywords (highest weight)
  for (const entry of serviceIndex) {
    for (const kw of entry.keywords) {
      const kwLower = kw.toLowerCase();
      if (kwLower === q) {
        bump(entry.officeId, 100, `Exact match for "${kw}".`);
      } else if (kwLower.includes(q) || q.includes(kwLower)) {
        bump(entry.officeId, 60, `Handles services related to "${kw}".`);
      } else if (terms.some((t) => kwLower.includes(t))) {
        bump(entry.officeId, 30, `Related to "${kw}".`);
      }
    }
  }

  // 2) Match against office name, department, and services list
  for (const office of seedOffices) {
    const haystacks: Array<[string, string]> = [
      [office.name.toLowerCase(), `the office name "${office.name}"`],
      [(office.department ?? "").toLowerCase(), `the department "${office.department}"`],
    ];
    getServicesForOffice(office.id).forEach((service) =>
      haystacks.push([service.service_name.toLowerCase(), `the service "${service.service_name}"`]),
    );

    for (const [haystack, label] of haystacks) {
      if (!haystack) continue;
      if (haystack === q) {
        bump(office.id, 90, `Exact match for ${label}.`);
      } else if (haystack.includes(q)) {
        bump(office.id, 50, `Matches ${label}.`);
      } else if (terms.some((t) => t.length > 2 && haystack.includes(t))) {
        bump(office.id, 20, `Partially matches ${label}.`);
      }
    }
  }

  return Array.from(scored.values()).sort((a, b) => b.score - a.score);
}
// ── Scan Logs (Table 19) ────────────────────────────────────────────────────

export interface ScanLog {
  logId: string;         // log_id (PK)
  sessionId: string;      // session_id — FK -> Visitor_Sessions.session_id
  qrId: string;            // qr_id — FK -> QR_Codes.qr_id
  officeId: string | null; // office_id — FK -> Offices.office_id
  scannedAt: string;        // scanned_at — DEFAULT CURRENT_TIMESTAMP
}

// Deterministic mock generator so each QR code has a believable scan trail
// tied to its own `scans` count, without needing a real Visitor_Sessions table yet.
function buildScanLogsForQr(qr: QrCode, count: number): ScanLog[] {
  return Array.from({ length: count }).map((_, i) => {
    const minutesAgo = i * 7 + 2;
    const scannedAt = new Date(Date.now() - minutesAgo * 60_000).toISOString();
    return {
      logId: `sl-${qr.id}-${i}`,
      sessionId: `sess-${qr.id}-${1000 + i}`,
      qrId: qr.id,
      officeId: qr.officeId,
      scannedAt,
    };
  });
}

export const seedScanLogs: ScanLog[] = seedQrCodes.flatMap((qr) =>
  buildScanLogsForQr(qr, Math.min(8, Math.max(1, Math.round(qr.scans / 25)))),
);

export function getScanLogsForQr(qrId: string): ScanLog[] {
  return seedScanLogs
    .filter((log) => log.qrId === qrId)
    .sort((a, b) => +new Date(b.scannedAt) - +new Date(a.scannedAt));
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}