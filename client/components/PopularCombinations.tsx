import { Link } from "react-router-dom";
import { MapPin, Building, TrendingUp, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryMapping } from "@/lib/data";

export function PopularCombinations() {
  // Popular cities
  const popularCities = [
    "Delhi", "Mumbai", "Bangalore", "Chennai", 
    "Hyderabad", "Pune", "Ahmedabad", "Kolkata"
  ];

  // Popular categories
  const popularCategories = [
    { slug: "immigration-consultants", name: "Immigration Lawyers", searches: "2.5k" },
    { slug: "visa-consultants", name: "Visa Consultants", searches: "1.8k" },
    { slug: "study-abroad", name: "Study Abroad", searches: "1.5k" },
    { slug: "work-permit", name: "Work Permit", searches: "1.2k" },
  ];

  // Generate popular combinations
  const popularCombinations = [
    { city: "Delhi", category: "immigration-consultants", name: "Immigration Lawyers in Delhi", count: "150+" },
    { city: "Mumbai", category: "visa-consultants", name: "Visa Consultants in Mumbai", count: "130+" },
    { city: "Bangalore", category: "study-abroad", name: "Study Abroad in Bangalore", count: "120+" },
    { city: "Chennai", category: "work-permit", name: "Work Permit in Chennai", count: "100+" },
    { city: "Hyderabad", category: "immigration-consultants", name: "Immigration Lawyers in Hyderabad", count: "95+" },
    { city: "Pune", category: "visa-consultants", name: "Visa Consultants in Pune", count: "85+" },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-orange-500" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Popular Searches
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the most searched consultant types in major Indian cities
          </p>
        </div>

        {/* Popular Categories Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Top Service Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularCategories.map(category => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                      <Building className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </h4>
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {category.searches} searches/month
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular City-Category Combinations */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Most Popular Combinations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCombinations.map((combo, index) => (
              <Link
                key={index}
                to={`/business/${combo.city.toLowerCase()}/${combo.category}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <div className="flex">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <Building className="w-4 h-4 text-purple-600 -ml-1" />
                          </div>
                        </div>
                        <div>
                          <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                            {combo.name}
                          </CardTitle>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {combo.count}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{combo.city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>4.5+ rating</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Access by City */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Browse by City
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {popularCities.map(city => (
              <Link
                key={city}
                to={`/business/${city.toLowerCase()}`}
                className="p-3 text-center bg-white border-2 border-gray-100 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 transition-colors">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {city}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 mb-6">
              Explore all {popularCities.length * Object.keys(categoryMapping).length}+ city-category combinations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/all-cities-categories">
                  Browse All Cities & Categories
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/sitemap">
                  View Complete Sitemap
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
