export type DeliveryStatus = "completed" | "in_transit" | "pending" | "attention";

export interface Agent {
  id: string;
  name: string;
  avatarColor: string;
  online: boolean;
  rating: number;
}

export interface Delivery {
  id: string;
  customer: string;
  phone: string;
  destination: string;
  packageType: string;
  notes?: string;
  priority: "Standard" | "Express" | "Critical";
  agent: Agent;
  eta: string;
  status: DeliveryStatus;
  otp: string;
  distanceKm: number;
  createdAt: string;
  proof?: {
    photoUrl: string;
    gps: { lat: number; lng: number };
    verifiedAt: string;
    hash: string;
  };
}

export const agents: Agent[] = [
  { id: "ag-01", name: "Marcus Chen", avatarColor: "from-violet-500 to-blue-500", online: true, rating: 4.9 },
  { id: "ag-02", name: "Aisha Patel", avatarColor: "from-cyan-400 to-emerald-500", online: true, rating: 4.8 },
  { id: "ag-03", name: "Diego Rivera", avatarColor: "from-orange-400 to-pink-500", online: false, rating: 4.7 },
  { id: "ag-04", name: "Yuki Tanaka", avatarColor: "from-indigo-500 to-purple-500", online: true, rating: 5.0 },
];

export const deliveries: Delivery[] = [
  {
    id: "TR-48201",
    customer: "Helena Voss",
    phone: "+1 415 555 0142",
    destination: "278 Market St, San Francisco, CA",
    packageType: "Documents",
    priority: "Critical",
    agent: agents[0],
    eta: "12 min",
    status: "in_transit",
    otp: "4821",
    distanceKm: 3.2,
    createdAt: "2025-05-10T09:14:00Z",
  },
  {
    id: "TR-48198",
    customer: "Omar Khalil",
    phone: "+1 415 555 0188",
    destination: "1 Hacker Way, Menlo Park, CA",
    packageType: "Electronics",
    priority: "Express",
    agent: agents[1],
    eta: "Delivered",
    status: "completed",
    otp: "9304",
    distanceKm: 18.7,
    createdAt: "2025-05-10T07:42:00Z",
    proof: {
      photoUrl: "",
      gps: { lat: 37.4848, lng: -122.1483 },
      verifiedAt: "2025-05-10T08:31:00Z",
      hash: "0x7a1f...c39e",
    },
  },
  {
    id: "TR-48195",
    customer: "Priya Anand",
    phone: "+1 415 555 0167",
    destination: "525 Brannan St, San Francisco, CA",
    packageType: "Pharmaceuticals",
    priority: "Critical",
    agent: agents[3],
    eta: "Delivered",
    status: "completed",
    otp: "1102",
    distanceKm: 5.4,
    createdAt: "2025-05-10T06:20:00Z",
    proof: {
      photoUrl: "",
      gps: { lat: 37.7749, lng: -122.3989 },
      verifiedAt: "2025-05-10T07:01:00Z",
      hash: "0x4b22...8a17",
    },
  },
  {
    id: "TR-48190",
    customer: "Ethan Moore",
    phone: "+1 415 555 0119",
    destination: "1455 Market St, San Francisco, CA",
    packageType: "Legal Docs",
    priority: "Express",
    agent: agents[2],
    eta: "Failed verification",
    status: "attention",
    otp: "7733",
    distanceKm: 2.1,
    createdAt: "2025-05-10T05:11:00Z",
  },
  {
    id: "TR-48187",
    customer: "Sara Lindqvist",
    phone: "+1 415 555 0103",
    destination: "799 Folsom St, San Francisco, CA",
    packageType: "Documents",
    priority: "Standard",
    agent: agents[0],
    eta: "32 min",
    status: "pending",
    otp: "5519",
    distanceKm: 7.8,
    createdAt: "2025-05-10T04:50:00Z",
  },
];

export const stats = [
  { label: "Total Deliveries", value: 1284, change: "+12.4%", trend: "up" as const, color: "from-violet-500 to-blue-500" },
  { label: "Completed", value: 1147, change: "+8.2%", trend: "up" as const, color: "from-emerald-500 to-cyan-500" },
  { label: "In Transit", value: 94, change: "+3.1%", trend: "up" as const, color: "from-cyan-400 to-blue-500" },
  { label: "Attention Needed", value: 7, change: "-2.0%", trend: "down" as const, color: "from-orange-500 to-pink-500" },
];

export function getDelivery(id: string) {
  return deliveries.find((d) => d.id === id);
}
