"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Save, Trash2 } from "lucide-react";
import { GlobalButton } from "@/global/button";
import { GlobalDialog } from "@/global/dialog";
import { GlobalForm, GlobalFormActions, GlobalFormMessage } from "@/global/form";
import { GlobalCheckbox, GlobalInput } from "@/global/input";

export type TaskFormMode = "create" | "edit" | "delete";

export type TaskFormValues = {
  task: string;
  isCompleted: boolean;
};

type TaskFormProps = {
  mode: TaskFormMode;
  task: string;
  isCompleted: boolean;
  loading?: boolean;
  submitting?: boolean;
  message?: string;
  onBack: () => void;
  onSubmit?: (values: TaskFormValues) => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
};

const modeCopy = {
  create: { title: "Create task", submitLabel: "Create", loadingLabel: "Creating", icon: Plus },
  edit:   { title: "Edit task",   submitLabel: "Save",   loadingLabel: "Saving",   icon: Save },
  delete: { title: "Delete task", submitLabel: "Delete", loadingLabel: "Deleting", icon: Trash2 },
} as const;

export default function TaskForm({
  mode,
  task,
  isCompleted,
  loading = false,
  submitting = false,
  message = "",
  onBack,
  onSubmit,
  onDelete,
}: TaskFormProps) {
  const copy = modeCopy[mode];
  const ActionIcon = copy.icon;
  const isDeleteMode = mode === "delete";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    defaultValues: { task, isCompleted },
  });

  useEffect(() => {
    reset({ task, isCompleted });
  }, [isCompleted, reset, task]);

  function submitForm(values: TaskFormValues) {
    if (isDeleteMode) {
      onDelete?.();
      return;
    }
    onSubmit?.(values);
  }

  return (
    <GlobalDialog title={copy.title} onClose={onBack}>
      {message && (
        <GlobalFormMessage className="mb-4">
          {message}
        </GlobalFormMessage>
      )}

      {loading ? (
        <p className="text-sm text-app-muted dark:text-app-muted-dark">Loading task...</p>
      ) : (
        <GlobalForm onSubmit={handleSubmit(submitForm)}>
          {isDeleteMode ? (
            <p className="text-sm text-app-muted dark:text-app-muted-dark">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-app-text dark:text-app-text-dark">
                {task || "this task"}
              </span>
              ?
            </p>
          ) : (
            <>
              <GlobalInput
                label="Task name"
                autoFocus
                error={errors.task?.message}
                {...register("task", { required: "Task text is required" })}
              />

              <GlobalCheckbox
                label="Task completed"
                {...register("isCompleted")}
              />
            </>
          )}

          <GlobalFormActions>
            <GlobalButton
              type="button"
              variant="outline"
              onClick={onBack}
              className="w-full sm:w-auto"
            >
              Cancel
            </GlobalButton>

            <GlobalButton
              type="submit"
              disabled={submitting}
              variant={isDeleteMode ? "danger" : "primary"}
              className="w-full sm:w-auto"
            >
              <ActionIcon className="size-4" />
              {submitting ? copy.loadingLabel : copy.submitLabel}
            </GlobalButton>
          </GlobalFormActions>
        </GlobalForm>
      )}
    </GlobalDialog>
  );
}
