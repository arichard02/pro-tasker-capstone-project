import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/Auth";
import { request } from "../utils/api";
import ProjectCard from "../components/ProjectCard";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (!user) return <p>Please login to view your dashboard.</p>;

  return (
    <div className="dashboard">
      <h2>Your Projects</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="projects-grid">
        {projects.length === 0 && !loading && <p>No projects yet!</p>}
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}
