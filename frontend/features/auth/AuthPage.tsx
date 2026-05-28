"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthFormValues, AuthMode, AuthPageProps } from "./types/auth.types";
import { useAuthStore } from "@/store/auth-store";
import { ROUTES } from "@/api/endpoints";
import { authSchema } from "@/lib/schemas";
import AuthForm from "@/components/auth/AuthForm";
import { toast } from "sonner";


export default function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const {
    username,
    login,
    register,
    isBusy,
    message,
    setMessage,
    accessToken,
    clearAuth,
  } = useAuthStore();

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const hasAuthCookie = document.cookie
      .split("; ")
      .some((cookie) => cookie.startsWith("accessToken="));

    if (hasAuthCookie) {
      router.replace(ROUTES.tasks);
      return;
    }

    clearAuth();
  }, [accessToken, clearAuth, router]);

  function handleModeChange(nextMode: AuthMode) {
    router.push(nextMode === "login" ? ROUTES.login : ROUTES.register);
  }

  async function handleSubmit(values: AuthFormValues) {
    setMessage("");

    const validation = authSchema.safeParse(values);

    if (!validation.success) {
      const message = validation.error.issues
        .map((issue) => issue.message)
        .join(" ");

      setMessage(message);
      toast.error(message);
      return;
    }

    const success =
      mode === "login"
        ? await login(validation.data)
        : await register(validation.data);

    if (success) {
      router.push(ROUTES.tasks);
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <AuthForm
        mode={mode}
        onModeChange={handleModeChange}
        defaultValues={{ username }}
        onSubmit={handleSubmit}
        isBusy={isBusy}
        message={message}
      />
    </div>
  );
}
