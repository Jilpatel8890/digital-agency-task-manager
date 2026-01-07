import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/user.js";

/**
 * Sync Clerk user with MongoDB
 * Runs after login / signup
 */
export const syncUser = async (req, res) => {
  try {
    const clerkUserId = req.auth.clerkUserId;

    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
    const image = clerkUser.imageUrl;

    let user = await User.findOne({
      $or: [{ clerkUserId }, { email }],
    });

    if (!user) {
      user = await User.create({
        clerkUserId,
        email,
        name,
        image,
        approved: false,
        role: null,
      });
    }

    // Edge case: user existed but clerkUserId missing
    if (!user.clerkUserId) {
      user.clerkUserId = clerkUserId;
      await user.save();
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("SYNC USER ERROR:", error);
    res.status(500).json({ message: "Sync failed" });
  }
};
