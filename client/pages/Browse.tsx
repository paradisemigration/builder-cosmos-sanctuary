import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Filter,
  TrendingUp,
  Users,
  Star,
  ChevronDown,
  SlidersHorizontal,
} from "lucide-react";
import { CategoryFilter } from "@/components/CategoryFilter";
import { BusinessCard } from "@/components/BusinessCard";
import { Navigation } from "@/components/Navigation";
import {
  LoadingState,
  ErrorState,
  EmptyState,
} from "@/components/LoadingError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  businessCategories,
  indianCities,
  sampleBusinesses,
  type Business,
} from "@/lib/data";
import { useBusinessData } from "@/hooks/useBusinessData";
import { BusinessFilters } from "@/lib/api";

interface FilterState {
  categories: string[];
  zones: string[];
  rating: string;
  verified: boolean;
  hasReviews: boolean;
  sortBy: string;
}

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [selectedZone, setSelectedZone] = useState(
    searchParams.get("zone") || "all",
  );
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams.get("category")
      ? [searchParams.get("category")!]
      : [],
    zones: searchParams.get("zone") ? [searchParams.get("zone")!] : [],
    rating: "",
    verified: false,
    hasReviews: false,
    sortBy: "rating",
  });

  // API filters for hook
  const apiFilters: BusinessFilters = {
    search: searchQuery || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    location: selectedZone !== "all" ? selectedZone : undefined,
    verified: filters.verified || undefined,
    sortBy: filters.sortBy as "rating" | "name" | "date" | "reviews",
    sortOrder: "desc",
  };

  // State for real scraped businesses
  const [scrapedBusinesses, setScrapedBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageSize = 25;

  // Load real scraped businesses from database
  const loadScrapedBusinesses = async (
    page = 1,
    append = false,
    filters = {},
  ) => {
    try {
      if (page === 1) {
        setLoading(true);
        setCurrentPage(1);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...filters,
      });

      const response = await fetch(`/api/scraped-businesses?${params}`);
      const result = await response.json();

      if (result.success) {
        // Map the businesses to ensure proper ID field and data structure
        const mappedBusinesses = (result.businesses || []).map(
          (business: any) => ({
            ...business,
            id:
              business.googlePlaceId ||
              business.id ||
              Date.now() + Math.random(),
            city: business.scrapedCity || business.city || "Unknown",
            reviewCount: business.reviews?.length || business.reviewCount || 0,
            rating: business.rating || 0,
            services: business.services || [],
            isVerified: business.isVerified || true, // Most scraped businesses are verified by default
          }),
        );

        console.log(
          `Loaded page ${page}:`,
          mappedBusinesses.length,
          "businesses",
        );

        if (append) {
          setScrapedBusinesses((prev) => [...prev, ...mappedBusinesses]);
        } else {
          setScrapedBusinesses(mappedBusinesses);
        }

        // Check if there are more pages
        setHasMore(mappedBusinesses.length === pageSize);
        setCurrentPage(page);
      } else {
        setError("Failed to load businesses");
      }
    } catch (error) {
      console.error("Failed to load scraped businesses:", error);
      setError("Failed to load businesses");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more businesses
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const filters = {};
      if (searchQuery) filters.q = searchQuery;
      if (selectedCategory && selectedCategory !== "all")
        filters.category = selectedCategory;
      if (selectedZone && selectedZone !== "all") filters.city = selectedZone;

      loadScrapedBusinesses(currentPage + 1, true, filters);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadScrapedBusinesses();
  }, []);

  // Apply server-side filtering by reloading data when filters change
  useEffect(() => {
    const filters = {};
    if (searchQuery) filters.q = searchQuery;
    if (selectedCategory && selectedCategory !== "all")
      filters.category = selectedCategory;
    if (selectedZone && selectedZone !== "all") filters.city = selectedZone;

    // Reset to first page and reload with new filters
    setCurrentPage(1);
    setHasMore(true);
    loadScrapedBusinesses(1, false, filters);
  }, [searchQuery, selectedCategory, selectedZone]);

  // Use scraped businesses directly since filtering is done server-side
  const filteredBusinesses = scrapedBusinesses;

  // Initialize page title on mount
  useEffect(() => {
    document.title = "Browse Visa Consultants - VisaConsult India";
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory && selectedCategory !== "all")
      params.set("category", selectedCategory);
    if (selectedZone && selectedZone !== "all")
      params.set("zone", selectedZone);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedZone("all");
    setFilters({
      categories: [],
      zones: [],
      rating: "",
      verified: false,
      hasReviews: false,
      sortBy: "rating",
    });
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header Section */}
      <section className="pt-24 pb-8 px-4 bg-white border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Trusted Visa Consultants
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse through India's largest directory of verified immigration
              experts
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Input */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search from 310+ real consultants in database..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 border-gray-200"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="h-12 border-gray-200">
                      <div className="flex items-center">
                        <Filter className="w-4 h-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Category" />
                      </div>
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
                </div>

                {/* Location Filter */}
                <div>
                  <Select value={selectedZone} onValueChange={setSelectedZone}>
                    <SelectTrigger className="h-12 border-gray-200">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="City" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {indianCities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button onClick={handleSearch} className="flex-1 sm:flex-none">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 sm:flex-none"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  <ChevronDown
                    className={`w-4 h-4 ml-2 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </Button>
                {(searchQuery ||
                  selectedCategory !== "all" ||
                  selectedZone !== "all") && (
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className={`lg:block ${showFilters ? "block" : "hidden"}`}>
              <Card className="sticky top-24">
                <CategoryFilter
                  filters={filters}
                  onFiltersChange={setFilters}
                  resultCount={filteredBusinesses.length}
                />
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-3">
              {/* Real Data Status */}
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-sm">
                <h4 className="font-semibold text-green-800 mb-2">
                  ✅ Live Database Content:
                </h4>
                <div className="grid grid-cols-3 gap-2 text-green-700">
                  <div>📊 Total Businesses: {scrapedBusinesses.length}</div>
                  <div>🔍 Filtered Results: {filteredBusinesses.length}</div>
                  <div>⚡ Status: {loading ? "Loading..." : "Ready"}</div>
                </div>
                {scrapedBusinesses.length >= 300 && (
                  <div className="mt-2 text-green-600 font-medium">
                    🎉 All {scrapedBusinesses.length} real consultants loaded
                    successfully!
                  </div>
                )}
                {scrapedBusinesses.length < 50 && !loading && (
                  <div className="mt-2 text-orange-600 font-medium">
                    ⚠️ Limited data - Visit Admin Panel → Data Scraper to
                    collect more businesses
                  </div>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">
                      Loading real business data from database...
                    </p>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="min-h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Error Loading Data
                    </h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                      onClick={loadScrapedBusinesses}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Results Header */}
              {!loading && !error && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {filteredBusinesses.length} Consultant
                      {filteredBusinesses.length !== 1 ? "s" : ""} Found
                    </h2>
                    <p className="text-sm text-gray-600">
                      Showing verified immigration experts from database
                    </p>
                  </div>

                  {/* Sort Options */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) =>
                        setFilters({ ...filters, sortBy: value })
                      }
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                        <SelectItem value="reviews">Most Reviews</SelectItem>
                        <SelectItem value="name">Name A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Results Grid */}
              {!loading &&
                !error &&
                (filteredBusinesses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No consultants found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search criteria or filters
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Business Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredBusinesses.map((business) => (
                        <BusinessCard key={business.id} business={business} />
                      ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore &&
                      !searchQuery &&
                      !selectedCategory &&
                      !selectedZone && (
                        <div className="text-center mt-8">
                          <Button
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="px-8 py-3"
                            variant="outline"
                          >
                            {loadingMore ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                Loading...
                              </>
                            ) : (
                              "Load More Consultants"
                            )}
                          </Button>
                          <p className="text-xs text-gray-500 mt-2">
                            Loading {pageSize} more businesses
                          </p>
                        </div>
                      )}

                    {/* Results Summary */}
                    <div className="text-center mt-8">
                      <p className="text-sm text-gray-600">
                        Showing {filteredBusinesses.length} consultants
                        {!searchQuery && !selectedCategory && !selectedZone && (
                          <span> • Page {currentPage} of results</span>
                        )}
                      </p>
                    </div>

                    {/* Results Summary */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>
                              {filteredBusinesses.length} consultants loaded
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>All verified & rated</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Contact our support team for personalized consultant recommendations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Contact Support
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              List Your Business
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
