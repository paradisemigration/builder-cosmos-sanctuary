import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
} from "@/lib/all-categories";
import {
  generateCityCategoryMeta,
  setPageMeta,
  setSEOLinks,
  setBreadcrumbStructuredData,
  setCityServiceStructuredData,
} from "@/lib/meta-utils";
import { DebugPopup } from "@/components/DebugPopup";

export default function CityCategory() {
  const { city, category } = useParams<{ city: string; category: string }>();
  const navigate = useNavigate();

  const [categoryBusinesses, setCategoryBusinesses] = useState<Business[]>([]);
  const [cityBusinesses, setCityBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categoryDataLoaded, setCategoryDataLoaded] = useState(false);
  const [cityDataLoaded, setCityDataLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    categoryBusinesses: 0,
    cityBusinesses: 0,
    totalBusinesses: 0,
    apiCalls: [] as Array<{url: string; status: string; count: number; timestamp: string}>,
    metaData: { title: '', description: '', keywords: '' },
    searchParams: { city: '', category: '', cityName: '', categoryName: '' }
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
        // First try to fetch from Google Maps API via our backend
        const response = await fetch(
          `/api/google-maps-businesses?city=${encodeURIComponent(cityName)}&category=${encodeURIComponent(categoryName)}&limit=20`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const result = await response.json();
          if (
            result.success &&
            result.businesses &&
            result.businesses.length > 0
          ) {
            setCategoryBusinesses(result.businesses);
            setCategoryDataLoaded(true);
            return;
          }
        }

        // If Google Maps API fails, try scraped data with higher limit
        const scrapedUrl = `/api/scraped-businesses?city=${encodeURIComponent(cityName)}&category=${encodeURIComponent(categoryName)}&limit=500`;
        const scrapedResponse = await fetch(scrapedUrl);
        const scrapedTimestamp = new Date().toLocaleTimeString();

        if (scrapedResponse.ok) {
          const scrapedResult = await scrapedResponse.json();

          // Update debug info
          setDebugInfo(prev => ({
            ...prev,
            apiCalls: [...prev.apiCalls, {
              url: scrapedUrl,
              status: 'success',
              count: scrapedResult.businesses?.length || 0,
              timestamp: scrapedTimestamp
            }]
          }));

          if (
            scrapedResult.success &&
            scrapedResult.businesses &&
            scrapedResult.businesses.length > 0
          ) {
            setCategoryBusinesses(scrapedResult.businesses);
            setCategoryDataLoaded(true);
            return;
          }
        } else {
          // Update debug info for failed call
          setDebugInfo(prev => ({
            ...prev,
            apiCalls: [...prev.apiCalls, {
              url: scrapedUrl,
              status: 'failed',
              count: 0,
              timestamp: scrapedTimestamp
            }]
          }));
        }

        // No category-specific data found
        setCategoryDataLoaded(true);
      } catch (error) {
        console.error("Error fetching category businesses:", error);
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
          setDebugInfo(prev => ({
            ...prev,
            apiCalls: [...prev.apiCalls, {
              url: apiUrl,
              status: 'success',
              count: result.businesses?.length || 0,
              timestamp
            }]
          }));

          if (result.success && result.businesses) {
            setCityBusinesses(result.businesses);
          }
        } else {
          // Update debug info for failed call
          setDebugInfo(prev => ({
            ...prev,
            apiCalls: [...prev.apiCalls, {
              url: apiUrl,
              status: 'failed',
              count: 0,
              timestamp
            }]
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
      setDebugInfo(prev => ({
        ...prev,
        categoryBusinesses: categoryBusinesses.length,
        cityBusinesses: cityBusinesses.length,
        totalBusinesses: uniqueBusinesses.length,
        metaData: {
          title: metaData.title,
          description: metaData.description,
          keywords: metaData.keywords
        },
        searchParams: {
          city: city || '',
          category: category || '',
          cityName,
          categoryName
        }
      }));
    }
  }, [categoryBusinesses, cityBusinesses, categoryDataLoaded, cityDataLoaded, city, category, cityName, categoryName]);

  useEffect(() => {
    // Combine category businesses (first) with city businesses (second)
    const allBusinesses = [...categoryBusinesses, ...cityBusinesses];

    // Remove duplicates
    const uniqueBusinesses = allBusinesses.filter(
      (business, index, arr) =>
        index ===
        arr.findIndex(
          (b) => b.name === business.name && b.address === business.address,
        ),
    );

    let filtered = uniqueBusinesses;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (business) =>
          business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          business.services.some((service) =>
            service.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Sort
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
  }, [categoryBusinesses, cityBusinesses, searchQuery, sortBy]);

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
