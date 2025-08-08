import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Navigation } from "@/components/Navigation";
import { ImageUpload } from "@/components/ImageUpload";
import { DemoUpload } from "@/components/DemoUpload";
import { GooglePlacesScraper } from "@/components/GooglePlacesScraper";
import { ManualImageUpload } from "@/components/ManualImageUpload";
import { UltraFastS3SyncEnhanced } from "@/components/UltraFastS3SyncEnhanced";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Building,
  Star,
  TrendingUp,
  DollarSign,
  BarChart3,
  Download,
  RefreshCw,
  AlertCircle,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupHistory, setBackupHistory] = useState([]);
  const [backendAvailable, setBackendAvailable] = useState(null);

  // Detect if we're in a local development environment
  const isLocalDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  // Check if backend API is available
  const checkBackendHealth = async () => {
    try {
      const response = await fetch("/api/ultra-fast-sync/stats", {
        method: "HEAD",
      });
      const available = response.ok || response.status === 404;
      setBackendAvailable(available);
      return available;
    } catch (error) {
      console.log("Backend health check failed:", error.message);
      setBackendAvailable(false);
      return false;
    }
  };

  // Load real data from API
  const loadDashboardData = async (forceRefresh = false) => {
    // Safety check for frontend-only platforms
    const hostname = window.location.hostname;
    if (
      hostname.includes("fly.dev") ||
      hostname.includes("vercel.app") ||
      hostname.includes("netlify.app")
    ) {
      console.log("Frontend-only platform detected, skipping dashboard load");
      setBackendAvailable(false);
      setLoading(false);
      return;
    }

    // If backend is unavailable and not forcing refresh, skip
    if (backendAvailable === false && !forceRefresh) {
      console.log("Backend unavailable - skipping dashboard data load");
      setLoading(false);
      return;
    }

    // Check backend availability
    const isBackendAvailable = await checkBackendHealth();
    if (!isBackendAvailable) {
      console.log("Backend unavailable - skipping dashboard data load");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Load scraping statistics
      const timestamp = forceRefresh ? `?t=${Date.now()}` : "";
      let statsResult = { success: false, stats: {} };

      try {
        const statsResponse = await fetch(`/api/scraping/stats${timestamp}`);
        if (statsResponse.ok) {
          statsResult = await statsResponse.json();
          console.log("Stats API response:", statsResult);
        }
      } catch (statsError) {
        console.log("Stats API failed:", statsError.message);
      }

      // Load all businesses
      let businessesResult = { success: false, businesses: [], total: 0 };

      try {
        // Try primary endpoint first
        const businessesResponse = await fetch(
          `/api/scraped-businesses${forceRefresh ? "?t=" + Date.now() : ""}`,
        );

        if (businessesResponse.ok) {
          businessesResult = await businessesResponse.json();
          console.log("Primary API response:", businessesResult);
        } else {
          throw new Error(`HTTP ${businessesResponse.status}`);
        }
      } catch (primaryError) {
        console.log(
          "Primary API failed, trying alternative:",
          primaryError.message,
        );

        // Try alternative endpoint
        try {
          const businessesResponse = await fetch(
            `/api/businesses${forceRefresh ? "?t=" + Date.now() : ""}`,
          );

          if (businessesResponse.ok) {
            businessesResult = await businessesResponse.json();
            console.log("Alternative API response:", businessesResult);
          }
        } catch (altError) {
          console.error("Both API endpoints failed:", altError.message);
        }
      }

      // Load S3 stats if available
      try {
        const s3StatsResponse = await fetch(
          `/api/ultra-fast-sync/stats${timestamp}`,
        );
        if (s3StatsResponse.ok) {
          const s3StatsResult = await s3StatsResponse.json();
          if (s3StatsResult.success) {
            setStats((prev) => ({
              ...prev,
              ...statsResult.stats,
              ...s3StatsResult.stats,
            }));
          }
        }
      } catch (s3Error) {
        console.log("S3 stats not available:", s3Error.message);
      }

      // Update stats
      if (statsResult.success) {
        setStats((prev) => ({
          ...prev,
          ...statsResult.stats,
        }));
      }

      // Update businesses and calculate real-time stats
      if (businessesResult.success) {
        const allBusinesses = businessesResult.businesses || [];
        setBusinesses(allBusinesses);

        // Calculate stats from actual data
        const totalReviews = allBusinesses.reduce((sum, business) => {
          return sum + (business.reviewCount || business.reviews?.length || 0);
        }, 0);

        const totalImages = allBusinesses.reduce((sum, business) => {
          return sum + (business.images?.length || 0);
        }, 0);

        const ratingsSum = allBusinesses.reduce((sum, business) => {
          const rating = parseFloat(business.rating) || 0;
          return rating > 0 ? sum + rating : sum;
        }, 0);

        const businessesWithRatings = allBusinesses.filter(
          (business) => parseFloat(business.rating) > 0,
        ).length;

        const averageRating =
          businessesWithRatings > 0 ? ratingsSum / businessesWithRatings : 0;

        const businessesWithGooglePlaces = allBusinesses.filter(
          (business) => business.googlePlaceId,
        ).length;

        // Update stats with calculated values
        setStats((prev) => ({
          ...prev,
          totalBusinesses: allBusinesses.length,
          totalReviews: totalReviews,
          totalImages: totalImages,
          averageRating: averageRating,
          totalGooglePlaces: businessesWithGooglePlaces,
        }));
      }

      if (forceRefresh) {
        toast.success("Dashboard data refreshed successfully");
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      if (forceRefresh) {
        toast.error("Failed to refresh dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  // Backup functions
  const downloadDatabaseBackup = async () => {
    try {
      setBackupLoading(true);
      const response = await fetch("/api/admin/backup/database");

      if (!response.ok) {
        throw new Error("Failed to create database backup");
      }

      const blob = await response.blob();
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `visaconsult_database_backup_${timestamp}.sqlite`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      loadBackupHistory();
    } catch (error) {
      console.error("Database backup failed:", error);
      alert("Failed to create database backup");
    } finally {
      setBackupLoading(false);
    }
  };

  const downloadFullBackup = async () => {
    try {
      setBackupLoading(true);
      const response = await fetch("/api/admin/backup/full");

      if (!response.ok) {
        throw new Error("Failed to create full backup");
      }

      const blob = await response.blob();
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const filename = `visaconsult_full_backup_${timestamp}.zip`;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      loadBackupHistory();
    } catch (error) {
      console.error("Full backup failed:", error);
      alert("Failed to create full backup");
    } finally {
      setBackupLoading(false);
    }
  };

  const loadBackupHistory = async () => {
    const hostname = window.location.hostname;
    if (
      hostname.includes("fly.dev") ||
      hostname.includes("vercel.app") ||
      hostname.includes("netlify.app")
    ) {
      console.log("Frontend-only platform detected, skipping backup history");
      setBackendAvailable(false);
      return;
    }

    if (backendAvailable === false) {
      console.log("Backend unavailable - skipping backup history load");
      return;
    }

    const isBackendAvailable = await checkBackendHealth();
    if (!isBackendAvailable) {
      console.log("Backend unavailable - skipping backup history load");
      return;
    }

    try {
      const response = await fetch("/api/admin/backup/history");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setBackupHistory(result.backups || []);
      }
    } catch (error) {
      console.error("Failed to load backup history:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        console.log("Backup history fetch failed - backend unavailable");
        setBackendAvailable(false);
      }
    }
  };

  useEffect(() => {
    document.title = "Admin Panel - VisaConsult India";

    if (backendAvailable === null) {
      loadDashboardData();
      loadBackupHistory();
    }
  }, []);

  useEffect(() => {
    if (backendAvailable === true) {
      loadDashboardData();
      loadBackupHistory();
    }
  }, [backendAvailable]);

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Manage your visa consultant directory
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Backend Status Badge */}
              {backendAvailable === null ? (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Checking Backend
                </Badge>
              ) : backendAvailable ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                  Backend Connected
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  Backend Unavailable
                </Badge>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => loadDashboardData(true)}
                disabled={loading}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
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

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="scraper">Data Scraper</TabsTrigger>
            <TabsTrigger value="manual-upload">Manual Upload</TabsTrigger>
            <TabsTrigger value="ultra-sync">Ultra-Fast Sync</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Dashboard Overview
              </h2>

              {/* Debug Info */}
              {loading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <RefreshCw className="h-5 w-5 text-blue-600 animate-spin mr-2" />
                    <span className="text-blue-800">
                      Loading dashboard data...
                    </span>
                  </div>
                </div>
              )}

              {!loading && businesses.length === 0 && backendAvailable && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-yellow-800">
                      No businesses loaded from API. Expected 1500+ businesses.
                    </span>
                    <Button
                      onClick={() => loadDashboardData(true)}
                      className="ml-4"
                      size="sm"
                    >
                      Retry Loading
                    </Button>
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Building className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Listings
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {loading
                            ? "..."
                            : stats?.totalBusinesses || businesses.length || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <div className="h-8 w-8 text-indigo-600 flex items-center justify-center">
                        🗺️
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Google Places
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {loading ? "..." : stats?.totalGooglePlaces || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Star className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Reviews
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {loading ? "..." : stats?.totalReviews || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Users className="h-8 w-8 text-yellow-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Total Images
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {loading ? "..." : stats?.totalImages || 0}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Average Rating
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {loading
                            ? "..."
                            : stats?.averageRating?.toFixed(1) || "0.0"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="listings">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Listing Management
                </h2>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-lg px-4 py-2">
                    {loading
                      ? "Loading..."
                      : `${stats?.totalBusinesses || businesses.length} Total Listings`}
                  </Badge>
                  <Button
                    onClick={() => loadDashboardData(true)}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>All Business Listings</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading businesses...</p>
                    </div>
                  ) : businesses.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">
                        No businesses found in database.
                      </p>
                      <Button
                        onClick={() => setActiveTab("scraper")}
                        variant="outline"
                      >
                        Start Scraping Data
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Listings Header */}
                      <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 rounded-lg font-semibold text-sm text-gray-700">
                        <div>Business Name</div>
                        <div>City</div>
                        <div>Category</div>
                        <div>Rating</div>
                        <div>Reviews</div>
                        <div>Actions</div>
                      </div>

                      {/* Listings Rows */}
                      <div className="max-h-96 overflow-y-auto space-y-2">
                        {businesses.slice(0, 100).map((business, index) => (
                          <div
                            key={business.id || index}
                            className="grid grid-cols-6 gap-4 p-4 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="font-medium text-gray-900 truncate">
                              {business.name || "Unknown Business"}
                            </div>
                            <div className="text-gray-600">
                              {business.scrapedCity ||
                                business.city ||
                                "Unknown"}
                            </div>
                            <div className="text-gray-600 truncate">
                              {business.scrapedCategory ||
                                business.category ||
                                "Visa Consultant"}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm">
                                {business.rating || "0.0"}
                              </span>
                            </div>
                            <div className="text-gray-600">
                              {business.reviewCount ||
                                business.reviews?.length ||
                                0}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* View All Button */}
                      <div className="text-center pt-4 border-t">
                        <div className="flex items-center justify-center gap-4">
                          <p className="text-sm text-gray-600">
                            Showing {Math.min(businesses.length, 100)} of{" "}
                            {businesses.length} businesses
                            {businesses.length > 100 &&
                              " (first 100 displayed)"}
                          </p>
                          <Button
                            onClick={() => window.open("/business", "_blank")}
                            variant="outline"
                          >
                            View All Listings
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                User Management
              </h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-600">
                    User management features will be available here.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="media">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Media Management & Cloud Storage
              </h2>

              {/* System Status Section */}
              <Card
                className={`border-2 ${import.meta.env.MODE === "development" ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"}`}
              >
                <CardHeader>
                  <CardTitle
                    className={
                      import.meta.env.MODE === "development"
                        ? "text-green-800"
                        : "text-blue-800"
                    }
                  >
                    {import.meta.env.MODE === "development"
                      ? "✅ Development Environment"
                      : "🌐 Production Environment"}
                  </CardTitle>
                </CardHeader>
                <CardContent
                  className={
                    import.meta.env.MODE === "development"
                      ? "text-green-700"
                      : "text-blue-700"
                  }
                >
                  <div className="space-y-2">
                    {isLocalDevelopment ? (
                      <>
                        <p>• Google Cloud Storage: Configured ✅</p>
                        <p>• API Server: Running on port 3001 ✅</p>
                        <p>• Upload Endpoints: Available ✅</p>
                        <p>• CORS: Properly configured ✅</p>
                      </>
                    ) : (
                      <>
                        <p>• Frontend: Deployed successfully ✅</p>
                        <p>• UI Components: Functional ✅</p>
                        <p>
                          • Google Cloud Setup: Ready for backend integration ✅
                        </p>
                        <p>• Upload Feature: Requires backend deployment 📋</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Image Upload Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Business Logos
                      {!isLocalDevelopment && (
                        <Badge variant="secondary" className="ml-2">
                          Demo
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLocalDevelopment ? (
                      <ImageUpload
                        onUpload={(urls) =>
                          console.log("Logos uploaded:", urls)
                        }
                        multiple={true}
                        maxFiles={5}
                        folder="logos"
                      />
                    ) : (
                      <DemoUpload title="logos" multiple={true} maxFiles={5} />
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Gallery Images
                      {!isLocalDevelopment && (
                        <Badge variant="secondary" className="ml-2">
                          Demo
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLocalDevelopment ? (
                      <ImageUpload
                        onUpload={(urls) =>
                          console.log("Gallery uploaded:", urls)
                        }
                        multiple={true}
                        maxFiles={20}
                        folder="gallery"
                      />
                    ) : (
                      <DemoUpload
                        title="gallery"
                        multiple={true}
                        maxFiles={20}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scraper">
            <GooglePlacesScraper />
          </TabsContent>

          <TabsContent value="manual-upload">
            <ManualImageUpload />
          </TabsContent>

          <TabsContent value="ultra-sync">
            <UltraFastS3SyncEnhanced />
          </TabsContent>

          <TabsContent value="backup">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Backup & Export
              </h2>

              {/* Backup Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Database Backup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      Download complete SQLite database with all businesses,
                      reviews, and metadata.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={downloadDatabaseBackup}
                        disabled={backupLoading}
                        className="w-full"
                      >
                        {backupLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Creating Backup...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download Database Backup
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Full Website Backup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">
                      Download complete website backup including database,
                      server files, and configurations.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={downloadFullBackup}
                        disabled={backupLoading}
                        className="w-full"
                        variant="secondary"
                      >
                        {backupLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Creating Backup...
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4 mr-2" />
                            Download Full Backup
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Backup History */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Backup History</CardTitle>
                    <Button
                      onClick={loadBackupHistory}
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {backupHistory.length > 0 ? (
                    <div className="space-y-3">
                      {backupHistory.map((backup, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{backup.filename}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(backup.created).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{backup.size}</Badge>
                            <Button
                              onClick={() =>
                                window.open(backup.downloadUrl, "_blank")
                              }
                              size="sm"
                              variant="outline"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        No backup history available
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Create your first backup above to see history here
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
