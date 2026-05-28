"use client";

import { useCallback, useState } from "react";

export interface BaseParams {
  limit: number;
  page: number;
  search?: string;
  role?: string;
  status?: string;
  category?: string;
  sort?: string;
  order?: "asc" | "desc";
}

export function useDataTable(initialParams: Partial<BaseParams> = {}) {
  const [listParams, setListParams] = useState<BaseParams>({
    limit: 10,
    page: 1,
    search: "",
    role: undefined,
    status: undefined,
    ...initialParams,
  });

  const handleSearch = useCallback((search?: string) => {
    setListParams((prev) => ({ ...prev, search: search ?? "", page: 1 }));
  }, []);

  const handleSelectChange = useCallback((key: keyof BaseParams, value?: string) => {
    setListParams((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setListParams((prev) => ({
      ...prev,
      page: Math.max(1, newPage),
    }));
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setListParams((prev) => ({
      ...prev,
      limit: newSize || 10,
      page: 1,
    }));
  }, []);

  const handleStatusChange = useCallback((newStatus: string) => {
    const statusValue =
      newStatus.toLowerCase() === "all" ? undefined : newStatus;

    setListParams((prev) => ({
      ...prev,
      status: statusValue,
      page: 1,
    }));
  }, []);

  const apiParams = listParams;

  return {
    listParams,
    apiParams,
    handleSearch,
    handlePageChange,
    handlePageSizeChange,
    handleSelectChange,
    handleStatusChange,
  };
}
