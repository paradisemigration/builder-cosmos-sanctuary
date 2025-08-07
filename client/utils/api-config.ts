/**
 * API Configuration Utility
 * For same domain deployment - frontend and backend on same server
 */

interface ApiConfig {
  baseUrl: string;
  isConfigured: boolean;
  isLocal: boolean;
}

/**
 * Get the base API URL
 */
export function getApiBaseUrl(): string {
  // Check for override in localStorage first
  const override = localStorage.getItem("VITE_API_URL_OVERRIDE");
  if (override) {
    return override;
  }

  // Check environment variable
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }

  // For production deployments, return empty string to indicate no backend
  if (isFrontendOnlyDeployment()) {
    return "";
  }

  // For local development, assume backend is on same domain
  return "";
}

/**
 * Build API URL from endpoint (relative URLs for same domain)
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    // For same domain deployment, just return the endpoint as-is
    return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  }

  return `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
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

  // Known frontend-only platforms
  if (
    hostname.includes("fly.dev") ||
    hostname.includes("vercel.app") ||
    hostname.includes("netlify.app") ||
    hostname.includes("github.io")
  ) {
    return true;
  }

  // Custom domains - assume frontend-only if not localhost and no API URL configured
  if (!isLocalDevelopment() && !getApiBaseUrl()) {
    console.log(`Detected custom domain (${hostname}) with no backend API configured - treating as frontend-only`);
    return true;
  }

  return false;
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
    const response = await fetch("/api/health", {
      method: "HEAD",
    });
    return response.ok; // Only OK responses indicate backend is available
  } catch {
    return false;
  }
}

/**
 * Check if backend is available (cached check)
 */
let backendAvailable: boolean | null = null;
export async function isBackendAvailable(): Promise<boolean> {
  if (backendAvailable === null) {
    backendAvailable = await testBackendConnection();
  }
  return backendAvailable;
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
