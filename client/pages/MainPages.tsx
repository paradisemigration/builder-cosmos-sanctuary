import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Search,
  MapPin,
  Building,
  DollarSign,
  Plus,
  Info,
  Phone,
  HelpCircle,
  Shield,
  FileText,
  LogIn,
  Settings,
  Upload,
  Activity,
  Users,
  Grid,
  Star,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mainPageLinks } from "@/lib/all-categories";

export default function MainPages() {
  const [searchQuery, setSearchQuery] = useState("");

  // Group pages by category
  const pageGroups = {
    main: [
      {
        ...mainPageLinks.find((p) => p.path === "/"),
        icon: Home,
        color: "blue",
      },
      {
        ...mainPageLinks.find((p) => p.path === "/business"),
        icon: Search,
        color: "green",
      },
      {
        ...mainPageLinks.find((p) => p.path === "/all-cities-categories"),
        icon: Grid,
        color: "purple",
      },
      {
        ...mainPageLinks.find((p) => p.path === "/sitemap"),
        icon: MapPin,
        color: "orange",
      },
    ],
    business: [
      {
        ...mainPageLinks.find((p) => p.path === "/plans"),
        icon: DollarSign,
        color: "yellow",
      },
      {
        ...mainPageLinks.find((p) => p.path === "/add-business"),
        icon: Plus,
        color: "green",
      },
      {
        ...mainPageLinks.find((p) => p.path === "/dashboard"),
        icon: Activity,
        color: "blue",
      },
      {
        ...mainPageLinks.find((p) => p.path === "/cant-find-business"),
        icon: AlertTriangle,
        color: "orange",
      },
    ],
    info: [
      {
        ...mainPageLinks.find((p) => p.path === "/about"),
        icon: Info,
        color: "blue",
      },
      {
        ...mainPageLinks.find((p) => p.path === "/contact"),
        icon: Phone,
        color: "green",
      },
      {
        ...mainPageLinks.find((p) => p.path === "/help"),
        icon: HelpCircle,
        color: "purple",
      },
    ],
    legal: [
      {
        ...mainPageLinks.find((p) => p.path === "/privacy"),
        icon: Shield,
        color: "red",
      },
      {
        ...mainPageLinks.find((p) => p.path === "/terms"),
        icon: FileText,
        color: "blue",
      },
    ],
    admin: [
      {
        ...mainPageLinks.find((p) => p.path === "/login"),
        icon: LogIn,
        color: "gray",
      },
      {
        ...mainPageLinks.find((p) => p.path === "/admin"),
        icon: Settings,
        color: "red",
      },
      {
        ...mainPageLinks.find((p) => p.path === "/admin/bulk-upload"),
        icon: Upload,
        color: "purple",
      },
      {
        ...mainPageLinks.find((p) => p.path === "/admin/status"),
        icon: Activity,
        color: "orange",
      },
    ],
  };

  // Filter pages based on search
  const filteredPages = searchQuery
    ? mainPageLinks.filter(
        (page) =>
          page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : mainPageLinks;

  const getIconComponent = (iconName: any) => {
    const IconComponent = iconName;
    return IconComponent ? (
      <IconComponent className="w-5 h-5" />
    ) : (
      <Building className="w-5 h-5" />
    );
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100",
      green: "border-green-200 bg-green-50 text-green-600 hover:bg-green-100",
      purple:
        "border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100",
      orange:
        "border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100",
      yellow:
        "border-yellow-200 bg-yellow-50 text-yellow-600 hover:bg-yellow-100",
      red: "border-red-200 bg-red-50 text-red-600 hover:bg-red-100",
      gray: "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100",
    };
    return colors[color] || colors.blue;
  };

  const renderPageCard = (page: any, showIcon = true) => (
    <Link key={page.path} to={page.path} className="group block">
      <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {showIcon && page.icon && (
              <div
                className={`p-3 rounded-lg border-2 ${getColorClasses(page.color)} transition-colors`}
              >
                {getIconComponent(page.icon)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                {page.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{page.description}</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {page.path}
                </Badge>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const renderPageGroup = (title: string, pages: any[], icon: any) => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
        {getIconComponent(icon)}
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pages.filter((p) => p).map((page) => renderPageCard(page))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <section className="pt-20 pb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              All Main Pages
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              Complete directory of all important pages and features
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-gray-900"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">{mainPageLinks.length}</p>
                  <p className="text-sm text-blue-100">Total Pages</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-blue-100">Categories</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-sm text-blue-100">Admin Pages</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-white">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold">24/7</p>
                  <p className="text-sm text-blue-100">Available</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto max-w-7xl px-4">
          {searchQuery ? (
            /* Search Results */
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Search Results for "{searchQuery}"
                </h2>
                <p className="text-gray-600">
                  Found {filteredPages.length} pages matching your search
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPages.map((page) => renderPageCard(page, false))}
              </div>
            </div>
          ) : (
            /* Grouped Pages */
            <Tabs defaultValue="overview" className="space-y-8">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="main">Main Pages</TabsTrigger>
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="info">Information</TabsTrigger>
                <TabsTrigger value="legal">Legal</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              {/* Overview */}
              <TabsContent value="overview">
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Quick Access to All Features
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      Navigate to any section of VisaConsult India platform.
                      Find consultants, manage your business, access admin
                      tools, or get support.
                    </p>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Link to="/business" className="group">
                      <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-green-300 bg-gradient-to-br from-green-50 to-green-100">
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                            <Search className="w-6 h-6 text-green-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Find Consultants
                          </h3>
                          <p className="text-sm text-gray-600">
                            Search and browse consultants
                          </p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link to="/add-business" className="group">
                      <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                            <Plus className="w-6 h-6 text-blue-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            List Business
                          </h3>
                          <p className="text-sm text-gray-600">
                            Add your business to directory
                          </p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link to="/admin" className="group">
                      <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-red-300 bg-gradient-to-br from-red-50 to-red-100">
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-red-200 transition-colors">
                            <Settings className="w-6 h-6 text-red-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Admin Panel
                          </h3>
                          <p className="text-sm text-gray-600">
                            Manage platform (Admin only)
                          </p>
                        </CardContent>
                      </Card>
                    </Link>

                    <Link to="/help" className="group">
                      <Card className="hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100">
                        <CardContent className="p-6 text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                            <HelpCircle className="w-6 h-6 text-purple-600" />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Get Help
                          </h3>
                          <p className="text-sm text-gray-600">
                            Support and FAQ
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>

                  {/* Recent Updates */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        Recent Updates
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              48 Service Categories Added
                            </p>
                            <p className="text-sm text-gray-600">
                              Complete category directory now available
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              UAE Cities Integration
                            </p>
                            <p className="text-sm text-gray-600">
                              Now covering Dubai, Abu Dhabi, and more UAE cities
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Enhanced Admin Panel
                            </p>
                            <p className="text-sm text-gray-600">
                              City-category statistics and mobile responsiveness
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Main Pages */}
              <TabsContent value="main">
                {renderPageGroup(
                  "Main Navigation Pages",
                  pageGroups.main,
                  Home,
                )}
              </TabsContent>

              {/* Business */}
              <TabsContent value="business">
                {renderPageGroup(
                  "Business & Listings",
                  pageGroups.business,
                  Building,
                )}
              </TabsContent>

              {/* Information */}
              <TabsContent value="info">
                {renderPageGroup(
                  "Information & Support",
                  pageGroups.info,
                  Info,
                )}
              </TabsContent>

              {/* Legal */}
              <TabsContent value="legal">
                {renderPageGroup("Legal & Policies", pageGroups.legal, Shield)}
              </TabsContent>

              {/* Admin */}
              <TabsContent value="admin">
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-red-900">
                        Admin Access Required
                      </h3>
                    </div>
                    <p className="text-sm text-red-700">
                      These pages require admin privileges. Login with admin
                      credentials to access.
                    </p>
                  </div>
                  {renderPageGroup(
                    "Administrative Tools",
                    pageGroups.admin,
                    Settings,
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Explore Our Complete Platform
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Access thousands of verified consultants across 48 categories and
            100+ cities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/all-cities-categories">Browse All Categories</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link to="/sitemap">View Complete Sitemap</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
