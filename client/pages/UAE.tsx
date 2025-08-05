import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  Building,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SiteFooter } from "@/components/SiteFooter";
import { SEOHead } from "@/components/SEOHead";
import { uaeCities, allCategories } from "@/lib/all-categories";

export default function UAE() {
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Popular categories in UAE
  const popularCategories = [
    { slug: "visa-consultant", name: "Visa Consultant", count: "200+" },
    { slug: "immigration-lawyer", name: "Immigration Lawyer", count: "150+" },
    {
      slug: "work-visa-consultants",
      name: "Work Visa Consultants",
      count: "180+",
    },
    {
      slug: "study-abroad-consultant",
      name: "Study Abroad Consultant",
      count: "120+",
    },
    {
      slug: "tourist-visa-services",
      name: "Tourist Visa Services",
      count: "90+",
    },
    {
      slug: "family-visa-consultants",
      name: "Family Visa Consultants",
      count: "110+",
    },
  ];

  // UAE cities with real images
  const uaeCityData = [
    {
      name: "Dubai",
      count: "250+",
      image: "https://cdn.pixabay.com/photo/2020/02/06/20/01/dubai-4825573_1280.jpg",
      fallback: "https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      flag: "🇦🇪",
      description: "Burj Khalifa & Business Hub",
      color: "#DC2626"
    },
    {
      name: "Abu Dhabi",
      count: "180+",
      image: "https://cdn.pixabay.com/photo/2016/12/04/19/30/abu-dhabi-1882502_1280.jpg",
      fallback: "https://images.pexels.com/photos/3811082/pexels-photo-3811082.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      flag: "🇦🇪",
      description: "Capital & Cultural Center",
      color: "#16A34A"
    },
    {
      name: "Sharjah",
      count: "120+",
      image: "https://cdn.pixabay.com/photo/2019/11/25/13/14/sharjah-4651023_1280.jpg",
      fallback: "https://images.pexels.com/photos/3811082/pexels-photo-3811082.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      flag: "🇦🇪",
      description: "Cultural Capital",
      color: "#2563EB"
    },
    {
      name: "Ajman",
      count: "80+",
      image: "https://cdn.pixabay.com/photo/2019/05/20/11/18/ajman-4215285_1280.jpg",
      fallback: "https://images.pexels.com/photos/3811082/pexels-photo-3811082.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      flag: "🇦🇪",
      description: "Coastal Beauty",
      color: "#7C3AED"
    },
    {
      name: "Ras Al Khaimah",
      count: "60+",
      image: "https://cdn.pixabay.com/photo/2018/11/01/11/08/ras-al-khaimah-3788669_1280.jpg",
      fallback: "https://images.pexels.com/photos/3811082/pexels-photo-3811082.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      flag: "🇦🇪",
      description: "Mountains & Adventure",
      color: "#DC2626"
    },
    {
      name: "Fujairah",
      count: "50+",
      image: "https://cdn.pixabay.com/photo/2020/08/14/12/35/fujairah-5487761_1280.jpg",
      fallback: "https://images.pexels.com/photos/3811082/pexels-photo-3811082.jpeg?auto=compress&cs=tinysrgb&w=600&h=300&fit=crop",
      flag: "🇦🇪",
      description: "Eastern Coast",
      color: "#059669"
    },
  ];

  const featuredCities = uaeCityData;

  // Load sample UAE businesses
  useEffect(() => {
    setLoading(true);
    // Simulate loading UAE-specific data
    setTimeout(() => {
      const sampleBusinesses = [
        {
          id: 1,
          name: "Emirates Visa Services",
          city: "Dubai",
          category: "Visa Consultant",
          rating: 4.8,
          reviews: 245,
          verified: true,
          image: "/images/businesses/emirates-visa.jpg",
        },
        {
          id: 2,
          name: "Abu Dhabi Immigration Center",
          city: "Abu Dhabi",
          category: "Immigration Lawyer",
          rating: 4.9,
          reviews: 189,
          verified: true,
          image: "/images/businesses/abu-dhabi-immigration.jpg",
        },
        {
          id: 3,
          name: "Sharjah Study Abroad",
          city: "Sharjah",
          category: "Study Abroad Consultant",
          rating: 4.7,
          reviews: 156,
          verified: true,
          image: "/images/businesses/sharjah-study.jpg",
        },
      ];
      setBusinesses(sampleBusinesses);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = () => {
    if (searchQuery) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}&country=uae`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <SEOHead
        title="Best Visa Consultants in UAE - VisaConsult UAE"
        description="Find top-rated visa consultants across UAE. Expert immigration services in Dubai, Abu Dhabi, Sharjah and more. Trusted professionals for work visa, study abroad, and tourist visa assistance."
        keywords="visa consultants UAE, immigration services Dubai, Abu Dhabi visa agents, Sharjah immigration, UAE work visa, study abroad UAE, tourist visa UAE"
        country="uae"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "VisaConsult UAE",
          description: "Leading visa consultation platform in UAE",
          url: `${window.location.origin}/uae`,
          logo: `${window.location.origin}/images/logo-uae.png`,
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+971-xxx-xxxx",
            contactType: "customer service",
          },
          areaServed: {
            "@type": "Country",
            name: "United Arab Emirates",
          },
        }}
      />

      <Navigation />

      {/* Hero Section with Homepage Color Scheme */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 pb-12 sm:pb-16 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10"></div>
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        </div>

        {/* UAE Flag Element */}
        <div className="absolute top-24 right-8 opacity-20 z-10">
          <div className="w-28 h-18 border border-gray-300 rounded-md overflow-hidden shadow-lg">
            <div className="h-1/3 bg-red-500"></div>
            <div className="h-1/3 bg-white flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-black rounded-full relative">
                <div className="absolute inset-1 bg-black rounded-full"></div>
              </div>
            </div>
            <div className="h-1/3 bg-green-600"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-red-100 text-red-800 hover:bg-red-200">
              🇦🇪 UAE's #1 Visa Consultation Platform
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4">
              Find UAE's Best
              <span className="bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent block">
                Visa Consultants
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
              Connect with verified immigration experts across Dubai, Abu Dhabi, Sharjah and all Emirates. Get expert guidance for work visas, study abroad, and permanent residence applications.
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
                        placeholder="Search visa consultants in UAE..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-12 pr-4 py-3 sm:py-4 border-0 focus:ring-0 text-base sm:text-lg bg-transparent"
                      />
                    </div>
                  </div>
                  <div className="sm:flex-initial">
                    <select
                      className="w-full sm:w-40 px-4 py-3 sm:py-4 border-0 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-red-500 text-base"
                    >
                      <option value="">Select City</option>
                      <option value="Dubai">Dubai</option>
                      <option value="Abu Dhabi">Abu Dhabi</option>
                      <option value="Sharjah">Sharjah</option>
                      <option value="Ajman">Ajman</option>
                    </select>
                  </div>
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white rounded-xl font-semibold transition-all duration-200 text-base sm:text-lg"
                >
                  <Search className="mr-2 h-5 w-5" />
                  Search UAE Experts
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Quick Search Tags */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["Work Visa", "Study Abroad", "Tourist Visa", "Business Visa"].map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-red-50 hover:border-red-300 transition-colors"
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
      <section className="py-8 sm:py-12 bg-white relative -mt-8 sm:-mt-12 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-red-500 to-green-600 rounded-2xl text-white">
                    <Shield className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">500+</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Verified Consultants</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-red-500 to-green-600 rounded-2xl text-white">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">10,000+</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Successful Cases</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-red-500 to-green-600 rounded-2xl text-white">
                    <Globe className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">7</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">Emirates Covered</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="p-2 sm:p-3 bg-gradient-to-br from-red-500 to-green-600 rounded-2xl text-white">
                    <MapPin className="h-8 w-8" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">20+</div>
                <div className="text-gray-600 font-medium text-sm sm:text-base">UAE Cities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-red-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Popular Visa Services in UAE
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our most requested immigration services across the
              Emirates
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-green-500 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/uae/category/${category.slug}`}
                className="group"
              >
                <Card className="h-full hover:shadow-xl transition-all duration-200 border-red-100 group-hover:border-red-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg group-hover:text-red-600 transition-colors">
                        {category.name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-700"
                      >
                        {category.count}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Professional {category.name.toLowerCase()} services across
                      UAE
                    </p>
                    <div className="flex items-center text-red-600 group-hover:text-red-700">
                      <span className="text-sm font-medium">View All</span>
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* UAE Cities Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800">🇦🇪 Across UAE</Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Top Emirates We Serve
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Find trusted visa consultants in major UAE cities
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featuredCities.map((city, index) => (
              <Link
                key={index}
                to={`/business/${city.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group block"
              >
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
                          target.src = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="300" viewBox="0 0 600 300">
                            <defs>
                              <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:${city.color};stop-opacity:1" />
                                <stop offset="100%" style="stop-color:${city.color};stop-opacity:0.8" />
                              </linearGradient>
                            </defs>
                            <rect width="600" height="300" fill="url(#grad${index})"/>
                            <text x="300" y="140" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">${city.name}</text>
                            <text x="300" y="170" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" opacity="0.9">${city.description}</text>
                            <text x="300" y="195" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.8">${city.count} Consultants</text>
                          </svg>`)}`;
                        }
                      }}
                      onLoad={(e) => {
                        delete (e.target as HTMLImageElement).dataset.fallbackAttempted;
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
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-red-600 transition-colors flex-shrink-0 ml-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/uae">
              <Button variant="outline" size="lg" className="px-8">
                View All UAE Cities
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Featured Visa Consultants in UAE
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Top-rated professionals trusted by thousands of clients
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-green-500 mx-auto mt-6"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-64">
                  <CardContent className="p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <Link
                  key={business.id}
                  to={`/business/${business.id}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <Building className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                            {business.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {business.city}
                          </p>
                        </div>
                        {business.verified && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>

                      <Badge variant="outline" className="mb-3">
                        {business.category}
                      </Badge>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{business.rating}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{business.reviews} reviews</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose UAE Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-600 to-green-600 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose VisaConsult UAE?
            </h2>
            <p className="text-xl opacity-90">
              Your trusted partner for immigration success in the UAE
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Professionals</h3>
              <p className="opacity-90">
                All consultants are verified and licensed
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">UAE-Wide Coverage</h3>
              <p className="opacity-90">Services across all seven Emirates</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="opacity-90">Round-the-clock assistance available</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">High Success Rate</h3>
              <p className="opacity-90">95+ success rate across all services</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Visa Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with top-rated visa consultants in UAE today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
              <Link to="/add-business">List Your Business</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/browse?country=uae">Browse All Consultants</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
