import { useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { businessCategories, dubaiZones } from "@/lib/data";

interface SearchHeroProps {
  onSearch?: (query: string, category?: string, zone?: string) => void;
}

export function SearchHero({ onSearch }: SearchHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("");

  const handleSearch = () => {
    onSearch?.(
      searchQuery,
      selectedCategory === "all" ? "" : selectedCategory,
      selectedZone === "all" ? "" : selectedZone,
    );
  };

  return (
    <div className="relative bg-gradient-to-br from-primary via-primary to-dubai-blue text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/api/placeholder/1200/600')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-dubai-blue/90" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Trusted
            <span className="block text-dubai-gold">Immigration Services</span>
            <span className="block">in Dubai</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover verified visa agents, immigration consultants, and document
            services. Read reviews and find the right professionals for your
            needs.
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search for visa services, agents, consultants..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-12 flex lg:flex md:flex sm:flex">
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
                <SelectTrigger className="h-12 flex lg:flex md:flex sm:flex">
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
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSearch}
                size="lg"
                className="flex-1 h-12 text-base font-semibold"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Services
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-12 text-base px-6 bg-white/80 border-white/30 text-foreground hover:bg-white hover:text-primary"
              >
                <Filter className="w-5 h-5 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Categories */}
        <div className="max-w-4xl mx-auto mt-12">
          <h3 className="text-lg font-semibold mb-4 text-center text-white/90">
            Popular Services
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {businessCategories.slice(0, 4).map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/40 text-white hover:bg-white hover:text-primary font-medium"
                onClick={() => onSearch?.("", category, "")}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
