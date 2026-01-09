// import express from "express";
// import User from "../models/user.js";
// import clerkAuth from "../middleware/clerkAuth.js";

// const router = express.Router();

// // Apply auth middleware to this router
// router.use(clerkAuth);

// router.post("/sync-user", async (req, res) => {
//   try {
//     // Debug: log auth info
//     console.log("Sync-user request - req.auth:", req.auth ? "exists" : "null");
//     console.log("Sync-user request - Authorization header:", req.headers.authorization ? "present" : "missing");
    
//     if (!req.auth?.userId) {
//       console.log("Sync-user: No userId in req.auth");
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const clerkUserId = req.auth.userId;

//     let user = await User.findOne({ clerkUserId });

//     if (!user) {
//       user = await User.create({
//         clerkUserId,
//         email: req.auth.sessionClaims?.email,
//         name: req.auth.sessionClaims?.name || "User",
//         role: "manager",     // TEMP
//         approved: true,    // TEMP
//       });
//     }

//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Sync failed" });
//   }
// });

// export default router;
import express from "express";
import User from "../models/user.js";
import clerkAuth from "../middleware/clerkAuth.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

const router = express.Router();

router.post("/sync-user", clerkAuth, async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;

    const clerkUser = await clerkClient.users.getUser(clerkUserId);

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
    const image = clerkUser.imageUrl;

    console.log("Sync userId:", clerkUserId);
    console.log("Sync email:", email);

    if (!email) {
      console.error("SYNC ERROR: Email missing in Clerk user", clerkUser);
      return res.status(400).json({ message: "Email not available" });
    }

    let user = await User.findOne({
      $or: [{ clerkUserId }, { email }],
    });
    console.log("User found in sync:", user);

    if (!user) {
      user = await User.create({
        clerkUserId,
        email,
        name,
        image,
        approved: false,
        role: null,
      });
      console.log("User created in sync:", user);
    }

    // Edge case: user existed but clerkUserId missing
    if (!user.clerkUserId) {
      user.clerkUserId = clerkUserId;
      await user.save();
      console.log("User updated in sync:", user);
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("SYNC USER ERROR:", error);
    res.status(500).json({ message: "Sync failed" });
  }
});

export default router;
