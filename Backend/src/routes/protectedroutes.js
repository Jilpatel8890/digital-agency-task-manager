import express from "express";
import clerkAuth from "../middleware/clerkAuth.js";
import User from "../models/user.js";

const router = express.Router();

router.get("/me", clerkAuth, async (req, res) => {
  const clerkUserId = req.auth.userId;

  const user = await User.findOne({ clerkUserId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    id: user._id,
    email: user.email,
    role: user.role,
    approved: user.approved,
    name: user.name,
  });
});

export default router;
