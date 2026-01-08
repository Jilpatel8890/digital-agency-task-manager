import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";

const SyncUser = () => {
  const { isSignedIn, isLoaded, getToken } = useAuth();
  const synced = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || synced.current) return;

    synced.current = true;

    const sync = async (retries = 3) => {
      try {
        const token = await getToken({ skipCache: true });
        
        if (!token) {
          if (retries > 0) {
            // Wait a bit and retry if token is not available yet
            setTimeout(() => sync(retries - 1), 500);
            return;
          }
          console.warn("No token available for sync after retries");
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/sync-user", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.error("Sync failed:", res.status, res.statusText);
        }
      } catch (error) {
        console.error("Sync error:", error);
      }
    };

    sync();
  }, [isLoaded, isSignedIn, getToken]);

  return null;
};

export default SyncUser;
