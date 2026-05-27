import { HeaderProps } from "../../types";


export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className="mb-6 flex items-center justify-between border-b pb-5">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
          Todo
        </p>
        <h1 className="mt-2 text-3xl font-bold">Tasks</h1>
      </div>

      <button
        onClick={onLogout}
        className="h-10 rounded-md border bg-white px-4 text-sm font-semibold"
      >
        Logout
      </button>
    </header>
  );
}