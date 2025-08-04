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
    { slug: "work-visa-consultants", name: "Work Visa Consultants", count: "180+" },
    { slug: "study-abroad-consultant", name: "Study Abroad Consultant", count: "120+" },
    { slug: "tourist-visa-services", name: "Tourist Visa Services", count: "90+" },
    { slug: "family-visa-consultants", name: "Family Visa Consultants", count: "110+" },
  ];

  // Featured UAE cities with real images
  const cityImages = {
    "Dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "Abu Dhabi": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "Sharjah": "https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "Ajman": "https://images.unsplash.com/photo-1544966503-7cc531c3a35c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "Ras Al Khaimah": "https://images.unsplash.com/photo-1512632578888-169bbbc64f33?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "Fujairah": "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  };

  const featuredCities = uaeCities.map(city => ({
    name: city,
    businesses: Math.floor(Math.random() * 50) + 20,
    image: cityImages[city] || cityImages["Dubai"],
    description: `Find trusted visa consultants in ${city}`
  }));

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
          image: "/images/businesses/emirates-visa.jpg"
        },
        {
          id: 2,
          name: "Abu Dhabi Immigration Center",
          city: "Abu Dhabi",
          category: "Immigration Lawyer",
          rating: 4.9,
          reviews: 189,
          verified: true,
          image: "/images/businesses/abu-dhabi-immigration.jpg"
        },
        {
          id: 3,
          name: "Sharjah Study Abroad",
          city: "Sharjah",
          category: "Study Abroad Consultant",
          rating: 4.7,
          reviews: 156,
          verified: true,
          image: "/images/businesses/sharjah-study.jpg"
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
          "name": "VisaConsult UAE",
          "description": "Leading visa consultation platform in UAE",
          "url": `${window.location.origin}/uae`,
          "logo": `${window.location.origin}/images/logo-uae.png`,
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+971-xxx-xxxx",
            "contactType": "customer service"
          },
          "areaServed": {
            "@type": "Country",
            "name": "United Arab Emirates"
          }
        }}
      />

      <Navigation />

      {/* Hero Section with UAE Flag Theme */}
      <section className="relative pt-20 pb-16 px-4 overflow-hidden">
        {/* Dubai Skyline Background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          }}
        ></div>
        {/* UAE Flag Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/90 via-white/20 to-green-600/90"></div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            {/* Enhanced UAE Flag */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-14 bg-gradient-to-r from-red-500 via-white to-green-500 rounded-lg shadow-2xl border-2 border-white transform hover:scale-105 transition-transform"></div>
                <div className="absolute inset-0 rounded-lg shadow-inner bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-2xl leading-tight">
              UAE's Leading Visa
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white">
                Consultation Platform
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-10 max-w-4xl mx-auto drop-shadow-lg leading-relaxed">
              Connect with trusted visa consultants across Dubai, Abu Dhabi, Sharjah and all Emirates.
              Expert immigration services for work visas, study abroad, and more.
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl border border-white/20">
                <div className="flex">
                  <Input
                    type="text"
                    placeholder="Search visa consultants in UAE..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-0 bg-transparent text-lg focus:ring-0 flex-1 px-4"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button
                    onClick={handleSearch}
                    className="rounded-xl px-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center gap-8 mt-12">
              <div className="text-center text-white">
                <div className="text-3xl font-bold text-yellow-300">500+</div>
                <div className="text-sm">Verified Consultants</div>
              </div>
              <div className="text-center text-white">
                <div className="text-3xl font-bold text-yellow-300">6</div>
                <div className="text-sm">Emirates Covered</div>
              </div>
              <div className="text-center text-white">
                <div className="text-3xl font-bold text-yellow-300">10K+</div>
                <div className="text-sm">Successful Cases</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Visa Services in UAE
            </h2>
            <p className="text-xl text-gray-600">
              Explore our most requested immigration services across the Emirates
            </p>
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
                      <Badge variant="secondary" className="bg-red-100 text-red-700">
                        {category.count}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Professional {category.name.toLowerCase()} services across UAE
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
      <section className="py-16 px-4 bg-red-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Visa Consultants by Emirate
            </h2>
            <p className="text-xl text-gray-600">
              Find trusted professionals in your city across all seven Emirates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCities.map((city) => (
              <Link
                key={city.name}
                to={`/business/${city.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="group"
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 shadow-lg group-hover:scale-105">
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={city.image}
                      alt={`${city.name} skyline`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* UAE flag gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/80 via-transparent to-green-600/30"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <MapPin className="h-8 w-8 mx-auto mb-2 drop-shadow-lg" />
                        <h3 className="text-xl font-bold drop-shadow-lg">{city.name}</h3>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-6 bg-white">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                      {city.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{city.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {city.businesses} consultants
                      </div>
                      <div className="flex items-center text-red-600 group-hover:text-red-700">
                        <span className="text-sm font-medium">Explore</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Visa Consultants in UAE
            </h2>
            <p className="text-xl text-gray-600">
              Top-rated professionals trusted by thousands of clients
            </p>
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
                          <p className="text-sm text-gray-600">{business.city}</p>
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
              <p className="opacity-90">All consultants are verified and licensed</p>
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
