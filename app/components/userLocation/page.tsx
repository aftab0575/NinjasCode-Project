"use client";

import { useState } from "react";
import { useMap } from "@/app/context/index";
import NearbyRestaurants from "../NearbyResturants/page";

const UserLocationButton = () => {
  const { addUserLocation } = useMap();
  const [locationName, setLocationName] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false); // ✅ Loading state
  const [location, setLocation] = useState({ lat: null, lon: null });

  const Api_key = "AlzaSyq9BodU615ofNFxVQdJqthKOQtgVfJPVCF";
  
  const handleFindUser = () => {
    if (navigator.geolocation) {
      setIsFetching(true); // Start loading
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          addUserLocation(latitude, longitude);

          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });

          // Fetch address using Google Maps Reverse Geocoding API
          const geocodeUrl = `https://maps.gomaps.pro/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Api_key}`;

          try {
            const response = await fetch(geocodeUrl);
            const data = await response.json();
            if (data.status === "OK" && data.results.length > 0) {
              setLocationName(data.results[0].formatted_address);
            } else {
              setLocationName("Location not found");
            }
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocationName("Error fetching location");
          } finally {
            setIsFetching(false); // Stop loading
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
          setLocationName("Error getting location");
          setIsFetching(false); // Stop loading
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocationName("Geolocation not supported");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4">
        {/* Display the fetched location name with a loading indicator */}
        <div className="relative flex-grow">
          <input
            type="text"
            value={locationName}
            readOnly
            className="p-3 border border-gray-300 rounded-lg w-full shadow-sm 
              focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300 pr-12"
            placeholder="Your location will appear here"
          />
          
          {/* Loading Indicator (Shows only when fetching) */}
          {isFetching && (
            <i className="pi pi-spin pi-spinner absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-300"></i>
          )}
        </div>

        <button 
          onClick={handleFindUser} 
          disabled={isFetching} // Prevent multiple clicks
          className={`p-3 bg-green-500 text-white font-semibold rounded-lg shadow-md 
            hover:bg-green-600 transition-all duration-300 flex items-center gap-2 
            ${isFetching ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <i className="pi pi-map-marker"></i>
          {isFetching ? "Fetching..." : "My Location"}
        </button>
      </div>

      {/* {location.lat && location.lon ? ( */}
        <NearbyRestaurants lat={location.lat} lon={location.lon} />
    
    </div>
  );

};

export default UserLocationButton;

  // ) : (
      //   <p>Fetching location...</p>
      // )}
