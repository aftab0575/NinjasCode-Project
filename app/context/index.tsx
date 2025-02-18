"use client"; // Ensure this runs on the client side

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

interface MapContextType {
  map: google.maps.Map | null;
  addMarker: (position: google.maps.LatLngLiteral, title?: string) => void;
  addUserLocation: (lat: number, lng: number) => void;
  mapContainerRef: React.RefObject<HTMLDivElement>;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const userCircleRef = useRef<google.maps.Circle | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null); // ✅ Track map instance in state

  useEffect(() => {
    if (typeof window !== "undefined" && window.google && mapContainerRef.current && !mapInstance.current) {
      mapInstance.current = new google.maps.Map(mapContainerRef.current, {
        center: { lat: 37.7749, lng: -122.4194 }, // Default center (San Francisco)
        zoom: 12,
      });

      setMap(mapInstance.current); // ✅ Store map in state after initialization
    }
  }, []);

  const addMarker = (position: google.maps.LatLngLiteral, title?: string) => {
    if (!map) {
      console.error("Map is not initialized yet!");
      return;
    }

    new google.maps.Marker({
      position,
      map,
      title,
    });
  };

  const addUserLocation = (lat: number, lng: number) => {
    if (!map) {
      console.error("Map is not initialized yet!");
      return;
    }

    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    userMarkerRef.current = new google.maps.Marker({
      position: { lat, lng },
      map,
      title: "Your Location",
      icon: {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      },
    });

    if (userCircleRef.current) {
      userCircleRef.current.setMap(null);
    }

    userCircleRef.current = new google.maps.Circle({
      strokeColor: "#4285F4",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#4285F4",
      fillOpacity: 0.3,
      map,
      center: { lat, lng },
      radius: 100, // 100 meters radius
    });

    map.setCenter({ lat, lng });
  };

  return (
    <MapContext.Provider value={{ map, addMarker, addUserLocation, mapContainerRef }}>
      {/* Render a hidden div to initialize the map */}
      <div ref={mapContainerRef} style={{ width: "100%", height: "500px", display: "none" }} />
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};
