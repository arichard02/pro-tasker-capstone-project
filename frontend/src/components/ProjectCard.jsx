import { Link } from "react-router-dom";

export default function ProjectCard({ project }) {
  return (
    <div className="project-card">
      <h4>{project.name}</h4>
      <p>{project.description}</p>
      <Link to={`/projects/${project._id}`}>View Project</Link>
    </div>
  );
}
