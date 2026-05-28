"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { TaskFormMode, TaskFormValues } from "../TaskForm";
import { useTodoStore } from "@/store/todo-store";
import { useFetchData } from "@/api/hooks/useFetch";

import { API_ENDPOINTS } from "@/api/endpoints";
import { mapTask } from "@/api/mappers";
import usePostData from "@/api/hooks/usePost";
import usePutData from "@/api/hooks/use-put";
import useDeleteData from "@/api/hooks/use-delete";
import instance from "@/api/instance";
import { taskSchema } from "@/lib/schemas";
import { Task, TaskTableParams, TaskTableResponse } from "../types/tasks.types";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

const TASKS_ROUTE = "/tasks";

// Task Pannel
export function useTasksPanel(params: TaskTableParams) {
  const message  = useTodoStore((s) => s.message);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = Boolean(accessToken);

  const {
    isLoading: fetching,
    refetch,
    data,
  } = useQuery<TaskTableResponse>({
    queryKey: [API_ENDPOINTS.tasks.list, params],
    enabled: isAuthenticated,
    queryFn: async () => {
      const requestParams = {
        page: params.page,
        limit: params.limit,
        ...(params.search.trim() ? { search: params.search.trim() } : {}),
        ...(params.status !== "all" ? { status: params.status } : {}),
      };

      const response = await instance.get<{
        data: TaskTableResponse;
      }>(API_ENDPOINTS.tasks.list, {
        params: requestParams,
      });

      return response.data.data;
    },
    select: (raw) => ({
      ...raw,
      results: raw.results.map(mapTask),
    }),
    refetchOnWindowFocus: false,
  });

  return {
    tasks: data?.results ?? [],
    totalTasks: data?.totalTasks ?? 0,
    completedTasks: data?.completedTasks ?? 0,
    totalItems: data?.total ?? 0,
    totalPages: data?.totalPages ?? 1,
    currentPage: data?.page ?? params.page,
    isAuthenticated,
    fetching,
    message,
    refetch,
  };
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
    url: API_ENDPOINTS.tasks.create,
    showToast: true,
    onSuccess: (data) => {
      addTask(mapTask(data));
      router.push(TASKS_ROUTE);
    },
  });

  // Edit 
  const { mutateAsync: editTask, isPending: isEditing } = usePutData<Partial<Task>, Task>({
  url: API_ENDPOINTS.tasks.edit(Number(taskId)),
  mutationOptions: {
    onSuccess: (data) => {
      updateTask(mapTask(data));
      router.push(TASKS_ROUTE);
    },
  },
});

  // Delete
  const { mutateAsync: destroyTask, isPending: isDeleting } = useDeleteData<Task>({
    url: API_ENDPOINTS.tasks.delete(Number(taskId)),
    mutationOptions: {
      onSuccess: () => {
        removeTask(Number(taskId));
        router.push(TASKS_ROUTE);
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
    goBack:       () => router.push(TASKS_ROUTE),
    submitTask,
    deleteTask,
  };
}
