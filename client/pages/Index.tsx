import { useState, useEffect } from "react";
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
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { SearchHero } from "@/components/SearchHero";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  businessCategories,
  sampleBusinesses,
  indianCities,
  visaTypes,
} from "@/lib/data";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch real featured businesses from database
  useEffect(() => {
    const fetchFeaturedBusinesses = async () => {
      try {
        // Add small delay to ensure server is ready
        await new Promise(resolve => setTimeout(resolve, 100));

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch("/api/scraped-businesses?limit=6", {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`API error: ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success && result.businesses && result.businesses.length > 0) {
          setFeaturedBusinesses(result.businesses);
          console.log("✅ Successfully loaded featured businesses from API");
        } else {
          console.warn("API returned unsuccessful result or no businesses:", result);
          // Fallback to sample data if API fails
          setFeaturedBusinesses(sampleBusinesses.slice(0, 6));
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.error("API request timed out after 5 seconds");
        } else {
          console.error("Error fetching featured businesses:", error);
        }
        // Fallback to sample data if fetch fails completely
        setFeaturedBusinesses(sampleBusinesses.slice(0, 6));
        console.log("⚠️ Using sample data as fallback");
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay before making the request to ensure everything is initialized
    const timer = setTimeout(fetchFeaturedBusinesses, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.title =
      "VisaConsult India - Find Trusted Visa Consultants | Student, Work & Tourist Visa Services";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "India's largest directory of verified visa consultants. Find trusted immigration experts for student visa, work visa, tourist visa in Delhi, Mumbai, Bangalore & all major cities. Compare ratings & reviews.",
      );
    }
  }, []);

  const handleSearch = (query: string, location: string, category: string) => {
    const searchParams = new URLSearchParams();
    if (query) searchParams.set("q", query);
    if (location && location !== "all") searchParams.set("location", location);
    if (category && category !== "all") searchParams.set("category", category);

    navigate(`/business?${searchParams.toString()}`);
  };

  const topCities = [
    { name: "Delhi", count: "450+", icon: "🏛️" },
    { name: "Mumbai", count: "380+", icon: "🌆" },
    { name: "Bangalore", count: "320+", icon: "💻" },
    { name: "Chennai", count: "250+", icon: "🌊" },
    { name: "Hyderabad", count: "200+", icon: "💎" },
    { name: "Kolkata", count: "180+", icon: "���" },
    { name: "Pune", count: "150+", icon: "🎓" },
    { name: "Ahmedabad", count: "120+", icon: "🏗️" },
  ];

  const visaServices = [
    {
      type: "Student Visa",
      description: "Study abroad consultants for universities worldwide",
      icon: <GraduationCap className="h-8 w-8" />,
      count: "2,500+",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      countries: ["USA", "Canada", "UK", "Australia", "Germany"],
    },
    {
      type: "Work Visa",
      description: "Employment visa experts for global opportunities",
      icon: <Briefcase className="h-8 w-8" />,
      count: "1,800+",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      countries: ["Canada", "Australia", "Germany", "UAE", "Singapore"],
    },
    {
      type: "Tourist Visa",
      description: "Travel visa services for leisure and business trips",
      icon: <Plane className="h-8 w-8" />,
      count: "3,200+",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      countries: ["USA", "Schengen", "UK", "Japan", "Thailand"],
    },
    {
      type: "Business Visa",
      description: "Corporate visa solutions for business expansion",
      icon: <Building className="h-8 w-8" />,
      count: "1,200+",
      color: "bg-orange-50 border-orange-200",
      iconColor: "text-orange-600",
      countries: ["USA", "UK", "Singapore", "UAE", "Hong Kong"],
    },
  ];

  const statsData = [
    {
      label: "Verified Consultants",
      value: "8,500+",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      label: "Successful Applications",
      value: "2.5L+",
      icon: <Award className="h-5 w-5" />,
    },
    {
      label: "Cities Covered",
      value: "50+",
      icon: <MapPin className="h-5 w-5" />,
    },
    {
      label: "Customer Reviews",
      value: "50K+",
      icon: <Star className="h-5 w-5" />,
    },
  ];

  const whyChooseUs = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Verified Professionals",
      description:
        "All consultants are verified with proper licenses and credentials",
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: "Genuine Reviews",
      description:
        "Real customer reviews and ratings to help you make informed decisions",
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support for all your visa-related queries",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Success Rate",
      description:
        "Track record of 95%+ success rate across all visa categories",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find India's Most
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}
                Trusted{" "}
              </span>
              Visa Consultants
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-4xl mx-auto">
              Connect with verified immigration experts across India. Get expert
              guidance for student visa, work visa, tourist visa and more.
              Compare ratings, read reviews & choose the best consultant for
              your needs.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center justify-center space-x-2 text-blue-600 mb-2">
                    {stat.icon}
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Debug Test Links - Remove in production */}
            <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-bold text-yellow-800 mb-3">
                🔧 Navigation Test Links:
              </h3>

              {/* Main Pages */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-yellow-700 mb-2">
                  Main Pages:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
                  <Link
                    to="/about"
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-center"
                  >
                    📄 About
                  </Link>
                  <Link
                    to="/contact"
                    className="px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-center"
                  >
                    📞 Contact
                  </Link>
                  <Link
                    to="/business"
                    className="px-3 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors text-center"
                  >
                    🔍 Browse
                  </Link>
                  <Link
                    to="/add-business"
                    className="px-3 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors text-center"
                  >
                    ➕ Add Business
                  </Link>
                  <Link
                    to="/admin"
                    className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-center"
                  >
                    ⚙️ Admin
                  </Link>
                  <Link
                    to="/login"
                    className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors text-center"
                  >
                    🔐 Login
                  </Link>
                  <Link
                    to="/privacy"
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-center"
                  >
                    🔒 Privacy
                  </Link>
                  <Link
                    to="/terms"
                    className="px-3 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition-colors text-center"
                  >
                    📋 Terms
                  </Link>
                </div>
              </div>

              {/* All 16 Cities Directory Pages */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-yellow-700 mb-2">
                  All 16 Cities Directory Pages:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 text-sm">
                  <Link
                    to="/business/delhi"
                    className="px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-center"
                  >
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
                      ⚖️ Immigration
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
              </div>
            </div>
          </div>

          {/* Search Component */}
          <div className="max-w-4xl mx-auto">
            <SearchHero onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Visa Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Visa Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore specialized visa services based on your travel purpose and
              destination
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visaServices.map((visa, index) => (
              <Card
                key={index}
                className={`${visa.color} hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                onClick={() =>
                  navigate(
                    `/business?category=${encodeURIComponent(visa.type + " Consultants")}`,
                  )
                }
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`${visa.iconColor} mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {visa.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {visa.type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    {visa.description}
                  </p>
                  <p className="text-sm font-medium text-gray-800 mb-3">
                    {visa.count} Consultants
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {visa.countries.map((country, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {country}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="mt-3 text-xs">
                    View All <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Cities */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Top Cities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find trusted visa consultants in India's major cities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topCities.map((city, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white"
                onClick={() => navigate(`/business?location=${city.name}`)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{city.icon}</div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {city.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {city.count} Consultants
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 group-hover:text-blue-600"
                  >
                    Explore <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => navigate("/business")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              View All Cities <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Consultants */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Visa Consultants
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Top-rated and verified immigration experts with proven success
              records
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg border p-4 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))
              : featuredBusinesses
                  .slice(0, 6)
                  .map((business) => (
                    <BusinessCard key={business.id} business={business} />
                  ))}
          </div>

          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => navigate("/business")}
              size="lg"
            >
              View All Consultants <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Cities Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Consultants by City
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore trusted visa consultants in major Indian cities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              "Delhi",
              "Mumbai",
              "Bangalore",
              "Chennai",
              "Hyderabad",
              "Pune",
              "Jaipur",
              "Lucknow",
              "Indore",
              "Chandigarh",
              "Gurgaon",
              "Noida",
              "Dehradun",
              "Kochi",
              "Kolkata",
              "Ahmedabad",
            ].map((city, index) => (
              <Link
                key={city}
                to={`/business/${city.toLowerCase()}`}
                className="group relative"
              >
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
                        "🌸",
                        "🏗️",
                        "🚇",
                        "🏔️",
                        "🌴",
                        "🎭",
                        "💼",
                      ][index]
                    }
                  </div>
                  <div className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                    {city}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {Math.floor(Math.random() * 50) + 10}+ Consultants
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" size="lg">
              <Link to="/business">View All Cities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose VisaConsult India?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              We're committed to connecting you with the most reliable visa
              consultants across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="opacity-90">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Visa Journey?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect visa
            consultant through our platform
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/business")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Find Consultants <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/plans")}
              size="lg"
              className="border-white text-white hover:bg-white hover:text-gray-900"
            >
              List Your Business <Building className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                VisaConsult India
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
          </div>
        </div>
      </footer>
    </div>
  );
}
