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
//         role: "admin",     // TEMP
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

const router = express.Router();

router.post("/sync-user", clerkAuth, async (req, res) => {
  try {
    if (!req.auth?.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, email, name, imageUrl } = req.auth;

    if (!email) {
      console.error("SYNC ERROR: Email missing in Clerk token", req.auth);
      return res.status(400).json({ message: "Email not available" });
    }

    let user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      user = await User.create({
        clerkUserId: userId,
        email,
        name,
        avatar: imageUrl,
        role: "user",
        approved: false,
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("SYNC USER DB ERROR:", err);
    res.status(500).json({ message: "Sync failed" });
  }
});

export default router;
