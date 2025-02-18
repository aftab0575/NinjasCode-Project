/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef } from "react";
import { useMap } from "@/app/context/index";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // PrimeReact Theme
import "primereact/resources/primereact.min.css";

const API_KEY = "AlzaSyq9BodU615ofNFxVQdJqthKOQtgVfJPVCF";

const NearbyRestaurants = ({ lat, lon }) => {
  const { map, addMarker } = useMap();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false); // ✅ New state for loading
  const restaurantMarkers = useRef<google.maps.Marker[]>([]);

  const fetchNearbyPlaces = async () => {
    if (!map || !lat || !lon) return;
  
    setIsLoading(true); // Start loading indicator
  
    const url = `https://maps.gomaps.pro/maps/api/place/nearbysearch/json?keyword=restaurant&location=${lat},${lon}&radius=1000&type=restaurant&key=${API_KEY}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status === "OK") {
        console.log("Data fetched from API!");
  
        // ✅ Safely remove old markers
        if (restaurantMarkers.current.length > 0) {
          restaurantMarkers.current.forEach((marker) => {
            if (marker) {
              marker.setMap(null);
            }
          });
          restaurantMarkers.current = [];
        }
  
        setRestaurants(data.results); // Store restaurant data in state
  
        // ✅ Add new markers for restaurants
        data.results.forEach((place: any) => {
          const marker = addMarker(
            { lat: place.geometry.location.lat, lng: place.geometry.location.lng },
            place.name
          );
          if (marker) {
            restaurantMarkers.current.push(marker);
          }
        });
      } else {
        console.error("Error fetching places:", data.status);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };
  

  return (
    <div className="p-6">
      {/* 🍽️ Find Restaurants Button */}
      <Button
        onClick={fetchNearbyPlaces}
        className="flex items-center justify-center gap-2 w-full p-button-raised p-button-lg text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <i className="pi pi-spin pi-spinner mr-2"></i> Searching...
          </>
        ) : (
          "Find Restaurants 🍽️"
        )}
      </Button>

      {/* 🔄 Loading Indicator */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center mt-6 animate-fade-in">
          <ProgressSpinner style={{ width: "50px", height: "50px" }} strokeWidth="4" />
          <p className="mt-2 text-gray-700 text-lg">Fetching nearby restaurants...</p>
        </div>
      )}

      {/* 🍕 Restaurant Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 animate-fade-in">
        {restaurants.map((place, index) => (
          <Card
            key={index}
            className="p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 bg-white"
          >
            {/* 🖼️ Restaurant Image */}
            <img
              src={
                place.photos?.[0]?.photo_reference
                  ? `https://maps.gomaps.pro/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`
                  : "https://via.placeholder.com/400x250?text=No+Image"
              }
              alt={place.name}
              className="w-full h-40 object-cover rounded-lg"
            />
            {/* 📌 Restaurant Info */}
            <h3 className="text-lg font-bold mt-3 text-gray-800">{place.name}</h3>
            <p className="text-gray-600">{place.vicinity}</p>

            {/* ⭐ Ratings & Pricing */}
            <div className="flex justify-between items-center mt-2">
              <Tag
                value={`⭐ ${place.rating || "N/A"}/5`}
                className="bg-yellow-500 text-white px-3 py-1 rounded-full font-semibold"
              />
              <Tag
                value={`💲${place.price_level ? place.price_level * 10 : "10"}+`}
                className="bg-green-500 text-white px-3 py-1 rounded-full font-semibold"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NearbyRestaurants;
