import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project, onDelete, onUpdate }) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);

  // Update project (example)
  const handleSave = () => {
    onUpdate({ ...project, name, description });
    setEditing(false);
  };

  return (
    <div className="project-card">
      {editing ? (
        <>
          <input value={name} onChange={(e) => setName(e.target.value)} />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/projects/${project._id}`)}
          >
            {project.name}
          </h3>
          <p>{project.description}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={() => onDelete(project._id)}>Delete</button>
        </>
      )}
    </div>
  );
}
