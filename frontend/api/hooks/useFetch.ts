"use client";

import { useCallback, useEffect, useState } from "react";
import { request } from "../../lib/api";

export function useFetch<T>(
  path: string,
  options: RequestInit = {},
  deps: unknown[] = [],
  enabled = true,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await request<T>(path, options);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [enabled, path, JSON.stringify(options), ...deps]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
