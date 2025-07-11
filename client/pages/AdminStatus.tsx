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

      // Load diagnostic info with timeout
      const diagnosticController = new AbortController();
      const diagnosticTimeout = setTimeout(
        () => diagnosticController.abort(),
        10000,
      );

      const diagnosticResponse = await fetch("/api/database/diagnostic", {
        signal: diagnosticController.signal,
      });
      clearTimeout(diagnosticTimeout);

      if (!diagnosticResponse.ok) {
        throw new Error(`Diagnostic API error: ${diagnosticResponse.status}`);
      }
      const diagnosticResult = await diagnosticResponse.json();

      if (statsResult.success) {
        setStats(statsResult.stats);
      }

      if (diagnosticResult.success) {
        setDiagnostic(diagnosticResult.diagnostic);
      }
    } catch (error) {
      console.error("Failed to load status:", error);
      // Set default empty state to prevent UI errors
      setStats({
        totalBusinesses: 0,
        totalImages: 0,
        totalReviews: 0,
        averageRating: 0,
        scraping: { isRunning: false },
      });
      setDiagnostic({
        actualBusinessCount: 0,
        totalFromQuery: 0,
      });
    } finally {
      setLoading(false);
      setLoadingRef(false);
    }
  };

  const startScraping = async () => {
    try {
      setScrapingLoading(true);

      const response = await fetch("/api/scraping/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
        }),
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

  useEffect(() => {
    // Initial load with small delay to prevent race conditions
    const timeoutId = setTimeout(() => {
      loadStatus();
    }, 100);

    // Auto-refresh every 15 seconds (increased from 10 to reduce load)
    const interval = setInterval(() => {
      if (!loadingRef && !loading) {
        loadStatus();
      }
    }, 15000);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [loadingRef, loading]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Admin Status Dashboard
            </h1>
            <div className="flex gap-4">
              <Button onClick={loadStatus} disabled={loading}>
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh Status
              </Button>

              <Button
                onClick={startScraping}
                disabled={scrapingLoading || stats?.scraping?.isRunning}
                variant={stats?.scraping?.isRunning ? "destructive" : "default"}
              >
                {stats?.scraping?.isRunning ? (
                  <>
                    <Square className="h-4 w-4 mr-2" />
                    Scraping Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Scraping
                  </>
                )}
              </Button>

              <Button
                onClick={fetchAllReviews}
                disabled={reviewsLoading || stats?.scraping?.isRunning}
                variant="outline"
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

            {/* Diagnostic Info */}
            {diagnostic && (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Database Diagnostic</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
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
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
