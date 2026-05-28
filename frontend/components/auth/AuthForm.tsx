"use client";

import { Controller, useForm } from "react-hook-form";
import type { AuthFormProps, AuthFormValues } from "@/features/auth/types/auth.types";
import AuthTabs from "./AuthTabs";
import { GlobalButton } from "@/global/button";
import { GlobalForm, GlobalFormMessage } from "@/global/form";
import { GlobalInput } from "@/global/input";

export default function AuthForm({
  mode,
  onModeChange,
  defaultValues,
  onSubmit,
  isBusy,
  message,
}: AuthFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    defaultValues: {
      username: defaultValues?.username ?? "",
      password: defaultValues?.password ?? "",
    },
  });

  return (
    <GlobalForm
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-lg border border-app-border bg-app-surface p-4 shadow-sm dark:border-app-border-dark dark:bg-app-surface-dark sm:p-6"
    >
      {onModeChange && (
        <AuthTabs mode={mode} onModeChange={onModeChange} />
      )}

      <Controller
        name="username"
        control={control}
        rules={{
          required: "Username must be at least 1 character",
        }}
        render={({ field }) => (
          <GlobalInput
            label="Username"
            type="text"
            placeholder="Enter username"
            className="h-11 focus:ring-2 focus:ring-app-primary-ring/20"
            error={errors.username?.message}
            {...field}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{
          required: "Password must be at least 1 characters",
        }}
        render={({ field }) => (
          <GlobalInput
            label="Password"
            type="password"
            placeholder="Enter password"
            className="h-11 focus:ring-2 focus:ring-app-primary-ring/20"
            error={errors.password?.message}
            {...field}
          />
        )}
      />

      <GlobalButton
        type="submit"
        disabled={isBusy}
        className="h-11 w-full text-sm font-bold"
      >
        {isBusy
          ? "Please wait..."
          : mode === "login"
            ? "Login"
            : "Register"}
      </GlobalButton>

      {message && (
        <GlobalFormMessage tone="success" className="mt-4">
          {message}
        </GlobalFormMessage>
      )}
    </GlobalForm>
  );
}
