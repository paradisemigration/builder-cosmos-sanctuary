// API client for backend communication
import { sampleBusinesses, type Business } from "@/lib/data";
import { isFrontendOnlyDeployment } from "@/utils/api-config";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

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
    const url = `${this.baseURL}${endpoint}`;

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

    const response = await fetch(`${this.baseURL}/api/upload/single`, {
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

    const response = await fetch(`${this.baseURL}/api/upload/multiple`, {
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

    const response = await fetch(`${this.baseURL}/api/businesses`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Failed to create business",
      }));
      throw new Error(error.message || "Failed to create business");
    }

    return response.json();
  }

  // Get businesses with pagination and filters
  async getBusinesses(
    params: {
      page?: number;
      limit?: number;
      city?: string;
      category?: string;
      search?: string;
    } = {},
  ) {
    // Check if this is a frontend-only deployment
    if (isFrontendOnlyDeployment()) {
      console.log("Frontend-only deployment detected, returning sample data");

      let filteredBusinesses = [...sampleBusinesses];

      // Apply basic filtering to sample data
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        filteredBusinesses = filteredBusinesses.filter(
          (business) =>
            business.name?.toLowerCase().includes(searchTerm) ||
            business.category?.toLowerCase().includes(searchTerm) ||
            business.description?.toLowerCase().includes(searchTerm),
        );
      }

      if (params.category) {
        filteredBusinesses = filteredBusinesses.filter((business) =>
          business.category
            ?.toLowerCase()
            .includes(params.category!.toLowerCase()),
        );
      }

      if (params.city) {
        filteredBusinesses = filteredBusinesses.filter((business) =>
          business.city?.toLowerCase().includes(params.city!.toLowerCase()),
        );
      }

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 20;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedData = filteredBusinesses.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedData.map((business, index) => ({
          ...business,
          id: business.id || `sample-${index}`,
          isVerified: true,
          reviewCount:
            business.reviewCount || Math.floor(Math.random() * 50) + 1,
          rating: business.rating || Math.random() * 2 + 3,
        })),
        pagination: {
          current: page,
          total: Math.ceil(filteredBusinesses.length / limit),
          totalRecords: filteredBusinesses.length,
          hasNext: endIndex < filteredBusinesses.length,
          hasPrev: page > 1,
        },
      };
    }

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/api/scraped-businesses${queryParams.toString() ? `?${queryParams}` : ""}`;
    return this.request<{
      success: boolean;
      data: any[];
      pagination: {
        current: number;
        total: number;
        totalRecords: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(endpoint);
  }

  // Get single business
  async getBusiness(id: string) {
    return this.request<{
      success: boolean;
      data: any;
    }>(`/api/businesses/${id}`);
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

    const response = await fetch(`${this.baseURL}/api/businesses/${id}`, {
      method: "PUT",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "Failed to update business",
      }));
      throw new Error(error.message || "Failed to update business");
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
    if (isFrontendOnlyDeployment()) {
      console.log("Frontend-only deployment: returning featured sample data");
      const featuredBusinesses = sampleBusinesses
        .slice(0, 6)
        .map((business, index) => ({
          ...business,
          id: business.id || `featured-${index}`,
          isVerified: true,
          isFeatured: true,
          reviewCount:
            business.reviewCount || Math.floor(Math.random() * 50) + 10,
          rating: business.rating || Math.random() * 1.5 + 3.5, // 3.5-5 star rating for featured
        }));

      return {
        success: true,
        data: featuredBusinesses,
      };
    }

    return this.request<{
      success: boolean;
      data: any[];
    }>("/api/businesses/featured");
  }

  // Get business by ID
  async getBusinessById(id: string) {
    if (isFrontendOnlyDeployment()) {
      console.log("Frontend-only deployment: returning sample business by ID");
      const business =
        sampleBusinesses.find((b) => b.id === id) || sampleBusinesses[0];

      return {
        success: true,
        data: {
          ...business,
          id: business.id || id,
          isVerified: true,
          reviewCount:
            business.reviewCount || Math.floor(Math.random() * 50) + 1,
          rating: business.rating || Math.random() * 2 + 3,
        },
      };
    }

    return this.request<{
      success: boolean;
      data: any;
    }>(`/api/businesses/${id}`);
  }

  // Get business statistics
  async getBusinessStats() {
    if (isFrontendOnlyDeployment()) {
      console.log("Frontend-only deployment: returning sample stats");

      return {
        success: true,
        data: {
          totalBusinesses: sampleBusinesses.length,
          totalCities: 50,
          totalCategories: 25,
          verifiedBusinesses: Math.floor(sampleBusinesses.length * 0.8),
          avgRating: 4.2,
          totalReviews: sampleBusinesses.length * 15,
        },
      };
    }

    return this.request<{
      success: boolean;
      data: any;
    }>("/api/businesses/stats");
  }
}

// Export singleton instance
export const apiClient = new APIClient();
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
        size: number;
        mimetype: string;
      }
    | {
        fileName: string;
        publicUrl: string;
        size: number;
        mimetype: string;
      }[];
  message: string;
}

export interface BusinessResponse {
  success: boolean;
  data: any;
  message: string;
}

export default apiClient;
