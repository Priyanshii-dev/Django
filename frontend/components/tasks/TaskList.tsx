
import { TaskListProps } from "../../types";
import TaskItem from "./TaskItem";


export default function TaskList({
  tasks,
  onToggle,
  onDelete,
}: TaskListProps) {
  return (
    <ul className="rounded-lg border bg-white">
      {tasks.length === 0 ? (
        <li className="p-6 text-center">No tasks yet.</li>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggle(task)}
            onDelete={() => onDelete(task.id)}
          />
        ))
      )}
    </ul>
  );
}