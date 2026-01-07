import User from "../models/user.js";

export const loadUser = async (req, res, next) => {
  try {
    const clerkUserId = req.auth.userId;

    const user = await User.findOne({ clerkUserId });

    if (!user) {
      return res.status(404).json({ message: "User not found in DB" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("loadUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
