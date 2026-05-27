import { FormEvent } from "react";


export type AuthMode = "login" | "register";

export type TokenPair = {
  access: string;
  refresh: string;
};

export type Task = {
  id: number;
  task: string;
  is_completed: boolean;
  user: number;
};

export type AuthTabsProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
};

export type AuthFormProps = {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;

  username: string;
  setUsername: (value: string) => void;

  password: string;
  setPassword: (value: string) => void;

  onSubmit: (event: FormEvent<HTMLFormElement>) => void;

  isBusy: boolean;
  message: string;
};

export type AuthStates = {
  total: number;
  completed: number;
};

export type TaskFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export type TaskStatsProps = {
  total: number;
  completed: number;
};

export type TaskListProps = {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
};


export type TaskItemProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};

export type HeaderProps = {
  onLogout: () => void;
};