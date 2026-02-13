import { TrafficData, TrafficNode, CascadeAlert } from "@/types/traffic";

const ORR_NODES = [
  { id: "silk_board", name: "Silk Board Junction", lat: 12.9177, lng: 77.6238 },
  {
    id: "marathahalli",
    name: "Marathahalli Bridge",
    lat: 12.9591,
    lng: 77.701,
  },
  { id: "brookefield", name: "Brookefield", lat: 12.9716, lng: 77.7134 },
  { id: "bellandur", name: "Bellandur Junction", lat: 12.926, lng: 77.6785 },
  { id: "ecospace", name: "Ecospace", lat: 12.9344, lng: 77.6906 },
  { id: "whitefield", name: "Whitefield", lat: 12.9698, lng: 77.75 },
  { id: "sarjapur", name: "Sarjapur Road", lat: 12.901, lng: 77.686 },
  { id: "kr_puram", name: "KR Puram", lat: 13.0111, lng: 77.6969 },
];

// Default idle state
export function getBaseTrafficNodes(): TrafficNode[] {
  return ORR_NODES.map((node) => ({
    id: node.id,
    name: node.name,
    lat: node.lat,
    lng: node.lng,
    current_speed: 45, // Optimal speed
    normal_speed: 45,
    stress_score: 0, // No stress
    speed: 45,
    stress: 0,
    density: "low", // Low density
    incidents: [],
    history: Array(24).fill(0), // Flat history
  }));
}

export function getInitialTrafficState(): TrafficData {
  // Return clean/idle state
  const nodes = getBaseTrafficNodes();

  return {
    timestamp: new Date().toISOString(),
    nodes,
    weather: { condition: "clear", intensity: 0 },
    cascade_alerts: [],
    isPeak: false,
  };
}

// Deprecated/No-op functions for compatibility
export function setScenario(scenario: any) {}
export function clearScenario() {}
export function resetHistory() {}
