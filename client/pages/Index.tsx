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
} from "lucide-react";
import { SearchHero } from "@/components/SearchHero";
import { BusinessCard } from "@/components/BusinessCard";
import { Navigation } from "@/components/Navigation";
import { EmailPreview } from "@/components/EmailPreview";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  featuredBusinesses,
  businessCategories,
  sampleBusinesses,
} from "@/lib/data";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [visibleSections, setVisibleSections] = useState<string[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => [
              ...prev,
              entry.target.getAttribute("data-section") || "",
            ]);
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll("[data-section]");
    sections.forEach((section) => {
      observerRef.current?.observe(section);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleSearch = (query: string, category?: string, zone?: string) => {
    setSearchQuery(query);
    // Navigate to browse page with filters
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category) params.set("category", category);
    if (zone) params.set("zone", zone);

    window.location.href = `/browse?${params.toString()}`;
  };

  const stats = [
    { label: "Verified Businesses", value: "150+", icon: Building },
    { label: "Customer Reviews", value: "2.5k+", icon: Users },
    { label: "Success Rate", value: "98%", icon: TrendingUp },
    { label: "Avg Response Time", value: "< 2hrs", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section with Enhanced Search at Top */}
      <SearchHero onSearch={handleSearch} />

      {/* Stats Section */}
      <section
        className="py-20 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden"
        data-section="stats"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <radialGradient id="statsGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity="0.1" />
                </radialGradient>
              </defs>
              <rect width="100" height="100" fill="url(#statsGrad)" />
            </svg>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-8 left-8 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
          <div
            className="absolute top-16 right-12 w-6 h-6 bg-cyan-400 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-12 left-16 w-3 h-3 bg-purple-400 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${visibleSections.includes("stats") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Trusted by <span className="gradient-text">Thousands</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Join our growing community of successful immigration stories
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`group text-center transition-all duration-700 ${
                  visibleSections.includes("stats")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500 transform scale-110"></div>

                  <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 group-hover:bg-white/20 transition-all duration-300 transform group-hover:scale-105">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="text-4xl lg:text-5xl font-black text-white mb-3 group-hover:text-cyan-200 transition-colors">
                      {stat.value}
                    </div>

                    <div className="text-lg text-blue-200 font-medium group-hover:text-white transition-colors">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section
        className="py-24 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden"
        data-section="featured"
      >
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full animate-float"></div>
          <div
            className="absolute top-40 right-32 w-24 h-24 bg-purple-400 rounded-full animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/3 w-20 h-20 bg-cyan-400 rounded-full animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            className={`flex flex-col lg:flex-row items-center justify-between mb-16 transition-all duration-1000 ${visibleSections.includes("featured") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-200 rounded-full px-6 py-2">
                  <span className="text-blue-700 font-semibold text-sm">
                    ⭐ TOP RATED
                  </span>
                </div>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-4">
                <span className="block">Featured</span>
                <span className="gradient-text">Immigration Partners</span>
              </h2>

              <p className="text-xl text-gray-600 max-w-2xl">
                Handpicked professionals with proven track records and excellent
                customer satisfaction ratings
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${visibleSections.includes("featured") ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}
              style={{ transitionDelay: "0.3s" }}
            >
              <Link to="/browse">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                  <span>Explore All Services</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBusinesses.slice(0, 6).map((business, index) => (
              <div
                key={business.id}
                className={`group transition-all duration-700 ${
                  visibleSections.includes("featured")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 150 + 500}ms` }}
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
                  <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                    <BusinessCard
                      business={business}
                      onClick={() => navigate(`/business/${business.id}`)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section with JavaScript Animations */}
      <section
        className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30 relative overflow-hidden"
        data-section="categories"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full animate-float-slow"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-purple-400 rounded-full animate-float-medium"></div>
          <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-cyan-400 rounded-full animate-float-fast"></div>
          <div className="absolute bottom-10 right-1/3 w-20 h-20 bg-green-400 rounded-full animate-float-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.includes("categories")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Enhanced Header with Icons */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200 rounded-full px-8 py-3">
                <span className="text-blue-700 font-bold text-sm flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  ⭐ EXPLORE SERVICES
                  <CheckCircle className="w-4 h-4" />
                </span>
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-6">
              <span className="block">Browse by</span>
              <span className="gradient-text">Service Category</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover specialized professionals across Dubai's most trusted
              immigration services
            </p>
          </div>

          {/* Enhanced Animated Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {businessCategories.map((category, index) => {
              const categoryBusinesses = sampleBusinesses.filter(
                (b) => b.category === category,
              );
              const avgRating =
                categoryBusinesses.reduce((acc, b) => acc + b.rating, 0) /
                categoryBusinesses.length;

              // Dynamic icons for each category
              const getCategoryIcon = (cat: string) => {
                switch (cat) {
                  case "Visa Agent":
                    return "🛂";
                  case "Visa Services":
                    return "📋";
                  case "Visa & Passport Services":
                    return "🛡️";
                  case "Immigration Consultants":
                    return "👨‍💼";
                  case "Document Clearing / Typing Centers":
                    return "📝";
                  case "Travel Agencies (Visa-related)":
                    return "✈️";
                  default:
                    return "🏢";
                }
              };

              return (
                <div
                  key={category}
                  className={`group transition-all duration-700 ${
                    visibleSections.includes("categories")
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 150 + 200}ms` }}
                >
                  <div className="relative">
                    {/* Animated Gradient Border */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>

                    <Card className="relative h-full bg-gradient-to-br from-white via-white to-blue-50/30 border-2 border-white/50 hover:border-transparent rounded-2xl shadow-lg hover:shadow-2xl transform group-hover:scale-[1.02] group-hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden">
                      {/* Card Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <CardHeader className="pb-6 relative">
                        {/* Floating Icon */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-3xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                              {getCategoryIcon(category)}
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          </div>

                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-md transform group-hover:scale-110 transition-transform duration-300">
                            {categoryBusinesses.length}
                          </Badge>
                        </div>

                        <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-500">
                          {category}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="relative">
                        {/* Animated Rating */}
                        <div className="flex items-center gap-3 mb-6 group-hover:scale-105 transition-transform duration-300">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 transition-all duration-300 ${
                                  i < Math.floor(avgRating)
                                    ? "text-yellow-400 fill-yellow-400 transform group-hover:scale-110"
                                    : "text-gray-300"
                                }`}
                                style={{ transitionDelay: `${i * 50}ms` }}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {avgRating.toFixed(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            avg rating
                          </span>
                        </div>

                        <p className="text-gray-600 mb-8 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                          Professional {category.toLowerCase()} services with
                          verified credentials and customer reviews.
                        </p>

                        {/* Enhanced Interactive Button */}
                        <Button
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 group-hover:scale-105 relative overflow-hidden"
                          onClick={() => handleSearch("", category, "")}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                          <span className="relative flex items-center justify-center gap-2">
                            🔍 Browse {category.split(" ")[0]}
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                          </span>
                        </Button>

                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping"></div>
                        <div className="absolute bottom-4 left-4 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                      </CardContent>

                      {/* Hover Reveal Stats */}
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced CTA Section */}
          <div
            className={`text-center mt-16 transition-all duration-1000 ${
              visibleSections.includes("categories")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-white/30 rounded-3xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                🎯 Can't Find What You're Looking For?
              </h3>
              <p className="text-gray-600 mb-6">
                Explore our complete directory of verified immigration
                professionals
              </p>
              <Link to="/browse">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                  <span>🌟 View All Categories</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Why Choose Us Section */}
      <section
        className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden"
        data-section="why-choose"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-float-medium"></div>
          <div className="absolute bottom-10 left-1/3 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl animate-float-fast"></div>

          {/* Particle System */}
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full animate-twinkle"
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.includes("why-choose")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Enhanced Header */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-full px-8 py-3">
                <span className="text-cyan-300 font-bold text-sm flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  🏆 OUR ADVANTAGES
                  <CheckCircle className="w-4 h-4" />
                </span>
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black mb-6">
              <span className="block">Why Choose</span>
              <span className="gradient-text">Our Directory?</span>
            </h2>

            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Experience the difference with Dubai's most trusted and
              comprehensive immigration services platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: Shield,
                title: "Verified Businesses",
                description:
                  "All listed businesses are verified with valid licenses and credentials to ensure your safety.",
                color: "from-green-500 to-emerald-500",
                emoji: "🛡️",
                stats: "150+ Verified",
              },
              {
                icon: Users,
                title: "Real Reviews",
                description:
                  "Read authentic reviews from real customers to make informed decisions about your service provider.",
                color: "from-blue-500 to-cyan-500",
                emoji: "⭐",
                stats: "2.5k+ Reviews",
              },
              {
                icon: CheckCircle,
                title: "Scam Protection",
                description:
                  "Our reporting system helps identify and flag suspicious businesses to protect the community.",
                color: "from-purple-500 to-pink-500",
                emoji: "🔒",
                stats: "98% Safe",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group transition-all duration-700 ${
                  visibleSections.includes("why-choose")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200 + 300}ms` }}
              >
                <div className="relative h-full">
                  {/* Animated Gradient Border */}
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-0 group-hover:opacity-60 transition duration-500`}
                  ></div>

                  <div className="relative h-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 lg:p-10 hover:bg-white/20 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2">
                    {/* Floating Icon Container */}
                    <div className="text-center mb-8">
                      <div className="relative inline-block">
                        <div
                          className={`w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-4xl lg:text-5xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-2xl mb-4`}
                        >
                          {feature.emoji}
                        </div>

                        {/* Pulse Ring */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-20 animate-ping group-hover:animate-pulse`}
                        ></div>

                        {/* Stats Badge */}
                        <div className="absolute -top-2 -right-2 bg-white text-gray-800 text-xs font-bold px-3 py-1 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          {feature.stats}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-500">
                      {feature.title}
                    </h3>

                    <p className="text-blue-100 text-base lg:text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                      {feature.description}
                    </p>

                    {/* Interactive Elements */}
                    <div className="mt-8 flex items-center justify-center">
                      <Button
                        className={`bg-gradient-to-r ${feature.color} hover:shadow-xl hover:shadow-blue-500/25 text-white font-semibold px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100`}
                      >
                        Learn More
                      </Button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-white/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping"></div>
                    <div className="absolute bottom-4 left-4 w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Trust Indicators */}
          <div
            className={`mt-16 text-center transition-all duration-1000 ${
              visibleSections.includes("why-choose")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "1000ms" }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-4xl mx-auto">
              {[
                { label: "Success Rate", value: "98%", icon: "🎯" },
                { label: "Happy Customers", value: "5k+", icon: "😊" },
                { label: "Years Experience", value: "15+", icon: "📅" },
                { label: "Response Time", value: "<2hrs", icon: "⚡" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 lg:p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-2xl lg:text-3xl mb-2">{stat.icon}</div>
                  <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Email Notification Demo Section */}
      <section
        className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 relative overflow-hidden"
        data-section="email-demo"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400 rounded-full animate-float-slow"></div>
          <div className="absolute top-20 right-20 w-24 h-24 bg-yellow-400 rounded-full animate-float-medium"></div>
          <div className="absolute bottom-20 left-1/4 w-28 h-28 bg-pink-400 rounded-full animate-float-fast"></div>
          <div className="absolute bottom-10 right-1/3 w-20 h-20 bg-purple-400 rounded-full animate-float-slow"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div
            className={`text-center mb-16 transition-all duration-1000 ${
              visibleSections.includes("email-demo")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Enhanced Header */}
            <div className="inline-flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm border border-orange-200 rounded-full px-8 py-3">
                <span className="text-orange-700 font-bold text-sm flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  📧 EMAIL NOTIFICATIONS
                  <CheckCircle className="w-4 h-4" />
                </span>
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black text-gray-800 mb-6">
              <span className="block">Welcome</span>
              <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Email Magic
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Experience instant, personalized welcome emails when you join our
              platform through any method
            </p>

            {/* Animated Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {[
                {
                  icon: "🚀",
                  title: "Instant Delivery",
                  desc: "Emails sent within seconds",
                },
                {
                  icon: "🎨",
                  title: "Beautiful Design",
                  desc: "Professional HTML templates",
                },
                {
                  icon: "🔒",
                  title: "Secure & Private",
                  desc: "Your data is protected",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group transition-all duration-700 ${
                    visibleSections.includes("email-demo")
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 150 + 200}ms` }}
                >
                  <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl p-6 hover:bg-white/90 hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Email Preview Cards */}
          <div
            className={`transition-all duration-1000 ${
              visibleSections.includes("email-demo")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "500ms" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
              {[
                {
                  provider: "google",
                  user: "New User",
                  isNew: true,
                  color: "from-red-500 to-yellow-500",
                  icon: "📱",
                },
                {
                  provider: "facebook",
                  user: "Returning User",
                  isNew: false,
                  color: "from-blue-500 to-cyan-500",
                  icon: "👤",
                },
                {
                  provider: "email",
                  user: "Email User",
                  isNew: true,
                  color: "from-purple-500 to-pink-500",
                  icon: "✉️",
                },
              ].map((email, index) => (
                <div
                  key={index}
                  className="group transition-all duration-700"
                  style={{ transitionDelay: `${index * 200 + 700}ms` }}
                >
                  <div className="relative">
                    {/* Animated Border */}
                    <div
                      className={`absolute -inset-1 bg-gradient-to-r ${email.color} rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500`}
                    ></div>

                    <div className="relative bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl p-6 lg:p-8 hover:bg-white/95 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2">
                      {/* Email Icon */}
                      <div className="text-center mb-6">
                        <div
                          className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r ${email.color} rounded-2xl flex items-center justify-center text-3xl lg:text-4xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl mx-auto mb-4`}
                        >
                          {email.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {email.provider.charAt(0).toUpperCase() +
                            email.provider.slice(1)}{" "}
                          Login
                        </h3>
                        <p className="text-gray-600">
                          {email.user} •{" "}
                          {email.isNew ? "New User" : "Returning"}
                        </p>
                      </div>

                      {/* Preview Button */}
                      <div className="text-center">
                        <EmailPreview
                          userName={email.user}
                          userEmail="user@example.com"
                          provider={email.provider as any}
                          isNewUser={email.isNew}
                        />
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced CTA */}
          <div
            className={`text-center transition-all duration-1000 ${
              visibleSections.includes("email-demo")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "1200ms" }}
          >
            <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 backdrop-blur-sm border border-white/30 rounded-3xl p-8 lg:p-10 max-w-2xl mx-auto">
              <div className="text-4xl lg:text-5xl mb-4">✨</div>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4">
                Join the Experience
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                All users receive personalized welcome emails with platform
                guidance and support information
              </p>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group">
                  <span className="flex items-center gap-2">
                    🎯 Try It Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section
        className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden"
        data-section="cta"
      >
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20"></div>

          {/* Animated Shapes */}
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500/30 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute top-20 right-20 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl animate-float-medium"></div>
          <div className="absolute bottom-10 left-1/3 w-36 h-36 bg-cyan-500/30 rounded-full blur-3xl animate-float-fast"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="ctaGrid"
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
              <rect width="100" height="100" fill="url(#ctaGrid)" />
            </svg>
          </div>

          {/* Floating Particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full animate-twinkle"
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div
            className={`transition-all duration-1000 ${
              visibleSections.includes("cta")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Enhanced Header */}
            <div className="inline-flex items-center justify-center mb-8">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-full px-8 py-4">
                <span className="text-cyan-300 font-bold text-lg flex items-center gap-3">
                  <Star className="w-6 h-6 animate-spin-slow" />
                  🚀 START YOUR JOURNEY
                  <CheckCircle className="w-5 h-5" />
                </span>
              </div>
            </div>

            <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">
              <span className="block mb-2">Ready to Find Your</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Visa Service Provider?
              </span>
            </h2>

            <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join thousands of satisfied customers who found their perfect
              immigration partner.
              <span className="block mt-2 text-cyan-300 font-semibold">
                Browse verified professionals or showcase your expertise to
                reach more clients.
              </span>
            </p>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 justify-center mb-12">
              <Link to="/browse">
                <Button
                  size="lg"
                  className="group relative bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold px-8 lg:px-12 py-4 lg:py-6 text-lg lg:text-xl rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 min-w-[250px] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-3">
                    🔍 Browse Services
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>

              <Link to="/add-business">
                <Button
                  size="lg"
                  variant="outline"
                  className="group relative bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold px-8 lg:px-12 py-4 lg:py-6 text-lg lg:text-xl rounded-2xl shadow-2xl hover:shadow-white/25 transform hover:scale-105 transition-all duration-300 min-w-[250px] overflow-hidden"
                >
                  <span className="relative flex items-center justify-center gap-3">
                    ✨ Add Your Business
                    <Building className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 max-w-4xl mx-auto">
              {[
                { value: "150+", label: "Verified Partners", icon: "🏢" },
                { value: "5k+", label: "Happy Customers", icon: "😊" },
                { value: "98%", label: "Success Rate", icon: "🎯" },
                { value: "<2hrs", label: "Response Time", icon: "⚡" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`group transition-all duration-700 ${
                    visibleSections.includes("cta")
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${index * 150 + 500}ms` }}
                >
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 lg:p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                    <div className="text-2xl lg:text-3xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer
        className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden"
        data-section="footer"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-indigo-900/50"></div>

          {/* Floating Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-float-slow"></div>
          <div className="absolute bottom-10 right-10 w-28 h-28 bg-purple-500/20 rounded-full blur-xl animate-float-medium"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="footerGrid"
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
              <rect width="100" height="100" fill="url(#footerGrid)" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative">
          <div
            className={`transition-all duration-1000 ${
              visibleSections.includes("footer")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Enhanced Brand Section */}
              <div className="md:col-span-2 lg:col-span-1">
                <div className="group">
                  <Link to="/" className="inline-block mb-6">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>
                      <h3 className="relative text-2xl lg:text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-blue-300 group-hover:to-purple-300 transition-all duration-500">
                        <span className="flex items-center gap-2">
                          <Globe className="w-8 h-8 text-blue-400 animate-spin-slow" />
                          Trusted
                          <span className="text-yellow-400">Immigration</span>
                        </span>
                      </h3>
                    </div>
                  </Link>

                  <p className="text-blue-100 mb-6 leading-relaxed">
                    Your trusted source for finding legitimate visa and
                    immigration services in Dubai. We help connect customers
                    with verified professionals.
                  </p>

                  {/* Social Links */}
                  <div className="flex space-x-4">
                    {["📘", "📸", "🐦", "💼"].map((icon, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center text-xl hover:bg-white/20 hover:scale-110 transition-all duration-300 cursor-pointer group"
                      >
                        <span className="group-hover:scale-110 transition-transform duration-300">
                          {icon}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div
                className={`transition-all duration-700 ${
                  visibleSections.includes("footer")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: "200ms" }}
              >
                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-cyan-400" />
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {[
                    { to: "/browse", label: "Browse Services", icon: "🔍" },
                    { to: "/add-business", label: "Add Business", icon: "➕" },
                    { to: "/contact", label: "Contact Us", icon: "📞" },
                    { to: "/about", label: "About", icon: "ℹ️" },
                  ].map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.to}
                        className="group flex items-center gap-3 text-blue-200 hover:text-white transition-all duration-300 hover:translate-x-2"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                          {link.icon}
                        </span>
                        <span className="group-hover:text-cyan-300 transition-colors duration-300">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div
                className={`transition-all duration-700 ${
                  visibleSections.includes("footer")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: "400ms" }}
              >
                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Support
                </h4>
                <ul className="space-y-3">
                  {[
                    { to: "/help", label: "Help Center", icon: "❓" },
                    { to: "/report", label: "Report Scam", icon: "🚨" },
                    { to: "/privacy", label: "Privacy Policy", icon: "🔒" },
                    { to: "/terms", label: "Terms of Service", icon: "📋" },
                  ].map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.to}
                        className="group flex items-center gap-3 text-blue-200 hover:text-white transition-all duration-300 hover:translate-x-2"
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                          {link.icon}
                        </span>
                        <span className="group-hover:text-cyan-300 transition-colors duration-300">
                          {link.label}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div
                className={`transition-all duration-700 ${
                  visibleSections.includes("footer")
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: "600ms" }}
              >
                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Building className="w-5 h-5 text-purple-400" />
                  Contact
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-blue-200">
                    <span className="text-lg">🏢</span>
                    <span>Dubai, UAE</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-200">
                    <span className="text-lg">📧</span>
                    <span>info@trustedimmigration.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-blue-200">
                    <span className="text-lg">📱</span>
                    <span>+971 4 123 4567</span>
                  </div>

                  {/* Newsletter Signup */}
                  <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                    <h5 className="text-white font-semibold mb-2">
                      📬 Newsletter
                    </h5>
                    <p className="text-blue-200 text-sm mb-3">
                      Get updates on new services
                    </p>
                    <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Bottom Section */}
            <div
              className={`border-t border-white/20 mt-12 pt-8 transition-all duration-1000 ${
                visibleSections.includes("footer")
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: "800ms" }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <p className="text-blue-200 flex items-center gap-2">
                    <span className="text-lg">©</span>
                    2024 Dubai Visa Directory. All rights reserved.
                    <span className="text-lg">🇦🇪</span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">All systems operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
