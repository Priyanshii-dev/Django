"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MoreVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/auth-store";
import { GlobalTable, GlobalTableColumn } from "@/global/global-table";
import { ROUTES } from "@/api/endpoints";
import { TaskNavbar } from "@/features/tasks/navbar/task-navbar";
import TaskStats from "./TaskStats";
import { CustomPagination } from "@/global/global-pagination";
import { Task, TaskStatusFilter } from "@/features/tasks/types/tasks.types";
import { useTasksPanel } from "@/features/tasks/actions/tasks.action";
import { GlobalButton } from "@/global/button";
import { GlobalFormMessage } from "@/global/form";
import { GlobalInput, GlobalSelect } from "@/global/input";


const STATUS_OPTIONS: { label: string; value: TaskStatusFilter }[] = [
  { label: "All status",  value: "all" },
  { label: "Completed",   value: "completed" },
  { label: "Pending",     value: "pending" },
];

const STATUS_FILTER: Record<TaskStatusFilter, (t: Task) => boolean> = {
  all:       () => true,
  completed: (t) => t.is_completed,
  pending:   (t) => !t.is_completed,
};

type TaskFilterValues = {
  search: string;
  status: TaskStatusFilter;
};

export default function TasksPanel() {
  const router = useRouter();
  const { tasks, isAuthenticated, fetching, message } = useTasksPanel();
  const logout = useAuthStore((state) => state.logout);

  const [page, setPage]               = useState(1);
  const [pageSize, setPageSize]       = useState(5);
  const [openActionId, setOpenActionId] = useState<number | null>(null);

  const { register, watch } = useForm<TaskFilterValues>({
    defaultValues: {
      search: "",
      status: "all",
    },
  });
  const { search, status } = watch();

  useEffect(() => {
    setPage(1);
  }, [search, status, pageSize]);

  useEffect(() => {
    if (openActionId === null) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-action-menu]")) {
        setOpenActionId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openActionId]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <p className="text-lg font-semibold text-slate-950 dark:text-white">
          Please login to manage tasks.
        </p>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Once you log in, your tasks will appear here.
        </p>
      </div>
    );
  }

  const normalizedSearch = search.trim().toLowerCase();
  const filteredTasks = tasks.filter(
    (t) => t.task.toLowerCase().includes(normalizedSearch) && STATUS_FILTER[status](t)
  );

  const totalPages    = Math.max(1, Math.ceil(filteredTasks.length / pageSize));
  const currentPage   = Math.min(page, totalPages);
  const paginatedTasks = filteredTasks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const total     = tasks.length;
  const completed = tasks.filter((t) => t.is_completed).length;

  const columns: GlobalTableColumn<Task>[] = [
    {
      key: "id",
      header: "Task ID",
      className: "w-28",
      render: (task) => <span className="font-medium">#{task.task_number}</span>,
    },
    {
      key: "task",
      header: "Name",
      render: (task) => (
        <span className={task.is_completed ? "text-slate-400 line-through" : ""}>
          {task.task}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      className: "w-40",
      render: (task) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            task.is_completed
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
          }`}
        >
          {task.is_completed && <CheckCircle2 className="size-3.5" />}
          {task.is_completed ? "Completed" : "Pending"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-28 text-right",
      render: (task) => (
        <div className="relative flex justify-end" data-action-menu>
          <GlobalButton
            type="button"
            onClick={() => setOpenActionId((cur) => (cur === task.id ? null : task.id))}
            variant="outline"
            size="icon"
            aria-label={`Open actions for task ${task.id}`}
          >
            <MoreVertical className="size-4" />
          </GlobalButton>

          {openActionId === task.id && (
            <div className="absolute right-0 top-9 z-10 w-36 rounded-md border border-slate-200 bg-white p-1 text-left shadow-lg dark:border-slate-800 dark:bg-slate-950">
              <GlobalButton
                type="button"
                variant="ghost"
                onClick={() => router.push(ROUTES.taskEdit(task.id))}
                className="flex h-auto w-full justify-start rounded px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
              >
                <Pencil className="size-4" /> Edit
              </GlobalButton>
              <GlobalButton
                type="button"
                variant="ghost"
                onClick={() => router.push(ROUTES.taskDelete(task.id))}
                className="flex h-auto w-full justify-start rounded px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 className="size-4" /> Delete
              </GlobalButton>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <TaskNavbar onLogout={() => { logout(); router.push(ROUTES.login); }} />

      <section className="px-4 py-6 sm:px-6">
        <TaskStats total={total} completed={completed} />

        <div className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <GlobalInput
              placeholder="Search by task name"
              leftIcon={<Search className="size-4" />}
              containerClassName="sm:max-w-sm sm:flex-1"
              {...register("search")}
            />

            <GlobalSelect
              options={STATUS_OPTIONS}
              containerClassName="sm:w-44"
              className="w-full"
              {...register("status")}
            />
          </div>

          <GlobalButton
            type="button"
            onClick={() => router.push(ROUTES.taskCreate)}
          >
            <Plus className="size-4" /> Add Task
          </GlobalButton>
        </div>

        {message && (
          <GlobalFormMessage tone="success" className="mb-4">
            {message}
          </GlobalFormMessage>
        )}

        <GlobalTable
          data={paginatedTasks}
          columns={columns}
          getRowKey={(task) => task.id}
          loading={fetching}
          emptyMessage="No tasks match your filters."
        />

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          itemsPerPage={pageSize}
          onItemsPerPageChange={setPageSize}
          totalItems={filteredTasks.length}
        />
      </section>
    </>
  );
}
