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

      {/* Hero Section */}
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

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Browse by Service Category
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find specialized professionals for all your visa and immigration
              needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businessCategories.map((category, index) => {
              const categoryBusinesses = sampleBusinesses.filter(
                (b) => b.category === category,
              );
              const avgRating =
                categoryBusinesses.reduce((acc, b) => acc + b.rating, 0) /
                categoryBusinesses.length;

              return (
                <Card
                  key={category}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30 bg-gradient-to-br from-white to-primary/5"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                      <span className="group-hover:text-primary transition-colors text-foreground font-bold">
                        {category}
                      </span>
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        {categoryBusinesses.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-dubai-gold fill-dubai-gold" />
                        <span className="text-sm font-medium text-foreground">
                          {avgRating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        avg rating
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      Professional {category.toLowerCase()} services with
                      verified credentials and customer reviews.
                    </p>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-200"
                      onClick={() => handleSearch("", category, "")}
                    >
                      Browse {category}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Our Directory?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We ensure you connect with legitimate, verified professionals for
              your visa and immigration needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-verified/10 rounded-lg mb-6">
                <Shield className="w-8 h-8 text-verified" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Verified Businesses
              </h3>
              <p className="text-muted-foreground">
                All listed businesses are verified with valid licenses and
                credentials to ensure your safety.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-6">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Real Reviews
              </h3>
              <p className="text-muted-foreground">
                Read authentic reviews from real customers to make informed
                decisions about your service provider.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-lg mb-6">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Scam Protection
              </h3>
              <p className="text-muted-foreground">
                Our reporting system helps identify and flag suspicious
                businesses to protect the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Notification Demo Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              📧 Welcome Email Notifications
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Get instant welcome emails when you sign up or login via
              Google/Facebook!
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <EmailPreview
                userName="New User"
                userEmail="user@example.com"
                provider="google"
                isNewUser={true}
              />
              <EmailPreview
                userName="Returning User"
                userEmail="user@example.com"
                provider="facebook"
                isNewUser={false}
              />
              <EmailPreview
                userName="Email User"
                userEmail="user@example.com"
                provider="email"
                isNewUser={true}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              ✨ All users receive personalized welcome emails with platform
              guidance and support information
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-dubai-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Visa Service Provider?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Browse our directory of verified professionals or add your business
            to reach more customers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                Browse Services
              </Button>
            </Link>
            <Link to="/add-business">
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] bg-transparent border-white text-white hover:bg-white hover:text-primary"
              >
                Add Your Business
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-primary mb-4">
                Dubai<span className="text-dubai-gold">Visa</span>Directory
              </h3>
              <p className="text-muted-foreground mb-4">
                Your trusted source for finding legitimate visa and immigration
                services in Dubai. We help connect customers with verified
                professionals.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link to="/browse" className="hover:text-primary">
                    Browse Services
                  </Link>
                </li>
                <li>
                  <Link to="/add-business" className="hover:text-primary">
                    Add Business
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-primary">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-primary">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link to="/help" className="hover:text-primary">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/report" className="hover:text-primary">
                    Report Scam
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-primary">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Dubai Visa Directory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
