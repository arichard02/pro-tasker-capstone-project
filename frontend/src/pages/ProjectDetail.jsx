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

  return (
    <div>
      <h2>Project Tasks</h2>
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <button onClick={handleCreateTask}>Add Task</button>
      </div>
      <div>
        {tasks.map((task) => (
          <div
            key={task._id}
            style={{ border: "1px solid #ccc", padding: "10px", margin: "5px" }}
          >
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
