import { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Search, Filter, MapPin, Star, ChevronDown, Grid, List, SortAsc, 
  Users, Building, TrendingUp, ArrowLeft, Briefcase, GraduationCap,
  Globe, Award, Flag
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  allCities, 
  allIndianCities, 
  uaeCities, 
  allCategories, 
  getCategoryBySlug,
  getCitySlug,
  popularCombinations
} from "@/lib/all-categories";

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get category info
  const categoryInfo = useMemo(() => {
    if (!category) return null;
    return getCategoryBySlug(category);
  }, [category]);

  // Filter cities based on search and country selection
  const filteredCities = useMemo(() => {
    let cities = allCities;
    
    // Filter by country
    if (selectedCountry === "india") {
      cities = allIndianCities;
    } else if (selectedCountry === "uae") {
      cities = uaeCities;
    }
    
    // Filter by search
    if (searchQuery) {
      cities = cities.filter(city =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort cities
    cities.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.localeCompare(b);
        case "popular":
          // Put popular cities first
          const popularCities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Dubai", "Abu Dhabi"];
          const aIndex = popularCities.indexOf(a);
          const bIndex = popularCities.indexOf(b);
          if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;
          return a.localeCompare(b);
        default:
          return 0;
      }
    });
    
    return cities;
  }, [searchQuery, selectedCountry, sortBy]);

  // Fetch businesses for this category
  useEffect(() => {
    if (!categoryInfo) {
      navigate("/all-categories");
      return;
    }
    
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        // Try to fetch real data from API
        const response = await fetch(`/api/scraped-businesses?category=${encodeURIComponent(categoryInfo.name)}&limit=50`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.businesses) {
            setBusinesses(result.businesses);
          }
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
    
    // Set page title
    document.title = `${categoryInfo.name} - All Cities | VisaConsult India`;
  }, [categoryInfo, navigate]);

  const getCategoryIcon = (slug: string) => {
    if (slug.includes('student') || slug.includes('education') || slug.includes('study')) {
      return <GraduationCap className="w-6 h-6" />;
    } else if (slug.includes('work') || slug.includes('business')) {
      return <Briefcase className="w-6 h-6" />;
    } else if (slug.includes('golden') || slug.includes('pr') || slug.includes('citizenship')) {
      return <Award className="w-6 h-6" />;
    } else if (slug.includes('canada') || slug.includes('australia') || slug.includes('usa') || slug.includes('uk') || slug.includes('europe')) {
      return <Flag className="w-6 h-6" />;
    } else if (slug.includes('uae') || slug.includes('dubai')) {
      return <Globe className="w-6 h-6" />;
    }
    return <Building className="w-6 h-6" />;
  };

  const getCityUrl = (city: string) => `/business/${getCitySlug(city)}/${category}`;

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-20">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-600 mb-4">Category Not Found</h1>
              <p className="text-gray-500 mb-6">The category you're looking for doesn't exist.</p>
              <Button onClick={() => navigate("/all-categories")}>
                View All Categories
              </Button>
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
              <Link to="/all-categories" className="text-blue-100 hover:text-white">
                Categories
              </Link>
              <span>/</span>
              <span className="text-white font-medium">
                {categoryInfo.name}
              </span>
            </div>
          </nav>

          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/all-categories")}
              className="text-blue-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white/20 rounded-lg">
              {getCategoryIcon(categoryInfo.slug)}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {categoryInfo.name}
              </h1>
              <p className="text-blue-100 text-lg">
                {categoryInfo.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-blue-100">Available in</p>
                    <p className="text-xl font-bold">{allCities.length} Cities</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-blue-100">Total Consultants</p>
                    <p className="text-xl font-bold">{businesses.length || "50+"}</p>
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
                    <p className="text-xl font-bold">4.5+</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5" />
                  <div>
                    <p className="text-sm text-blue-100">Countries</p>
                    <p className="text-xl font-bold">India + UAE</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  <SelectItem value="india">India Only</SelectItem>
                  <SelectItem value="uae">UAE Only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="name">City Name A-Z</SelectItem>
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

      {/* Cities List */}
      <section className="py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              {categoryInfo.name} in {filteredCities.length} Cities
            </h2>
            <Badge variant="secondary" className="text-sm">
              {filteredCities.length} cities available
            </Badge>
          </div>

          {filteredCities.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Cities Found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery
                  ? `No cities found matching "${searchQuery}"`
                  : "No cities available for the selected filters"}
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCountry("all");
                  }}
                >
                  Clear Filters
                </Button>
                <Button onClick={() => navigate("/all-categories")}>
                  Browse Other Categories
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-3"
              }
            >
              {filteredCities.map((city) => {
                const isUAE = uaeCities.includes(city);
                const isPopular = popularCombinations.some(combo => 
                  combo.city === city && combo.category === categoryInfo.slug
                );
                
                return (
                  <Link
                    key={city}
                    to={getCityUrl(city)}
                    className={`block group ${
                      viewMode === "grid"
                        ? "p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                        : "p-4 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${isUAE ? 'bg-orange-100' : 'bg-blue-100'} group-hover:${isUAE ? 'bg-orange-200' : 'bg-blue-200'} transition-colors`}>
                        <MapPin className={`w-5 h-5 ${isUAE ? 'text-orange-600' : 'text-blue-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {categoryInfo.name} in {city}
                          </h3>
                          {isPopular && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Find {categoryInfo.name.toLowerCase()} in {city}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {isUAE ? 'UAE' : 'India'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            10+ consultants
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto max-w-6xl px-4">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Related Service Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allCategories
              .filter(cat => cat.slug !== categoryInfo.slug)
              .slice(0, 8)
              .map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="p-4 bg-white rounded-lg border hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      {getCategoryIcon(cat.slug)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm group-hover:text-purple-600 transition-colors">
                        {cat.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {allCities.length} cities
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
