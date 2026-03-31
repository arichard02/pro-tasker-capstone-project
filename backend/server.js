import "dotenv.config";

import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js"
import projectRoutes from "./routes/projectRoutes.js";



const app = express();

const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", userRoutes);
app.use("api/project", projectRoutes);


// 
app.get("/", (req,res) => {
    res.send("API is running...");
});

// 
app.listen(port, () =>
console.log(`Listening on port: http://localhost:${port}`),
);