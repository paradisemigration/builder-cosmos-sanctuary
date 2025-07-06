import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Filter,
  Sparkles,
  TrendingUp,
  Users,
  Star,
  ChevronDown,
  Eye,
} from "lucide-react";
import { CategoryFilter } from "@/components/CategoryFilter";
import { BusinessCard } from "@/components/BusinessCard";
import { Navigation } from "@/components/Navigation";
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
  sampleBusinesses,
  businessCategories,
  dubaiZones,
  Business,
} from "@/lib/data";

interface FilterState {
  categories: string[];
  zones: string[];
  rating: string;
  verified: boolean;
  hasReviews: boolean;
  sortBy: string;
}

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [selectedZone, setSelectedZone] = useState(
    searchParams.get("zone") || "",
  );
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams.get("category")
      ? [searchParams.get("category")!]
      : [],
    zones: searchParams.get("zone") ? [searchParams.get("zone")!] : [],
    rating: "",
    verified: false,
    hasReviews: false,
    sortBy: "rating",
  });

  const [filteredBusinesses, setFilteredBusinesses] =
    useState<Business[]>(sampleBusinesses);

  // Scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => [
              ...prev,
              entry.target.getAttribute("data-section") || "",
            ]);
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => {
      observerRef.current?.observe(section);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    let filtered = [...sampleBusinesses];

    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (business) =>
          business.name.toLowerCase().includes(query) ||
          business.description.toLowerCase().includes(query) ||
          business.category.toLowerCase().includes(query) ||
          business.services.some((service) =>
            service.toLowerCase().includes(query),
          ),
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((business) =>
        filters.categories.includes(business.category),
      );
    }

    // Zone filter
    if (filters.zones.length > 0) {
      filtered = filtered.filter((business) =>
        filters.zones.some((zone) => business.address.includes(zone)),
      );
    }

    // Rating filter
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter((business) => business.rating >= minRating);
    }

    // Verified filter
    if (filters.verified) {
      filtered = filtered.filter((business) => business.isVerified);
    }

    // Has reviews filter
    if (filters.hasReviews) {
      filtered = filtered.filter((business) => business.reviewCount > 0);
    }

    // Sort
    switch (filters.sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "verified":
        filtered.sort(
          (a, b) => (b.isVerified ? 1 : 0) - (a.isVerified ? 1 : 0),
        );
        break;
    }

    setFilteredBusinesses(filtered);
  }, [searchQuery, filters]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory && selectedCategory !== "all")
      params.set("category", selectedCategory);
    if (selectedZone && selectedZone !== "all")
      params.set("zone", selectedZone);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Navigation */}
      <Navigation />

      {/* Enhanced Animated Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-800/40 to-blue-900/50"></div>

          {/* Floating Geometric Shapes */}
          <div className="absolute top-16 left-8 w-48 h-48 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-32 right-12 w-36 h-36 bg-gradient-to-br from-purple-400/25 to-pink-500/25 rounded-full blur-2xl animate-float-medium"></div>
          <div className="absolute bottom-20 left-1/4 w-44 h-44 bg-gradient-to-br from-green-400/20 to-teal-500/20 rounded-full blur-3xl animate-float-fast"></div>

          {/* Enhanced Particle System */}
          <div className="absolute inset-0">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className={`absolute rounded-full animate-twinkle ${
                  i % 3 === 0
                    ? "w-2 h-2 bg-white/40"
                    : i % 3 === 1
                      ? "w-1 h-1 bg-cyan-300/50"
                      : "w-1.5 h-1.5 bg-purple-300/40"
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${3 + Math.random() * 3}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative"
          data-section="hero"
        >
          <div
            className={`text-center mb-12 transition-all duration-1000 ${
              visibleSections.includes("hero")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
              Discover{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Trusted
              </span>
              <br />
              Immigration Services
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              ✈️ Find verified professionals and legitimate service providers in
              Dubai. Your journey to success starts here.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-cyan-400 mb-2">
                  50+
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  Verified Businesses
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-purple-400 mb-2">
                  1000+
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  Happy Customers
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-green-400 mb-2">
                  4.8★
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  Average Rating
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Search Card */}
          <div
            className={`transition-all duration-1000 ${
              visibleSections.includes("hero")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 lg:p-8 shadow-2xl border border-white/20">
              <div className="space-y-6">
                {/* Main Search Input with Enhanced Focus Effects */}
                <div className="relative group">
                  <Search
                    className={`absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 transition-all duration-300 ${
                      isSearchFocused
                        ? "text-blue-500 scale-110"
                        : "text-gray-400"
                    }`}
                  />
                  <Input
                    placeholder="🔍 Search for visa services, agents, consultants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className={`pl-16 pr-6 h-16 text-lg rounded-2xl border-2 transition-all duration-300 bg-white/80 backdrop-blur-sm ${
                      isSearchFocused
                        ? "border-blue-500 shadow-lg shadow-blue-500/25 bg-white"
                        : "border-white/30 hover:border-white/50"
                    }`}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  {/* Search suggestions */}
                  {isSearchFocused && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-50">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-500 font-medium">
                          Popular searches:
                        </div>
                        {[
                          "Tourist Visa",
                          "Employment Visa",
                          "Golden Visa",
                          "Business Setup",
                        ].map((term) => (
                          <button
                            key={term}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            onClick={() => {
                              setSearchQuery(term);
                              setIsSearchFocused(false);
                            }}
                          >
                            🔍 {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Filter Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="relative group">
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="h-14 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 transition-all duration-300 group-hover:shadow-lg">
                        <div className="flex items-center">
                          <Sparkles className="w-5 h-5 mr-3 text-purple-500" />
                          <SelectValue placeholder="Service Category" />
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
                  </div>

                  <div className="relative group">
                    <Select
                      value={selectedZone}
                      onValueChange={setSelectedZone}
                    >
                      <SelectTrigger className="h-14 rounded-2xl bg-white/80 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 transition-all duration-300 group-hover:shadow-lg">
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 mr-3 text-green-500" />
                          <SelectValue placeholder="Dubai Zone" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Areas</SelectItem>
                        {dubaiZones.map((zone) => (
                          <SelectItem key={zone} value={zone}>
                            {zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleSearch}
                    className="h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg font-bold px-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                  >
                    <Search className="w-6 h-6 mr-3 group-hover:animate-pulse" />
                    🚀 Find Services
                  </Button>
                </div>

                {/* Quick Filter Tags */}
                <div className="flex flex-wrap gap-3 pt-4">
                  <span className="text-white/80 text-sm font-medium">
                    Quick filters:
                  </span>
                  {[
                    "⭐ Verified Only",
                    "🏆 Top Rated",
                    "💬 Most Reviews",
                    "🆕 Recently Added",
                  ].map((tag) => (
                    <button
                      key={tag}
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm text-white backdrop-blur-sm border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
        data-section="content"
      >
        <div
          className={`grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 transition-all duration-1000 ${
            visibleSections.includes("content")
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          {/* Enhanced Filters Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-6">
                <CategoryFilter
                  filters={filters}
                  onFiltersChange={setFilters}
                  resultCount={filteredBusinesses.length}
                />
              </div>
            </div>
          </div>

          {/* Enhanced Business Listings */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Enhanced Results Header */}
            <div className="bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    🎯 {filteredBusinesses.length} Business
                    {filteredBusinesses.length !== 1 ? "es" : ""} Found
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Showing verified immigration services in Dubai
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 hidden sm:inline flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Sort by:
                  </span>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, sortBy: value }))
                    }
                  >
                    <SelectTrigger className="w-48 h-12 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-300 transition-colors">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">⭐ Highest Rated</SelectItem>
                      <SelectItem value="reviews">💬 Most Reviews</SelectItem>
                      <SelectItem value="name">📝 Name A-Z</SelectItem>
                      <SelectItem value="verified">
                        ✅ Verified First
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-12 sm:py-16 lg:py-24">
                <div className="relative mx-auto w-fit">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg">
                    <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                  </div>
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full animate-bounce"></div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 px-4">
                  🔍 No businesses found
                </h3>
                <p className="text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto text-base sm:text-lg leading-relaxed px-4">
                  Don't worry! Try adjusting your search criteria or filters. We
                  have {sampleBusinesses.length}+ verified businesses waiting to
                  help you.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                      setSelectedZone("");
                      setFilters({
                        categories: [],
                        zones: [],
                        rating: "",
                        verified: false,
                        hasReviews: false,
                        sortBy: "rating",
                      });
                    }}
                    className="rounded-xl border-2 border-blue-200 hover:border-blue-400 px-6 sm:px-8 py-3 font-semibold"
                  >
                    🔄 Clear All Filters
                  </Button>
                  <Button
                    onClick={() => window.location.reload()}
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 sm:px-8 py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    👀 View All Businesses
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Enhanced Business Grid - Mobile Responsive */}
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  {filteredBusinesses.map((business, index) => (
                    <div
                      key={business.id}
                      className={`group transition-all duration-700 ${
                        visibleSections.includes("content")
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-10"
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <div className="transform hover:scale-[1.01] sm:hover:scale-[1.02] transition-all duration-500 hover:shadow-xl sm:hover:shadow-2xl">
                        <BusinessCard
                          business={business}
                          onClick={() => navigate(`/business/${business.id}`)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced Load More Section - Mobile Responsive */}
                <div className="text-center mt-12 sm:mt-16 pt-8 sm:pt-12 border-t-2 border-gray-200">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                      <div className="text-center">
                        <p className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">
                          📊 Showing {filteredBusinesses.length} of{" "}
                          {sampleBusinesses.length} businesses
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 px-2">
                          🎯 Found exactly what you're looking for? Great! Want
                          to see more options?
                        </p>
                      </div>
                      <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0" />
                    </div>
                    <Button
                      size="lg"
                      className="w-full sm:w-auto rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
                    >
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:animate-bounce" />
                      🚀 Load More Amazing Services
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-20 mt-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-float-slow"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-float-medium"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-black text-white mb-6">
                🏢 Trusted<span className="text-yellow-400">Immigration</span>
              </h3>
              <p className="text-blue-100 mb-6 text-lg leading-relaxed">
                ✈️ Your trusted partner for finding legitimate visa and
                immigration services in Dubai. We verify every business to
                protect you from scams.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: "📱", label: "Mobile App Coming Soon" },
                  { icon: "🔒", label: "100% Verified" },
                  { icon: "⭐", label: "Trusted by 1000+" },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-xs text-blue-200">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">🔗 Quick Links</h4>
              <ul className="space-y-3 text-blue-200">
                {[
                  { to: "/browse", text: "🔍 Browse Services" },
                  { to: "/add-business", text: "➕ Add Business" },
                  { to: "/contact", text: "📞 Contact Us" },
                  { to: "/about", text: "ℹ️ About Us" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">🛡️ Support</h4>
              <ul className="space-y-3 text-blue-200">
                {[
                  { to: "/help", text: "❓ Help Center" },
                  { to: "/report", text: "🚨 Report Scam" },
                  { to: "/privacy", text: "🔐 Privacy Policy" },
                  { to: "/terms", text: "📋 Terms of Service" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="hover:text-white transition-colors duration-300 hover:translate-x-2 transform inline-block"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-16 pt-8 text-center">
            <p className="text-blue-200">
              &copy; 2024 Trusted Immigration Directory. All rights reserved.
              <span className="block mt-2 text-sm">
                🌟 Made with ❤️ in Dubai, UAE
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
