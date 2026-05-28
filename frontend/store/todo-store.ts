"use client";

import { Task } from "@/features/tasks/types/tasks.types";
import { create } from "zustand";



interface TodoState {
  taskInput: string;
  tasks: Task[];
  isBusy: boolean;
  message: string;
  setTaskInput: (value: string) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (id: number) => void;
  setMessage: (message: string) => void;
  setIsBusy: (busy: boolean) => void;
  clearTodos: () => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  taskInput: "",
  tasks: [],
  isBusy: false,
  message: "",
  setTaskInput: (value) => set({ taskInput: value }),
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

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

  clearTodos: () =>
    set({
      tasks: [],
      taskInput: "",
      message: "",
    }),
}));
