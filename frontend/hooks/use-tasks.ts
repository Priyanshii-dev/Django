"use client";

import { useState } from "react";
import { API_ENDPOINTS } from "../api/endpoints";
import { mapTask } from "../api/mappers";
import { useTodoStore } from "../store/todo-store";
import { useAuthStore } from "../store/auth-store";
import { taskSchema } from "../lib/schemas";
import { request } from "../lib/api";
import { Task } from "@/features/tasks/types/tasks.types";

export function useTasks() {
  const {
    tasks,
    taskInput,
    setTaskInput,
    setTasks,
    addTask,
    updateTask,
    removeTask,
    message,
    setMessage,
  } = useTodoStore();

  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = Boolean(accessToken);

  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function refetch() {
    if (!isAuthenticated) return;

    setFetching(true);
    setFetchError(null);

    try {
      const data = await request<Task[]>(API_ENDPOINTS.tasks.list);
      setTasks(data.map(mapTask));
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : "Unable to load tasks.");
    } finally {
      setFetching(false);
    }
  }

  async function handleAddTask(completed = false) {
    setMessage("");

    const validation = taskSchema.safeParse({ task: taskInput });

    if (!validation.success) {
      setMessage(validation.error.issues.map((i) => i.message).join(" "));
      return false;
    }

    try {
      const newTask = await request<Task>(API_ENDPOINTS.tasks.create, {
        method: "POST",
        body: JSON.stringify({ task: validation.data.task, is_completed: completed }),
      });

      addTask(mapTask(newTask));
      setTaskInput("");
      return true;
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to create task.");
      return false;
    }
  }

  async function handleUpdateTask(task: Task, values: { task: string; is_completed: boolean }) {
    setMessage("");

    const validation = taskSchema.safeParse({ task: values.task });

    if (!validation.success) {
      setMessage(validation.error.issues.map((i) => i.message).join(" "));
      return false;
    }

    setUpdating(true);

    try {
      const updatedTask = await request<Task>(API_ENDPOINTS.tasks.edit(task.id), {
        method: "PATCH",
        body: JSON.stringify({ task: validation.data.task, is_completed: values.is_completed }),
      });

      updateTask(mapTask(updatedTask));
      return true;
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to update task.");
      return false;
    } finally {
      setUpdating(false);
    }
  }

  async function handleToggleTask(task: Task) {
    setMessage("");

    try {
      await request(API_ENDPOINTS.tasks.toggle(task.id), { method: "POST" });
      updateTask({ ...task, is_completed: !task.is_completed });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to toggle task.");
    }
  }

  async function handleDeleteTask(id: number) {
    setMessage("");
    setDeletingId(id);

    try {
      await request(API_ENDPOINTS.tasks.delete(id), { method: "DELETE" });
      removeTask(id);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to delete task.");
    } finally {
      setDeletingId(null);
    }
  }

  return {
    tasks,
    taskInput,
    isAuthenticated,
    fetching,
    updating,
    deleting: deletingId !== null,
    deletingId,
    fetchError,
    message: fetchError || message,
    setTaskInput,
    handleAddTask,
    handleUpdateTask,
    handleToggleTask,
    handleDeleteTask,
    refetch,
  };
}
