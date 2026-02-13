import { TrafficNode } from "@/types/traffic";

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY?.trim();
const ORS_API_KEY = process.env.OPENROUTE_API_KEY?.trim();

interface SpeedData {
  speed: number;
  durationInTraffic: number; // seconds
  distance: number; // meters
}

/**
 * Calculates real speed between two coordinates using Google Routes API (v2).
 * Falls back to OpenRouteService if Google is unavailable.
 */
export async function getSegmentData(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
): Promise<SpeedData | null> {
  // 1. Try Google Routes API (v2)
  if (GOOGLE_API_KEY) {
    try {
      const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;

      const body = {
        origin: {
          location: {
            latLng: { latitude: origin.lat, longitude: origin.lng },
          },
        },
        destination: {
          location: {
            latLng: { latitude: destination.lat, longitude: destination.lng },
          },
        },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "routes.duration,routes.distanceMeters,routes.staticDuration",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distanceMeters = route.distanceMeters;
          const durationSeconds = parseInt(route.duration.replace("s", ""), 10);
          const speedKmph = distanceMeters / 1000 / (durationSeconds / 3600);

          return {
            speed: Math.round(speedKmph),
            durationInTraffic: durationSeconds,
            distance: distanceMeters,
          };
        }
      } else {
        console.warn(
          "Google Routes API returned",
          res.status,
          "— trying ORS fallback",
        );
      }
    } catch (e) {
      console.warn("Google Routes API failed, trying ORS fallback");
    }
  }

  // 2. Fallback: OpenRouteService
  if (ORS_API_KEY) {
    try {
      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${origin.lng},${origin.lat}&end=${destination.lng},${destination.lat}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const segment = data.features?.[0]?.properties?.segments?.[0];
        if (segment) {
          const distanceMeters = segment.distance;
          const durationSeconds = segment.duration;
          const speedKmph = distanceMeters / 1000 / (durationSeconds / 3600);

          return {
            speed: Math.round(speedKmph),
            durationInTraffic: durationSeconds,
            distance: distanceMeters,
          };
        }
      }
    } catch (e) {
      console.error("OpenRouteService API failed:", e);
    }
  }

  return null;
}

/**
 * Update a list of nodes with real traffic data.
 * Measures segment speed from Node[i] -> Node[i+1] to represent outbound flow.
 */
export async function updateNodesWithRealTraffic(
  nodes: TrafficNode[],
): Promise<TrafficNode[]> {
  const currentHour = new Date().getHours();
  // const currentHour = 9; // DEBUG: Force peak hour

  const promises = nodes.map(async (node, index) => {
    // 1. Try to get real data first
    let data = null;

    if (index < nodes.length - 1) {
      const nextNode = nodes[index + 1];
      data = await getSegmentData(
        { lat: node.lat, lng: node.lng },
        { lat: nextNode.lat, lng: nextNode.lng },
      );
    }

    if (data) {
      const stress = calculateStress(data.speed, node.normal_speed);
      const density: "low" | "medium" | "high" =
        stress > 70 ? "high" : stress > 40 ? "medium" : "low";

      return {
        ...node,
        current_speed: data.speed,
        speed: data.speed,
        stress_score: stress,
        stress: stress,
        density,
      };
    } else {
      // 2. Fallback: Simulation Logic
      const simulated = calculateSimulatedMetrics(node, currentHour);

      return {
        ...node,
        current_speed: simulated.speed,
        speed: simulated.speed,
        stress_score: simulated.stress,
        stress: simulated.stress,
        density: simulated.density,
      };
    }
  });

  return Promise.all(promises);
}

/**
 * Simulaties realistic traffic conditions based on time of day
 */
export function calculateSimulatedMetrics(node: TrafficNode, hour: number) {
  // Base config
  const isMorningPeak = hour >= 8 && hour <= 11;
  const isEveningPeak = hour >= 17 && hour <= 20;
  const isPeak = isMorningPeak || isEveningPeak;

  // Random fluctuation factor (0.85 to 1.15)
  const volatility = 0.85 + Math.random() * 0.3;

  let trafficFactor = 1.0;

  if (isPeak) {
    // Heavy traffic: speed drops to 30-50% of normal
    trafficFactor = 0.4 + Math.random() * 0.2;
    // Morning peak is usually worse for inbound, evening for outbound
    // We can simulate this simply by making evening slightly worse generally
    if (isEveningPeak) trafficFactor -= 0.05;
  } else if (hour >= 22 || hour <= 5) {
    // Night: smooth sailing (90-110% of normal)
    trafficFactor = 0.95 + Math.random() * 0.15;
  } else {
    // Day/Normal: 60-80% of normal
    trafficFactor = 0.7 + Math.random() * 0.2;
  }

  // Apply volatility
  trafficFactor *= volatility;

  // Cap factor
  trafficFactor = Math.min(1.2, Math.max(0.1, trafficFactor));

  const simulatedSpeed = Math.round(node.normal_speed * trafficFactor);
  const stress = calculateStress(simulatedSpeed, node.normal_speed);

  const density: "low" | "medium" | "high" =
    stress > 70 ? "high" : stress > 40 ? "medium" : "low";

  return {
    speed: simulatedSpeed,
    stress,
    density,
  };
}

function calculateStress(currentSpeed: number, normalSpeed: number): number {
  if (currentSpeed >= normalSpeed) return 0;
  const drop = normalSpeed - currentSpeed;
  // Proportional stress: 50% speed drop → ~75% stress
  const stress = (drop / normalSpeed) * 100 * 1.5;
  return Math.min(100, Math.round(Math.max(0, stress)));
}
