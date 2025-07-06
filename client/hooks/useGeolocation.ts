import { useState, useEffect } from "react";

interface LocationData {
  city: string;
  country: string;
  countryCode: string;
  region: string;
  latitude: number;
  longitude: number;
}

interface GeolocationResult {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean;
}

export function useGeolocation(): GeolocationResult {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const getLocationFromCoords = async (
    latitude: number,
    longitude: number,
  ): Promise<LocationData | null> => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free and no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch location data");
      }

      const data = await response.json();

      return {
        city:
          data.address?.city ||
          data.address?.town ||
          data.address?.village ||
          "Unknown City",
        country: data.address?.country || "Unknown Country",
        countryCode: data.address?.country_code?.toUpperCase() || "",
        region: data.address?.state || data.address?.region || "",
        latitude,
        longitude,
      };
    } catch (err) {
      console.error("Error fetching location data:", err);
      throw err;
    }
  };

  const getLocationFromIP = async (): Promise<LocationData | null> => {
    try {
      // Fallback to IP-based location (free service)
      const response = await fetch("https://ipapi.co/json/");

      if (!response.ok) {
        throw new Error("Failed to fetch IP location");
      }

      const data = await response.json();

      return {
        city: data.city || "Unknown City",
        country: data.country_name || "Unknown Country",
        countryCode: data.country_code || "",
        region: data.region || "",
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
      };
    } catch (err) {
      console.error("Error fetching IP location:", err);
      throw err;
    }
  };

  useEffect(() => {
    const detectLocation = async () => {
      setIsLoading(true);
      setError(null);

      // Check if geolocation is supported
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by this browser");
        setHasPermission(false);

        // Try IP-based location as fallback
        try {
          const ipLocation = await getLocationFromIP();
          setLocation(ipLocation);
        } catch (err) {
          setError("Unable to detect location");
        }

        setIsLoading(false);
        return;
      }

      // Try to get precise location using GPS
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setHasPermission(true);
          try {
            const locationData = await getLocationFromCoords(
              position.coords.latitude,
              position.coords.longitude,
            );
            setLocation(locationData);
          } catch (err) {
            setError("Failed to get location details");
          }
          setIsLoading(false);
        },
        async (error) => {
          setHasPermission(false);
          console.log("Geolocation error:", error.message);

          // If GPS fails, try IP-based location
          try {
            const ipLocation = await getLocationFromIP();
            setLocation(ipLocation);
          } catch (err) {
            setError("Unable to detect location");
          }

          setIsLoading(false);
        },
        {
          enableHighAccuracy: false, // Use network location for faster response
          timeout: 10000, // 10 second timeout
          maximumAge: 300000, // Cache for 5 minutes
        },
      );
    };

    detectLocation();
  }, []);

  return {
    location,
    isLoading,
    error,
    hasPermission,
  };
}
