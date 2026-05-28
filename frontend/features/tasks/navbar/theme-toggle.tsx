"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { GlobalButton } from "@/global/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("todo-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextIsDark = savedTheme ? savedTheme === "dark" : prefersDark;

    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    document.documentElement.classList.toggle("dark", nextIsDark);
    window.localStorage.setItem("todo-theme", nextIsDark ? "dark" : "light");
  };

  return (
    <GlobalButton
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="size-10 text-app-text dark:text-app-text-dark"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </GlobalButton>
  );
}
