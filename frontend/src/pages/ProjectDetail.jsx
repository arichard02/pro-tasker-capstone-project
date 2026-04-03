import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/Auth";
import { request } from "../utils/api";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { user } = useContext(AuthContext);

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Fetch project + tasks
  const fetchData = async () => {
    try {
      const project = await request(
        `/projects/${projectId}`,
        "GET",
        null,
        user.token,
      );
      setProject(project);

      const taskData = await request(
        `/projects/${projectId}/tasks`,
        "GET",
        null,
        user.token,
      );
      setTasks(taskData);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // CREATE TASK
  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;

    try {
      const newTask = await request(
        `/projects/${projectId}/tasks`,
        "POST",
        { title: newTaskTitle },
        user.token,
      );

      setTasks([newTask, ...tasks]);
      setNewTaskTitle("");
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // UPDATE TASK
  const handleUpdateTask = async (taskId, status) => {
    try {
      const updated = await request(
        `/projects/${projectId}/tasks/${taskId}`,
        "PUT",
        { status },
        user.token,
      );

      setTasks(tasks.map((task) => (task._id === taskId ? updated : task)));
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // DELETE TASK
  const handleDeleteTask = async (taskId) => {
    try {
      await request(
        `/projects/${projectId}/tasks/${taskId}`,
        "DELETE",
        null,
        user.token,
      );

      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <h2>{project.name}</h2>

      <div>
        <input
          type="text"
          placeholder="New Task"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
        <button onClick={handleCreateTask}>Add Task</button>
      </div>

      <h3>Tasks</h3>

      {tasks.length === 0 && <p>No tasks yet</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title} - {task.status}
            <select
              value={task.status}
              onChange={(e) => handleUpdateTask(task._id, e.target.value)}
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
