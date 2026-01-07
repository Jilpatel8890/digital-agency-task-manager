import User from "../models/user.js";

export const loadUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      clerkUserId: req.auth.clerkUserId,
    });

    if (!user) {
      return res.status(403).json({ message: "User not registered" });
    }

    if (!user.approved) {
      return res.status(403).json({ message: "User not approved" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "User disabled" });
    }

    req.user = user; // attach DB user
    next();
  } catch (error) {
    return res.status(500).json({ message: "Failed to load user" });
  }
};
