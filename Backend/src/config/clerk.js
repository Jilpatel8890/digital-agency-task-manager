import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

// middleware/clerkAuth.js
export const clerkAuth = ClerkExpressWithAuth({
  strict: false, // 👈 IMPORTANT
});
