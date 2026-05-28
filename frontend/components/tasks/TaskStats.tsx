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
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
        >
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {stat.label}
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
