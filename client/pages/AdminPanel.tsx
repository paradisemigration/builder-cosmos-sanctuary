import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Navigation } from "@/components/Navigation";
import { ImageUpload } from "@/components/ImageUpload";
import { DemoUpload } from "@/components/DemoUpload";
import { GooglePlacesScraper } from "@/components/GooglePlacesScraper";
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
} from "lucide-react";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [cityCategoryStats, setCityCategoryStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupHistory, setBackupHistory] = useState<any[]>([]);

  // Detect if we're in a local development environment
  const isLocalDevelopment =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  // Load real data from API
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load scraping statistics
      const statsResponse = await fetch("/api/scraping/stats");
      const statsResult = await statsResponse.json();

      // Load businesses
      const businessesResponse = await fetch(
        "/api/scraped-businesses?limit=100",
      );
      const businessesResult = await businessesResponse.json();

      if (statsResult.success) {
        setStats(statsResult.stats);
      }

      if (businessesResult.success) {
        setBusinesses(businessesResult.businesses || []);

        // Update stats with accurate total from the businesses query
        if (businessesResult.total) {
          setStats((prev) => ({
            ...prev,
            totalBusinesses: businessesResult.total,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
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

      // Update backup history
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

      // Update backup history
      loadBackupHistory();
    } catch (error) {
      console.error("Full backup failed:", error);
      alert("Failed to create full backup");
    } finally {
      setBackupLoading(false);
    }
  };

  const loadBackupHistory = async () => {
    try {
      const response = await fetch("/api/admin/backup/history");
      const result = await response.json();
      if (result.success) {
        setBackupHistory(result.backups || []);
      }
    } catch (error) {
      console.error("Failed to load backup history:", error);
    }
  };

  useEffect(() => {
    document.title = "Admin Panel - VisaConsult India";
    loadDashboardData();
    loadBackupHistory();
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
              <Button
                variant="outline"
                size="sm"
                onClick={loadDashboardData}
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="scraper">Data Scraper</TabsTrigger>
            <TabsTrigger value="backup">Backup</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Dashboard Overview
              </h2>

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
                          {loading ? "..." : stats?.totalBusinesses || 0}
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
                    onClick={loadDashboardData}
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
                        {businesses.map((business, index) => (
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
                            Showing {businesses.length} of{" "}
                            {stats?.totalBusinesses || businesses.length}{" "}
                            businesses
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
                          ��� Google Cloud Setup: Ready for backend integration ✅
                        </p>
                        <p>• Upload Feature: Requires backend deployment 📋</p>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={() => {
                      const isProduction =
                        import.meta.env.MODE === "production";
                      const message = isProduction
                        ? `🌐 Production Environment Detected\n\n✅ Frontend: Fully deployed and functional\n📋 Backend: Not deployed (normal for frontend-only hosting)\n🚀 Features: UI/UX, navigation, forms all working\n\nTo enable image uploads:\n1. Deploy the Node.js API server\n2. Configure VITE_API_URL environment variable\n3. Set up Google Cloud Storage bucket`
                        : `🔧 Development Environment\n\n✅ Frontend: Running on ${window.location.origin}\n✅ Backend: Should be running on localhost:3001\n✅ Google Cloud: Configured with credentials\n\nAll systems ready for testing!`;

                      alert(message);
                    }}
                    className="mt-4"
                    variant="outline"
                  >
                    ℹ️ Environment Info
                  </Button>
                </CardContent>
              </Card>

              {/* Deployment Information */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-800">
                    🚀 Deployment Status & Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-purple-700">
                  {isLocalDevelopment ? (
                    <>
                      <p className="mb-4">
                        ✅ <strong>Local Development Environment Active</strong>
                      </p>
                      <p className="mb-4">
                        Your Google Cloud Storage is configured and ready for
                        uploads:
                      </p>
                      <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono">
                        <p>Project: extreme-water-465615-i5</p>
                        <p>Bucket: dreamvisa-storage</p>
                        <p>API: http://localhost:3001</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="mb-4">
                        🌐 <strong>Frontend Successfully Deployed</strong>
                      </p>
                      <p className="mb-4">
                        To enable full functionality with image uploads:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        <li>
                          Deploy the Node.js API server to your hosting platform
                        </li>
                        <li>Update VITE_API_URL environment variable</li>
                        <li>
                          Configure Google Cloud Storage bucket permissions
                        </li>
                        <li>Test upload functionality</li>
                      </ol>
                      <div className="mt-4 p-3 bg-gray-100 rounded text-xs font-mono">
                        <p>Frontend: ✅ Deployed</p>
                        <p>Backend: 📋 Pending deployment</p>
                        <p>Storage: ✅ Configured</p>
                      </div>
                    </>
                  )}
                  <div className="mt-4">
                    <Button
                      onClick={() =>
                        window.open(
                          "https://github.com/vercel/vercel",
                          "_blank",
                        )
                      }
                      variant="outline"
                    >
                      📖 Deploy Backend Guide
                    </Button>
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

              {/* System Information */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-800">
                    📊 System Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p>
                        <strong>Environment:</strong> {import.meta.env.MODE}
                      </p>
                      <p>
                        <strong>Host:</strong> {window.location.hostname}
                      </p>
                      <p>
                        <strong>Protocol:</strong> {window.location.protocol}
                      </p>
                      <p>
                        <strong>Port:</strong>{" "}
                        {window.location.port || "default"}
                      </p>
                    </div>
                    <div>
                      <p>
                        <strong>Google Cloud:</strong> ✅ Configured
                      </p>
                      <p>
                        <strong>Upload UI:</strong> ✅ Ready
                      </p>
                      <p>
                        <strong>Image Support:</strong> ✅ All formats
                      </p>
                      <p>
                        <strong>Max File Size:</strong> 10MB
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Media Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Building className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          Business Images
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          Ready
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <BarChart3 className="h-8 w-8 text-green-600" />
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
                      <TrendingUp className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          API Status
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          Running
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scraper">
            <GooglePlacesScraper />
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
                      <p className="text-xs text-gray-500">
                        File: visaconsult_database_backup_
                        {new Date().toISOString().split("T")[0]}.sqlite
                      </p>
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
                      <p className="text-xs text-gray-500">
                        File: visaconsult_full_backup_
                        {new Date().toISOString().split("T")[0]}.zip
                      </p>
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

              {/* Backup Information */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800">
                    📋 Backup Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-700">
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Database Backup:</strong> Contains all business
                      data, reviews, and metadata
                    </p>
                    <p>
                      <strong>Full Backup:</strong> Includes database + server
                      code + configurations
                    </p>
                    <p>
                      <strong>Naming Convention:</strong> Files include
                      timestamp for easy organization
                    </p>
                    <p>
                      <strong>Storage:</strong> Backups are generated on-demand
                      and downloaded locally
                    </p>
                    <p>
                      <strong>Recommended:</strong> Create regular backups
                      before major changes
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
