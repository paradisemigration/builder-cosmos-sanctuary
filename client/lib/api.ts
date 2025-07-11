// API client for backend communication

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
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/api/businesses${queryParams.toString() ? `?${queryParams}` : ""}`;
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
}

// Export singleton instance
export const apiClient = new APIClient();
export { apiClient as BusinessAPI }; // Backward compatibility alias

// Export types
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
