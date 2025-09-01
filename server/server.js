// server/server.js

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Define Routes
app.use("/api/auth", userRoutes); // This line requires userRoutes to be a valid router
app.use("/api/tasks", taskRoutes); // This line requires taskRoutes to be a valid router

// Simple root route for testing
app.get("/", (req, res) => {
  res.send("Task Manager API is running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
