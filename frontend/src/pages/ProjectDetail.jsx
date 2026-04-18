import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth.jsx";
import { request } from "../utils/api.js";
import TaskCard from "../components/TaskCard.jsx";

export default function ProjectDetail() {
  const { id } = useParams(); // projectId
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // New task inputs
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState("To Do");

  // Project edit
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch project
  useEffect(() => {
    if (!user?.token) return;

    const fetchProject = async () => {
      try {
        const data = await request(`/projects/${id}`, "GET", null, user.token);
        setProject(data);
        setEditName(data.name);
        setEditDescription(data.description);
      } catch (err) {
        console.error("Failed to fetch project", err);
      }
    };

    fetchProject();
  }, [id, user]);

  // Fetch tasks
  useEffect(() => {
    if (!user?.token) return;

    const fetchTasks = async () => {
      try {
        const data = await request(`/projects/${id}/tasks/`, "GET", null, user.token);
        setTasks(data);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [id, user]);

  if (loading) return <p>Loading project and tasks...</p>;
  if (!project) return <p>Project not found.</p>;

  // ----- Project CRUD -----
  const handleProjectUpdate = async () => {
    try {
      const updated = await request(
        `/projects/${id}`,
        "PUT",
        { name: editName, description: editDescription },
        user.token,
      );
      setProject(updated);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update project", err);
    }
  };

  const handleProjectDelete = async () => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await request(`/projects/${id}`, "DELETE", null, user.token);
      navigate("/"); // back to dashboard
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  // ----- Task CRUD -----
  // /projects/:projectId/tasks (POST)
  const handleAddTask = async () => {
    if (!newTitle) return;
    try {
      const task = await request(
        `/projects/${id}/tasks`,
        "POST",
        { title: newTitle, description: newDescription, status: newStatus },
        user.token,
      );
      setTasks((prev) => [...prev, task]);
      setNewTitle("");
      setNewDescription("");
      setNewStatus("To Do");
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const handleTaskDeleted = (taskId) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  return (
    <div>
      {/* Project info */}
      {editMode ? (
        <div>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <button onClick={handleProjectUpdate}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          <button onClick={() => setEditMode(true)}>Edit Project</button>
          <button onClick={handleProjectDelete}>Delete Project</button>
        </div>
      )}

      {/* Add new task */}
      <h3>Add Task</h3>
      <input
        placeholder="Title"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
      />
      <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <button onClick={handleAddTask}>Add Task</button>

      {/* Task list */}
      <h3>Tasks</h3>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            token={user.token}
            projectId={id}
            onDeleted={handleTaskDeleted}
          />
        ))
      ) : (
        <p>No tasks yet.</p>
      )}
    </div>
  );
}
