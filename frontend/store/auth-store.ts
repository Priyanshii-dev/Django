"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { API_ENDPOINTS } from "../api/endpoints";
import { mapTokenPair } from "../api/mappers";
import { request } from "../lib/api";
import { clearTokens, saveTokens } from "../lib/auth";
import { AuthResponse } from "../types";

type AuthCredentials = {
  username: string;
  password: string;
};

interface AuthState {
  username: string;
  password: string;
  loggedInUsername: string;

  accessToken: string | null;
  refreshToken: string | null;

  isBusy: boolean;
  message: string;

  setUsername: (value: string) => void;
  setPassword: (value: string) => void;
  setMessage: (message: string) => void;

  login: (credentials?: AuthCredentials) => Promise<boolean>;
  register: (credentials?: AuthCredentials) => Promise<boolean>;

  logout: () => void;
  clearAuth: () => void;

  clearMessage: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      username: "",
      password: "",
      loggedInUsername: "", 
      accessToken: null,
      refreshToken: null,

      isBusy: false,
      message: "",

      setUsername: (value) => set({ username: value }),

      setPassword: (value) => set({ password: value }),

      setMessage: (message) => set({ message }),

      login: async (credentials) => {
        set({
          isBusy: true,
          message: "",
        });

        try {
          const payload = credentials ?? {
            username: get().username,
            password: get().password,
          };

          const response = await request<AuthResponse>(
            API_ENDPOINTS.auth.login,
            {
              method: "POST",
              body: JSON.stringify(payload),
            },
          );

          const tokens = mapTokenPair(response);
          saveTokens(tokens.access, tokens.refresh);

          set({
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
            password: "",
            loggedInUsername: payload.username,
            username: payload.username,
            message: "Login successful",
          });
          toast.success("Login successful");

          return true;
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to login";

          set({
            message,
          });
          toast.error(message);

          return false;
        } finally {
          set({ isBusy: false });
        }
      },

      register: async (credentials) => {
        set({
          isBusy: true,
          message: "",
        });

        try {
          const payload = credentials ?? {
            username: get().username,
            password: get().password,
          };

          const response = await request<AuthResponse>(
            API_ENDPOINTS.auth.register,
            {
              method: "POST",
              body: JSON.stringify(payload),
            },
          );

          const tokens = mapTokenPair(response);
          saveTokens(tokens.access, tokens.refresh);

          set({
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
            loggedInUsername: payload.username,
            username: payload.username,
            message: "Registration successful",
            password: "",
          });
          toast.success("Registration successful");

          return true;
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Unable to register";

          set({
            message,
          });
          toast.error(message);

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
          loggedInUsername: "", 
          username: "",
          password: "",

          message: "Logged out successfully",
        });
        toast.success("Logged out successfully");
      },

      clearAuth: () => {
        clearTokens();

        set({
          accessToken: null,
          refreshToken: null,
          loggedInUsername: "",   
          username: "",
          password: "",
          message: "",
        });
      },

      clearMessage: () => {
        set({ message: "" });
      },
    }),
    {
      name: "auth-storage",
      version: 2,

      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        username: state.username,
      }),
      migrate: (persistedState) => {
        const state = persistedState as Partial<AuthState> | undefined;

        return {
          accessToken: state?.accessToken ?? null,
          refreshToken: state?.refreshToken ?? null,
          username: state?.username ?? "",
          password: "",
          loggedInUsername: state?.loggedInUsername ?? state?.username ?? "",
          isBusy: false,
          message: "",
        };
      },
    },
  ),
);
