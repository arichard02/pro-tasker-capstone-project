import { useState } from "react";
import { request } from "../utils/api";

export default function TaskCard({
  task,
  token,
  projectId,
  onDelete,
  onUpdate,
}) {
  const [status, setStatus] = useState(task.status);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setLoading(true);
    try {
      const updatedTask = await request(
        `/projects/${projectId}/tasks/${task._id}`,
        "PUT",
        { ...task, status: newStatus },
        token,
      );
      onUpdate(updatedTask);
    } catch (err) {
      console.error(err);
      setStatus(task.status); // rollback if error
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await request(
        `/projects/${projectId}/tasks/${task._id}`,
        "DELETE",
        null,
        token,
      );
      onDelete(task._id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="task-card">
      <p>{task.title}</p>
      <select value={status} onChange={handleStatusChange} disabled={loading}>
        <option>To Do</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>
      <button onClick={handleDelete} disabled={loading}>
        Delete
      </button>
    </div>
  );
}
