"use client";

import { useCallback, useState } from "react";
import { request } from "../lib/api";

export function useDelete<T = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (path: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await request<T>(path, { method: "DELETE" });
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
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
