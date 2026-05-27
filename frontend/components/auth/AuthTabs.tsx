import { AuthTabsProps } from "../../types";

export default function AuthTabs({
  mode,
  onModeChange,
}: AuthTabsProps) {
  return (
    <div className="mb-5 grid grid-cols-2 rounded-md border border-[#d9dee5] bg-[#eef1f5] p-1">
      <button
        type="button"
        onClick={() => onModeChange("login")}
        className={`rounded px-3 py-2 text-sm font-semibold transition ${
          mode === "login"
            ? "bg-white text-[#1f2933] shadow-sm"
            : "text-[#647282]"
        }`}
      >
        Login
      </button>

      <button
        type="button"
        onClick={() => onModeChange("register")}
        className={`rounded px-3 py-2 text-sm font-semibold transition ${
          mode === "register"
            ? "bg-white text-[#1f2933] shadow-sm"
            : "text-[#647282]"
        }`}
      >
        Register
      </button>
    </div>
  );
}