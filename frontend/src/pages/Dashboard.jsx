import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/Auth";
import { request } from "../utils/api";
import ProjectCard from "../components/ProjectCard";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Fetch projects
  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await request("/projects", "GET", null, user.token);
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  // CREATE project
  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    try {
      const newProject = await request(
        "/projects",
        "POST",
        { name, description },
        user.token,
      );

      setProjects([newProject, ...projects]);
      setName("");
      setDescription("");
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  // DELETE project (updates UI)
  const handleDeleteProject = (id) => {
    setProjects(projects.filter((p) => p._id !== id));
  };

  // UPDATE project (updates UI)
  const handleUpdateProject = (updatedProject) => {
    setProjects(
      projects.map((p) => (p._id === updatedProject._id ? updatedProject : p)),
    );
  };

  if (!user) return <p>Please login to view your dashboard.</p>;

  return (
    <div className="dashboard">
      <h2>Your Projects</h2>

      {/* Create Project Form */}
      <form onSubmit={handleCreate} style={{ marginBottom: "2rem" }}>
        <h3>Create New Project</h3>

        {formError && <p style={{ color: "red" }}>{formError}</p>}

        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit" disabled={formLoading}>
          {formLoading ? "Creating..." : "Create Project"}
        </button>
      </form>

      {/* Projects */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="projects-grid">
        {projects.length === 0 && !loading && <p>No projects yet!</p>}

        {projects.map((project) => (
        //   <ProjectCard
        //     key={project._id}
        //     project={project}
        //     onDelete={handleDeleteProject}
        //     onUpdate={handleUpdateProject}
        //   />

        // Make project clickable
          <div key={project._id} className="project-card">
            <Link to={`/projects/${project._id}`}>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
