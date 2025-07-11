// Simple in-memory database for now (replace with PostgreSQL/MongoDB later)
// This will store all scraped business data

class Database {
  constructor() {
    this.businesses = new Map();
    this.scrapingJobs = new Map();
    this.statistics = {
      totalBusinesses: 0,
      totalImages: 0,
      totalReviews: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Business operations
  async saveBusiness(businessData) {
    try {
      const id = businessData.googlePlaceId || this.generateId();
      const timestamp = new Date().toISOString();

      const business = {
        ...businessData,
        id,
        createdAt: businessData.createdAt || timestamp,
        updatedAt: timestamp,
      };

      this.businesses.set(id, business);
      this.updateStatistics();

      return { success: true, id, business };
    } catch (error) {
      console.error("Save business error:", error);
      return { success: false, error: error.message };
    }
  }

  async getBusinessById(id) {
    return this.businesses.get(id) || null;
  }

  async getBusinesses(filters = {}) {
    let businesses = Array.from(this.businesses.values());

    // Apply filters
    if (filters.city) {
      businesses = businesses.filter((b) =>
        b.city.toLowerCase().includes(filters.city.toLowerCase()),
      );
    }

    if (filters.category) {
      businesses = businesses.filter((b) =>
        b.category.toLowerCase().includes(filters.category.toLowerCase()),
      );
    }

    if (filters.source) {
      businesses = businesses.filter((b) => b.source === filters.source);
    }

    if (filters.rating) {
      businesses = businesses.filter(
        (b) => b.rating >= parseFloat(filters.rating),
      );
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      businesses: businesses.slice(startIndex, endIndex),
      total: businesses.length,
      page,
      totalPages: Math.ceil(businesses.length / limit),
    };
  }

  async updateBusiness(id, updates) {
    const business = this.businesses.get(id);
    if (!business) {
      return { success: false, error: "Business not found" };
    }

    const updatedBusiness = {
      ...business,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.businesses.set(id, updatedBusiness);
    this.updateStatistics();

    return { success: true, business: updatedBusiness };
  }

  async deleteBusiness(id) {
    const existed = this.businesses.delete(id);
    if (existed) {
      this.updateStatistics();
    }
    return { success: existed };
  }

  // Scraping job operations
  async createScrapingJob(jobData) {
    const id = this.generateId();
    const job = {
      id,
      ...jobData,
      status: "pending",
      progress: 0,
      results: [],
      errors: [],
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
    };

    this.scrapingJobs.set(id, job);
    return { success: true, job };
  }

  async updateScrapingJob(id, updates) {
    const job = this.scrapingJobs.get(id);
    if (!job) {
      return { success: false, error: "Job not found" };
    }

    const updatedJob = {
      ...job,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.scrapingJobs.set(id, updatedJob);
    return { success: true, job: updatedJob };
  }

  async getScrapingJob(id) {
    return this.scrapingJobs.get(id) || null;
  }

  async getScrapingJobs() {
    return Array.from(this.scrapingJobs.values()).sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
  }

  // Statistics
  updateStatistics() {
    const businesses = Array.from(this.businesses.values());

    this.statistics = {
      totalBusinesses: businesses.length,
      totalImages: businesses.reduce(
        (sum, b) =>
          sum +
          (b.gallery?.length || 0) +
          (b.logo ? 1 : 0) +
          (b.coverImage ? 1 : 0),
        0,
      ),
      totalReviews: businesses.reduce(
        (sum, b) => sum + (b.reviews?.length || 0),
        0,
      ),
      totalGooglePlaces: businesses.filter((b) => b.source === "google_places")
        .length,
      averageRating:
        businesses.length > 0
          ? businesses.reduce((sum, b) => sum + (b.rating || 0), 0) /
            businesses.length
          : 0,
      citiesCount: new Set(businesses.map((b) => b.city)).size,
      lastUpdated: new Date().toISOString(),
    };
  }

  getStatistics() {
    return this.statistics;
  }

  // City-specific stats
  getCityStatistics(city) {
    const businesses = Array.from(this.businesses.values()).filter(
      (b) => b.city.toLowerCase() === city.toLowerCase(),
    );

    return {
      city,
      totalBusinesses: businesses.length,
      averageRating:
        businesses.length > 0
          ? businesses.reduce((sum, b) => sum + (b.rating || 0), 0) /
            businesses.length
          : 0,
      totalReviews: businesses.reduce(
        (sum, b) => sum + (b.reviewCount || 0),
        0,
      ),
      categories: [...new Set(businesses.map((b) => b.category))],
      topRated: businesses
        .filter((b) => b.rating >= 4.0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5),
    };
  }

  // Data export
  exportData(format = "json") {
    const businesses = Array.from(this.businesses.values());
    const jobs = Array.from(this.scrapingJobs.values());

    const exportData = {
      businesses,
      scrapingJobs: jobs,
      statistics: this.statistics,
      exportedAt: new Date().toISOString(),
    };

    if (format === "json") {
      return JSON.stringify(exportData, null, 2);
    }

    // Add CSV export if needed
    return exportData;
  }

  // Utilities
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  // Bulk operations
  async bulkSaveBusinesses(businessesArray) {
    const results = {
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const business of businessesArray) {
      try {
        const result = await this.saveBusiness(business);
        if (result.success) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(result.error);
        }
      } catch (error) {
        results.failed++;
        results.errors.push(error.message);
      }
    }

    return results;
  }

  // Search functionality
  searchBusinesses(query, filters = {}) {
    const businesses = Array.from(this.businesses.values());
    const searchTerm = query.toLowerCase();

    let filtered = businesses.filter(
      (business) =>
        business.name.toLowerCase().includes(searchTerm) ||
        business.description.toLowerCase().includes(searchTerm) ||
        business.city.toLowerCase().includes(searchTerm) ||
        business.category.toLowerCase().includes(searchTerm) ||
        business.services.some((service) =>
          service.toLowerCase().includes(searchTerm),
        ),
    );

    // Apply additional filters
    if (filters.city) {
      filtered = filtered.filter(
        (b) => b.city.toLowerCase() === filters.city.toLowerCase(),
      );
    }

    if (filters.minRating) {
      filtered = filtered.filter(
        (b) => b.rating >= parseFloat(filters.minRating),
      );
    }

    return filtered;
  }
}

// Singleton instance
const database = new Database();

export default database;
