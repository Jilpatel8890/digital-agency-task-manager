import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const SyncUser = () => {
  const { isSignedIn, isLoaded, getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const sync = async () => {
      const token = await getToken(); // ✅ NO TEMPLATE

      await fetch("http://localhost:5000/api/auth/sync-user", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };

    sync();
  }, [isLoaded, isSignedIn]);

  return null;
};

export default SyncUser;
