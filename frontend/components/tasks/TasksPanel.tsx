"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, MoreVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useAuthStore } from "@/store/auth-store";
import { GlobalTable, GlobalTableColumn } from "@/global/global-table";
import { TaskNavbar } from "@/features/tasks/navbar/task-navbar";
import TaskStats from "./TaskStats";
import { CustomPagination } from "@/global/global-pagination";
import { Task, TaskStatusFilter } from "@/features/tasks/types/tasks.types";
import { useTasksPanel } from "@/features/tasks/actions/tasks.action";
import { GlobalButton } from "@/global/button";
import { GlobalFormMessage } from "@/global/form";
import { GlobalInput, GlobalSelect } from "@/global/input";
import { TASK_SEARCH_DEBOUNCE_MS, taskQueryParams } from "@/global/query-params";
import useDebounce from "@/hooks/use-debounce";


const STATUS_OPTIONS: { label: string; value: TaskStatusFilter }[] = [
  { label: "All status",  value: "all" },
  { label: "Completed",   value: "completed" },
  { label: "Pending",     value: "pending" },
];

const LOGIN_ROUTE = "/login";
const TASK_CREATE_ROUTE = "/tasks/create";
const taskEditRoute = (id: number) => `/tasks/edit/${id}`;
const taskDeleteRoute = (id: number) => `/tasks/delete/${id}`;

export default function TasksPanel() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const [openActionId, setOpenActionId] = useState<number | null>(null);
  const [filters, setFilters] = useQueryStates(taskQueryParams, {
    shallow: true,
  });
  const { page, limit, search, status } = filters;
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, TASK_SEARCH_DEBOUNCE_MS);
  const {
    tasks,
    totalTasks,
    completedTasks,
    totalItems,
    totalPages,
    currentPage,
    isAuthenticated,
    fetching,
    message,
  } = useTasksPanel({
    page,
    limit,
    search,
    status,
  });

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch === search) return;
    setFilters({ search: debouncedSearch, page: 1 });
  }, [debouncedSearch, search, setFilters]);

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
      <div className="mx-auto mt-8 max-w-2xl rounded-lg border border-app-border bg-app-surface p-6 text-center shadow-sm dark:border-app-border-dark dark:bg-app-surface-dark">
        <p className="text-lg font-semibold text-app-text dark:text-app-text-dark">
          Please login to manage tasks.
        </p>
        <p className="mt-2 text-sm text-app-muted dark:text-app-muted-dark">
          Once you log in, your tasks will appear here.
        </p>
      </div>
    );
  }

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
        <span className={task.is_completed ? "text-app-placeholder line-through" : ""}>
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
              ? "bg-app-success-soft text-app-success dark:bg-app-success-soft-dark"
              : "bg-app-warning-soft text-app-warning dark:bg-app-warning-soft-dark"
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
            <div className="absolute right-0 top-9 z-10 w-36 rounded-md border border-app-border bg-app-surface p-1 text-left shadow-lg dark:border-app-border-dark dark:bg-app-surface-dark">
              <GlobalButton
                type="button"
                variant="ghost"
                onClick={() => router.push(taskEditRoute(task.id))}
                className="flex h-auto w-full justify-start rounded px-3 py-2 text-sm text-app-text dark:text-app-text-dark"
              >
                <Pencil className="size-4" /> Edit
              </GlobalButton>
              <GlobalButton
                type="button"
                variant="ghost"
                onClick={() => router.push(taskDeleteRoute(task.id))}
                className="flex h-auto w-full justify-start rounded px-3 py-2 text-sm text-app-danger hover:bg-app-danger-soft dark:hover:bg-app-danger-soft-dark"
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
      <TaskNavbar onLogout={() => { logout(); router.push(LOGIN_ROUTE); }} />

      <section className="w-full  py-5 sm:px-6 sm:py-6">
        <TaskStats total={totalTasks} completed={completedTasks} />

        <div className="mb-4 flex flex-col gap-3 rounded-lg border border-app-border bg-app-surface p-4 shadow-sm dark:border-app-border-dark dark:bg-app-surface-dark sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row">
            <GlobalInput
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by task name"
              leftIcon={<Search className="size-4" />}
              containerClassName="w-full sm:max-w-sm sm:flex-1"
            />

            <GlobalSelect
              value={status}
              onChange={(event) =>
                setFilters({
                  status: event.target.value as TaskStatusFilter,
                  page: 1,
                })
              }
              options={STATUS_OPTIONS}
              containerClassName="w-full sm:w-44"
              className="w-full"
            />
          </div>

          <GlobalButton
            type="button"
            onClick={() => router.push(TASK_CREATE_ROUTE)}
            className="w-full sm:w-auto"
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
          data={tasks}
          columns={columns}
          getRowKey={(task) => task.id}
          loading={fetching}
          emptyMessage="No tasks match your filters."
        />

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(nextPage) => setFilters({ page: nextPage })}
          itemsPerPage={limit}
          onItemsPerPageChange={(nextLimit) =>
            setFilters({ limit: nextLimit, page: 1 })
          }
          totalItems={totalItems}
        />
      </section>
    </>
  );
}
