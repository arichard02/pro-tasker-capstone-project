import "dotenv/config";
import express from "express";
import cors from "cors";

import "./config/connection.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => res.send("API is running..."));

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));