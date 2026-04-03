import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/Auth";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user context + localStorage
    logout();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>
        Pro-Tasker
      </Link>

      {user ? (
        <>
          <Link to="/dashboard" style={{ marginRight: "1rem" }}>
            Dashboard
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "1rem" }}>
            Login
          </Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

//   return (
//     <nav className="navbar">
//       <h1>Pro-Tasker</h1>
//       <div className="links">
//         {user ? (
//           <>
//             <Link to="/dashboard">Dashboard</Link>
//             <button onClick={handleLogout}>Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/login">Login</Link>
//             <Link to="/register">Register</Link>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }
