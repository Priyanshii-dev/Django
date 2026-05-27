"use client";

import { useCallback, useEffect } from "react";
import { API_ENDPOINTS } from "../api/endpoints";
import { mapTask } from "../api/mappers";
import { useTodoStore } from "../store/useTodoStore";
import { taskSchema } from "../lib/schemas";
import { request } from "../lib/api";
import { useFetch } from "../api/hooks/useFetch";
import { useDelete } from "../api/hooks/useDelete";
import type { Task } from "../types";

export function useTasks() {
  const {
    tasks,
    taskInput,
    accessToken,
    setTaskInput,
    setTasks,
    addTask,
    updateTask,
    removeTask,
    message,
    setMessage,
  } = useTodoStore();

  const isAuthenticated = Boolean(accessToken);

  const { data, loading: fetching, error: fetchError, refetch } = useFetch<Task[]>(
    API_ENDPOINTS.tasks.list,
    { method: "GET" },
    [isAuthenticated],
    isAuthenticated,
  );

  const { execute: deleteRequest, loading: deleting, error: deleteError } =
    useDelete();

  useEffect(() => {
    if (data) {
      setTasks(data.map(mapTask));
    }
  }, [data, setTasks]);

  const handleAddTask = useCallback(async () => {
    setMessage("");

    const validation = taskSchema.safeParse({ task: taskInput });

    if (!validation.success) {
      setMessage(
        validation.error.issues.map((issue) => issue.message).join(" "),
      );
      return;
    }

    try {
      const newTask = await request<Task>(API_ENDPOINTS.tasks.list, {
        method: "POST",
        body: JSON.stringify({ task: validation.data.task }),
      });

      addTask(mapTask(newTask));
      setTaskInput("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to create task.");
    }
  }, [addTask, setMessage, setTaskInput, taskInput]);

  const handleToggleTask = useCallback(
    async (task: Task) => {
      setMessage("");

      try {
        await request(API_ENDPOINTS.tasks.toggle(task.id), {
          method: "POST",
        });

        updateTask({ ...task, is_completed: !task.is_completed });
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Unable to toggle task.");
      }
    },
    [updateTask, setMessage],
  );

  const handleDeleteTask = useCallback(
    async (id: number) => {
      setMessage("");

      try {
        await deleteRequest(API_ENDPOINTS.tasks.detail(id));
        removeTask(id);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Unable to delete task.");
      }
    },
    [deleteRequest, removeTask, setMessage],
  );

  return {
    tasks,
    taskInput,
    isAuthenticated,
    fetching,
    deleting,
    fetchError,
    deleteError,
    message: fetchError || deleteError || message,
    setTaskInput,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    refetch,
  };
}
