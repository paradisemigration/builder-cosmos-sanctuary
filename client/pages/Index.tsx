import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  TrendingUp,
  Users,
  CheckCircle,
  ArrowRight,
  Building,
  Shield,
  Clock,
  Menu,
  X,
} from "lucide-react";
import { SearchHero } from "@/components/SearchHero";
import { BusinessCard } from "@/components/BusinessCard";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize to update mobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-bold text-primary">
                  Dubai<span className="text-dubai-gold">Visa</span>Directory
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation - Always visible for now */}
            <div className="flex items-center">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/browse"
                  className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Browse Services
                </Link>
                <Link
                  to="/add-business"
                  className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Add Business
                </Link>
                <Link to="/login">
                  <Button size="sm">Sign In</Button>
                </Link>
              </div>
            </div>

            {/* Mobile menu button - Hidden for now */}
            <div className="hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t">
                <Link
                  to="/"
                  className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/browse"
                  className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Services
                </Link>
                <Link
                  to="/add-business"
                  className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Add Business
                </Link>
                <div className="px-3 py-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <SearchHero onSearch={handleSearch} />

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Businesses */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Top Rated Services
              </h2>
              <p className="text-muted-foreground text-lg">
                Discover the most trusted visa and immigration services in Dubai
              </p>
            </div>

            <Link to="/browse">
              <Button variant="outline" size="lg">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBusinesses.slice(0, 6).map((business) => (
              <BusinessCard
                key={business.id}
                business={business}
                onClick={() =>
                  (window.location.href = `/business/${business.id}`)
                }
              />
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
