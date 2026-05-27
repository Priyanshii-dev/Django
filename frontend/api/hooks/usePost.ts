"use client";

import { useCallback, useState } from "react";
import { request } from "../../lib/api";

export function usePost<TResponse = unknown, TPayload = unknown>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (path: string, payload?: TPayload) => {
    setLoading(true);
    setError(null);

    try {
      return await request<TResponse>(path, {
        method: "POST",
        body: payload === undefined ? undefined : JSON.stringify(payload),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit";
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
