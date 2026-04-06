import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth.jsx";
import { request } from "../utils/api.js";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add project form
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Fetch projects
  useEffect(() => {
    if (!user?.token) return;

    const fetchProjects = async () => {
      try {
        const data = await request("/projects", "GET", null, user.token);
        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  // Add new project
  const handleAddProject = async () => {
    if (!newName || !newDescription) return;
    try {
      const project = await request(
        "/projects",
        "POST",
        { name: newName, description: newDescription },
        user.token,
      );
      setProjects([...projects, project]);
      setNewName("");
      setNewDescription("");
    } catch (err) {
      console.error("Failed to add project", err);
    }
  };

  // Delete project
  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await request(`/projects/${id}`, "DELETE", null, user.token);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  // Inline edit project
  const handleUpdateProject = async (id, updates) => {
    try {
      const updated = await request(
        `/projects/${id}`,
        "PUT",
        updates,
        user.token,
      );
      setProjects(projects.map((p) => (p._id === id ? updated : p)));
    } catch (err) {
      console.error("Failed to update project", err);
    }
  };

  if (loading) return <p>Loading projects...</p>;
  if (!user?.token) return <p>Please log in to view your projects.</p>;

  return (
    <div>
      <h2>Your Projects</h2>

      {/* Add project form */}
      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Project name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          placeholder="Project description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <button onClick={handleAddProject}>Add Project</button>
      </div>

      {/* List of projects */}
      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        projects.map((project) => (
          <ProjectItem
            key={project._id}
            project={project}
            onDelete={handleDeleteProject}
            onUpdate={handleUpdateProject}
            onView={() => navigate(`/projects/${project._id}`)}
          />
        ))
      )}
    </div>
  );
}

// ----- ProjectItem Component -----
function ProjectItem({ project, onDelete, onUpdate, onView }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  const handleSave = () => {
    onUpdate(project._id, { name, description });
    setEditMode(false);
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
    >
      {editMode ? (
        <div>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
          <button onClick={onView}>View</button>
          <button onClick={() => setEditMode(true)}>Edit</button>
          <button onClick={() => onDelete(project._id)}>Delete</button>
        </div>
      )}
    </div>
  );
}
