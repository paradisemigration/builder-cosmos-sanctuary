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
          ? "bg-white/95 backdrop-blur-xl shadow-2xl border-b border-orange-100/50"
          : "bg-white/85 backdrop-blur-lg border-b border-white/20"
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 group">
              <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 via-purple-600 to-orange-600 bg-clip-text text-transparent">
                <span className="inline-flex items-center gap-2">
                  <Globe className="w-6 h-6 text-orange-500" />
                  Trusted<span className="text-gray-800">Immigration</span>
                  <Sparkles className="w-4 h-4 text-purple-500" />
                </span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                isCurrentPage("/")
                  ? "text-white bg-gradient-to-r from-orange-500 to-purple-500"
                  : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              🏠 Home
            </Link>

            <Link
              to="/browse"
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                isCurrentPage("/browse")
                  ? "text-white bg-gradient-to-r from-orange-500 to-purple-500"
                  : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              🔍 Browse Services
            </Link>

            <Link
              to="/add-business"
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                isCurrentPage("/add-business")
                  ? "text-white bg-gradient-to-r from-orange-500 to-purple-500"
                  : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              ➕ Add Business
            </Link>

            <Link
              to="/report"
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                isCurrentPage("/report")
                  ? "text-white bg-gradient-to-r from-red-500 to-orange-500"
                  : "text-gray-700 hover:text-red-600 hover:bg-red-50"
              }`}
            >
              ⚠️ Report Scam
            </Link>

            {/* Authentication */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-xl border border-green-200">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Welcome, {user?.name}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  🚪 Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white font-semibold">
                  ✨ Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-red-600" />
              ) : (
                <Menu className="h-6 w-6 text-orange-600" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                🏠 Home
              </Link>

              <Link
                to="/browse"
                className="block px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                🔍 Browse Services
              </Link>

              <Link
                to="/add-business"
                className="block px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                ➕ Add Business
              </Link>

              <Link
                to="/report"
                className="block px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                ⚠️ Report Scam
              </Link>

              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4">
                  <div className="px-3 py-2">
                    <span className="text-sm text-gray-600">
                      Welcome, {user?.name}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="w-full justify-start border-red-200 text-red-700 hover:bg-red-50"
                  >
                    🚪 Sign Out
                  </Button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4">
                  <Link
                    to="/login"
                    className="block w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full bg-gradient-to-r from-orange-600 to-purple-600 text-white">
                      ✨ Sign In
                    </Button>
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
