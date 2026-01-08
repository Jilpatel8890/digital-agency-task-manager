import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./src/routes/authroutes.js";
import protectedRoutes from "./src/routes/protectedroutes.js";
import clientRoutes from "./src/routes/clientroutes.js";
import userRoutes from "./src/routes/userroutes.js";
import clerkAuth from "./src/middleware/clerkAuth.js";
import taskRoutes from "./src/routes/taskroutes.js";

dotenv.config();

const app = express();

// CORS must come before auth middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Don't apply auth middleware globally - apply it per route
// This allows public routes to work without authentication

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Digital Agency API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
