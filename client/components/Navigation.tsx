import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

interface NavigationProps {
  className?: string;
}

export function Navigation({ className = "" }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const isCurrentPage = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-bold text-primary">
                Dubai<span className="text-dubai-gold">Visa</span>Directory
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isCurrentPage("/")
                    ? "text-foreground bg-primary/10"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Home
              </Link>
              <Link
                to="/browse"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isCurrentPage("/browse")
                    ? "text-foreground bg-primary/10"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Browse Services
              </Link>
              <Link
                to="/add-business"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isCurrentPage("/add-business")
                    ? "text-foreground bg-primary/10"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                Add Business
              </Link>

              {/* Authentication Section */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground">
                    Welcome, {user?.name}
                  </span>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  {user?.role === "business_owner" && (
                    <Link
                      to="/dashboard"
                      className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="h-9"
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2"
                >
                  Sign In
                </Link>
              )}
            </div>
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
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isCurrentPage("/")
                    ? "text-foreground bg-primary/10"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/browse"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isCurrentPage("/browse")
                    ? "text-foreground bg-primary/10"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Services
              </Link>
              <Link
                to="/add-business"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isCurrentPage("/add-business")
                    ? "text-foreground bg-primary/10"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Add Business
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
