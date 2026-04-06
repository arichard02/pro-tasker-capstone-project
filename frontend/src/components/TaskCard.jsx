import { useState } from "react";
import { request } from "../utils/api.js";

export default function TaskCard({ task, token, onDeleted }) {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status || "To Do");
  const [saving, setSaving] = useState(false);

  // Update task
  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await request(
        `/projects/${task.project}/tasks/${task._id}`,
        "PUT",
        { title, description, status },
        token,
      );
      setTitle(updated.title);
      setDescription(updated.description);
      setStatus(updated.status);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update task", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete task
  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await request(`/projects/${task.project}/tasks/${task._id}`, "DELETE", null, token);
      onDeleted(task._id);
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
    >
      {editMode ? (
        <div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h4>{title}</h4>
          {description && <p>{description}</p>}
          <p>Status: {status}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}
