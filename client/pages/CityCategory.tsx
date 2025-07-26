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
  getCitySlug
} from "@/lib/all-categories";

export default function CityCategory() {
  const { city, category } = useParams<{ city: string; category: string }>();
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Convert URL params to proper names
  const cityName = city ? city.charAt(0).toUpperCase() + city.slice(1).replace(/-/g, ' ') : "";
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

    // Filter businesses by city and category
    const filteredByCity = sampleBusinesses.filter(
      (business) => business.city.toLowerCase() === city.toLowerCase(),
    );

    const filteredByCityAndCategory = filteredByCity.filter(
      (business) => business.category === categoryName,
    );

    setBusinesses(filteredByCityAndCategory);
    setFilteredBusinesses(filteredByCityAndCategory);
    setLoading(false);

    // Set page title
    document.title = `${categoryName} in ${cityName} | VisaConsult India`;
  }, [city, category, cityName, categoryName, navigate]);

  useEffect(() => {
    let filtered = businesses;

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
  }, [businesses, searchQuery, sortBy]);

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
                    <p className="text-sm text-blue-100">Total Consultants</p>
                    <p className="text-xl font-bold">{businesses.length}</p>
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
                      {businesses.length > 0
                        ? (
                            businesses.reduce((sum, b) => sum + b.rating, 0) /
                            businesses.length
                          ).toFixed(1)
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-blue-100">Total Reviews</p>
                    <p className="text-xl font-bold">
                      {businesses.reduce((sum, b) => sum + b.reviewCount, 0)}
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
          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-16">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No {categoryName} Found in {cityName}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? `No results found for "${searchQuery}"`
                  : `We don't have any ${categoryName.toLowerCase()} listed in ${cityName} yet.`}
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/business/${city}`)}
                >
                  Browse All {cityName} Consultants
                </Button>
                <Button onClick={() => navigate("/add-business")}>
                  List Your Business
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {filteredBusinesses.length} {categoryName} in {cityName}
                </h2>
                <Badge variant="secondary" className="text-sm">
                  {filteredBusinesses.length} results
                </Badge>
              </div>

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
                    viewMode={viewMode}
                  />
                ))}
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
            {Object.entries(categoryMapping)
              .filter(([slug]) => slug !== category)
              .slice(0, 8)
              .map(([slug, name]) => (
                <Link
                  key={slug}
                  to={`/business/${city}/${slug}`}
                  className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(slug)}
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
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
    </div>
  );
}
