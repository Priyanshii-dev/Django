import * as React from "react";
import { cn } from "@/lib/utils";

type GlobalInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  containerClassName?: string;
};

export const GlobalInput = React.forwardRef<HTMLInputElement, GlobalInputProps>(
  ({ className, containerClassName, label, error, leftIcon, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className={cn("block", containerClassName)}>
        {label && (
          <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </span>
        )}
        <span className="relative block">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-slate-400">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            className={cn(
              "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
              leftIcon && "pl-9",
              error && "border-red-500 focus:border-red-500",
              className,
            )}
            {...props}
          />
        </span>
        {error && (
          <span className="mt-1 block text-xs font-medium text-red-600 dark:text-red-300">
            {error}
          </span>
        )}
      </label>
    );
  },
);

GlobalInput.displayName = "GlobalInput";

type GlobalCheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  label: string;
};

export const GlobalCheckbox = React.forwardRef<
  HTMLInputElement,
  GlobalCheckboxProps
>(({ className, label, ...props }, ref) => (
  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
    <input
      ref={ref}
      type="checkbox"
      className={cn("size-4 rounded border-slate-300", className)}
      {...props}
    />
    {label}
  </label>
));

GlobalCheckbox.displayName = "GlobalCheckbox";

type GlobalSelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: { label: string; value: string | number }[];
  containerClassName?: string;
};

export const GlobalSelect = React.forwardRef<HTMLSelectElement, GlobalSelectProps>(
  ({ className, containerClassName, label, options, id, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <label className={cn("block", containerClassName)}>
        {label && (
          <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
          </span>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "h-10 rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  },
);

GlobalSelect.displayName = "GlobalSelect";
