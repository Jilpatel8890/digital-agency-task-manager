import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";

const SyncUser = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const synced = useRef(false); // 🔥 prevent multiple calls

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user || synced.current) return;

    const syncUser = async () => {
      try {
        const token = await getToken();

        if (!token) {
          console.warn("No token yet, skipping sync");
          return;
        }

        await fetch("http://localhost:5000/api/auth/sync-user", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        synced.current = true;
      } catch (error) {
        console.error("User sync failed", error);
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user]);

  return null;
};

export default SyncUser;
