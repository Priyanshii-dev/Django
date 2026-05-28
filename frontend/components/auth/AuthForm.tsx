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
      className="rounded-xl border border-[#d9dee5] bg-white p-6 shadow-sm"
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
            className="h-11 border-[#cfd6df] focus:border-[#3f7d58] focus:ring-2 focus:ring-[#3f7d58]/20"
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
            className="h-11 border-[#cfd6df] focus:border-[#3f7d58] focus:ring-2 focus:ring-[#3f7d58]/20"
            error={errors.password?.message}
            {...field}
          />
        )}
      />

      <GlobalButton
        type="submit"
        disabled={isBusy}
        className="h-11 w-full bg-[#2f6f4e] text-sm font-bold hover:bg-[#255a40]"
      >
        {isBusy
          ? "Please wait..."
          : mode === "login"
            ? "Login"
            : "Register"}
      </GlobalButton>

      {message && (
        <GlobalFormMessage tone="success" className="mt-4 bg-[#eef7f1] text-[#27563c]">
          {message}
        </GlobalFormMessage>
      )}
    </GlobalForm>
  );
}
