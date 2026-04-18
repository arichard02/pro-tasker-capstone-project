import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../utils/api.js";
import { AuthContext } from "../context/Auth.jsx";

export default function Register() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await request("/api/auth/register", "POST", {
        username,
        email,
        password,
      });

            if (!data.token || !data.username) {
        throw new Error("Invalid registration response");
      }

      setUser(data);

      // redirect to dashboard
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed");
        } finally {
      setLoading(false);
    }
  };
 
  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "24px" }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
     
       <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#4f46e5",
            color: "#fff",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}