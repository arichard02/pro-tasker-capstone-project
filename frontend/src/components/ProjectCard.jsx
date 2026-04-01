export default function ProjectCard({ project }) {
  return (
    <div className="project-card" style={{ border: "1px solid #ccc", padding: "1rem", margin: "0.5rem" }}>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <small>Owner: {project.owner.username}</small>
    </div>
  );
}