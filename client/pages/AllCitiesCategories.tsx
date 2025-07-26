import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapPin, Building, Search, TrendingUp, Star, Users } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  allCities,
  allIndianCities,
  uaeCities,
  allCategories,
  completeCategoryMapping,
  getCitySlug
} from "@/lib/all-categories";

export default function AllCitiesCategories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("cities");

  // Filter cities based on search
  const filteredCities = useMemo(() => {
    if (!searchQuery) return allCities;
    return allCities.filter(city =>
      city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return allCategories;
    return allCategories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Popular cities (based on business centers in India)
  const popularCities = [
    "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Kolkata",
    "Pune", "Ahmedabad", "Jaipur", "Gurgaon", "Noida", "Chandigarh"
  ];

  const getCityUrl = (city: string) => 
    `/business/${city.toLowerCase().replace(/\s+/g, '-')}`;

  const getCategoryUrl = (slug: string) => 
    `/category/${slug}`;

  const getCityCategoryUrl = (city: string, slug: string) =>
    `/business/${city.toLowerCase().replace(/\s+/g, '-')}/${slug}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Browse All Cities & Categories
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Find visa consultants across {allCities.length} cities and {allCategories.length} service categories
            </p>
            
            {/* Search */}
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search cities or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-gray-900"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
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
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">1000+</p>
                  <p className="text-sm text-blue-100">Consultants</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="cities">Cities ({filteredCities.length})</TabsTrigger>
              <TabsTrigger value="categories">Categories ({filteredCategories.length})</TabsTrigger>
              <TabsTrigger value="popular">Popular Combinations</TabsTrigger>
            </TabsList>

            {/* Cities Tab */}
            <TabsContent value="cities">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  All Cities in India
                </h2>
                <p className="text-gray-600">
                  Choose a city to view all visa consultants and services available
                </p>
              </div>

              {/* Popular Cities First */}
              {!searchQuery && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    Popular Cities
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {popularCities.map(city => (
                      <Link
                        key={city}
                        to={getCityUrl(city)}
                        className="group p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 rounded-lg hover:border-blue-300 hover:shadow-lg transition-all duration-200"
                      >
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 transition-colors">
                            <MapPin className="w-6 h-6 text-blue-600" />
                          </div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {city}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {Object.keys(categoryMapping).length} categories
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* All Cities */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {searchQuery ? `Cities matching "${searchQuery}"` : "All Cities"}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredCities.map(city => (
                  <Link
                    key={city}
                    to={getCityUrl(city)}
                    className="p-3 bg-white border rounded-lg hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <MapPin className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
                          {city}
                        </p>
                        <p className="text-xs text-gray-500">
                          {Object.keys(categoryMapping).length} categories
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredCities.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No cities found
                  </h3>
                  <p className="text-gray-500">
                    Try searching for a different city name
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  All Service Categories
                </h2>
                <p className="text-gray-600">
                  Choose a category to find consultants across all cities
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map(([slug, name]) => (
                  <Card key={slug} className="hover:shadow-lg transition-all duration-200 group border-2 hover:border-purple-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <Building className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg group-hover:text-purple-600 transition-colors">
                            {name}
                          </CardTitle>
                          <p className="text-sm text-gray-500 mt-1">
                            Available in {indianCities.length} cities
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{indianCities.length} cities</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>50+ consultants</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Link
                          to={getCategoryUrl(slug)}
                          className="block w-full"
                        >
                          <Button className="w-full" variant="outline">
                            View All {name}
                          </Button>
                        </Link>
                        
                        {/* Show top 3 cities for this category */}
                        <div className="text-xs text-gray-500">
                          <p className="mb-1">Popular in:</p>
                          <div className="flex flex-wrap gap-1">
                            {popularCities.slice(0, 3).map((city, index) => (
                              <Link
                                key={city}
                                to={getCityCategoryUrl(city, slug)}
                                className="px-2 py-1 bg-gray-100 rounded text-blue-600 hover:bg-blue-50 transition-colors"
                              >
                                {city}
                              </Link>
                            ))}
                            <span className="px-2 py-1 text-gray-400">
                              +{indianCities.length - 3} more
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No categories found
                  </h3>
                  <p className="text-gray-500">
                    Try searching for a different service category
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Popular Combinations Tab */}
            <TabsContent value="popular">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Popular City-Category Combinations
                </h2>
                <p className="text-gray-600">
                  Most searched consultant types in major cities
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularCities.slice(0, 12).map(city => (
                  <Card key={city} className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-lg">{city}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {Object.entries(categoryMapping).slice(0, 4).map(([slug, name]) => (
                          <Link
                            key={slug}
                            to={getCityCategoryUrl(city, slug)}
                            className="block p-2 text-sm bg-gray-50 hover:bg-blue-50 rounded transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700 group-hover:text-blue-600">
                                {name}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {Math.floor(Math.random() * 50) + 10}
                              </Badge>
                            </div>
                          </Link>
                        ))}
                        <Link
                          to={getCityUrl(city)}
                          className="block text-center text-sm text-blue-600 hover:underline pt-2"
                        >
                          View all {Object.keys(categoryMapping).length} categories →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            List your business or contact us for assistance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/add-business">
                List Your Business
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link to="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
