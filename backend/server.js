import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/connection.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// --- Security Headers Middleware (replacing helmet) ---
app.use((req, res, next) => {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Basic XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Referrer policy
  res.setHeader("Referrer-Policy", "no-referrer");

  // You can add Content Security Policy (CSP) if needed
  // res.setHeader("Content-Security-Policy", "default-src 'self'");

  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Health check
app.get("/", (req, res) => res.send(`
  API is running
  <ul>
    <li><a href="/api/auth/server">/api/auth/server</a> (POST)</li>
    <li><a href="/api/auth/register">/api/auth/register</a> (POST)</li>
    <li><a href="/api/projects">/api/projects</a> (POST)</li>
    <li><a href="/api/projects">/api/projects</a> (GET)</li>
    <li><a href="/api/projects/:projectId">/api/projects/:projectId</a> (GET)</li>
    <li><a href="/api/projects/:projectId">/api/projects/:projectId</a> (PUT)</li>
    <li><a href="/api/projects/:projectId">/api/projects/:projectId</a> (DELETE)</li>
    <li><a href="/api/projects/:projectId/tasks">/api/projects/:projectId/tasks</a> (GET)</li>
    <li><a href="/api/projects/:projectId/tasks">/api/projects/:projectId/tasks</a> (POST)</li>
   <li><a href="/api/projects/:projectId/tasks/:taskId">/api/projects/:projectId/tasks/:taskId</a> (PUT)</li>
   <li><a href="/api/projects/:projectId/tasks/:taskId">/api/projects/:projectId/tasks/:taskId</a> (DELETE)</li>
    
  </ul>
  `));

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
