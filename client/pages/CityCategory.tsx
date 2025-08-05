import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
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
  "dubai": ["Abu Dhabi", "Sharjah"],

  // Dubai sub-areas (all should fallback to Dubai first, then other Dubai areas)
  "al barsha": ["Dubai", "Business Bay", "Downtown Dubai", "Dubai Marina", "JLT", "DIFC"],
  "business bay": ["Dubai", "Downtown Dubai", "DIFC", "Al Barsha", "Dubai Marina"],
  "downtown dubai": ["Dubai", "Business Bay", "DIFC", "Dubai Marina", "JLT"],
  "dubai marina": ["Dubai", "JLT", "Business Bay", "Downtown Dubai", "Jumeirah"],
  "jlt": ["Dubai", "Dubai Marina", "Business Bay", "Downtown Dubai", "DIFC"],
  "difc": ["Dubai", "Business Bay", "Downtown Dubai", "JLT", "Dubai Marina"],
  "deira": ["Dubai", "Bur Dubai", "Downtown Dubai", "Business Bay"],
  "bur dubai": ["Dubai", "Deira", "Downtown Dubai", "Business Bay"],
  "jumeirah": ["Dubai", "Dubai Marina", "Business Bay", "Downtown Dubai"],
  "mirdif": ["Dubai", "International City", "Business Bay", "Downtown Dubai"],
  "international city": ["Dubai", "Mirdif", "Business Bay", "Downtown Dubai"],

  // Abu Dhabi areas - NO fallback for main Abu Dhabi city to show only Abu Dhabi businesses
  "al ain": ["Abu Dhabi", "Dubai", "Sharjah"],

  // Other UAE cities fallback to main emirates
  "ajman": ["Sharjah", "Dubai"],  // Updated: Ajman should show Sharjah and Dubai businesses
  "ras al khaimah": ["Dubai", "Sharjah", "Abu Dhabi"],
  "fujairah": ["Dubai", "Sharjah", "Abu Dhabi"],
  "umm al quwain": ["Dubai", "Sharjah", "Abu Dhabi"],

  // India areas (metro fallbacks)
  "gurgaon": ["Delhi", "Noida", "Faridabad", "Ghaziabad"],
  "noida": ["Delhi", "Gurgaon", "Greater Noida", "Faridabad"],
  "faridabad": ["Delhi", "Gurgaon", "Noida"],
  "greater noida": ["Delhi", "Noida", "Gurgaon"],
  "ghaziabad": ["Delhi", "Noida", "Gurgaon"],
  "navi mumbai": ["Mumbai", "Thane", "Pune", "Kalyan"],
  "thane": ["Mumbai", "Navi Mumbai", "Kalyan", "Pune"],
  "kalyan": ["Mumbai", "Thane", "Navi Mumbai"],
  "andheri": ["Mumbai", "Bandra", "Thane"],
  "bandra": ["Mumbai", "Andheri", "Thane"],
};

// Helper function to get nearby cities for fallback
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

  // If no specific mapping, return main cities for the country
  if (country === 'uae') {
    return ["Dubai", "Abu Dhabi", "Sharjah"];
  } else {
    return ["Delhi", "Mumbai", "Bangalore", "Chennai"];
  };
};

// Generate unique FAQs for each category and city combination
const getFAQs = (categorySlug: string, cityName: string) => {
  const baseFAQs = {
    "study-abroad": [
      {
        question: `What are the best study abroad consultants in ${cityName}?`,
        answer: `The top study abroad consultants in ${cityName} are those with proven track records, certified credentials, and high success rates. Look for consultants who specialize in your target country and have partnerships with international universities.`
      },
      {
        question: `How much do study abroad consultants charge in ${cityName}?`,
        answer: `Study abroad consultation fees in ${cityName} typically range from AED 1,500 to AED 8,000 depending on the services included. Most consultants offer package deals that include university selection, application assistance, and visa guidance.`
      },
      {
        question: `Which countries are most popular for studying abroad from ${cityName}?`,
        answer: `Students from ${cityName} commonly choose USA, UK, Canada, Australia, Germany, and Ireland for higher education. The choice depends on factors like course availability, budget, and immigration policies.`
      },
      {
        question: `What documents do I need for studying abroad from ${cityName}?`,
        answer: `Essential documents include academic transcripts, standardized test scores (IELTS/TOEFL/GRE/GMAT), passport, statement of purpose, recommendation letters, and financial proof. Requirements vary by country and university.`
      },
      {
        question: `How long does the study abroad application process take in ${cityName}?`,
        answer: `The complete process typically takes 6-12 months from university application to visa approval. Starting early and working with experienced consultants in ${cityName} can help streamline the timeline.`
      }
    ],
    "immigration-consultants": [
      {
        question: `How to choose the best immigration consultant in ${cityName}?`,
        answer: `Choose licensed immigration consultants in ${cityName} with MARA/ICCRC certification, positive reviews, transparent fee structure, and specialization in your visa category. Verify their credentials and success rates.`
      },
      {
        question: `What immigration services are available in ${cityName}?`,
        answer: `Immigration consultants in ${cityName} offer services including permanent residency applications, work permits, family sponsorship, refugee claims, citizenship applications, and immigration appeals.`
      },
      {
        question: `How much do immigration consultants charge in ${cityName}?`,
        answer: `Immigration consultation fees in ${cityName} vary from AED 2,000 to AED 15,000 depending on the complexity of your case. Most consultants offer free initial assessments and transparent pricing.`
      },
      {
        question: `Which countries offer the best immigration opportunities from ${cityName}?`,
        answer: `Popular immigration destinations from ${cityName} include Canada, Australia, New Zealand, USA, and several European countries. Each has different requirements and immigration pathways.`
      },
      {
        question: `What is the success rate of immigration applications from ${cityName}?`,
        answer: `Success rates vary by country and visa category, but experienced immigration consultants in ${cityName} typically achieve 80-95% success rates for well-prepared applications with eligible candidates.`
      }
    ],
    "visa-consultants": [
      {
        question: `What types of visas can consultants in ${cityName} help with?`,
        answer: `Visa consultants in ${cityName} assist with tourist visas, business visas, work permits, family visas, student visas, and transit visas for various countries worldwide with specialized expertise.`
      },
      {
        question: `How long does visa processing take through ${cityName} consultants?`,
        answer: `Processing times vary by country and visa type, ranging from 3-30 working days. Consultants in ${cityName} can provide accurate timelines and expedited services when available.`
      },
      {
        question: `What documents are required for visa applications in ${cityName}?`,
        answer: `Common requirements include valid passport, photographs, application forms, financial proof, travel itinerary, accommodation bookings, and invitation letters. Specific requirements vary by destination country.`
      },
      {
        question: `Can visa consultants in ${cityName} guarantee visa approval?`,
        answer: `Reputable consultants in ${cityName} cannot guarantee approval but can significantly increase your chances through proper documentation, application preparation, and guidance based on their experience.`
      },
      {
        question: `What are the visa consultation fees in ${cityName}?`,
        answer: `Visa consultation fees in ${cityName} typically range from AED 300 to AED 2,000 depending on the visa type and complexity. Many consultants offer package deals including documentation support.`
      }
    ],
    "visit-visa-specialists": [
      {
        question: `Which countries can I get visit visas for from ${cityName}?`,
        answer: `Visit visa specialists in ${cityName} can help you obtain tourist visas for USA, UK, Schengen countries, Canada, Australia, Japan, South Korea, and many other popular destinations.`
      },
      {
        question: `What is the success rate for visit visas from ${cityName}?`,
        answer: `Success rates for visit visas from ${cityName} vary by destination but experienced specialists typically achieve 85-95% approval rates for properly documented applications with eligible applicants.`
      },
      {
        question: `How much does a visit visa consultation cost in ${cityName}?`,
        answer: `Visit visa consultation fees in ${cityName} range from AED 200 to AED 1,500 depending on the destination country and services included. Many specialists offer comprehensive packages.`
      },
      {
        question: `What documents do I need for a visit visa application in ${cityName}?`,
        answer: `Required documents typically include passport, photographs, bank statements, employment letter, travel insurance, hotel bookings, flight itinerary, and invitation letters if applicable.`
      }
    ],
    "work-permit": [
      {
        question: `Which countries offer work permits through ${cityName} consultants?`,
        answer: `Work permit specialists in ${cityName} can assist with applications for Canada, Australia, New Zealand, Germany, UAE, USA, and other countries with various skilled worker programs.`
      },
      {
        question: `What is the process for obtaining a work permit through ${cityName}?`,
        answer: `The process involves skills assessment, job search assistance, employer nomination, application submission, and visa processing. Consultants in ${cityName} guide you through each step.`
      },
      {
        question: `How long does work permit processing take from ${cityName}?`,
        answer: `Work permit processing times vary from 2-12 months depending on the country and program. Consultants in ${cityName} provide realistic timelines and regular updates on your application status.`
      }
    ]
  };

  const generalFAQs = [
    {
      question: `Are consultation services in ${cityName} reliable?`,
      answer: `Yes, ${cityName} has many licensed and experienced consultants. Always verify credentials, read reviews, and choose consultants with proper certifications and proven track records.`
    },
    {
      question: `Do consultants in ${cityName} provide after-service support?`,
      answer: `Most reputable consultants in ${cityName} offer comprehensive after-service support including visa tracking, pre-departure guidance, and assistance with any issues that may arise.`
    },
    {
      question: `Can I get a refund if my application is rejected?`,
      answer: `Refund policies vary by consultant in ${cityName}. Reputable firms often offer partial refunds for rejected applications or money-back guarantees under specific conditions. Always clarify this upfront.`
    },
    {
      question: `How do I verify the credentials of consultants in ${cityName}?`,
      answer: `Check for proper licensing, certifications from relevant authorities, membership in professional associations, client testimonials, and online reviews to verify consultant credentials in ${cityName}.`
    },
    {
      question: `What should I avoid when choosing a consultant in ${cityName}?`,
      answer: `Avoid consultants who guarantee success, ask for full payment upfront, lack proper credentials, have poor reviews, or make unrealistic promises about processing times or outcomes.`
    }
  ];

  const categoryFAQs = baseFAQs[categorySlug] || [];
  return [...categoryFAQs, ...generalFAQs].slice(0, 8); // Limit to 8 FAQs per page
};

export default function CityCategory() {
  const { city, category } = useParams<{ city: string; category: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if this is a UAE route (either by /uae/ prefix or UAE city names)
  const isUAERoute = location.pathname.startsWith("/uae/");
  const isUAECity = city && ["dubai", "abu-dhabi", "sharjah", "ajman", "ras-al-khaimah", "fujairah", "umm-al-quwain"].includes(city.toLowerCase());
  const country = (isUAERoute || isUAECity) ? "uae" : "india";

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
    fetchCategoryBusinesses();

    // Fetch all city businesses as fallback
    fetchCityBusinesses();

    // Fetch all Dubai businesses if this is a Dubai area
    if (country === 'uae') {
      fetchAllDubaiBusinesses();
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
        console.log(`Fetching businesses for city: "${cityName}", category: "${categoryName}"`);

        // Check if API is available by testing a simple endpoint first
        // Skip API check if we've had too many failures
        let apiAvailable = false;
        if (apiFailureCount < 3) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            const healthCheck = await fetch('/api/health', {
              method: 'HEAD',
              signal: controller.signal
            });
            clearTimeout(timeoutId);
            apiAvailable = healthCheck.ok;
          } catch (healthError) {
            console.log('API health check failed, API not available:', healthError);
            setApiFailureCount(prev => prev + 1);
            apiAvailable = false;
          }
        } else {
          console.log('Skipping API calls due to repeated failures, using sample data');
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
              signal: controller.signal
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
            setApiFailureCount(prev => prev + 1);
            apiAvailable = false;
          }
        }

        if (!apiAvailable) {
          console.log("API not available, using sample data fallback");
        }

        // Step 2: If no data found for specific area + category, try hierarchical fallback
        if (apiAvailable && (!result || !result.success || !result.businesses || result.businesses.length === 0)) {
          console.log(`No data found for ${cityName} + ${categoryName}, trying nearby cities from database`);

          const nearbyCities = getNearByCities(cityName, country);

          for (const nearbyCity_temp of nearbyCities) {
            try {
              console.log(`Trying nearby city: ${nearbyCity_temp} + ${categoryName}`);
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

              const nearbyUrl = `/api/scraped-businesses?city=${encodeURIComponent(nearbyCity_temp)}&category=${encodeURIComponent(categoryName)}&limit=100`;
              const nearbyResponse = await fetch(nearbyUrl, {
                signal: controller.signal
              });
              clearTimeout(timeoutId);

              if (nearbyResponse.ok) {
                const nearbyResult = await nearbyResponse.json();
                if (nearbyResult.success && nearbyResult.businesses && nearbyResult.businesses.length > 0) {
                  console.log(`Found ${nearbyResult.businesses.length} businesses in nearby city: ${nearbyCity_temp}`);
                  result = nearbyResult;
                  isNearbyData = true;
                  nearbyCity = nearbyCity_temp;
                  break; // Found data, stop searching
                }
              } else {
                console.log(`Nearby API response not OK for ${nearbyCity_temp}: ${nearbyResponse.status}`);
              }
            } catch (nearbyError) {
              console.log(`Failed to fetch data for nearby city ${nearbyCity_temp}:`, nearbyError);
              // Continue to next nearby city instead of stopping
            }
          }
        }

        // Step 3: If no data from API, fallback to sample data with nearby cities logic
        if (!result || !result.success || !result.businesses || result.businesses.length === 0) {
          console.log("No data from API, using sample data with nearby cities fallback");

          // Try to find sample businesses for exact city + category
          let sampleBusinesses_filtered = sampleBusinesses.filter(
            (business) =>
              business.city.toLowerCase() === cityName.toLowerCase() &&
              business.category.toLowerCase().includes(categoryName.toLowerCase())
          );

          // If no exact match, try nearby cities with category
          if (sampleBusinesses_filtered.length === 0) {
            const nearbyCities = getNearByCities(cityName, country);

            for (const nearbyCity_temp of nearbyCities) {
              sampleBusinesses_filtered = sampleBusinesses.filter(
                (business) =>
                  business.city.toLowerCase() === nearbyCity_temp.toLowerCase() &&
                  business.category.toLowerCase().includes(categoryName.toLowerCase())
              );

              if (sampleBusinesses_filtered.length > 0) {
                console.log(`Found ${sampleBusinesses_filtered.length} sample businesses in nearby city: ${nearbyCity_temp}`);
                isNearbyData = true;
                nearbyCity = nearbyCity_temp;
                break;
              }
            }
          }

          // If still no category-specific data, try just city match (broader fallback)
          if (sampleBusinesses_filtered.length === 0) {
            const nearbyCities = getNearByCities(cityName, country);

            for (const nearbyCity_temp of nearbyCities) {
              sampleBusinesses_filtered = sampleBusinesses.filter(
                (business) => business.city.toLowerCase() === nearbyCity_temp.toLowerCase()
              );

              if (sampleBusinesses_filtered.length > 0) {
                console.log(`Found ${sampleBusinesses_filtered.length} sample businesses (any category) in nearby city: ${nearbyCity_temp}`);
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
              source: 'sample_data'
            };
          }
        }

        // Step 4: Process result if we have data (from API or sample data)
        if (result && result.success && result.businesses && result.businesses.length > 0) {
          let businesses = result.businesses;

          // Add nearby data flag if this is from a nearby city
          if (isNearbyData) {
            businesses = businesses.map(business => ({
              ...business,
              isNearbyData: true,
              originalRequestedCity: cityName,
              nearbyCity: nearbyCity
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
                status: result.source === 'sample_data' ? "sample_fallback" : "success",
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
          console.log("Emergency fallback: using sample data for category businesses");

          let sampleBusinesses_filtered = sampleBusinesses.filter(
            (business) =>
              business.city.toLowerCase() === cityName.toLowerCase() &&
              business.category.toLowerCase().includes(categoryName.toLowerCase())
          );

          // If no exact match, try nearby cities
          if (sampleBusinesses_filtered.length === 0) {
            const nearbyCities = getNearByCities(cityName, country);

            for (const nearbyCity_temp of nearbyCities) {
              sampleBusinesses_filtered = sampleBusinesses.filter(
                (business) =>
                  business.city.toLowerCase() === nearbyCity_temp.toLowerCase() &&
                  business.category.toLowerCase().includes(categoryName.toLowerCase())
              );

              if (sampleBusinesses_filtered.length > 0) {
                console.log(`Emergency fallback: Found ${sampleBusinesses_filtered.length} sample businesses in nearby city: ${nearbyCity_temp}`);
                setIsShowingNearbyData(true);
                break;
              }
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
        // For production, skip API calls and use sample data
        const isProduction = window.location.hostname.includes('fly.dev') ||
                           window.location.hostname.includes('netlify.app') ||
                           !window.location.hostname.includes('localhost');

        if (isProduction) {
          console.log('Production environment: using sample data for city businesses');
          const sampleCityBusinesses = sampleBusinesses.filter(
            (business) => business.city.toLowerCase() === cityName.toLowerCase(),
          );
          setCityBusinesses(sampleCityBusinesses);
          setCityDataLoaded(true);
          return;
        }

        // Fetch all businesses for the city with higher limit
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const apiUrl = `/api/scraped-businesses?city=${encodeURIComponent(cityName)}&limit=1000`;
        const response = await fetch(apiUrl, {
          signal: controller.signal
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

        // For production, skip API calls and use sample data
        const isProduction = window.location.hostname.includes('fly.dev') ||
                           window.location.hostname.includes('netlify.app') ||
                           !window.location.hostname.includes('localhost');

        if (isProduction) {
          console.log('Production environment: using sample data for Dubai businesses');
          const sampleDubaiBusinesses = sampleBusinesses.filter(
            (business) => business.city.toLowerCase() === 'dubai'
          );
          setAllDubaiBusinesses(sampleDubaiBusinesses);
          setTotalAvailableBusinesses(sampleDubaiBusinesses.length);
          setAllDubaiDataLoaded(true);
          return;
        }

        // Check if API is available
        let apiAvailable = false;
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

          const healthCheck = await fetch('/api/health', {
            method: 'HEAD',
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          apiAvailable = healthCheck.ok;
        } catch (healthError) {
          console.log('API health check failed for Dubai businesses:', healthError);
          apiAvailable = false;
        }

        if (apiAvailable) {
          try {
            // Fetch all Dubai businesses with a high limit to get comprehensive data
            const controller2 = new AbortController();
            const timeoutId2 = setTimeout(() => controller2.abort(), 15000); // 15 second timeout for large dataset

            const allDubaiUrl = `/api/scraped-businesses?city=Dubai&limit=500&page=1`;
            const response = await fetch(allDubaiUrl, {
              signal: controller2.signal
            });
            clearTimeout(timeoutId2);

            if (response.ok) {
              const result = await response.json();
              console.log(`Found ${result.businesses?.length || 0} total Dubai businesses`);

              if (result.success && result.businesses) {
                setAllDubaiBusinesses(result.businesses);
                setTotalAvailableBusinesses(result.total || result.businesses.length);
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
    if (categoryDataLoaded && cityDataLoaded && (country !== 'uae' || allDubaiDataLoaded)) {
      // Step 1: Start with category-specific businesses (highest priority)
      let combinedBusinesses = [...categoryBusinesses];

      // Step 2: Add city businesses that aren't already included
      const cityBusinessesToAdd = cityBusinesses.filter(
        (cityBusiness) => !combinedBusinesses.some(
          (existing) => existing.name === cityBusiness.name && existing.address === cityBusiness.address
        )
      );
      combinedBusinesses = [...combinedBusinesses, ...cityBusinessesToAdd];

      // Step 3: For UAE, add all Dubai businesses to ensure comprehensive listing
      if (country === 'uae' && allDubaiBusinesses.length > 0) {
        const dubaiBusinessesToAdd = allDubaiBusinesses.filter(
          (dubaiBusiness) => !combinedBusinesses.some(
            (existing) => existing.name === dubaiBusiness.name && existing.address === dubaiBusiness.address
          )
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
            business.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.scrapedCategory?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.services?.some((service) =>
              service.toLowerCase().includes(searchQuery.toLowerCase())
            )
          );
        });
      }

      // Apply pagination - show first 25 results initially
      const itemsPerPage = 25;
      const paginatedBusinesses = searchFilteredBusinesses.slice(0, itemsPerPage * currentPage);

      setFilteredBusinesses(paginatedBusinesses);
      setHasMoreData(searchFilteredBusinesses.length > paginatedBusinesses.length);
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
    setCurrentPage(prev => prev + 1);

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
        dubai: "Discover top-rated study abroad consultants in Dubai helping students secure admissions to world-class universities. Get expert guidance for US, UK, Canada, Australia & European education systems.",
        "abu dhabi": "Find experienced study abroad advisors in Abu Dhabi specializing in international university placements. Expert assistance for IELTS, TOEFL preparation and scholarship applications.",
        sharjah: "Connect with certified education consultants in Sharjah offering personalized study abroad services. Comprehensive support for visa processing and university applications.",
        default: "Find trusted study abroad consultants for international education guidance with proven success rates"
      },
      "immigration-consultants": {
        dubai: "Get professional immigration assistance in Dubai from licensed lawyers and certified consultants. Expert help with permanent residency, family reunification, and citizenship applications.",
        "abu dhabi": "Access experienced immigration lawyers in Abu Dhabi providing comprehensive legal services for visa applications, PR processes, and immigration appeals.",
        sharjah: "Find reliable immigration consultants in Sharjah offering affordable and efficient services for all types of immigration matters.",
        default: "Expert immigration lawyers and consultants for legal assistance and permanent residency applications"
      },
      "visa-consultants": {
        dubai: "Professional visa consultants in Dubai with high success rates for tourist, business, work, and family visas. Fast-track processing and documentation support available.",
        "abu dhabi": "Trusted visa service providers in Abu Dhabi offering comprehensive assistance for all visa categories with transparent pricing and quick turnaround times.",
        sharjah: "Experienced visa consultants in Sharjah specializing in visit visa, work permit, and family visa applications with excellent customer support.",
        default: "Professional visa consultants for all types of visa applications with guaranteed processing"
      },
      "work-permit": {
        dubai: "Specialized work permit consultants in Dubai helping professionals secure employment visas for UAE, Canada, Australia, and European countries with end-to-end support.",
        "abu dhabi": "Expert work permit advisors in Abu Dhabi providing comprehensive assistance for employment visa applications and job placement services.",
        default: "Specialized consultants for work permits and employment visas with industry expertise"
      },
      "visit-visa-specialists": {
        dubai: "Leading visit visa specialists in Dubai offering fast and reliable tourist visa services for popular destinations including US, UK, Schengen, and Asian countries.",
        "abu dhabi": "Professional visit visa consultants in Abu Dhabi providing hassle-free tourist visa processing with high approval rates and competitive pricing.",
        default: "Expert visit visa specialists for tourist and business visa applications worldwide"
      }
    };

    const descriptions = citySpecificDescriptions[categorySlug];
    if (descriptions) {
      const cityKey = cityName.toLowerCase().replace(/\s+/g, ' ');
      return descriptions[cityKey] || descriptions.default || descriptions[Object.keys(descriptions)[0]];
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
              {!isShowingNearbyData && categoryBusinesses.length > 0 && (cityName.toLowerCase() === 'abu dhabi' || cityName.toLowerCase() === 'abu-dhabi') && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-3 mb-3 max-w-2xl">
                  <div className="flex items-center gap-2 text-green-800 text-sm">
                    <Building className="h-4 w-4" />
                    <span className="font-medium">
                      Showing {categoryBusinesses.length} {categoryName.toLowerCase()} specifically from Abu Dhabi only
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
                      {country === 'uae' ? 'All Dubai' : `All ${cityName}`} Businesses
                    </p>
                    <p className="text-xl font-bold">
                      {country === 'uae' && allDubaiBusinesses.length > 0
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
                      {country === 'uae' ? 'Total Results' : 'Average Rating'}
                    </p>
                    <p className="text-xl font-bold">
                      {country === 'uae'
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
                        {filteredBusinesses.length > 0 && ` (${filteredBusinesses.length})`}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {categoryBusinesses.length > 0
                          ? `Find trusted ${categoryName.toLowerCase()} in ${cityName}`
                          : `All available businesses in ${cityName}`
                        }
                      </p>
                    </div>
                    <Badge variant="default" className="text-sm bg-blue-600">
                      {filteredBusinesses.length} results
                      {hasMoreData && ` (${debugInfo.totalBusinesses - filteredBusinesses.length} more)`}
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
                        switch (sortBy) {
                          case "rating":
                            return (b.rating || 0) - (a.rating || 0);
                          case "reviews":
                            return (
                              (b.reviewCount || 0) - (a.reviewCount || 0)
                            );
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
                    Showing {filteredBusinesses.length} of {debugInfo.totalBusinesses} businesses
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
                    <h4 className="font-semibold text-gray-900 pr-4">{faq.question}</h4>
                    <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
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
