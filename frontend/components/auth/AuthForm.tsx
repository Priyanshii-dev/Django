"use client";

import AuthTabs from "./AuthTabs";
import { AuthFormProps } from "../../types";

export default function AuthForm({
  mode,
  onModeChange,
  username,
  setUsername,
  password,
  setPassword,
  onSubmit,
  isBusy,
  message,
}: AuthFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-[#d9dee5] bg-white p-6 shadow-sm"
    >
<AuthTabs mode={mode} onModeChange={onModeChange} />

      <div className="mb-4">
        <label
          htmlFor="username"
          className="mb-2 block text-sm font-semibold text-[#1f2933]"
        >
          Username
        </label>

        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="h-11 w-full rounded-md border border-[#cfd6df] px-3 outline-none transition focus:border-[#3f7d58] focus:ring-2 focus:ring-[#3f7d58]/20"
          placeholder="Enter username"
          required
        />
      </div>

      <div className="mb-5">
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-semibold text-[#1f2933]"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-11 w-full rounded-md border border-[#cfd6df] px-3 outline-none transition focus:border-[#3f7d58] focus:ring-2 focus:ring-[#3f7d58]/20"
          placeholder="Enter password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isBusy}
        className="h-11 w-full rounded-md bg-[#2f6f4e] px-4 text-sm font-bold text-white transition hover:bg-[#255a40] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isBusy
          ? "Please wait..."
          : mode === "login"
          ? "Login"
          : "Register"}
      </button>

      {message && (
        <p className="mt-4 rounded-md bg-[#eef7f1] px-3 py-2 text-sm text-[#27563c]">
          {message}
        </p>
      )}
    </form>
  );
}