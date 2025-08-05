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
  Play,
  ChevronRight,
  Zap,
  Target,
  FileCheck,
  HeadphonesIcon,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { BusinessCard } from "@/components/BusinessCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DebugPageInfo } from "@/components/DebugPageInfo";
import {
  businessCategories,
  sampleBusinesses,
  type Business,
} from "@/lib/data";
import { generateHomeMeta, setPageMeta, setSEOLinks } from "@/lib/meta-utils";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeService, setActiveService] = useState(0);
  const navigate = useNavigate();

  // Set homepage SEO meta data
  useEffect(() => {
    const homePageMeta = generateHomeMeta();
    setPageMeta(homePageMeta);

    setSEOLinks({
      canonical: "/",
      alternate: ["/", "/business", "/all-categories"],
    });
  }, []);

  // Fetch featured businesses
  useEffect(() => {
    const fetchFeaturedBusinesses = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Use sample data for demonstration
        const featured = sampleBusinesses.slice(0, 6).map(business => ({
          ...business,
          isFeatured: true
        }));

        setFeaturedBusinesses(featured);
      } catch (error) {
        console.error("Error fetching featured businesses:", error);
        setFeaturedBusinesses(sampleBusinesses.slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedBusinesses();
  }, []);

  // Auto-rotate service highlights
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const majorCities = [
    {
      name: "Delhi",
      count: "450+",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=240&fit=crop&crop=center",
      flag: "🇮🇳",
      description: "India Gate & Red Fort"
    },
    {
      name: "Mumbai",
      count: "380+",
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&h=240&fit=crop&crop=center",
      flag: "🇮🇳",
      description: "Gateway of India"
    },
    {
      name: "Bangalore",
      count: "320+",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&h=240&fit=crop&crop=center",
      flag: "🇮🇳",
      description: "Silicon Valley of India"
    },
    {
      name: "Chennai",
      count: "290+",
      image: "https://images.unsplash.com/photo-1594473878385-95d25d4dbecf?w=400&h=240&fit=crop&crop=center",
      flag: "🇮🇳",
      description: "Marina Beach & Temples"
    },
    {
      name: "Hyderabad",
      count: "250+",
      image: "https://images.unsplash.com/photo-1603911302913-9e632eac4475?w=400&h=240&fit=crop&crop=center",
      flag: "🇮🇳",
      description: "Charminar & Tech City"
    },
    {
      name: "Pune",
      count: "220+",
      image: "https://images.unsplash.com/photo-1595343627009-a4d8c6b36e30?w=400&h=240&fit=crop&crop=center",
      flag: "🇮🇳",
      description: "Cultural Capital"
    },
    {
      name: "Kolkata",
      count: "200+",
      image: "https://images.unsplash.com/photo-1618473384401-c9c7cc954e42?w=400&h=240&fit=crop&crop=center",
      flag: "🇮🇳",
      description: "City of Joy"
    },
    {
      name: "Ahmedabad",
      count: "180+",
      image: "https://images.unsplash.com/photo-1587135941948-670b381f08ce?w=400&h=240&fit=crop&crop=center",
      flag: "🇮🇳",
      description: "Heritage & Innovation"
    },
  ];

  const visaServices = [
    {
      type: "Student Visa",
      description: "Expert guidance for studying abroad at top universities worldwide",
      icon: <GraduationCap className="h-12 w-12" />,
      count: "2,500+",
      color: "from-blue-500 to-indigo-600",
      countries: ["USA", "Canada", "UK", "Australia", "Germany"],
      features: ["University Selection", "Application Support", "Scholarship Guidance"]
    },
    {
      type: "Work Visa",
      description: "Professional assistance for global employment opportunities",
      icon: <Briefcase className="h-12 w-12" />,
      count: "1,800+",
      color: "from-green-500 to-emerald-600",
      countries: ["Canada", "Australia", "Germany", "UAE", "Singapore"],
      features: ["Job Search Support", "Work Permit Processing", "Corporate Transfers"]
    },
    {
      type: "Tourist Visa",
      description: "Hassle-free travel visa services for leisure and business",
      icon: <Plane className="h-12 w-12" />,
      count: "3,200+",
      color: "from-purple-500 to-violet-600",
      countries: ["USA", "Schengen", "UK", "Japan", "Thailand"],
      features: ["Fast Processing", "Document Support", "Travel Insurance"]
    },
    {
      type: "Business Visa",
      description: "Corporate visa solutions for business expansion globally",
      icon: <Building className="h-12 w-12" />,
      count: "1,200+",
      color: "from-orange-500 to-red-500",
      countries: ["USA", "UK", "Singapore", "UAE", "Hong Kong"],
      features: ["Investment Visas", "Entrepreneur Support", "Business Setup"]
    },
  ];

  const statsData = [
    { label: "Verified Consultants", value: "8,500+", icon: <Shield className="h-8 w-8" /> },
    { label: "Successful Applications", value: "75,000+", icon: <CheckCircle className="h-8 w-8" /> },
    { label: "Countries Covered", value: "50+", icon: <Globe className="h-8 w-8" /> },
    { label: "Cities in India", value: "100+", icon: <MapPin className="h-8 w-8" /> },
  ];

  const whyChooseUs = [
    {
      title: "Verified Experts",
      description: "All consultants are thoroughly verified with proven track records",
      icon: <Shield className="h-6 w-6" />,
      color: "text-blue-600"
    },
    {
      title: "Best Success Rate",
      description: "95% success rate with transparent and reliable service",
      icon: <Target className="h-6 w-6" />,
      color: "text-green-600"
    },
    {
      title: "Quick Processing",
      description: "Fast-track your applications with expert guidance",
      icon: <Zap className="h-6 w-6" />,
      color: "text-yellow-600"
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock assistance for all your visa needs",
      icon: <HeadphonesIcon className="h-6 w-6" />,
      color: "text-purple-600"
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section with Indian Flag */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-16 sm:pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-25"></div>

        {/* Indian Flag Element */}
        <div className="absolute top-20 right-10 opacity-10">
          <div className="w-32 h-20 border border-gray-200 rounded-sm overflow-hidden shadow-lg">
            <div className="h-1/3 bg-orange-500"></div>
            <div className="h-1/3 bg-white flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-blue-800 rounded-full relative">
                <div className="absolute inset-1 bg-blue-800 rounded-full"></div>
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
                Visa Consultants
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Connect with verified immigration experts across 100+ Indian cities. Get expert guidance for study abroad, work visas, tourism, and permanent residence applications.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
              <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Search visa consultants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-12 pr-4 py-3 sm:py-4 border-0 focus:ring-0 text-base sm:text-lg bg-transparent"
                      />
                    </div>
                  </div>
                  <div className="sm:flex-initial">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full sm:w-40 px-4 py-3 sm:py-4 border-0 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 text-base"
                    >
                      <option value="">Select City</option>
                      {majorCities.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 text-base sm:text-lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search Experts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Quick Search Tags */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["Study Abroad", "Work Visa", "Tourist Visa", "PR Services"].map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white relative -mt-12 sm:-mt-16 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {statsData.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visa Services Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800">Our Services</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Visa Services
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Expert assistance for all types of visa applications with highest success rates
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {visaServices.map((service, index) => (
              <Card
                key={index}
                className={`group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white ${
                  activeService === index ? "ring-2 ring-blue-500 shadow-xl" : ""
                }`}
              >
                <CardHeader className="pb-4">
                  <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-bold mb-2">{service.type}</CardTitle>
                  <Badge variant="outline" className="w-fit">{service.count} Experts</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {service.countries.map((country) => (
                      <Badge key={country} variant="secondary" className="text-xs">
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
            <Badge className="mb-4 bg-green-100 text-green-800">���🇳 Across India</Badge>
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
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                  <div className="relative h-32 sm:h-28 overflow-hidden">
                    <img
                      src={city.image}
                      alt={`${city.name} - ${city.description}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240"><rect width="400" height="240" fill="%23${index % 2 === 0 ? '3B82F6' : '6366F1'}"/><text x="200" y="120" font-family="Arial" font-size="20" fill="white" text-anchor="middle" dy="6">${city.name}</text></svg>`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-2 right-2 text-lg sm:text-xl">{city.flag}</div>
                    <div className="absolute bottom-2 left-3 text-white">
                      <div className="text-base sm:text-lg font-bold">{city.name}</div>
                      <div className="text-xs sm:text-sm opacity-90">{city.count} Consultants</div>
                    </div>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="font-medium text-gray-800 text-sm sm:text-base">Explore {city.name}</span>
                        <div className="text-xs text-gray-500 mt-1">{city.description}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/business">
              <Button variant="outline" size="lg" className="px-8">
                View All Cities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-yellow-100 text-yellow-800">Why Choose Us</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              India's Most Trusted Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our verified experts and proven success rate
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex p-4 rounded-2xl bg-white shadow-lg mb-6 ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Consultants Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800">Featured Experts</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Top Rated Consultants
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with our most experienced and successful visa consultants
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <Link to="/business">
              <Button size="lg" className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                View All Consultants
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Your Visa Journey?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-4">
            Join thousands of satisfied customers who have successfully achieved their visa goals with our expert consultants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Link to="/business" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium">
                Find Consultants
                <Search className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/list-business" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium text-white border-white hover:bg-white hover:text-blue-600 border-2"
              >
                List Your Business
                <Building className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Debug Page Info */}
      <DebugPageInfo />
    </div>
  );
}
