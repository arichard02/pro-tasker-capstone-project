import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { request } from "../utils/api.js";
import { AuthContext } from "../context/Auth.jsx";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch all projects for the logged-in user
  const fetchProjects = async () => {
    if (!user) return;
    try {
      const data = await request("/projects", "GET", null, user.token);
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  // Create a new project
  const handleCreateProject = async () => {
    if (!name || !description)
      return alert("Name and description are required");
    try {
      const newProject = await request(
        "/projects",
        "POST",
        { name, description },
        user.token,
      );
      setProjects([...projects, newProject]);
      setName("");
      setDescription("");
    } catch (err) {
      console.error("Error creating project:", err);
      alert(err.message || "Failed to create project");
    }
  };

  // Update project
  const handleUpdateProject = async (projectId) => {
    if (!editName || !editDescription)
      return alert("Name and description required");
    try {
      const updated = await request(
        `/projects/${projectId}`,
        "PUT",
        { name: editName, description: editDescription },
        user.token,
      );
      setProjects(projects.map((p) => (p._id === projectId ? updated : p)));
      setEditingProjectId(null);
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  // Delete project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await request(`/projects/${projectId}`, "DELETE", null, user.token);
      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>My Projects</h2>

      {/* Create Project */}
      <div style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <input
          type="text"
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <button onClick={handleCreateProject} style={{ padding: "8px 16px" }}>
          Add Project
        </button>
      </div>

      {/* Projects List */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {projects.length === 0 && <p>No projects yet. Create one above!</p>}

        {projects.map((project) => (
          <div
            key={project._id}
            style={{
              display: "block",
              padding: "1rem",
              background: "#3b82f6",
              color: "#fff",
              borderRadius: "8px",
              minWidth: "220px",
              position: "relative",
            }}
          >
            {editingProjectId === project._id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                />
                <button
                  onClick={() => handleUpdateProject(project._id)}
                  style={{ marginRight: "5px" }}
                >
                  Save
                </button>
                <button onClick={() => setEditingProjectId(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <Link
                  to={`/projects/${project._id}`}
                  style={{ color: "#fff", textDecoration: "none" }}
                >
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <p style={{ fontSize: "12px", marginTop: "4px" }}>
                    Tasks: {project.tasks ? project.tasks.length : 0}
                  </p>
                </Link>

                {/* Edit / Delete */}
                <div
                  style={{
                    marginTop: "5px",
                    display: "flex",
                    gap: "5px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    onClick={() => {
                      setEditingProjectId(project._id);
                      setEditName(project.name);
                      setEditDescription(project.description);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteProject(project._id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
