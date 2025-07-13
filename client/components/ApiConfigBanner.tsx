import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Settings, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import {
  getApiConfig,
  saveApiUrl,
  testApiConnection,
} from "@/utils/api-config";

interface ApiConfigBannerProps {
  backendAvailable: boolean | null;
  onConfigSaved?: () => void;
}

export function ApiConfigBanner({
  backendAvailable,
  onConfigSaved,
}: ApiConfigBannerProps) {
  const [showConfig, setShowConfig] = useState(false);
  const [apiUrl, setApiUrl] = useState(getApiConfig().baseUrl);
  const [testing, setTesting] = useState(false);

  const config = getApiConfig();

  const handleTestConnection = async () => {
    if (!apiUrl.trim()) {
      toast.error("Please enter an API URL first");
      return;
    }

    setTesting(true);
    try {
      const isConnected = await testApiConnection(apiUrl.trim());
      if (isConnected) {
        toast.success("✅ API connection successful!");
      } else {
        toast.error("❌ API connection failed - check URL and server status");
      }
    } catch (error) {
      toast.error(`Connection test failed: ${error.message}`);
    } finally {
      setTesting(false);
    }
  };

  const handleSaveConfig = () => {
    saveApiUrl(apiUrl);
    setShowConfig(false);
    toast.success("API configuration saved! Refreshing...");

    // Notify parent component
    if (onConfigSaved) {
      onConfigSaved();
    }

    // Refresh the page to apply new configuration
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  // Don't show banner if backend is available
  if (backendAvailable === true) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-800 mb-1">
              Backend API Connection Required
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Ultra-Fast S3 Sync and other advanced features require a backend
              API connection.
              {!config.isConfigured
                ? " Please configure your backend API URL."
                : " Current configuration is not responding."}
            </p>

            {!showConfig && (
              <div className="flex items-center gap-3">
                <Badge
                  variant={
                    backendAvailable === null ? "secondary" : "destructive"
                  }
                  className="flex items-center gap-1"
                >
                  {backendAvailable === null ? (
                    <>
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      Checking
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3" />
                      Disconnected
                    </>
                  )}
                </Badge>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowConfig(true)}
                  className="h-7"
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Configure API
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showConfig && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-blue-800 mb-1">
                Backend API URL
              </label>
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://your-backend-api.com"
                className="w-full px-3 py-2 text-sm border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-blue-600 mt-1">
                Example: <code>https://your-app.fly.dev</code> or{" "}
                <code>http://localhost:3001</code>
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowConfig(false)}
                className="h-7 text-blue-700 hover:text-blue-800"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleTestConnection}
                disabled={!apiUrl.trim() || testing}
                className="h-7"
              >
                {testing ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Wifi className="h-3 w-3 mr-1" />
                    Test
                  </>
                )}
              </Button>
              <Button
                size="sm"
                onClick={handleSaveConfig}
                disabled={!apiUrl.trim()}
                className="h-7"
              >
                Save & Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
