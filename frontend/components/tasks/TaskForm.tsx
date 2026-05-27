import { TaskFormProps } from "../../types";


export default function TaskForm({
  value,
  onChange,
  onSubmit,
}: TaskFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="mb-5 flex gap-2"
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Add task"
        className="h-11 flex-1 rounded-md border px-3"
      />

      <button className="rounded-md bg-green-700 px-5 text-white">
        Add
      </button>
    </form>
  );
}