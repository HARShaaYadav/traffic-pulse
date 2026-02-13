"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
  PolylineF,
  CircleF,
  DirectionsRenderer,
  DirectionsService,
} from "@react-google-maps/api";
import { TrafficNode } from "@/types/traffic";

interface TrafficMapProps {
  nodes: TrafficNode[];
  emergencyRoute?: { origin: string; destination: string };
}

function getStressColor(stress: number): string {
  if (stress >= 81) return "#ef4444"; // red
  if (stress >= 61) return "#f59e0b"; // orange
  if (stress >= 31) return "#eab308"; // yellow
  return "#10b981"; // green
}

function getStressLabel(stress: number): string {
  if (stress >= 81) return "CRITICAL";
  if (stress >= 61) return "HIGH";
  if (stress >= 31) return "ELEVATED";
  return "NORMAL";
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 12.91,
  lng: 77.63,
};

const mapOptions = {
  styles: [
    {
      elementType: "geometry",
      stylers: [{ color: "#242f3e" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#242f3e" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ],
  disableDefaultUI: false,
  zoomControl: true,
};

export default function TrafficMap({ nodes, emergencyRoute }: TrafficMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const [selectedNode, setSelectedNode] = useState<TrafficNode | null>(null);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);

  // Focus the map on the nodes, calculating center dynamically if needed
  // For now using fixed center around Bangalore ORR
  const mapCenter = useMemo(() => {
    if (nodes.length > 0) {
      // Simple centroid calculation
      const latSum = nodes.reduce((sum, node) => sum + node.lat, 0);
      const lngSum = nodes.reduce((sum, node) => sum + node.lng, 0);
      return { lat: latSum / nodes.length, lng: lngSum / nodes.length };
    }
    return center;
  }, [nodes]);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    // any cleanup if necessary
  }, []);

  const pathCoordinates = useMemo(
    () => nodes.map((node) => ({ lat: node.lat, lng: node.lng })),
    [nodes],
  );

  const directionsCallback = useCallback(
    (
      result: google.maps.DirectionsResult | null,
      status: google.maps.DirectionsStatus,
    ) => {
      if (status === "OK" && result) {
        setDirectionsResponse(result);
      } else {
        console.error("Directions request failed due to " + status);
      }
    },
    [],
  );

  // Reset directions when route changes or is cleared
  useEffect(() => {
    if (!emergencyRoute) {
      setDirectionsResponse(null);
    }
  }, [emergencyRoute]);

  if (!isLoaded)
    return (
      <div className="h-[500px] bg-slate-900 rounded-lg flex items-center justify-center text-slate-500">
        Loading Map...
      </div>
    );

  return (
    <div
      className="h-[500px] rounded-lg overflow-hidden border-2 border-slate-700"
      data-testid="traffic-map"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* ORR Corridor Line - Only show if not in emergency routing mode */}
        {!emergencyRoute && (
          <PolylineF
            path={pathCoordinates}
            options={{
              strokeColor: "#475569",
              strokeOpacity: 0.6,
              strokeWeight: 4,
              icons: [
                {
                  icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 2 },
                  offset: "0",
                  repeat: "10px",
                },
              ],
            }}
          />
        )}

        {/* Emergency Route */}
        {emergencyRoute && (
          <>
            {!directionsResponse && (
              <DirectionsService
                options={{
                  destination: emergencyRoute.destination,
                  origin: emergencyRoute.origin,
                  travelMode: "DRIVING" as google.maps.TravelMode,
                  provideRouteAlternatives: true,
                }}
                callback={directionsCallback}
              />
            )}
            {directionsResponse && (
              <DirectionsRenderer
                options={{
                  directions: directionsResponse,
                  polylineOptions: {
                    strokeColor: "#ef4444", // Red for emergency
                    strokeWeight: 6,
                    strokeOpacity: 0.8,
                  },
                }}
              />
            )}
          </>
        )}

        {/* Traffic Nodes - Only show if not in emergency routing mode */}
        {!emergencyRoute &&
          nodes.map((node) => {
            const color = getStressColor(node.stress_score);
            return (
              <CircleF
                key={node.id}
                center={{ lat: node.lat, lng: node.lng }}
                radius={800}
                options={{
                  fillColor: color,
                  fillOpacity: 0.8,
                  strokeColor: color,
                  strokeWeight: 3,
                  strokeOpacity: 1,
                }}
                onClick={() => setSelectedNode(node)}
              />
            );
          })}

        {!emergencyRoute &&
          nodes.map((node) => {
            const color = getStressColor(node.stress_score);
            return (
              <MarkerF
                key={`marker-${node.id}`}
                position={{ lat: node.lat, lng: node.lng }}
                icon={{
                  path: "M 0, 0 m -5, 0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0",
                  fillColor: color,
                  fillOpacity: 0.8,
                  strokeColor: color,
                  strokeWeight: 2,
                  scale: 2,
                }}
                onClick={() => setSelectedNode(node)}
              />
            );
          })}

        {selectedNode && (
          <InfoWindowF
            position={{ lat: selectedNode.lat, lng: selectedNode.lng }}
            onCloseClick={() => setSelectedNode(null)}
          >
            <div className="p-2 min-w-[200px] text-slate-800">
              <h3 className="font-bold text-lg mb-2 text-black">
                {selectedNode.name}
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-slate-600">Stress Level:</span>
                  <span
                    className="font-bold"
                    style={{ color: getStressColor(selectedNode.stress_score) }}
                  >
                    {selectedNode.stress_score} -{" "}
                    {getStressLabel(selectedNode.stress_score)}
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-slate-600">Current Speed:</span>
                  <span className="font-semibold text-black">
                    {selectedNode.current_speed} km/h
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-slate-600">Normal Speed:</span>
                  <span className="text-slate-500">
                    {selectedNode.normal_speed} km/h
                  </span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="text-slate-600">Density:</span>
                  <span className="font-semibold uppercase text-black">
                    {selectedNode.density}
                  </span>
                </div>
                {selectedNode.incidents.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-slate-300">
                    <span className="text-slate-500 text-xs">
                      Active Incidents:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedNode.incidents.map((incident, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200"
                        >
                          {incident.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}
