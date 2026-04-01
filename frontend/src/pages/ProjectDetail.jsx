import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import { request } from "../utils/api";
import TaskCard from "../components/TaskCard";

export default function ProjectDetail() {
  const { user } = useContext(AuthContext);
  const { projectId } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // New Task Form
  const [taskName, setTaskName] = useState("");
  const [taskError, setTaskError] = useState("");
  const [taskLoading, setTaskLoading] = useState(false);

  // Fetch project + tasks
  useEffect(() => {
    if (!user) return;

    const fetchProjectAndTasks = async () => {
      setLoading(true);
      setError("");
      try {
        const projectData = await request(
          `/projects/${projectId}`,
          "GET",
          null,
          user.token,
        );
        setProject(projectData);

        const tasksData = await request(
          `/projects/${projectId}/tasks`,
          "GET",
          null,
          user.token,
        );
        setTasks(tasksData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndTasks();
  }, [user, projectId]);

  // CREATE Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskError("");
    setTaskLoading(true);

    try {
      const newTask = await request(
        `/projects/${projectId}/tasks`,
        "POST",
        { name: taskName },
        user.token,
      );
      setTasks([newTask, ...tasks]);
      setTaskName("");
    } catch (err) {
      setTaskError(err.message);
    } finally {
      setTaskLoading(false);
    }
  };

  // Delete Task (update UI)
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((t) => t._id !== taskId));
  };

  // Update Task (update UI)
  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
  };

  if (!user) return <p>Please login to view this project.</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <div className="project-detail">
      <h2>{project.name}</h2>
      <p>{project.description}</p>

      {/* CREATE TASK FORM */}
      <form onSubmit={handleCreateTask} style={{ marginBottom: "1rem" }}>
        {taskError && <p style={{ color: "red" }}>{taskError}</p>}
        <input
          type="text"
          placeholder="New Task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
        <button type="submit" disabled={taskLoading}>
          {taskLoading ? "Creating..." : "Add Task"}
        </button>
      </form>

      <h3>Tasks</h3>
      {tasks.length === 0 && <p>No tasks yet!</p>}
      <div className="tasks-grid">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            projectId={project._id}
            token={user.token}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
        ))}
      </div>
    </div>
  );
}
