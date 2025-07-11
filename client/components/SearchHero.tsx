import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Filter,
  Loader2,
  Star,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  businessCategories,
  indianCities,
  visaTypes,
  sampleBusinesses,
} from "@/lib/data";

interface SearchHeroProps {
  onSearch?: (query: string, category?: string, location?: string) => void;
}

export function SearchHero({ onSearch }: SearchHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof sampleBusinesses>([]);

  // Handle search input changes and filter suggestions
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (value.length >= 2) {
      const filteredBusinesses = sampleBusinesses
        .filter((business) =>
          business.name.toLowerCase().includes(value.toLowerCase()),
        )
        .slice(0, 5); // Limit to 5 suggestions

      setSuggestions(filteredBusinesses);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (business: (typeof sampleBusinesses)[0]) => {
    setSearchQuery(business.name);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(
        business.name,
        selectedCategory === "all" ? "" : selectedCategory,
        selectedLocation === "all" ? "" : selectedLocation,
      );
    }
  };

  // Handle search submit
  const handleSearch = () => {
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(
        searchQuery,
        selectedCategory === "all" ? "" : selectedCategory,
        selectedLocation === "all" ? "" : selectedLocation,
      );
    }
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      {/* Search Card */}
      <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Find Your Perfect Visa Consultant
          </h3>
          <p className="text-gray-600">
            Search by consultant name, visa type, or city
          </p>
        </div>

        {/* Search Form */}
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search visa consultants, company name..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-14 pl-12 pr-4 text-lg rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0"
              />
            </div>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white rounded-xl border border-gray-200 shadow-lg max-h-80 overflow-y-auto">
                {suggestions.map((business) => (
                  <div
                    key={business.id}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(business)}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <img
                        src={business.logo}
                        alt={business.name}
                        className="w-8 h-8 rounded object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.parentElement!.innerHTML = business.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2);
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 truncate">
                          {business.name}
                        </h4>
                        {business.isVerified && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{business.category}</span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {business.rating}
                        </span>
                        <span>{business.city}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500">
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Visa Type" />
                </div>
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

            {/* Location Filter */}
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Select City" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {indianCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Consultants
            </Button>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Popular Searches:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Student Visa USA",
              "Canada PR",
              "Australia Work Visa",
              "UK Student Visa",
              "Tourist Visa",
            ].map((term) => (
              <button
                key={term}
                onClick={() => {
                  setSearchQuery(term);
                  if (onSearch) {
                    onSearch(term, selectedCategory, selectedLocation);
                  }
                }}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats Below Search */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">8,500+</div>
          <div className="text-sm text-gray-600">Verified Consultants</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">95%</div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">50+</div>
          <div className="text-sm text-gray-600">Cities Covered</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">24/7</div>
          <div className="text-sm text-gray-600">Support Available</div>
        </div>
      </div>
    </div>
  );
}
