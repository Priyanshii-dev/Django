"use client";

import { User } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export function ProfileInfo() {
  const displayName = useAuthStore((state) => state.loggedInUsername) || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
        {initial || <User className="size-4" />}
      </div>
      <div className="hidden leading-tight sm:block">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {displayName}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Task workspace
        </p>
      </div>
    </div>
  );
}