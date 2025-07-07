import { Business } from "./data";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BusinessFilters {
  category?: string;
  location?: string;
  zone?: string;
  verified?: boolean;
  rating?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "rating" | "name" | "date" | "reviews";
  sortOrder?: "asc" | "desc";
}

// Business API Class
export class BusinessAPI {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // Get all businesses with filters
  static async getBusinesses(
    filters: BusinessFilters = {},
  ): Promise<ApiResponse<Business[]>> {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/businesses${queryString ? `?${queryString}` : ""}`;

    return this.request<Business[]>(endpoint);
  }

  // Get featured businesses (verified + high rating)
  static async getFeaturedBusinesses(): Promise<ApiResponse<Business[]>> {
    return this.request<Business[]>("/businesses/featured");
  }

  // Get business by ID
  static async getBusinessById(id: string): Promise<ApiResponse<Business>> {
    return this.request<Business>(`/businesses/${id}`);
  }

  // Search businesses by text query
  static async searchBusinesses(
    query: string,
    filters: Omit<BusinessFilters, "search"> = {},
  ): Promise<ApiResponse<Business[]>> {
    return this.getBusinesses({ ...filters, search: query });
  }

  // Get businesses by category
  static async getBusinessesByCategory(
    category: string,
    filters: Omit<BusinessFilters, "category"> = {},
  ): Promise<ApiResponse<Business[]>> {
    return this.getBusinesses({ ...filters, category });
  }

  // Get businesses by location
  static async getBusinessesByLocation(
    location: string,
    filters: Omit<BusinessFilters, "location"> = {},
  ): Promise<ApiResponse<Business[]>> {
    return this.getBusinesses({ ...filters, location });
  }

  // Get businesses by category and location
  static async getBusinessesByCategoryAndLocation(
    category: string,
    location: string,
    filters: Omit<BusinessFilters, "category" | "location"> = {},
  ): Promise<ApiResponse<Business[]>> {
    return this.getBusinesses({ ...filters, category, location });
  }

  // Add new business
  static async addBusiness(
    businessData: Omit<Business, "id" | "rating" | "reviewCount" | "reviews">,
  ): Promise<ApiResponse<Business>> {
    return this.request<Business>("/businesses", {
      method: "POST",
      body: JSON.stringify(businessData),
    });
  }

  // Update business
  static async updateBusiness(
    id: string,
    businessData: Partial<Business>,
  ): Promise<ApiResponse<Business>> {
    return this.request<Business>(`/businesses/${id}`, {
      method: "PUT",
      body: JSON.stringify(businessData),
    });
  }

  // Delete business
  static async deleteBusiness(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/businesses/${id}`, {
      method: "DELETE",
    });
  }

  // Get business statistics
  static async getBusinessStats(): Promise<
    ApiResponse<{
      totalBusinesses: number;
      verifiedBusinesses: number;
      averageRating: number;
      totalReviews: number;
      businessesByCategory: { [category: string]: number };
      businessesByLocation: { [location: string]: number };
    }>
  > {
    return this.request("/businesses/stats");
  }
}

// Helper hook for API calls with loading and error states
export function useBusinessAPI() {
  return {
    getBusinesses: BusinessAPI.getBusinesses,
    getFeaturedBusinesses: BusinessAPI.getFeaturedBusinesses,
    getBusinessById: BusinessAPI.getBusinessById,
    searchBusinesses: BusinessAPI.searchBusinesses,
    getBusinessesByCategory: BusinessAPI.getBusinessesByCategory,
    getBusinessesByLocation: BusinessAPI.getBusinessesByLocation,
    getBusinessesByCategoryAndLocation:
      BusinessAPI.getBusinessesByCategoryAndLocation,
    addBusiness: BusinessAPI.addBusiness,
    updateBusiness: BusinessAPI.updateBusiness,
    deleteBusiness: BusinessAPI.deleteBusiness,
    getBusinessStats: BusinessAPI.getBusinessStats,
  };
}
