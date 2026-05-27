import type { Task, TokenPair } from "../types";

export function mapTokenPair(payload: TokenPair): TokenPair {
  if (!payload.access || !payload.refresh) {
    throw new Error("Authentication response did not include tokens.");
  }

  return {
    access: payload.access,
    refresh: payload.refresh,
  };
}

export function mapTask(payload: Task): Task {
  return {
    id: payload.id,
    task: payload.task,
    is_completed: payload.is_completed,
    user: payload.user,
  };
}
