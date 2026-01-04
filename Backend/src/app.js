import express from "express";
import cors from "cors";
import authRoutes from "./routes/authroutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(
    cors({
      origin: "http://localhost:5173", // frontend URL
      credentials: true,
    })
  );
  
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

export default app;
