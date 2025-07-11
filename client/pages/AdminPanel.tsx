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
import { ImageUpload } from "@/components/ImageUpload";
import { indianCities, categoryMapping } from "@/lib/data";
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

  // Modal states for different admin functions
  const [showBusinessDetails, setShowBusinessDetails] = useState(false);
  const [showEditBusiness, setShowEditBusiness] = useState(false);
  const [showReviewDetails, setShowReviewDetails] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null,
  );
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Sample review data
  const sampleReviews = [
    {
      id: 1,
      title: "Excellent visa consultation service!",
      content:
        "I had a wonderful experience with their team. They guided me through the entire student visa process for Canada. Very professional and responsive. Highly recommended for anyone looking for visa assistance.",
      rating: 5,
      businessName: "VISApro Consultants",
      businessId: "1",
      userName: "Priya Sharma",
      userEmail: "priya.sharma@email.com",
      date: "2024-01-15",
      status: "approved",
      helpful: 12,
    },
    {
      id: 2,
      title: "Good service but slow response",
      content:
        "They helped me get my work visa approved but the communication was a bit slow. Overall satisfied with the outcome.",
      rating: 4,
      businessName: "Global Immigration Services",
      businessId: "2",
      userName: "Rahul Kumar",
      userEmail: "rahul.k@email.com",
      date: "2024-01-12",
      status: "approved",
      helpful: 8,
    },
    {
      id: 3,
      title: "Suspicious review - possible spam",
      content:
        "Best service ever!!! 100% guarantee success rate amazing team contact now for best deals!!!",
      rating: 5,
      businessName: "Quick Visa Solutions",
      businessId: "3",
      userName: "Test User",
      userEmail: "test@spam.com",
      date: "2024-01-10",
      status: "flagged",
      helpful: 0,
    },
  ];

  // Sample user data
  const sampleUsers = [
    {
      id: 1,
      name: "Amit Patel",
      email: "amit.patel@email.com",
      type: "business",
      status: "active",
      joinDate: "2023-08-15",
      lastActive: "2 hours ago",
      businessCount: 1,
      reviewsCount: 0,
      phone: "+91 98765 43210",
    },
    {
      id: 2,
      name: "Sneha Desai",
      email: "sneha.desai@email.com",
      type: "individual",
      status: "active",
      joinDate: "2024-01-05",
      lastActive: "1 day ago",
      businessCount: 0,
      reviewsCount: 3,
      phone: "+91 87654 32109",
    },
  ];

  // Generate comprehensive SEO data for all pages
  const generateSEOData = () => {
    const baseSEOData = {
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
      business: {
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
      privacy: {
        title: "Privacy Policy - VisaConsult India",
        description:
          "Read our privacy policy and learn how we protect your personal information on VisaConsult India.",
        keywords: "privacy policy, data protection, personal information",
        ogTitle: "Privacy Policy - VisaConsult India",
        ogDescription:
          "Read our privacy policy and learn how we protect your personal information on VisaConsult India.",
        ogImage: "/og-image.jpg",
      },
      terms: {
        title: "Terms of Service - VisaConsult India",
        description:
          "Read our terms of service and understand the rules for using VisaConsult India platform.",
        keywords: "terms of service, terms and conditions, legal",
        ogTitle: "Terms of Service - VisaConsult India",
        ogDescription:
          "Read our terms of service and understand the rules for using VisaConsult India platform.",
        ogImage: "/og-image.jpg",
      },
    };

    // Add city pages
    const cityPages = {};
    indianCities.slice(0, 16).forEach((city) => {
      const cityLower = city.toLowerCase();
      cityPages[`city-${cityLower}`] = {
        title: `Visa Consultants in ${city} - VisaConsult India`,
        description: `Find trusted visa consultants and immigration services in ${city}. Compare top-rated agencies for student visas, work permits, and more.`,
        keywords: `visa consultants ${city}, immigration services ${city}, ${city} visa agents, student visa ${city}`,
        ogTitle: `Best Visa Consultants in ${city} - VisaConsult India`,
        ogDescription: `Find trusted visa consultants and immigration services in ${city}. Compare top-rated agencies for student visas, work permits, and more.`,
        ogImage: "/og-image.jpg",
      };
    });

    // Add city-category pages
    const categoryPages = {};
    indianCities.slice(0, 16).forEach((city) => {
      Object.entries(categoryMapping).forEach(([slug, categoryName]) => {
        const cityLower = city.toLowerCase();
        categoryPages[`${cityLower}-${slug}`] = {
          title: `${categoryName} in ${city} - VisaConsult India`,
          description: `Find expert ${categoryName.toLowerCase()} in ${city}. Compare services, read reviews, and get professional visa assistance.`,
          keywords: `${categoryName} ${city}, ${slug.replace("-", " ")} ${city}, visa services ${city}`,
          ogTitle: `Best ${categoryName} in ${city} - VisaConsult India`,
          ogDescription: `Find expert ${categoryName.toLowerCase()} in ${city}. Compare services, read reviews, and get professional visa assistance.`,
          ogImage: "/og-image.jpg",
        };
      });
    });

    return { ...baseSEOData, ...cityPages, ...categoryPages };
  };

  // SEO data for different pages
  const [pageSEOData, setPageSEOData] = useState(generateSEOData());

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

  // Handler functions for admin actions
  const handleViewBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setShowBusinessDetails(true);
  };

  const handleEditBusiness = (business: Business) => {
    setSelectedBusiness(business);
    setShowEditBusiness(true);
  };

  const handleApproveBusiness = (businessId: string) => {
    // In real app, would call API
    alert(`Business ${businessId} approved successfully!`);
  };

  const handleDeleteBusiness = (businessId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this business? This action cannot be undone.",
      )
    ) {
      // In real app, would call API
      alert(`Business ${businessId} deleted successfully!`);
    }
  };

  const handleViewReview = (review: any) => {
    setSelectedReview(review);
    setShowReviewDetails(true);
  };

  const handleFlagReview = (reviewId: number) => {
    // In real app, would call API
    alert(`Review ${reviewId} flagged for moderation!`);
  };

  const handleDeleteReview = (reviewId: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      // In real app, would call API
      alert(`Review ${reviewId} deleted successfully!`);
    }
  };

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleSuspendUser = (userId: number) => {
    if (confirm("Are you sure you want to suspend this user?")) {
      // In real app, would call API
      alert(`User ${userId} suspended successfully!`);
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
                onClick={() => setActiveTab("media")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "media"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Media
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
                              <DropdownMenuItem
                                onClick={() => handleViewBusiness(business)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditBusiness(business)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleApproveBusiness(business.id)
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() =>
                                  handleDeleteBusiness(business.id)
                                }
                              >
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
                    {sampleUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-600">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 capitalize">
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>{user.lastActive}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleViewUser(user)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleViewUser(user)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleSuspendUser(user.id)}
                              >
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
                    {sampleReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{review.title}</p>
                            <p className="text-sm text-gray-600">
                              {review.content.substring(0, 60)}...
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{review.businessName}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className={`h-4 w-4 ${
                                  index < review.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              review.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : review.status === "flagged"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-orange-100 text-orange-800"
                            }
                          >
                            {review.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{review.date}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleViewReview(review)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Full Review
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleFlagReview(review.id)}
                              >
                                <Flag className="h-4 w-4 mr-2" />
                                Flag as Spam
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteReview(review.id)}
                              >
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
            </div>
          )}

          {/* Media Management */}
          {activeTab === "media" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Media Management & Cloud Storage
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                  </Button>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Upload
                  </Button>
                </div>
              </div>

              {/* Media Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Globe className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Google Cloud Storage
                        </p>
                        <p className="text-2xl font-bold text-gray-900">Ready</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Building className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Business Images
                        </p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <FileText className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Storage Used
                        </p>
                        <p className="text-2xl font-bold text-gray-900">0 MB</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <TrendingUp className="h-8 w-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          This Month
                        </p>
                        <p className="text-2xl font-bold text-gray-900">0</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Upload Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Business Logos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      onUpload={(urls) => console.log("Logos uploaded:", urls)}
                      multiple={true}
                      maxFiles={5}
                      folder="logos"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Cover Images
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImageUpload
                      onUpload={(urls) => console.log("Covers uploaded:", urls)}
                      multiple={true}
                      maxFiles={5}
                      folder="covers"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Gallery Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Gallery Images (Bulk Upload)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    onUpload={(urls) => console.log("Gallery uploaded:", urls)}
                    multiple={true}
                    maxFiles={50}
                    folder="gallery"
                  />
                </CardContent>
              </Card>

              {/* Setup Instructions */}
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800">
                    🚀 Google Cloud Storage Setup Required
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-yellow-700">
                  <p className="mb-4">
                    To enable image uploads, complete these steps:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Create a Google Cloud Storage bucket</li>
                    <li>Generate service account key JSON file</li>
                    <li>Update .env file with your credentials</li>
                    <li>Start the API server: npm run dev:api</li>
                  </ol>
                  <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono">
                    <p>GOOGLE_CLOUD_PROJECT_ID=your-project-id</p>
                    <p>GOOGLE_CLOUD_KEY_FILE=path/to/key.json</p>
                    <p>GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

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
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-semibold">
                            Manage SEO for {Object.keys(pageSEOData).length}{" "}
                            pages:
                          </h4>
                          <div className="text-sm text-gray-600">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
                              Main: 7
                            </span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                              Cities: 16
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              Categories: 128
                            </span>
                          </div>
                        </div>

                        {/* Main Pages */}
                        <div>
                          <h5 className="text-md font-medium text-gray-800 mb-3">
                            📄 Main Pages
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {Object.entries(pageSEOData)
                              .filter(
                                ([key]) =>
                                  !key.includes("-") || key === "list-business",
                              )
                              .map(([pageKey, data]) => (
                                <Card
                                  key={pageKey}
                                  className="cursor-pointer hover:shadow-lg transition-shadow border-blue-200"
                                  onClick={() => handleSEOEdit(pageKey)}
                                >
                                  <CardContent className="p-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <h6 className="font-medium text-sm capitalize">
                                        {pageKey.replace("-", " ")}
                                      </h6>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-6 text-xs"
                                      >
                                        Edit
                                      </Button>
                                    </div>
                                    <p className="text-xs text-gray-600 truncate">
                                      {data.title}
                                    </p>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>

                        {/* City Pages */}
                        <div>
                          <h5 className="text-md font-medium text-gray-800 mb-3">
                            🏙️ City Directory Pages (16)
                          </h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
                            {Object.entries(pageSEOData)
                              .filter(([key]) => key.startsWith("city-"))
                              .map(([pageKey, data]) => (
                                <Card
                                  key={pageKey}
                                  className="cursor-pointer hover:shadow-lg transition-shadow border-green-200"
                                  onClick={() => handleSEOEdit(pageKey)}
                                >
                                  <CardContent className="p-2">
                                    <div className="text-center">
                                      <h6 className="font-medium text-xs capitalize">
                                        {pageKey
                                          .replace("city-", "")
                                          .replace("-", " ")}
                                      </h6>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-5 text-xs mt-1"
                                      >
                                        Edit
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        </div>

                        {/* Category Pages */}
                        <div>
                          <h5 className="text-md font-medium text-gray-800 mb-3">
                            🏢 City Category Pages (128)
                          </h5>
                          <div className="space-y-3">
                            {indianCities.slice(0, 4).map((city) => (
                              <div
                                key={city}
                                className="border rounded-lg p-3 bg-gray-50"
                              >
                                <h6 className="font-medium text-sm mb-2">
                                  {city} Categories:
                                </h6>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {Object.keys(categoryMapping).map((slug) => {
                                    const pageKey = `${city.toLowerCase()}-${slug}`;
                                    return (
                                      <Card
                                        key={pageKey}
                                        className="cursor-pointer hover:shadow-lg transition-shadow border-purple-200"
                                        onClick={() => handleSEOEdit(pageKey)}
                                      >
                                        <CardContent className="p-2">
                                          <div className="text-center">
                                            <h6 className="font-medium text-xs">
                                              {slug.replace("-", " ")}
                                            </h6>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="h-5 text-xs mt-1"
                                            >
                                              Edit
                                            </Button>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                            <div className="text-center mt-4">
                              <p className="text-sm text-gray-500 mb-2">
                                +{" "}
                                {(indianCities.length - 4) *
                                  Object.keys(categoryMapping).length}{" "}
                                more category pages...
                              </p>
                              <Button variant="outline" size="sm">
                                View All Category Pages
                              </Button>
                            </div>
                          </div>
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

              {/* Business Details Modal */}
              {showBusinessDetails && selectedBusiness && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Business Details
                      </h3>
                      <Button
                        variant="outline"
                        onClick={() => setShowBusinessDetails(false)}
                      >
                        ✕
                      </Button>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={selectedBusiness.logo}
                          alt={selectedBusiness.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h4 className="text-xl font-semibold">
                            {selectedBusiness.name}
                          </h4>
                          <p className="text-gray-600">
                            {selectedBusiness.category}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Contact Email
                          </label>
                          <p className="text-gray-900">
                            {selectedBusiness.email}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Phone
                          </label>
                          <p className="text-gray-900">
                            {selectedBusiness.phone}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Location
                          </label>
                          <p className="text-gray-900">
                            {selectedBusiness.city}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Rating
                          </label>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>{selectedBusiness.rating}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <Badge
                            className={
                              selectedBusiness.isVerified
                                ? "bg-green-100 text-green-800"
                                : "bg-orange-100 text-orange-800"
                            }
                          >
                            {selectedBusiness.isVerified
                              ? "Verified"
                              : "Pending"}
                          </Badge>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Plan
                          </label>
                          <Badge variant="outline">
                            {selectedBusiness.plan || "Premium"}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <p className="text-gray-900">
                          {selectedBusiness.description}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <p className="text-gray-900">
                          {selectedBusiness.address}
                        </p>
                      </div>
                      <div className="flex justify-end gap-4">
                        <Button
                          variant="outline"
                          onClick={() => setShowBusinessDetails(false)}
                        >
                          Close
                        </Button>
                        <Button
                          onClick={() => {
                            setShowBusinessDetails(false);
                            handleEditBusiness(selectedBusiness);
                          }}
                        >
                          Edit Business
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Details Modal */}
              {showReviewDetails && selectedReview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Review Details
                      </h3>
                      <Button
                        variant="outline"
                        onClick={() => setShowReviewDetails(false)}
                      >
                        ✕
                      </Button>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <Star
                                key={index}
                                className={`h-5 w-5 ${
                                  index < selectedReview.rating
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="font-semibold">
                              {selectedReview.rating}/5
                            </span>
                          </div>
                          <Badge
                            className={
                              selectedReview.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : selectedReview.status === "flagged"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-orange-100 text-orange-800"
                            }
                          >
                            {selectedReview.status}
                          </Badge>
                        </div>
                        <h4 className="text-xl font-semibold mb-2">
                          {selectedReview.title}
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedReview.content}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Reviewer
                          </label>
                          <p className="text-gray-900">
                            {selectedReview.userName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedReview.userEmail}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Business
                          </label>
                          <p className="text-gray-900">
                            {selectedReview.businessName}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Date
                          </label>
                          <p className="text-gray-900">{selectedReview.date}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Helpful Votes
                          </label>
                          <p className="text-gray-900">
                            {selectedReview.helpful}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-4 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setShowReviewDetails(false)}
                        >
                          Close
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleFlagReview(selectedReview.id)}
                        >
                          <Flag className="h-4 w-4 mr-2" />
                          Flag Review
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteReview(selectedReview.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* User Details Modal */}
              {showUserDetails && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">
                        User Profile
                      </h3>
                      <Button
                        variant="outline"
                        onClick={() => setShowUserDetails(false)}
                      >
                        ✕
                      </Button>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-8 w-8 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold">
                            {selectedUser.name}
                          </h4>
                          <p className="text-gray-600 capitalize">
                            {selectedUser.type} User
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <p className="text-gray-900">{selectedUser.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Phone
                          </label>
                          <p className="text-gray-900">{selectedUser.phone}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Join Date
                          </label>
                          <p className="text-gray-900">
                            {selectedUser.joinDate}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Last Active
                          </label>
                          <p className="text-gray-900">
                            {selectedUser.lastActive}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Status
                          </label>
                          <Badge className="bg-green-100 text-green-800 capitalize">
                            {selectedUser.status}
                          </Badge>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            User Type
                          </label>
                          <Badge variant="outline" className="capitalize">
                            {selectedUser.type}
                          </Badge>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Business Listings
                          </label>
                          <p className="text-gray-900">
                            {selectedUser.businessCount}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Reviews Written
                          </label>
                          <p className="text-gray-900">
                            {selectedUser.reviewsCount}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-4 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setShowUserDetails(false)}
                        >
                          Close
                        </Button>
                        <Button variant="outline">Edit User</Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleSuspendUser(selectedUser.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Suspend User
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Edit Modal */}
              {showEditBusiness && selectedBusiness && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">
                        Edit Business
                      </h3>
                      <Button
                        variant="outline"
                        onClick={() => setShowEditBusiness(false)}
                      >
                        ✕
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Business Name
                        </label>
                        <Input defaultValue={selectedBusiness.name} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <Select defaultValue={selectedBusiness.category}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Student Visa Consultants">
                              Student Visa Consultants
                            </SelectItem>
                            <SelectItem value="Work Visa Consultants">
                              Work Visa Consultants
                            </SelectItem>
                            <SelectItem value="Tourist Visa Consultants">
                              Tourist Visa Consultants
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <Input
                          type="email"
                          defaultValue={selectedBusiness.email}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone
                        </label>
                        <Input defaultValue={selectedBusiness.phone} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <Input defaultValue={selectedBusiness.city} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <Select
                          defaultValue={
                            selectedBusiness.isVerified ? "verified" : "pending"
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                          rows={3}
                          defaultValue={selectedBusiness.description}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
                          rows={2}
                          defaultValue={selectedBusiness.address}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-6">
                      <Button
                        variant="outline"
                        onClick={() => setShowEditBusiness(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          alert("Business updated successfully!");
                          setShowEditBusiness(false);
                        }}
                      >
                        Save Changes
                      </Button>
                    </div>
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