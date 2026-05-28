"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TaskFormMode, TaskFormValues } from "../TaskForm";
import { useTodoStore } from "@/store/todo-store";
import { useFetchData } from "@/api/hooks/useFetch";

import { API_ENDPOINTS, ROUTES } from "@/api/endpoints";
import { mapTask } from "@/api/mappers";
import usePostData from "@/api/hooks/usePost";
import usePutData from "@/api/hooks/use-put";
import useDeleteData from "@/api/hooks/use-delete";
import { taskSchema } from "@/lib/schemas";
import { Task } from "../types/tasks.types";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

// Task Pannel
  export function useTasksPanel() {
  const message  = useTodoStore((s) => s.message);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = Boolean(accessToken);

  const { isLoading: fetching, refetch, data: tasks = [] } = useFetchData<Task[]>({
    url: API_ENDPOINTS.tasks.list,
    enabled: isAuthenticated,           
    queryOptions: {
      select: (raw) => raw.map(mapTask),
    },
  });

  return { tasks, isAuthenticated, fetching, message, refetch };
}

export function useTaskFormAction(mode: TaskFormMode) {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const taskId = params.id ?? "";

  const addTask    = useTodoStore((s) => s.addTask);
  const updateTask = useTodoStore((s) => s.updateTask);
  const removeTask = useTodoStore((s) => s.removeTask);

  const [message, setMessage] = useState("");

  const needsTask = mode === "edit" || mode === "delete";

  // Fetch
  const { data: rawTask, isLoading } = useFetchData<Task>({
    url: API_ENDPOINTS.tasks.detail(Number(taskId)),
    enabled: needsTask && !!taskId,
  });

  const fetchedTask = rawTask ? mapTask(rawTask) : null;

  //  Create
  const { mutateAsync: createTask, isPending: isCreating } = usePostData<Task, Partial<Task>>({
    url: API_ENDPOINTS.tasks.list,
    showToast: true,
    onSuccess: (data) => {
      addTask(mapTask(data));
      router.push(ROUTES.tasks);
    },
  });

  // Edit 
  const { mutateAsync: editTask, isPending: isEditing } = usePutData<Partial<Task>, Task>({
  url: API_ENDPOINTS.tasks.edit(Number(taskId)),
  mutationOptions: {
    onSuccess: (data) => {
      updateTask(mapTask(data));
      router.push(ROUTES.tasks);
    },
  },
});

  // Delete
  const { mutateAsync: destroyTask, isPending: isDeleting } = useDeleteData<Task>({
    url: API_ENDPOINTS.tasks.delete(Number(taskId)),
    mutationOptions: {
      onSuccess: () => {
        removeTask(Number(taskId));
        router.push(ROUTES.tasks);
      },
    },
  });


  // Handlers
  async function submitTask(values: TaskFormValues) {
    setMessage("");

    const validation = taskSchema.safeParse({ task: values.task });
    if (!validation.success) {
      const message = validation.error.issues.map((i) => i.message).join(" ");
      setMessage(message);
      toast.error(message);
      return;
    }

    try {
      if (mode === "create") {
        await createTask({ task: validation.data.task, is_completed: values.isCompleted });
      }
      if (mode === "edit") {
        await editTask({ payload: { task: validation.data.task, is_completed: values.isCompleted },});
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : `Unable to ${mode} task.`;
      setMessage(message);
      toast.error(message);
    }
  }

  async function deleteTask() {
    setMessage("");
    try {
      await destroyTask("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete task.";
      setMessage(message);
      toast.error(message);
    }
  }

  return {
    task:         fetchedTask?.task        ?? "",
    isCompleted:  fetchedTask?.is_completed ?? false,
    isLoading:    needsTask && isLoading,
    isSubmitting: isCreating || isEditing || isDeleting,
    message,
    goBack:       () => router.push(ROUTES.tasks),
    submitTask,
    deleteTask,
  };
}
