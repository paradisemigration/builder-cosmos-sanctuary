import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Database,
  Play,
  Square,
  Target,
  Clock,
  Activity,
  Settings,
  BarChart3,
  Wifi,
  WifiOff,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

interface SyncStats {
  totalBusinesses: number;
  syncedBusinesses: number;
  pendingBusinesses: number;
  failedBusinesses: number;
  businessesWithLogos: number;
  businessesWithCovers: number;
  businessesWithPhotos: number;
  totalS3Photos: number;
  lastSyncDate: string | null;
}

interface SyncProgress {
  isRunning: boolean;
  currentBatch: number;
  totalBatches: number;
  stats: {
    totalBusinesses: number;
    processed: number;
    successful: number;
    failed: number;
    skipped: number;
    startTime: string;
    errors: any[];
  };
  config: {
    concurrencyLimit: number;
    batchSize: number;
    timeout: number;
  };
}

interface SSEEvent {
  type: string;
  data: any;
  timestamp: string;
}

export function UltraFastS3SyncEnhanced() {
  const [syncStats, setSyncStats] = useState<SyncStats | null>(null);
  const [syncProgress, setSyncProgress] = useState<SyncProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [sseConnected, setSSEConnected] = useState(false);
  const [realtimeEvents, setRealtimeEvents] = useState<SSEEvent[]>([]);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(
    null,
  );

  // Configuration
  const [concurrency, setConcurrency] = useState(25);
  const [batchSize, setBatchSize] = useState(100);
  const [timeout, setTimeout] = useState(5000);

  const eventSourceRef = useRef<EventSource | null>(null);

  // Use relative URLs for same domain deployment
  const getApiUrl = (endpoint: string) => endpoint;

  // Run database migration to add S3 columns
  const runDatabaseMigration = async () => {
    try {
      setLoading(true);
      toast.info("🔧 Running database migration...");

      const response = await fetch(getApiUrl("/api/ultra-fast-sync/migrate"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();

        if (result.success) {
          toast.success(
            "✅ Database migration completed! S3 columns added successfully.",
          );
          // Refresh stats after migration
          await loadSyncStats();
        } else {
          toast.error(result.error || "Migration failed");
        }
      } else {
        toast.success("✅ Database migration completed!");
        await loadSyncStats();
      }
    } catch (error) {
      console.error("Migration error:", error);
      toast.error("Failed to run database migration: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Check if backend API is available
  const checkBackendHealth = async () => {
    try {
      // Check if we have an API URL configured
      const apiUrl =
        localStorage.getItem("VITE_API_URL_OVERRIDE") ||
        import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        console.log("🚫 UltraFastS3SyncEnhanced: No API URL configured");
        setBackendAvailable(false);
        return false;
      }

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("timeout")), 3000);
      });

      const fetchPromise = fetch(getApiUrl("/api/ultra-fast-sync/stats"), {
        method: "HEAD",
        mode: "cors",
      });

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      const available = response && response.ok;
      setBackendAvailable(available);
      return available;
    } catch (error) {
      console.log(
        "🚫 UltraFastS3SyncEnhanced: Backend health check failed:",
        error.message,
      );
      setBackendAvailable(false);
      return false;
    }
  };

  // Load sync statistics
  const loadSyncStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(getApiUrl("/api/ultra-fast-sync/stats"));

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format - expected JSON");
      }

      const result = await response.json();

      if (result.success) {
        setSyncStats(result.stats.database);
        setSyncProgress(result.stats.engine);
      } else {
        toast.error(
          "Failed to load sync stats: " + (result.error || "Unknown error"),
        );
      }
    } catch (error) {
      console.error(
        "UltraFastS3SyncEnhanced: Error loading sync stats:",
        error,
      );

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

  // Setup Server-Sent Events for real-time updates
  const setupSSE = () => {
    try {
      // Close existing connection if any
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const sseUrl = getApiUrl("/api/ultra-fast-sync/progress-stream");
      console.log("🔌 Attempting SSE connection to:", sseUrl);

      const eventSource = new EventSource(sseUrl);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        setSSEConnected(true);
        console.log("📡 SSE Connected for real-time sync progress");
        toast.success("Real-time connection established!");
      };

      eventSource.onerror = (error) => {
        setSSEConnected(false);
        console.log("📡 SSE Connection error:", error);
        console.log("📡 SSE readyState:", eventSource.readyState);

        // Don't spam error messages - only show once
        setTimeout(() => {
          if (!eventSource || eventSource.readyState === EventSource.CLOSED) {
            toast.error("Real-time connection lost", {
              description: "Live updates may not work properly",
            });
          }
        }, 2000);
      };

      // Handle sync events
      eventSource.addEventListener("connected", (e) => {
        const data = JSON.parse(e.data);
        addRealtimeEvent("connected", data);
      });

      eventSource.addEventListener("syncStarted", (e) => {
        const data = JSON.parse(e.data);
        addRealtimeEvent("syncStarted", data);
        toast.success("🚀 Ultra-Fast S3 Sync started!");
      });

      eventSource.addEventListener("progress", (e) => {
        const data = JSON.parse(e.data);
        setSyncProgress(data);
        addRealtimeEvent("progress", data);
      });

      eventSource.addEventListener("syncCompleted", (e) => {
        const data = JSON.parse(e.data);
        addRealtimeEvent("syncCompleted", data);
        toast.success("🎉 Ultra-Fast S3 Sync completed!");
        loadSyncStats(); // Refresh stats
      });

      eventSource.addEventListener("syncError", (e) => {
        const data = JSON.parse(e.data);
        addRealtimeEvent("syncError", data);
        toast.error("❌ Sync error: " + data.error);
      });

      eventSource.addEventListener("syncStopped", (e) => {
        const data = JSON.parse(e.data);
        addRealtimeEvent("syncStopped", data);
        toast.info("⏹️ Sync stopped");
      });
    } catch (error) {
      console.error("SSE Setup Error:", error);
      setSSEConnected(false);
      toast.error("Failed to setup real-time connection");
    }
  };

  // Retry SSE connection
  const retrySSEConnection = () => {
    console.log("🔄 Retrying SSE connection...");
    setupSSE();
  };

  const addRealtimeEvent = (type: string, data: any) => {
    const event: SSEEvent = {
      type,
      data,
      timestamp: new Date().toISOString(),
    };

    setRealtimeEvents((prev) => [event, ...prev.slice(0, 49)]); // Keep last 50 events
  };

  // Start Ultra-Fast Sync
  const startUltraFastSync = async () => {
    try {
      setLoading(true);

      // Try the API first
      const response = await fetch(getApiUrl("/api/ultra-fast-sync/start"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          concurrency,
          batchSize,
          timeout,
        }),
      });

      if (!response.ok) {
        // If API is not available (404), run in simulation mode
        if (response.status === 404) {
          toast.info("Running Ultra-Fast S3 Sync in demo mode...");
          startSimulationMode();
          return;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();

        if (result.success) {
          toast.success("🚀 Ultra-Fast S3 Sync started!");
          setSyncProgress(result.progress);
        } else {
          toast.error(result.error || "Failed to start Ultra-Fast Sync");
        }
      } else {
        // Handle non-JSON response
        toast.success("🚀 Ultra-Fast S3 Sync started!");
      }
    } catch (error) {
      console.error("Ultra-Fast Sync error:", error);

      // If fetch fails completely, try simulation mode
      if (error.message.includes("404") || error.message.includes("fetch")) {
        toast.info("Backend API not available. Running in demo mode...");
        startSimulationMode();
      } else {
        toast.error("Failed to start Ultra-Fast Sync: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Simulation mode for demo purposes when backend is not available
  const startSimulationMode = () => {
    toast.success("🚀 Ultra-Fast S3 Sync started in demo mode!");

    const mockProgress = {
      isRunning: true,
      currentBatch: 1,
      totalBatches: 15,
      stats: {
        totalBusinesses: 1500,
        processed: 0,
        successful: 0,
        failed: 0,
        skipped: 0,
        startTime: new Date().toISOString(),
        errors: [],
      },
      config: { concurrency, batchSize, timeout },
    };

    setSyncProgress(mockProgress);

    // Simulate progress updates
    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        if (!prev || prev.stats.processed >= prev.stats.totalBusinesses) {
          clearInterval(interval);
          toast.success("🎉 Demo sync completed!");
          return null;
        }

        const newProcessed = Math.min(
          prev.stats.processed + Math.floor(Math.random() * 20) + 5,
          prev.stats.totalBusinesses,
        );

        const newSuccessful = Math.floor(newProcessed * 0.9);
        const newFailed = Math.floor(newProcessed * 0.05);
        const newSkipped = newProcessed - newSuccessful - newFailed;

        return {
          ...prev,
          currentBatch:
            Math.floor(
              newProcessed / (prev.stats.totalBusinesses / prev.totalBatches),
            ) + 1,
          stats: {
            ...prev.stats,
            processed: newProcessed,
            successful: newSuccessful,
            failed: newFailed,
            skipped: newSkipped,
          },
        };
      });
    }, 1000);
  };

  // Stop Ultra-Fast Sync
  const stopUltraFastSync = async () => {
    try {
      const response = await fetch(getApiUrl("/api/ultra-fast-sync/stop"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();

        if (result.success) {
          toast.success("⏹️ Ultra-Fast Sync stopped");
          setSyncProgress(null);
        } else {
          toast.error(result.error || "Failed to stop sync");
        }
      } else {
        // Handle non-JSON response
        toast.success("⏹️ Ultra-Fast Sync stopped");
        setSyncProgress(null);
      }
    } catch (error) {
      console.error("Stop sync error:", error);
      toast.error("Failed to stop sync");
    }
  };

  // Format time duration
  const formatDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diff = Math.round((now.getTime() - start.getTime()) / 1000);

    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ${diff % 60}s`;
    return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;
  };

  // Calculate processing rate
  const getProcessingRate = () => {
    if (!syncProgress?.stats.startTime || !syncProgress?.stats.processed)
      return 0;

    const elapsed =
      (new Date().getTime() -
        new Date(syncProgress.stats.startTime).getTime()) /
      1000;
    return Math.round((syncProgress.stats.processed / elapsed) * 60); // per minute
  };

  useEffect(() => {
    // ABSOLUTE SAFETY CHECK - prevent ANY calls on known frontend-only platforms
    const hostname = window.location.hostname;
    if (
      hostname.includes("fly.dev") ||
      hostname.includes("vercel.app") ||
      hostname.includes("netlify.app") ||
      hostname.includes("github.io")
    ) {
      console.log(
        "🚫 UltraFastS3SyncEnhanced: ABSOLUTE SAFETY - Frontend-only platform detected in useEffect",
      );
      setBackendAvailable(false);
      return;
    }

    if (backendAvailable === null) {
      loadSyncStats();
      setupSSE();
    }

    // Auto-retry SSE connection every 10 seconds if not connected
    const retryInterval = setInterval(() => {
      if (
        !sseConnected &&
        (!eventSourceRef.current ||
          eventSourceRef.current.readyState === EventSource.CLOSED)
      ) {
        console.log("🔄 Auto-retrying SSE connection...");
        setupSSE();
      }
    }, 10000);

    return () => {
      clearInterval(retryInterval);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [sseConnected]);

  useEffect(() => {
    if (backendAvailable === true) {
      loadSyncStats();
      setupSSE();
    }
  }, [backendAvailable]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-500" />
            Ultra-Fast S3 Sync Engine
          </h2>
          <div className="text-gray-600 flex items-center">
            Advanced concurrent image sync with real-time monitoring
            {sseConnected ? (
              <div className="flex items-center ml-2">
                <Wifi className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 ml-1">Live</span>
              </div>
            ) : (
              <div className="flex items-center ml-2">
                <WifiOff className="w-4 h-4 text-red-600" />
                <span className="text-xs text-red-600 ml-1">Disconnected</span>
                <button
                  onClick={retrySSEConnection}
                  className="text-xs text-blue-600 hover:text-blue-800 ml-2 underline"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runDatabaseMigration}
            variant="outline"
            size="sm"
            disabled={loading}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            <Database className="h-4 w-4 mr-2" />
            Setup S3 Columns
          </Button>
          <Button
            onClick={loadSyncStats}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {syncStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Database className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Businesses
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {syncStats.totalBusinesses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Synced to S3
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {syncStats.syncedBusinesses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Pending Sync
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {syncStats.pendingBusinesses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Image className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">S3 Photos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {syncStats.totalS3Photos || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="control" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="control">Sync Control</TabsTrigger>
          <TabsTrigger value="monitor">Live Monitor</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="events">Real-time Events</TabsTrigger>
        </TabsList>

        {/* Sync Control Tab */}
        <TabsContent value="control" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Ultra-Fast Sync Control
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Config */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Concurrency
                  </label>
                  <input
                    type="number"
                    value={concurrency}
                    onChange={(e) => setConcurrency(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    min="1"
                    max="50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Batch Size
                  </label>
                  <input
                    type="number"
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    min="10"
                    max="500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Timeout (ms)
                  </label>
                  <input
                    type="number"
                    value={timeout}
                    onChange={(e) => setTimeout(Number(e.target.value))}
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    min="1000"
                    max="30000"
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={startUltraFastSync}
                  disabled={loading || syncProgress?.isRunning}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  {loading || syncProgress?.isRunning ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      {syncProgress?.isRunning ? "Syncing..." : "Starting..."}
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Start Ultra-Fast Sync
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Monitor Tab */}
        <TabsContent value="monitor">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Live Progress Monitor
              </CardTitle>
            </CardHeader>
            <CardContent>
              {syncProgress?.isRunning ? (
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>
                        Batch {syncProgress.currentBatch} /{" "}
                        {syncProgress.totalBatches}
                      </span>
                      <span>
                        {Math.round(
                          (syncProgress.currentBatch /
                            syncProgress.totalBatches) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-300"
                        style={{
                          width: `${Math.round((syncProgress.currentBatch / syncProgress.totalBatches) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Live Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-lg font-bold text-blue-700">
                        {syncProgress.stats.processed}
                      </div>
                      <div className="text-xs text-blue-600">Processed</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-700">
                        {syncProgress.stats.successful}
                      </div>
                      <div className="text-xs text-green-600">Successful</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-lg font-bold text-red-700">
                        {syncProgress.stats.failed}
                      </div>
                      <div className="text-xs text-red-600">Failed</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-lg font-bold text-yellow-700">
                        {getProcessingRate()}
                      </div>
                      <div className="text-xs text-yellow-600">Per Min</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded">
                      <div className="text-xs font-bold text-purple-700">
                        {formatDuration(syncProgress.stats.startTime)}
                      </div>
                      <div className="text-xs text-purple-600">Duration</div>
                    </div>
                  </div>

                  {/* Configuration Display */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Current Configuration</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Concurrency:</span>
                        <span className="ml-2 font-medium">
                          {syncProgress.config.concurrencyLimit}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Batch Size:</span>
                        <span className="ml-2 font-medium">
                          {syncProgress.config.batchSize}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Timeout:</span>
                        <span className="ml-2 font-medium">
                          {syncProgress.config.timeout}ms
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>
                    No sync process running. Start Ultra-Fast Sync to see live
                    monitoring.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Performance Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Concurrency Settings</h4>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Concurrent Uploads
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={concurrency}
                      onChange={(e) => setConcurrency(Number(e.target.value))}
                      className="w-full mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span className="font-medium">{concurrency}</span>
                      <span>50</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Batch Size
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      value={batchSize}
                      onChange={(e) => setBatchSize(Number(e.target.value))}
                      className="w-full mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>10</span>
                      <span className="font-medium">{batchSize}</span>
                      <span>500</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Timeout Settings</h4>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Request Timeout
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="30000"
                      step="1000"
                      value={timeout}
                      onChange={(e) => setTimeout(Number(e.target.value))}
                      className="w-full mt-2"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1s</span>
                      <span className="font-medium">{timeout / 1000}s</span>
                      <span>30s</span>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="text-sm font-medium text-blue-800 mb-2">
                      Performance Impact
                    </h5>
                    <p className="text-xs text-blue-700">
                      Higher concurrency = faster processing but more API load.
                      Larger batches = fewer database operations but more memory
                      usage. Longer timeouts = better success rate but slower
                      processing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Preset Configurations</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setConcurrency(10);
                      setBatchSize(50);
                      setTimeout(3000);
                    }}
                    className="p-4 h-auto flex-col items-start"
                  >
                    <div className="font-medium">Conservative</div>
                    <div className="text-xs text-gray-500">
                      Stable & reliable
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setConcurrency(25);
                      setBatchSize(100);
                      setTimeout(5000);
                    }}
                    className="p-4 h-auto flex-col items-start"
                  >
                    <div className="font-medium">Balanced</div>
                    <div className="text-xs text-gray-500">Recommended</div>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setConcurrency(40);
                      setBatchSize(200);
                      setTimeout(7000);
                    }}
                    className="p-4 h-auto flex-col items-start"
                  >
                    <div className="font-medium">Aggressive</div>
                    <div className="text-xs text-gray-500">Maximum speed</div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Real-time Events Tab */}
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Real-time Event Stream
                {sseConnected && (
                  <Badge variant="default" className="ml-2">
                    Live
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {realtimeEvents.length === 0 ? (
                  <div className="text-center p-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-2" />
                    <p>
                      No real-time events yet. Events will appear here when sync
                      activities occur.
                    </p>
                  </div>
                ) : (
                  realtimeEvents.map((event, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge
                          variant={
                            event.type === "syncCompleted"
                              ? "default"
                              : event.type === "syncError"
                                ? "destructive"
                                : event.type === "progress"
                                  ? "secondary"
                                  : "outline"
                          }
                        >
                          {event.type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{event.data.message}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default UltraFastS3SyncEnhanced;
