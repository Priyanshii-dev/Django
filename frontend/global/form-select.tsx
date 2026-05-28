"use client";

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { cn } from "@/lib/utils";

type FormSelectOption = string | { label: string; value: string | number };

type FormSelectProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  options: FormSelectOption[];
  required?: boolean;
  placeholder?: string;
  className?: string;
};

export function FormSelect<TFieldValues extends FieldValues>({
  name,
  control,
  label,
  options,
  required = false,
  placeholder = "Select option",
  className,
}: FormSelectProps<TFieldValues>) {
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
          <select
            {...field}
            value={field.value ?? ""}
            aria-invalid={Boolean(fieldState.error)}
            className={cn(
              "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
              fieldState.error && "border-red-500 focus:border-red-500",
              className,
            )}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => {
              const value = typeof option === "string" ? option : option.value;
              const optionLabel = typeof option === "string" ? option : option.label;

              return (
                <option key={value} value={value}>
                  {optionLabel}
                </option>
              );
            })}
          </select>
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
