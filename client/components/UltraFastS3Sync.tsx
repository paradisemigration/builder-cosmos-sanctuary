import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Zap,
  Upload,
  Image,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Camera,
  FileImage,
  Building,
  Globe,
  Search,
  Link,
  Rocket,
  Database,
  Download,
  Play,
  Square,
  Target,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

interface SyncProgress {
  isRunning: boolean;
  totalBusinesses: number;
  processed: number;
  successful: number;
  failed: number;
  skipped: number;
  strategy: string;
  currentBusiness: string;
  estimatedTimeRemaining: number;
}

interface SyncStats {
  businessesWithoutLogos: number;
  businessesWithoutCovers: number;
  businessesWithoutGalleries: number;
  totalMissingImages: number;
  lastSyncTime: string | null;
}

export function UltraFastS3Sync() {
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("smart-multi");
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(
    null,
  );

  // Configure API base URL
  const getApiUrl = (endpoint: string) => {
    const override = localStorage.getItem("VITE_API_URL_OVERRIDE");
    if (override) {
      return `${override}${endpoint}`;
    }
    const baseUrl = import.meta.env.VITE_API_URL || "";
    return baseUrl ? `${baseUrl}${endpoint}` : endpoint;
  };

  // Early detection of frontend-only deployment
  const isKnownFrontendOnly = () => {
    const hostname = window.location.hostname;
    const isFrontendOnlyDeployment =
      hostname.includes("fly.dev") ||
      hostname.includes("vercel.app") ||
      hostname.includes("netlify.app") ||
      hostname.includes("github.io");

    const apiUrl = import.meta.env.VITE_API_URL;
    const hasApiOverride = localStorage.getItem("VITE_API_URL_OVERRIDE");

    return isFrontendOnlyDeployment && !apiUrl && !hasApiOverride;
  };

  // Check if backend API is available
  const checkBackendHealth = async () => {
    try {
      // Early detection - don't make any fetch calls on frontend-only deployments
      if (isKnownFrontendOnly()) {
        console.log(
          "🚫 UltraFastS3Sync: Frontend-only deployment detected - backend unavailable",
        );
        setBackendAvailable(false);
        return false;
      }

      // Additional check - if we're on fly.dev without API URL, don't fetch
      const hostname = window.location.hostname;
      if (hostname.includes("fly.dev")) {
        const apiUrl = import.meta.env.VITE_API_URL;
        const hasApiOverride = localStorage.getItem("VITE_API_URL_OVERRIDE");

        if (!apiUrl && !hasApiOverride) {
          console.log(
            "🚫 UltraFastS3Sync: Fly.dev deployment without API URL - skipping fetch",
          );
          setBackendAvailable(false);
          return false;
        }
      }

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("timeout")), 3000);
      });

      const fetchPromise = fetch(getApiUrl("/api/scraping/stats"), {
        method: "HEAD",
        mode: "cors",
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      const available = response && response.ok;
      setBackendAvailable(available);
      return available;
    } catch (error) {
      console.log(
        "🚫 UltraFastS3Sync: Backend health check failed:",
        error.message,
      );
      setBackendAvailable(false);
      return false;
    }
  };

  // Load sync statistics
  const loadSyncStats = async () => {
    // Early check - don't even try if we know it's frontend-only
    if (isKnownFrontendOnly()) {
      console.log(
        "🚫 UltraFastS3Sync: Frontend-only deployment - skipping stats load",
      );
      setBackendAvailable(false);
      setLoading(false);
      return;
    }

    // Check backend availability first without making extra calls
    if (backendAvailable === false) {
      console.log(
        "🚫 UltraFastS3Sync: Backend already known to be unavailable - skipping stats load",
      );
      setLoading(false);
      return;
    }

    const isBackendAvailable = await checkBackendHealth();
    if (!isBackendAvailable) {
      console.log(
        "🚫 UltraFastS3Sync: Backend unavailable - skipping stats load",
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        getApiUrl("/api/admin/ultra-fast-sync-stats"),
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setSyncStats(result.stats);
      } else {
        toast.error(
          "Failed to load sync stats: " + (result.error || "Unknown error"),
        );
      }
    } catch (error) {
      console.error("Error loading sync stats:", error);
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error("Cannot connect to backend API");
        setBackendAvailable(false);
      } else {
        toast.error("Error loading sync stats: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load sync progress
  const loadSyncProgress = async () => {
    // Don't make calls if backend is unavailable or frontend-only
    if (backendAvailable === false || isKnownFrontendOnly()) {
      return;
    }

    try {
      const response = await fetch(
        getApiUrl("/api/admin/ultra-fast-sync-progress"),
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setSyncProgress(result.progress);
      }
    } catch (error) {
      console.error("UltraFastS3Sync: Failed to load sync progress:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        console.log(
          "🚫 UltraFastS3Sync: Sync progress fetch failed - backend unavailable",
        );
        setBackendAvailable(false);
      }
    }
  };

  // Start ultra-fast sync
  const startUltraFastSync = async () => {
    if (backendAvailable === false || isKnownFrontendOnly()) {
      toast.error("Backend API connection required for Ultra-Fast Sync");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        getApiUrl("/api/admin/start-ultra-fast-sync"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            strategy: selectedStrategy,
            maxConcurrent: 20, // Ultra-fast parallel processing
            smartRetry: true,
            imageOptimization: true,
          }),
        },
      );

      const result = await response.json();

      if (result.success) {
        toast.success(
          `🚀 Ultra-Fast S3 Sync started! Strategy: ${result.config.strategy}. Estimated: ${result.config.estimatedDuration}.`,
        );
        setSyncProgress(result.initialProgress);
        // Start real-time monitoring
        startProgressMonitoring();
      } else {
        toast.error(result.error || "Failed to start Ultra-Fast Sync");
      }
    } catch (error) {
      console.error("Ultra-Fast Sync error:", error);
      toast.error("Failed to start Ultra-Fast Sync");
    } finally {
      setLoading(false);
    }
  };

  // Stop ultra-fast sync
  const stopUltraFastSync = async () => {
    if (backendAvailable === false || isKnownFrontendOnly()) {
      toast.error("Backend API connection required");
      return;
    }

    try {
      const response = await fetch(
        getApiUrl("/api/admin/stop-ultra-fast-sync"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Ultra-Fast Sync stopped successfully");
        setSyncProgress(null);
      } else {
        toast.error(result.error || "Failed to stop sync");
      }
    } catch (error) {
      console.error("UltraFastS3Sync: Stop sync error:", error);

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast.error("Cannot connect to backend API");
        setBackendAvailable(false);
      } else {
        toast.error("Failed to stop sync: " + error.message);
      }
    }
  };

  // Start real-time progress monitoring
  const startProgressMonitoring = () => {
    const interval = setInterval(() => {
      loadSyncProgress().then(() => {
        // Stop monitoring if sync is complete
        if (syncProgress && !syncProgress.isRunning) {
          clearInterval(interval);
          loadSyncStats(); // Refresh stats after completion
        }
      });
    }, 2000); // Update every 2 seconds

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  };

  useEffect(() => {
    // Early check - if we know it's frontend-only, set backend as unavailable immediately
    if (isKnownFrontendOnly()) {
      console.log(
        "🚫 UltraFastS3Sync: Early detection - Frontend-only deployment without API URL",
      );
      setBackendAvailable(false);
      return;
    }

    // Only load stats if we haven't determined backend availability yet
    if (backendAvailable === null) {
      loadSyncStats();
    }
  }, []);

  // Load stats when backend becomes available
  useEffect(() => {
    if (backendAvailable === true && !syncStats) {
      loadSyncStats();
    }
  }, [backendAvailable]);

  // Auto-refresh progress when sync is running
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (syncProgress?.isRunning && backendAvailable) {
      cleanup = startProgressMonitoring();
    }

    return cleanup;
  }, [syncProgress?.isRunning, backendAvailable]);

  const syncStrategies = [
    {
      id: "smart-multi",
      name: "🧠 Smart Multi-Strategy",
      description: "AI-powered image discovery using multiple sources",
      speed: "Ultra-Fast",
      accuracy: "95%+",
    },
    {
      id: "google-enhanced",
      name: "🔍 Google Enhanced Search",
      description: "Advanced Google Places + Custom Image Search",
      speed: "Very Fast",
      accuracy: "90%+",
    },
    {
      id: "business-website",
      name: "🌐 Business Website Scraper",
      description: "Extract images directly from business websites",
      speed: "Fast",
      accuracy: "85%+",
    },
    {
      id: "social-media",
      name: "📱 Social Media Discovery",
      description: "Find images from social media profiles",
      speed: "Fast",
      accuracy: "80%+",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-500" />
            Ultra-Fast S3 Smart URL Sync
          </h2>
          <p className="text-gray-600">
            Intelligent image discovery and upload for business listings
          </p>
        </div>
        <Button
          onClick={loadSyncStats}
          variant="outline"
          size="sm"
          disabled={backendAvailable === false}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Backend Status Alert */}
      {backendAvailable === false && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800">
                Backend API Not Available
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Ultra-Fast S3 Sync requires a backend API connection. This
                feature is not available in frontend-only deployments.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      {syncStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Image className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Missing Logos
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {syncStats.businessesWithoutLogos}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Camera className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Missing Covers
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {syncStats.businessesWithoutCovers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileImage className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Missing Galleries
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {syncStats.businessesWithoutGalleries}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Missing
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {syncStats.totalMissingImages}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="sync" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sync">Ultra-Fast Sync</TabsTrigger>
          <TabsTrigger value="strategies">Sync Strategies</TabsTrigger>
          <TabsTrigger value="monitor">Progress Monitor</TabsTrigger>
        </TabsList>

        {/* Ultra-Fast Sync Tab */}
        <TabsContent value="sync" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Rocket className="w-5 h-5 mr-2" />
                Launch Ultra-Fast Sync
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {backendAvailable === false ? (
                <div className="text-center p-8 text-gray-500">
                  <AlertCircle className="w-12 h-12 mx-auto mb-2 text-blue-600" />
                  <p>Backend API connection required for Ultra-Fast Sync</p>
                </div>
              ) : (
                <>
                  {/* Strategy Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Select Sync Strategy:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {syncStrategies.map((strategy) => (
                        <div
                          key={strategy.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            selectedStrategy === strategy.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedStrategy(strategy.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">
                              {strategy.name}
                            </h4>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="text-xs">
                                {strategy.speed}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {strategy.accuracy}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600">
                            {strategy.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Launch Button */}
                  <div className="flex gap-3">
                    <Button
                      onClick={startUltraFastSync}
                      disabled={
                        loading ||
                        syncProgress?.isRunning ||
                        backendAvailable === false
                      }
                      size="lg"
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    >
                      {loading || syncProgress?.isRunning ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          {syncProgress?.isRunning
                            ? "Syncing..."
                            : "Starting..."}
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5 mr-2" />
                          Launch Ultra-Fast Sync
                        </>
                      )}
                    </Button>

                    {syncProgress?.isRunning && (
                      <Button
                        onClick={stopUltraFastSync}
                        variant="destructive"
                        size="lg"
                      >
                        <Square className="w-5 h-5 mr-2" />
                        Stop
                      </Button>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategies Tab */}
        <TabsContent value="strategies">
          <Card>
            <CardHeader>
              <CardTitle>Available Sync Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncStrategies.map((strategy) => (
                  <div key={strategy.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{strategy.name}</h3>
                      <div className="flex gap-2">
                        <Badge variant="outline">{strategy.speed}</Badge>
                        <Badge variant="secondary">{strategy.accuracy}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {strategy.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Monitor Tab */}
        <TabsContent value="monitor">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Real-Time Progress Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              {syncProgress ? (
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>
                        {syncProgress.processed} /{" "}
                        {syncProgress.totalBusinesses} businesses
                      </span>
                      <span>
                        {Math.round(
                          (syncProgress.processed /
                            syncProgress.totalBusinesses) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          syncProgress.isRunning
                            ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                            : "bg-green-600"
                        }`}
                        style={{
                          width: `${Math.round((syncProgress.processed / syncProgress.totalBusinesses) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-700">
                        {syncProgress.successful}
                      </div>
                      <div className="text-xs text-green-600">Successful</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-lg font-bold text-red-700">
                        {syncProgress.failed}
                      </div>
                      <div className="text-xs text-red-600">Failed</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-lg font-bold text-yellow-700">
                        {syncProgress.skipped}
                      </div>
                      <div className="text-xs text-yellow-600">Skipped</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-xs font-bold text-blue-700">
                        {syncProgress.strategy}
                      </div>
                      <div className="text-xs text-blue-600">Strategy</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="text-xs font-bold text-purple-700">
                        {Math.round(syncProgress.estimatedTimeRemaining / 60)}m
                      </div>
                      <div className="text-xs text-purple-600">ETA</div>
                    </div>
                  </div>

                  {/* Current Business */}
                  {syncProgress.isRunning && (
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-xs text-gray-600 mb-1">
                        Currently Processing:
                      </div>
                      <div className="font-medium text-sm">
                        {syncProgress.currentBusiness}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-2" />
                  <p>
                    No sync process running. Start Ultra-Fast Sync to see
                    progress.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UltraFastS3Sync;
