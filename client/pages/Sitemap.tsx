import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Building, Grid, List, Filter } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  allCities,
  allIndianCities,
  uaeCities,
  allCategories,
  getCitySlug,
  getAllCombinations
} from "@/lib/all-categories";

export default function Sitemap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Use the comprehensive combinations from the utility function
  const allCombinations = useMemo(() => {
    return getAllCombinations();
  }, []);

  // Filter combinations based on search and filters
  const filteredCombinations = useMemo(() => {
    let filtered = allCombinations;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(combo =>
        combo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        combo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (combo.city && combo.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (combo.category && combo.category.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // City filter
    if (selectedCity !== "all") {
      filtered = filtered.filter(combo => 
        combo.city === selectedCity || combo.type === 'category'
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(combo =>
        combo.category === selectedCategory || combo.type === 'city'
      );
    }

    return filtered;
  }, [allCombinations, searchQuery, selectedCity, selectedCategory]);

  const cityPageCount = filteredCombinations.filter(c => c.type === 'city').length;
  const categoryPageCount = filteredCombinations.filter(c => c.type === 'category').length;
  const cityCategoriPageCount = filteredCombinations.filter(c => c.type === 'city-category').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              All Cities & Categories
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Browse {allCities.length} cities and {allCategories.length} categories
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{allCities.length}</p>
                  <p className="text-sm text-blue-100">Cities</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{allCategories.length}</p>
                  <p className="text-sm text-blue-100">Categories</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{allCities.length * allCategories.length}</p>
                  <p className="text-sm text-blue-100">Total Pages</p>
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
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search cities or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {allCities.slice(0, 20).map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories.map(category => (
                    <SelectItem key={category.slug} value={category.name}>{category.name}</SelectItem>
                  ))}
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

          {/* Results count */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <span>
              <strong>{filteredCombinations.length}</strong> total pages
            </span>
            <span>•</span>
            <span>
              <strong>{cityPageCount}</strong> city pages
            </span>
            <span>•</span>
            <span>
              <strong>{categoryPageCount}</strong> category pages  
            </span>
            <span>•</span>
            <span>
              <strong>{cityCategoriPageCount}</strong> city-category pages
            </span>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4">
          {filteredCombinations.length === 0 ? (
            <div className="text-center py-16">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No pages found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-2"
              }
            >
              {filteredCombinations.map((combo, index) => (
                <Link
                  key={index}
                  to={combo.url}
                  className={`block ${
                    viewMode === "grid"
                      ? "p-4 bg-white rounded-lg border hover:shadow-md transition-all duration-200 hover:scale-105"
                      : "p-4 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                      {combo.type === 'city' ? (
                        <MapPin className="w-4 h-4 text-blue-600" />
                      ) : combo.type === 'category' ? (
                        <Building className="w-4 h-4 text-purple-600" />
                      ) : (
                        <div className="flex">
                          <MapPin className="w-3 h-3 text-blue-600" />
                          <Building className="w-3 h-3 text-purple-600 -ml-1" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                        {combo.title}
                      </h3>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {combo.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            combo.type === 'city'
                              ? 'text-blue-600 border-blue-200'
                              : combo.type === 'category'
                              ? 'text-purple-600 border-purple-200'
                              : 'text-green-600 border-green-200'
                          }`}
                        >
                          {combo.type === 'city' ? 'City' : combo.type === 'category' ? 'Category' : 'City + Category'}
                        </Badge>
                        {combo.city && (
                          <span className="text-xs text-gray-500">{combo.city}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Access Sections */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Cities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Top Cities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {indianCities.slice(0, 16).map(city => (
                    <Link
                      key={city}
                      to={`/business/${city.toLowerCase().replace(/\s+/g, '-')}`}
                      className="p-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      {city}
                    </Link>
                  ))}
                </div>
                <Link
                  to="/business"
                  className="inline-block mt-4 text-sm text-blue-600 font-medium hover:underline"
                >
                  View all {indianCities.length} cities →
                </Link>
              </CardContent>
            </Card>

            {/* All Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-600" />
                  All Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(categoryMapping).map(([slug, name]) => (
                    <Link
                      key={slug}
                      to={`/category/${slug}`}
                      className="block p-2 text-sm text-purple-600 hover:bg-purple-50 rounded transition-colors"
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
