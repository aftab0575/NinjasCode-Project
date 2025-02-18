/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useRef, useEffect, useCallback } from "react";
import { useMap } from "@/app/context/index";

const API_KEY = "AlzaSyq9BodU615ofNFxVQdJqthKOQtgVfJPVCF"; // ✅ Replace with your API Key

const SearchPlaces = () => {
  const { map, addMarker } = useMap();
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const placeMarkers = useRef<google.maps.Marker[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // useEffect(() => {
  //   if (!map) {
  //     console.error("Map context is not available. Ensure it is initialized.");
  //   }
  // }, [map]);

  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const fetchPlaces = async () => {
    if (!map || !searchQuery.trim() || !isTyping) return;
    
    const center = map.getCenter();
    if (!center) {
      console.error("Map center is undefined");
      return;
    }
    
    const latitude = center.lat();
    const longitude = center.lng();
    setIsFetching(true);
    const url = `https://maps.gomaps.pro/maps/api/place/textsearch/json?location=${latitude},${longitude}&query=${encodeURIComponent(
      searchQuery
    )}&radius=4000&language=en&region=en&key=${API_KEY}`;

    try {
      console.log("Fetching places with query:", searchQuery);
      const response = await fetch(url);
      const data = await response.json();
      console.log("API Response:", data);

      if (data.status === "OK") {
        placeMarkers.current.forEach((marker) => marker.setMap(null));
        placeMarkers.current = [];
        setPlaces(data.results);
        setShowDropdown(true);
      } else {
        console.error("Error fetching places:", data.status);
      }
    } catch (error) {
      console.error("API Call Failed:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    const debouncedFetch = debounce(fetchPlaces, 500);
    if (searchQuery.trim() !== "" && (isTyping || places.length === 0)) {
      debouncedFetch();
    }
  }, [searchQuery, isTyping, map]);

  const handlePlaceClick = (place: any) => {
    if (!map) return;
    const position = {
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
    };
    map.setCenter(position);
    map.setZoom(16);
    const marker = addMarker(position, place.name);
    if (marker) placeMarkers.current.push(marker);
    setSearchQuery(place.name);
    setIsTyping(false);
    setPlaces([]);
    setShowDropdown(false);
  };

  if (!map) {
    return <p>Loading map...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 tracking-wide">
        Search for Restaurants and Places :-
      </h1>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search for places..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsTyping(true);
          }}
          onFocus={() => isTyping && setShowDropdown(true)}
          className="w-full p-4 border rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 pr-12 hover:shadow-lg"
        />

        {(isTyping || isFetching) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50">
            <i className="pi pi-spinner absolute right-4 text-gray-500 text-4xl animate-spin"></i>
          </div>
        )}

        {showDropdown && places.length > 0 && (
          <ul className="absolute w-full border bg-white shadow-lg rounded-lg mt-2 z-10 overflow-hidden transition-all duration-300 opacity-100 scale-100">
            {places.map((place, index) => (
              <li
                key={index}
                className="p-3 border-b last:border-0 hover:bg-blue-100 cursor-pointer transition-all duration-200 transform hover:scale-105"
                onClick={() => handlePlaceClick(place)}
              >
                {place.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPlaces;
