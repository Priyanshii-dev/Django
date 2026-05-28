"use client";

import * as React from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { cn } from "@/lib/utils";

type FormInputProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
  className?: string;
};

export function FormInput<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  required = false,
  textarea = false,
  rows = 3,
  className,
}: FormInputProps<TFieldValues>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-app-text dark:text-app-text-dark">
            {label}
            {required && <span className="text-app-danger"> *</span>}
          </span>
          {textarea ? (
            <textarea
              {...field}
              value={field.value ?? ""}
              rows={rows}
              placeholder={placeholder}
              aria-invalid={Boolean(fieldState.error)}
              className={cn(
                "w-full resize-none rounded-md border border-app-border-strong bg-app-surface px-3 py-2 text-sm text-app-text outline-none transition focus:border-app-primary-ring dark:border-app-border-dark dark:bg-app-surface-muted-dark dark:text-app-text-dark",
                fieldState.error && "border-app-danger focus:border-app-danger",
                className,
              )}
            />
          ) : (
            <input
              {...field}
              value={field.value ?? ""}
              type={type}
              placeholder={placeholder}
              aria-invalid={Boolean(fieldState.error)}
              className={cn(
                "h-10 w-full rounded-md border border-app-border-strong bg-app-surface px-3 text-sm text-app-text outline-none transition focus:border-app-primary-ring dark:border-app-border-dark dark:bg-app-surface-muted-dark dark:text-app-text-dark",
                fieldState.error && "border-app-danger focus:border-app-danger",
                className,
              )}
            />
          )}
          {fieldState.error?.message && (
            <span className="mt-1 block text-xs font-medium text-app-danger">
              {fieldState.error.message}
            </span>
          )}
        </label>
      )}
    />
  );
}
