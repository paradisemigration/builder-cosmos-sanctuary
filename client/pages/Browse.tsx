import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, MapPin, Filter } from "lucide-react";
import { CategoryFilter } from "@/components/CategoryFilter";
import { BusinessCard } from "@/components/BusinessCard";
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
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedZone) params.set("zone", selectedZone);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">
                  Dubai<span className="text-dubai-gold">Visa</span>Directory
                </h1>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/browse"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Browse Services
                </Link>
                <Link
                  to="/add-business"
                  className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Add Business
                </Link>
                <Button size="sm">Sign In</Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Header */}
      <div className="bg-muted/30 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Browse Immigration Services
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search for visa services, agents, consultants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Service Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {businessCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger className="h-12">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Dubai Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Areas</SelectItem>
                {dubaiZones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSearch} className="mt-4 w-full md:w-auto">
            <Search className="w-4 h-4 mr-2" />
            Search Services
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CategoryFilter
                filters={filters}
                onFiltersChange={setFilters}
                resultCount={filteredBusinesses.length}
              />
            </div>
          </div>

          {/* Business Listings */}
          <div className="lg:col-span-3">
            {filteredBusinesses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No businesses found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or filters to find more
                  results.
                </p>
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
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBusinesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    onClick={() =>
                      (window.location.href = `/business/${business.id}`)
                    }
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredBusinesses.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Results
                </Button>
              </div>
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
