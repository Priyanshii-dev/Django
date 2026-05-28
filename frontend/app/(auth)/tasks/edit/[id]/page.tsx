"use client";

import TasksPanel from "@/components/tasks/TasksPanel";
import { useTaskFormAction } from "@/features/tasks/actions/tasks.action";

import TaskForm from "@/features/tasks/TaskForm";

export default function EditTaskPage() {
  const { task: fetchedTask, isCompleted: fetchedCompleted, isLoading, isSubmitting, message, goBack, submitTask } =
    useTaskFormAction("edit");

  return (
    <main className="min-h-screen bg-app-bg dark:bg-app-bg-dark">
      <TasksPanel />
      <TaskForm
        mode="edit"
        task={fetchedTask}
        isCompleted={fetchedCompleted}
        loading={isLoading}
        submitting={isSubmitting}
        message={message}
        onBack={goBack}
        onSubmit={submitTask}
      />
    </main>
  );
}
