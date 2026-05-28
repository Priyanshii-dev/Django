"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type GlobalFormProps = React.FormHTMLAttributes<HTMLFormElement>;

export function GlobalForm({ className, ...props }: GlobalFormProps) {
  return <form className={cn("space-y-4", className)} {...props} />;
}

type GlobalFormMessageProps = React.HTMLAttributes<HTMLParagraphElement> & {
  tone?: "success" | "error";
};

export function GlobalFormMessage({
  className,
  tone = "error",
  ...props
}: GlobalFormMessageProps) {
  return (
    <p
      className={cn(
        "rounded-md px-3 py-2 text-sm",
        tone === "error"
          ? "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300"
          : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
        className,
      )}
      {...props}
    />
  );
}

export function GlobalFormActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex justify-end gap-2", className)}
      {...props}
    />
  );
}
