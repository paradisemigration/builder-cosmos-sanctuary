import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBusinessData } from "@/hooks/useBusinessData";
import { BusinessCard } from "@/components/BusinessCard";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  MapPin,
  Building,
  Star,
  Grid,
  List,
  ChevronLeft,
  Filter,
} from "lucide-react";
import { businessCategories } from "@/lib/data";

export default function CityCategory() {
  const { city, category } = useParams();
  const navigate = useNavigate();

  console.log("🏷️ CityCategory loaded:", { city, category });

  // Convert URL-safe names back to display names
  const cityName = city ? city.replace(/-/g, " ") : "";
  const displayCityName = cityName
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // Find category info
  const categoryInfo = businessCategories.find(cat => cat.slug === category);
  const categoryDisplayName = categoryInfo?.name || category?.replace(/-/g, " ") || "";

  // Fetch businesses for this city and category
  const { businesses, loading, error, pagination } = useBusinessData({
    city: cityName,
    category: category,
    limit: 24,
  });

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // Filter businesses based on search
  const filteredBusinesses = businesses?.filter(business => {
    return !searchQuery || 
      business.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.services?.some(service => 
        service.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }) || [];

  console.log("📊 CityCategory filtering:", {
    totalBusinesses: businesses?.length,
    filteredCount: filteredBusinesses.length,
    searchQuery,
    cityName,
    category
  });

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
        title={`${categoryDisplayName} in ${displayCityName} | Immigration Services`}
        description={`Find verified ${categoryDisplayName.toLowerCase()} in ${displayCityName}. Expert immigration and visa services.`}
        keywords={`${categoryDisplayName} ${displayCityName}, immigration services ${displayCityName}, visa consultants ${displayCityName}`}
      />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate(`/business/${city}`)}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to {displayCityName}
            </Button>
          </div>
          
          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <Building className="h-8 w-8 mr-3" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {categoryDisplayName} in {displayCityName}
                </h1>
                <p className="text-lg text-blue-100 mt-2">
                  {filteredBusinesses.length} verified consultants found
                </p>
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center text-blue-200 text-sm mb-6">
            <span>Home</span>
            <span className="mx-2">/</span>
            <span>{displayCityName}</span>
            <span className="mx-2">/</span>
            <span className="text-white">{categoryDisplayName}</span>
          </div>

          {/* Search Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search within this category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white text-gray-900"
              />
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
              {filteredBusinesses.length} {categoryDisplayName} Found
            </h2>
            {searchQuery && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
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

        {/* Category Description */}
        {categoryInfo && (
          <div className="bg-white rounded-lg p-6 mb-6 border">
            <h3 className="text-lg font-semibold mb-2">{categoryInfo.name}</h3>
            <p className="text-gray-600">{categoryInfo.description}</p>
          </div>
        )}

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
              No {categoryDisplayName.toLowerCase()} found in {displayCityName}
            </h3>
            <p className="text-gray-600 mb-4">
              Try browsing all consultants in this city or explore other categories.
            </p>
            <div className="space-x-4">
              <Button onClick={() => navigate(`/business/${city}`)}>
                Browse All in {displayCityName}
              </Button>
              <Button variant="outline" onClick={() => navigate("/browse")}>
                Browse All Consultants
              </Button>
            </div>
          </div>
        )}

        {/* Related Categories */}
        {categoryInfo && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">Related Services in {displayCityName}</h3>
            <div className="flex flex-wrap gap-2">
              {businessCategories
                .filter(cat => cat.slug !== category)
                .slice(0, 6)
                .map(cat => (
                  <Badge 
                    key={cat.slug} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => navigate(`/business/${city}/${cat.slug}`)}
                  >
                    {cat.name}
                  </Badge>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
