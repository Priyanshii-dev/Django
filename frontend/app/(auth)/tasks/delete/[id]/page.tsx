"use client";
import TasksPanel from "@/components/tasks/TasksPanel";
import { useTaskFormAction } from "@/features/tasks/actions/tasks.action";
import TaskForm from "@/features/tasks/TaskForm";


export default function DeleteTaskPage() {
  const { task, isLoading, isSubmitting, message, goBack, deleteTask } =
    useTaskFormAction("delete");
 
  return (
    <main className="min-h-screen bg-app-bg dark:bg-app-bg-dark">
      <TasksPanel />
      <TaskForm
        mode="delete"
        task={task}
        isCompleted={false}
        loading={isLoading}
        submitting={isSubmitting}
        message={message}
        onBack={goBack}
        onDelete={deleteTask}
      />
    </main>
  );
}
