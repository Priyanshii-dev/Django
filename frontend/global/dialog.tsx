"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlobalButton } from "./button";
import { GlobalForm, GlobalFormActions } from "./form";

type GlobalDialogProps = {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  bodyClassName?: string;
  hideCloseButton?: boolean;
  hideTitle?: boolean;
};

export function GlobalDialog({
  title,
  children,
  onClose,
  open = true,
  onOpenChange,
  className,
  bodyClassName,
  hideCloseButton = false,
  hideTitle = false,
}: GlobalDialogProps) {
  const titleId = React.useId();
  const closeDialog = () => {
    onClose?.();
    onOpenChange?.(false);
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
      role="presentation"
      onMouseDown={closeDialog}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          "relative w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-950",
          className,
        )}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {!hideCloseButton && (
          <GlobalButton
            type="button"
            variant="ghost"
            size="icon"
            onClick={closeDialog}
            className="absolute right-3 top-3"
            aria-label="Close"
          >
            <X className="size-4" />
          </GlobalButton>
        )}

        <h1
          id={titleId}
          className={cn(
            "mb-5 pr-8 text-xl font-bold text-slate-950 dark:text-white",
            hideTitle && "sr-only",
          )}
        >
          {title}
        </h1>

        <div className={bodyClassName}>{children}</div>
      </section>
    </div>
  );
}

type GlobalFormModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  submittingLabel?: string;
  cancelLabel?: string;
  className?: string;
  bodyClassName?: string;
  footerClassName?: string;
};

export function GlobalFormModal({
  open,
  title,
  children,
  onOpenChange,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save",
  submittingLabel = "Saving...",
  cancelLabel = "Cancel",
  className,
  bodyClassName,
  footerClassName,
}: GlobalFormModalProps) {
  const closeModal = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <GlobalDialog
      open={open}
      title={title}
      onClose={closeModal}
      className={cn("max-w-[95vw] p-0 sm:max-w-[500px]", className)}
      hideCloseButton
      hideTitle
    >
      <div className="border-b px-4 py-3 sm:px-5 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-950 dark:text-white sm:text-[15px]">
            {title}
          </h2>
          <GlobalButton
            type="button"
            variant="ghost"
            size="icon"
            onClick={closeModal}
            className="cursor-pointer"
            aria-label="Close"
          >
            <X className="size-5" />
          </GlobalButton>
        </div>
      </div>

      <GlobalForm onSubmit={onSubmit} className="space-y-0">
        <div className={cn("space-y-4 px-4 py-4 sm:space-y-5 sm:px-5", bodyClassName)}>
          {children}
        </div>

        <GlobalFormActions
          className={cn(
            "border-t px-4 py-3 sm:px-5 sm:py-4",
            footerClassName,
          )}
        >
          <GlobalButton
            type="button"
            variant="outline"
            onClick={closeModal}
            className="h-10 w-28 rounded-lg sm:w-36"
          >
            {cancelLabel}
          </GlobalButton>
          <GlobalButton
            type="submit"
            disabled={isSubmitting}
            className="h-10 w-28 rounded-lg sm:w-36"
          >
            {isSubmitting ? submittingLabel : submitLabel}
          </GlobalButton>
        </GlobalFormActions>
      </GlobalForm>
    </GlobalDialog>
  );
}
