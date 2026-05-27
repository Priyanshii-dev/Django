import { TaskItemProps } from "../../types";



export default function TaskItem({
  task,
  onToggle,
  onDelete,
}: TaskItemProps) {
  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <input
        type="checkbox"
        checked={task.is_completed}
        onChange={onToggle}
      />

      <span
        className={`flex-1 ${
          task.is_completed ? "line-through text-gray-400" : ""
        }`}
      >
        {task.task}
      </span>

      <button
        onClick={onDelete}
        className="rounded-md border px-3 py-1 text-red-600"
      >
        Delete
      </button>
    </li>
  );
}