/**
 * API Configuration Utility
 * For same domain deployment - frontend and backend on same server
 */

/**
 * Build API URL from endpoint (relative URLs for same domain)
 */
export function getApiUrl(endpoint: string): string {
  // For same domain deployment, just return the endpoint as-is
  return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
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
 * Test backend connection (simple check for same domain deployment)
 */
export async function testBackendConnection(): Promise<boolean> {
  try {
    const response = await fetch("/api/ultra-fast-sync/stats", {
      method: "HEAD",
    });
    return response.ok || response.status === 404; // 404 is fine - server responding
  } catch {
    return false;
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
