import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { request } from "../utils/api.js";
import { AuthContext } from "../context/Auth.jsx";

export default function ProjectDetail() {
  const { user } = useContext(AuthContext);
  const { projectId } = useParams();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const STATUSES = ["To Do", "In Progress", "Done"];
  const STATUS_COLORS = {
    "To Do": "#f87171", // red
    "In Progress": "#fbbf24", // yellow
    Done: "#34d399", // green
  };

  const formatDate = (date) => new Date(date).toLocaleString();

  // Fetch tasks for this project
  const fetchTasks = async () => {
    try {
      const data = await request(
        `/projects/${projectId}/tasks`,
        "GET",
        null,
        user.token,
      );
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  // Create new task
  const handleCreateTask = async () => {
    if (!title || !description)
      return alert("Title and Description are required");
    try {
      const data = await request(
        `/projects/${projectId}/tasks`,
        "POST",
        { title, description },
        user.token,
      );
      setTasks([...tasks, data]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // Update task
  const handleUpdateTask = async (taskId) => {
    if (!editTitle || !editDescription)
      return alert("Title and Description required");
    try {
      const updated = await request(
        `/projects/${projectId}/tasks/${taskId}`,
        "PUT",
        { title: editTitle, description: editDescription },
        user.token,
      );
      setTasks(tasks.map((t) => (t._id === taskId ? updated : t)));
      setEditingTaskId(null);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await request(
        `/projects/${projectId}/tasks/${taskId}`,
        "DELETE",
        null,
        user.token,
      );
      setTasks(tasks.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  // Change task status
  const handleChangeStatus = async (taskId, newStatus) => {
    try {
      const updated = await request(
        `/projects/${projectId}/tasks/${taskId}`,
        "PUT",
        { status: newStatus },
        user.token,
      );
      setTasks(tasks.map((t) => (t._id === taskId ? updated : t)));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Project Tasks</h2>

      {/* Create Task */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Title"
          style={{ marginRight: "0.5rem" }}
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task Description"
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={handleCreateTask}>Add Task</button>
      </div>

      {/* Tasks List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {tasks.map((task) => (
          <div
            key={task._id}
            style={{
              background: STATUS_COLORS[task.status] || "#e5e7eb",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            {editingTaskId === task._id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                />
                <button
                  onClick={() => handleUpdateTask(task._id)}
                  style={{ marginRight: "5px" }}
                >
                  Save
                </button>
                <button onClick={() => setEditingTaskId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h4>{task.title}</h4>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
                <p style={{ fontSize: "12px", color: "#555" }}>
                  Created: {formatDate(task.createdAt)}
                </p>
                <p style={{ fontSize: "12px", color: "#555" }}>
                  Updated: {formatDate(task.updatedAt)}
                </p>

                {/* Actions */}
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    gap: "5px",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Status Dropdown */}
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleChangeStatus(task._id, e.target.value)
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  {/* Edit / Delete */}
                  <button
                    onClick={() => {
                      setEditingTaskId(task._id);
                      setEditTitle(task.title);
                      setEditDescription(task.description);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTask(task._id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        {tasks.length === 0 && <p>No tasks yet. Add one above!</p>}
      </div>
    </div>
  );
}
