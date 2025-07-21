// src/hooks/use-ipl-data.ts
"use client";

import { useState, useEffect } from "react";
import { IPLData } from "@/types/ipl";

interface UseIPLDataResult {
  data: IPLData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch IPL data from the API
 * @param refreshInterval - Interval in milliseconds to automatically refresh data (default: 60000ms / 1 minute)
 */
export function useIPLData(refreshInterval = 60000): UseIPLDataResult {
  const [data, setData] = useState<IPLData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/scrape");

      if (!response.ok) {
        throw new Error(`Failed to fetch IPL data: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error("Error fetching IPL data:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();

    // Set up auto-refresh interval if specified
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchData, refreshInterval);

      // Clean up interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [refreshInterval]);

  return { data, isLoading, error, refetch };
}
