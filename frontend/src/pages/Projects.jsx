import { useState, useContext } from "react";
import Form from "../components/Form";
import { request } from "../utils/api";
import { AuthContext } from "../context/Auth";

export default function Projects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");

  // Function called when Form submits
  const handleCreateProject = async (formData, setFormError) => {
    try {
      const newProject = await request(
        "/projects",
        "POST",
        formData,
        user.token,
      );
      setProjects([newProject, ...projects]);
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div>
      <h2>Create a New Project</h2>
      <Form
        fields={[{ name: "name", required: true }, { name: "description" }]}
        onSubmit={handleCreateProject}
        buttonText="Create Project"
      />

      <h3>Projects List</h3>
      {projects.length === 0 && <p>No projects yet!</p>}
      {projects.map((project) => (
        <div key={project._id}>
          <h4>{project.name}</h4>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
