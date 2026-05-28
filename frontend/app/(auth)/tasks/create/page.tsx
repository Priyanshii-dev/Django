"use client";
import TasksPanel from "@/components/tasks/TasksPanel";
import { useTaskFormAction } from "@/features/tasks/actions/tasks.action";
import TaskForm from "@/features/tasks/TaskForm";

export default function CreateTaskPage() {
  const { isLoading, isSubmitting, message, goBack, submitTask } =
    useTaskFormAction("create");

  return (
    <main className="min-h-screen bg-app-bg dark:bg-app-bg-dark">
      <TasksPanel />
      <TaskForm
        mode="create"
        task=""
        isCompleted={false}
        loading={isLoading}
        submitting={isSubmitting}
        message={message}
        onBack={goBack}
        onSubmit={submitTask}
      />
    </main>
  );
}
