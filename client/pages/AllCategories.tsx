import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Building, MapPin, Users, TrendingUp, Filter, Grid, List, Star } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { allCategories, allCities, allIndianCities, uaeCities, popularCombinations } from "@/lib/all-categories";

export default function AllCategories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("all");

  // Filter categories based on search and filters
  const filteredCategories = useMemo(() => {
    let filtered = allCategories;

    if (searchQuery) {
      filtered = filtered.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [searchQuery]);

  // Group categories by type
  const categoryGroups = useMemo(() => {
    return {
      core: allCategories.slice(0, 12),
      specialized: allCategories.slice(12, 24),
      uae: allCategories.slice(24, 36),
      additional: allCategories.slice(36, 48)
    };
  }, []);

  const getCategoryUrl = (slug: string) => `/category/${slug}`;
  const getCityCategoryUrl = (city: string, slug: string) =>
    `/business/${city.toLowerCase().replace(/\s+/g, '-')}/${slug}`;

  const getCategoryIcon = (slug: string) => {
    if (slug.includes('student') || slug.includes('education') || slug.includes('study')) {
      return "🎓";
    } else if (slug.includes('work') || slug.includes('business')) {
      return "💼";
    } else if (slug.includes('family') || slug.includes('visit')) {
      return "👨‍👩‍👧‍👦";
    } else if (slug.includes('golden') || slug.includes('pr') || slug.includes('citizenship')) {
      return "🏆";
    } else if (slug.includes('canada')) {
      return "🇨🇦";
    } else if (slug.includes('australia')) {
      return "🇦🇺";
    } else if (slug.includes('usa')) {
      return "🇺🇸";
    } else if (slug.includes('uk')) {
      return "🇬🇧";
    } else if (slug.includes('europe')) {
      return "🇪🇺";
    } else if (slug.includes('uae') || slug.includes('dubai') || slug.includes('emirates')) {
      return "🇦🇪";
    }
    return "🏛️";
  };

  const renderCategoryCard = (category: any) => (
    <Card 
      key={category.slug} 
      className="hover:shadow-lg transition-all duration-200 group border-2 hover:border-blue-300"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="text-2xl">
            {getCategoryIcon(category.slug)}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors mb-1">
              {category.name}
            </CardTitle>
            <p className="text-sm text-gray-600 line-clamp-2">
              {category.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{allCities.length} cities</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>50+ consultants</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>4.5+ rated</span>
          </div>
        </div>

        <div className="space-y-2">
          <Link to={getCategoryUrl(category.slug)}>
            <Button className="w-full" variant="outline">
              View All {category.name}
            </Button>
          </Link>
          
          <div className="text-xs text-gray-500">
            <p className="mb-1">Popular in:</p>
            <div className="flex flex-wrap gap-1">
              {["Delhi", "Mumbai", "Dubai"].map((city) => (
                <Link
                  key={city}
                  to={getCityCategoryUrl(city, category.slug)}
                  className="px-2 py-1 bg-gray-100 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  {city}
                </Link>
              ))}
              <span className="px-2 py-1 text-gray-400">+{allCities.length - 3} more</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              All {allCategories.length} Service Categories
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Complete directory of visa and immigration services across India and UAE
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-gray-900"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{allCategories.length}</p>
                  <p className="text-sm text-blue-100">Categories</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{allCities.length}</p>
                  <p className="text-sm text-blue-100">Cities</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{allCategories.length * allCities.length}</p>
                  <p className="text-sm text-blue-100">Total Pages</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">5000+</p>
                  <p className="text-sm text-blue-100">Consultants</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="india">India Focus</SelectItem>
                  <SelectItem value="uae">UAE Focus</SelectItem>
                  <SelectItem value="international">International</SelectItem>
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

            <div className="text-sm text-gray-600">
              <span>
                <strong>{filteredCategories.length}</strong> categories found
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="all">All ({allCategories.length})</TabsTrigger>
              <TabsTrigger value="core">Core (12)</TabsTrigger>
              <TabsTrigger value="specialized">Specialized (12)</TabsTrigger>
              <TabsTrigger value="uae">UAE Services (12)</TabsTrigger>
              <TabsTrigger value="additional">Additional (12)</TabsTrigger>
            </TabsList>

            {/* All Categories */}
            <TabsContent value="all">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  All Service Categories
                </h2>
                <p className="text-gray-600">
                  Complete list of all {allCategories.length} visa and immigration service categories
                </p>
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {filteredCategories.map(renderCategoryCard)}
              </div>
            </TabsContent>

            {/* Core Services */}
            <TabsContent value="core">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Core Visa & Immigration Services
                </h2>
                <p className="text-gray-600">
                  Essential visa and immigration consultation services
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryGroups.core.map(renderCategoryCard)}
              </div>
            </TabsContent>

            {/* Specialized Services */}
            <TabsContent value="specialized">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Specialized Visa Services
                </h2>
                <p className="text-gray-600">
                  Specialized and niche visa processing services
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryGroups.specialized.map(renderCategoryCard)}
              </div>
            </TabsContent>

            {/* UAE Services */}
            <TabsContent value="uae">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  UAE Specific Services
                </h2>
                <p className="text-gray-600">
                  UAE-focused visa and immigration services
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryGroups.uae.map(renderCategoryCard)}
              </div>
            </TabsContent>

            {/* Additional Services */}
            <TabsContent value="additional">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Additional Services
                </h2>
                <p className="text-gray-600">
                  Additional and complementary immigration services
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categoryGroups.additional.map(renderCategoryCard)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Popular Combinations */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              Popular Category-City Combinations
            </h2>
            <p className="text-gray-600">Most searched combinations across India and UAE</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularCombinations.map((combo, index) => (
              <Link
                key={index}
                to={getCityCategoryUrl(combo.city, combo.category)}
                className="group p-4 bg-white rounded-lg border hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {allCategories.find(c => c.slug === combo.category)?.name} in {combo.city}
                  </h3>
                  <Badge variant="secondary">{combo.searches}/month</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {allCategories.find(c => c.slug === combo.category)?.description}
                </p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/all-cities-categories">
              <Button size="lg">
                View All City-Category Combinations
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
