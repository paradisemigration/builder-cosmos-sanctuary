import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Building,
  Shield,
  Clock,
  Globe,
  MapPin,
  Phone,
  Award,
  Briefcase,
  GraduationCap,
  Plane,
} from "lucide-react";
import { SearchHero } from "@/components/SearchHero";
import { BusinessCard } from "@/components/BusinessCard";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  featuredBusinesses,
  businessCategories,
  sampleBusinesses,
  indianCities,
  visaTypes,
} from "@/lib/data";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    document.title =
      "VisaConsult India - Find Trusted Visa Consultants | Study, Work & Tourist Visa Services";

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      "content",
      "India's largest directory of verified visa consultants. Find trusted immigration experts for student visa, work visa, tourist visa in Delhi, Mumbai, Bangalore & all major cities. Compare ratings & reviews.",
    );

    // Intersection Observer for animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => [...prev, entry.target.id]);
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleSearch = (query: string, location: string, category: string) => {
    const searchParams = new URLSearchParams();
    if (query) searchParams.set("q", query);
    if (location && location !== "all") searchParams.set("location", location);
    if (category && category !== "all") searchParams.set("category", category);

    navigate(`/browse?${searchParams.toString()}`);
  };

  const topCities = [
    { name: "Delhi", count: "450+ Consultants", icon: "🏛️" },
    { name: "Mumbai", count: "380+ Consultants", icon: "🏙️" },
    { name: "Bangalore", count: "320+ Consultants", icon: "💻" },
    { name: "Chennai", count: "250+ Consultants", icon: "🌊" },
    { name: "Hyderabad", count: "200+ Consultants", icon: "💎" },
    { name: "Kolkata", count: "180+ Consultants", icon: "🎭" },
    { name: "Pune", count: "150+ Consultants", icon: "🎓" },
    { name: "Ahmedabad", count: "120+ Consultants", icon: "🏗️" },
  ];

  const visaTypeCards = [
    {
      type: "Student Visa",
      description: "Study abroad consultants for universities worldwide",
      icon: <GraduationCap className="h-8 w-8" />,
      count: "2,500+ Consultants",
      color: "bg-blue-50 border-blue-200",
      iconColor: "text-blue-600",
      countries: ["USA", "Canada", "UK", "Australia", "Germany"],
    },
    {
      type: "Work Visa",
      description: "Employment visa experts for global opportunities",
      icon: <Briefcase className="h-8 w-8" />,
      count: "1,800+ Consultants",
      color: "bg-green-50 border-green-200",
      iconColor: "text-green-600",
      countries: ["Canada", "Australia", "Germany", "UAE", "Singapore"],
    },
    {
      type: "Tourist Visa",
      description: "Travel visa services for leisure and business trips",
      icon: <Plane className="h-8 w-8" />,
      count: "3,200+ Consultants",
      color: "bg-purple-50 border-purple-200",
      iconColor: "text-purple-600",
      countries: ["USA", "Schengen", "UK", "Japan", "Thailand"],
    },
    {
      type: "Business Visa",
      description: "Corporate visa solutions for business expansion",
      icon: <Building className="h-8 w-8" />,
      count: "1,200+ Consultants",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find India's Most
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-center space-x-2 text-orange-600 mb-2">
                    {stat.icon}
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Search Component */}
          <div className="max-w-4xl mx-auto">
            <SearchHero onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Visa Types Section */}
      <section className="py-16 px-4 bg-white" data-animate id="visa-types">
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
            {visaTypeCards.map((visa, index) => (
              <Card
                key={index}
                className={`${visa.color} hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                onClick={() =>
                  navigate(`/browse?category=${encodeURIComponent(visa.type)}`)
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
                    {visa.count}
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
      <section className="py-16 px-4 bg-gray-50" data-animate id="cities">
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
                onClick={() => navigate(`/browse?location=${city.name}`)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{city.icon}</div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {city.name}
                  </h3>
                  <p className="text-sm text-gray-600">{city.count}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 group-hover:text-orange-600"
                  >
                    Explore <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => navigate("/browse")}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
            >
              View All Cities <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Consultants */}
      <section className="py-16 px-4 bg-white" data-animate id="featured">
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
            {featuredBusinesses.slice(0, 6).map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => navigate("/browse")}
              size="lg"
            >
              View All Consultants <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        className="py-16 px-4 bg-gradient-to-br from-orange-500 to-purple-600 text-white"
        data-animate
        id="why-choose"
      >
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Verified Professionals
              </h3>
              <p className="opacity-90">
                All consultants are verified with proper licenses and
                credentials
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Genuine Reviews</h3>
              <p className="opacity-90">
                Real customer reviews and ratings to help you make informed
                decisions
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="opacity-90">
                Round-the-clock customer support for all your visa-related
                queries
              </p>
            </div>
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
              onClick={() => navigate("/browse")}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
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
                  <Link to="/browse" className="hover:text-white">
                    Browse Consultants
                  </Link>
                </li>
                <li>
                  <Link to="/add-business" className="hover:text-white">
                    Add Your Listing
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
                    to="/browse?category=Student Visa Consultants"
                    className="hover:text-white"
                  >
                    Student Visa
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse?category=Work Visa Consultants"
                    className="hover:text-white"
                  >
                    Work Visa
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse?category=Tourist Visa Services"
                    className="hover:text-white"
                  >
                    Tourist Visa
                  </Link>
                </li>
                <li>
                  <Link
                    to="/browse?category=Business Visa Services"
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
