import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Database, Play, Square, Star } from "lucide-react";

export default function AdminStatus() {
  const [stats, setStats] = useState<any>(null);
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scrapingLoading, setScrapingLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [loadingRef, setLoadingRef] = useState(false);

  const loadStatus = async () => {
    // Prevent concurrent requests
    if (loadingRef || loading) {
      console.log("Status loading already in progress, skipping...");
      return;
    }

    try {
      setLoading(true);
      setLoadingRef(true);

      // Test server connectivity first
      let serverAvailable = false;
      try {
        const healthController = new AbortController();
        const healthTimeout = setTimeout(() => healthController.abort(), 5000);

        const healthResponse = await fetch("/api/health", {
          signal: healthController.signal,
        });
        clearTimeout(healthTimeout);

        serverAvailable = healthResponse.ok;
      } catch (healthError) {
        console.warn("Server health check failed:", healthError.message);
        serverAvailable = false;
      }

      if (!serverAvailable) {
        throw new Error(
          "API server is not responding. Please check if the backend server is running.",
        );
      }

      // Load scraping stats with timeout
      const statsController = new AbortController();
      const statsTimeout = setTimeout(() => statsController.abort(), 10000);

      const statsResponse = await fetch("/api/scraping/stats", {
        signal: statsController.signal,
      });
      clearTimeout(statsTimeout);

      if (!statsResponse.ok) {
        throw new Error(`Stats API error: ${statsResponse.status}`);
      }
      const statsResult = await statsResponse.json();

      // Load diagnostic info with timeout (optional, fallback if 404)
      try {
        const diagnosticController = new AbortController();
        const diagnosticTimeout = setTimeout(
          () => diagnosticController.abort(),
          10000,
        );

        const diagnosticResponse = await fetch("/api/database/diagnostic", {
          signal: diagnosticController.signal,
        });
        clearTimeout(diagnosticTimeout);

        if (diagnosticResponse.ok) {
          const diagnosticResult = await diagnosticResponse.json();
          if (diagnosticResult.success) {
            setDiagnostic(diagnosticResult.diagnostic);
          }
        } else if (diagnosticResponse.status === 404) {
          console.warn(
            "Diagnostic endpoint not available (404), using fallback",
          );
          setDiagnostic({
            actualBusinessCount: statsResult.stats?.totalBusinesses || 0,
            totalFromQuery: statsResult.stats?.totalBusinesses || 0,
            note: "Diagnostic endpoint not available",
          });
        } else {
          console.error(`Diagnostic API error: ${diagnosticResponse.status}`);
          setDiagnostic(null);
        }
      } catch (diagError) {
        console.warn(
          "Diagnostic endpoint failed, continuing without it:",
          diagError.message,
        );
        setDiagnostic({
          actualBusinessCount: statsResult.stats?.totalBusinesses || 0,
          totalFromQuery: statsResult.stats?.totalBusinesses || 0,
          note: "Diagnostic data unavailable",
        });
      }

      if (statsResult.success) {
        setStats(statsResult.stats);
      }
    } catch (error) {
      console.error("Failed to load status:", error);

      // Determine error type for better user messaging
      let errorMessage = error.message;
      let errorType = "unknown";

      if (error.message.includes("Failed to fetch")) {
        errorType = "network";
        errorMessage =
          "Cannot connect to API server. The backend may be offline.";
      } else if (error.message.includes("aborted")) {
        errorType = "timeout";
        errorMessage = "Request timed out. Server may be slow or overloaded.";
      } else if (error.message.includes("not responding")) {
        errorType = "server_down";
        errorMessage = error.message;
      }

      // Set default empty state to prevent UI errors
      setStats({
        totalBusinesses: 0,
        totalImages: 0,
        totalReviews: 0,
        averageRating: 0,
        scraping: { isRunning: false },
        error: errorMessage,
        errorType,
      });
      setDiagnostic({
        actualBusinessCount: 0,
        totalFromQuery: 0,
        error: errorMessage,
        errorType,
      });
    } finally {
      setLoading(false);
      setLoadingRef(false);
    }
  };

  const defaultScrapingConfig = {
    cities: [
      "Delhi",
      "Mumbai",
      "Bangalore",
      "Chennai",
      "Hyderabad",
      "Pune",
      "Kolkata",
    ],
    categories: [
      "visa consultant",
      "immigration lawyer",
      "immigration consultant",
    ],
    maxResultsPerSearch: 20,
    delay: 1000,
  };

  const startScraping = async () => {
    try {
      setScrapingLoading(true);

      const response = await fetch("/api/scraping/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(defaultScrapingConfig),
      });

      const result = await response.json();
      console.log("Scraping started:", result);

      // Reload status after starting
      setTimeout(loadStatus, 2000);
    } catch (error) {
      console.error("Failed to start scraping:", error);
    } finally {
      setScrapingLoading(false);
    }
  };

  const stopScraping = async () => {
    try {
      setScrapingLoading(true);

      const response = await fetch("/api/scraping/stop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("Scraping stopped:", result);

      // Reload status after stopping
      setTimeout(loadStatus, 1000);
    } catch (error) {
      console.error("Failed to stop scraping:", error);
    } finally {
      setScrapingLoading(false);
    }
  };

  const fetchAllReviews = async () => {
    try {
      setReviewsLoading(true);

      const response = await fetch("/api/scraping/fetch-all-reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      console.log("Review fetching started:", result);

      alert(
        result.message + "\n\nCheck the console logs for progress updates.",
      );

      // Reload status after starting
      setTimeout(loadStatus, 2000);
    } catch (error) {
      console.error("Failed to start review fetching:", error);
      alert("Failed to start review fetching: " + error.message);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Force refresh function that bypasses loading checks
  const forceRefresh = async () => {
    console.log("Force refresh triggered");

    // Reset all loading states
    setLoading(false);
    setLoadingRef(false);

    // Clear existing data
    setStats(null);
    setDiagnostic(null);

    // Force reload
    await loadStatus();
  };

  useEffect(() => {
    // Initial load with small delay to prevent race conditions
    const timeoutId = setTimeout(() => {
      loadStatus();
    }, 100);

    // Auto-refresh every 15 seconds (increased from 10 to reduce load)
    const interval = setInterval(() => {
      // Only auto-refresh if not currently loading
      if (!loadingRef && !loading) {
        loadStatus();
      }
    }, 15000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, []); // Remove dependencies to prevent infinite loop

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Status Dashboard
              </h1>

              {/* Server Status Indicator */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    stats?.error
                      ? "bg-red-500"
                      : stats
                        ? "bg-green-500"
                        : "bg-yellow-500"
                  }`}
                ></div>
                <span
                  className={`text-sm font-medium ${
                    stats?.error
                      ? "text-red-700"
                      : stats
                        ? "text-green-700"
                        : "text-yellow-700"
                  }`}
                >
                  {stats?.error
                    ? "Server Offline"
                    : stats
                      ? "Server Online"
                      : "Connecting..."}
                </span>
              </div>
            </div>

            {/* Error Alert */}
            {stats?.error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="text-red-500 text-xl">⚠️</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-900 mb-1">
                      API Server Connection Failed
                    </h3>
                    <p className="text-red-700 text-sm mb-2">{stats.error}</p>
                    <div className="text-red-600 text-xs">
                      <strong>Possible solutions:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Check if the backend server is running</li>
                        <li>Verify API endpoints are accessible</li>
                        <li>Check network connectivity</li>
                        <li>Try refreshing the page</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button
                onClick={forceRefresh}
                disabled={loading || loadingRef}
                variant="outline"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading || loadingRef ? "animate-spin" : ""}`}
                />
                {loading || loadingRef ? "Refreshing..." : "Refresh Status"}
              </Button>

              {stats?.scraping?.isRunning ? (
                <Button
                  onClick={stopScraping}
                  disabled={scrapingLoading || stats?.error}
                  variant="destructive"
                  title={
                    stats?.error ? "Cannot stop scraping: Server offline" : ""
                  }
                >
                  {scrapingLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Stopping...
                    </>
                  ) : (
                    <>
                      <Square className="h-4 w-4 mr-2" />
                      Stop Scraping
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={startScraping}
                  disabled={scrapingLoading || stats?.error}
                  variant="default"
                  title={
                    stats?.error
                      ? "Cannot start scraping: Server offline"
                      : `Will scrape: ${defaultScrapingConfig.cities.length} cities, ${defaultScrapingConfig.categories.length} categories`
                  }
                >
                  {scrapingLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Scraping
                    </>
                  )}
                </Button>
              )}

              <Button
                onClick={fetchAllReviews}
                disabled={
                  reviewsLoading || stats?.scraping?.isRunning || stats?.error
                }
                variant="outline"
                title={
                  stats?.error ? "Cannot fetch reviews: Server offline" : ""
                }
              >
                {reviewsLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Fetching Reviews...
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Fetch All Reviews
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Database Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">
                          {stats.totalBusinesses || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Businesses
                        </div>
                      </div>

                      <div className="text-center p-4 bg-green-50 rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {stats.totalImages || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Images
                        </div>
                      </div>

                      <div className="text-center p-4 bg-purple-50 rounded">
                        <div className="text-2xl font-bold text-purple-600">
                          {stats.totalReviews || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Reviews
                        </div>
                      </div>

                      <div className="text-center p-4 bg-orange-50 rounded">
                        <div className="text-2xl font-bold text-orange-600">
                          {stats.averageRating?.toFixed(1) || 0}
                        </div>
                        <div className="text-sm text-gray-600">Avg Rating</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm text-gray-600">
                        Last Updated:{" "}
                        {stats.lastUpdated
                          ? new Date(stats.lastUpdated).toLocaleString()
                          : "Never"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">Loading...</div>
                )}
              </CardContent>
            </Card>

            {/* Scraping Status */}
            <Card>
              <CardHeader>
                <CardTitle>Scraping Status</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.scraping ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          stats.scraping.isRunning ? "default" : "secondary"
                        }
                      >
                        {stats.scraping.isRunning ? "Running" : "Stopped"}
                      </Badge>
                    </div>

                    {stats.scraping.currentJob && (
                      <div className="text-sm space-y-2">
                        <div>Job ID: {stats.scraping.currentJob}</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>No scraping data</div>
                )}
              </CardContent>
            </Card>

            {/* Scraping Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Default Scraping Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-semibold text-sm text-gray-700 mb-2">
                      Cities ({defaultScrapingConfig.cities.length}):
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {defaultScrapingConfig.cities.map((city, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {city}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-sm text-gray-700 mb-2">
                      Categories ({defaultScrapingConfig.categories.length}):
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {defaultScrapingConfig.categories.map(
                        (category, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {category}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-gray-700">
                        Max Results:
                      </span>{" "}
                      {defaultScrapingConfig.maxResultsPerSearch}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">
                        Delay:
                      </span>{" "}
                      {defaultScrapingConfig.delay}ms
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    Total searches: {defaultScrapingConfig.cities.length} ×{" "}
                    {defaultScrapingConfig.categories.length} ={" "}
                    {defaultScrapingConfig.cities.length *
                      defaultScrapingConfig.categories.length}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Diagnostic Info */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Database Diagnostic</CardTitle>
              </CardHeader>
              <CardContent>
                {diagnostic ? (
                  <div className="space-y-4">
                    {diagnostic.error && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <div className="text-yellow-800 text-sm">
                          ⚠️ {diagnostic.error}
                        </div>
                      </div>
                    )}

                    {diagnostic.note && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3">
                        <div className="text-blue-800 text-sm">
                          ℹ️ {diagnostic.note}
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <div className="font-semibold">SQLite Stats Count:</div>
                        <div>
                          {diagnostic.sqliteStats?.totalBusinesses || 0}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold">Actual Query Count:</div>
                        <div>{diagnostic.actualBusinessCount || 0}</div>
                      </div>
                      <div>
                        <div className="font-semibold">Query Total:</div>
                        <div>{diagnostic.totalFromQuery || 0}</div>
                      </div>
                    </div>

                    {diagnostic.firstBusiness && (
                      <div>
                        <div className="font-semibold">Sample Business:</div>
                        <div className="text-sm">
                          {diagnostic.firstBusiness.name} -{" "}
                          {diagnostic.firstBusiness.city}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500">
                      Diagnostic data unavailable
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
