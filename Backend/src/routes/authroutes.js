import express from "express";
import { clerkAuth } from "../middleware/clerkAuth.js";
import { syncUser } from "../controllers/authcontroller.js";

const router = express.Router();

router.post("/sync-user", clerkAuth, syncUser);

export default router;
