import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";

// Robust fetch wrapper with retry mechanism
async function robustFetch(url: string, options: RequestInit = {}, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

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
        throw error;
      }

      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }

  throw new Error(`All ${retries} fetch attempts failed for ${url}`);
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
  vadodara: ["Ahmedabad", "Surat", "Pune", "Indore"],
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
  kanpur: ["Lucknow", "Allahabad", "Delhi", "Agra"],
  allahabad: ["Lucknow", "Kanpur", "Varanasi", "Delhi"],
  prayagraj: ["Lucknow", "Kanpur", "Varanasi", "Delhi"],
  varanasi: ["Lucknow", "Allahabad", "Kanpur", "Patna"],

  // Indore region
  indore: ["Bhopal", "Pune", "Ahmedabad", "Nagpur"],
  bhopal: ["Indore", "Nagpur", "Delhi", "Pune"],
  nagpur: ["Indore", "Bhopal", "Pune", "Hyderabad"],

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
  kanpur: ["Lucknow", "Allahabad", "Delhi", "Agra"],
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
  nagpur: ["Mumbai", "Pune", "Raipur", "Aurangabad"],
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

        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
          {
            signal: controller.signal,
          },
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

      const response = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
      });
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
      rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Kota", "Bikaner", "Alwar"],
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

// Generate unique FAQs for each category and city combination
const getFAQs = (categorySlug: string, cityName: string) => {
  const baseFAQs = {
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
        question: `How to choose the best immigration consultant in ${cityName}?`,
        answer: `Choose licensed immigration consultants in ${cityName} with MARA/ICCRC certification, positive reviews, transparent fee structure, and specialization in your visa category. Verify their credentials and success rates.`,
      },
      {
        question: `What immigration services are available in ${cityName}?`,
        answer: `Immigration consultants in ${cityName} offer services including permanent residency applications, work permits, family sponsorship, refugee claims, citizenship applications, and immigration appeals.`,
      },
      {
        question: `How much do immigration consultants charge in ${cityName}?`,
        answer: `Immigration consultation fees in ${cityName} vary from AED 2,000 to AED 15,000 depending on the complexity of your case. Most consultants offer free initial assessments and transparent pricing.`,
      },
      {
        question: `Which countries offer the best immigration opportunities from ${cityName}?`,
        answer: `Popular immigration destinations from ${cityName} include Canada, Australia, New Zealand, USA, and several European countries. Each has different requirements and immigration pathways.`,
      },
      {
        question: `What is the success rate of immigration applications from ${cityName}?`,
        answer: `Success rates vary by country and visa category, but experienced immigration consultants in ${cityName} typically achieve 80-95% success rates for well-prepared applications with eligible candidates.`,
      },
    ],
    "visa-consultants": [
      {
        question: `What types of visas can consultants in ${cityName} help with?`,
        answer: `Visa consultants in ${cityName} assist with tourist visas, business visas, work permits, family visas, student visas, and transit visas for various countries worldwide with specialized expertise.`,
      },
      {
        question: `How long does visa processing take through ${cityName} consultants?`,
        answer: `Processing times vary by country and visa type, ranging from 3-30 working days. Consultants in ${cityName} can provide accurate timelines and expedited services when available.`,
      },
      {
        question: `What documents are required for visa applications in ${cityName}?`,
        answer: `Common requirements include valid passport, photographs, application forms, financial proof, travel itinerary, accommodation bookings, and invitation letters. Specific requirements vary by destination country.`,
      },
      {
        question: `Can visa consultants in ${cityName} guarantee visa approval?`,
        answer: `Reputable consultants in ${cityName} cannot guarantee approval but can significantly increase your chances through proper documentation, application preparation, and guidance based on their experience.`,
      },
      {
        question: `What are the visa consultation fees in ${cityName}?`,
        answer: `Visa consultation fees in ${cityName} typically range from AED 300 to AED 2,000 depending on the visa type and complexity. Many consultants offer package deals including documentation support.`,
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

  const categoryFAQs = baseFAQs[categorySlug] || [];
  return [...categoryFAQs, ...generalFAQs].slice(0, 12); // Increased to 12 FAQs per page
};

export default function CityCategory() {
  const { city, category } = useParams<{ city: string; category: string }>();
  const navigate = useNavigate();
  const location = useLocation();

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
      detectUserLocation()
        .then((location) => {
          if (location) {
            console.log("User location detected:", location);
            setUserLocation(location);
          }
        })
        .catch((error) => {
          console.log("Could not detect user location:", error);
        });
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

    // Fetch category-specific businesses from Google Maps API
    fetchCategoryBusinesses().catch((error) => {
      console.error("Unhandled error in fetchCategoryBusinesses:", error);
      setCategoryDataLoaded(true);
      setLoading(false);
    });

    // Fetch all city businesses as fallback
    fetchCityBusinesses().catch((error) => {
      console.error("Unhandled error in fetchCityBusinesses:", error);
      setCityDataLoaded(true);
    });

    // Fetch all Dubai businesses if this is a Dubai area
    if (country === "uae") {
      fetchAllDubaiBusinesses().catch((error) => {
        console.error("Unhandled error in fetchAllDubaiBusinesses:", error);
        setAllDubaiDataLoaded(true);
      });
    }

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
          `Fetching businesses for city: "${cityName}", category: "${categoryName}"`,
        );

        // Check if API is available by testing a simple endpoint first
        // Skip API check if we've had too many failures
        let apiAvailable = false;
        if (apiFailureCount < 3) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const healthCheck = await fetch("/api/health", {
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
            let scrapedResponse = await fetch(scrapedUrl, {
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
              const nearbyResponse = await fetch(nearbyUrl, {
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
        if (
          !result ||
          !result.success ||
          !result.businesses ||
          result.businesses.length === 0
        ) {
          console.log(
            "No data from API, using sample data with nearby cities fallback",
          );

          // Try to find sample businesses for exact city + category
          let sampleBusinesses_filtered = sampleBusinesses.filter(
            (business) =>
              business.city.toLowerCase() === cityName.toLowerCase() &&
              business.category
                .toLowerCase()
                .includes(categoryName.toLowerCase()),
          );

          // If no exact match, try nearby cities with category
          if (sampleBusinesses_filtered.length === 0) {
            const nearbyCities = getNearByCities(
              cityName,
              country,
              userLocation,
            );

            for (const nearbyCity_temp of nearbyCities) {
              sampleBusinesses_filtered = sampleBusinesses.filter(
                (business) =>
                  business.city.toLowerCase() ===
                    nearbyCity_temp.toLowerCase() &&
                  business.category
                    .toLowerCase()
                    .includes(categoryName.toLowerCase()),
              );

              if (sampleBusinesses_filtered.length > 0) {
                console.log(
                  `Found ${sampleBusinesses_filtered.length} sample businesses in nearby city: ${nearbyCity_temp}`,
                );
                isNearbyData = true;
                nearbyCity = nearbyCity_temp;
                break;
              }
            }
          }

          // If still no category-specific data, try just city match (broader fallback)
          if (sampleBusinesses_filtered.length === 0) {
            const nearbyCities = getNearByCities(
              cityName,
              country,
              userLocation,
            );

            for (const nearbyCity_temp of nearbyCities) {
              sampleBusinesses_filtered = sampleBusinesses.filter(
                (business) =>
                  business.city.toLowerCase() === nearbyCity_temp.toLowerCase(),
              );

              if (sampleBusinesses_filtered.length > 0) {
                console.log(
                  `Found ${sampleBusinesses_filtered.length} sample businesses (any category) in nearby city: ${nearbyCity_temp}`,
                );
                isNearbyData = true;
                nearbyCity = nearbyCity_temp;
                break;
              }
            }
          }

          if (sampleBusinesses_filtered.length > 0) {
            result = {
              success: true,
              businesses: sampleBusinesses_filtered,
              total: sampleBusinesses_filtered.length,
              source: "sample_data",
            };
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
            const nearbyCities = getNearByCities(
              cityName,
              country,
              userLocation,
            );

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
        const response = await fetch(apiUrl, {
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

          const healthCheck = await fetch("/api/health", {
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
            const response = await fetch(allDubaiUrl, {
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
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading businesses...</p>
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

      {/* Debug Popup */}
      <DebugPopup debugInfo={debugInfo} />
    </div>
  );
}
