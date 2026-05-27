"use client";

import { useEffect } from "react";
import AuthPanel from "../../components/auth/AuthPanel";
import { useTodoStore } from "../../store/useTodoStore";

export default function LoginPage() {
  const setMode = useTodoStore((state) => state.setMode);

  useEffect(() => {
    setMode("login");
  }, [setMode]);

  return (
    <main className="min-h-screen bg-[#f6f7f9] p-6">
      <AuthPanel />
    </main>
  );
}
