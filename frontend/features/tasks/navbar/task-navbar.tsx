"use client";

import { LogOut } from "lucide-react";
import { ProfileInfo } from "./profile-info";
import { ThemeToggle } from "./theme-toggle";
import { TaskNavbarProps } from "../types/tasks.types";
import { GlobalButton } from "@/global/button";


export function TaskNavbar({ onLogout }: TaskNavbarProps) {
  return (
    <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="flex flex-2 items-center justify-between px-4 py-3 sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            Todo
          </p>
          <h1 className="text-xl font-bold text-slate-950 dark:text-white">
            Tasks
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ProfileInfo />
          <ThemeToggle />
          <GlobalButton
            type="button"
            variant="outline"
            size="icon"
            onClick={onLogout}
            className="size-10 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
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
