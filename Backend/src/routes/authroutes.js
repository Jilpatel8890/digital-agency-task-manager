import express from "express";
import clerkAuth from "../middleware/clerkAuth.js";
import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/user.js";

const router = express.Router();

router.post("/sync-user", clerkAuth, async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
    const image = clerkUser.imageUrl;

    let user = await User.findOne({ clerkUserId });

    if (!user) {
      user = await User.create({
        clerkUserId,
        email,
        name,
        image,
        role: "admin",     // TEMP: make yourself admin
        approved: true,    // TEMP: auto approve
      });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sync failed" });
  }
});

export default router;
