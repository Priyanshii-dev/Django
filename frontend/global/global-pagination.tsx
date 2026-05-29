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
  const goToPageField = register("goToPage", {
    onChange: (event) => {
      const input = event.target as HTMLInputElement;
      input.value = input.value.replace(/\D/g, "");
    },
  });

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
    const page = Math.min(totalPages, Math.max(1, parseInt(goToPage, 10) || 1));
    onPageChange(page);
    resetField("goToPage");
  };

  if (totalPages <= 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 py-4">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
        {totalItems && (
          <div className="text-sm text-app-muted dark:text-app-muted-dark">
            Showing{" "}
            <span className="font-semibold text-app-text dark:text-app-text-dark">
              {totalItems === 0 ? 0 : Math.max(1, (currentPage - 1) * itemsPerPage + 1)}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-app-text dark:text-app-text-dark">
              {Math.min(currentPage * itemsPerPage, totalItems)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-app-text dark:text-app-text-dark">
              {totalItems}
            </span>{" "}
            results
          </div>
        )}

        {onItemsPerPageChange && (
          <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
            <label
              htmlFor="items-per-page"
              className="text-sm font-medium text-app-text dark:text-app-text-dark"
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
            <span className="text-sm font-medium text-app-text dark:text-app-text-dark">
              per page
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-lg border border-app-border bg-app-surface px-2 py-2 shadow-sm dark:border-app-border-dark dark:bg-app-surface-dark sm:w-auto sm:px-3">
          <div className="flex gap-1 align-middle">
            <GlobalButton
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4 text-app-muted dark:text-app-muted-dark" />
            </GlobalButton>

            <GlobalButton
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4 text-app-muted dark:text-app-muted-dark" />
            </GlobalButton>
          </div>

          <div className="flex max-w-full items-center gap-1 overflow-x-auto px-1 sm:px-2">
            {renderPageNumbers().map((page, idx) => (
              <GlobalButton
                key={idx}
                onClick={() => typeof page === "number" && onPageChange(page)}
                disabled={typeof page === "string" || page === currentPage}
                variant="ghost"
                size="icon"
                className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold transition-colors ${
                  page === currentPage
                    ? "bg-app-primary text-app-on-primary"
                    : typeof page === "number"
                    ? "text-app-text hover:bg-app-surface-muted dark:text-app-text-dark dark:hover:bg-app-hover-dark"
                    : "cursor-default text-app-placeholder"
                }`}
              >
                {page}
              </GlobalButton>
            ))}
          </div>

          <div className="flex gap-1 align-middle">
            <GlobalButton
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4 text-app-muted dark:text-app-muted-dark" />
            </GlobalButton>
            <GlobalButton
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage >= totalPages}
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4 text-app-muted dark:text-app-muted-dark" />
            </GlobalButton>
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-2 rounded-md bg-app-surface px-1 dark:bg-app-surface-dark sm:w-auto sm:justify-start sm:pr-1">
            <span className="text-sm font-medium text-app-text dark:text-app-text-dark">
              Go to
            </span>
            <GlobalInput
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              minLength={1}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGoToPage();
                }
              }}
              placeholder="Page"
              className="h-9 w-20 bg-app-hover text-center font-medium placeholder:text-app-placeholder dark:bg-app-hover-dark"
              {...goToPageField}
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
