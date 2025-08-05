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

  // Abu Dhabi areas
  "al ain": ["Abu Dhabi", "Dubai", "Sharjah"],

  // Other UAE cities fallback to main emirates
  "ajman": ["Dubai", "Sharjah", "Abu Dhabi"],
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

  // Check if we have nearby areas mapping
  if (nearbyAreasMapping[normalizedCity]) {
    return nearbyAreasMapping[normalizedCity];
  }

  // If no specific mapping, return main cities for the country
  if (country === 'uae') {
    return ["Dubai", "Abu Dhabi", "Sharjah"];
  } else {
    return ["Delhi", "Mumbai", "Bangalore", "Chennai"];
  }
};

export default function CityCategory() {
  const { city, category } = useParams<{ city: string; category: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if this is a UAE route
  const isUAERoute = location.pathname.startsWith("/uae/");
  const country = isUAERoute ? "uae" : "india";

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
        let apiAvailable = false;
        try {
          const healthCheck = await fetch('/api/health', { method: 'HEAD' });
          apiAvailable = healthCheck.ok;
        } catch (healthError) {
          console.log('API health check failed, API not available');
          apiAvailable = false;
        }

        let result = null;
        let isNearbyData = false;
        let nearbyCity = "";

        if (apiAvailable) {
          // Step 1: Try exact city + category combination from database
          try {
            let scrapedUrl = `/api/scraped-businesses?city=${encodeURIComponent(cityName)}&category=${encodeURIComponent(categoryName)}&limit=100`;
            let scrapedResponse = await fetch(scrapedUrl);

            if (scrapedResponse.ok) {
              result = await scrapedResponse.json();
              console.log("Primary database response:", result);
            } else {
              console.log(`API response not OK: ${scrapedResponse.status}`);
            }
          } catch (fetchError) {
            console.log("Failed to fetch from primary API:", fetchError);
          }
        } else {
          console.log("API not available, will use sample data fallback");
        }

        // Step 2: If no data found for specific area + category, try hierarchical fallback
        if (apiAvailable && (!result || !result.success || !result.businesses || result.businesses.length === 0)) {
          console.log(`No data found for ${cityName} + ${categoryName}, trying nearby cities from database`);

          const nearbyCities = getNearByCities(cityName, country);

          for (const nearbyCity_temp of nearbyCities) {
            try {
              console.log(`Trying nearby city: ${nearbyCity_temp} + ${categoryName}`);
              const nearbyUrl = `/api/scraped-businesses?city=${encodeURIComponent(nearbyCity_temp)}&category=${encodeURIComponent(categoryName)}&limit=100`;
              const nearbyResponse = await fetch(nearbyUrl);

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
        // Fetch all businesses for the city with higher limit
        const apiUrl = `/api/scraped-businesses?city=${encodeURIComponent(cityName)}&limit=1000`;
        const response = await fetch(apiUrl);

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
  }, [city, category, cityName, categoryName, navigate]);

  // Update filtered businesses when data loads
  useEffect(() => {
    if (categoryDataLoaded && cityDataLoaded) {
      // Combine category businesses (priority) with city businesses
      const combinedBusinesses = [...categoryBusinesses, ...cityBusinesses];

      // Remove duplicates
      const uniqueBusinesses = combinedBusinesses.filter(
        (business, index, arr) =>
          index ===
          arr.findIndex(
            (b) => b.name === business.name && b.address === business.address,
          ),
      );

      setFilteredBusinesses(uniqueBusinesses);
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
    categoryDataLoaded,
    cityDataLoaded,
    city,
    category,
    cityName,
    categoryName,
  ]);

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
    switch (categorySlug) {
      case "study-abroad":
        return "Find trusted study abroad consultants for international education guidance";
      case "immigration-consultants":
        return "Expert immigration lawyers and consultants for legal assistance";
      case "visa-consultants":
        return "Professional visa consultants for all types of visa applications";
      case "work-permit":
        return "Specialized consultants for work permits and employment visas";
      case "visa-services":
        return "Comprehensive visa documentation and processing services";
      case "immigration-services":
        return "Complete immigration services including PR and citizenship";
      case "overseas-services":
        return "Embassy services and overseas documentation assistance";
      case "education-services":
        return "Educational consultancy and admission guidance services";
      default:
        return "Find trusted consultants for your needs";
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

              {/* Show notification if displaying nearby cities data */}
              {isShowingNearbyData && categoryBusinesses.length > 0 && (
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-3 max-w-2xl">
                  <div className="flex items-center gap-2 text-blue-800 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">
                      No {categoryName.toLowerCase()} found specifically in {cityName}.
                      Showing {categoryBusinesses.length} results from nearby city: {" "}
                      <strong>{categoryBusinesses[0]?.nearbyCity || getNearByCities(cityName, country)[0]}</strong>
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
                      All {cityName} Businesses
                    </p>
                    <p className="text-xl font-bold">{cityBusinesses.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-blue-100">Average Rating</p>
                    <p className="text-xl font-bold">
                      {categoryBusinesses.length > 0
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
                  : `No businesses found`}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? `Try adjusting your search terms or browse all businesses in ${cityName}`
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
                {/* Category-specific results section */}
                {categoryBusinesses.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                          {categoryBusinesses.length} {categoryName} in{" "}
                          {cityName}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          Google Maps API results for{" "}
                          {categoryName.toLowerCase()}
                        </p>
                      </div>
                      <Badge variant="default" className="text-sm bg-green-600">
                        {categoryBusinesses.length} verified results
                      </Badge>
                    </div>

                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                          : "space-y-4 mb-8"
                      }
                    >
                      {categoryBusinesses
                        .filter((business) => {
                          if (!searchQuery) return true;
                          return (
                            business.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            business.description
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            business.services?.some((service) =>
                              service
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()),
                            )
                          );
                        })
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
                            key={`category-${business.id || index}`}
                            business={business}
                            viewMode={viewMode}
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* City businesses section */}
                {cityBusinesses.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                          {categoryBusinesses.length > 0 ? "All Other" : "All"}{" "}
                          Businesses in {cityName}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {categoryBusinesses.length > 0
                            ? `Additional businesses and services in ${cityName}`
                            : `All available businesses in ${cityName}`}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {cityBusinesses.length} listings
                      </Badge>
                    </div>

                    <div
                      className={
                        viewMode === "grid"
                          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                          : "space-y-4"
                      }
                    >
                      {cityBusinesses
                        .filter((business) => {
                          if (!searchQuery) return true;
                          return (
                            business.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            business.description
                              ?.toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            business.services?.some((service) =>
                              service
                                .toLowerCase()
                                .includes(searchQuery.toLowerCase()),
                            )
                          );
                        })
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
                            key={`city-${business.id || index}`}
                            business={business}
                            viewMode={viewMode}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>
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

      {/* Debug Popup */}
      <DebugPopup debugInfo={debugInfo} />
    </div>
  );
}
