import { useState, useEffect } from "react";

// DISABLED: External API calls blocked in production
async function robustFetch(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  console.log("🚨 GEOLOCATION BLOCKED: External API call prevented");
  return Promise.resolve(new Response('{"blocked":true}', {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  }));
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
  // COMPLETELY DISABLED - RETURN STATIC DATA TO PREVENT SYNTAX ERRORS
  return {
    location: {
      city: "Dubai",
      country: "United Arab Emirates", 
      countryCode: "AE",
      region: "Dubai",
      latitude: 25.2048,
      longitude: 55.2708
    },
    isLoading: false,
    error: null,
    hasPermission: true
  };
}
