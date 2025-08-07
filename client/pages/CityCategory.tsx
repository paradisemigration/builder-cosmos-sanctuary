import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { EnquiryPopup, FloatingCTA } from "@/components/EnquiryPopup";

// Detect third-party interference (FullStory, etc.)
const hasThirdPartyInterference = (): boolean => {
  try {
    // Check for FullStory
    return (
      !!(window as any).FS ||
      !!(window as any)._fs_loaded ||
      document.querySelector('script[src*="fullstory"]')
    );
  } catch {
    return false;
  }
};

// Pure XHR implementation that bypasses all fetch interference
function safeXhrFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  return new Promise((resolve) => {
    try {
      const xhr = new XMLHttpRequest();
      const method = options.method || "GET";

      xhr.open(method, url, true);

      // Set headers
      if (options.headers) {
        const headers = options.headers as Record<string, string>;
        Object.keys(headers).forEach((key) => {
          try {
            xhr.setRequestHeader(key, headers[key]);
          } catch (headerError) {
            console.log("Header error:", headerError);
          }
        });
      }

      // Handle timeout
      xhr.timeout = 8000; // 8 second timeout

      xhr.onload = () => {
        try {
          const response = new Response(xhr.responseText, {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: new Headers(),
          });
          resolve(response);
        } catch (responseError) {
          console.log("Response creation error:", responseError);
          // Return empty response if Response creation fails
          resolve(
            new Response(
              JSON.stringify({ success: false, businesses: [], total: 0 }),
              {
                status: 200,
                statusText: "OK",
                headers: new Headers({ "Content-Type": "application/json" }),
              },
            ),
          );
        }
      };

      xhr.onerror = () => {
        console.log("XHR network error for:", url);
        resolve(
          new Response(
            JSON.stringify({ success: false, businesses: [], total: 0 }),
            {
              status: 200,
              statusText: "OK",
              headers: new Headers({ "Content-Type": "application/json" }),
            },
          ),
        );
      };

      xhr.ontimeout = () => {
        console.log("XHR timeout for:", url);
        resolve(
          new Response(
            JSON.stringify({ success: false, businesses: [], total: 0 }),
            {
              status: 200,
              statusText: "OK",
              headers: new Headers({ "Content-Type": "application/json" }),
            },
          ),
        );
      };

      xhr.send((options.body as string) || null);
    } catch (xhrError) {
      console.log("XHR setup error:", xhrError);
      // Return empty response if XHR setup fails
      resolve(
        new Response(
          JSON.stringify({ success: false, businesses: [], total: 0 }),
          {
            status: 200,
            statusText: "OK",
            headers: new Headers({ "Content-Type": "application/json" }),
          },
        ),
      );
    }
  });
}

// Robust fetch wrapper that handles third-party interference
async function robustFetch(
  url: string,
  options: RequestInit = {},
  retries = 2,
): Promise<Response> {
  const useXhrOnly = hasThirdPartyInterference();

  if (useXhrOnly) {
    console.log("Third-party interference detected, using XHR-only mode");
    return safeXhrFetch(url, options);
  }

  // Standard retry logic for environments without interference
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(url, {
        ...options,
        signal: options.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok || response.status === 404) {
        return response;
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      console.log(`Fetch attempt ${i + 1} failed for ${url}:`, error);

      if (i === retries - 1) {
        console.log("All standard fetch attempts failed, falling back to XHR");
        return safeXhrFetch(url, options);
      }

      // Short wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // Final fallback
  return safeXhrFetch(url, options);
}
import {
  Search,
  Filter,
  MapPin,
  Star,
  ChevronDown,
  Grid,
  List,
  SortAsc,
  Users,
  Building,
  TrendingUp,
  ArrowLeft,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  sampleBusinesses,
  businessCategories,
  type Business,
} from "@/lib/data";
import {
  allCities,
  allCategories,
  completeCategoryMapping,
  getCategoryBySlug,
  getCitySlug,
  uaeCities,
  allIndianCities,
} from "@/lib/all-categories";
import {
  generateCityCategoryMeta,
  setPageMeta,
  setSEOLinks,
  setBreadcrumbStructuredData,
  setCityServiceStructuredData,
} from "@/lib/meta-utils";
import { DebugPopup } from "@/components/DebugPopup";

// Mapping of areas/neighborhoods to their main cities for fallback (same as CityBusinessListing)
const nearbyAreasMapping: Record<string, string[]> = {
  // Dubai main city - fallback to other UAE cities
  dubai: ["Abu Dhabi", "Sharjah"],

  // Dubai sub-areas (all should fallback to Dubai first, then other Dubai areas)
  "al barsha": [
    "Dubai",
    "Business Bay",
    "Downtown Dubai",
    "Dubai Marina",
    "JLT",
    "DIFC",
  ],
  "business bay": [
    "Dubai",
    "Downtown Dubai",
    "DIFC",
    "Al Barsha",
    "Dubai Marina",
  ],
  "downtown dubai": ["Dubai", "Business Bay", "DIFC", "Dubai Marina", "JLT"],
  "dubai marina": [
    "Dubai",
    "JLT",
    "Business Bay",
    "Downtown Dubai",
    "Jumeirah",
  ],
  jlt: ["Dubai", "Dubai Marina", "Business Bay", "Downtown Dubai", "DIFC"],
  difc: ["Dubai", "Business Bay", "Downtown Dubai", "JLT", "Dubai Marina"],
  deira: ["Dubai", "Bur Dubai", "Downtown Dubai", "Business Bay"],
  "bur dubai": ["Dubai", "Deira", "Downtown Dubai", "Business Bay"],
  jumeirah: ["Dubai", "Dubai Marina", "Business Bay", "Downtown Dubai"],
  mirdif: ["Dubai", "International City", "Business Bay", "Downtown Dubai"],
  "international city": ["Dubai", "Mirdif", "Business Bay", "Downtown Dubai"],

  // Abu Dhabi areas - NO fallback for main Abu Dhabi city to show only Abu Dhabi businesses
  "al ain": ["Abu Dhabi", "Dubai", "Sharjah"],

  // Other UAE cities fallback to main emirates
  ajman: ["Sharjah", "Dubai"], // Updated: Ajman should show Sharjah and Dubai businesses
  "ras al khaimah": ["Dubai", "Sharjah", "Abu Dhabi"],
  fujairah: ["Dubai", "Sharjah", "Abu Dhabi"],
  "umm al quwain": ["Dubai", "Sharjah", "Abu Dhabi"],

  // India major cities and their fallbacks (metro and regional hierarchies)

  // Delhi NCR region
  delhi: ["Gurgaon", "Noida", "Faridabad", "Ghaziabad"],
  gurgaon: ["Delhi", "Noida", "Faridabad", "Ghaziabad"],
  gurugram: ["Delhi", "Noida", "Faridabad", "Ghaziabad"],
  noida: ["Delhi", "Gurgaon", "Greater Noida", "Faridabad"],
  faridabad: ["Delhi", "Gurgaon", "Noida", "Ghaziabad"],
  "greater noida": ["Delhi", "Noida", "Gurgaon", "Faridabad"],
  ghaziabad: ["Delhi", "Noida", "Gurgaon", "Faridabad"],

  // Mumbai region
  mumbai: ["Pune", "Thane", "Navi Mumbai", "Nashik", "Aurangabad"],
  "navi mumbai": ["Mumbai", "Thane", "Pune", "Kalyan"],
  thane: ["Mumbai", "Navi Mumbai", "Kalyan", "Pune"],
  kalyan: ["Mumbai", "Thane", "Navi Mumbai", "Pune"],
  andheri: ["Mumbai", "Bandra", "Thane", "Pune"],
  bandra: ["Mumbai", "Andheri", "Thane", "Pune"],
  pune: ["Mumbai", "Nashik", "Aurangabad", "Kolhapur", "Satara"],

  // Maharashtra extended region
  nashik: [
    "Mumbai",
    "Pune",
    "Aurangabad",
    "Ahmednagar",
    "Solapur",
    "Kolhapur",
    "Satara",
    "Sangli",
  ],
  nasik: [
    "Mumbai",
    "Pune",
    "Aurangabad",
    "Ahmednagar",
    "Solapur",
    "Kolhapur",
    "Satara",
    "Sangli",
  ],
  aurangabad: ["Pune", "Nashik", "Mumbai", "Ahmednagar", "Solapur", "Nagpur"],
  ahmednagar: ["Pune", "Nashik", "Aurangabad", "Mumbai", "Solapur"],
  solapur: ["Pune", "Aurangabad", "Kolhapur", "Sangli", "Mumbai"],
  kolhapur: ["Pune", "Sangli", "Solapur", "Mumbai", "Nashik"],
  satara: ["Pune", "Kolhapur", "Sangli", "Mumbai", "Nashik"],
  sangli: ["Kolhapur", "Satara", "Pune", "Solapur", "Mumbai"],

  // Bangalore region
  bangalore: ["Hyderabad", "Chennai", "Mysore", "Mangalore"],
  bengaluru: ["Hyderabad", "Chennai", "Mysore", "Mangalore"],
  mysore: ["Bangalore", "Mangalore", "Chennai", "Hyderabad"],
  mangalore: ["Bangalore", "Mysore", "Chennai", "Kochi"],

  // Chennai region
  chennai: ["Bangalore", "Hyderabad", "Coimbatore", "Madurai"],
  coimbatore: [
    "Kochi",
    "Thiruvananthapuram",
    "Chennai",
    "Bangalore",
    "Kozhikode",
    "Madurai",
  ],
  madurai: [
    "Chennai",
    "Coimbatore",
    "Kochi",
    "Bangalore",
    "Thiruvananthapuram",
  ],
  salem: ["Chennai", "Coimbatore", "Bangalore", "Kochi"],
  erode: ["Coimbatore", "Chennai", "Kochi", "Bangalore"],
  tirupur: ["Coimbatore", "Chennai", "Kochi", "Bangalore"],
  dindigul: ["Madurai", "Coimbatore", "Chennai", "Kochi"],

  // Hyderabad region
  hyderabad: ["Bangalore", "Chennai", "Vijayawada", "Warangal"],
  secunderabad: ["Hyderabad", "Bangalore", "Chennai", "Vijayawada"],
  vijayawada: ["Hyderabad", "Chennai", "Bangalore", "Visakhapatnam"],
  visakhapatnam: ["Hyderabad", "Chennai", "Vijayawada", "Bangalore"],

  // Kolkata region
  kolkata: [
    "Howrah",
    "Durgapur",
    "Asansol",
    "Siliguri",
    "Bhubaneswar",
    "Guwahati",
    "Delhi",
    "Mumbai",
  ],
  howrah: ["Kolkata", "Durgapur", "Asansol", "Bhubaneswar"],
  durgapur: ["Kolkata", "Asansol", "Howrah", "Bhubaneswar", "Siliguri"],
  asansol: ["Kolkata", "Durgapur", "Howrah", "Bhubaneswar"],
  siliguri: ["Kolkata", "Guwahati", "Durgapur", "Howrah"],

  // Ahmedabad region
  ahmedabad: ["Surat", "Vadodara", "Rajkot", "Pune"],
  surat: ["Ahmedabad", "Vadodara", "Mumbai", "Pune"],
  vadodara: ["Ahmedabad", "Surat", "Mumbai", "Pune", "Indore", "Rajkot"],
  rajkot: ["Ahmedabad", "Surat", "Vadodara", "Jamnagar"],

  // Rajasthan region
  jaipur: ["Jodhpur", "Udaipur", "Ajmer", "Kota", "Delhi"],
  jodhpur: ["Jaipur", "Udaipur", "Ajmer", "Kota", "Delhi"],
  udaipur: ["Jaipur", "Jodhpur", "Ajmer", "Kota", "Ahmedabad"],
  ajmer: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Delhi"],
  kota: ["Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Delhi"],
  bikaner: ["Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Delhi"],
  alwar: ["Jaipur", "Delhi", "Jodhpur", "Udaipur", "Ajmer"],

  // Lucknow region
  lucknow: ["Kanpur", "Allahabad", "Varanasi", "Delhi"],
  kanpur: [
    "Lucknow",
    "Noida",
    "Allahabad",
    "Varanasi",
    "Agra",
    "Delhi",
    "Gurgaon",
    "Mumbai",
    "Bangalore",
    "Chennai",
  ],
  allahabad: ["Lucknow", "Kanpur", "Varanasi", "Delhi"],
  prayagraj: ["Lucknow", "Kanpur", "Varanasi", "Delhi"],
  varanasi: ["Lucknow", "Allahabad", "Kanpur", "Patna"],

  // Indore region
  indore: ["Bhopal", "Pune", "Ahmedabad", "Nagpur"],
  bhopal: ["Indore", "Nagpur", "Delhi", "Pune"],
  nagpur: ["Mumbai", "Pune", "Indore", "Bhopal", "Hyderabad", "Raipur", "Aurangabad"],

  // Kerala region
  kochi: [
    "Thiruvananthapuram",
    "Kozhikode",
    "Thrissur",
    "Bangalore",
    "Chennai",
    "Coimbatore",
  ],
  cochin: [
    "Thiruvananthapuram",
    "Kozhikode",
    "Thrissur",
    "Bangalore",
    "Chennai",
    "Coimbatore",
  ],
  thiruvananthapuram: [
    "Kochi",
    "Kozhikode",
    "Thrissur",
    "Chennai",
    "Bangalore",
    "Coimbatore",
  ],
  trivandrum: [
    "Kochi",
    "Kozhikode",
    "Thrissur",
    "Chennai",
    "Bangalore",
    "Coimbatore",
  ],
  kozhikode: [
    "Kochi",
    "Thiruvananthapuram",
    "Thrissur",
    "Mangalore",
    "Chennai",
  ],
  calicut: ["Kochi", "Thiruvananthapuram", "Thrissur", "Mangalore", "Chennai"],
  thrissur: [
    "Kochi",
    "Thiruvananthapuram",
    "Kozhikode",
    "Chennai",
    "Bangalore",
  ],
  kollam: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Chennai", "Bangalore"],
  kannur: ["Kozhikode", "Kochi", "Thiruvananthapuram", "Mangalore", "Chennai"],
  palakkad: [
    "Kochi",
    "Coimbatore",
    "Thiruvananthapuram",
    "Chennai",
    "Bangalore",
  ],

  // Punjab region
  chandigarh: ["Ludhiana", "Amritsar", "Jalandhar", "Delhi"],
  ludhiana: ["Chandigarh", "Amritsar", "Jalandhar", "Delhi"],
  amritsar: ["Chandigarh", "Ludhiana", "Jalandhar", "Delhi"],
  jalandhar: ["Chandigarh", "Ludhiana", "Amritsar", "Delhi"],

  // Uttarakhand region
  dehradun: ["Delhi", "Haridwar", "Chandigarh", "Rishikesh"],
  haridwar: ["Dehradun", "Delhi", "Rishikesh", "Chandigarh"],

  // Uttar Pradesh region
  lucknow: ["Kanpur", "Allahabad", "Varanasi", "Delhi"],
  kanpur: [
    "Lucknow",
    "Noida",
    "Allahabad",
    "Varanasi",
    "Agra",
    "Delhi",
    "Gurgaon",
    "Mumbai",
    "Bangalore",
    "Chennai",
  ],
  agra: ["Delhi", "Gwalior", "Lucknow", "Mathura"],
  allahabad: ["Lucknow", "Varanasi", "Kanpur", "Delhi"],
  prayagraj: ["Lucknow", "Varanasi", "Kanpur", "Delhi"],
  varanasi: ["Allahabad", "Lucknow", "Patna", "Delhi"],
  meerut: ["Delhi", "Ghaziabad", "Muzaffarnagar", "Saharanpur"],
  bareilly: ["Delhi", "Lucknow", "Kanpur", "Moradabad"],
  aligarh: ["Delhi", "Agra", "Mathura", "Ghaziabad"],
  saharanpur: ["Delhi", "Meerut", "Dehradun", "Muzaffarnagar"],
  gorakhpur: ["Lucknow", "Varanasi", "Allahabad", "Patna"],
  firozabad: ["Agra", "Delhi", "Mathura", "Aligarh"],
  loni: ["Delhi", "Ghaziabad", "Meerut", "Noida"],
  jhansi: ["Gwalior", "Agra", "Lucknow", "Kanpur"],
  gaya: ["Patna", "Varanasi", "Ranchi", "Bodh Gaya"],

  // Madhya Pradesh region
  indore: ["Bhopal", "Ujjain", "Mumbai", "Ahmedabad"],
  bhopal: ["Indore", "Jabalpur", "Gwalior", "Delhi"],
  jabalpur: ["Bhopal", "Nagpur", "Indore", "Raipur"],
  gwalior: ["Agra", "Bhopal", "Jhansi", "Delhi"],
  ujjain: ["Indore", "Bhopal", "Ahmedabad", "Kota"],
  raipur: ["Nagpur", "Bhubaneswar", "Jabalpur", "Kolkata"],

  // Maharashtra additional cities
  nashik: ["Mumbai", "Pune", "Aurangabad", "Ahmednagar", "Solapur"],
  aurangabad: ["Mumbai", "Pune", "Nashik", "Ahmednagar"],
  solapur: ["Pune", "Mumbai", "Kolhapur", "Satara"],
  kolhapur: ["Pune", "Mumbai", "Solapur", "Sangli"],
  "kalyan-dombivali": ["Mumbai", "Thane", "Navi Mumbai", "Pune"],
  "vasai-virar": ["Mumbai", "Thane", "Pune", "Nashik"],
  "pimpri-chinchwad": ["Pune", "Mumbai", "Nashik", "Aurangabad"],
  bhiwandi: ["Mumbai", "Thane", "Nashik", "Kalyan"],
  amravati: ["Nagpur", "Akola", "Mumbai", "Aurangabad"],
  nanded: ["Aurangabad", "Hyderabad", "Mumbai", "Pune"],
  akola: ["Nagpur", "Amravati", "Aurangabad", "Mumbai"],
  jalgaon: ["Nashik", "Aurangabad", "Mumbai", "Pune"],
  "sangli-miraj & kupwad": ["Kolhapur", "Pune", "Mumbai", "Satara"],
  ahmednagar: ["Pune", "Nashik", "Aurangabad", "Mumbai"],
  satara: ["Pune", "Kolhapur", "Mumbai", "Sangli"],
  sangli: ["Kolhapur", "Satara", "Pune", "Mumbai"],

  // Gujarat additional cities
  surat: ["Ahmedabad", "Vadodara", "Mumbai", "Pune"],
  rajkot: ["Ahmedabad", "Surat", "Vadodara", "Jamnagar"],
  bhavnagar: ["Ahmedabad", "Rajkot", "Surat", "Vadodara"],
  jamnagar: ["Rajkot", "Ahmedabad", "Dwarka", "Surat"],

  // Karnataka additional cities
  mysore: ["Bangalore", "Mangalore", "Chennai", "Hubli"],
  "hubballi-dharwad": ["Bangalore", "Pune", "Mumbai", "Belgaum"],
  hubli: ["Bangalore", "Pune", "Mumbai", "Belgaum"],
  dharwad: ["Bangalore", "Pune", "Mumbai", "Belgaum"],
  belgaum: ["Bangalore", "Pune", "Mumbai", "Hubli"],
  gulbarga: ["Hyderabad", "Bangalore", "Pune", "Aurangabad"],

  // Tamil Nadu additional cities
  tiruchirappalli: ["Chennai", "Madurai", "Coimbatore", "Salem"],
  trichy: ["Chennai", "Madurai", "Coimbatore", "Salem"],
  tiruppur: ["Coimbatore", "Chennai", "Salem", "Erode"],
  salem: ["Chennai", "Coimbatore", "Bangalore", "Kochi"],
  erode: ["Coimbatore", "Chennai", "Salem", "Bangalore"],
  tirunelveli: ["Madurai", "Chennai", "Coimbatore", "Kochi"],
  ambattur: ["Chennai", "Bangalore", "Coimbatore", "Kochi"],

  // Andhra Pradesh/Telangana additional cities
  visakhapatnam: ["Hyderabad", "Vijayawada", "Bhubaneswar", "Chennai"],
  vizag: ["Hyderabad", "Vijayawada", "Bhubaneswar", "Chennai"],
  vijayawada: ["Hyderabad", "Visakhapatnam", "Chennai", "Guntur"],
  guntur: ["Vijayawada", "Hyderabad", "Chennai", "Nellore"],
  warangal: ["Hyderabad", "Vijayawada", "Secunderabad", "Nagpur"],
  nellore: ["Chennai", "Hyderabad", "Vijayawada", "Guntur"],

  // Bihar region
  patna: ["Ranchi", "Kolkata", "Gaya", "Muzaffarpur"],
  gaya: ["Patna", "Varanasi", "Ranchi", "Bodh Gaya"],

  // Jharkhand region
  ranchi: ["Patna", "Kolkata", "Jamshedpur", "Bhubaneswar"],
  jamshedpur: ["Ranchi", "Kolkata", "Dhanbad", "Bhubaneswar"],
  dhanbad: ["Ranchi", "Kolkata", "Jamshedpur", "Asansol"],

  // Odisha region
  bhubaneswar: ["Kolkata", "Cuttack", "Ranchi", "Visakhapatnam"],
  cuttack: ["Bhubaneswar", "Kolkata", "Ranchi", "Rourkela"],
  rourkela: ["Bhubaneswar", "Ranchi", "Kolkata", "Jamshedpur"],

  // Assam region
  guwahati: ["Kolkata", "Shillong", "Dibrugarh", "Silchar"],

  // Chhattisgarh region
  bhilai: ["Raipur", "Nagpur", "Bhubaneswar", "Kolkata"],

  // Jammu & Kashmir region
  srinagar: ["Jammu", "Chandigarh", "Delhi", "Pathankot"],
  jammu: ["Srinagar", "Chandigarh", "Delhi", "Pathankot"],

  // Haryana additional cities
  meerut: ["Delhi", "Ghaziabad", "Saharanpur", "Muzaffarnagar"],

  // Additional missing cities with logical regional mapping
  malegaon: ["Nashik", "Mumbai", "Aurangabad", "Pune"],
  ulhasnagar: ["Mumbai", "Thane", "Kalyan", "Pune"],
};

// Function to detect user location
const detectUserLocation = async (): Promise<{
  city: string;
  state: string;
} | null> => {
  try {
    // First try geolocation API
    if (navigator.geolocation) {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            enableHighAccuracy: false,
          });
        },
      );

      // Try to get city from coordinates using reverse geocoding
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await robustFetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
          {
            signal: controller.signal,
          },
          2, // Only 2 retries for external APIs
        );
        clearTimeout(timeoutId);

        const data = await response.json();

        if (data.city && data.principalSubdivision) {
          return {
            city: data.city,
            state: data.principalSubdivision,
          };
        }
      } catch (geoError) {
        console.log("Reverse geocoding failed:", geoError);
      }
    }

    // Fallback: Try to detect location from IP (less accurate but works without permission)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await robustFetch(
        "https://ipapi.co/json/",
        {
          signal: controller.signal,
        },
        2,
      ); // Only 2 retries for external APIs
      clearTimeout(timeoutId);

      const data = await response.json();

      if (data.city && data.region) {
        return {
          city: data.city,
          state: data.region,
        };
      }
    } catch (ipError) {
      console.log("IP-based location detection failed:", ipError);
    }

    return null;
  } catch (error) {
    console.log("Location detection failed:", error);
    return null;
  }
};

// Enhanced helper function to get nearby cities for fallback
const getNearByCities = (
  cityName: string,
  country: string,
  userLocation?: { city: string; state: string } | null,
): string[] => {
  const normalizedCity = cityName.toLowerCase();

  // Special case: Abu Dhabi should show ONLY Abu Dhabi businesses (no fallback)
  if (normalizedCity === "abu dhabi" || normalizedCity === "abu-dhabi") {
    return []; // No fallback for Abu Dhabi
  }

  // Check if we have nearby areas mapping
  if (nearbyAreasMapping[normalizedCity]) {
    return nearbyAreasMapping[normalizedCity];
  }

  // For Indian cities, try to use user location for better suggestions
  if (country === "india" && userLocation) {
    const userCity = userLocation.city.toLowerCase();
    const userState = userLocation.state.toLowerCase();

    // If user is in the same state, suggest major cities in that state
    const stateCities: Record<string, string[]> = {
      delhi: ["Delhi", "Gurgaon", "Noida", "Faridabad"],
      haryana: ["Gurgaon", "Delhi", "Noida", "Faridabad"],
      "uttar pradesh": ["Noida", "Delhi", "Lucknow", "Kanpur"],
      maharashtra: [
        "Mumbai",
        "Pune",
        "Nashik",
        "Aurangabad",
        "Solapur",
        "Kolhapur",
        "Ahmednagar",
        "Satara",
        "Sangli",
        "Thane",
        "Nagpur",
      ],
      karnataka: ["Bangalore", "Mysore", "Mangalore", "Hubli"],
      "tamil nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
      telangana: ["Hyderabad", "Secunderabad", "Warangal", "Nizamabad"],
      "west bengal": [
        "Kolkata",
        "Howrah",
        "Durgapur",
        "Asansol",
        "Siliguri",
        "Malda",
        "Krishnanagar",
      ],
      gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
      rajasthan: [
        "Jaipur",
        "Jodhpur",
        "Udaipur",
        "Ajmer",
        "Kota",
        "Bikaner",
        "Alwar",
      ],
      kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur"],
      punjab: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar"],
    };

    if (stateCities[userState]) {
      return stateCities[userState];
    }

    // If user city is in our mapping, use those suggestions
    if (nearbyAreasMapping[userCity]) {
      return nearbyAreasMapping[userCity];
    }
  }

  // Default fallbacks by country and region
  if (country === "uae") {
    return ["Dubai", "Abu Dhabi", "Sharjah"];
  } else {
    // For India, prioritize regional cities based on the requesting city
    const lowerCityName = cityName.toLowerCase();

    // South India cities should prioritize southern metros
    const southIndianCities = [
      "coimbatore",
      "madurai",
      "salem",
      "erode",
      "tirupur",
      "dindigul",
      "kochi",
      "thiruvananthapuram",
      "kozhikode",
      "thrissur",
      "kollam",
      "mysore",
      "mangalore",
      "hubli",
      "belgaum",
      "shimoga",
    ];

    if (southIndianCities.includes(lowerCityName)) {
      return [
        "Chennai",
        "Bangalore",
        "Kochi",
        "Thiruvananthapuram",
        "Kozhikode",
        "Hyderabad",
        "Mysore",
        "Mangalore",
      ];
    }

    // East India cities should prioritize eastern metros
    const eastIndianCities = [
      "bhubaneswar",
      "cuttack",
      "guwahati",
      "siliguri",
      "durgapur",
      "asansol",
    ];

    if (eastIndianCities.includes(lowerCityName)) {
      return [
        "Kolkata",
        "Howrah",
        "Durgapur",
        "Bhubaneswar",
        "Guwahati",
        "Delhi",
        "Mumbai",
      ];
    }

    // West India cities should prioritize western metros
    const westIndianCities = [
      "surat",
      "vadodara",
      "rajkot",
      "gandhinagar",
      "jodhpur",
      "udaipur",
      "ajmer",
      "kota",
      "bikaner",
      "alwar",
    ];

    if (westIndianCities.includes(lowerCityName)) {
      return [
        "Mumbai",
        "Pune",
        "Ahmedabad",
        "Surat",
        "Vadodara",
        "Jaipur",
        "Delhi",
      ];
    }

    // North India cities get current metros priority
    return [
      "Delhi",
      "Mumbai",
      "Bangalore",
      "Chennai",
      "Hyderabad",
      "Pune",
      "Kolkata",
      "Ahmedabad",
    ];
  }
};

// Generate unique content for city+category combinations (500 words)
const generateCityCategoryContent = (
  cityName: string,
  categoryName: string,
  categorySlug: string,
  country: string,
) => {
  const isUAE = country === "uae";
  const countryName = isUAE ? "UAE" : "India";
  const currency = isUAE ? "AED" : "₹";

  // Base content templates for different categories
  const contentTemplates = {
    "visa-consultants": {
      title: `Expert ${categoryName} Services in ${cityName}`,
      content: `Finding reliable ${categoryName.toLowerCase()} in ${cityName} is crucial for your international travel and immigration goals. ${cityName} serves as a major hub for visa services in ${countryName}, offering comprehensive consultation services for various visa types including tourist, business, student, and work visas.

Professional ${categoryName.toLowerCase()} in ${cityName} provide end-to-end visa assistance, from initial consultation to final approval. These experts specialize in handling complex documentation requirements, embassy procedures, and interview preparation. With extensive knowledge of international visa regulations and requirements, ${cityName}-based consultants maintain high success rates across different visa categories.

The visa consultation process in ${cityName} typically begins with a thorough assessment of your travel purpose, destination country requirements, and documentation checklist. Experienced consultants guide clients through country-specific requirements, ensuring all necessary documents are properly prepared and submitted. This includes passport verification, financial documentation, invitation letters, and supporting certificates.

${cityName}'s ${categoryName.toLowerCase()} maintain strong relationships with various embassies and consulates, enabling efficient processing and regular updates on application status. They stay updated with changing visa policies, fee structures, and processing times across different countries. This expertise proves invaluable for both first-time applicants and frequent travelers.

Services offered by ${categoryName.toLowerCase()} in ${cityName} include visa category consultation, documentation guidance, application form assistance, appointment scheduling, and pre-submission review. Many consultants also provide additional services such as travel insurance guidance, flight booking assistance, and post-visa support for travel planning.

Cost considerations for visa consultation services in ${cityName} vary based on visa type and complexity. Standard tourist visa consultations typically range from ${currency}${isUAE ? "200-500" : "2,000-5,000"}, while complex work or immigration visas may cost ${currency}${isUAE ? "500-2,000" : "5,000-25,000"}. Investment in professional consultation often proves cost-effective by avoiding rejection and reapplication expenses.

Choose ${categoryName.toLowerCase()} in ${cityName} based on their specialization, success rates, customer reviews, and transparency in fee structure. Verify their credentials, experience with your target destination, and availability for ongoing support throughout the visa process.`,
    },

    "immigration-consultants": {
      title: `Professional ${categoryName} in ${cityName}`,
      content: `${cityName} hosts some of ${countryName}'s most experienced ${categoryName.toLowerCase()}, specializing in permanent residency, citizenship applications, and long-term immigration solutions. These professionals provide comprehensive guidance for individuals and families seeking to establish permanent roots in international destinations.

Immigration processes differ significantly from temporary visa applications, requiring specialized knowledge of immigration laws, points-based systems, and long-term settlement requirements. ${cityName}'s ${categoryName.toLowerCase()} possess in-depth understanding of various immigration programs including skilled worker categories, investor visas, family reunification, and refugee protection.

The immigration consultation process in ${cityName} begins with eligibility assessment for different immigration programs. Consultants evaluate factors such as education credentials, work experience, language proficiency, and financial capacity to determine the most suitable immigration pathway. This assessment helps prioritize applications with higher success probability.

Professional ${categoryName.toLowerCase()} in ${cityName} assist with complex documentation including educational credential assessment, work experience verification, language test preparation, and medical examinations. They provide guidance on points calculation for skilled migration programs and help optimize profiles for maximum scoring potential.

${cityName}'s immigration experts maintain updated knowledge of changing immigration policies, quota systems, and processing timeframes across popular destinations like Canada, Australia, New Zealand, and European countries. This expertise enables accurate timeline predictions and realistic expectation setting for clients.

Services include immigration program selection, documentation preparation, points optimization, application submission, and ongoing case management. Many consultants also provide settlement services guidance, including job search assistance, accommodation planning, and initial settlement support upon arrival.

Immigration consultation fees in ${cityName} typically range from ${currency}${isUAE ? "1,000-5,000" : "15,000-75,000"} depending on program complexity and service scope. Comprehensive packages often include multiple application attempts and ongoing support throughout the process.

Successful immigration requires careful planning, accurate documentation, and expert guidance throughout the lengthy process. ${cityName}'s ${categoryName.toLowerCase()} provide this essential support, significantly improving approval chances and reducing processing complications.`,
    },

    "study-abroad-consultants": {
      title: `Leading ${categoryName} in ${cityName}`,
      content: `${cityName} has emerged as a premier destination for international education consulting, with experienced ${categoryName.toLowerCase()} helping students achieve their academic dreams worldwide. These educational advisors specialize in university selection, application processes, and comprehensive student support services.

International education planning requires careful consideration of academic goals, financial capacity, and career objectives. ${cityName}'s ${categoryName.toLowerCase()} provide personalized guidance for undergraduate, postgraduate, and doctoral programs across popular destinations including USA, UK, Canada, Australia, Germany, and other European countries.

The consultation process begins with academic profile assessment, identifying suitable universities and programs based on academic background, test scores, and career aspirations. Consultants in ${cityName} maintain extensive databases of international universities, admission requirements, and scholarship opportunities to provide tailored recommendations.

${categoryName} in ${cityName} assist with standardized test preparation including IELTS, TOEFL, GRE, GMAT, and SAT. They provide guidance on achieving required scores and offer test preparation resources and coaching. Additionally, they help craft compelling statements of purpose, recommendation letters, and academic essays that strengthen application profiles.

Application management services include university shortlisting, deadline tracking, document preparation, and submission coordination. ${cityName}'s consultants ensure all requirements are met for multiple university applications, maximizing admission chances while maintaining application quality.

Financial planning represents a crucial aspect of study abroad consulting in ${cityName}. Consultants provide guidance on education costs, living expenses, scholarship opportunities, and education loan options. They help families understand total investment requirements and plan financing strategies accordingly.

Student visa assistance forms an integral part of services offered by ${categoryName.toLowerCase()} in ${cityName}. This includes visa documentation, embassy interview preparation, and guidance on student visa regulations. Experienced consultants ensure visa applications align with university admissions for seamless processing.

Consultation fees in ${cityName} typically range from ${currency}${isUAE ? "500-2,000" : "5,000-25,000"} depending on service scope and destination complexity. Comprehensive packages often include ongoing support throughout the admission and visa process, ensuring students receive continuous guidance until departure.`,
    },

    "work-visa-consultants": {
      title: `Professional ${categoryName} Services in ${cityName}`,
      content: `${cityName} hosts specialized ${categoryName.toLowerCase()} who provide comprehensive assistance for international employment opportunities. These professionals understand the complex requirements of work visa applications across various countries and employment sectors, ensuring clients navigate the process efficiently.

Work visa regulations vary significantly between countries, requiring specialized knowledge of labor market tests, employer sponsorship requirements, and skill assessment procedures. ${cityName}'s ${categoryName.toLowerCase()} maintain updated expertise on popular destinations including Canada, Australia, USA, UK, Germany, and other countries with active skilled worker programs.

The work visa consultation process in ${cityName} begins with career profile assessment, evaluating educational qualifications, work experience, and language proficiency. Consultants help identify suitable visa categories and countries based on professional background and career objectives, maximizing approval chances through strategic application approaches.

${categoryName} in ${cityName} assist with complex documentation including skills assessment, educational credential evaluation, and employment verification. They guide clients through professional registration requirements, occupational licensing procedures, and employer nomination processes where applicable.

Employer sponsorship represents a crucial aspect of many work visa applications. ${cityName}'s consultants maintain networks with international employers and recruitment agencies, facilitating job search assistance and employer sponsorship opportunities. They provide guidance on job application strategies and interview preparation for overseas positions.

Points-based systems for skilled migration require strategic optimization to achieve competitive scores. ${cityName}'s ${categoryName.toLowerCase()} help clients enhance their profiles through additional qualifications, language improvement, and work experience accumulation to maximize points allocation.

Processing timeframes for work visas vary considerably, often requiring 6-18 months depending on the destination country and visa category. ${cityName}'s consultants provide realistic timeline expectations and regular updates throughout the application process, ensuring clients remain informed of progress and requirements.

Service fees for work visa consultation in ${cityName} typically range from ${currency}${isUAE ? "1,000-3,000" : "10,000-40,000"} depending on destination complexity and service scope. Many consultants offer comprehensive packages including job search assistance, skills assessment, and ongoing support throughout the immigration process.`,
    },

    "tourist-visa-services": {
      title: `Reliable ${categoryName} in ${cityName}`,
      content: `${cityName} offers comprehensive ${categoryName.toLowerCase()} for travelers seeking leisure, business, or family visit opportunities worldwide. These services cater to diverse travel needs, from short-term tourism to extended business visits, ensuring proper documentation and smooth embassy processing.

Tourist visa requirements vary significantly across destinations, with each country maintaining specific documentation standards, financial proof requirements, and processing procedures. ${cityName}'s service providers specialize in popular destinations including Schengen countries, USA, UK, Canada, Australia, and Asian tourist destinations.

The tourist visa application process in ${cityName} begins with destination-specific consultation, reviewing entry requirements, documentation checklists, and processing timeframes. Service providers ensure clients understand visa validity periods, entry restrictions, and permitted activities under tourist visa categories.

Documentation assistance forms the core of ${categoryName.toLowerCase()} in ${cityName}. This includes passport verification, photograph specifications, application form completion, and supporting document compilation. Experienced providers ensure all documentation meets embassy standards and submission requirements.

Financial documentation represents a critical component of tourist visa applications. ${cityName}'s service providers guide clients on acceptable proof of funds, bank statement requirements, and financial sponsorship procedures where applicable. They help prepare convincing financial documentation that demonstrates genuine travel intentions.

Travel itinerary planning and accommodation booking assistance are additional services offered by providers in ${cityName}. This includes flight reservation guidance, hotel booking support, and comprehensive travel planning that aligns with visa application requirements and embassy expectations.

Embassy interview preparation services help applicants present their cases effectively. ${cityName}'s providers offer mock interview sessions, guidance on answering common questions, and strategies for demonstrating genuine travel intentions while addressing potential concerns about overstaying.

Processing fees for tourist visa services in ${cityName} typically range from ${currency}${isUAE ? "100-500" : "1,000-8,000"} excluding embassy fees, depending on destination and service complexity. Express processing options are available for urgent travel requirements, though additional charges may apply for expedited services.`,
    },

    "student-visa-consultants": {
      title: `Expert ${categoryName} in ${cityName}`,
      content: `${cityName} provides specialized ${categoryName.toLowerCase()} services for students pursuing international education opportunities. These professionals focus exclusively on student visa applications, understanding the unique requirements and challenges associated with educational travel and long-term study abroad programs.

Student visa applications require comprehensive documentation proving genuine educational intentions, financial capacity, and ties to home country. ${cityName}'s ${categoryName.toLowerCase()} specialize in assembling convincing application packages that address embassy concerns while highlighting student credentials and academic goals.

The student visa process in ${cityName} begins with educational credential verification and English language proficiency assessment. Consultants guide students through standardized test requirements including IELTS, TOEFL, and other language certifications required by destination countries and educational institutions.

Financial documentation for student visas requires careful preparation, demonstrating sufficient funds for tuition fees, living expenses, and additional costs. ${cityName}'s consultants assist with education loan applications, scholarship documentation, and financial sponsorship arrangements that satisfy embassy requirements.

Statement of Purpose (SOP) preparation represents a crucial aspect of student visa applications. ${cityName}'s ${categoryName.toLowerCase()} help craft compelling narratives that articulate academic goals, career objectives, and reasons for choosing specific institutions and countries, addressing potential immigration concerns.

Embassy interview preparation for student visas focuses on demonstrating genuine educational intentions and post-graduation plans. ${cityName}'s consultants provide comprehensive interview coaching, including mock sessions that prepare students for common questions and potential concerns about study abroad motivations.

Post-visa services include pre-departure orientation, accommodation guidance, and initial settlement support. Many ${categoryName.toLowerCase()} in ${cityName} maintain ongoing relationships with students, providing assistance with visa extensions, work permit applications, and post-graduation immigration options.

Student visa consultation fees in ${cityName} range from ${currency}${isUAE ? "300-1,000" : "3,000-15,000"} depending on destination and service scope. Comprehensive packages often include university selection assistance, application support, and visa guidance, providing complete educational consulting solutions for international study aspirations.`,
    },
  };

  // Get appropriate template or use default
  const template =
    contentTemplates[categorySlug] || contentTemplates["visa-consultants"];

  return {
    title: template.title,
    content: template.content,
  };
};

// Generate unique content for city pages (500 words)
const generateCityContent = (cityName: string, country: string) => {
  const isUAE = country === "uae";
  const countryName = isUAE ? "UAE" : "India";

  return {
    title: `Comprehensive Visa & Immigration Services in ${cityName}`,
    content: `${cityName} stands as a prominent hub for visa and immigration services in ${countryName}, offering comprehensive solutions for international travel, study abroad, work permits, and permanent residency applications. The city hosts numerous experienced consultants specializing in various aspects of visa processing and immigration guidance.

The visa consultation landscape in ${cityName} encompasses diverse services including tourist visa processing, business visa assistance, student visa guidance, work permit applications, and complex immigration procedures. Professional consultants in the city maintain extensive knowledge of international visa regulations, embassy requirements, and documentation standards across multiple countries.

${cityName}'s strategic location and established infrastructure make it an ideal base for visa services targeting popular destinations such as USA, Canada, UK, Australia, European Union countries, and other international locations. The city's consultants leverage strong relationships with embassies, consulates, and international institutions to facilitate efficient processing.

Educational consulting represents a significant sector within ${cityName}'s visa services industry. Study abroad consultants assist students with university selection, application processes, scholarship guidance, and student visa applications. These services cover undergraduate, postgraduate, and doctoral programs across globally recognized institutions.

Immigration services in ${cityName} extend beyond temporary visas to include permanent residency applications, citizenship procedures, and family reunification processes. Experienced immigration lawyers and consultants provide specialized guidance for complex cases requiring legal expertise and comprehensive documentation support.

The business visa and work permit sector in ${cityName} serves corporate clients, entrepreneurs, and skilled professionals seeking international opportunities. Consultants specialize in various work visa categories, investor visas, and business establishment procedures across different countries with varying requirements and regulations.

Quality assurance remains paramount among ${cityName}'s visa service providers. Reputable consultants maintain high success rates through thorough preparation, accurate documentation, and comprehensive client support. They provide realistic timeline expectations and transparent fee structures to ensure client satisfaction throughout the process.

Technology integration has modernized visa services in ${cityName}, with consultants utilizing digital platforms for application tracking, document management, and client communication. This technological advancement enhances efficiency and provides real-time updates on application progress.

Cost considerations for visa services in ${cityName} vary significantly based on service type, destination country, and application complexity. Clients benefit from competitive pricing and comprehensive service packages that often prove more cost-effective than independent application attempts.

${cityName}'s visa and immigration industry continues evolving with changing global requirements and emerging opportunities. Consultants regularly update their expertise through training programs, embassy interactions, and industry developments to maintain service quality and success rates. This commitment to excellence positions ${cityName} as a trusted destination for comprehensive visa and immigration solutions.`,
  };
};

// Generate unique FAQs for each category and city combination
const getFAQs = (categorySlug: string, cityName: string) => {
  // Get category name for better FAQ content
  const category = allCategories.find((c) => c.slug === categorySlug);
  const categoryName = category ? category.name : "Consultants";

  const baseFAQs = {
    "study-abroad-consultants": [
      {
        question: `What are the best ${categoryName.toLowerCase()} in ${cityName}?`,
        answer: `The top ${categoryName.toLowerCase()} in ${cityName} are those with proven track records, certified credentials, and high success rates. Look for consultants who specialize in your target country and have partnerships with international universities.`,
      },
      {
        question: `How much do ${categoryName.toLowerCase()} charge in ${cityName}?`,
        answer: `${categoryName} fees in ${cityName} typically range from AED 1,500 to AED 8,000 depending on the services included. Most consultants offer package deals that include university selection, application assistance, and visa guidance.`,
      },
      {
        question: `Which countries are most popular for studying abroad from ${cityName}?`,
        answer: `Students working with ${categoryName.toLowerCase()} in ${cityName} commonly choose USA, UK, Canada, Australia, Germany, and Ireland for higher education. The choice depends on factors like course availability, budget, and immigration policies.`,
      },
      {
        question: `What documents do I need when working with ${categoryName.toLowerCase()} in ${cityName}?`,
        answer: `Essential documents include academic transcripts, standardized test scores (IELTS/TOEFL/GRE/GMAT), passport, statement of purpose, recommendation letters, and financial proof. Requirements vary by country and university.`,
      },
      {
        question: `How long does the study abroad application process take with ${categoryName.toLowerCase()} in ${cityName}?`,
        answer: `The complete process typically takes 6-12 months from university application to visa approval. Starting early and working with experienced ${categoryName.toLowerCase()} in ${cityName} can help streamline the timeline.`,
      },
    ],
    "study-abroad": [
      {
        question: `What are the best study abroad consultants in ${cityName}?`,
        answer: `The top study abroad consultants in ${cityName} are those with proven track records, certified credentials, and high success rates. Look for consultants who specialize in your target country and have partnerships with international universities.`,
      },
      {
        question: `How much do study abroad consultants charge in ${cityName}?`,
        answer: `Study abroad consultation fees in ${cityName} typically range from AED 1,500 to AED 8,000 depending on the services included. Most consultants offer package deals that include university selection, application assistance, and visa guidance.`,
      },
      {
        question: `Which countries are most popular for studying abroad from ${cityName}?`,
        answer: `Students from ${cityName} commonly choose USA, UK, Canada, Australia, Germany, and Ireland for higher education. The choice depends on factors like course availability, budget, and immigration policies.`,
      },
      {
        question: `What documents do I need for studying abroad from ${cityName}?`,
        answer: `Essential documents include academic transcripts, standardized test scores (IELTS/TOEFL/GRE/GMAT), passport, statement of purpose, recommendation letters, and financial proof. Requirements vary by country and university.`,
      },
      {
        question: `How long does the study abroad application process take in ${cityName}?`,
        answer: `The complete process typically takes 6-12 months from university application to visa approval. Starting early and working with experienced consultants in ${cityName} can help streamline the timeline.`,
      },
    ],
    "immigration-consultants": [
      {
        question: `How to choose the best ${categoryName.toLowerCase()} in ${cityName}?`,
        answer: `Choose licensed ${categoryName.toLowerCase()} in ${cityName} with MARA/ICCRC certification, positive reviews, transparent fee structure, and specialization in your visa category. Verify their credentials and success rates.`,
      },
      {
        question: `What services do ${categoryName.toLowerCase()} offer in ${cityName}?`,
        answer: `${categoryName} in ${cityName} offer services including permanent residency applications, work permits, family sponsorship, refugee claims, citizenship applications, and immigration appeals.`,
      },
      {
        question: `How much do ${categoryName.toLowerCase()} charge in ${cityName}?`,
        answer: `${categoryName} fees in ${cityName} vary from AED 2,000 to AED 15,000 depending on the complexity of your case. Most consultants offer free initial assessments and transparent pricing.`,
      },
      {
        question: `Which countries offer the best immigration opportunities through ${categoryName.toLowerCase()} in ${cityName}?`,
        answer: `Popular immigration destinations from ${cityName} include Canada, Australia, New Zealand, USA, and several European countries. Each has different requirements and immigration pathways.`,
      },
      {
        question: `What is the success rate of ${categoryName.toLowerCase()} in ${cityName}?`,
        answer: `Success rates vary by country and visa category, but experienced ${categoryName.toLowerCase()} in ${cityName} typically achieve 80-95% success rates for well-prepared applications with eligible candidates.`,
      },
    ],
    "visa-consultants": [
      {
        question: `What types of visas can ${categoryName.toLowerCase()} in ${cityName} help with?`,
        answer: `${categoryName} in ${cityName} assist with tourist visas, business visas, work permits, family visas, student visas, and transit visas for various countries worldwide with specialized expertise.`,
      },
      {
        question: `How long does visa processing take through ${categoryName.toLowerCase()} in ${cityName}?`,
        answer: `Processing times vary by country and visa type, ranging from 3-30 working days. ${categoryName} in ${cityName} can provide accurate timelines and expedited services when available.`,
      },
      {
        question: `What documents are required for visa applications with ${categoryName.toLowerCase()} in ${cityName}?`,
        answer: `Common requirements include valid passport, photographs, application forms, financial proof, travel itinerary, accommodation bookings, and invitation letters. Specific requirements vary by destination country.`,
      },
      {
        question: `Can ${categoryName.toLowerCase()} in ${cityName} guarantee visa approval?`,
        answer: `Reputable ${categoryName.toLowerCase()} in ${cityName} cannot guarantee approval but can significantly increase your chances through proper documentation, application preparation, and guidance based on their experience.`,
      },
      {
        question: `What are the ${categoryName.toLowerCase()} fees in ${cityName}?`,
        answer: `${categoryName} fees in ${cityName} typically range from AED 300 to AED 2,000 depending on the visa type and complexity. Many consultants offer package deals including documentation support.`,
      },
    ],
    "visit-visa-specialists": [
      {
        question: `Which countries can I get visit visas for from ${cityName}?`,
        answer: `Visit visa specialists in ${cityName} can help you obtain tourist visas for USA, UK, Schengen countries, Canada, Australia, Japan, South Korea, and many other popular destinations.`,
      },
      {
        question: `What is the success rate for visit visas from ${cityName}?`,
        answer: `Success rates for visit visas from ${cityName} vary by destination but experienced specialists typically achieve 85-95% approval rates for properly documented applications with eligible applicants.`,
      },
      {
        question: `How much does a visit visa consultation cost in ${cityName}?`,
        answer: `Visit visa consultation fees in ${cityName} range from AED 200 to AED 1,500 depending on the destination country and services included. Many specialists offer comprehensive packages.`,
      },
      {
        question: `What documents do I need for a visit visa application in ${cityName}?`,
        answer: `Required documents typically include passport, photographs, bank statements, employment letter, travel insurance, hotel bookings, flight itinerary, and invitation letters if applicable.`,
      },
    ],
    "work-permit": [
      {
        question: `Which countries offer work permits through ${cityName} consultants?`,
        answer: `Work permit specialists in ${cityName} can assist with applications for Canada (Express Entry, Provincial Nominee Programs), Australia (Skilled Independent, Employer Nomination), New Zealand (Skilled Migrant Category), Germany (EU Blue Card), UAE (Employment Visa), USA (H1B, L1), UK (Skilled Worker Visa), and other countries with various skilled worker programs. Each country has specific requirements and quotas.`,
      },
      {
        question: `What is the process for obtaining a work permit through ${cityName}?`,
        answer: `The comprehensive process includes: 1) Initial consultation and eligibility assessment, 2) Skills assessment and qualification verification, 3) Language proficiency testing (IELTS/TOEFL), 4) Job search assistance and employer matching, 5) Employer nomination or sponsorship, 6) Application preparation and documentation, 7) Submission to immigration authorities, 8) Biometrics and medical examinations, 9) Visa approval and pre-departure briefing. Consultants in ${cityName} provide end-to-end support throughout this 6-18 month process.`,
      },
      {
        question: `How long does work permit processing take from ${cityName}?`,
        answer: `Processing times vary significantly by country and program: Canada Express Entry (6-8 months), Australia Skilled Independent (8-12 months), New Zealand Skilled Migrant (12-24 months), Germany EU Blue Card (2-3 months), UAE Employment Visa (1-2 months), USA H1B (3-8 months), UK Skilled Worker (3-8 weeks). Consultants in ${cityName} provide realistic timelines and regular updates throughout the process.`,
      },
      {
        question: `What are the eligibility requirements for work permits from ${cityName}?`,
        answer: `General eligibility criteria include: Education qualification assessment, minimum work experience (usually 1-3 years), language proficiency (IELTS 6.5+ or equivalent), clean criminal background check, medical examination clearance, proof of funds for settlement, and age requirements (typically 18-45 years). Specific requirements vary by country and skilled occupation categories.`,
      },
      {
        question: `How much do work permit consultants charge in ${cityName}?`,
        answer: `Work permit consultation fees in ${cityName} typically range from AED 8,000 to AED 25,000 depending on the destination country and complexity. This includes skills assessment, documentation, application filing, and follow-up services. Most consultants offer transparent pricing with no hidden costs and payment plans available.`,
      },
      {
        question: `What documents are required for work permit applications from ${cityName}?`,
        answer: `Essential documents include: Educational certificates and transcripts, work experience letters, updated resume/CV, passport copies, IELTS/TOEFL scores, medical examination reports, police clearance certificates, bank statements, photographs, marriage certificate (if applicable), and birth certificates for dependents. All documents must be attested and translated if required.`,
      },
      {
        question: `Can family members accompany me on a work permit from ${cityName}?`,
        answer: `Yes, most work permit programs allow accompanying family members including spouse and dependent children under 18-22 years. Family members can typically work and study in the destination country. Additional documentation and fees apply for dependents, and some countries have specific income requirements for family sponsorship.`,
      },
      {
        question: `What is the success rate for work permit applications from ${cityName}?`,
        answer: `Success rates vary by country and applicant profile: Canada Express Entry (70-85%), Australia Skilled Programs (65-80%), New Zealand (60-75%), Germany EU Blue Card (85-95%), UAE Employment Visa (90-95%). Experienced consultants in ${cityName} typically achieve higher success rates through proper case assessment and application preparation.`,
      },
    ],
    "work-visa-consultants": [
      {
        question: `What types of work visas can consultants in ${cityName} help with?`,
        answer: `Work visa consultants in ${cityName} specialize in various categories including: Skilled Worker Visas (Canada Express Entry, Australia SkillSelect), Employer-Sponsored Visas (H1B, L1, UK Tier 2), Temporary Work Permits (UAE Employment, Germany Job Seeker), Intra-Company Transfer Visas, Self-Employment/Investor Visas, and Working Holiday Visas for eligible countries. Each visa type has specific requirements and processing procedures.`,
      },
      {
        question: `How do work visa consultants in ${cityName} help with job placement?`,
        answer: `Leading consultants in ${cityName} offer comprehensive job placement services including: Resume optimization for international standards, LinkedIn profile enhancement, job search strategy development, direct employer connections through their network, interview preparation and coaching, salary negotiation guidance, and post-landing job search support. Some have partnerships with recruitment agencies in destination countries.`,
      },
      {
        question: `What is the difference between work permits and work visas?`,
        answer: `Work permits are typically temporary authorizations allowing foreign nationals to work in a country for a specific employer and duration (1-3 years, renewable). Work visas are broader immigration categories that may lead to permanent residency, often with more flexibility to change employers. Consultants in ${cityName} help you choose the right pathway based on your long-term goals and qualifications.`,
      },
      {
        question: `How much do work visa services cost in ${cityName}?`,
        answer: `Work visa consultation fees in ${cityName} vary by destination and service level: Basic consultation (AED 500-1,500), Complete application processing (AED 8,000-20,000), Premium services with job placement (AED 15,000-35,000). Government fees, medical exams, and document attestation are additional. Most consultants offer package deals and payment plans.`,
      },
      {
        question: `What are the most popular work visa destinations from ${cityName}?`,
        answer: `Top destinations include: Canada (Express Entry, Provincial Nominee Programs), Australia (Skilled Independent, Employer Nomination), New Zealand (Essential Skills, Skilled Migrant), Germany (EU Blue Card, Job Seeker Visa), UK (Skilled Worker Visa), USA (H1B, L1, O1), Singapore (Employment Pass), and European countries through various skilled worker programs. Choice depends on your profession, qualifications, and personal preferences.`,
      },
    ],
  };

  const generalFAQs = [
    {
      question: `Are consultation services in ${cityName} reliable?`,
      answer: `Yes, ${cityName} hosts numerous licensed and experienced immigration consultants with proven track records. The city is a major hub for visa services in the region. Always verify credentials including MARA/ICCRC certification for immigration matters, check online reviews on Google and specialized platforms, verify office addresses and contact details, ask for references from previous clients, and ensure transparency in fee structures. Reputable consultants will provide detailed service agreements and realistic timelines.`,
    },
    {
      question: `Do consultants in ${cityName} provide after-service support?`,
      answer: `Most reputable consultants in ${cityName} offer comprehensive after-service support including: Real-time application tracking and status updates, pre-departure orientation and guidance, airport assistance and pickup services, initial settlement support in destination countries, assistance with any visa-related issues or delays, document courier services, and ongoing consultation for visa renewals or family applications. Premium service providers often have partnerships with settlement agencies in destination countries.`,
    },
    {
      question: `Can I get a refund if my application is rejected?`,
      answer: `Refund policies vary significantly among consultants in ${cityName}. Ethical firms typically offer: Partial refunds (50-70%) if applications are rejected due to consultant error, full refunds if services are not provided as promised, no refunds for government rejection due to client ineligibility, money-back guarantees under specific conditions (rare), and transparent refund policies outlined in service agreements. Always clarify refund terms before engaging services and get policies in writing.`,
    },
    {
      question: `How do I verify the credentials of consultants in ${cityName}?`,
      answer: `To verify consultant credentials in ${cityName}: Check for proper licensing with relevant authorities (MARA for Australia, ICCRC for Canada), verify membership in professional associations, review educational qualifications and certifications, check business registration and trade license validity, read client testimonials and online reviews, visit their physical office to confirm legitimacy, ask for references from recent successful clients, and verify their track record with specific visa categories. Legitimate consultants will readily provide credential verification.`,
    },
    {
      question: `What should I avoid when choosing a consultant in ${cityName}?`,
      answer: `Red flags to avoid when selecting consultants in ${cityName}: Guarantees of 100% success (no one can guarantee visa approval), demands for full payment before starting work, lack of physical office or proper credentials, poor online reviews or no verifiable testimonials, unrealistic processing time promises, pressure tactics or limited-time offers, unwillingness to provide detailed service breakdowns, no written service agreement or unclear terms, and consultants operating without proper licensing. Take time to research and compare multiple options before deciding.`,
    },
    {
      question: `What are the typical consultation fees in ${cityName}?`,
      answer: `Consultation fees in ${cityName} vary by service type and complexity: Initial assessment consultations (AED 200-800), basic visa applications (AED 1,500-5,000), complex immigration cases (AED 8,000-25,000), study abroad packages (AED 3,000-12,000), and premium end-to-end services (AED 15,000-40,000). Government fees, medical exams, document attestation, and translation services are typically additional. Most consultants offer transparent pricing with detailed cost breakdowns.`,
    },
    {
      question: `How long does the consultation process take in ${cityName}?`,
      answer: `The consultation process timeline in ${cityName} varies by service: Initial assessment and eligibility review (1-2 days), document preparation and verification (1-2 weeks), application compilation and review (1-2 weeks), government processing (varies by country: 2 weeks to 12 months), and post-approval procedures (1-4 weeks). Experienced consultants provide detailed timelines and regular progress updates throughout the process.`,
    },
    {
      question: `What languages do consultants in ${cityName} speak?`,
      answer: `Consultants in ${cityName} typically offer services in multiple languages including: English (universal), Arabic (widely spoken), Hindi/Urdu (for Indian subcontinent clients), Filipino/Tagalog (for Philippines nationals), Farsi (for Iranian clients), French (for francophone countries), and other regional languages. Many consultancy firms employ multilingual staff to better serve the diverse expatriate population in the region.`,
    },
    {
      question: `Do consultants in ${cityName} help with document attestation?`,
      answer: `Yes, most full-service consultants in ${cityName} provide comprehensive document attestation services including: Educational certificate attestation from home country and UAE authorities, marriage certificate attestation, birth certificate attestation for children, police clearance certificate attestation, medical certificate attestation, commercial document attestation for business visas, apostille services for Hague Convention countries, and document translation by certified translators. This saves clients significant time and ensures proper authentication.`,
    },
    {
      question: `Can consultants in ${cityName} help with urgent visa applications?`,
      answer: `Many consultants in ${cityName} offer expedited services for urgent visa applications including: Express processing for visit visas (where available), emergency family reunion visas, urgent business visa applications, rush student visa processing before academic deadlines, and priority handling for medical emergency travel. Expedited services typically cost 25-50% more than standard processing and are subject to destination country policies. Not all visa types offer express processing options.`,
    },
  ];

  // Default FAQ template for categories not specifically covered
  const defaultCategoryFAQs = [
    {
      question: `How to choose the best ${categoryName.toLowerCase()} in ${cityName}?`,
      answer: `Choose licensed ${categoryName.toLowerCase()} in ${cityName} with proper credentials, positive reviews, transparent fee structure, and specialization in your specific needs. Verify their experience and success rates.`,
    },
    {
      question: `What services do ${categoryName.toLowerCase()} provide in ${cityName}?`,
      answer: `${categoryName} in ${cityName} offer comprehensive consultation services including initial assessment, documentation assistance, application processing, and ongoing support throughout your visa or immigration process.`,
    },
    {
      question: `How much do ${categoryName.toLowerCase()} charge in ${cityName}?`,
      answer: `${categoryName} fees in ${cityName} vary depending on service complexity and requirements. Most consultants offer transparent pricing with detailed cost breakdowns and flexible payment options.`,
    },
    {
      question: `What is the success rate of ${categoryName.toLowerCase()} in ${cityName}?`,
      answer: `Experienced ${categoryName.toLowerCase()} in ${cityName} typically achieve high success rates for eligible applications. Success depends on proper documentation, client eligibility, and adherence to requirements.`,
    },
    {
      question: `How long does the process take with ${categoryName.toLowerCase()} in ${cityName}?`,
      answer: `Processing times vary by service type and destination country. ${categoryName} in ${cityName} provide realistic timelines and regular updates throughout the process to keep clients informed.`,
    },
  ];

  const categoryFAQs = baseFAQs[categorySlug] || defaultCategoryFAQs;
  return [...categoryFAQs, ...generalFAQs].slice(0, 12); // Increased to 12 FAQs per page
};

export default function CityCategory() {
  const { city, category } = useParams<{ city: string; category: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection:", event.reason);
      if (event.reason?.message?.includes("Failed to fetch")) {
        console.log("Suppressing fetch error to prevent UI crash");
        event.preventDefault();
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
      );
    };
  }, []);

  // Detect if this is a UAE route (either by /uae/ prefix or UAE city names)
  const isUAERoute = location.pathname.startsWith("/uae/");
  const isUAECity =
    city &&
    [
      "dubai",
      "abu-dhabi",
      "sharjah",
      "ajman",
      "ras-al-khaimah",
      "fujairah",
      "umm-al-quwain",
    ].includes(city.toLowerCase());
  const country = isUAERoute || isUAECity ? "uae" : "india";

  const [categoryBusinesses, setCategoryBusinesses] = useState<Business[]>([]);
  const [cityBusinesses, setCityBusinesses] = useState<Business[]>([]);
  const [allDubaiBusinesses, setAllDubaiBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categoryDataLoaded, setCategoryDataLoaded] = useState(false);
  const [cityDataLoaded, setCityDataLoaded] = useState(false);
  const [allDubaiDataLoaded, setAllDubaiDataLoaded] = useState(false);
  const [isShowingNearbyData, setIsShowingNearbyData] = useState(false);
  const [totalAvailableBusinesses, setTotalAvailableBusinesses] = useState(0);
  const [apiFailureCount, setApiFailureCount] = useState(0);
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    city: string;
    state: string;
  } | null>(null);
  const [debugInfo, setDebugInfo] = useState({
    categoryBusinesses: 0,
    cityBusinesses: 0,
    totalBusinesses: 0,
    apiCalls: [] as Array<{
      url: string;
      status: string;
      count: number;
      timestamp: string;
    }>,
    metaData: { title: "", description: "", keywords: "" },
    searchParams: { city: "", category: "", cityName: "", categoryName: "" },
  });

  // Convert URL params to proper names
  const cityName = city
    ? city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, " ")
    : "";
  const categoryInfo = category ? getCategoryBySlug(category) : null;
  const categoryName = categoryInfo?.name || category || "";
  const categorySlug = category || "";

  useEffect(() => {
    if (!city || !category) {
      navigate("/business");
      return;
    }

    setLoading(true);
    setCurrentPage(1);
    setHasMoreData(true);

    // Reset all states
    setCategoryBusinesses([]);
    setCityBusinesses([]);
    setAllDubaiBusinesses([]);
    setFilteredBusinesses([]);
    setCategoryDataLoaded(false);
    setCityDataLoaded(false);
    setAllDubaiDataLoaded(false);

    // Detect user location for better nearby city suggestions (for Indian cities)
    if (country === "india") {
      // Make location detection completely optional and safe
      try {
        detectUserLocation()
          .then((location) => {
            if (location) {
              console.log("User location detected:", location);
              setUserLocation(location);
            }
          })
          .catch((error) => {
            console.log(
              "Could not detect user location (non-critical):",
              error,
            );
            // Silently continue without location - this is not critical for app functionality
          });
      } catch (syncError) {
        console.log(
          "Location detection setup failed (non-critical):",
          syncError,
        );
        // Continue without location detection
      }
    }

    // Validate city exists
    const cityExists = allCities.some(
      (c) => getCitySlug(c) === city.toLowerCase(),
    );

    if (!cityExists) {
      navigate("/business");
      return;
    }

    // Validate category exists
    if (!categoryInfo) {
      navigate(`/business/${city}`);
      return;
    }

    // Ultimate error-safe execution
    const executeAllOperations = () => {
      try {
        // Set a safety timeout to ensure loading states are updated
        const safetyTimeout = setTimeout(() => {
          console.log(
            "Safety timeout triggered, ensuring all loading states are set",
          );
          setCategoryDataLoaded(true);
          setCityDataLoaded(true);
          setAllDubaiDataLoaded(true);
          setLoading(false);
        }, 15000); // 15 second safety timeout

        // Execute each operation independently with maximum safety
        Promise.resolve().then(async () => {
          try {
            await fetchCategoryBusinesses();
          } catch (error) {
            console.error("Final catch for fetchCategoryBusinesses:", error);
          } finally {
            setCategoryDataLoaded(true);
            setLoading(false);
          }
        });

        Promise.resolve().then(async () => {
          try {
            await fetchCityBusinesses();
          } catch (error) {
            console.error("Final catch for fetchCityBusinesses:", error);
          } finally {
            setCityDataLoaded(true);
          }
        });

        if (country === "uae") {
          Promise.resolve().then(async () => {
            try {
              await fetchAllDubaiBusinesses();
            } catch (error) {
              console.error("Final catch for fetchAllDubaiBusinesses:", error);
            } finally {
              setAllDubaiDataLoaded(true);
            }
          });
        } else {
          setAllDubaiDataLoaded(true);
        }

        // Clear safety timeout if everything completes normally
        const checkCompletion = setInterval(() => {
          if (categoryDataLoaded && cityDataLoaded && allDubaiDataLoaded) {
            clearTimeout(safetyTimeout);
            clearInterval(checkCompletion);
          }
        }, 1000);
      } catch (setupError) {
        console.error("Setup error in executeAllOperations:", setupError);
        // Ensure all states are set even if setup fails
        setCategoryDataLoaded(true);
        setCityDataLoaded(true);
        setAllDubaiDataLoaded(true);
        setLoading(false);
      }
    };

    executeAllOperations();

    // Set page meta data with SEO optimization
    const metaData = generateCityCategoryMeta(cityName, categoryName);
    setPageMeta(metaData);

    // Set SEO links for better Google crawling
    setSEOLinks({
      canonical: `/business/${city}/${category}`,
      alternate: [
        `/business/${city}/${category}`,
        `/category/${category}`,
        `/business/${city}`,
      ],
    });

    // Set breadcrumb structured data
    setBreadcrumbStructuredData([
      { name: "Home", url: "/" },
      { name: "Browse", url: "/business" },
      { name: cityName, url: `/business/${city}` },
      { name: categoryName, url: `/business/${city}/${category}` },
    ]);

    // Set city service structured data
    if (categoryInfo) {
      setCityServiceStructuredData(
        cityName,
        categoryName,
        categoryInfo.description,
      );
    }

    async function fetchCategoryBusinesses() {
      try {
        console.log(
          `Fetching businesses for city: "${cityName}", category: "${categoryName}", categorySlug: "${categorySlug}"`,
        );

        // Check if API is available by testing a simple endpoint first
        // Skip API check if we've had too many failures
        let apiAvailable = false;
        if (apiFailureCount < 3) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const healthCheck = await robustFetch("/api/health", {
              method: "HEAD",
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            apiAvailable = healthCheck.ok;
          } catch (healthError) {
            console.log(
              "API health check failed, API not available:",
              healthError,
            );
            setApiFailureCount((prev) => prev + 1);
            apiAvailable = false;
          }
        } else {
          console.log(
            "Skipping API calls due to repeated failures, using sample data",
          );
          apiAvailable = false;
        }

        let result = null;
        let isNearbyData = false;
        let nearbyCity = "";

        if (apiAvailable) {
          // Step 1: Try exact city + category combination from database
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            let scrapedUrl = `/api/scraped-businesses?city=${encodeURIComponent(cityName)}&category=${encodeURIComponent(categoryName)}&limit=100`;
            let scrapedResponse = await robustFetch(scrapedUrl, {
              signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (scrapedResponse.ok) {
              result = await scrapedResponse.json();
              console.log("Primary database response:", result);
            } else {
              console.log(`API response not OK: ${scrapedResponse.status}`);
            }
          } catch (fetchError) {
            console.log("Failed to fetch from primary API:", fetchError);
            // Increment failure count and set apiAvailable to false for subsequent calls
            setApiFailureCount((prev) => prev + 1);
            apiAvailable = false;
          }
        }

        if (!apiAvailable) {
          console.log("API not available, using sample data fallback");
        }

        // Step 2: If no data found for specific area + category, try hierarchical fallback
        // For better results, accumulate data from multiple nearby cities
        if (
          apiAvailable &&
          (!result ||
            !result.success ||
            !result.businesses ||
            result.businesses.length < 50) // Try to get at least 50 results
        ) {
          console.log(
            `${result?.businesses?.length || 0} businesses found for ${cityName} + ${categoryName}, trying nearby cities for more results`,
          );

          const nearbyCities = getNearByCities(cityName, country, userLocation);
          let accumulatedBusinesses = result?.businesses || [];
          let nearbyDataSources: string[] = [];

          for (const nearbyCity_temp of nearbyCities) {
            // Skip if we already have enough results
            if (accumulatedBusinesses.length >= 80) break;

            try {
              console.log(
                `Trying nearby city: ${nearbyCity_temp} + ${categoryName} (current total: ${accumulatedBusinesses.length})`,
              );
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

              const nearbyUrl = `/api/scraped-businesses?city=${encodeURIComponent(nearbyCity_temp)}&category=${encodeURIComponent(categoryName)}&limit=150`;
              const nearbyResponse = await robustFetch(nearbyUrl, {
                signal: controller.signal,
              });
              clearTimeout(timeoutId);

              if (nearbyResponse.ok) {
                const nearbyResult = await nearbyResponse.json();
                if (
                  nearbyResult.success &&
                  nearbyResult.businesses &&
                  nearbyResult.businesses.length > 0
                ) {
                  console.log(
                    `Found ${nearbyResult.businesses.length} businesses in nearby city: ${nearbyCity_temp}`,
                  );

                  // Add nearby city businesses, avoiding duplicates
                  const newBusinesses = nearbyResult.businesses.filter(
                    (nearbyBusiness: any) =>
                      !accumulatedBusinesses.some(
                        (existing: any) =>
                          existing.name === nearbyBusiness.name &&
                          existing.address === nearbyBusiness.address,
                      ),
                  );

                  if (newBusinesses.length > 0) {
                    accumulatedBusinesses = [
                      ...accumulatedBusinesses,
                      ...newBusinesses,
                    ];
                    nearbyDataSources.push(nearbyCity_temp);
                    isNearbyData = true;

                    console.log(
                      `Added ${newBusinesses.length} new businesses from ${nearbyCity_temp}. Total: ${accumulatedBusinesses.length}`,
                    );
                  }
                }
              } else {
                console.log(
                  `Nearby API response not OK for ${nearbyCity_temp}: ${nearbyResponse.status}`,
                );
              }
            } catch (nearbyError) {
              console.log(
                `Failed to fetch data for nearby city ${nearbyCity_temp}:`,
                nearbyError,
              );
              // Continue to next nearby city instead of stopping
            }
          }

          // If we accumulated businesses from nearby cities, update the result
          if (accumulatedBusinesses.length > 0) {
            result = {
              success: true,
              businesses: accumulatedBusinesses,
              total: accumulatedBusinesses.length,
              source: nearbyDataSources.length > 0 ? "nearby_cities" : "local",
            };

            if (nearbyDataSources.length > 0) {
              nearbyCity = nearbyDataSources.join(", ");
              console.log(
                `Final result: ${accumulatedBusinesses.length} businesses from ${nearbyCity}`,
              );
            }
          }
        }

        // Step 3: If no data from API, fallback to sample data with nearby cities logic
        console.log("API result received:", result);
        console.log("Sample businesses available:", sampleBusinesses.length);
        console.log(
          "Searching for city:",
          cityName,
          "category:",
          categoryName,
          "slug:",
          categorySlug,
        );

        // Always try to get ALL businesses from main city first, then add nearby cities
        console.log(
          "Getting all businesses from main city ordered by category relevance, then adding nearby cities",
        );

        const nearbyCities = getNearByCities(cityName, country, userLocation);
        let accumulatedBusinesses = [];
        let sourceCities = [];

        // PHASE 0: Get ALL businesses from main city and order by category relevance
        console.log(`=== PHASE 0: Getting ALL businesses from ${cityName} ===`);

        // Try multiple API endpoints to get city businesses
        const apiEndpoints = [
          `/api/scraped-businesses?city=${encodeURIComponent(cityName)}&limit=1000&country=${encodeURIComponent(country)}`,
          `/api/scraped-businesses?city=${encodeURIComponent(cityName)}&limit=1000`,
          `/api/scraped-businesses?city=${encodeURIComponent(cityName)}`,
          `/api/businesses/city/${encodeURIComponent(cityName)}?limit=1000`,
          `/api/businesses?city=${encodeURIComponent(cityName)}&limit=1000`,
        ];

        let allCityResult = null;
        let successfulEndpoint = null;

        for (const endpoint of apiEndpoints) {
          try {
            console.log(`🔍 Trying endpoint: ${endpoint}`);

            const response = await Promise.race([
              robustFetch(endpoint, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }),
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout')), 5000)
              )
            ]);

            console.log(`Response status: ${response.status} ${response.statusText}`);

            if (response.ok) {
              const result = await response.json();
              console.log(`Response data:`, result);

              if (result && result.businesses && result.businesses.length > 0) {
                allCityResult = result;
                successfulEndpoint = endpoint;
                console.log(`✅ SUCCESS with endpoint: ${endpoint} - Found ${result.businesses.length} businesses`);
                break;
              } else if (result && result.success === false) {
                console.log(`❌ API returned success=false for ${endpoint}`);
              } else {
                console.log(`❌ No businesses in response from ${endpoint}`);
              }
            } else {
              console.log(`❌ HTTP error ${response.status} for ${endpoint}`);
            }
          } catch (error) {
            console.log(`❌ Error with endpoint ${endpoint}:`, error.message);
          }
        }

        if (allCityResult && allCityResult.businesses && allCityResult.businesses.length > 0) {
          console.log(`✅ Successfully fetched ${allCityResult.businesses.length} businesses from ${cityName} using: ${successfulEndpoint}`);

          // Sort businesses by category relevance
          const categoryKeywords = categoryName.toLowerCase().split(/[\s-]+/);
          console.log(`Sorting by relevance to keywords: ${categoryKeywords.join(', ')}`);

          const sortedBusinesses = allCityResult.businesses.sort((a, b) => {
            const aCategory = (a.category || '').toLowerCase();
            const aName = (a.name || '').toLowerCase();
            const aDesc = (a.description || '').toLowerCase();

            const bCategory = (b.category || '').toLowerCase();
            const bName = (b.name || '').toLowerCase();
            const bDesc = (b.description || '').toLowerCase();

            // Calculate relevance score
            const aScore = categoryKeywords.reduce((score, keyword) => {
              if (aCategory.includes(keyword)) score += 10;
              if (aName.includes(keyword)) score += 5;
              if (aDesc.includes(keyword)) score += 2;
              return score;
            }, 0);

            const bScore = categoryKeywords.reduce((score, keyword) => {
              if (bCategory.includes(keyword)) score += 10;
              if (bName.includes(keyword)) score += 5;
              if (bDesc.includes(keyword)) score += 2;
              return score;
            }, 0);

            return bScore - aScore; // Higher score first
          });

          console.log(`✅ Ordered ${sortedBusinesses.length} businesses by relevance to "${categoryName}"`);

          accumulatedBusinesses = sortedBusinesses.map(business => ({
            ...business,
            isNearbyData: false, // These are from main city
            originalRequestedCity: cityName,
          }));

          console.log(`✅ Added ${accumulatedBusinesses.length} businesses from main city ${cityName}`);
        } else {
          console.log(`❌ No businesses found in main city ${cityName} from any API endpoint`);
          console.log(`Tried ${apiEndpoints.length} different endpoints`);
        }

        // Continue with nearby cities only if we have less than 30 businesses OR no businesses at all
        if (accumulatedBusinesses.length < 30) {
          console.log(
            `Only ${accumulatedBusinesses.length} businesses from main city, adding from nearby cities`,
          );

          console.log(
            `Trying nearby cities for ${cityName}: ${nearbyCities.join(", ")}`,
          );

          // PHASE 1: Fast parallel search for category matches from nearby cities
          console.log(
            "=== PHASE 1: Fast parallel search from nearby cities ===",
          );
          console.log(
            `Nearby cities priority order: ${nearbyCities.join(" -> ")}`,
          );

          // Parallel API calls for faster loading - limit to top 4 cities for speed
          const topCities = nearbyCities.slice(0, 4);
          const apiPromises = topCities.map(async (nearbyCity) => {
            try {
              // Quick search with exact category name first
              const nearbyApiUrl = `/api/scraped-businesses?city=${encodeURIComponent(nearbyCity)}&category=${encodeURIComponent(categoryName)}&limit=20&country=${encodeURIComponent(country)}`;

              console.log(`🔍 Parallel search: ${nearbyCity} for ${categoryName}`);

              const nearbyResponse = await Promise.race([
                robustFetch(nearbyApiUrl, {
                  method: "GET",
                  headers: { "Content-Type": "application/json" },
                }),
                new Promise((_, reject) =>
                  setTimeout(() => reject(new Error('Timeout')), 3000) // 3 second timeout per city
                )
              ]);

              const nearbyResult = await nearbyResponse.json();

              if (
                nearbyResult &&
                nearbyResult.success &&
                nearbyResult.businesses &&
                nearbyResult.businesses.length > 0
              ) {
                console.log(
                  `✅ Found ${nearbyResult.businesses.length} businesses in ${nearbyCity}`,
                );

                return {
                  city: nearbyCity,
                  businesses: nearbyResult.businesses.map((business) => ({
                    ...business,
                    isNearbyData: true,
                    originalRequestedCity: cityName,
                    nearbySourceCity: nearbyCity,
                  })),
                };
              } else {
                console.log(`❌ No businesses in ${nearbyCity}`);
                return { city: nearbyCity, businesses: [] };
              }
            } catch (error) {
              console.log(`❌ Error/timeout for ${nearbyCity}`);
              return { city: nearbyCity, businesses: [] };
            }
          });

          // Wait for all parallel searches (max 3 seconds each)
          const cityResults = await Promise.allSettled(apiPromises);

          cityResults.forEach((result, index) => {
            if (result.status === 'fulfilled' && result.value.businesses.length > 0) {
              const { city, businesses } = result.value;

              // Add unique businesses only
              businesses.forEach(business => {
                const businessId = business.id || business.googlePlaceId || `${business.name}-${business.address}`;
                const isDuplicate = accumulatedBusinesses.some(existing => {
                  const existingId = existing.id || existing.googlePlaceId || `${existing.name}-${existing.address}`;
                  return existingId === businessId ||
                         (existing.name?.toLowerCase().trim() === business.name?.toLowerCase().trim() &&
                          existing.city?.toLowerCase().trim() === business.city?.toLowerCase().trim());
                });

                if (!isDuplicate) {
                  accumulatedBusinesses.push(business);
                }
              });

              sourceCities.push(city);
              console.log(`✅ Added ${businesses.length} businesses from ${city}`);
            }
          });

          console.log(
            `Phase 1 completed: ${accumulatedBusinesses.length} businesses from ${sourceCities.length} cities`,
          );

          // PHASE 2: Quick broader search if still not enough results
          if (accumulatedBusinesses.length < 15) {
            console.log(
              "\n=== PHASE 2: Quick broader search from remaining cities ===",
            );

            // Only try 2 more cities for speed - parallel search
            const remainingCities = nearbyCities.slice(4, 6);

            const phase2Promises = remainingCities.map(async (nearbyCity) => {
              try {
                const cityApiUrl = `/api/scraped-businesses?city=${encodeURIComponent(nearbyCity)}&limit=20&country=${encodeURIComponent(country)}`;

                const cityResponse = await Promise.race([
                  robustFetch(cityApiUrl, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                  }),
                  new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), 2000) // 2 second timeout
                  )
                ]);

                const cityResult = await cityResponse.json();

                if (
                  cityResult &&
                  cityResult.success &&
                  cityResult.businesses &&
                  cityResult.businesses.length > 0
                ) {
                  // Quick filter for relevant businesses
                  const relevantBusinesses = cityResult.businesses.filter(
                    (business) => {
                      const text = `${business.name} ${business.category} ${business.description}`.toLowerCase();
                      return text.includes("visa") || text.includes("immigration") || text.includes("consultant");
                    },
                  ).slice(0, 10); // Limit to 10 per city for speed

                  return {
                    city: nearbyCity,
                    businesses: relevantBusinesses.map((business) => ({
                      ...business,
                      isNearbyData: true,
                      originalRequestedCity: cityName,
                      nearbySourceCity: nearbyCity,
                    })),
                  };
                }
                return { city: nearbyCity, businesses: [] };
              } catch (error) {
                return { city: nearbyCity, businesses: [] };
              }
            });

            const phase2Results = await Promise.allSettled(phase2Promises);

            phase2Results.forEach((result) => {
              if (result.status === 'fulfilled' && result.value.businesses.length > 0) {
                const { city, businesses } = result.value;

                businesses.forEach(business => {
                  const businessId = business.id || `${business.name}-${business.address}`;
                  const isDuplicate = accumulatedBusinesses.some(existing => {
                    const existingId = existing.id || `${existing.name}-${existing.address}`;
                    return existingId === businessId;
                  });

                  if (!isDuplicate) {
                    accumulatedBusinesses.push(business);
                  }
                });

                if (!sourceCities.includes(city)) {
                  sourceCities.push(city);
                }
                console.log(`✅ Phase 2: Added businesses from ${city}`);
              }
            });

            console.log(`Phase 2 completed: ${accumulatedBusinesses.length} total businesses`);
          }

          // Remove duplicates with comprehensive deduplication to prevent any duplicate listings
          const uniqueBusinesses = [];
          const seenIds = new Set();
          const seenNames = new Set();
          const seenAddresses = new Set();

          accumulatedBusinesses.forEach((business, index) => {
            const businessId = business.id || business.googlePlaceId || `${business.name}-${business.address}`;
            const businessKey = `${business.name?.toLowerCase().trim()}-${business.city?.toLowerCase().trim()}`;
            const addressKey = `${business.name?.toLowerCase().trim()}-${business.address?.toLowerCase().trim()}`;

            // Multiple layers of duplicate detection
            const isDuplicate = seenIds.has(businessId) ||
                               seenNames.has(businessKey) ||
                               seenAddresses.has(addressKey);

            if (!isDuplicate) {
              // Additional check for very similar names (fuzzy matching)
              const hasSimilar = uniqueBusinesses.some(existing => {
                const similarity = existing.name?.toLowerCase().trim() === business.name?.toLowerCase().trim() &&
                                  existing.city?.toLowerCase().trim() === business.city?.toLowerCase().trim();
                return similarity;
              });

              if (!hasSimilar) {
                seenIds.add(businessId);
                seenNames.add(businessKey);
                seenAddresses.add(addressKey);
                uniqueBusinesses.push(business);
                console.log(`✅ Added unique business: ${business.name} from ${business.nearbySourceCity || business.city}`);
              } else {
                console.log(`❌ Skipped similar business: ${business.name} from ${business.nearbySourceCity || business.city}`);
              }
            } else {
              console.log(`❌ Skipped duplicate business: ${business.name} from ${business.nearbySourceCity || business.city}`);
            }
          });

          console.log(
            `Total accumulated: ${accumulatedBusinesses.length}, After deduplication: ${uniqueBusinesses.length} from cities: ${sourceCities.join(", ")}`,
          );

          // PHASE 3: Emergency fallback if no results found
          if (uniqueBusinesses.length === 0) {
            console.log("\n=== PHASE 3: Emergency fallback with broader categories ===");

            const emergencyCategories = ["Immigration Consultants", "Visa Consultants", "Canada Immigration", "Immigration Services"];
            const emergencyCities = nearbyCities.slice(0, 3);

            for (const emergencyCity of emergencyCities) {
              for (const emergencyCategory of emergencyCategories) {
                try {
                  const emergencyUrl = `/api/scraped-businesses?city=${encodeURIComponent(emergencyCity)}&category=${encodeURIComponent(emergencyCategory)}&limit=8&country=${encodeURIComponent(country)}`;

                  const emergencyResponse = await Promise.race([
                    robustFetch(emergencyUrl, {
                      method: "GET",
                      headers: { "Content-Type": "application/json" },
                    }),
                    new Promise((_, reject) =>
                      setTimeout(() => reject(new Error('Timeout')), 1500)
                    )
                  ]);

                  const emergencyResult = await emergencyResponse.json();

                  if (emergencyResult && emergencyResult.success && emergencyResult.businesses && emergencyResult.businesses.length > 0) {
                    console.log(`🆘 Emergency: Found ${emergencyResult.businesses.length} in ${emergencyCity} for ${emergencyCategory}`);

                    emergencyResult.businesses.forEach(business => {
                      const businessId = business.id || `${business.name}-${business.address}`;
                      const isDuplicate = accumulatedBusinesses.some(existing => {
                        const existingId = existing.id || `${existing.name}-${existing.address}`;
                        return existingId === businessId;
                      });

                      if (!isDuplicate) {
                        accumulatedBusinesses.push({
                          ...business,
                          isNearbyData: true,
                          originalRequestedCity: cityName,
                          nearbySourceCity: emergencyCity,
                        });
                      }
                    });

                    if (!sourceCities.includes(emergencyCity)) {
                      sourceCities.push(emergencyCity);
                    }

                    if (accumulatedBusinesses.length >= 10) break;
                  }
                } catch (error) {
                  // Silent fail for emergency search
                }
              }
              if (accumulatedBusinesses.length >= 10) break;
            }

            // Re-deduplicate after emergency search
            const finalUniqueBusinesses = [];
            const finalSeenIds = new Set();

            accumulatedBusinesses.forEach((business) => {
              const businessId = business.id || business.googlePlaceId || `${business.name}-${business.address}`;
              if (!finalSeenIds.has(businessId)) {
                finalSeenIds.add(businessId);
                finalUniqueBusinesses.push(business);
              }
            });

            console.log(`Emergency completed: ${finalUniqueBusinesses.length} businesses total`);

            if (finalUniqueBusinesses.length > 0) {
              result = {
                success: true,
                businesses: finalUniqueBusinesses,
                total: finalUniqueBusinesses.length,
                source: "emergency_fallback",
              };
              isNearbyData = true;
              nearbyCity = sourceCities.join(", ");
            }
          } else if (accumulatedBusinesses.length > 0) {
            // We have businesses from main city and/or nearby cities
            // Final deduplication of all accumulated businesses
            const finalBusinesses = [];
            const finalSeenIds = new Set();

            accumulatedBusinesses.forEach((business) => {
              const businessId = business.id || business.googlePlaceId || `${business.name}-${business.address}`;
              if (!finalSeenIds.has(businessId)) {
                finalSeenIds.add(businessId);
                finalBusinesses.push(business);
              }
            });

            result = {
              success: true,
              businesses: finalBusinesses,
              total: finalBusinesses.length,
              source: finalBusinesses.some(b => !b.isNearbyData) ? "main_city_plus_nearby" : "nearby_cities_only",
            };

            if (sourceCities.length > 0) {
              isNearbyData = true;
              nearbyCity = sourceCities.join(", ");
            }

            console.log(`✅ Final result: ${finalBusinesses.length} businesses total`);
          }
        }

        // Step 4: Process result if we have data (from API or sample data)
        if (
          result &&
          result.success &&
          result.businesses &&
          result.businesses.length > 0
        ) {
          let businesses = result.businesses;

          // Add nearby data flag if this is from a nearby city
          if (isNearbyData) {
            businesses = businesses.map((business) => ({
              ...business,
              isNearbyData: true,
              originalRequestedCity: cityName,
              nearbyCity: nearbyCity,
            }));
            setIsShowingNearbyData(true);
          } else {
            setIsShowingNearbyData(false);
          }

          setCategoryBusinesses(businesses);
          setCategoryDataLoaded(true);

          // Update total available businesses count
          setTotalAvailableBusinesses(result.total || businesses.length);

          // Update debug info
          const scrapedTimestamp = new Date().toLocaleTimeString();
          const apiUrl = `/api/scraped-businesses?city=${encodeURIComponent(cityName)}&category=${encodeURIComponent(categoryName)}`;
          setDebugInfo((prev) => ({
            ...prev,
            apiCalls: [
              ...prev.apiCalls,
              {
                url: apiUrl,
                status:
                  result.source === "sample_data"
                    ? "sample_fallback"
                    : "success",
                count: businesses.length,
                timestamp: scrapedTimestamp,
              },
            ],
            categoryBusinesses: businesses.length,
          }));

          return;
        }

        // No category-specific data found anywhere
        console.log("No businesses found for category in any nearby cities");
        setCategoryBusinesses([]);
        setIsShowingNearbyData(false);
        setCategoryDataLoaded(true);
      } catch (error) {
        console.error("Error fetching category businesses:", error);

        // Emergency fallback to sample data
        try {
          console.log(
            "Emergency fallback: using sample data for category businesses",
          );

          let sampleBusinesses_filtered = sampleBusinesses.filter(
            (business) =>
              business.city.toLowerCase() === cityName.toLowerCase() &&
              business.category
                .toLowerCase()
                .includes(categoryName.toLowerCase()),
          );

          // If no exact match, try nearby cities with accumulation
          if (sampleBusinesses_filtered.length === 0) {
            // Use nearbyCities already declared above

            // Accumulate businesses from all nearby cities to get better coverage
            for (const nearbyCity_temp of nearbyCities) {
              const nearbyBusinesses = sampleBusinesses.filter(
                (business) =>
                  business.city.toLowerCase() ===
                    nearbyCity_temp.toLowerCase() &&
                  business.category
                    .toLowerCase()
                    .includes(categoryName.toLowerCase()),
              );

              if (nearbyBusinesses.length > 0) {
                sampleBusinesses_filtered = [
                  ...sampleBusinesses_filtered,
                  ...nearbyBusinesses,
                ];
                console.log(
                  `Emergency fallback: Added ${nearbyBusinesses.length} sample businesses from nearby city: ${nearbyCity_temp}`,
                );
              }
            }

            // If still no businesses found, try with looser category matching
            if (sampleBusinesses_filtered.length === 0) {
              console.log(
                "No businesses found with strict category matching, trying looser matching...",
              );

              const educationCategories = [
                "Education",
                "Student",
                "Study",
                "Visa",
                "Immigration",
              ];
              const isEducationCategory = educationCategories.some((cat) =>
                categoryName.toLowerCase().includes(cat.toLowerCase()),
              );

              if (isEducationCategory) {
                for (const nearbyCity_temp of nearbyCities) {
                  const nearbyBusinesses = sampleBusinesses.filter(
                    (business) =>
                      business.city.toLowerCase() ===
                        nearbyCity_temp.toLowerCase() &&
                      educationCategories.some((cat) =>
                        business.category
                          .toLowerCase()
                          .includes(cat.toLowerCase()),
                      ),
                  );

                  if (nearbyBusinesses.length > 0) {
                    sampleBusinesses_filtered = [
                      ...sampleBusinesses_filtered,
                      ...nearbyBusinesses,
                    ];
                    console.log(
                      `Emergency fallback (loose): Added ${nearbyBusinesses.length} education-related businesses from: ${nearbyCity_temp}`,
                    );
                    break; // Take first match to avoid too many results
                  }
                }
              }
            }

            if (sampleBusinesses_filtered.length > 0) {
              setIsShowingNearbyData(true);
            }
          } else {
            setIsShowingNearbyData(false);
          }

          if (sampleBusinesses_filtered.length > 0) {
            setCategoryBusinesses(sampleBusinesses_filtered);
          }
        } catch (fallbackError) {
          console.error("Even sample data fallback failed:", fallbackError);
        }

        setCategoryDataLoaded(true);
      }
    }

    async function fetchCityBusinesses() {
      try {
        // Fetch all businesses for the city with higher limit
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const apiUrl = `/api/scraped-businesses?city=${encodeURIComponent(cityName)}&limit=1000`;
        const response = await robustFetch(apiUrl, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        // Log API call for debugging
        const timestamp = new Date().toLocaleTimeString();

        if (response.ok) {
          const result = await response.json();

          // Update debug info
          setDebugInfo((prev) => ({
            ...prev,
            apiCalls: [
              ...prev.apiCalls,
              {
                url: apiUrl,
                status: "success",
                count: result.businesses?.length || 0,
                timestamp,
              },
            ],
          }));

          if (result.success && result.businesses) {
            setCityBusinesses(result.businesses);
          }
        } else {
          // Update debug info for failed call
          setDebugInfo((prev) => ({
            ...prev,
            apiCalls: [
              ...prev.apiCalls,
              {
                url: apiUrl,
                status: "failed",
                count: 0,
                timestamp,
              },
            ],
          }));
        }

        // Also include sample businesses for the city as fallback
        const sampleCityBusinesses = sampleBusinesses.filter(
          (business) => business.city.toLowerCase() === city.toLowerCase(),
        );

        setCityBusinesses((prev) => {
          const combined = [...prev, ...sampleCityBusinesses];
          // Remove duplicates by name and address
          const unique = combined.filter(
            (business, index, arr) =>
              index ===
              arr.findIndex(
                (b) =>
                  b.name === business.name && b.address === business.address,
              ),
          );
          return unique;
        });

        setCityDataLoaded(true);
      } catch (error) {
        console.error("Error fetching city businesses:", error);
        // Use sample businesses as fallback
        const sampleCityBusinesses = sampleBusinesses.filter(
          (business) => business.city.toLowerCase() === city.toLowerCase(),
        );
        setCityBusinesses(sampleCityBusinesses);
        setCityDataLoaded(true);
      }
    }

    async function fetchAllDubaiBusinesses() {
      try {
        console.log("Fetching all Dubai businesses for comprehensive listing");

        // Check if API is available
        let apiAvailable = false;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

          const healthCheck = await robustFetch("/api/health", {
            method: "HEAD",
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          apiAvailable = healthCheck.ok;
        } catch (healthError) {
          console.log(
            "API health check failed for Dubai businesses:",
            healthError,
          );
          apiAvailable = false;
        }

        if (apiAvailable) {
          try {
            // Fetch all Dubai businesses with a high limit to get comprehensive data
            const controller2 = new AbortController();
            const timeoutId2 = setTimeout(() => controller2.abort(), 15000); // 15 second timeout for large dataset

            const allDubaiUrl = `/api/scraped-businesses?city=Dubai&limit=500&page=1`;
            const response = await robustFetch(allDubaiUrl, {
              signal: controller2.signal,
            });
            clearTimeout(timeoutId2);

            if (response.ok) {
              const result = await response.json();
              console.log(
                `Found ${result.businesses?.length || 0} total Dubai businesses`,
              );

              if (result.success && result.businesses) {
                setAllDubaiBusinesses(result.businesses);
                setTotalAvailableBusinesses(
                  result.total || result.businesses.length,
                );
              }
            } else {
              console.log(`All Dubai API response not OK: ${response.status}`);
            }
          } catch (fetchError) {
            console.log("Failed to fetch all Dubai businesses:", fetchError);
          }
        }

        setAllDubaiDataLoaded(true);
      } catch (error) {
        console.error("Error fetching all Dubai businesses:", error);
        setAllDubaiDataLoaded(true);
      }
    }
  }, [city, category, cityName, categoryName, navigate]);

  // Update filtered businesses when data loads
  useEffect(() => {
    if (
      categoryDataLoaded &&
      cityDataLoaded &&
      (country !== "uae" || allDubaiDataLoaded)
    ) {
      // Step 1: Start with category-specific businesses (highest priority)
      let combinedBusinesses = [...categoryBusinesses];

      // Step 2: Add city businesses that aren't already included
      const cityBusinessesToAdd = cityBusinesses.filter(
        (cityBusiness) =>
          !combinedBusinesses.some(
            (existing) =>
              existing.name === cityBusiness.name &&
              existing.address === cityBusiness.address,
          ),
      );
      combinedBusinesses = [...combinedBusinesses, ...cityBusinessesToAdd];

      // Step 3: For UAE, add all Dubai businesses to ensure comprehensive listing
      if (country === "uae" && allDubaiBusinesses.length > 0) {
        const dubaiBusinessesToAdd = allDubaiBusinesses.filter(
          (dubaiBusiness) =>
            !combinedBusinesses.some(
              (existing) =>
                existing.name === dubaiBusiness.name &&
                existing.address === dubaiBusiness.address,
            ),
        );
        combinedBusinesses = [...combinedBusinesses, ...dubaiBusinessesToAdd];
      }

      // Remove duplicates by name and address
      const uniqueBusinesses = combinedBusinesses.filter(
        (business, index, arr) =>
          index ===
          arr.findIndex(
            (b) => b.name === business.name && b.address === business.address,
          ),
      );

      // Apply search filtering first if there's a search query
      let searchFilteredBusinesses = uniqueBusinesses;
      if (searchQuery) {
        searchFilteredBusinesses = uniqueBusinesses.filter((business) => {
          return (
            business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.description
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            business.category
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            business.scrapedCategory
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            business.services?.some((service) =>
              service.toLowerCase().includes(searchQuery.toLowerCase()),
            )
          );
        });
      }

      // Apply pagination - show first 25 results initially
      const itemsPerPage = 25;
      const paginatedBusinesses = searchFilteredBusinesses.slice(
        0,
        itemsPerPage * currentPage,
      );

      setFilteredBusinesses(paginatedBusinesses);
      setHasMoreData(
        searchFilteredBusinesses.length > paginatedBusinesses.length,
      );
      setLoading(false);

      // Update debug info
      const metaData = generateCityCategoryMeta(cityName, categoryName);
      setDebugInfo((prev) => ({
        ...prev,
        categoryBusinesses: categoryBusinesses.length,
        cityBusinesses: cityBusinesses.length,
        totalBusinesses: uniqueBusinesses.length,
        metaData: {
          title: metaData.title,
          description: metaData.description,
          keywords: metaData.keywords,
        },
        searchParams: {
          city: city || "",
          category: category || "",
          cityName,
          categoryName,
        },
      }));
    }
  }, [
    categoryBusinesses,
    cityBusinesses,
    allDubaiBusinesses,
    categoryDataLoaded,
    cityDataLoaded,
    allDubaiDataLoaded,
    currentPage,
    searchQuery,
    city,
    category,
    cityName,
    categoryName,
    country,
  ]);

  // Load more function for pagination
  const loadMore = () => {
    if (!hasMoreData || loadingMore) return;

    setLoadingMore(true);
    setCurrentPage((prev) => prev + 1);

    // Simulate loading delay for better UX
    setTimeout(() => {
      setLoadingMore(false);
    }, 500);
  };

  const getCategoryIcon = (categorySlug: string) => {
    switch (categorySlug) {
      case "study-abroad":
      case "education-services":
        return <GraduationCap className="w-5 h-5" />;
      case "work-permit":
        return <Briefcase className="w-5 h-5" />;
      default:
        return <Building className="w-5 h-5" />;
    }
  };

  const getCategoryDescription = (categorySlug: string) => {
    const citySpecificDescriptions = {
      "study-abroad": {
        dubai:
          "Discover top-rated study abroad consultants in Dubai helping students secure admissions to world-class universities. Get expert guidance for US, UK, Canada, Australia & European education systems.",
        "abu dhabi":
          "Find experienced study abroad advisors in Abu Dhabi specializing in international university placements. Expert assistance for IELTS, TOEFL preparation and scholarship applications.",
        sharjah:
          "Connect with certified education consultants in Sharjah offering personalized study abroad services. Comprehensive support for visa processing and university applications.",
        default:
          "Find trusted study abroad consultants for international education guidance with proven success rates",
      },
      "immigration-consultants": {
        dubai:
          "Get professional immigration assistance in Dubai from licensed lawyers and certified consultants. Expert help with permanent residency, family reunification, and citizenship applications.",
        "abu dhabi":
          "Access experienced immigration lawyers in Abu Dhabi providing comprehensive legal services for visa applications, PR processes, and immigration appeals.",
        sharjah:
          "Find reliable immigration consultants in Sharjah offering affordable and efficient services for all types of immigration matters.",
        default:
          "Expert immigration lawyers and consultants for legal assistance and permanent residency applications",
      },
      "visa-consultants": {
        dubai:
          "Professional visa consultants in Dubai with high success rates for tourist, business, work, and family visas. Fast-track processing and documentation support available.",
        "abu dhabi":
          "Trusted visa service providers in Abu Dhabi offering comprehensive assistance for all visa categories with transparent pricing and quick turnaround times.",
        sharjah:
          "Experienced visa consultants in Sharjah specializing in visit visa, work permit, and family visa applications with excellent customer support.",
        default:
          "Professional visa consultants for all types of visa applications with guaranteed processing",
      },
      "work-permit": {
        dubai:
          "Specialized work permit consultants in Dubai helping professionals secure employment visas for UAE, Canada, Australia, and European countries with end-to-end support.",
        "abu dhabi":
          "Expert work permit advisors in Abu Dhabi providing comprehensive assistance for employment visa applications and job placement services.",
        default:
          "Specialized consultants for work permits and employment visas with industry expertise",
      },
      "visit-visa-specialists": {
        dubai:
          "Leading visit visa specialists in Dubai offering fast and reliable tourist visa services for popular destinations including US, UK, Schengen, and Asian countries.",
        "abu dhabi":
          "Professional visit visa consultants in Abu Dhabi providing hassle-free tourist visa processing with high approval rates and competitive pricing.",
        default:
          "Expert visit visa specialists for tourist and business visa applications worldwide",
      },
    };

    const descriptions = citySpecificDescriptions[categorySlug];
    if (descriptions) {
      const cityKey = cityName.toLowerCase().replace(/\s+/g, " ");
      return (
        descriptions[cityKey] ||
        descriptions.default ||
        descriptions[Object.keys(descriptions)[0]]
      );
    }

    // Fallback descriptions
    switch (categorySlug) {
      case "immigration-services":
        return `Complete immigration services in ${cityName} including PR, citizenship, and family sponsorship with experienced consultants`;
      case "overseas-services":
        return `Embassy services and overseas documentation assistance in ${cityName} for seamless international processes`;
      case "education-services":
        return `Educational consultancy and admission guidance services in ${cityName} for local and international institutions`;
      default:
        return `Find trusted and verified consultants in ${cityName} for your specific needs with transparent pricing`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-center py-20">
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <h3 className="mt-6 text-xl font-semibold text-gray-800">
                  Finding {categoryName}
                </h3>
                <p className="mt-2 text-gray-600">
                  Searching {cityName} and nearby cities...
                </p>
                <div className="mt-6 bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-800 font-medium flex items-center justify-center gap-2">
                    ⚡ Fast Parallel Search
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    Checking multiple locations simultaneously for faster results
                  </div>
                </div>
                <div className="mt-4 flex justify-center space-x-1">
                  <div className="animate-pulse bg-blue-300 rounded-full h-2 w-2"></div>
                  <div className="animate-pulse bg-blue-300 rounded-full h-2 w-2" style={{animationDelay: '0.2s'}}></div>
                  <div className="animate-pulse bg-blue-300 rounded-full h-2 w-2" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header Section */}
      <section className="pt-20 pb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <div className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-blue-100 hover:text-white">
                Home
              </Link>
              <span>/</span>
              <Link to="/business" className="text-blue-100 hover:text-white">
                Browse
              </Link>
              <span>/</span>
              <Link
                to={`/business/${city}`}
                className="text-blue-100 hover:text-white"
              >
                {cityName}
              </Link>
              <span>/</span>
              <span className="text-white font-medium">
                {category?.replace("-", " ")}
              </span>
            </div>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/business/${city}`)}
              className="text-blue-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {cityName}
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-lg">
              {getCategoryIcon(categorySlug)}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {categoryName} in {cityName}
              </h1>

              {/* Show notification for Abu Dhabi showing only local results */}
              {!isShowingNearbyData &&
                categoryBusinesses.length > 0 &&
                (cityName.toLowerCase() === "abu dhabi" ||
                  cityName.toLowerCase() === "abu-dhabi") && (
                  <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-3 max-w-2xl">
                    <div className="flex items-center gap-2 text-green-800 text-sm">
                      <Building className="h-4 w-4" />
                      <span className="font-medium">
                        Showing {categoryBusinesses.length}{" "}
                        {categoryName.toLowerCase()} specifically from Abu Dhabi
                        only
                      </span>
                    </div>
                  </div>
                )}

              {/* Show notification for multiple nearby cities results */}
              {isShowingNearbyData && categoryBusinesses.length >= 30 && (
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-3 max-w-3xl">
                  <div className="flex items-center gap-2 text-blue-800 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">
                      Comprehensive Search: Found {categoryBusinesses.length}{" "}
                      {categoryName.toLowerCase()} from {cityName} and nearby
                      Maharashtra cities for better choice and comparison.
                    </span>
                  </div>
                </div>
              )}

              <p className="text-blue-100 text-lg">
                {getCategoryDescription(categorySlug)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-blue-100">{categoryName}</p>
                    <p className="text-xl font-bold">
                      {categoryBusinesses.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-blue-100">
                      {country === "uae" ? "All Dubai" : `All ${cityName}`}{" "}
                      Businesses
                    </p>
                    <p className="text-xl font-bold">
                      {country === "uae" && allDubaiBusinesses.length > 0
                        ? allDubaiBusinesses.length
                        : cityBusinesses.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-blue-100">
                      {country === "uae" ? "Total Results" : "Average Rating"}
                    </p>
                    <p className="text-xl font-bold">
                      {country === "uae"
                        ? `${categoryBusinesses.length + (allDubaiBusinesses.length > 0 ? allDubaiBusinesses.length : cityBusinesses.length)}+`
                        : categoryBusinesses.length > 0
                          ? (
                              categoryBusinesses.reduce(
                                (sum, b) => sum + (b.rating || 0),
                                0,
                              ) / categoryBusinesses.length
                            ).toFixed(1)
                          : cityBusinesses.length > 0
                            ? (
                                cityBusinesses.reduce(
                                  (sum, b) => sum + (b.rating || 0),
                                  0,
                                ) / cityBusinesses.length
                              ).toFixed(1)
                            : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-6 bg-white border-b">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search consultants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="container mx-auto max-w-6xl px-4">
          {(categoryBusinesses.length === 0 && cityBusinesses.length === 0) ||
          (searchQuery && filteredBusinesses.length === 0) ? (
            <div className="text-center py-16">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchQuery
                  ? `No results found for "${searchQuery}"`
                  : apiFailureCount >= 3
                    ? `Service temporarily unavailable`
                    : `No businesses found`}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? `Try adjusting your search terms or browse all businesses in ${cityName}`
                  : apiFailureCount >= 3
                    ? `We're experiencing connectivity issues. Please try refreshing the page or check back in a few minutes.`
                    : `We're working on adding more ${categoryName.toLowerCase()} in ${cityName}. Check back soon or browse all businesses in the city.`}
              </p>
              <div className="flex gap-4 justify-center">
                {searchQuery && (
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => navigate(`/business/${city}`)}
                >
                  Browse All {cityName} Businesses
                </Button>
                <Button onClick={() => navigate("/add-business")}>
                  List Your Business
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {/* Comprehensive Business Listing */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {categoryName} in {cityName}
                        {filteredBusinesses.length > 0 &&
                          ` (${filteredBusinesses.length})`}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {categoryBusinesses.length > 0 &&
                        isShowingNearbyData &&
                        categoryBusinesses.length >= 30
                          ? `Comprehensive listing of ${categoryName.toLowerCase()} from ${cityName} and nearby Maharashtra cities`
                          : categoryBusinesses.length > 0
                            ? `Find trusted ${categoryName.toLowerCase()} in ${cityName}`
                            : `All available businesses in ${cityName}`}
                      </p>
                    </div>
                    <Badge variant="default" className="text-sm bg-blue-600">
                      {filteredBusinesses.length} results
                      {hasMoreData &&
                        ` (${debugInfo.totalBusinesses - filteredBusinesses.length} more)`}
                    </Badge>
                  </div>

                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        : "space-y-4"
                    }
                  >
                    {filteredBusinesses
                      .sort((a, b) => {
                        // First, prioritize education and study abroad related businesses
                        const educationCategories = [
                          "Student Visa Consultants",
                          "Study Abroad Consultants",
                          "Education Consultants",
                          "Language Training Centers",
                          "Visa Interview Preparation",
                        ];

                        const aIsEducation = educationCategories.includes(
                          a.category,
                        );
                        const bIsEducation = educationCategories.includes(
                          b.category,
                        );

                        if (aIsEducation && !bIsEducation) return -1;
                        if (!aIsEducation && bIsEducation) return 1;

                        // Then apply the selected sorting method
                        switch (sortBy) {
                          case "rating":
                            return (b.rating || 0) - (a.rating || 0);
                          case "reviews":
                            return (b.reviewCount || 0) - (a.reviewCount || 0);
                          case "name":
                            return a.name.localeCompare(b.name);
                          default:
                            return 0;
                        }
                      })
                      .map((business, index) => (
                        <BusinessCard
                          key={`business-${business.id || index}`}
                          business={business}
                          viewMode={viewMode}
                        />
                      ))}
                  </div>
                </div>
              </div>

              {/* Load More Button */}
              {hasMoreData && !loading && (
                <div className="text-center mt-8">
                  <Button
                    onClick={loadMore}
                    disabled={loadingMore}
                    size="lg"
                    className="px-8"
                  >
                    {loadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading More...
                      </>
                    ) : (
                      <>
                        Load More Businesses
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  <p className="text-gray-500 text-sm mt-2">
                    Showing {filteredBusinesses.length} of{" "}
                    {debugInfo.totalBusinesses} businesses
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto max-w-6xl px-4">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Other Services in {cityName}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allCategories
              .filter((cat) => cat.slug !== category)
              .slice(0, 8)
              .map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/business/${city}/${cat.slug}`}
                  className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(cat.slug)}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {cat.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {cat.slug.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* City + Category Information Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          {(() => {
            const contentData = generateCityCategoryContent(
              cityName,
              categoryName,
              categorySlug,
              country,
            );
            return (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  {contentData.title}
                </h2>
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {contentData.content.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            {getFAQs(categorySlug, cityName).map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50">
                    <h4 className="font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h4>
                    <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Call-to-Action Button */}
      <FloatingCTA onClick={() => setShowEnquiryPopup(true)} />

      {/* Enquiry Form Popup */}
      <EnquiryPopup
        isOpen={showEnquiryPopup}
        onClose={() => setShowEnquiryPopup(false)}
        onSubmit={(data) => {
          console.log("City Category Enquiry submitted:", data);
          // Add your submission logic here
        }}
      />

      {/* Debug Popup */}
      <DebugPopup debugInfo={debugInfo} />
    </div>
  );
}
