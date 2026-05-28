import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "icon";

type GlobalButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-app-primary text-app-on-primary hover:bg-app-primary-hover",
  secondary:
    "bg-app-surface-muted text-app-text hover:bg-app-border dark:bg-app-surface-muted-dark dark:text-app-text-dark dark:hover:bg-app-border-dark",
  outline:
    "border border-app-border bg-app-surface text-app-text hover:bg-app-hover dark:border-app-border-dark dark:bg-app-surface-dark dark:text-app-text-dark dark:hover:bg-app-hover-dark",
  ghost:
    "text-app-muted hover:bg-app-surface-muted hover:text-app-text dark:text-app-muted-dark dark:hover:bg-app-hover-dark dark:hover:text-app-text-dark",
  danger:
    "bg-app-danger text-app-on-primary hover:bg-app-danger-hover",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  icon: "size-8 p-0",
};

export function GlobalButton({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: GlobalButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-app-primary-ring disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
