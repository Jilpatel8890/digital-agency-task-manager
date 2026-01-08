import jwt from "jsonwebtoken";

const clerkAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      req.auth = null;
      return next();
    }

    const token = authHeader.slice(7);
    const decoded = jwt.decode(token);

    if (!decoded) {
      req.auth = null;
      return next();
    }

    // ✅ SAFELY extract email
    const email =
      decoded.email ||
      decoded.email_address ||
      decoded.email_addresses?.[0]?.email_address ||
      null;

    req.auth = {
      userId: decoded.sub,
      email,
      name:
        decoded.name ||
        `${decoded.given_name || ""} ${decoded.family_name || ""}`.trim(),
      imageUrl: decoded.picture || null,
      sessionClaims: decoded,
    };

    next();
  } catch (err) {
    console.error("Clerk auth error:", err);
    req.auth = null;
    next();
  }
};

export default clerkAuth;
