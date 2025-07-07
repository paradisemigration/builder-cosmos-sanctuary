import { useState, useEffect, useCallback } from "react";
import { BusinessAPI, BusinessFilters } from "@/lib/api";
import { Business } from "@/lib/data";

interface UseBusinessDataResult {
  businesses: Business[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

export function useBusinessData(
  filters: BusinessFilters = {},
  autoFetch: boolean = true,
): UseBusinessDataResult {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const fetchBusinesses = useCallback(
    async (resetData: boolean = true) => {
      try {
        setLoading(true);
        setError(null);

        const response = await BusinessAPI.getBusinesses(filters);

        if (response.success) {
          if (resetData) {
            setBusinesses(response.data);
          } else {
            // Append for pagination
            setBusinesses((prev) => [...prev, ...response.data]);
          }
          setPagination(response.pagination || null);
        } else {
          setError(response.message || "Failed to fetch businesses");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [filters],
  );

  const loadMore = useCallback(async () => {
    if (!pagination || pagination.page >= pagination.totalPages) return;

    const nextPageFilters = {
      ...filters,
      page: pagination.page + 1,
    };

    try {
      setLoading(true);
      const response = await BusinessAPI.getBusinesses(nextPageFilters);

      if (response.success) {
        setBusinesses((prev) => [...prev, ...response.data]);
        setPagination(response.pagination || null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination]);

  useEffect(() => {
    if (autoFetch) {
      fetchBusinesses();
    }
  }, [fetchBusinesses, autoFetch]);

  const hasMore =
    pagination !== null && pagination.page < pagination.totalPages;

  return {
    businesses,
    loading,
    error,
    pagination,
    refetch: () => fetchBusinesses(true),
    loadMore,
    hasMore,
  };
}

// Hook for featured businesses
export function useFeaturedBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatured = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await BusinessAPI.getFeaturedBusinesses();

      if (response.success) {
        setBusinesses(response.data);
      } else {
        setError(response.message || "Failed to fetch featured businesses");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return {
    businesses,
    loading,
    error,
    refetch: fetchFeatured,
  };
}

// Hook for single business
export function useBusiness(id: string) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBusiness = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const response = await BusinessAPI.getBusinessById(id);

      if (response.success) {
        setBusiness(response.data);
      } else {
        setError(response.message || "Business not found");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBusiness();
  }, [fetchBusiness]);

  return {
    business,
    loading,
    error,
    refetch: fetchBusiness,
  };
}

// Hook for business statistics
export function useBusinessStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await BusinessAPI.getBusinessStats();

      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || "Failed to fetch statistics");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
