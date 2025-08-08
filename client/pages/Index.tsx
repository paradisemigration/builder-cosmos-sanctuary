import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Building,
  Shield,
  Globe,
  MapPin,
  Phone,
  Award,
  Briefcase,
  GraduationCap,
  Plane,
  Clock,
  ThumbsUp,
  Play,
  ChevronRight,
  Zap,
  Target,
  FileCheck,
  HeadphonesIcon,
  Loader2,
  X,
  MessageSquare,
  PhoneCall,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DebugPageInfo } from "@/components/DebugPageInfo";
import { EnquiryPopup, FloatingCTA } from "@/components/EnquiryPopup";
import { businessCategories, Business } from "@/lib/data";
import { allCategories, allIndianCities } from "@/lib/all-categories";
import { useGeolocation } from "@/hooks/useGeolocation";
import {
  useFeaturedBusinesses,
  useBusinessStats,
} from "@/hooks/useBusinessData";
import { generateHomeMeta, setPageMeta, setSEOLinks } from "@/lib/meta-utils";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [activeService, setActiveService] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  // Use API hooks
  const {
    businesses: featuredBusinesses,
    loading: featuredLoading,
    error: featuredError,
  } = useFeaturedBusinesses();

  const {
    stats,
    loading: statsLoading,
    error: statsError,
  } = useBusinessStats();

  // Use geolocation hook
  const {
    location,
    isLoading: locationLoading,
    error: locationError,
  } = useGeolocation();

  // Set homepage SEO meta data
  useEffect(() => {
<<<<<<< HEAD
    const homePageMeta = {
      title:
        "TheVisaBay.com - Find Top Rated Visa Consultants & Immigration Experts",
      description:
        "Find trusted visa consultants and immigration experts across India and UAE. Compare services, read authentic reviews, and get expert guidance for study abroad, work permits, tourist visas, and permanent residence applications. Professional visa consultation with proven success rates.",
      keywords:
        "visa consultants, immigration consultants, study abroad consultants, work permit agents, tourist visa services, immigration lawyers, pr consultants, visa agents, visa processing, visa services, immigration services, best visa consultants, top immigration experts, visa consultation, visa guidance",
      robots:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
      author: "TheVisaBay.com",
      viewport: "width=device-width, initial-scale=1.0",
    };

=======
    const homePageMeta = generateHomeMeta();
>>>>>>> 060f04127058a42f6cdc25ceba3986b54e79bace
    setPageMeta(homePageMeta);

    setSEOLinks({
      canonical: "/",
      alternate: ["/", "/business", "/all-categories"],
    });
  }, []);

  // Auto-detect city from geolocation
  useEffect(() => {
    if (location && location.city && !selectedCity) {
      // Find matching city in our cities list
      const matchingCity = allIndianCities.find(
        (city) =>
          city.toLowerCase().includes(location.city.toLowerCase()) ||
          location.city.toLowerCase().includes(city.toLowerCase()),
      );

      if (matchingCity) {
        setSelectedCity(matchingCity);
      }
    }
  }, [location, selectedCity]);

  // Handle category autocomplete
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const filtered = allCategories
        .filter(
          (category) =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            category.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        )
        .slice(0, 8); // Limit to 8 suggestions

      setFilteredCategories(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredCategories([]);
      setSelectedCategory(null);
    }
  }, [searchQuery]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    document.title =
      "TheVisaBay.com - Find Trusted Visa Consultants | Student, Work & Tourist Visa Services";
=======
  // Combined loading state
  const loading = featuredLoading || statsLoading;
>>>>>>> 060f04127058a42f6cdc25ceba3986b54e79bace

  // Auto-rotate service highlights
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    // If we have both city and a selected category, go to city+category page
    if (selectedCity && selectedCategory) {
      const citySlug = selectedCity.toLowerCase().replace(/\s+/g, "-");
      const categorySlug = selectedCategory.slug;
      navigate(`/business/${citySlug}/${categorySlug}`);
    }
    // If we have a city but search query (not a selected category), search in that city
    else if (selectedCity && searchQuery.trim()) {
      const citySlug = selectedCity.toLowerCase().replace(/\s+/g, "-");
      navigate(
        `/business/${citySlug}?q=${encodeURIComponent(searchQuery.trim())}`,
      );
    }
    // If we have selected category but no city, go to category page
    else if (selectedCategory && !selectedCity) {
      navigate(`/category/${selectedCategory.slug}`);
    }
    // If we have search query but no specific category/city, do general search
    else if (searchQuery.trim()) {
      navigate(`/business?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    // Default fallback
    else {
      navigate("/business");
    }

    // Close suggestions after search
    setShowSuggestions(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSearchQuery(category.name);
    setShowSuggestions(false);
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
    setSearchQuery("");
    setShowSuggestions(false);
    // Focus back on search input
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Clear selected category if user changes search query
    if (selectedCategory && value !== selectedCategory.name) {
      setSelectedCategory(null);
    }
  };

  const majorCities = [
    {
      name: "Delhi",
      count: "450+",
      image:
        "https://cdn.pixabay.com/photo/2020/02/02/17/24/delhi-4813618_1280.jpg",
      fallback:
        "https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      flag: "🇮����",
      description: "India Gate & Red Fort",
      color: "#3B82F6",
    },
    {
      name: "Mumbai",
      count: "380+",
      image:
        "https://cdn.pixabay.com/photo/2017/01/20/00/30/malabar-hill-1995213_1280.jpg",
      fallback:
        "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      flag: "🇮🇳",
      description: "Gateway of India",
      color: "#6366F1",
    },
    {
      name: "Bangalore",
      count: "320+",
      image:
        "https://cdn.pixabay.com/photo/2017/07/15/13/45/bangalore-2505571_1280.jpg",
      fallback:
        "https://images.pexels.com/photos/962464/pexels-photo-962464.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      flag: "🇮🇳",
      description: "Silicon Valley of India",
      color: "#10B981",
    },
    {
      name: "Chennai",
      count: "290+",
      image:
        "https://cdn.pixabay.com/photo/2019/02/07/04/23/chennai-3979988_1280.jpg",
      fallback:
        "https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      flag: "🇮🇳",
      description: "Marina Beach & Temples",
      color: "#F59E0B",
    },
    {
      name: "Hyderabad",
      count: "250+",
      image:
        "https://cdn.pixabay.com/photo/2020/01/13/17/42/charminar-4762588_1280.jpg",
      fallback:
        "https://images.pexels.com/photos/4321802/pexels-photo-4321802.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      flag: "🇮🇳",
      description: "Charminar & Tech City",
      color: "#8B5CF6",
    },
    {
      name: "Pune",
      count: "220+",
      image:
        "https://cdn.pixabay.com/photo/2020/02/06/06/09/architecture-4823769_1280.jpg",
      fallback:
        "https://images.pexels.com/photos/1007425/pexels-photo-1007425.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      flag: "🇮🇳",
      description: "Cultural Capital",
      color: "#EF4444",
    },
    {
      name: "Kolkata",
      count: "200+",
      image:
        "https://cdn.pixabay.com/photo/2020/03/02/16/19/howrah-bridge-4896110_1280.jpg",
      fallback:
        "https://images.pexels.com/photos/1007425/pexels-photo-1007425.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      flag: "🇮🇳",
      description: "City of Joy",
      color: "#06B6D4",
    },
    {
      name: "Ahmedabad",
      count: "180+",
      image:
        "https://cdn.pixabay.com/photo/2019/11/16/12/26/ahmedabad-4630555_1280.jpg",
      fallback:
        "https://images.pexels.com/photos/1007425/pexels-photo-1007425.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      flag: "🇮🇳",
      description: "Heritage & Innovation",
      color: "#F97316",
    },
  ];

  const visaServices = [
    {
      type: "Student Visa",
      description:
        "Expert guidance for studying abroad at top universities worldwide",
      icon: <GraduationCap className="h-12 w-12" />,
      count: "2,500+",
      color: "from-blue-500 to-indigo-600",
      countries: ["USA", "Canada", "UK", "Australia", "Germany"],
      features: [
        "University Selection",
        "Application Support",
        "Scholarship Guidance",
      ],
    },
    {
      type: "Work Visa",
      description:
        "Professional assistance for global employment opportunities",
      icon: <Briefcase className="h-12 w-12" />,
      count: "1,800+",
      color: "from-green-500 to-emerald-600",
      countries: ["Canada", "Australia", "Germany", "UAE", "Singapore"],
      features: [
        "Job Search Support",
        "Work Permit Processing",
        "Corporate Transfers",
      ],
    },
    {
      type: "Tourist Visa",
      description: "Hassle-free travel visa services for leisure and business",
      icon: <Plane className="h-12 w-12" />,
      count: "3,200+",
      color: "from-purple-500 to-violet-600",
      countries: ["USA", "Schengen", "UK", "Japan", "Thailand"],
      features: ["Fast Processing", "Document Support", "Travel Insurance"],
    },
    {
      type: "Business Visa",
      description: "Corporate visa solutions for business expansion globally",
      icon: <Building className="h-12 w-12" />,
      count: "1,200+",
      color: "from-orange-500 to-red-500",
      countries: ["USA", "UK", "Singapore", "UAE", "Hong Kong"],
      features: ["Investment Visas", "Entrepreneur Support", "Business Setup"],
    },
  ];

  // Dynamic stats data from API or fallback
  const statsData = [
    {
      label: "Verified Consultants",
      value: stats?.totalBusinesses
        ? `${stats.totalBusinesses.toLocaleString()}+`
        : "1,500+",
      icon: <Shield className="h-8 w-8" />,
    },
    {
      label: "Customer Reviews",
      value: stats?.totalReviews
        ? `${stats.totalReviews.toLocaleString()}+`
        : "10,000+",
      icon: <CheckCircle className="h-8 w-8" />,
    },
    {
      label: "Cities Covered",
      value: stats?.citiesCount ? `${stats.citiesCount}+` : "100+",
      icon: <MapPin className="h-8 w-8" />,
    },
    {
      label: "Google Places",
      value: stats?.totalGooglePlaces
        ? `${stats.totalGooglePlaces.toLocaleString()}+`
        : "1,200+",
      icon: <Globe className="h-8 w-8" />,
    },
  ];

  const whyChooseUs = [
    {
      title: "Verified Experts",
      description:
        "All consultants are thoroughly verified with proven track records",
      icon: <Shield className="h-6 w-6" />,
      color: "text-blue-600",
    },
    {
      title: "Best Success Rate",
      description: "95% success rate with transparent and reliable service",
      icon: <Target className="h-6 w-6" />,
      color: "text-green-600",
    },
    {
      title: "Quick Processing",
      description: "Fast-track your applications with expert guidance",
      icon: <Zap className="h-6 w-6" />,
      color: "text-yellow-600",
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock assistance for all your visa needs",
      icon: <HeadphonesIcon className="h-6 w-6" />,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Indian Flag */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-12 sm:pb-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10"></div>
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        </div>

        {/* Indian Flag Element */}
        <div className="absolute top-24 right-4 sm:right-8 opacity-60 z-10">
          <div className="w-16 h-10 sm:w-20 sm:h-12 border border-gray-200 rounded-md overflow-hidden shadow-lg">
            <div className="h-1/3 bg-orange-500"></div>
            <div className="h-1/3 bg-white flex items-center justify-center">
              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-900 rounded-full relative">
                <div className="absolute inset-0.5 bg-blue-900 rounded-full"></div>
              </div>
            </div>
            <div className="h-1/3 bg-green-600"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-200">
              🇮🇳 India's #1 Visa Consultation Platform
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
              Find India's Best
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                Visa consultants
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Connect with verified immigration experts across 100+ Indian
              cities. Get expert guidance for study abroad, work visas, tourism,
              and permanent residence applications.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
              <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search visa consultants, categories..."
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        onFocus={() => {
                          if (
                            searchQuery.length >= 2 &&
                            filteredCategories.length > 0
                          ) {
                            setShowSuggestions(true);
                          }
                        }}
                        className="pl-12 pr-4 py-3 sm:py-4 border-0 focus:ring-0 text-base sm:text-lg bg-transparent w-full"
                      />
                      {selectedCategory && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Badge
                            variant="secondary"
                            className="text-xs flex items-center gap-1 pr-1"
                          >
                            <span>{selectedCategory.name}</span>
                            <button
                              onClick={handleClearCategory}
                              className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                              title="Clear category"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Autocomplete Suggestions */}
                    {showSuggestions &&
                      filteredCategories.length > 0 &&
                      !selectedCategory && (
                        <div
                          ref={suggestionsRef}
                          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                        >
                          {filteredCategories.map((category, index) => (
                            <div
                              key={category.slug}
                              className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              onClick={() => handleCategorySelect(category)}
                            >
                              <div className="font-medium text-gray-900">
                                {category.name}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {category.description}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                  <div className="sm:flex-initial">
                    <div className="relative">
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full sm:w-40 px-4 py-3 sm:py-4 border-0 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 text-base appearance-none"
                      >
                        <option value="">
                          {locationLoading ? "Detecting..." : "Select City"}
                        </option>
                        {allIndianCities.slice(0, 20).map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      {locationLoading && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                      )}
                      {location && !locationLoading && (
                        <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 text-base sm:text-lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  {selectedCity && selectedCategory
                    ? `Search in ${selectedCity}`
                    : "Search Experts"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Quick Search Tags */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {[
                  "Study Abroad",
                  "Work Visa",
                  "Tourist Visa",
                  "PR Services",
                ].map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    onClick={() => setSearchQuery(tag)}
                  >
<<<<<<< HEAD
                    🏛️ Delhi
                  </Link>
                  <Link
                    to="/business/mumbai"
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-center"
                  >
                    🌆 Mumbai
                  </Link>
                  <Link
                    to="/business/bangalore"
                    className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-center"
                  >
                    🌿 Bangalore
                  </Link>
                  <Link
                    to="/business/chennai"
                    className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors text-center"
                  >
                    🏖️ Chennai
                  </Link>
                  <Link
                    to="/business/hyderabad"
                    className="px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-center"
                  >
                    💎 Hyderabad
                  </Link>
                  <Link
                    to="/business/kolkata"
                    className="px-3 py-2 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition-colors text-center"
                  >
                    🎭 Kolkata
                  </Link>
                  <Link
                    to="/business/pune"
                    className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors text-center"
                  >
                    🎓 Pune
                  </Link>
                  <Link
                    to="/business/ahmedabad"
                    className="px-3 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors text-center"
                  >
                    🏺 Ahmedabad
                  </Link>
                  <Link
                    to="/business/jaipur"
                    className="px-3 py-2 bg-rose-100 text-rose-700 rounded hover:bg-rose-200 transition-colors text-center"
                  >
                    🏰 Jaipur
                  </Link>
                  <Link
                    to="/business/lucknow"
                    className="px-3 py-2 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors text-center"
                  >
                    🕌 Lucknow
                  </Link>
                  <Link
                    to="/business/indore"
                    className="px-3 py-2 bg-lime-100 text-lime-700 rounded hover:bg-lime-200 transition-colors text-center"
                  >
                    🌾 Indore
                  </Link>
                  <Link
                    to="/business/chandigarh"
                    className="px-3 py-2 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors text-center"
                  >
                    🌹 Chandigarh
                  </Link>
                  <Link
                    to="/business/gurgaon"
                    className="px-3 py-2 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors text-center"
                  >
                    🏙️ Gurgaon
                  </Link>
                  <Link
                    to="/business/noida"
                    className="px-3 py-2 bg-cyan-100 text-cyan-700 rounded hover:bg-cyan-200 transition-colors text-center"
                  >
                    🏢 Noida
                  </Link>
                  <Link
                    to="/business/dehradun"
                    className="px-3 py-2 bg-sky-100 text-sky-700 rounded hover:bg-sky-200 transition-colors text-center"
                  >
                    ⛰️ Dehradun
                  </Link>
                  <Link
                    to="/business/kochi"
                    className="px-3 py-2 bg-violet-100 text-violet-700 rounded hover:bg-violet-200 transition-colors text-center"
                  >
                    🏝️ Kochi
                  </Link>
                </div>
              </div>

              {/* Sample Business Pages */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-yellow-700 mb-2">
                  Sample Business Pages:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                  <Link
                    to="/business/1"
                    className="px-3 py-2 bg-cyan-100 text-cyan-700 rounded hover:bg-cyan-200 transition-colors text-center"
                  >
                    🏢 Business (Legacy)
                  </Link>
                  <Link
                    to="/business/delhi/delhi-global-visa-consultants"
                    className="px-3 py-2 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors text-center"
                  >
                    🏢 Business (New URL)
                  </Link>
                  <Link
                    to="/business/mumbai/mumbai-immigration-hub"
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-center"
                  >
                    🏢 Mumbai Business
                  </Link>
                </div>
              </div>

              {/* City Category Pages */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-yellow-700 mb-2">
                  City Category Pages (8 Categories × 16 Cities = 128 Pages):
                </h4>

                {/* Delhi Categories */}
                <div className="mb-3">
                  <h5 className="text-xs text-yellow-600 mb-1">
                    Delhi Categories:
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-xs">
                    <Link
                      to="/business/delhi/study-abroad"
                      className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors text-center"
                    >
                      🎓 Study Abroad
                    </Link>
                    <Link
                      to="/business/delhi/immigration-consultants"
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-center"
                    >
                      ��️ Immigration
                    </Link>
                    <Link
                      to="/business/delhi/visa-consultants"
                      className="px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-center"
                    >
                      📋 Visa
                    </Link>
                    <Link
                      to="/business/delhi/work-permit"
                      className="px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors text-center"
                    >
                      💼 Work
                    </Link>
                    <Link
                      to="/business/delhi/visa-services"
                      className="px-2 py-1 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition-colors text-center"
                    >
                      🛂 Visa Svc
                    </Link>
                    <Link
                      to="/business/delhi/immigration-services"
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors text-center"
                    >
                      🏛️ Immigration Svc
                    </Link>
                    <Link
                      to="/business/delhi/overseas-services"
                      className="px-2 py-1 bg-rose-100 text-rose-700 rounded hover:bg-rose-200 transition-colors text-center"
                    >
                      🌍 Overseas
                    </Link>
                    <Link
                      to="/business/delhi/education-services"
                      className="px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors text-center"
                    >
                      📚 Education
                    </Link>
                  </div>
                </div>

                {/* Sample Categories from Other Cities */}
                <div className="mb-3">
                  <h5 className="text-xs text-yellow-600 mb-1">
                    Other Cities Sample Categories:
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-xs">
                    <Link
                      to="/business/mumbai/study-abroad"
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-center"
                    >
                      Mumbai Study
                    </Link>
                    <Link
                      to="/business/bangalore/work-permit"
                      className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-center"
                    >
                      Bangalore Work
                    </Link>
                    <Link
                      to="/business/chennai/visa-consultants"
                      className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors text-center"
                    >
                      Chennai Visa
                    </Link>
                    <Link
                      to="/business/pune/immigration-services"
                      className="px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-center"
                    >
                      Pune Immigration
                    </Link>
                    <Link
                      to="/business/hyderabad/overseas-services"
                      className="px-2 py-1 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition-colors text-center"
                    >
                      Hyderabad Overseas
                    </Link>
                    <Link
                      to="/business/kolkata/education-services"
                      className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors text-center"
                    >
                      Kolkata Education
                    </Link>
                    <Link
                      to="/business/jaipur/visa-services"
                      className="px-2 py-1 bg-rose-100 text-rose-700 rounded hover:bg-rose-200 transition-colors text-center"
                    >
                      Jaipur Visa Svc
                    </Link>
                    <Link
                      to="/business/gurgaon/study-abroad"
                      className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors text-center"
                    >
                      Gurgaon Study
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-xs text-yellow-700 text-center">
                🚀 Complete Navigation Test: 16 Cities × 8 Categories = 128
                subcategory pages + main pages. Check browser console for debug
                info.
=======
                    {tag}
                  </Badge>
                ))}
>>>>>>> 060f04127058a42f6cdc25ceba3986b54e79bace
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 sm:py-12 bg-white relative -mt-8 sm:-mt-12 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {statsData.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium text-sm sm:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visa Services Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              Our Services
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Visa Services
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Expert assistance for all types of visa applications with highest
              success rates
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {visaServices.map((service, index) => (
              <Card
                key={index}
                className={`group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white ${
                  activeService === index
                    ? "ring-2 ring-blue-500 shadow-xl"
                    : ""
                }`}
              >
                <CardHeader className="pb-4">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-bold mb-2">
                    {service.type}
                  </CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {service.count} Experts
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {service.countries.map((country) => (
                      <Badge
                        key={country}
                        variant="secondary"
                        className="text-xs"
                      >
                        {country}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Major Cities Section with Images */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">
              🇮🇳 Across India
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Top Cities We Serve
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Find trusted visa consultants in major Indian cities
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {majorCities.map((city, index) => (
              <Link
                key={index}
                to={`/business/${city.name.toLowerCase()}`}
                className="group block"
              >
<<<<<<< HEAD
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105 border border-gray-100">
                  <div className="text-2xl mb-2">
                    {
                      [
                        "🏛️",
                        "🌆",
                        "🏢",
                        "🏙️",
                        "💎",
                        "🎯",
                        "🏰",
                        "🕌",
                        "🌟",
                        "����",
                        "🏗️",
                        "🚇",
                        "🏔️",
                        "🌴",
                        "🎭",
                        "💼",
                      ][index]
                    }
=======
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                  <div className="relative h-36 sm:h-32 overflow-hidden">
                    <img
                      src={city.image}
                      alt={`${city.name} - ${city.description}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallbackAttempted) {
                          target.dataset.fallbackAttempted = "true";
                          target.src = city.fallback;
                        } else {
                          // Create a reliable SVG fallback
                          const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">
                            <defs>
                              <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:${city.color || "#3B82F6"};stop-opacity:1" />
                                <stop offset="100%" style="stop-color:${city.color || "#1E40AF"};stop-opacity:0.8" />
                              </linearGradient>
                            </defs>
                            <rect width="600" height="300" fill="url(#grad${index})"/>
                            <text x="300" y="140" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">${city.name}</text>
                            <text x="300" y="170" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" opacity="0.9">${city.description}</text>
                            <text x="300" y="195" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.8">${city.count} Consultants</text>
                          </svg>`;
                          target.src = `data:image/svg+xml;base64,${btoa(svgContent)}`;
                        }
                      }}
                      onLoad={(e) => {
                        // Reset fallback flag on successful load
                        delete e.target.dataset.fallbackAttempted;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-2 right-2 text-lg sm:text-xl">
                      {city.flag}
                    </div>
                    <div className="absolute bottom-2 left-3 text-white">
                      <div className="text-base sm:text-lg font-bold">
                        {city.name}
                      </div>
                      <div className="text-xs sm:text-sm opacity-90">
                        {city.count} Consultants
                      </div>
                    </div>
>>>>>>> 060f04127058a42f6cdc25ceba3986b54e79bace
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 text-sm sm:text-base">
                          Explore {city.name}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {city.description}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/browse">
              <Button variant="outline" size="lg" className="px-8">
                View All Cities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose TheVisaBay.com?
=======
      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800">
              Why Choose Us
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              India's Most Trusted Platform
>>>>>>> 060f04127058a42f6cdc25ceba3986b54e79bace
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Experience the difference with our verified experts and proven
              success rate
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {whyChooseUs.map((feature, index) => (
              <div key={index} className="text-center">
                <div
                  className={`inline-flex p-4 rounded-2xl bg-white shadow-lg mb-6 ${feature.color}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Consultants Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800">
              Featured Experts
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Top rated consultants
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Connect with our most experienced and successful visa consultants
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredBusinesses.map((business, index) => (
                <BusinessCard
                  key={business.id || index}
                  business={business}
                  className="transform hover:-translate-y-2 transition-all duration-300"
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/browse">
              <Button
                size="lg"
                className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                View All Consultants
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                TheVisaBay.com
              </h3>
              <p className="text-sm opacity-80">
                India's most trusted platform for finding verified visa
                consultants and immigration experts.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/business" className="hover:text-white">
                    Browse Consultants
                  </Link>
                </li>
                <li>
                  <Link to="/plans" className="hover:text-white">
                    Pricing Plans
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Visa Services</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/business?category=Student Visa Consultants"
                    className="hover:text-white"
                  >
                    Student Visa
                  </Link>
                </li>
                <li>
                  <Link
                    to="/business?category=Work Visa Consultants"
                    className="hover:text-white"
                  >
                    Work Visa
                  </Link>
                </li>
                <li>
                  <Link
                    to="/business?category=Tourist Visa Services"
                    className="hover:text-white"
                  >
                    Tourist Visa
                  </Link>
                </li>
                <li>
                  <Link
                    to="/business?category=Business Visa Services"
                    className="hover:text-white"
                  >
                    Business Visa
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/report" className="hover:text-white">
                    Report Issue
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm opacity-80">
            <p>&copy; 2024 VisaConsult India. All rights reserved.</p>
=======
      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Your Visa Journey?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-4">
            Join thousands of satisfied customers who have successfully achieved
            their visa goals with our expert consultants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link to="/browse" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium"
              >
                Find Consultants
                <Search className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/list-business" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium bg-white text-blue-600 hover:bg-gray-100 border-2 border-white shadow-lg"
              >
                List Your Business
                <Building className="ml-2 h-5 w-5" />
              </Button>
            </Link>
>>>>>>> 060f04127058a42f6cdc25ceba3986b54e79bace
          </div>
        </div>
      </section>

      {/* Floating Call-to-Action Button */}
      <FloatingCTA onClick={() => setShowEnquiryPopup(true)} />

      {/* Enquiry Form Popup */}
      <EnquiryPopup
        isOpen={showEnquiryPopup}
        onClose={() => setShowEnquiryPopup(false)}
        onSubmit={(data) => {
          console.log("Enquiry submitted:", data);
          // Add your submission logic here
        }}
      />

      {/* Debug Page Info */}
      <DebugPageInfo />
    </div>
  );
}
