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
          <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            {required && <span className="text-red-500"> *</span>}
          </span>
          {textarea ? (
            <textarea
              {...field}
              value={field.value ?? ""}
              rows={rows}
              placeholder={placeholder}
              aria-invalid={Boolean(fieldState.error)}
              className={cn(
                "w-full resize-none rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
                fieldState.error && "border-red-500 focus:border-red-500",
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
                "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
                fieldState.error && "border-red-500 focus:border-red-500",
                className,
              )}
            />
          )}
          {fieldState.error?.message && (
            <span className="mt-1 block text-xs font-medium text-red-600 dark:text-red-300">
              {fieldState.error.message}
            </span>
          )}
        </label>
      )}
    />
  );
}
