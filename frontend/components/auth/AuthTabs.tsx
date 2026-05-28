import { AuthTabsProps } from "@/features/auth/types/auth.types";
import { GlobalButton } from "@/global/button";

export default function AuthTabs({
  mode,
  onModeChange,
}: AuthTabsProps) {
  return (
    <div className="mb-5 grid grid-cols-2 rounded-md border border-[#d9dee5] bg-[#eef1f5] p-1">
      <GlobalButton
        type="button"
        variant="ghost"
        onClick={() => onModeChange("login")}
        className={`h-auto rounded px-3 py-2 text-sm font-semibold ${
          mode === "login"
            ? "bg-white text-[#1f2933] shadow-sm"
            : "text-[#647282]"
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
            ? "bg-white text-[#1f2933] shadow-sm"
            : "text-[#647282]"
        }`}
      >
        Register
      </GlobalButton>
    </div>
  );
}
