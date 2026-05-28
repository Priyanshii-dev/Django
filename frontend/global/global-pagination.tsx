"use client";

import { useForm } from "react-hook-form";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { GlobalButton } from "./button";
import { GlobalInput, GlobalSelect } from "./input";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (items: number) => void;
  totalItems?: number;
}

const itemsPerPageOptions = [5, 10, 25, 50, 100];

type PaginationFormValues = {
  goToPage: string;
};

export function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage = 10,
  onItemsPerPageChange,
  totalItems,
}: PaginationProps) {
  const { register, watch, resetField } = useForm<PaginationFormValues>({
    defaultValues: { goToPage: "" },
  });
  const goToPage = watch("goToPage");

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPage) || 1;
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      resetField("goToPage");
    }
  };

  if (totalPages <= 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 py-4">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        {totalItems && (
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {totalItems === 0 ? 0 : Math.max(1, (currentPage - 1) * itemsPerPage + 1)}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900 dark:text-white">
              {totalItems}
            </span>{" "}
            results
          </div>
        )}

        {onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <label
              htmlFor="items-per-page"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Show
            </label>
            <GlobalSelect
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => {
                onItemsPerPageChange(parseInt(e.target.value));
                onPageChange(1);
              }}
              options={itemsPerPageOptions.map((option) => ({
                label: String(option),
                value: option,
              }))}
              className="h-9"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              per page
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <div className="flex align-middle gap-1">
            <GlobalButton
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="First page"
            >
              <ChevronsLeft className="w-4 h-4 text-muted-foreground dark:text-slate-400" />
            </GlobalButton>

            <GlobalButton
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 text-muted-foreground dark:text-slate-400" />
            </GlobalButton>
          </div>

          <div className="flex items-center gap-1 px-2">
            {renderPageNumbers().map((page, idx) => (
              <GlobalButton
                key={idx}
                onClick={() => typeof page === "number" && onPageChange(page)}
                disabled={typeof page === "string" || page === currentPage}
                variant="ghost"
                size="icon"
                className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold transition-colors ${
                  page === currentPage
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                    : typeof page === "number"
                    ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    : "text-slate-400 dark:text-slate-600 cursor-default"
                }`}
              >
                {page}
              </GlobalButton>
            ))}
          </div>

          <div className="flex align-middle gap-1">
            <GlobalButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4 text-muted-foreground dark:text-slate-400" />
            </GlobalButton>
            <GlobalButton
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage >= totalPages}
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Last page"
            >
              <ChevronsRight className="w-4 h-4 text-muted-foreground dark:text-slate-400" />
            </GlobalButton>
          </div>

          <div className="flex items-center gap-2 rounded-md bg-white pr-1 dark:bg-slate-950">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Go to
            </span>
            <GlobalInput
              type="number"
              min="1"
              max={totalPages}
              onKeyDown={(e) => e.key === "Enter" && handleGoToPage()}
              placeholder="Page"
              className="h-9 w-20 bg-slate-50 text-center font-medium placeholder:text-slate-400"
              {...register("goToPage")}
            />
            <GlobalButton
              onClick={handleGoToPage}
              disabled={!goToPage}
              className="h-9 px-3"
            >
              Go
            </GlobalButton>
          </div>
        </div>
      </div>
    </div>
  );
}
