import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Download,
  Play,
  Square,
  RefreshCw,
  MapPin,
  Star,
  Clock,
  AlertCircle,
  CheckCircle,
  Building,
  Users,
  Database,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

export function GooglePlacesScraper() {
  // Configure API base URL based on environment
  const getApiUrl = (endpoint: string) => {
    // Check if we're in production and need a different API URL
    const baseUrl = import.meta.env.VITE_API_URL || "";
    return `${baseUrl}${endpoint}`;
  };

  const [activeJob, setActiveJob] = useState(null);
  const [scrapingJobs, setScrapingJobs] = useState([]);
  const [scrapedBusinesses, setScrapedBusinesses] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [customCity, setCustomCity] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  // Predefined options
  const defaultCities = [
    // Indian cities
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Indore",
    "Chandigarh",
    "Gurgaon",
    "Noida",
    "Dehradun",
    "Kochi",
    // UAE cities
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
  ];

  const defaultCategories = [
    // General visa services
    "visa consultant",
    "immigration lawyer",
    "study abroad consultant",
    "travel agency",
    "immigration services",
    "education consultant",
    "overseas education",
    "student visa services",
    "Visa consulting services",
    "Visa agent",
    "Immigration Consultants",

    // Europe services
    "Europe Work Visa Consultants",
    "Europe Work Visa Agent",

    // Canada services
    "Canada Visa Agent",
    "Canada Immigration Consultants",
    "Canada PR Visa Agents",
    "Canada Work Permit Consultant",
    "Canada Express Entry Consultant",
    "Best Canada Immigration Agency",
    "Canada Student Visa Consultant",
    "Canada Tourist Visa Agents",

    // USA services
    "USA Student Visa Consultants",
    "US Immigration Consultants",
    "USA Tourist Visa Agents",

    // UK services
    "UK Immigration Consultants",
    "UK Work Visa Consultants",
    "UK Student Visa Consultants",

    // Australia services
    "MARA Agent",
    "Australia PR Consultant",
    "Australia Immigration Agents",
    "Australia Student Visa Services",
    "Australia Work Visa Consultants",

    // General immigration services
    "Immigration & naturalization service",

    // European work permit visa agencies
    "Germany Work permit Visa agency",
    "Czech Republic work permit visa agency",
    "Cyprus work visa permit agency",
    "Netherlands Work permit Visa agency",
    "France work permit visa agency",
    "Hungary work permit visa agency",
    "Romania work permit visa agency",
    "Poland work permit agents agency",
    "Spain work permit visa agency",
    "Portugal work permit visa agency",
    "Italy seasonal work permit visa agency",
    "Malta work permit visa agency",
    "Luxembourg work visa agency",
    "Greece work permit agency",
    "Norway Work Permit Visa agency",
  ];

  useEffect(() => {
    loadInitialData();

    // Reduce polling frequency in production to avoid overwhelming the server
    const pollInterval = window.location.hostname.includes("fly.dev")
      ? 15000
      : 5000; // 15s in prod, 5s in dev
    const interval = setInterval(loadStats, pollInterval);

    return () => clearInterval(interval);
  }, []);

  const loadInitialData = async () => {
    await Promise.all([
      loadScrapingJobs(),
      loadStats(),
      loadScrapedBusinesses(),
    ]);
  };

  const loadScrapingJobs = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(getApiUrl("/api/scraping/jobs"), {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setScrapingJobs(result.jobs || []);
        const runningJob = (result.jobs || []).find(
          (job) => job.status === "running",
        );
        if (runningJob) {
          setActiveJob(runningJob);
        }
      } else {
        setScrapingJobs([]);
      }
    } catch (error) {
      console.error("Load jobs error:", error);
      setScrapingJobs([]);
      setActiveJob(null);
    }
  };

  const loadStats = async (retryCount = 0) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(getApiUrl("/api/scraping/stats"), {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setStats(result.stats);
      } else {
        console.warn("Stats API returned success=false:", result);
        // Set fallback stats
        setStats({
          totalBusinesses: 0,
          totalGooglePlaces: 0,
          totalReviews: 0,
          averageRating: 0,
          citiesCount: 0,
        });
      }
    } catch (error) {
      console.error("Load stats error:", error);

      // Retry logic for network errors
      if (
        retryCount < 2 &&
        (error.name === "AbortError" || error.message.includes("fetch"))
      ) {
        console.log(`Retrying stats load (attempt ${retryCount + 1}/3)...`);
        setTimeout(() => loadStats(retryCount + 1), 2000);
        return;
      }

      // Set fallback stats on final failure
      setStats({
        totalBusinesses: 0,
        totalGooglePlaces: 0,
        totalReviews: 0,
        averageRating: 0,
        citiesCount: 0,
        error: "Unable to load stats - API unavailable",
      });
    }
  };

  const loadScrapedBusinesses = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        getApiUrl("/api/scraped-businesses?limit=50"),
        {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setScrapedBusinesses(result.businesses || []);
      } else {
        setScrapedBusinesses([]);
      }
    } catch (error) {
      console.error("Load businesses error:", error);
      setScrapedBusinesses([]);
    }
  };

  const startScraping = async () => {
    if (selectedCities.length === 0 || selectedCategories.length === 0) {
      toast.error("Please select at least one city and one category");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/scraping/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cities: selectedCities,
          categories: selectedCategories,
          maxResultsPerSearch: 15,
          delay: 1500,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Scraping started! Job ID: ${result.jobId}`);
        loadScrapingJobs();

        // Start polling for updates
        pollJobStatus(result.jobId);
      } else {
        toast.error(result.error || "Failed to start scraping");
      }
    } catch (error) {
      toast.error("Failed to start scraping");
      console.error("Start scraping error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const stopScraping = async () => {
    try {
      // First check if there's an active job to stop
      if (activeJob && activeJob.id) {
        // Try to stop the specific job
        const response = await fetch(`/api/scraping/job/${activeJob.id}/stop`, {
          method: "POST",
        });
        const result = await response.json();

        if (result.success) {
          toast.success("Scraping stopped successfully");
          setActiveJob(null);
          loadScrapingJobs();
          loadStats();
          return;
        }
      }

      // Fallback to general stop API
      const response = await fetch("/api/scraping/stop", { method: "POST" });
      const result = await response.json();

      if (result.success) {
        toast.success("Scraping stopped");
        setActiveJob(null);
        loadScrapingJobs();
        loadStats();
      } else {
        // Handle case where no active scraping job exists
        if (result.message === "No active scraping job") {
          toast.info("No active scraping job to stop");
          setActiveJob(null);
          loadScrapingJobs();
          loadStats();
        } else {
          toast.error(result.message || "Failed to stop scraping");
        }
      }
    } catch (error) {
      console.error("Stop scraping error:", error);
      toast.error("Failed to stop scraping");
    }
  };

  const pollJobStatus = (jobId) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/scraping/job/${jobId}`);
        const result = await response.json();

        if (result.success) {
          setActiveJob(result.job);

          if (
            result.job.status === "completed" ||
            result.job.status === "failed"
          ) {
            clearInterval(interval);
            setActiveJob(null);
            loadInitialData();

            if (result.job.status === "completed") {
              toast.success(
                `Scraping completed! Found ${result.job.totalBusinesses} businesses`,
              );
            } else {
              toast.error("Scraping failed");
            }
          }
        }
      } catch (error) {
        console.error("Poll job error:", error);
        clearInterval(interval);
      }
    }, 2000);
  };

  const addCity = () => {
    if (customCity && !selectedCities.includes(customCity)) {
      setSelectedCities([...selectedCities, customCity]);
      setCustomCity("");
    }
  };

  const addCategory = () => {
    if (customCategory && !selectedCategories.includes(customCategory)) {
      setSelectedCategories([...selectedCategories, customCategory]);
      setCustomCategory("");
    }
  };

  const selectAllCities = () => {
    setSelectedCities([...defaultCities]);
  };

  const deselectAllCities = () => {
    setSelectedCities([]);
  };

  const selectAllCategories = () => {
    setSelectedCategories([...defaultCategories]);
  };

  const deselectAllCategories = () => {
    setSelectedCategories([]);
  };

  const exportData = async () => {
    try {
      const response = await fetch("/api/scraping/export");
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scraped-businesses-${Date.now()}.json`;
      a.click();

      toast.success("Data exported successfully");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Google Places Data Scraper
        </h2>
        <div className="flex gap-2">
          <Button onClick={loadInitialData} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
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
                    {stats.totalBusinesses}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Globe className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Google Places
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalGooglePlaces || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Cities Covered
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.citiesCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Avg Rating
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.averageRating?.toFixed(1) || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="scraper">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scraper">Scraper Control</TabsTrigger>
          <TabsTrigger value="jobs">Scraping Jobs</TabsTrigger>
          <TabsTrigger value="data">Scraped Data</TabsTrigger>
        </TabsList>

        {/* Scraper Control Tab */}
        <TabsContent value="scraper" className="space-y-6">
          {/* Active Job Status */}
          {activeJob && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Active Scraping Job
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Progress: {activeJob.progress}%</span>
                    <Badge variant="secondary">
                      {activeJob.currentCity} - {activeJob.currentCategory}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${activeJob.progress}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      Businesses Found: {activeJob.totalBusinesses || 0}
                    </div>
                    <div>
                      Searches:{" "}
                      {activeJob.progress
                        ? Math.ceil(
                            (activeJob.totalSearches * activeJob.progress) /
                              100,
                          )
                        : 0}
                      /{activeJob.totalSearches}
                    </div>
                  </div>
                  <Button
                    onClick={stopScraping}
                    variant="destructive"
                    size="sm"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop Scraping
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scraper Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configure Scraping Job</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Cities Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Cities ({selectedCities.length} selected)
                  </label>
                  <div className="flex gap-2">
                    <Button
                      onClick={selectAllCities}
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs"
                    >
                      Select All
                    </Button>
                    <Button
                      onClick={deselectAllCities}
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {defaultCities.map((city) => (
                    <div key={city} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={city}
                        checked={selectedCities.includes(city)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCities([...selectedCities, city]);
                          } else {
                            setSelectedCities(
                              selectedCities.filter((c) => c !== city),
                            );
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor={city} className="text-sm">
                        {city}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom city"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCity()}
                  />
                  <Button onClick={addCity} size="sm">
                    Add
                  </Button>
                </div>
                {selectedCities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCities.map((city) => (
                      <Badge
                        key={city}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() =>
                          setSelectedCities(
                            selectedCities.filter((c) => c !== city),
                          )
                        }
                      >
                        {city} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Categories Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Categories ({selectedCategories.length} selected)
                  </label>
                  <div className="flex gap-2">
                    <Button
                      onClick={selectAllCategories}
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs"
                    >
                      Select All
                    </Button>
                    <Button
                      onClick={deselectAllCategories}
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {defaultCategories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([
                              ...selectedCategories,
                              category,
                            ]);
                          } else {
                            setSelectedCategories(
                              selectedCategories.filter((c) => c !== category),
                            );
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor={category} className="text-sm">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom category"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addCategory()}
                  />
                  <Button onClick={addCategory} size="sm">
                    Add
                  </Button>
                </div>
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCategories.map((category) => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() =>
                          setSelectedCategories(
                            selectedCategories.filter((c) => c !== category),
                          )
                        }
                      >
                        {category} ×
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Start Scraping */}
              <div className="pt-4 border-t">
                <Button
                  onClick={startScraping}
                  disabled={
                    isLoading ||
                    !!activeJob ||
                    selectedCities.length === 0 ||
                    selectedCategories.length === 0
                  }
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start Scraping ({selectedCities.length} cities ×{" "}
                      {selectedCategories.length} categories)
                    </>
                  )}
                </Button>
                {selectedCities.length > 0 && selectedCategories.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Estimated time: ~
                    {Math.ceil(
                      selectedCities.length * selectedCategories.length * 1.5,
                    )}{" "}
                    minutes
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scraping Jobs Tab */}
        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Scraping Job History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Cities</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Found</TableHead>
                    <TableHead>Started</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scrapingJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell className="font-mono text-xs">
                        {job.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            job.status === "completed"
                              ? "default"
                              : job.status === "running"
                                ? "secondary"
                                : job.status === "failed"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{job.cities?.length || 0}</TableCell>
                      <TableCell>{job.categories?.length || 0}</TableCell>
                      <TableCell>{job.progress || 0}%</TableCell>
                      <TableCell>{job.totalBusinesses || 0}</TableCell>
                      <TableCell>
                        {job.startedAt
                          ? new Date(job.startedAt).toLocaleString()
                          : "Not started"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scraped Data Tab */}
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Recently Scraped Businesses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Reviews</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scrapedBusinesses.slice(0, 20).map((business) => (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">
                        {business.name}
                      </TableCell>
                      <TableCell>{business.city}</TableCell>
                      <TableCell>{business.category}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          {business.rating?.toFixed(1) || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>{business.reviewCount || 0}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {business.source || "manual"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default GooglePlacesScraper;
