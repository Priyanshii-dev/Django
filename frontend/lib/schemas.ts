import { z } from "zod";

export const authSchema = z.object({
  username: z.string().min(1, "Username must be at least 1 character"),
  password: z.string().min(1, "Password must be at least 1 characters"),
});

export const taskSchema = z.object({
  task: z.string().min(1, "Task text is required"),
});
