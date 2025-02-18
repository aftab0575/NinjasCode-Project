"use client";

import { useEffect, useState } from "react";
import { useMap } from "@/app/context/index";
import "../../globals.css";

const GoogleMapComponent = () => {
  const { mapContainerRef, map } = useMap(); // ✅ Get ref from context
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!map) {
      console.log("Map is still loading...");
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [map]);

  return (
    <div className="pt-2 px-4 pb-4 flex justify-center items-center">
      {loading && <p data-cy="loading-message">Map is still loading...</p>} {/* ✅ New testable element */}
      <div 
        ref={mapContainerRef} 
        data-cy="map-container"  // ✅ More reliable selector
        className="w-full h-[500px] rounded-lg shadow-2xl border border-gray-300 overflow-hidden transition-all duration-300 ease-in-out hover:scale-101 hover:shadow-xl"
      />
    </div>
  );
};

export default GoogleMapComponent;
