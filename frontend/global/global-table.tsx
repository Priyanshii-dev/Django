"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type GlobalTableColumn<TData> = {
  key: string;
  header: ReactNode;
  className?: string;
  render: (row: TData) => ReactNode;
};

type GlobalTableProps<TData> = {
  data: TData[];
  columns: GlobalTableColumn<TData>[];
  getRowKey: (row: TData) => string | number;
  emptyMessage?: string;
  loading?: boolean;
};

export function GlobalTable<TData>({
  data,
  columns,
  getRowKey,
  emptyMessage = "No data available.",
  loading = false,
}: GlobalTableProps<TData>) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-app-border bg-app-surface shadow-sm dark:border-app-border-dark dark:bg-app-surface-dark">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead className="bg-app-hover text-left text-xs font-semibold uppercase tracking-wide text-app-muted dark:bg-app-hover-dark dark:text-app-muted-dark">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn("px-4 py-3", column.className)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-app-border dark:divide-app-border-dark">
            {loading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-4">
                      <div className="h-4 w-24 animate-pulse rounded bg-app-border dark:bg-app-border-dark" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length ? (
              data.map((row) => (
                <tr
                  key={getRowKey(row)}
                  className="text-app-text transition-colors hover:bg-app-hover dark:text-app-text-dark dark:hover:bg-app-hover-dark"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn("px-4 py-3 align-middle", column.className)}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-app-muted dark:text-app-muted-dark"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
