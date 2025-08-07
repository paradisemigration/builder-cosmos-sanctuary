import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useBusinessData } from "@/hooks/useBusinessData";
import { BusinessCard } from "@/components/BusinessCard";
import { SEOHead } from "@/components/SEOHead";
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
  MapPin,
  Building,
  Users,
  Star,
  Grid,
  List,
  ChevronLeft,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { businessCategories, allIndianCities } from "@/lib/data";

export default function CityBusinessListing() {
  const { city } = useParams();
  const navigate = useNavigate();

  console.log("🏙️ CityBusinessListing loaded for city:", city);

  // Convert URL-safe city name back to display name
  const cityName = city ? city.replace(/-/g, " ") : "";
  const displayCityName = cityName
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Fetch businesses for this city
  const { businesses, loading, error, pagination } = useBusinessData({
    city: cityName,
    limit: 24,
  });

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // Filter businesses based on search and category
  const filteredBusinesses = businesses?.filter(business => {
    const matchesSearch = !searchQuery || 
      business.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.services?.some(service => 
        service.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesCategory = selectedCategory === "all" || 
      business.category?.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  }) || [];

  console.log("📊 Business filtering:", {
    totalBusinesses: businesses?.length,
    filteredCount: filteredBusinesses.length,
    searchQuery,
    selectedCategory,
    cityName
  });

  // Handle search
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // Handle category change
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertDescription>
              Error loading businesses: {error}. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title={`Immigration Consultants in ${displayCityName} | Visa Services`}
        description={`Find verified immigration and visa consultants in ${displayCityName}. Expert services for study abroad, work visa, tourist visa and more.`}
        keywords={`immigration consultants ${displayCityName}, visa services ${displayCityName}, study abroad ${displayCityName}`}
      />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
          
          <div className="flex items-center mb-6">
            <MapPin className="h-8 w-8 mr-3" />
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Immigration Consultants in {displayCityName}
              </h1>
              <p className="text-lg text-blue-100 mt-2">
                {filteredBusinesses.length} verified consultants found
              </p>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search consultants or services..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 bg-white text-gray-900"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="bg-white text-gray-900">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {businessCategories.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredBusinesses.length} Consultants Found
            </h2>
            {(searchQuery || selectedCategory !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Business Grid/List */}
        {filteredBusinesses.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                className={viewMode === "list" ? "flex flex-row" : ""}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No consultants found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all consultants.
            </p>
            <Button onClick={() => navigate("/browse")}>
              Browse All Consultants
            </Button>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={pagination.page === i + 1 ? "default" : "outline"}
                  onClick={() => {
                    // Handle pagination if needed
                  }}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
