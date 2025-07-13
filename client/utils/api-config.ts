/**
 * API Configuration Utility
 * Centralized API endpoint configuration for frontend-backend connectivity
 */

export interface ApiConfig {
  baseUrl: string;
  isConfigured: boolean;
  isLocal: boolean;
}

/**
 * Get the configured API base URL
 */
export function getApiBaseUrl(): string {
  const override = localStorage.getItem("VITE_API_URL_OVERRIDE");
  if (override) {
    return override.trim();
  }

  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.trim();
  }

  return "";
}

/**
 * Build full API URL from endpoint
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl) return endpoint;

  // Ensure endpoint starts with /
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
}

/**
 * Check if API is configured
 */
export function isApiConfigured(): boolean {
  return getApiBaseUrl().length > 0;
}

/**
 * Check if we're in local development
 */
export function isLocalDevelopment(): boolean {
  const hostname = window.location.hostname;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

/**
 * Check if this is a known frontend-only deployment
 */
export function isFrontendOnlyDeployment(): boolean {
  const hostname = window.location.hostname;
  return (
    hostname.includes("fly.dev") ||
    hostname.includes("vercel.app") ||
    hostname.includes("netlify.app") ||
    hostname.includes("github.io")
  );
}

/**
 * Get comprehensive API configuration
 */
export function getApiConfig(): ApiConfig {
  const baseUrl = getApiBaseUrl();

  return {
    baseUrl,
    isConfigured: baseUrl.length > 0,
    isLocal: isLocalDevelopment(),
  };
}

/**
 * Save API URL configuration
 */
export function saveApiUrl(url: string): void {
  if (url.trim()) {
    localStorage.setItem("VITE_API_URL_OVERRIDE", url.trim());
  } else {
    localStorage.removeItem("VITE_API_URL_OVERRIDE");
  }
}

/**
 * Test API connection
 */
export async function testApiConnection(baseUrl?: string): Promise<{
  success: boolean;
  error?: string;
  details?: string;
}> {
  try {
    const testUrl = baseUrl || getApiBaseUrl();
    if (!testUrl) {
      return {
        success: false,
        error: "No API URL provided",
        details: "Please enter a valid API URL",
      };
    }

    // Validate URL format
    try {
      new URL(testUrl);
    } catch {
      return {
        success: false,
        error: "Invalid URL format",
        details: "Please enter a valid URL (e.g., https://api.example.com)",
      };
    }

    // Try multiple endpoints to test connectivity
    const testEndpoints = [
      "/api/ultra-fast-sync/stats",
      "/api/health",
      "/api/status",
      "/",
    ];

    let lastError: string = "Unknown error";

    for (const endpoint of testEndpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${testUrl}${endpoint}`, {
          method: "GET",
          mode: "cors",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok || response.status === 404) {
          // 404 is fine - means server is responding
          return { success: true };
        }

        lastError = `HTTP ${response.status}: ${response.statusText}`;
      } catch (error: any) {
        if (error.name === "AbortError") {
          lastError = "Request timeout (5s)";
        } else if (error.message.includes("CORS")) {
          lastError = "CORS policy blocking request";
        } else if (error.message.includes("network")) {
          lastError = "Network error - server unreachable";
        } else {
          lastError = error.message || "Connection failed";
        }
      }
    }

    return {
      success: false,
      error: "Connection failed",
      details: lastError,
    };
  } catch (error: any) {
    return {
      success: false,
      error: "Test failed",
      details: error.message || "Unknown error occurred",
    };
  }
}

/**
 * Get API status for display
 */
export function getApiStatus(): {
  status: "connected" | "disconnected" | "checking" | "unconfigured";
  message: string;
} {
  const config = getApiConfig();

  if (!config.isConfigured) {
    return {
      status: "unconfigured",
      message: "API URL not configured",
    };
  }

  // This would need to be updated by components after health checks
  return {
    status: "checking",
    message: "Checking connection...",
  };
}
