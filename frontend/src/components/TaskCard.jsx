import { useState } from "react";
import { request } from "../utils/api";

export default function TaskCard({
  task,
  projectId,
  token,
  onDelete,
  onUpdate,
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(task.name);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // DELETE Task
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await request(
        `/projects/${projectId}/tasks/${task._id}`,
        "DELETE",
        null,
        token,
      );
      onDelete(task._id);
    } catch (err) {
      setError(err.message);
    }
  };

  // UPDATE Task
  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    try {
      const updatedTask = await request(
        `/projects/${projectId}/tasks/${task._id}`,
        "PUT",
        { name },
        token,
      );
      onUpdate(updatedTask);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-card">
      {editing ? (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <p>{task.name}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
