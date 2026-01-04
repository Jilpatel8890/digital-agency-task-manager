import express from "express";
import { clerkAuth } from "../config/clerk.js";
import { requireApproval } from "../middleware/requireApproval.js";
import { requireRole } from "../middleware/requireRole.js";

const router = express.Router();

// Any approved user
router.get(
  "/me",
  clerkAuth,
  requireApproval,
  (req, res) => {
    res.json({
      userId: req.auth.userId,
      role: req.auth.sessionClaims.publicMetadata.role,
    });
  }
);

// Admin only
router.get(
  "/admin-only",
  clerkAuth,
  requireApproval,
  requireRole(["admin"]),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

export default router;
