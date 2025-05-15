"use client";

import { useState } from "react";
import SearchBar from "./components/SearchBar";

interface GeoResponse {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export default function HomePage() {
  const [location, setLocation] = useState<GeoResponse | null>(null);

  const handleCitySearch = async (city: string) => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (!apiKey) {
      console.log("Missing OpenWeather API Key.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location.");
      }

      const data: GeoResponse[] = await response.json();

      if (data.length === 0) {
        alert("City not found.");
        return;
      }

      const locationData = data[0];
      console.log("Geocoded Location:", locationData);
      setLocation(locationData);
    } catch (error) {
      console.log("Geocoding error:", error);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">Weather App</h1>
      <SearchBar onSearch={handleCitySearch} />

      {location && (
        <div className="mt-4">
          <p className="text-lg">
            📍 {location.name}, {location.state && `${location.state}, `}{location.country}
          </p>
          <p className="text-sm text-gray-500">Lat: {location.lat}, Lon: {location.lon}</p>
        </div>
      )}
    </main>
  );
}
