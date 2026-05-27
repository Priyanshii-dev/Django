"use client";

import { FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "../api/endpoints";
import { authSchema } from "../lib/schemas";
import { useTodoStore } from "../store/useTodoStore";

export function useAuth() {
  const router = useRouter();
  const {
    mode,
    username,
    password,
    message,
    isBusy,
    accessToken,
    setMode,
    setUsername,
    setPassword,
    setMessage,
    login,
    register,
    logout,
  } = useTodoStore();

  const isAuthenticated = Boolean(accessToken);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setMessage("");

      const validation = authSchema.safeParse({ username, password });

      if (!validation.success) {
        setMessage(
          validation.error.issues.map((issue) => issue.message).join(" "),
        );
        return;
      }

      const success =
        mode === "login" ? await login() : await register();

      if (success) {
        const nextPath =
          typeof window === "undefined"
            ? null
            : new URLSearchParams(window.location.search).get("next");

        router.push(
          nextPath?.startsWith("/") && !nextPath.startsWith("//")
            ? nextPath
            : ROUTES.tasks,
        );
      }
    },
    [
      login,
      mode,
      password,
      register,
      router,
      setMessage,
      username,
    ],
  );

  return {
    mode,
    username,
    password,
    message,
    isBusy,
    isAuthenticated,
    setMode,
    setUsername,
    setPassword,
    onSubmit: handleSubmit,
    logout,
  };
}
