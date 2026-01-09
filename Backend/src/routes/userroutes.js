import express from "express";
import clerkAuth from "../middleware/clerkAuth.js";
import { loadUser } from "../middleware/loaduser.js";
import { requireRole } from "../middleware/requireRole.js";
import User from "../models/user.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

const router = express.Router();

router.get(
  "/",
  clerkAuth,
  loadUser,
  requireRole(["manager"]),
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
  requireRole(["manager"]),
  async (req, res) => {
    console.log("Creating user:", req.body);
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

      // Create invitation in Clerk
      // try {
      //   const invitation = await clerkClient.invitations.createInvitation({
      //     emailAddress: email,
      //   });
      //   console.log("Invitation created:", invitation);
      // } catch (inviteErr) {
      //   console.error("Failed to create invitation:", inviteErr);
      //   // Continue creating user even if invitation fails
      // }

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
  requireRole(["manager"]),
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
  requireRole(["manager"]),
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

router.post(
  "/invite/:id",
  clerkAuth,
  loadUser,
  requireRole(["manager"]),
  async (req, res) => {
    console.log("Inviting user:", req.params.id);
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      console.log("User found:", user.email);

      // Check if user already has clerkUserId
      if (user.clerkUserId) {
        return res.status(400).json({ message: "User already has Clerk account" });
      }

      // Create invitation in Clerk
      console.log("Creating invitation for:", user.email);
      const invitation = await clerkClient.invitations.createInvitation({
        emailAddress: user.email,
        redirectUrl: process.env.CLERK_REDIRECT_URL || "http://localhost:5173",
      });
      console.log("Invitation created:", invitation);

      res.json({ message: "Invitation sent successfully" });
    } catch (err) {
      console.error("Invite error:", err);
      res.status(500).json({ message: "Failed to send invitation" });
    }
  }
);

export default router;
