import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <div
      className="project-card"
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        margin: "8px 0",
        borderRadius: "6px",
      }}
    >
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <Link to={`/projects/${project._id}`}>View Details</Link>
    </div>
  );
}
