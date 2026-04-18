import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {  BASE_URL } from "../utils/api.js";
import { AuthContext } from "../context/Auth.jsx";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

     try {
    // DEBUG: raw fetch to see backend response
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text();
    console.log("Raw response:", text); // check if backend is returning JSON or HTML
    const data = JSON.parse(text);      // parse to JSON

    // Normal login logic
    if (!data.token || !data.username) {
      throw new Error("Invalid login response");
    }

    setUser(data);
    navigate("/"); // redirect to dashboard
  } catch (err) {
    console.error("Login fetch error:", err);
    setError(err.message || "Login failed");
  }
};


  //   try {
      
  //     const data = await request("/api/auth/login", "POST", {
  //       email,
  //       password,
  //     });

  //     // Ensure token and username exist
  //     if (!data.token || !data.username) {
  //       throw new Error("Invalid login response from server");
  //     }

  //     // Save user in context
  //     setUser(data);

  //     // Redirect to dashboard
  //     navigate("/");
  //   } catch (err) {
  //     setError(err.message || "Login failed");
  //   }
  // };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "24px" }}>
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
