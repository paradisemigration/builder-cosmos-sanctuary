import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { BusinessCard } from "@/components/BusinessCard";
import { DebugPageInfo } from "@/components/DebugPageInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Filter,
  Building,
  Star,
  Users,
  TrendingUp,
  ArrowLeft,
  Search,
  CheckCircle,
} from "lucide-react";
import {
  businessCategories,
  indianCities,
  sampleBusinesses,
  type Business,
} from "@/lib/data";
import { useBusinessData } from "@/hooks/useBusinessData";
import { BusinessFilters } from "@/lib/api";

export default function CategoryLocationPage() {
  const { location, category } = useParams();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("rating");

  // Convert URL slugs back to display names
  const getDisplayName = (slug: string, type: "location" | "category") => {
    if (type === "location") {
      // Check Indian cities
      const cityMatch = indianCities.find(
        (city) =>
          city
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "") === slug,
      );

      if (cityMatch) {
        return cityMatch;
      }

      // Handle direct city names (e.g., "delhi" -> "Delhi")
      return slug.length > 2
        ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ")
        : slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    } else {
      // Handle category mapping with better matching
      const categoryMatch = businessCategories.find(
        (cat) =>
          cat
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "") === slug,
      );

      if (categoryMatch) {
        return categoryMatch;
      }

      // Convert plural URLs back to singular for category matching
      const singularSlug = slug.replace(/s$/, ""); // Remove trailing 's'
      const singularMatch = businessCategories.find(
        (cat) =>
          cat
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "") === singularSlug,
      );

      if (singularMatch) {
        return singularMatch;
      }

      // Handle common variations manually (both plural and singular)
      const categoryMap: { [key: string]: string } = {
        "visit-visa": "Visit Visa Specialists",
        "visit-visas": "Visit Visa Specialists",
        "work-visa": "Work Visa Consultants",
        "work-visas": "Work Visa Consultants",
        "study-visa": "Study Visa Services",
        "study-visas": "Study Visa Services",
        "pr-visa": "PR & Citizenship Services",
        "pr-visas": "PR & Citizenship Services",
        "citizenship-immigration": "PR & Citizenship Services",
        "citizenship-and-immigration": "PR & Citizenship Services",
        "visa-agent": "Visa Agent",
        "visa-agents": "Visa Agent",
        "immigration-consultant": "Immigration Consultants",
        "immigration-consultants": "Immigration Consultants",
        "visa-service": "Visa Services",
        "visa-services": "Visa Services",
        "visa-passport-service": "Visa & Passport Services",
        "visa-passport-services": "Visa & Passport Services",
        "document-clearing": "Document Clearing / Typing Centers",
        "typing-center": "Document Clearing / Typing Centers",
        "travel-agency": "Travel Agencies (Visa-related)",
        "travel-agencies": "Travel Agencies (Visa-related)",
        "family-visa": "Family Visa Services",
        "family-visas": "Family Visa Services",
        "business-setup": "Business Setup & Visa",
        "business-visa": "Business Setup & Visa",
      };

      return (
        categoryMap[slug] ||
        slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
      );
    }
  };

  const locationName = location ? getDisplayName(location, "location") : "";
  const categoryName = category ? getDisplayName(category, "category") : "";

  // API filters for business data
  const apiFilters: BusinessFilters = {
    category: categoryName || undefined,
    location: locationName || undefined,
    page: 1,
    limit: 50,
    sortBy: sortBy as "rating" | "name" | "date" | "reviews",
    sortOrder: "desc",
    verified: true, // Show only verified businesses for SEO pages
  };

  // Use business data hook (disabled auto-fetch for demo)
  const {
    businesses: apiBusinesses,
    loading: businessesLoading,
    error: businessesError,
    refetch,
  } = useBusinessData(apiFilters, false);

  // Use sample data as fallback when API fails
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    if (apiBusinesses.length > 0) {
      setFilteredBusinesses(apiBusinesses);
    } else {
      // Use sample data with client-side filtering
      let filtered = sampleBusinesses;

      if (categoryName && categoryName !== "all") {
        filtered = filtered.filter((business) =>
          business.category.toLowerCase().includes(categoryName.toLowerCase()),
        );
      }

      if (locationName && locationName !== "all") {
        filtered = filtered.filter(
          (business) =>
            business.city.toLowerCase().includes(locationName.toLowerCase()) ||
            business.address.toLowerCase().includes(locationName.toLowerCase()),
        );
      }

      setFilteredBusinesses(filtered);
    }
  }, [apiBusinesses, categoryName, locationName]);

  // Generate dynamic page title
  const generatePageTitle = () => {
    const websiteTitle = "TrustedImmigration";
    let title = "";

    if (category && location) {
      // Best Study Visa Consultant in Dubai - TrustedImmigration
      title = `Best ${categoryName} Consultant in ${locationName} - ${websiteTitle}`;
    } else if (category) {
      // Best Study Visa Services - TrustedImmigration
      title = `Best ${categoryName} Services - ${websiteTitle}`;
    } else if (location) {
      // Immigration Services in Dubai - TrustedImmigration
      title = `Immigration Services in ${locationName} - ${websiteTitle}`;
    } else {
      // Immigration Services Directory - TrustedImmigration
      title = `Immigration Services Directory - ${websiteTitle}`;
    }

    return title;
  };

  // Generate dynamic meta description
  const generateMetaDescription = () => {
    if (category && location) {
      return `Find the best ${categoryName.toLowerCase()} consultants in ${locationName}. Compare verified ${categoryName.toLowerCase()} service providers with reviews, ratings, and contact details. Get expert immigration assistance today.`;
    } else if (category) {
      return `Discover top-rated ${categoryName.toLowerCase()} services across Dubai and UAE. Compare verified providers offering professional ${categoryName.toLowerCase()} assistance with competitive rates.`;
    } else if (location) {
      return `Find trusted immigration services in ${locationName}. Browse verified visa consultants, document clearing services, and immigration experts in your area.`;
    } else {
      return "Dubai's largest directory of verified immigration services. Find trusted visa consultants, document clearing, and immigration experts across UAE.";
    }
  };

  // Set page title and meta description
  useEffect(() => {
    const title = generatePageTitle();
    const description = generateMetaDescription();

    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", description);

    // Cleanup: Reset title when component unmounts
    return () => {
      document.title = "TrustedImmigration - Dubai's #1 Immigration Directory";
      const defaultDescription =
        "Dubai's largest directory of verified immigration services. Find trusted visa consultants, document clearing, and immigration experts.";
      if (metaDescription) {
        metaDescription.setAttribute("content", defaultDescription);
      }
    };
  }, [location, category, locationName, categoryName]);

  useEffect(() => {
    let filtered = sampleBusinesses;

    // Filter by category
    if (category) {
      const categoryDisplay = getDisplayName(category, "category");
      filtered = filtered.filter(
        (business) =>
          business.category.toLowerCase() === categoryDisplay.toLowerCase(),
      );
    }

    // Filter by location (basic matching for demo)
    if (location) {
      const locationDisplay = getDisplayName(location, "location");
      filtered = filtered.filter(
        (business) =>
          business.address
            .toLowerCase()
            .includes(locationDisplay.toLowerCase()) ||
          business.zone?.toLowerCase() === locationDisplay.toLowerCase(),
      );
    }

    // Sort businesses
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredBusinesses(filtered);
  }, [location, category, sortBy]);

  const handleBackToSearch = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-purple-50/20">
      <Navigation />

      {/* Header Section */}
      <div className="bg-gradient-to-br from-orange-900 via-purple-900 to-orange-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-orange-200 text-sm">
              <button
                onClick={handleBackToSearch}
                className="hover:text-white transition-colors"
              >
                Home
              </button>
              {location && (
                <>
                  <span>/</span>
                  <span className="text-white font-medium">{locationName}</span>
                </>
              )}
              {category && (
                <>
                  <span>/</span>
                  <span className="text-white font-medium">{categoryName}</span>
                </>
              )}
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                {category && location ? (
                  <>
                    <span className="bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
                      {categoryName}
                    </span>
                    <br />
                    <span className="text-white">in {locationName}</span>
                  </>
                ) : category ? (
                  <span className="bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
                    {categoryName} Services
                  </span>
                ) : location ? (
                  <>
                    <span className="text-white">Services in</span>
                    <br />
                    <span className="bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
                      {locationName}
                    </span>
                  </>
                ) : (
                  <span className="text-white">Immigration Services</span>
                )}
              </h1>

              <p className="text-xl text-orange-100 max-w-3xl mx-auto">
                {filteredBusinesses.length > 0
                  ? `Found ${filteredBusinesses.length} verified ${category ? categoryName.toLowerCase() : "immigration"} ${category ? "service providers" : "services"} ${location ? `in ${locationName}` : ""}`
                  : `No ${category ? categoryName.toLowerCase() : "immigration"} services found ${location ? `in ${locationName}` : ""}`}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-center mb-2">
                  <Building className="w-6 h-6 text-orange-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {filteredBusinesses.length}
                </div>
                <div className="text-xs text-orange-200">Businesses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {filteredBusinesses.filter((b) => b.isVerified).length}
                </div>
                <div className="text-xs text-orange-200">Verified</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {filteredBusinesses.length > 0
                    ? (
                        filteredBusinesses.reduce(
                          (acc, b) => acc + b.rating,
                          0,
                        ) / filteredBusinesses.length
                      ).toFixed(1)
                    : "0.0"}
                </div>
                <div className="text-xs text-orange-200">Avg Rating</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">
                  {filteredBusinesses.reduce(
                    (acc, b) => acc + b.reviewCount,
                    0,
                  )}
                </div>
                <div className="text-xs text-orange-200">Reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={handleBackToSearch}
            className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="name">Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {filteredBusinesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  No businesses found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  We couldn't find any{" "}
                  {category ? categoryName.toLowerCase() : "immigration"}{" "}
                  services
                  {location ? ` in ${locationName}` : ""}. Try adjusting your
                  search criteria.
                </p>
                <Button onClick={handleBackToSearch} className="mt-4">
                  Try Different Search
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SEO Content */}
        {filteredBusinesses.length > 0 && (
          <div className="mt-16 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">
                  About {category ? categoryName : "Immigration"} Services
                  {location ? ` in ${locationName}` : ""}
                </CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {category && location
                    ? `Find the best ${categoryName.toLowerCase()} services in ${locationName}. Our verified directory includes ${filteredBusinesses.length} trusted providers offering professional ${categoryName.toLowerCase()} assistance with competitive rates and proven track records.`
                    : category
                      ? `Discover top-rated ${categoryName.toLowerCase()} service providers across Dubai and UAE. Compare ${filteredBusinesses.length} verified businesses offering professional ${categoryName.toLowerCase()} assistance.`
                      : location
                        ? `Explore ${filteredBusinesses.length} verified immigration service providers in ${locationName}. From visa processing to document clearing, find trusted professionals in your area.`
                        : "Browse our comprehensive directory of verified immigration service providers across Dubai and UAE."}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Debug Info - Remove before production */}
      <DebugPageInfo />
    </div>
  );
}
