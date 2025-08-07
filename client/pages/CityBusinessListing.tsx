import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { EnquiryPopup, FloatingCTA } from "@/components/EnquiryPopup";

// Detect third-party interference (FullStory, etc.)
const hasThirdPartyInterference = (): boolean => {
  try {
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

      xhr.timeout = 8000;

      xhr.onload = () => {
        try {
          const response = new Response(xhr.responseText, {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: new Headers(),
          });
          resolve(response);
        } catch (responseError) {
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

// Robust fetch wrapper for CityBusinessListing
async function robustFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const useXhrOnly = hasThirdPartyInterference();

  if (useXhrOnly) {
    console.log("FullStory detected, using XHR-only mode for city listing");
    return safeXhrFetch(url, options);
  }

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
    console.log("Standard fetch failed, falling back to XHR:", error);
    return safeXhrFetch(url, options);
  }
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
  indianCities,
  categoryMapping,
  type Business,
} from "@/lib/data";
import {
  allCities,
  getCitySlug,
  uaeCities,
  allIndianCities,
} from "@/lib/all-categories";
import {
  generateCityMeta,
  setPageMeta,
  setSEOLinks,
  setBreadcrumbStructuredData,
} from "@/lib/meta-utils";
import { DebugPopup } from "@/components/DebugPopup";
import { DebugPageInfo } from "@/components/DebugPageInfo";

// Mapping of areas/neighborhoods to their main cities for fallback (prioritized order)
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

  // India areas (metro fallbacks)
  gurgaon: ["Delhi", "Noida", "Faridabad", "Ghaziabad"],
  noida: ["Delhi", "Gurgaon", "Greater Noida", "Faridabad"],
  faridabad: ["Delhi", "Gurgaon", "Noida"],
  "greater noida": ["Delhi", "Noida", "Gurgaon"],
  ghaziabad: ["Delhi", "Noida", "Gurgaon"],
  "navi mumbai": ["Mumbai", "Thane", "Pune", "Kalyan"],
  thane: ["Mumbai", "Navi Mumbai", "Kalyan", "Pune"],
  kalyan: ["Mumbai", "Thane", "Navi Mumbai"],
  andheri: ["Mumbai", "Bandra", "Thane"],
  bandra: ["Mumbai", "Andheri", "Thane"],
};

// Helper function to get same region/state cities for hierarchical search
const getRegionCities = (cityName: string, country: string): string[] => {
  const normalizedCity = cityName.toLowerCase();

  // Define region/state mappings for India
  const regionMapping: Record<string, string[]> = {
    // Uttar Pradesh cities
    saharanpur: [
      "Lucknow",
      "Kanpur",
      "Agra",
      "Varanasi",
      "Allahabad",
      "Meerut",
      "Ghaziabad",
      "Noida",
    ],
    lucknow: [
      "Kanpur",
      "Agra",
      "Varanasi",
      "Allahabad",
      "Meerut",
      "Saharanpur",
    ],
    kanpur: ["Lucknow", "Agra", "Varanasi", "Allahabad", "Saharanpur"],
    agra: ["Lucknow", "Kanpur", "Varanasi", "Allahabad", "Saharanpur"],
    varanasi: ["Lucknow", "Kanpur", "Agra", "Allahabad", "Saharanpur"],
    allahabad: ["Lucknow", "Kanpur", "Agra", "Varanasi", "Saharanpur"],
    meerut: ["Ghaziabad", "Noida", "Delhi", "Saharanpur", "Lucknow"],

    // Gujarat cities
    vadodara: [
      "Ahmedabad",
      "Surat",
      "Rajkot",
      "Gandhinagar",
      "Bharuch",
      "Anand",
    ],
    ahmedabad: ["Vadodara", "Surat", "Rajkot", "Gandhinagar"],
    surat: ["Vadodara", "Ahmedabad", "Rajkot", "Bharuch"],
    rajkot: ["Vadodara", "Ahmedabad", "Surat", "Jamnagar"],

    // Maharashtra cities
    pune: ["Mumbai", "Nashik", "Aurangabad", "Solapur", "Kolhapur", "Satara"],
    mumbai: ["Pune", "Nashik", "Aurangabad", "Thane", "Navi Mumbai"],
    nashik: ["Pune", "Mumbai", "Aurangabad", "Ahmednagar"],
    aurangabad: ["Pune", "Mumbai", "Nashik", "Ahmednagar"],

    // Delhi NCR
    delhi: ["Gurgaon", "Noida", "Ghaziabad", "Faridabad", "Greater Noida"],
    gurgaon: ["Delhi", "Noida", "Ghaziabad", "Faridabad"],
    noida: ["Delhi", "Gurgaon", "Ghaziabad", "Greater Noida"],
    ghaziabad: ["Delhi", "Noida", "Meerut", "Faridabad"],

    // Karnataka cities
    bangalore: ["Mysore", "Mangalore", "Hubli", "Belgaum", "Bellary"],
    mysore: ["Bangalore", "Mangalore", "Hubli"],

    // Tamil Nadu cities
    chennai: ["Coimbatore", "Madurai", "Salem", "Tirupur", "Erode"],
    coimbatore: ["Chennai", "Madurai", "Salem", "Tirupur", "Erode"],
    madurai: ["Chennai", "Coimbatore", "Salem", "Tirupur"],

    // West Bengal cities
    kolkata: ["Howrah", "Durgapur", "Asansol", "Siliguri"],
    howrah: ["Kolkata", "Durgapur", "Asansol"],

    // Rajasthan cities
    jaipur: ["Jodhpur", "Udaipur", "Ajmer", "Kota", "Bikaner"],
    jodhpur: ["Jaipur", "Udaipur", "Ajmer", "Bikaner"],
    udaipur: ["Jaipur", "Jodhpur", "Ajmer"],

    // Madhya Pradesh cities
    indore: ["Bhopal", "Gwalior", "Jabalpur", "Ujjain"],
    bhopal: ["Indore", "Gwalior", "Jabalpur"],

    // Punjab cities
    chandigarh: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
    ludhiana: ["Chandigarh", "Amritsar", "Jalandhar"],

    // Kerala cities
    kochi: ["Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam"],
    thiruvananthapuram: ["Kochi", "Kozhikode", "Thrissur"],

    // Telangana/Andhra Pradesh
    hyderabad: ["Secunderabad", "Warangal", "Nizamabad", "Vijayawada"],
    vijayawada: ["Hyderabad", "Visakhapatnam", "Guntur"],
    visakhapatnam: ["Vijayawada", "Hyderabad", "Guntur"],
  };

  // For UAE cities, same emirate cities
  if (country === "uae") {
    const uaeRegionMapping: Record<string, string[]> = {
      dubai: ["Sharjah", "Ajman"], // Same region emirates
      "abu dhabi": [], // Abu Dhabi standalone as per requirement
      sharjah: ["Dubai", "Ajman", "Ras Al Khaimah"],
      ajman: ["Sharjah", "Dubai", "Ras Al Khaimah"],
      "ras al khaimah": ["Sharjah", "Ajman", "Fujairah"],
      fujairah: ["Ras Al Khaimah", "Sharjah"],
      "umm al quwain": ["Sharjah", "Ajman", "Ras Al Khaimah"],
    };

    return uaeRegionMapping[normalizedCity] || [];
  }

  return regionMapping[normalizedCity] || [];
};

// Helper function to get nearby cities for final fallback
const getNearByCities = (cityName: string, country: string): string[] => {
  const normalizedCity = cityName.toLowerCase();

  // Special case: Abu Dhabi should show ONLY Abu Dhabi businesses (no fallback)
  if (normalizedCity === "abu dhabi" || normalizedCity === "abu-dhabi") {
    return []; // No fallback for Abu Dhabi
  }

  // Check if we have nearby areas mapping
  if (nearbyAreasMapping[normalizedCity]) {
    return nearbyAreasMapping[normalizedCity];
  }

  // If no specific mapping, return main cities for the country (as final fallback)
  if (country === "uae") {
    return ["Dubai", "Sharjah"]; // Removed Abu Dhabi as it should be standalone
  } else {
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

// Generate unique content for city pages (500 words)
const generateCityPageContent = (cityName: string, country: string) => {
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

// Generate unique city descriptions
const getCityDescription = (cityName: string) => {
  const descriptions = {
    Dubai:
      "Discover Dubai's leading visa and immigration consultants offering comprehensive services for work permits, tourist visas, study abroad programs, and permanent residency applications. Our verified experts provide personalized guidance with high success rates.",
    "Abu Dhabi":
      "Connect with Abu Dhabi's most trusted visa consultants specializing in all types of visa applications including family visas, business permits, and immigration services. Get expert assistance with transparent pricing and reliable processing.",
    Sharjah:
      "Find experienced visa and immigration consultants in Sharjah providing affordable and efficient services for tourist visas, work permits, and study abroad guidance. Professional support for all your visa needs with excellent customer service.",
    Ajman:
      "Access reliable visa consultation services in Ajman for all your travel and immigration requirements. Our certified consultants offer competitive rates and comprehensive support for visa applications and documentation.",
    Delhi:
      "Explore Delhi's top-rated visa and immigration consultants offering expert services for international travel, study abroad programs, and permanent residency applications with proven track records and personalized assistance.",
    Mumbai:
      "Connect with Mumbai's premier visa consultants providing comprehensive immigration services, tourist visa assistance, and study abroad guidance. Get professional support for all your visa requirements with excellent success rates.",
  };

  return (
    descriptions[cityName] ||
    `Find trusted and verified visa consultants in ${cityName}. Compare services, read reviews, and choose the best expert for your visa needs with transparent pricing and reliable service.`
  );
};

// Generate comprehensive FAQs for city pages
const getCityFAQs = (cityName: string) => {
  const citySpecificFAQs = [
    {
      question: `What types of visa services are available in ${cityName}?`,
      answer: `${cityName} offers comprehensive visa services including tourist visas, work permits, student visas, family reunion visas, business visas, permanent residency applications, citizenship services, and emergency travel documents. The city hosts numerous certified consultants specializing in various countries and visa categories with expertise in documentation, application processing, and legal compliance.`,
    },
    {
      question: `How many visa consultants operate in ${cityName}?`,
      answer: `${cityName} has over 200+ licensed visa and immigration consultants ranging from individual practitioners to large consulting firms. The city is a major hub for visa services in the region, serving both residents and visitors from across the Middle East, Asia, and Africa. Most consultants are located in business districts with easy accessibility and modern facilities.`,
    },
    {
      question: `What are the average consultation fees in ${cityName}?`,
      answer: `Consultation fees in ${cityName} vary by service complexity: Basic consultations (AED 300-800), tourist visa processing (AED 500-2,000), work permit applications (AED 8,000-25,000), student visa packages (AED 3,000-12,000), and permanent residency services (AED 15,000-40,000). Government fees, document attestation, medical exams, and translation services are additional. Most consultants offer transparent pricing and package deals.`,
    },
    {
      question: `Which countries do ${cityName} consultants specialize in?`,
      answer: `Consultants in ${cityName} specialize in major destinations including USA, Canada, Australia, UK, New Zealand, Germany, France, Netherlands, Sweden, Singapore, and other European and Western countries. Many also handle regional applications for GCC countries, Asian destinations, and emerging markets. Choose consultants based on their specific expertise in your target country and visa category.`,
    },
    {
      question: `How do I choose the best visa consultant in ${cityName}?`,
      answer: `Select consultants in ${cityName} based on: Valid licensing and certifications (MARA, ICCRC), specialized expertise in your target country, proven track record with similar cases, transparent fee structure, positive client reviews, physical office presence, professional staff qualifications, after-service support offerings, and clear service agreements. Schedule consultations with 2-3 firms before deciding.`,
    },
    {
      question: `What documents do I need for visa applications in ${cityName}?`,
      answer: `Common requirements include: Valid passport (6+ months validity), completed application forms, recent photographs (specific size requirements), educational certificates and transcripts, work experience documents, financial proof (bank statements, salary certificates), medical examination results, police clearance certificates, travel insurance, and destination-specific documents. All documents must be attested and translated if required.`,
    },
    {
      question: `How long does visa processing take in ${cityName}?`,
      answer: `Processing times vary by destination and visa type: Tourist visas (3-15 working days), work permits (2-12 months), student visas (4-8 weeks), family visas (2-6 months), and permanent residency (6-24 months). Consultants in ${cityName} provide realistic timelines, track applications, and offer expedited services where available. Some embassies offer premium processing for additional fees.`,
    },
    {
      question: `Do ${cityName} consultants provide post-visa services?`,
      answer: `Yes, reputable consultants in ${cityName} offer comprehensive post-visa services including: Travel arrangement assistance, pre-departure orientation sessions, airport pickup coordination, initial settlement guidance, bank account opening support, school enrollment assistance for children, job search guidance, visa renewal services, and family reunion applications. Premium service providers often have partnerships with settlement agencies.`,
    },
    {
      question: `Are consultation services in ${cityName} regulated?`,
      answer: `Yes, visa consultation services in ${cityName} are regulated by UAE authorities and international bodies. Consultants must hold valid trade licenses, maintain professional insurance, and comply with ethical standards. Immigration consultants for specific countries require additional certifications (MARA for Australia, ICCRC for Canada). Always verify consultant credentials and report any unethical practices to relevant authorities.`,
    },
    {
      question: `Can I get a refund if my visa application is rejected?`,
      answer: `Refund policies in ${cityName} vary by consultant and service type. Ethical firms typically offer: Partial refunds (50-70%) for rejections due to consultant error, full refunds if promised services aren't delivered, no refunds for government rejections due to client ineligibility, and documented refund policies in service agreements. Clarify refund terms before engaging services and get policies in writing.`,
    },
  ];

  return citySpecificFAQs.slice(0, 10); // Return 10 FAQs for city pages
};

export default function CityBusinessListing() {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error(
        "Unhandled promise rejection in CityBusinessListing:",
        event.reason,
      );
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

  // Detect if this is a UAE route
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

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isShowingNearbyData, setIsShowingNearbyData] = useState(false);
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);
  const ITEMS_PER_PAGE = 50;
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

  // Convert URL param back to proper city name
  const cityName = city
    ? city
        .split("-")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ")
    : "";

  // Function to fetch businesses from API with real database fallback
  const fetchBusinesses = async (page = 1, resetList = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      console.log(`Fetching businesses for city: "${cityName}", page: ${page}`);

      // Check if API is available
      let apiAvailable = false;
      try {
        const healthCheck = await robustFetch("/api/health", {
          method: "HEAD",
        });
        apiAvailable = healthCheck.ok;
      } catch (healthError) {
        console.log("API health check failed, will use sample data fallback");
        apiAvailable = false;
      }

      let result = null;
      let isNearbyData = false;
      let nearbyCity = "";

      if (apiAvailable) {
        // Step 1: Try exact city first
        try {
          let response = await robustFetch(
            `/api/scraped-businesses?city=${encodeURIComponent(cityName)}&page=${page}&limit=${ITEMS_PER_PAGE}`,
          );

          if (response.ok) {
            result = await response.json();
            console.log("Primary API Response:", result);
          } else {
            console.log(`API response not OK: ${response.status}`);
          }
        } catch (fetchError) {
          console.log("Failed to fetch from primary API:", fetchError);
        }
      }

      // Step 2: If no data found for specific city, implement proper hierarchical search
      if (
        apiAvailable &&
        (!result ||
          !result.success ||
          !result.businesses ||
          result.businesses.length === 0)
      ) {
        console.log(
          `🔍 No data found for ${cityName}, implementing hierarchical search...`,
        );

        // PHASE 1: Check same region/state cities first
        const regionCities = getRegionCities(cityName, country);
        if (regionCities.length > 0) {
          console.log(
            `📍 PHASE 1: Checking same region cities: ${regionCities.join(", ")}`,
          );

          for (const regionCity of regionCities) {
            try {
              console.log(`🎯 Trying region city: ${regionCity}`);
              const regionResponse = await robustFetch(
                `/api/scraped-businesses?city=${encodeURIComponent(regionCity)}&page=${page}&limit=${ITEMS_PER_PAGE}`,
              );

              if (regionResponse.ok) {
                const regionResult = await regionResponse.json();
                if (
                  regionResult.success &&
                  regionResult.businesses &&
                  regionResult.businesses.length > 0
                ) {
                  console.log(
                    `✅ REGION MATCH: Found ${regionResult.businesses.length} businesses in ${regionCity}`,
                  );
                  result = regionResult;
                  isNearbyData = true;
                  nearbyCity = regionCity;
                  break; // Found data in same region, stop searching
                }
              }
            } catch (regionError) {
              console.log(
                `❌ Failed to fetch from region city ${regionCity}:`,
                regionError,
              );
            }
          }
        }

        // PHASE 2: If still no data, try broader nearby cities
        if (
          !result ||
          !result.success ||
          !result.businesses ||
          result.businesses.length === 0
        ) {
          console.log(`🌍 PHASE 2: Checking broader nearby cities...`);
          const nearbyCities = getNearByCities(cityName, country);

          for (const nearbyCity_temp of nearbyCities) {
            try {
              console.log(`🔄 Trying nearby city: ${nearbyCity_temp}`);
              const nearbyResponse = await robustFetch(
                `/api/scraped-businesses?city=${encodeURIComponent(nearbyCity_temp)}&page=${page}&limit=${ITEMS_PER_PAGE}`,
              );

              if (nearbyResponse.ok) {
                const nearbyResult = await nearbyResponse.json();
                if (
                  nearbyResult.success &&
                  nearbyResult.businesses &&
                  nearbyResult.businesses.length > 0
                ) {
                  console.log(
                    `✅ NEARBY MATCH: Found ${nearbyResult.businesses.length} businesses in ${nearbyCity_temp}`,
                  );
                  result = nearbyResult;
                  isNearbyData = true;
                  nearbyCity = nearbyCity_temp;
                  break; // Found data, stop searching
                }
              }
            } catch (nearbyError) {
              console.log(
                `❌ Failed to fetch from nearby city ${nearbyCity_temp}:`,
                nearbyError,
              );
            }
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

        // Try to find sample businesses for exact city
        let sampleBusinesses_filtered = sampleBusinesses.filter(
          (business) => business.city.toLowerCase() === cityName.toLowerCase(),
        );

        // If no exact match, try nearby cities
        if (sampleBusinesses_filtered.length === 0) {
          const nearbyCities = getNearByCities(cityName, country);

          for (const nearbyCity_temp of nearbyCities) {
            sampleBusinesses_filtered = sampleBusinesses.filter(
              (business) =>
                business.city.toLowerCase() === nearbyCity_temp.toLowerCase(),
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
        let newBusinesses = result.businesses;

        // Add nearby data flag if this is from a nearby city
        if (isNearbyData) {
          newBusinesses = newBusinesses.map((business) => ({
            ...business,
            isNearbyData: true,
            originalRequestedCity: cityName,
            nearbyCity: nearbyCity,
          }));
          setIsShowingNearbyData(true);
        } else {
          setIsShowingNearbyData(false);
        }

        if (resetList || page === 1) {
          setBusinesses(newBusinesses);
          setFilteredBusinesses(newBusinesses);
        } else {
          // Append to existing list for load more
          setBusinesses((prev) => [...prev, ...newBusinesses]);
          setFilteredBusinesses((prev) => [...prev, ...newBusinesses]);
        }

        setTotalBusinesses(result.total || newBusinesses.length);
        setTotalPages(
          result.totalPages ||
            Math.ceil((result.total || newBusinesses.length) / ITEMS_PER_PAGE),
        );
        setHasMore(page < (result.totalPages || 1));

        // Update debug info
        const timestamp = new Date().toLocaleTimeString();
        const apiUrl = `/api/scraped-businesses?city=${encodeURIComponent(cityName)}&page=${page}&limit=${ITEMS_PER_PAGE}`;
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
          cityBusinesses: newBusinesses.length,
          totalBusinesses: result.total || newBusinesses.length,
        }));

        setLoading(false);
        setLoadingMore(false);
        return;
      }

      // If no data found anywhere, set empty results
      console.log("No data found in database for any nearby cities");
      setBusinesses([]);
      setFilteredBusinesses([]);
      setTotalBusinesses(0);
      setTotalPages(0);
      setHasMore(false);
      setIsShowingNearbyData(false);
    } catch (error) {
      console.error("Error fetching businesses:", error);

      // Reset to empty on error
      setBusinesses([]);
      setFilteredBusinesses([]);
      setTotalBusinesses(0);
      setTotalPages(0);
      setHasMore(false);
      setIsShowingNearbyData(false);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    // Validate city exists
    const cityExists = allCities.some(
      (c) => getCitySlug(c) === city.toLowerCase(),
    );

    if (!city || !cityExists) {
      navigate("/business");
      return;
    }

    // Reset pagination when city changes
    setCurrentPage(1);
    setBusinesses([]);
    setFilteredBusinesses([]);

    // Fetch businesses from API with error safety
    Promise.resolve().then(async () => {
      try {
        await fetchBusinesses(1, true);
      } catch (error) {
        console.error("Error in fetchBusinesses:", error);
        setLoading(false);
        setLoadingMore(false);
      }
    });

    // Set page meta data with SEO optimization
    const metaData = generateCityMeta(cityName);
    setPageMeta(metaData);

    // Set SEO links for better Google crawling
    setSEOLinks({
      canonical: `/business/${city}`,
      alternate: [`/business/${city}`, "/business"],
    });

    // Set breadcrumb structured data
    setBreadcrumbStructuredData([
      { name: "Home", url: "/" },
      { name: "Browse", url: "/business" },
      { name: cityName, url: `/business/${city}` },
    ]);
  }, [city, cityName, navigate]);

  useEffect(() => {
    let filtered = businesses;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (business) =>
          business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.services.some((service) =>
            service.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (business) => business.category === selectedCategory,
      );
    }

    // Sort businesses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    setFilteredBusinesses(filtered);
  }, [businesses, searchQuery, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-24 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-300 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const cityStats = {
    totalConsultants: businesses.length,
    averageRating:
      businesses.length > 0
        ? (
            businesses.reduce((sum, b) => sum + b.rating, 0) / businesses.length
          ).toFixed(1)
        : "0",
    categories: [...new Set(businesses.map((b) => b.category))].length,
    topRated: businesses.filter((b) => b.rating >= 4.5).length,
  };

  const getCategoryIcon = (categorySlug: string) => {
    switch (categorySlug) {
      case "study-abroad":
      case "education-services":
        return "🎓";
      case "work-permit":
        return "💼";
      case "immigration-consultants":
        return "⚖��";
      case "visa-consultants":
        return "📋";
      case "visa-services":
        return "🛂";
      case "immigration-services":
        return "🏛️";
      case "overseas-services":
        return "🌍";
      default:
        return "🏢";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-8 sm:pb-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center mb-4 sm:mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/business")}
              className="mr-4 text-xs sm:text-sm"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">All Cities</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>

          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
              Visa Consultants in {cityName}
            </h1>

            {/* Show notification for Abu Dhabi showing only local results */}
            {!isShowingNearbyData &&
              businesses.length > 0 &&
              (cityName.toLowerCase() === "abu dhabi" ||
                cityName.toLowerCase() === "abu-dhabi") && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 max-w-3xl mx-auto">
                  <div className="flex items-center justify-center gap-2 text-green-800">
                    <Building className="h-5 w-5" />
                    <span className="font-medium">
                      Showing {businesses.length} verified consultants
                      specifically from Abu Dhabi only
                    </span>
                  </div>
                </div>
              )}

            <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-4 sm:mb-6 max-w-3xl mx-auto leading-relaxed px-2">
              {getCityDescription(cityName)}
            </p>

            {/* City Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto px-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                  {cityStats.totalConsultants}
                </div>
                <div className="text-xs sm:text-sm text-blue-100">
                  Total Consultants
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                  {cityStats.averageRating}★
                </div>
                <div className="text-xs sm:text-sm text-blue-100">
                  Average Rating
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                  {cityStats.categories}
                </div>
                <div className="text-xs sm:text-sm text-blue-100">
                  Service Categories
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                  {cityStats.topRated}
                </div>
                <div className="text-xs sm:text-sm text-blue-100">
                  Top Rated (4.5+)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-4 sm:py-6 bg-white shadow-sm">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Search consultants in ${cityName}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 sm:h-auto"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-48 lg:w-64 h-10 sm:h-auto">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {businessCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="px-3"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="px-3"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery("")}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {totalBusinesses} Consultants Found
              </h2>
              <p className="text-gray-600">
                Showing {filteredBusinesses.length} of {totalBusinesses} results
                for {cityName}
                {selectedCategory !== "all" && ` in ${selectedCategory}`}
              </p>
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
            </div>

            {filteredBusinesses.length > 0 && (
              <div className="text-sm text-gray-500">
                Sorted by{" "}
                {sortBy === "rating"
                  ? "highest rated"
                  : sortBy === "reviews"
                    ? "most reviews"
                    : "name"}
              </div>
            )}
          </div>

          {filteredBusinesses.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="max-w-md mx-auto">
                  <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No consultants found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || selectedCategory !== "all"
                      ? "Try adjusting your search criteria or browse all consultants."
                      : `We don't have any consultants listed in ${cityName} yet.`}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {(searchQuery || selectedCategory !== "all") && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                    <Button asChild>
                      <Link to="/business">Browse All Cities</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredBusinesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    className={viewMode === "list" ? "flex-row" : ""}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {(hasMore || currentPage > 1) && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  {/* Previous Page */}
                  {currentPage > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newPage = currentPage - 1;
                        setCurrentPage(newPage);
                        fetchBusinesses(newPage, true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={loading}
                    >
                      ← Previous Page
                    </Button>
                  )}

                  {/* Page Info */}
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  {/* Next Page */}
                  {hasMore && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newPage = currentPage + 1;
                        setCurrentPage(newPage);
                        fetchBusinesses(newPage, true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={loading}
                    >
                      Next Page →
                    </Button>
                  )}

                  {/* Load More (Alternative) */}
                  {hasMore && (
                    <Button
                      onClick={() => {
                        const newPage = currentPage + 1;
                        setCurrentPage(newPage);
                        fetchBusinesses(newPage, false); // Don't reset list
                      }}
                      disabled={loadingMore}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {loadingMore
                        ? "Loading..."
                        : `Load More (${Math.min(ITEMS_PER_PAGE, totalBusinesses - filteredBusinesses.length)} more)`}
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto max-w-6xl px-4">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Browse Services in {cityName}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryMapping).map(([slug, name]) => (
              <Link
                key={slug}
                to={`/business/${city}/${slug}`}
                className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(slug)}</span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                      {name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {slug.replace("-", " ")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {businesses.length > 0 && (
        <section className="py-12 bg-blue-50">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Are you a visa consultant in {cityName}?
            </h3>
            <p className="text-gray-600 mb-6">
              Join our platform and connect with thousands of clients looking
              for visa assistance.
            </p>
            <Button asChild size="lg">
              <Link to="/add-business">List Your Business</Link>
            </Button>
          </div>
        </section>
      )}

      {/* City Information Content */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4">
          {(() => {
            const contentData = generateCityPageContent(cityName, country);
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
            {getCityFAQs(cityName).map((faq, index) => (
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

      {/* Floating Call-to-Action Button */}
      <FloatingCTA onClick={() => setShowEnquiryPopup(true)} />

      {/* Enquiry Form Popup */}
      <EnquiryPopup
        isOpen={showEnquiryPopup}
        onClose={() => setShowEnquiryPopup(false)}
        onSubmit={(data) => {
          console.log("City Business Listing Enquiry submitted:", data);
          // Add your submission logic here
        }}
      />

      {/* Debug Page Info - Shows SEO meta information */}
      <DebugPageInfo />
    </div>
  );
}
