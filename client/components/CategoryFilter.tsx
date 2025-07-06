import { useState } from "react";
import { Check, SlidersHorizontal, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { businessCategories, dubaiZones } from "@/lib/data";

interface FilterState {
  categories: string[];
  zones: string[];
  rating: string;
  verified: boolean;
  hasReviews: boolean;
  sortBy: string;
}

interface CategoryFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount: number;
}

export function CategoryFilter({
  filters,
  onFiltersChange,
  resultCount,
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    updateFilter("categories", newCategories);
  };

  const toggleZone = (zone: string) => {
    const newZones = filters.zones.includes(zone)
      ? filters.zones.filter((z) => z !== zone)
      : [...filters.zones, zone];
    updateFilter("zones", newZones);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      zones: [],
      rating: "",
      verified: false,
      hasReviews: false,
      sortBy: "rating",
    });
  };

  const activeFilterCount =
    filters.categories.length +
    filters.zones.length +
    (filters.rating ? 1 : 0) +
    (filters.verified ? 1 : 0) +
    (filters.hasReviews ? 1 : 0);

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl sm:rounded-2xl shadow-lg">
      {/* Enhanced Header - Mobile Responsive */}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="lg:hidden">
              <CollapsibleTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-lg w-full sm:w-auto">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  🔧 Filters
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-2 text-xs bg-blue-100 text-blue-700">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>

            <div className="hidden lg:block">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                🔧 Filter Results
              </h3>
            </div>

            <div className="text-right">
              <span className="text-sm font-medium text-gray-700">{resultCount} found</span>
                {resultCount} business{resultCount !== 1 ? "es" : ""} found
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="rounded-lg"
              >
                Clear all
              </Button>
            )}

            <div className="lg:hidden">
              <Select
                value={filters.sortBy}
                onValueChange={(value) => updateFilter("sortBy", value)}
              >
                <SelectTrigger className="w-36 h-9 rounded-lg">
                  <SelectValue placeholder="Sort by" />
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
        </div>

        {/* Mobile Results Count */}
        <div className="sm:hidden mt-2">
          <span className="text-sm text-muted-foreground">
            {resultCount} business{resultCount !== 1 ? "es" : ""} found
          </span>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filters.categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => toggleCategory(category)}
                >
                  ×
                </Button>
              </Badge>
            ))}

            {filters.zones.map((zone) => (
              <Badge key={zone} variant="secondary" className="text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                {zone}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => toggleZone(zone)}
                >
                  ×
                </Button>
              </Badge>
            ))}

            {filters.rating && (
              <Badge variant="secondary" className="text-xs">
                <Star className="w-3 h-3 mr-1" />
                {filters.rating}+ stars
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => updateFilter("rating", "")}
                >
                  ×
                </Button>
              </Badge>
            )}

            {filters.verified && (
              <Badge variant="secondary" className="text-xs">
                Verified Only
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1"
                  onClick={() => updateFilter("verified", false)}
                >
                  ×
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Filter Content */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className="p-4 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Categories */}
            <div>
              <h4 className="font-semibold mb-3">Service Categories</h4>
              <div className="space-y-2">
                {businessCategories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={filters.categories.includes(category)}
                      onCheckedChange={() => toggleCategory(category)}
                    />
                    <label
                      htmlFor={category}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Zones */}
            <div>
              <h4 className="font-semibold mb-3">Dubai Areas</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {dubaiZones.map((zone) => (
                  <div key={zone} className="flex items-center space-x-2">
                    <Checkbox
                      id={zone}
                      checked={filters.zones.includes(zone)}
                      onCheckedChange={() => toggleZone(zone)}
                    />
                    <label
                      htmlFor={zone}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {zone}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-semibold mb-3">Minimum Rating</h4>
              <div className="space-y-2">
                {["4", "3", "2", "1"].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={filters.rating === rating}
                      onCheckedChange={(checked) =>
                        updateFilter("rating", checked ? rating : "")
                      }
                    />
                    <label
                      htmlFor={`rating-${rating}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center"
                    >
                      <Star className="w-4 h-4 text-accent mr-1" />
                      {rating}+ stars
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Filters */}
            <div>
              <h4 className="font-semibold mb-3">Other Filters</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="verified"
                    checked={filters.verified}
                    onCheckedChange={(checked) =>
                      updateFilter("verified", checked)
                    }
                  />
                  <label
                    htmlFor="verified"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Verified businesses only
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasReviews"
                    checked={filters.hasReviews}
                    onCheckedChange={(checked) =>
                      updateFilter("hasReviews", checked)
                    }
                  />
                  <label
                    htmlFor="hasReviews"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Has customer reviews
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}