import express from "express";
import clerkAuth from "../middleware/clerkAuth.js";
import { loadUser } from "../middleware/loaduser.js";
import { requireRole } from "../middleware/requireRole.js";
import User from "../models/user.js";

const router = express.Router();

router.get(
  "/",
  clerkAuth,
  loadUser,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 });
      res.json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }
);

router.post(
  "/",
  clerkAuth,
  loadUser,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const { name, email, role, approved } = req.body;

      if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
      }

      // Check if user with email already exists
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        role: role || null,
        approved: approved !== undefined ? approved : false,
      });

      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to create user" });
    }
  }
);

router.put(
  "/:id",
  clerkAuth,
  loadUser,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const { name, approved, role } = req.body;

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name !== undefined) user.name = name;
      if (approved !== undefined) user.approved = approved;
      if (role !== undefined) user.role = role;

      await user.save();

      res.json({
        message: "User updated successfully",
        user,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to update user" });
    }
  }
);

router.delete(
  "/:id",
  clerkAuth,
  loadUser,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.deleteOne();

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to delete user" });
    }
  }
);

export default router;
