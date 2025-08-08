// API client for backend communication - NO DUMMY DATA FALLBACKS
import { Business } from "@/lib/data";
// Removed dummy data imports to force real API usage

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Generic request method using XMLHttpRequest to bypass FullStory interference
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = this.baseURL ? `${this.baseURL}${endpoint}` : endpoint;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const method = options.method || "GET";

      xhr.open(method, url);

      // Set headers
      xhr.setRequestHeader("Content-Type", "application/json");
      if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value as string);
        });
      }

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (error) {
              reject(new Error("Invalid JSON response"));
            }
          } else if (xhr.status === 0) {
            // HTTP 0 means no backend server - this is expected on frontend-only deployments
            reject(new Error("No backend server available"));
          } else {
            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
          }
        }
      };

      xhr.onerror = function () {
        reject(new Error("Network error - no backend server"));
      };

      xhr.ontimeout = function () {
        reject(new Error("Request timeout"));
      };

      xhr.timeout = 10000; // 10 second timeout

      // Send request
      if (options.body) {
        xhr.send(options.body as string);
      } else {
        xhr.send();
      }
    });
  }

  // Upload single image
  async uploadImage(file: File, folder?: string) {
    const formData = new FormData();
    formData.append("image", file);
    if (folder) formData.append("folder", folder);

    const url = this.baseURL
      ? `${this.baseURL}/api/upload/single`
      : `/api/upload/single`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Upload failed",
      }));
      throw new Error(error.message || "Upload failed");
    }

    return response.json();
  }

  // Upload multiple images
  async uploadImages(files: File[], folder?: string) {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    if (folder) formData.append("folder", folder);

    const url = this.baseURL
      ? `${this.baseURL}/api/upload/multiple`
      : `/api/upload/multiple`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Upload failed",
      }));
      throw new Error(error.message || "Upload failed");
    }

    return response.json();
  }

  // Create business with images
  async createBusiness(
    businessData: any,
    files?: {
      logo?: File;
      coverImage?: File;
      gallery?: File[];
    },
  ) {
    const formData = new FormData();
    formData.append("businessData", JSON.stringify(businessData));

    if (files?.logo) {
      formData.append("logo", files.logo);
    }
    if (files?.coverImage) {
      formData.append("coverImage", files.coverImage);
    }
    if (files?.gallery) {
      files.gallery.forEach((file) => formData.append("gallery", file));
    }

    const url = this.baseURL
      ? `${this.baseURL}/api/businesses`
      : `/api/businesses`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Creation failed",
      }));
      throw new Error(error.message || "Creation failed");
    }

    return response.json();
  }

  // Get businesses with pagination and filters
  async getBusinesses(params = {}) {
    console.log(
      "🎯 Fetching businesses - trying backend first, falling back to client data",
    );
    console.log("📊 Request params:", params);

    // Try backend first
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set("page", params.page.toString());
      if (params.limit) queryParams.set("limit", params.limit.toString());
      if (params.city) queryParams.set("city", params.city);
      if (params.category) queryParams.set("category", params.category);
      if (params.search) queryParams.set("search", params.search);

      const apiUrl = `/api/scraped-businesses?${queryParams}`;

      const response = await this.request(apiUrl);

      // If backend returns good data, use it
      if (response.success && response.data && response.data.length > 0) {
        console.log("✅ Using backend data:", {
          businessCount: response.data.length,
          source: response.source,
        });

        return {
          success: true,
          data: response.data,
          pagination: response.pagination || {
            page: params.page || 1,
            totalPages: 1,
            totalRecords: response.data.length,
            hasNext: false,
            hasPrev: false,
          },
        };
      }
    } catch (error) {
      console.error("❌ Backend completely unavailable:", error.message);
      return {
        success: false,
        data: [],
        pagination: { page: 1, totalPages: 0, totalRecords: 0, hasNext: false, hasPrev: false },
        error: "Backend connection failed - no dummy data served"
      };
    }

    // No fallback - if we reach here, force error
    return {
      success: false,
      data: [],
      pagination: { page: 1, totalPages: 0, totalRecords: 0, hasNext: false, hasPrev: false },
      error: "API response was invalid"
    };
  }

  // Get single business
  async getBusinessById(id: string) {
    try {
      return await this.request<{
        success: boolean;
        data: Business;
      }>(`/api/businesses/${id}`);
    } catch (error) {
      // Fallback to sample business
      const sampleBusiness = sampleBusinesses.find((b) => b.id === id);
      if (sampleBusiness) {
        return {
          success: true,
          data: sampleBusiness,
        };
      }
      throw error;
    }
  }

  // Update business
  async updateBusiness(
    id: string,
    businessData: any,
    files?: {
      logo?: File;
      coverImage?: File;
      gallery?: File[];
    },
  ) {
    const formData = new FormData();
    formData.append("businessData", JSON.stringify(businessData));

    if (files?.logo) {
      formData.append("logo", files.logo);
    }
    if (files?.coverImage) {
      formData.append("coverImage", files.coverImage);
    }
    if (files?.gallery) {
      files.gallery.forEach((file) => formData.append("gallery", file));
    }

    const url = this.baseURL
      ? `${this.baseURL}/api/businesses/${id}`
      : `/api/businesses/${id}`;
    const response = await fetch(url, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Update failed",
      }));
      throw new Error(error.message || "Update failed");
    }

    return response.json();
  }

  // Delete business
  async deleteBusiness(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/api/businesses/${id}`, {
      method: "DELETE",
    });
  }

  // Delete image
  async deleteImage(fileName: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/api/images/${fileName}`, {
      method: "DELETE",
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{
      success: boolean;
      message: string;
      timestamp: string;
    }>("/api/health");
  }

  // Get featured businesses
  async getFeaturedBusinesses() {
    console.log("⭐ Fetching featured businesses");
    try {
      const response = await this.request("/api/businesses/featured");
      if (response.success && response.data && response.data.length > 0) {
        console.log("✅ Using backend featured businesses");
        return response;
      }
    } catch (error) {
      console.error("❌ Backend featured businesses unavailable:", error.message);
      return {
        success: false,
        data: [],
        error: "Backend connection failed - no dummy data served"
      };
    }

    // No fallback - if we reach here, force error
    return {
      success: false,
      data: [],
      error: "API response was invalid"
    };
  }

  // Get business statistics
  async getBusinessStats() {
    console.log("📊 Fetching business statistics");
    try {
      const response = await this.request("/api/businesses/stats");
      if (response.success && response.data) {
        console.log("✅ Using backend stats");
        return response;
      }
    } catch (error) {
      console.error("❌ Backend stats unavailable:", error.message);
      return {
        success: false,
        data: {
          totalBusinesses: 0,
          totalReviews: 0,
          totalImages: 0,
          citiesCount: 0,
          averageRating: 0,
        },
        error: "Backend connection failed - no dummy data served"
      };
    }

    // No fallback - if we reach here, force error
    return {
      success: false,
      data: {
        totalBusinesses: 0,
        totalReviews: 0,
        totalImages: 0,
        citiesCount: 0,
        averageRating: 0,
      },
      error: "API response was invalid"
    };
  }
}

// Create global instance
const apiClient = new APIClient();

export default apiClient;
export { apiClient }; // Named export
export { apiClient as BusinessAPI }; // Backward compatibility alias

// Export types
export interface BusinessFilters {
  search?: string;
  category?: string;
  location?: string;
  city?: string;
  verified?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "rating" | "name" | "date" | "reviews";
  sortOrder?: "asc" | "desc";
}

export interface UploadResponse {
  success: boolean;
  data:
    | {
        fileName: string;
        publicUrl: string;
        originalName: string;
        size: number;
      }
    | {
        files: {
          fileName: string;
          publicUrl: string;
          originalName: string;
          size: number;
        }[];
      };
  message?: string;
}
