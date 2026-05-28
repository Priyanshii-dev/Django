import { TaskStatsProps } from "@/features/tasks/types/tasks.types";


export default function TaskStats({
  total,
  completed,
}: TaskStatsProps) {
  const stats = [
    { label: "Total", value: total },
    { label: "Completed", value: completed },
    { label: "Open", value: total - completed },
  ];

  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-app-border bg-app-surface p-4 shadow-sm dark:border-app-border-dark dark:bg-app-surface-dark"
        >
          <p className="text-sm font-medium text-app-muted dark:text-app-muted-dark">
            {stat.label}
          </p>
          <p className="mt-1 text-2xl font-bold text-app-text dark:text-app-text-dark">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
