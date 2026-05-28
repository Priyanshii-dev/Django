"use client";

import { LogOut } from "lucide-react";
import { ProfileInfo } from "./profile-info";
import { ThemeToggle } from "./theme-toggle";
import { TaskNavbarProps } from "../types/tasks.types";
import { GlobalButton } from "@/global/button";


export function TaskNavbar({ onLogout }: TaskNavbarProps) {
  return (
    <nav className="sticky top-0 z-20 border-b border-app-border bg-app-surface/95 backdrop-blur dark:border-app-border-dark dark:bg-app-surface-dark/95">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-app-success">
            Todo
          </p>
          <h1 className="truncate text-xl font-bold text-app-text dark:text-app-text-dark">
            Tasks
          </h1>
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <ProfileInfo />
          <ThemeToggle />
          <GlobalButton
            type="button"
            variant="outline"
            size="icon"
            onClick={onLogout}
            className="size-10 text-app-danger hover:bg-app-danger-soft dark:hover:bg-app-danger-soft-dark"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="size-4" />
          </GlobalButton>
        </div>
      </div>
    </nav>
  );
}
