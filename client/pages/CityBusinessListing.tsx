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
  generateCityMeta,
  setPageMeta,
  setSEOLinks,
  setBreadcrumbStructuredData,
} from "@/lib/meta-utils";

export default function CityBusinessListing() {
  const { city } = useParams<{ city: string }>();
  const navigate = useNavigate();

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
  const ITEMS_PER_PAGE = 50;

  // Convert URL param back to proper city name
  const cityName = city
    ? city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
    : "";

  // Function to fetch businesses from API
  const fetchBusinesses = async (page = 1, resetList = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      console.log(`Fetching businesses for city: "${cityName}", page: ${page}`);

      // First try to fetch from database/API
      const response = await fetch(
        `/api/scraped-businesses?city=${encodeURIComponent(cityName)}&page=${page}&limit=${ITEMS_PER_PAGE}`
      );

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.businesses) {
          const newBusinesses = result.businesses;

          if (resetList || page === 1) {
            setBusinesses(newBusinesses);
            setFilteredBusinesses(newBusinesses);
          } else {
            // Append to existing list for load more
            setBusinesses(prev => [...prev, ...newBusinesses]);
            setFilteredBusinesses(prev => [...prev, ...newBusinesses]);
          }

          setTotalBusinesses(result.total || newBusinesses.length);
          setTotalPages(result.totalPages || Math.ceil((result.total || newBusinesses.length) / ITEMS_PER_PAGE));
          setHasMore(page < (result.totalPages || 1));

          setLoading(false);
          setLoadingMore(false);
          return;
        }
      }

      // Fallback to sample data if API fails
      console.log('API failed, using sample data');
      const cityBusinesses = sampleBusinesses.filter(
        (business) => business.city.toLowerCase() === (city?.toLowerCase() || ''),
      );

      if (resetList || page === 1) {
        setBusinesses(cityBusinesses);
        setFilteredBusinesses(cityBusinesses);
      }

      setTotalBusinesses(cityBusinesses.length);
      setTotalPages(Math.ceil(cityBusinesses.length / ITEMS_PER_PAGE));
      setHasMore(false);

    } catch (error) {
      console.error('Error fetching businesses:', error);

      // Fallback to sample data on error
      const cityBusinesses = sampleBusinesses.filter(
        (business) => business.city.toLowerCase() === (city?.toLowerCase() || ''),
      );

      if (resetList || page === 1) {
        setBusinesses(cityBusinesses);
        setFilteredBusinesses(cityBusinesses);
      }

      setTotalBusinesses(cityBusinesses.length);
      setTotalPages(Math.ceil(cityBusinesses.length / ITEMS_PER_PAGE));
      setHasMore(false);
    }

    setLoading(false);
    setLoadingMore(false);
  };

  useEffect(() => {
    // Validate city exists
    if (
      !city ||
      !indianCities.some((c) => c.toLowerCase() === city.toLowerCase())
    ) {
      navigate("/business");
      return;
    }

    // Reset pagination when city changes
    setCurrentPage(1);
    setBusinesses([]);
    setFilteredBusinesses([]);

    // Fetch businesses from API
    fetchBusinesses(1, true);

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
        return "⚖️";
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
      <section className="pt-24 pb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/business")}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              All Cities
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Visa Consultants in {cityName}
            </h1>
            <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
              Find trusted and verified visa consultants in {cityName}. Compare
              services, read reviews, and choose the best expert for your visa
              needs.
            </p>

            {/* City Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {cityStats.totalConsultants}
                </div>
                <div className="text-sm text-blue-100">Total Consultants</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">
                  {cityStats.averageRating}★
                </div>
                <div className="text-sm text-blue-100">Average Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{cityStats.categories}</div>
                <div className="text-sm text-blue-100">Service Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-2xl font-bold">{cityStats.topRated}</div>
                <div className="text-sm text-blue-100">Top Rated (4.5+)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-6 bg-white shadow-sm">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={`Search consultants in ${cityName}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full lg:w-64">
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
                Showing {filteredBusinesses.length} of {totalBusinesses} results for {cityName}
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
                        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                      {loadingMore ? 'Loading...' : `Load More (${Math.min(ITEMS_PER_PAGE, totalBusinesses - filteredBusinesses.length)} more)`}
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
    </div>
  );
}
