import { TaskStatsProps } from "../../types";


export default function TaskStats({
  total,
  completed,
}: TaskStatsProps) {
  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-3">
      <div className="rounded-lg border bg-white p-4">
        <p>Total</p>
        <p className="text-2xl font-bold">{total}</p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <p>Completed</p>
        <p className="text-2xl font-bold">{completed}</p>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <p>Open</p>
        <p className="text-2xl font-bold">
          {total - completed}
        </p>
      </div>
    </div>
  );
}