import { useState, useEffect, useContext } from "react";
import Form from "../components/Form";
import { request } from "../utils/api.js";
import { AuthContext } from "../context/Auth.jsx";

export default function Projects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing projects
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user || !user.token) return;
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

  // Function called when Form submits
  const handleCreateProject = async (formData, setFormError) => {
    if (!user || !user.token) return setFormError("You must be logged in");
    try {
      const newProject = await request(
        "/projects",
        "POST",
        formData,
        user.token,
      );
      setProjects([newProject, ...projects]);
    } catch (err) {
      setFormError(err.message || "Failed to create project");
    }
  };

  if (loading) return <p>Loading projects...</p>;

  return (
    <div>
      <h2>Create a New Project</h2>
      <Form
        fields={[{ name: "name", required: true }, { name: "description" }]}
        onSubmit={handleCreateProject}
        buttonText="Create Project"
      />

      <h3>Projects List</h3>
      {projects.length === 0 ? (
        <p>No projects yet!</p>
      ) : (
        projects.map((project) => (
          <div key={project._id}>
            <h4>{project.name}</h4>
            <p>{project.description}</p>
          </div>
        ))
      )}
    </div>
  );
}
