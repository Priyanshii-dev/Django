"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "../../api/endpoints";
import AuthForm from "./AuthForm";
import { useAuth } from "../../hooks/useAuth";
import { useTodoStore } from "../../store/useTodoStore";

export default function AuthPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const { initializeAuth } = useTodoStore();
  const {
    mode,
    setMode,
    username,
    setUsername,
    password,
    setPassword,
    onSubmit,
    isBusy,
    message,
    isAuthenticated,
    logout,
  } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (pathname === "/login") {
      setMode("login");
    } else if (pathname === "/register") {
      setMode("register");
    }
  }, [pathname, setMode]);

  const handleModeChange = useCallback(
    (nextMode: "login" | "register") => {
      setMode(nextMode);
      router.push(nextMode === "login" ? ROUTES.login : ROUTES.register);
    },
    [router, setMode],
  );

  const handleLogout = useCallback(() => {
    logout();
    router.push(ROUTES.login);
  }, [logout, router]);

  return (
    <div className="mx-auto max-w-md">
      {isAuthenticated ? (
        <div className="rounded-xl border border-[#d9dee5] bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
            Logged in
          </p>
          <p className="mt-3 text-sm text-slate-600">
            You are authenticated. Use the task area below or logout.
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 h-11 w-full rounded-md border border-[#cfd6df] bg-white text-sm font-semibold transition hover:bg-[#f6f7f9]"
          >
            Logout
          </button>
          {message && (
            <p className="mt-4 rounded-md bg-[#eef7f1] px-3 py-2 text-sm text-[#27563c]">
              {message}
            </p>
          )}
        </div>
      ) : (
        <AuthForm
          mode={mode}
          onModeChange={handleModeChange}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          onSubmit={onSubmit}
          isBusy={isBusy}
          message={message}
        />
      )}
    </div>
  );
}
