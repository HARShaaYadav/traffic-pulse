import { getDb } from "./mongodb";

export const initialPartners = [
  {
    id: "swiggy",
    name: "Swiggy",
    type: "food",
    color: "text-orange-500",
    activeFleet: 2450,
    avgDelay: 12,
    surgeMultiplier: 1.2,
    compliance: 94,
    status: "normal",
  },
  {
    id: "zomato",
    name: "Zomato",
    type: "food",
    color: "text-red-500",
    activeFleet: 2100,
    avgDelay: 15,
    surgeMultiplier: 1.4,
    compliance: 91,
    status: "stressed",
  },
  {
    id: "uber",
    name: "Uber",
    type: "ride",
    color: "text-white",
    activeFleet: 1800,
    avgDelay: 8,
    surgeMultiplier: 2.1,
    compliance: 88,
    status: "critical",
  },
  {
    id: "ola",
    name: "Ola",
    type: "ride",
    color: "text-yellow-400",
    activeFleet: 1650,
    avgDelay: 10,
    surgeMultiplier: 1.8,
    compliance: 85,
    status: "stressed",
  },
  {
    id: "porter",
    name: "Porter",
    type: "delivery",
    color: "text-blue-400",
    activeFleet: 450,
    avgDelay: 5,
    surgeMultiplier: 1.0,
    compliance: 98,
    status: "normal",
  },
  {
    id: "zepto",
    name: "Zepto",
    type: "delivery",
    color: "text-purple-400",
    activeFleet: 800,
    avgDelay: 2,
    surgeMultiplier: 1.1,
    compliance: 96,
    status: "normal",
  },
];

export const initialZones = [
  {
    id: "bellandur",
    name: "Bellandur - ORR",
    stress: 85,
    actions: { suspendDelivery: false, forceSurge: true, evOnly: false },
  },
  {
    id: "marathahalli",
    name: "Marathahalli Bridge",
    stress: 92,
    actions: { suspendDelivery: true, forceSurge: true, evOnly: true },
  },
  {
    id: "silkboard",
    name: "Silk Board Junction",
    stress: 78,
    actions: { suspendDelivery: false, forceSurge: true, evOnly: false },
  },
  {
    id: "whitefield",
    name: "Whitefield Main Rd",
    stress: 45,
    actions: { suspendDelivery: false, forceSurge: false, evOnly: false },
  },
];

export const initialShuttles = [
  {
    id: "S-101",
    route: "Silk Board -> Ecospace",
    company: "Intel",
    status: "delayed",
    occupancy: 85,
    eta: 15,
  },
  {
    id: "S-104",
    route: "Marathahalli -> Prestige",
    company: "Cisco",
    status: "on_time",
    occupancy: 92,
    eta: 5,
  },
  {
    id: "S-202",
    route: "Koramangala -> Embasy",
    company: "Wells Fargo",
    status: "arrived",
    occupancy: 0,
    eta: 0,
  },
  {
    id: "S-305",
    route: "Indiranagar -> Bagmane",
    company: "Google",
    status: "on_time",
    occupancy: 60,
    eta: 8,
  },
];

export const initialShifts = [
  {
    name: "Early Bird",
    time: "07:00 - 15:00",
    employees: 1200,
    color: "bg-blue-500",
  },
  {
    name: "Regular",
    time: "09:00 - 17:00",
    employees: 3500,
    color: "bg-purple-500",
  },
  {
    name: "Late Start",
    time: "11:00 - 19:00",
    employees: 1800,
    color: "bg-orange-500",
  },
];

export async function seedCorporateData() {
  const db = await getDb();

  // Seed Partners
  const partnersCount = await db
    .collection("corporate_partners")
    .countDocuments();
  if (partnersCount === 0) {
    await db.collection("corporate_partners").insertMany(initialPartners);
  }

  // Seed Zones
  const zonesCount = await db.collection("corporate_zones").countDocuments();
  if (zonesCount === 0) {
    await db.collection("corporate_zones").insertMany(initialZones);
  }

  // Seed Shuttles
  const shuttlesCount = await db
    .collection("corporate_shuttles")
    .countDocuments();
  if (shuttlesCount === 0) {
    await db.collection("corporate_shuttles").insertMany(initialShuttles);
  }

  // Seed Shifts
  const shiftsCount = await db.collection("corporate_shifts").countDocuments();
  if (shiftsCount === 0) {
    await db.collection("corporate_shifts").insertMany(initialShifts);
  }
}
