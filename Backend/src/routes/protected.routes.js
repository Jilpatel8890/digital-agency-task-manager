import express from "express";
import { clerkAuth } from "../middleware/clerkAuth.js";
import { loadUser } from "../middleware/loaduser.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

/**
 * Any approved user
 */
router.get("/me", clerkAuth, loadUser, (req, res) => {
  res.json({
    userId: req.user._id,
    clerkUserId: req.user.clerkUserId,
    email: req.user.email,
    role: req.user.role,
    approved: req.user.approved,
  });
});

/**
 * Admin only
 */
router.get(
  "/admin-only",
  clerkAuth,
  loadUser,
  requireRole(["admin"]),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

export default router;
