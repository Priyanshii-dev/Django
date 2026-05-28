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
          ? "bg-app-danger-soft text-app-danger dark:bg-app-danger-soft-dark"
          : "bg-app-success-soft text-app-success dark:bg-app-success-soft-dark",
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
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}
