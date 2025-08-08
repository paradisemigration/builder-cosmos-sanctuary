import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useBusinessData } from "@/hooks/useBusinessData";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Filter,
  MapPin,
  Building,
  Users,
  Loader2,
  ChevronDown,
  X,
} from "lucide-react";
import { Business, businessCategories } from "@/lib/data";
import { allIndianCities } from "@/lib/all-categories";

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "all",
  );
  const [selectedZone, setSelectedZone] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  // API filters for the useBusinessData hook
  const apiFilters = {
    search: searchQuery || undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    city: selectedCity !== "all" ? selectedCity : undefined,
    location: selectedZone !== "all" ? selectedZone : undefined,
    sortBy: sortBy,
    sortOrder: "desc",
    limit: 25,
  };

  // Use the proper API hook to get real business data
  const { businesses, loading, error, pagination, refetch, loadMore, hasMore } =
    useBusinessData(apiFilters);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedCity !== "all") params.set("city", selectedCity);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, selectedCity, setSearchParams]);

  // Handle search
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // Handle filter changes
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
  };

  const handleZoneChange = (value) => {
    setSelectedZone(value);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedCity("all");
    setSelectedZone("all");
    setSearchParams({});
  };

  // Get active filter count
  const activeFilters = [
    searchQuery,
    selectedCategory !== "all" ? selectedCategory : null,
    selectedCity !== "all" ? selectedCity : null,
    selectedZone !== "all" ? selectedZone : null,
  ].filter(Boolean).length;

  console.log("🔍 Browse page - Real data loaded:", {
    businessCount: businesses.length,
    totalRecords: pagination?.totalRecords,
    loading,
    error,
    filters: apiFilters,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Find Immigration Consultants
              </h1>
              <p className="mt-2 text-gray-600">
                {pagination?.totalRecords
                  ? `Search from ${pagination.totalRecords.toLocaleString()}+ real consultants in database...`
                  : "Search trusted immigration and visa consultants"}
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4" />
                <span>{businesses.length} businesses found</span>
              </div>
              {activeFilters > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  {activeFilters} filter{activeFilters !== 1 ? "s" : ""} active
                </Badge>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by business name, service, or location..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-12 text-base"
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="sm:w-[200px]">
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

              {/* City Filter */}
              <Select value={selectedCity} onValueChange={handleCityChange}>
                <SelectTrigger className="sm:w-[200px]">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {allIndianCities.slice(0, 20).map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Filter */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="sm:w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="reviews">Reviews</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {activeFilters > 0 && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <Alert className="mb-6">
            <AlertDescription>
              {error} - Showing available data.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && businesses.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        )}

        {/* Business Grid */}
        {businesses.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  className="h-full"
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <Button
                  onClick={loadMore}
                  disabled={loading}
                  size="lg"
                  className="px-8 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More Businesses"
                  )}
                </Button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && businesses.length === 0 && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <Building className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No businesses found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters to find more
                results.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {businesses.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600">
            Showing {businesses.length} of{" "}
            {pagination?.totalRecords || businesses.length} businesses
            {pagination?.total && pagination.total > businesses.length && (
              <span> (Load more to see all results)</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
