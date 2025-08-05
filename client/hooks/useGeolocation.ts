import { useState, useEffect } from "react";

// FullStory-resistant fetch wrapper
async function robustFetch(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  // More comprehensive FullStory detection
  const isFullStoryActive =
    typeof window !== "undefined" &&
    ((window as any).FS ||
      (window as any)._fs_namespace ||
      document.querySelector('script[src*="fullstory"]') ||
      (typeof (window as any).fetch === "function" &&
        (window as any).fetch.toString().includes("FullStory")) ||
      document.documentElement.innerHTML.includes("fullstory"));

  // Always prefer XHR for external API calls when any tracking script is detected
  const useXHR =
    isFullStoryActive ||
    typeof (window as any).gtag === "function" ||
    typeof (window as any).ga === "function";

  if (useXHR) {
    console.log(
      "Third-party script detected, using XHR for geolocation API calls",
    );

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      try {
        xhr.open(options?.method || "GET", url, true);

        // Set proper headers for CORS
        xhr.setRequestHeader("Accept", "application/json");
        if (url.includes("nominatim.openstreetmap.org")) {
          xhr.setRequestHeader("User-Agent", "VisaConsult-India/1.0");
        }

        // Set custom headers if provided
        if (options?.headers) {
          Object.entries(options.headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, String(value));
          });
        }

        xhr.timeout = 15000; // 15 second timeout for external APIs

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = new Response(xhr.responseText, {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: new Headers({
                "Content-Type":
                  xhr.getResponseHeader("Content-Type") || "application/json",
              }),
            });
            resolve(response);
          } else {
            reject(new Error(`XHR Error: ${xhr.status} ${xhr.statusText}`));
          }
        };

        xhr.onerror = () => {
          console.error("XHR network error for:", url);
          reject(new Error(`XHR Network Error`));
        };

        xhr.ontimeout = () => {
          console.error("XHR timeout for:", url);
          reject(new Error(`XHR Timeout after 15s`));
        };

        xhr.send(options?.body);
      } catch (error) {
        console.error("XHR setup error:", error);
        reject(new Error(`XHR Setup Error: ${error}`));
      }
    });
  }

  // Fallback to native fetch only if no tracking scripts detected
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    console.error(
      "Native fetch failed completely, using final XHR fallback:",
      error,
    );

    // Final XHR fallback
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(options?.method || "GET", url, true);
      xhr.timeout = 10000;

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(new Response(xhr.responseText, { status: xhr.status }));
        } else {
          reject(new Error(`Final XHR Error: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Final XHR Network Error"));
      xhr.ontimeout = () => reject(new Error("Final XHR Timeout"));
      xhr.send(options?.body);
    });
  }
}

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
      const response = await robustFetch(
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
      const response = await robustFetch("https://ipapi.co/json/");

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
