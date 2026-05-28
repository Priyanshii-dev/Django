 export type TaskStatusFilter = "all" | "completed" | "pending";

 export type Task = {
   id: number;
   task_number: number;
   task: string;
   is_completed: boolean;
   user: number;
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

export type TaskNavbarProps = {
  onLogout: () => void;
};

export type TaskItemProps = {
  task: Task;
  onToggle: () => void;
  onDelete: () => void;
};
