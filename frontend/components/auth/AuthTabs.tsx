import { AuthTabsProps } from "@/features/auth/types/auth.types";
import { GlobalButton } from "@/global/button";

export default function AuthTabs({
  mode,
  onModeChange,
}: AuthTabsProps) {
  return (
    <div className="mb-5 grid grid-cols-2 rounded-md border border-app-border bg-app-surface-muted p-1 dark:border-app-border-dark dark:bg-app-surface-muted-dark">
      <GlobalButton
        type="button"
        variant="ghost"
        onClick={() => onModeChange("login")}
        className={`h-auto rounded px-3 py-2 text-sm font-semibold ${
          mode === "login"
            ? "bg-app-surface text-app-text shadow-sm dark:bg-app-surface-dark dark:text-app-text-dark"
            : "text-app-muted dark:text-app-muted-dark"
        }`}
      >
        Login
      </GlobalButton>

      <GlobalButton
        type="button"
        variant="ghost"
        onClick={() => onModeChange("register")}
        className={`h-auto rounded px-3 py-2 text-sm font-semibold ${
          mode === "register"
            ? "bg-app-surface text-app-text shadow-sm dark:bg-app-surface-dark dark:text-app-text-dark"
            : "text-app-muted dark:text-app-muted-dark"
        }`}
      >
        Register
      </GlobalButton>
    </div>
  );
}
