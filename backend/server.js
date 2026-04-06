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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Health check
app.get("/", (req, res) => res.send("API is running"));

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
