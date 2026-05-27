"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../api/endpoints";
import Header from "../layout/Header";
import TaskStats from "./TaskStats";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { useTasks } from "../../hooks/useTasks";
import { useTodoStore } from "../../store/useTodoStore";

export default function TasksPanel() {
  const router = useRouter();
  const {
    tasks,
    taskInput,
    isAuthenticated,
    fetching,
    deleting,
    message,
    setTaskInput,
    handleAddTask,
    handleToggleTask,
    handleDeleteTask,
    refetch,
  } = useTasks();

  const { initializeAuth, logout } = useTodoStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  if (!isAuthenticated) {
    return (
      <div className="mt-8 rounded-xl border border-[#d9dee5] bg-white p-6 shadow-sm text-center">
        <p className="text-lg font-semibold">Please login to manage tasks.</p>
        <p className="mt-2 text-sm text-slate-600">
          Once you log in, your tasks will appear here.
        </p>
      </div>
    );
  }

  const total = tasks.length;
  const completed = tasks.filter((task) => task.is_completed).length;
  const handleLogout = () => {
    logout();
    router.push(ROUTES.login);
  };

  return (
    <section className="mt-8">
      <Header onLogout={handleLogout} />

      <TaskStats total={total} completed={completed} />

      <TaskForm value={taskInput} onChange={setTaskInput} onSubmit={handleAddTask} />

      {message && (
        <div className="mb-4 rounded-md bg-[#eef7f1] px-3 py-2 text-sm text-[#27563c]">
          {message}
        </div>
      )}

      {fetching && <p className="mb-4 text-sm text-slate-600">Loading tasks...</p>}
      {deleting && <p className="mb-4 text-sm text-slate-600">Deleting task...</p>}

      <TaskList tasks={tasks} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
    </section>
  );
}
