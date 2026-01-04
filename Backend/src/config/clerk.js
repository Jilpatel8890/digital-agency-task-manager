import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

export const clerkAuth = ClerkExpressWithAuth({
  strict: true,
});
