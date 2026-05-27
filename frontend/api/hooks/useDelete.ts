"use client";

import { useCallback, useState } from "react";
import { request } from "../../lib/api";

export function useDelete<T = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);

    try {
      return await request<T>(path, { method: "DELETE" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    execute,
    loading,
    error,
  };
}
