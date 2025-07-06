import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Filter,
  Plane,
  Globe,
  Users,
  Award,
  Clock,
  Shield,
  Star,
  Building,
  CheckCircle,
  Loader2,
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
  dubaiZones,
  uaeCities,
  sampleBusinesses,
} from "@/lib/data";
import { useGeolocation } from "@/hooks/useGeolocation";

interface SearchHeroProps {
  onSearch?: (query: string, category?: string, zone?: string) => void;
}

export function SearchHero({ onSearch }: SearchHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [locationDisplayText, setLocationDisplayText] = useState<string>(
    "Detecting your location...",
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof sampleBusinesses>([]);

  // Use geolocation hook
  const {
    location,
    isLoading: locationLoading,
    error: locationError,
  } = useGeolocation();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Update location display when geolocation data is available
  useEffect(() => {
    if (location) {
      // Format location display based on detected location
      const locationText =
        location.country === "United Arab Emirates" ||
        location.countryCode === "AE"
          ? `${location.city}, UAE`
          : `${location.city}, ${location.country}`;

      setLocationDisplayText(locationText);

      // Auto-set UAE city if user is in UAE, otherwise keep it general
      if (
        location.country === "United Arab Emirates" ||
        location.countryCode === "AE"
      ) {
        // If in UAE, try to match with UAE cities
        const matchingCity = uaeCities.find(
          (city) =>
            location.city.toLowerCase().includes(city.toLowerCase()) ||
            city.toLowerCase().includes(location.city.toLowerCase()),
        );
        if (matchingCity) {
          setSelectedZone(matchingCity);
        } else {
          // Default to Dubai if no specific city match
          setSelectedZone("Dubai");
        }
      }
    } else if (locationError) {
      setLocationDisplayText("Location not available");
    } else if (locationLoading) {
      setLocationDisplayText("Detecting your location...");
    }
  }, [location, locationError, locationLoading]);

  // Handle search input changes and filter suggestions
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);

    if (value.length >= 3) {
      const filteredBusinesses = sampleBusinesses
        .filter((business) =>
          business.name.toLowerCase().includes(value.toLowerCase()),
        )
        .slice(0, 8); // Limit to 8 suggestions

      setSuggestions(filteredBusinesses);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (businessName: string) => {
    setSearchQuery(businessName);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Handle search submission
  const handleSearch = () => {
    setShowSuggestions(false);
    onSearch?.(
      searchQuery,
      selectedCategory === "all" ? "" : selectedCategory,
      selectedZone === "all" ? "" : selectedZone,
    );
  };

  const stats = [
    {
      icon: Building,
      label: "Verified Businesses",
      value: "150+",
      color: "text-green-400",
    },
    {
      icon: Users,
      label: "Happy Customers",
      value: "5000+",
      color: "text-blue-400",
    },
    {
      icon: Star,
      label: "Average Rating",
      value: "4.8",
      color: "text-yellow-400",
    },
    {
      icon: Clock,
      label: "Response Time",
      value: "<2hrs",
      color: "text-purple-400",
    },
  ];

  return (
    <div className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden pt-16 lg:pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Geometric Patterns */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Animation Elements */}
        <div
          className={`absolute transition-all duration-2000 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        >
          {/* Floating Icons */}
          <div className="animate-float-slow absolute top-20 left-[10%]">
            <Plane className="w-8 h-8 text-blue-300/30 transform rotate-45" />
          </div>
          <div className="animate-float-medium absolute top-32 right-[15%]">
            <Globe className="w-12 h-12 text-cyan-300/40" />
          </div>
          <div className="animate-float-fast absolute top-40 left-[20%]">
            <Building className="w-6 h-6 text-white/20" />
          </div>
          <div className="animate-float-slow absolute bottom-40 right-[20%]">
            <Shield className="w-10 h-10 text-green-300/30" />
          </div>
          <div className="animate-float-medium absolute bottom-32 left-[15%]">
            <Award className="w-8 h-8 text-yellow-300/40" />
          </div>

          {/* Particle System */}
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Dubai Skyline SVG */}
        <div className="absolute bottom-0 left-0 right-0 h-48 opacity-20">
          <svg viewBox="0 0 1200 200" className="w-full h-full">
            <defs>
              <linearGradient
                id="skylineGrad"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path
              d="M0,200 L0,150 L100,140 L120,120 L140,130 L160,110 L180,120 L200,100 L220,110 L250,90 L280,100 L300,80 L330,90 L360,70 L400,80 L450,60 L500,70 L550,50 L600,60 L650,40 L700,50 L750,30 L800,40 L850,20 L900,30 L950,10 L1000,20 L1050,15 L1100,25 L1150,5 L1200,15 L1200,200 Z"
              fill="url(#skylineGrad)"
              className="drop-shadow-lg"
            />
          </svg>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-indigo-900/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        {/* Enhanced Search Form - Moved to Top */}
        <div
          className={`max-w-6xl mx-auto mb-8 md:mb-12 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <div className="relative group">
            {/* Animated Border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-2xl md:rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>

            <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl border border-white/30">
              {/* Form Header */}
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-flex items-center justify-center mb-3 md:mb-4">
                  <div className="bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm border border-orange-200 rounded-full px-4 md:px-6 py-2">
                    <div className="flex items-center space-x-2 md:space-x-3">
                      <div className="w-2 h-2 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs md:text-sm font-semibold tracking-wide text-orange-700">
                        {location && location.countryCode !== "AE"
                          ? `🌍 GLOBAL IMMIGRATION DIRECTORY - SERVING ${location.country?.toUpperCase()}`
                          : "🇦🇪 DUBAI'S #1 IMMIGRATION DIRECTORY"}
                      </span>
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 md:mb-3">
                  {location && location.countryCode !== "AE"
                    ? `Find Immigration Services in ${location.city}, ${location.country}`
                    : "Find Your Immigration Partner Today"}
                </h3>
                <p className="text-sm md:text-base lg:text-lg text-gray-600">
                  {location && location.countryCode !== "AE"
                    ? `Connect with verified immigration professionals serving ${location.country} residents`
                    : "Search verified professionals who will guide you every step of the way"}
                </p>
              </div>

              {/* Search Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
                {/* Main Search */}
                <div className="lg:col-span-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 md:h-6 md:w-6 text-gray-400 group-hover:text-orange-500 transition-colors duration-300" />
                    </div>
                    <Input
                      placeholder="Search by company name..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      onFocus={() =>
                        searchQuery.length >= 3 && setShowSuggestions(true)
                      }
                      onBlur={() =>
                        setTimeout(() => setShowSuggestions(false), 150)
                      }
                      className="pl-12 md:pl-16 h-12 md:h-14 lg:h-16 bg-gray-50/80 border-2 border-gray-200 text-gray-800 placeholder-gray-500 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 rounded-xl md:rounded-2xl text-sm md:text-base lg:text-lg font-medium transition-all duration-300 hover:border-gray-300"
                    />

                    {/* Autocomplete Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white/95 backdrop-blur-xl border border-orange-200 rounded-xl md:rounded-2xl shadow-2xl max-h-80 overflow-y-auto">
                        {suggestions.map((business) => (
                          <div
                            key={business.id}
                            onClick={() =>
                              handleSuggestionSelect(business.name)
                            }
                            className="flex items-center gap-3 p-3 md:p-4 hover:bg-orange-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                          >
                            {business.logo && (
                              <img
                                src={business.logo}
                                alt={business.name}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                                {business.name}
                              </h4>
                              <p className="text-xs md:text-sm text-gray-600 truncate">
                                {business.category} •{" "}
                                {business.address.split(",")[0]}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600">
                                  {business.rating} ({business.reviewCount}{" "}
                                  reviews)
                                </span>
                                {business.isVerified && (
                                  <CheckCircle className="w-3 h-3 text-green-500 ml-1" />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Category Select */}
                <div className="lg:col-span-3">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none z-10">
                      <Filter className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-hover:text-orange-500 transition-colors duration-300" />
                    </div>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="h-12 md:h-14 lg:h-16 pl-12 md:pl-16 bg-gray-50/80 border-2 border-gray-200 text-gray-800 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 rounded-xl md:rounded-2xl text-sm md:text-base lg:text-lg transition-all duration-300 hover:border-gray-300">
                        <SelectValue placeholder="Service Type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl md:rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
                        <SelectItem
                          value="all"
                          className="rounded-lg md:rounded-xl text-sm md:text-base lg:text-lg py-2 md:py-3"
                        >
                          All Services
                        </SelectItem>
                        {businessCategories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="rounded-lg md:rounded-xl text-sm md:text-base lg:text-lg py-2 md:py-3"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Location Select */}
                <div className="lg:col-span-3">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 md:pl-6 flex items-center pointer-events-none z-10">
                      {locationLoading ? (
                        <Loader2 className="h-4 w-4 md:h-5 md:w-5 text-blue-500 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-hover:text-orange-500 transition-colors duration-300" />
                      )}
                    </div>

                    {location &&
                    (location.country === "United Arab Emirates" ||
                      location.countryCode === "AE") ? (
                      // Show UAE cities selector if user is in UAE
                      <Select
                        value={selectedZone}
                        onValueChange={setSelectedZone}
                      >
                        <SelectTrigger className="h-12 md:h-14 lg:h-16 pl-12 md:pl-16 bg-gray-50/80 border-2 border-gray-200 text-gray-800 focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 rounded-xl md:rounded-2xl text-sm md:text-base lg:text-lg transition-all duration-300 hover:border-gray-300">
                          <SelectValue placeholder={locationDisplayText} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl md:rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
                          <SelectItem
                            value="all"
                            className="rounded-lg md:rounded-xl text-sm md:text-base lg:text-lg py-2 md:py-3"
                          >
                            All UAE Cities
                          </SelectItem>
                          {uaeCities.map((city) => (
                            <SelectItem
                              key={city}
                              value={city}
                              className="rounded-lg md:rounded-xl text-sm md:text-base lg:text-lg py-2 md:py-3"
                            >
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      // Show location display input for international users
                      <div className="relative">
                        <Input
                          value={locationDisplayText}
                          readOnly
                          className="h-12 md:h-14 lg:h-16 pl-12 md:pl-16 bg-gray-50/80 border-2 border-gray-200 text-gray-800 rounded-xl md:rounded-2xl text-sm md:text-base lg:text-lg transition-all duration-300 cursor-default"
                          placeholder="Your location"
                        />
                        {location && location.countryCode && (
                          <div className="absolute inset-y-0 right-0 pr-4 md:pr-6 flex items-center">
                            <span
                              className="text-lg md:text-xl"
                              title={location.country}
                            >
                              {location.countryCode === "IN"
                                ? "🇮🇳"
                                : location.countryCode === "PK"
                                  ? "🇵🇰"
                                  : location.countryCode === "BD"
                                    ? "🇧🇩"
                                    : location.countryCode === "LK"
                                      ? "🇱🇰"
                                      : location.countryCode === "PH"
                                        ? "🇵🇭"
                                        : location.countryCode === "US"
                                          ? "🇺🇸"
                                          : location.countryCode === "GB"
                                            ? "🇬🇧"
                                            : location.countryCode === "CA"
                                              ? "🇨🇦"
                                              : location.countryCode === "AU"
                                                ? "🇦🇺"
                                                : location.countryCode === "DE"
                                                  ? "🇩🇪"
                                                  : location.countryCode ===
                                                      "FR"
                                                    ? "🇫🇷"
                                                    : "🌍"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="text-center mb-4 md:mb-6">
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="relative bg-gradient-to-r from-orange-600 via-purple-600 to-orange-600 hover:from-orange-700 hover:via-purple-700 hover:to-orange-700 text-white font-bold px-8 md:px-12 lg:px-16 py-4 md:py-5 lg:py-6 text-base md:text-lg lg:text-xl h-auto rounded-xl md:rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group overflow-hidden w-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Search className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 mr-2 md:mr-4" />
                  <span className="font-extrabold">
                    {location && location.countryCode !== "AE"
                      ? `🔍 Find Services in ${location.city}`
                      : "🔍 Find Your Immigration Partner"}
                  </span>
                </Button>
              </div>

              {/* Quick Search Tags */}
              <div className="text-center">
                <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4 font-medium">
                  ✨ Popular searches:
                </p>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {[
                    "Tourist Visa",
                    "Work Permit",
                    "Family Visa",
                    "Document Clearing",
                    "Immigration Consultants",
                    "Visa Renewal",
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setSearchQuery(tag);
                        handleSearch();
                      }}
                      className="group px-3 md:px-4 lg:px-6 py-2 md:py-3 bg-gradient-to-r from-orange-50 to-purple-50 hover:from-orange-100 hover:to-purple-100 text-orange-700 hover:text-orange-800 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 hover:scale-105 transform border border-orange-200 hover:border-orange-300 hover:shadow-lg"
                    >
                      <span className="group-hover:animate-pulse">{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }
        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }
        @keyframes gradient-x {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
