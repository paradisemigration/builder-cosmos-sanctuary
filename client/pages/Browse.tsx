import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Search, MapPin, Filter } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Enhanced Search Header */}
      <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Browse Immigration Services
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover verified professionals and trusted service providers in
              Dubai
            </p>
          </div>

          {/* Modern Search Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 shadow-lg border border-white/20">
            <div className="space-y-4">
              {/* Main Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search for visa services, agents, consultants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-14 text-base rounded-xl border-2 border-border/20 focus:border-primary/50 bg-white/50"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-white/50 border-2 border-border/20">
                    <SelectValue placeholder="Service Category" />
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

                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger className="h-12 rounded-xl bg-white/50 border-2 border-border/20">
                    <MapPin className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Dubai Zone" />
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

                <Button
                  onClick={handleSearch}
                  className="h-12 rounded-xl bg-primary hover:bg-primary/90 text-base font-semibold px-8"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Mobile-First Filters */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24">
              <CategoryFilter
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={filteredBusinesses.length}
              />
            </div>
          </div>

          {/* Enhanced Business Listings */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {filteredBusinesses.length} Business
                  {filteredBusinesses.length !== 1 ? "es" : ""} Found
                </h2>
                <p className="text-sm text-muted-foreground">
                  Showing verified immigration services in Dubai
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  Sort by:
                </span>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, sortBy: value }))
                  }
                >
                  <SelectTrigger className="w-40 h-10 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="reviews">Most Reviews</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                    <SelectItem value="verified">Verified First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-16 lg:py-24">
                <div className="w-24 h-24 mx-auto mb-6 bg-muted/30 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">
                  No businesses found
                </h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or filters to find more
                  results. We have 50+ verified businesses in our directory.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedZone("all");
                      setFilters({
                        categories: [],
                        zones: [],
                        rating: "",
                        verified: false,
                        hasReviews: false,
                        sortBy: "rating",
                      });
                    }}
                    className="rounded-lg"
                  >
                    Clear All Filters
                  </Button>
                  <Button className="rounded-lg">View All Businesses</Button>
                </div>
              </div>
            ) : (
              <>
                {/* Business Grid - Enhanced Mobile Responsive */}
                <div className="grid grid-cols-1 gap-4 md:gap-6 lg:gap-8">
                  {filteredBusinesses.map((business) => (
                    <div
                      key={business.id}
                      className="group transition-all duration-500"
                    >
                      <BusinessCard
                        business={business}
                        onClick={() => navigate(`/business/${business.id}`)}
                      />
                    </div>
                  ))}
                </div>

                {/* Enhanced Load More Section */}
                <div className="text-center mt-12 pt-8 border-t border-border/50">
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {filteredBusinesses.length} of{" "}
                      {sampleBusinesses.length} businesses
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-lg min-w-[200px]"
                  >
                    Load More Results
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Dubai<span className="text-dubai-gold">Visa</span>Directory
              </h3>
              <p className="text-muted-foreground mb-4">
                Your trusted source for finding legitimate visa and immigration
                services in Dubai.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link to="/browse" className="hover:text-primary">
                    Browse Services
                  </Link>
                </li>
                <li>
                  <Link to="/add-business" className="hover:text-primary">
                    Add Business
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-primary">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link to="/help" className="hover:text-primary">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/report" className="hover:text-primary">
                    Report Scam
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Dubai Visa Directory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
