import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Sparkles, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className = "" }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isCurrentPage = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl shadow-2xl border-b border-blue-100/50"
          : "bg-white/80 backdrop-blur-lg border-b border-white/20"
      } ${className}`}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16 lg:h-18">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 group">
              <div className="relative">
                {/* Animated Logo Background */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>

                <h1 className="relative text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 transition-all duration-500 transform group-hover:scale-105">
                  <span className="inline-flex items-center gap-2">
                    <Globe className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 animate-spin-slow" />
                    Dubai<span className="text-yellow-500">Visa</span>Directory
                    <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 text-purple-500 animate-pulse" />
                  </span>
                </h1>
              </div>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="ml-10 flex items-center space-x-2 lg:space-x-4">
              <Link
                to="/"
                className={`group relative px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 ${
                  isCurrentPage("/")
                    ? "text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <span className="relative z-10">🏠 Home</span>
                {!isCurrentPage("/") && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                )}
              </Link>

              <Link
                to="/browse"
                className={`group relative px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 ${
                  isCurrentPage("/browse")
                    ? "text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <span className="relative z-10">🔍 Browse Services</span>
                {!isCurrentPage("/browse") && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                )}
              </Link>

              <Link
                to="/add-business"
                className={`group relative px-4 py-2 rounded-xl text-sm lg:text-base font-semibold transition-all duration-300 ${
                  isCurrentPage("/add-business")
                    ? "text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <span className="relative z-10">➕ Add Business</span>
                {!isCurrentPage("/add-business") && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                )}
              </Link>

              {/* Enhanced Authentication Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 ml-6">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-blue-50 px-3 py-2 rounded-xl border border-green-200">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">
                      Welcome, {user?.name}
                    </span>
                  </div>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="group relative px-4 py-2 rounded-xl text-sm font-semibold text-purple-700 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 border border-purple-200 hover:border-transparent"
                    >
                      👑 Admin
                    </Link>
                  )}

                  {user?.role === "business_owner" && (
                    <Link
                      to="/dashboard"
                      className="group relative px-4 py-2 rounded-xl text-sm font-semibold text-blue-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 border border-blue-200 hover:border-transparent"
                    >
                      📊 Dashboard
                    </Link>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="h-10 px-4 rounded-xl border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-300"
                  >
                    🚪 Sign Out
                  </Button>
                </div>
              ) : (
                <div className="ml-6">
                  <Link to="/login">
                    <Button className="h-10 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group">
                      <span className="flex items-center gap-2">
                        ✨ Sign In
                        <Sparkles className="w-4 h-4 group-hover:animate-spin" />
                      </span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 group"
            >
              <div className="relative">
                <div
                  className={`transition-all duration-300 ${mobileMenuOpen ? "rotate-90 scale-110" : "rotate-0"}`}
                >
                  {mobileMenuOpen ? (
                    <X className="h-6 w-6 text-red-600" />
                  ) : (
                    <Menu className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-4 pt-4 pb-6 space-y-3 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-xl border-t border-blue-100/50 shadow-2xl">
              <Link
                to="/"
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                  isCurrentPage("/")
                    ? "text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 transform hover:scale-105"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                🏠 Home
              </Link>
              <Link
                to="/browse"
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                  isCurrentPage("/browse")
                    ? "text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 transform hover:scale-105"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                🔍 Browse Services
              </Link>
              <Link
                to="/add-business"
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                  isCurrentPage("/add-business")
                    ? "text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 transform hover:scale-105"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                ➕ Add Business
              </Link>

              {/* Mobile Authentication Section */}
              {isAuthenticated ? (
                <div className="space-y-1 pt-2 border-t border-border">
                  <div className="px-3 py-2">
                    <p className="text-sm text-muted-foreground">
                      Welcome, {user?.name}
                    </p>
                  </div>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  {user?.role === "business_owner" && (
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <div className="px-3 py-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-2 pt-4 border-t border-border">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 w-full"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
