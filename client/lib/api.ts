// API client for backend communication
import { sampleBusinesses, type Business } from "@/lib/data";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = this.baseURL ? `${this.baseURL}${endpoint}` : endpoint;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Request failed",
      }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Upload single image
  async uploadImage(file: File, folder?: string) {
    const formData = new FormData();
    formData.append("image", file);
    if (folder) formData.append("folder", folder);

    const url = this.baseURL ? `${this.baseURL}/api/upload/single` : `/api/upload/single`;
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

    const url = this.baseURL ? `${this.baseURL}/api/upload/multiple` : `/api/upload/multiple`;
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

    const url = this.baseURL ? `${this.baseURL}/api/businesses` : `/api/businesses`;
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

  // Get businesses with pagination and filters - FIXED TO USE REAL API
  async getBusinesses(
    params: {
      page?: number;
      limit?: number;
      city?: string;
      category?: string;
      search?: string;
    } = {},
  ) {
    console.log("🚀 BusinessAPI.getBusinesses - FORCING REAL API CALL");
    console.log("📋 Request params:", params);

    // ALWAYS try the real API first - ignore all frontend-only detection
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.set("page", params.page.toString());
      if (params.limit) queryParams.set("limit", params.limit.toString());
      if (params.city) queryParams.set("city", params.city);
      if (params.category) queryParams.set("category", params.category);
      if (params.search) queryParams.set("search", params.search);

      const apiUrl = `/api/businesses?${queryParams}`;
      console.log("🚀 Calling real API:", apiUrl);

      const response = await this.request<{
        success: boolean;
        data: Business[];
        pagination: any;
        total: number;
        businesses: Business[];
        totalRecords: number;
        source?: string;
      }>(apiUrl);

      console.log("✅ REAL API RESPONSE:", {
        success: response.success,
        dataLength: response.data?.length || 0,
        businessesLength: response.businesses?.length || 0,
        total: response.total,
        totalRecords: response.totalRecords,
        source: response.source
      });

      if (response.success) {
        // Handle different response formats from your backend
        const businesses = response.businesses || response.data || [];
        const total = response.totalRecords || response.total || businesses.length;

        console.log("📊 REAL DATA EXTRACTED:", {
          businessCount: businesses.length,
          totalInDB: total,
          firstBusiness: businesses[0] ? {
            id: businesses[0].id,
            name: businesses[0].name,
            city: businesses[0].city
          } : "None"
        });

        // Format response to match expected structure
        return {
          success: true,
          data: businesses,
          pagination: response.pagination || {
            page: params.page || 1,
            totalPages: Math.ceil(total / (params.limit || 20)),
            totalRecords: total,
            hasNext: businesses.length === (params.limit || 20),
            hasPrev: (params.page || 1) > 1,
          }
        };
      } else {
        console.error("❌ API returned success=false:", response);
        throw new Error("API returned unsuccessful response");
      }
    } catch (error) {
      console.error("❌ REAL API COMPLETELY FAILED:", error);

      // Only use sample data as absolute last resort
      console.warn("📋 EMERGENCY FALLBACK: Using sample data because API failed");
      const page = params.page || 1;
      const limit = params.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedBusinesses = sampleBusinesses.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedBusinesses,
        pagination: {
          page: page,
          totalPages: Math.ceil(sampleBusinesses.length / limit),
          totalRecords: sampleBusinesses.length,
          hasNext: endIndex < sampleBusinesses.length,
          hasPrev: page > 1,
        }
      };
    }
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
      const sampleBusiness = sampleBusinesses.find(b => b.id === id);
      if (sampleBusiness) {
        return {
          success: true,
          data: sampleBusiness
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

    const url = this.baseURL ? `${this.baseURL}/api/businesses/${id}` : `/api/businesses/${id}`;
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
    try {
      return await this.request<{
        success: boolean;
        data: Business[];
      }>("/api/businesses/featured");
    } catch (error) {
      console.warn("Featured businesses API failed, using sample data");
      const featuredBusinesses = sampleBusinesses.filter(b => b.isFeatured).slice(0, 6);
      return {
        success: true,
        data: featuredBusinesses,
      };
    }
  }

  // Get business statistics
  async getBusinessStats() {
    try {
      return await this.request<{
        success: boolean;
        data: any;
      }>("/api/businesses/stats");
    } catch (error) {
      console.warn("Business stats API failed, using fallback");
      return {
        success: true,
        data: {
          totalBusinesses: sampleBusinesses.length,
          totalReviews: sampleBusinesses.length * 15,
          citiesCount: new Set(sampleBusinesses.map(b => b.city)).size,
          averageRating: 4.5
        },
      };
    }
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
