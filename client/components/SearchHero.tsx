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
import { businessCategories, dubaiZones } from "@/lib/data";

interface SearchHeroProps {
  onSearch?: (query: string, category?: string, zone?: string) => void;
}

export function SearchHero({ onSearch }: SearchHeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSearch = () => {
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
    <div className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Header Section with Animations */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Trust Badge */}
          <div className="inline-flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold tracking-wide">
                  🇦🇪 DUBAI'S #1 IMMIGRATION DIRECTORY
                </span>
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black mb-8 leading-none">
            <span className="block mb-2">Find Your</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
              Immigration
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl mt-4 text-slate-200">
              Partner in Dubai
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12">
            Connect with verified visa agents, immigration consultants, and
            document services.
            <span className="block mt-2 text-cyan-300">
              Join thousands who found their perfect immigration solution.
            </span>
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`group cursor-pointer transform transition-all duration-300 ${
                  hoveredStat === index ? "scale-110" : "hover:scale-105"
                }`}
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <stat.icon
                    className={`w-8 h-8 ${stat.color} mx-auto mb-3 transition-transform group-hover:scale-110`}
                  />
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-300">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Search Form */}
        <div
          className={`max-w-6xl mx-auto transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ transitionDelay: "0.5s" }}
        >
          <div className="relative group">
            {/* Animated Border */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>

            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 lg:p-10 shadow-2xl border border-white/30">
              {/* Form Header */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-3">
                  Start Your Immigration Journey Today
                </h3>
                <p className="text-lg text-gray-600">
                  Find verified professionals who will guide you every step of
                  the way
                </p>
              </div>

              {/* Search Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                {/* Main Search */}
                <div className="lg:col-span-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                      <Search className="h-6 w-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                    </div>
                    <Input
                      placeholder="Search visa services, immigration consultants, document clearing..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-16 h-16 bg-gray-50/80 border-2 border-gray-200 text-gray-800 placeholder-gray-500 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-2xl text-lg font-medium transition-all duration-300 hover:border-gray-300"
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>

                {/* Category Select */}
                <div className="lg:col-span-3">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                      <Filter className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                    </div>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="h-16 pl-16 bg-gray-50/80 border-2 border-gray-200 text-gray-800 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-2xl text-lg transition-all duration-300 hover:border-gray-300">
                        <SelectValue placeholder="Service Type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
                        <SelectItem
                          value="all"
                          className="rounded-xl text-lg py-3"
                        >
                          All Services
                        </SelectItem>
                        {businessCategories.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="rounded-xl text-lg py-3"
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
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none z-10">
                      <MapPin className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                    </div>
                    <Select
                      value={selectedZone}
                      onValueChange={setSelectedZone}
                    >
                      <SelectTrigger className="h-16 pl-16 bg-gray-50/80 border-2 border-gray-200 text-gray-800 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-100 rounded-2xl text-lg transition-all duration-300 hover:border-gray-300">
                        <SelectValue placeholder="Dubai Area" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
                        <SelectItem
                          value="all"
                          className="rounded-xl text-lg py-3"
                        >
                          All Areas
                        </SelectItem>
                        {dubaiZones.map((zone) => (
                          <SelectItem
                            key={zone}
                            value={zone}
                            className="rounded-xl text-lg py-3"
                          >
                            {zone}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="text-center mb-6">
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 text-white font-bold px-16 py-6 text-xl h-auto rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Search className="w-7 h-7 mr-4" />
                  <span>Find Your Immigration Partner</span>
                </Button>
              </div>

              {/* Quick Search Tags */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4 font-medium">
                  ✨ Popular searches:
                </p>
                <div className="flex flex-wrap justify-center gap-3">
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
                      className="group px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-blue-700 hover:text-blue-800 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 transform border border-blue-200 hover:border-blue-300 hover:shadow-lg"
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
