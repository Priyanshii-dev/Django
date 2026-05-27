"use client";

import { create } from "zustand";
import { API_ENDPOINTS } from "../api/endpoints";
import { mapTokenPair } from "../api/mappers";
import { request } from "../lib/api";
import { saveTokens, clearTokens } from "../lib/auth";
import type { AuthMode, Task, TokenPair } from "../types";

interface TodoState {
  mode: AuthMode;
  username: string;
  password: string;
  taskInput: string;
  tasks: Task[];
  message: string;
  isBusy: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

interface TodoActions {
  setMode: (mode: AuthMode) => void;
  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  setTaskInput: (value: string) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (id: number) => void;
  setMessage: (message: string) => void;
  setIsBusy: (busy: boolean) => void;
  initializeAuth: () => void;
  login: () => Promise<boolean>;
  register: () => Promise<boolean>;
  logout: () => void;
}

export const useTodoStore = create<TodoState & TodoActions>((set, get) => ({
  mode: "login",
  username: "",
  password: "",
  taskInput: "",
  tasks: [],
  message: "",
  isBusy: false,
  accessToken: null,
  refreshToken: null,

  setMode: (mode) => set({ mode }),
  setUsername: (value) => set({ username: value }),
  setPassword: (value) => set({ password: value }),
  setTaskInput: (value) => set({ taskInput: value }),
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((item) =>
        item.id === task.id ? task : item,
      ),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  setMessage: (message) => set({ message }),
  setIsBusy: (busy) => set({ isBusy: busy }),

  initializeAuth: () => {
    if (typeof window === "undefined") {
      return;
    }

    const accessToken = window.localStorage.getItem("todo_access_token");
    const refreshToken = window.localStorage.getItem("todo_refresh_token");

    set({
      accessToken,
      refreshToken,
      message: accessToken ? "" : "Please login to continue",
    });
  },

  login: async () => {
    set({ isBusy: true, message: "" });

    try {
      const payload = {
        username: get().username,
        password: get().password,
      };

      const result = await request<TokenPair>(API_ENDPOINTS.auth.login, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const tokens = mapTokenPair(result);
      saveTokens(tokens.access, tokens.refresh);

      set({
        accessToken: tokens.access,
        refreshToken: tokens.refresh,
        message: "Login successful",
      });

      return true;
    } catch (err) {
      set({
        message:
          err instanceof Error
            ? err.message
            : "Unable to login. Please check credentials.",
      });
      return false;
    } finally {
      set({ isBusy: false });
    }
  },

  register: async () => {
    set({ isBusy: true, message: "" });

    try {
      const payload = {
        username: get().username,
        password: get().password,
      };

      const result = await request<TokenPair>(API_ENDPOINTS.auth.register, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const tokens = mapTokenPair(result);
      saveTokens(tokens.access, tokens.refresh);

      set({
        accessToken: tokens.access,
        refreshToken: tokens.refresh,
        message: "Registration successful",
      });

      return true;
    } catch (err) {
      set({
        message:
          err instanceof Error
            ? err.message
            : "Unable to register. Please try again.",
      });
      return false;
    } finally {
      set({ isBusy: false });
    }
  },

  logout: () => {
    clearTokens();
    set({
      accessToken: null,
      refreshToken: null,
      tasks: [],
      username: "",
      password: "",
      taskInput: "",
      message: "Logged out successfully",
    });
  },
}));
