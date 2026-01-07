import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./src/routes/authroutes.js";
import protectedRoutes from "./src/routes/protected.routes.js";
import clientRoutes from "./src/routes/clientroutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

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

app.get("/", (req, res) => {
  res.send("🚀 Digital Agency API running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
