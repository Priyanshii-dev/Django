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
          <span className="mb-1 block text-sm font-medium text-app-text dark:text-app-text-dark">
            {label}
          </span>
        )}
        <span className="relative block">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-app-placeholder">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            className={cn(
              "h-10 w-full rounded-md border border-app-border-strong bg-app-surface px-3 text-sm text-app-text outline-none transition focus:border-app-primary-ring dark:border-app-border-dark dark:bg-app-surface-muted-dark dark:text-app-text-dark",
              leftIcon && "pl-9",
              error && "border-app-danger focus:border-app-danger",
              className,
            )}
            {...props}
          />
        </span>
        {error && (
          <span className="mt-1 block text-xs font-medium text-app-danger">
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
  <label className="flex items-center gap-2 text-sm font-medium text-app-text dark:text-app-text-dark">
    <input
      ref={ref}
      type="checkbox"
      className={cn("size-4 rounded border-app-border-strong", className)}
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
          <span className="mb-1 block text-sm font-medium text-app-text dark:text-app-text-dark">
            {label}
          </span>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "h-10 rounded-md border border-app-border-strong bg-app-surface px-3 text-sm font-medium text-app-text outline-none focus:border-app-primary-ring dark:border-app-border-dark dark:bg-app-surface-muted-dark dark:text-app-text-dark",
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
