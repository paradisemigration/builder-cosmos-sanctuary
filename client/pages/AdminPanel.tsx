import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import {
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  MoreHorizontal,
  Download,
  Plus,
  Shield,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Users,
  Building,
  Star,
  TrendingUp,
  DollarSign,
  BarChart3,
  Settings,
  Upload,
  Globe,
  CreditCard,
  UserCheck,
  MessageSquare,
  Flag,
  PenTool,
  Bell,
  RefreshCw,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sampleBusinesses, type Business } from "@/lib/data";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [showSEOManager, setShowSEOManager] = useState(false);
  const [selectedPage, setSelectedPage] = useState("");
  const [seoData, setSeoData] = useState({
    title: "",
    description: "",
    keywords: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  });

  // SEO data for different pages
  const [pageSEOData, setPageSEOData] = useState({
    home: {
      title: "VisaConsult India - Best Visa Consultants Directory",
      description:
        "Find trusted visa consultants and agencies across India. Get expert help for student visas, work visas, tourist visas and more.",
      keywords:
        "visa consultants, immigration services, student visa, work visa, India",
      ogTitle: "VisaConsult India - Best Visa Consultants Directory",
      ogDescription:
        "Find trusted visa consultants and agencies across India. Get expert help for student visas, work visas, tourist visas and more.",
      ogImage: "/og-image.jpg",
    },
    about: {
      title: "About VisaConsult India - Our Mission & Values",
      description:
        "Learn about VisaConsult India's mission to connect people with trusted visa consultants across the country.",
      keywords: "about us, visa consultants directory, company mission",
      ogTitle: "About VisaConsult India - Our Mission & Values",
      ogDescription:
        "Learn about VisaConsult India's mission to connect people with trusted visa consultants across the country.",
      ogImage: "/og-image.jpg",
    },
    browse: {
      title: "Browse Visa Consultants - VisaConsult India",
      description:
        "Browse and find visa consultants by location and specialization. Compare services and read reviews.",
      keywords: "browse consultants, find visa agents, search consultants",
      ogTitle: "Browse Visa Consultants - VisaConsult India",
      ogDescription:
        "Browse and find visa consultants by location and specialization. Compare services and read reviews.",
      ogImage: "/og-image.jpg",
    },
    contact: {
      title: "Contact Us - VisaConsult India",
      description:
        "Get in touch with VisaConsult India team. We're here to help you find the right visa consultant.",
      keywords: "contact us, customer support, help",
      ogTitle: "Contact Us - VisaConsult India",
      ogDescription:
        "Get in touch with VisaConsult India team. We're here to help you find the right visa consultant.",
      ogImage: "/og-image.jpg",
    },
    "list-business": {
      title: "List Your Visa Consultancy - VisaConsult India",
      description:
        "List your visa consultancy on India's leading directory. Grow your business and reach more clients.",
      keywords: "list business, visa consultancy listing, grow business",
      ogTitle: "List Your Visa Consultancy - VisaConsult India",
      ogDescription:
        "List your visa consultancy on India's leading directory. Grow your business and reach more clients.",
      ogImage: "/og-image.jpg",
    },
  });

  const handleSEOEdit = (pageKey: string) => {
    setSelectedPage(pageKey);
    setSeoData(
      pageSEOData[pageKey as keyof typeof pageSEOData] || {
        title: "",
        description: "",
        keywords: "",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
      },
    );
    setShowSEOManager(true);
  };

  const handleSEOSave = () => {
    if (selectedPage) {
      setPageSEOData((prev) => ({
        ...prev,
        [selectedPage]: seoData,
      }));
      setShowSEOManager(false);
      setSelectedPage("");
      // In a real app, this would save to backend
    }
  };

  // Dashboard Statistics
  const dashboardStats = {
    totalListings: 8500,
    pendingListings: 42,
    totalUsers: 125000,
    monthlyRevenue: 2850000,
    activeUsers: 89500,
    verifiedListings: 8100,
    reviewsThisMonth: 3420,
    conversionRate: 12.5,
  };

  useEffect(() => {
    document.title = "Admin Panel - VisaConsult India";
  }, []);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Header */}
      <div className="pt-20 pb-6 px-4 bg-white border-b">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your visa consultant directory
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "dashboard"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("listings")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "listings"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Listings
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reviews"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reviews
              </button>
              <button
                onClick={() => setActiveTab("content")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "content"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Content
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "payments"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Payments
              </button>
            </nav>
          </div>

          {/* Dashboard Overview */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Key Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Listings
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {dashboardStats.totalListings.toLocaleString()}
                        </p>
                        <p className="text-sm text-green-600">
                          +12% from last month
                        </p>
                      </div>
                      <Building className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Pending Approvals
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {dashboardStats.pendingListings}
                        </p>
                        <p className="text-sm text-orange-600">
                          Requires attention
                        </p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Users
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {dashboardStats.totalUsers.toLocaleString()}
                        </p>
                        <p className="text-sm text-green-600">
                          +8% from last month
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Monthly Revenue
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          ₹{(dashboardStats.monthlyRevenue / 100000).toFixed(1)}
                          L
                        </p>
                        <p className="text-sm text-green-600">
                          +15% from last month
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button className="h-20 flex-col" variant="outline">
                      <CheckCircle className="h-6 w-6 mb-2" />
                      Approve Listings
                    </Button>
                    <Button className="h-20 flex-col" variant="outline">
                      <Flag className="h-6 w-6 mb-2" />
                      Review Flags
                    </Button>
                    <Button className="h-20 flex-col" variant="outline" asChild>
                      <Link to="/admin/bulk-upload">
                        <Upload className="h-6 w-6 mb-2" />
                        Bulk Upload
                      </Link>
                    </Button>
                    <Button className="h-20 flex-col" variant="outline">
                      <BarChart3 className="h-6 w-6 mb-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Listing Management */}
          {activeTab === "listings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Listing Management
                </h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search listings..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select value={selectedTab} onValueChange={setSelectedTab}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Listings</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Listing
                  </Button>
                </div>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleBusinesses.slice(0, 10).map((business) => (
                      <TableRow key={business.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={business.logo}
                              alt={business.name}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium">{business.name}</p>
                              <p className="text-sm text-gray-600">
                                {business.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{business.category}</TableCell>
                        <TableCell>{business.city}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              business.isVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }
                          >
                            {business.isVerified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {business.plan || "Premium"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{business.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/admin/business/${business.id}/edit`}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* User Management */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  User Management
                </h2>
                <div className="flex items-center gap-4">
                  <Input placeholder="Search users..." className="w-64" />
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="User Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Users
                        </p>
                        <p className="text-2xl font-bold">125,000</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Business Owners
                        </p>
                        <p className="text-2xl font-bold">8,500</p>
                      </div>
                      <Building className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Active Today
                        </p>
                        <p className="text-2xl font-bold">12,450</p>
                      </div>
                      <UserCheck className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Last Active</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">User {i}</p>
                              <p className="text-sm text-gray-600">
                                user{i}@example.com
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {i % 2 === 0 ? "Business" : "Individual"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell>Jan 2024</TableCell>
                        <TableCell>2 hours ago</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <XCircle className="h-4 w-4 mr-2" />
                                Suspend
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* Review Management */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Review Management
                </h2>
                <div className="flex items-center gap-4">
                  <Input placeholder="Search reviews..." className="w-64" />
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reviews</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                      <SelectItem value="spam">Spam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Reviews
                        </p>
                        <p className="text-2xl font-bold">45,230</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Flagged
                        </p>
                        <p className="text-2xl font-bold">28</p>
                      </div>
                      <Flag className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          This Month
                        </p>
                        <p className="text-2xl font-bold">3,420</p>
                      </div>
                      <Calendar className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Avg Rating
                        </p>
                        <p className="text-2xl font-bold">4.2</p>
                      </div>
                      <Star className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Review</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div>
                            <p className="font-medium">Great service!</p>
                            <p className="text-sm text-gray-600">
                              They helped me get my visa approved quickly...
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>Business {i}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className={`h-4 w-4 ${
                                  index < 4
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">
                            Approved
                          </Badge>
                        </TableCell>
                        <TableCell>Jan 15, 2024</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                View Full Review
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Flag className="h-4 w-4 mr-2" />
                                Flag as Spam
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* Content Management */}
          {activeTab === "content" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Content Management
                </h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Content
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      About Us Page
                    </h3>
                    <p className="text-sm text-gray-600">
                      Manage company information and team details
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: 2 days ago
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Shield className="h-8 w-8 text-green-600" />
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      Privacy Policy
                    </h3>
                    <p className="text-sm text-gray-600">
                      Update privacy and data protection policies
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: 1 week ago
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <FileText className="h-8 w-8 text-purple-600" />
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      Terms of Service
                    </h3>
                    <p className="text-sm text-gray-600">
                      Manage terms and conditions
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: 3 days ago
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Globe className="h-8 w-8 text-orange-600" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowSEOManager(true)}
                      >
                        Manage
                      </Button>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">SEO Settings</h3>
                    <p className="text-sm text-gray-600">
                      Manage meta tags, titles, and descriptions for all pages
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {Object.keys(pageSEOData).length} pages configured
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <PenTool className="h-8 w-8 text-red-600" />
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Blog Posts</h3>
                    <p className="text-sm text-gray-600">
                      Create and manage blog content
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      12 published posts
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Bell className="h-8 w-8 text-indigo-600" />
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      Notifications
                    </h3>
                    <p className="text-sm text-gray-600">
                      Manage email templates and notifications
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      8 active templates
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* SEO Manager Modal */}
              {showSEOManager && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">
                        SEO Management
                      </h3>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowSEOManager(false);
                          setSelectedPage("");
                        }}
                      >
                        ✕
                      </Button>
                    </div>

                    {!selectedPage ? (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold">
                          Select a page to manage SEO settings:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(pageSEOData).map(
                            ([pageKey, data]) => (
                              <Card
                                key={pageKey}
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                                onClick={() => handleSEOEdit(pageKey)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h5 className="font-semibold capitalize">
                                      {pageKey.replace("-", " ")} Page
                                    </h5>
                                    <Button size="sm" variant="outline">
                                      Edit
                                    </Button>
                                  </div>
                                  <p className="text-sm text-gray-600 truncate">
                                    {data.title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1 truncate">
                                    {data.description}
                                  </p>
                                </CardContent>
                              </Card>
                            ),
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                          <Button
                            variant="outline"
                            onClick={() => setSelectedPage("")}
                          >
                            ← Back to Pages
                          </Button>
                          <h4 className="text-lg font-semibold capitalize">
                            {selectedPage.replace("-", " ")} Page SEO Settings
                          </h4>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Page Title
                              </label>
                              <Input
                                value={seoData.title}
                                onChange={(e) =>
                                  setSeoData((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                  }))
                                }
                                placeholder="Enter page title (recommended: 50-60 characters)"
                                maxLength={60}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {seoData.title.length}/60 characters
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Description
                              </label>
                              <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                                rows={3}
                                value={seoData.description}
                                onChange={(e) =>
                                  setSeoData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                  }))
                                }
                                placeholder="Enter meta description (recommended: 150-160 characters)"
                                maxLength={160}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                {seoData.description.length}/160 characters
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Keywords (comma-separated)
                              </label>
                              <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                                rows={2}
                                value={seoData.keywords}
                                onChange={(e) =>
                                  setSeoData((prev) => ({
                                    ...prev,
                                    keywords: e.target.value,
                                  }))
                                }
                                placeholder="keyword1, keyword2, keyword3"
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h5 className="font-semibold text-gray-900">
                              Open Graph Settings
                            </h5>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                OG Title
                              </label>
                              <Input
                                value={seoData.ogTitle}
                                onChange={(e) =>
                                  setSeoData((prev) => ({
                                    ...prev,
                                    ogTitle: e.target.value,
                                  }))
                                }
                                placeholder="Title for social media sharing"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                OG Description
                              </label>
                              <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                                rows={3}
                                value={seoData.ogDescription}
                                onChange={(e) =>
                                  setSeoData((prev) => ({
                                    ...prev,
                                    ogDescription: e.target.value,
                                  }))
                                }
                                placeholder="Description for social media sharing"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                OG Image URL
                              </label>
                              <Input
                                value={seoData.ogImage}
                                onChange={(e) =>
                                  setSeoData((prev) => ({
                                    ...prev,
                                    ogImage: e.target.value,
                                  }))
                                }
                                placeholder="/path/to/image.jpg"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Preview */}
                        <div className="border-t pt-6">
                          <h5 className="font-semibold text-gray-900 mb-4">
                            Search Preview
                          </h5>
                          <div className="border rounded-lg p-4 bg-gray-50">
                            <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                              {seoData.title || "Page Title"}
                            </div>
                            <div className="text-green-700 text-sm">
                              visaconsultindia.com/
                              {selectedPage === "home" ? "" : selectedPage}
                            </div>
                            <div className="text-gray-600 text-sm mt-1">
                              {seoData.description ||
                                "Meta description will appear here..."}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowSEOManager(false);
                              setSelectedPage("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSEOSave}>
                            Save SEO Settings
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payments & Monetization */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Payments & Revenue
                </h2>
                <div className="flex items-center gap-4">
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Payment Settings
                  </Button>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Total Revenue
                        </p>
                        <p className="text-2xl font-bold">₹28.5L</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          This Month
                        </p>
                        <p className="text-2xl font-bold">₹4.2L</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Active Subscriptions
                        </p>
                        <p className="text-2xl font-bold">1,250</p>
                      </div>
                      <CreditCard className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Conversion Rate
                        </p>
                        <p className="text-2xl font-bold">12.5%</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">
                                Premium Plan - Business {i}
                              </p>
                              <p className="text-sm text-gray-600">
                                Jan 15, 2024
                              </p>
                            </div>
                          </div>
                          <span className="font-medium text-green-600">
                            ₹2,999
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Plan Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Plan Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Free Plan</span>
                        <div className="flex items-center gap-3 flex-1 mx-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: "60%" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">6,800</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Premium Plan
                        </span>
                        <div className="flex items-center gap-3 flex-1 mx-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-orange-600 h-2 rounded-full"
                              style={{ width: "30%" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">1,450</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Business Pro
                        </span>
                        <div className="flex items-center gap-3 flex-1 mx-4">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: "10%" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">250</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
}
