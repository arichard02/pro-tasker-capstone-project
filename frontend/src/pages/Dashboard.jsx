// import { useEffect, useState, useContext } from "react";
// import { AuthContext } from "../context/Auth";
// import { request } from "../utils/api";
// import { Link } from "react-router-dom";

// export default function Dashboard() {
//   const { user } = useContext(AuthContext);
//   const [projects, setProjects] = useState([]);
//   const [newProjectName, setNewProjectName] = useState("");

//   // Fetch projects
//   const fetchProjects = async () => {
//     try {
//       const data = await request("/projects", "GET", null, user.token);
//       setProjects(data);
//     } catch (err) {
//       console.error("Error fetching projects:", err);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchProjects();
//   }, [user]);

//   // Create a new project
//   const handleCreateProject = async () => {
//     if (!newProjectName) return alert("Project name is required");
//     try {
//       const data = await request(
//         "/projects",
//         "POST",
//         { name: newProjectName },
//         user.token,
//       );
//       setProjects([...projects, data]);
//       setNewProjectName("");
//     } catch (err) {
//       console.error("Error creating project:", err);
//     }
//   };

//   return (
//     <div>
//       <h2>Welcome, {user.username}</h2>

//       <div>
//         <input
//           type="text"
//           placeholder="New Project Name"
//           value={newProjectName}
//           onChange={(e) => setNewProjectName(e.target.value)}
//         />
//         <button onClick={handleCreateProject}>Create Project</button>
//       </div>

//       <h3>Your Projects</h3>
//       <ul>
//         {projects.map((proj) => (
//           <li key={proj._id}>
//             <Link to={`/projects/${proj._id}`}>{proj.name}</Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { request } from "../utils/api.js";
import { AuthContext } from "../context/Auth.jsx";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const data = await request("/projects", "GET", null, user.token);
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>My Projects</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {projects.map((project) => (
          <Link
            key={project._id}
            to={`/projects/${project._id}`}
            style={{
              display: "block",
              padding: "1rem",
              background: "#3b82f6",
              color: "#fff",
              borderRadius: "8px",
              minWidth: "200px",
              textDecoration: "none",
            }}
          >
            <h3>{project.name}</h3>
            <p>{project.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}