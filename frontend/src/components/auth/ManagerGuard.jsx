import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

const ManagerGuard = ({ children }) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchUser = async (retries = 3) => {
      try {
        const token = await getToken({ skipCache: true });

        if (!token) {
          if (retries > 0) {
            setTimeout(() => fetchUser(retries - 1), 500);
            return;
          }
          setUser(null);
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/protected/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();

        setUser(await res.json());
        setLoading(false);
      } catch (error) {
        console.error("Fetch user error:", error);
        setUser(null);
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  if (loading) return <div>Loading...</div>;
  if (!user?.approved) return <div>Account not approved</div>;
  if (user?.role !== "manager") return <div>Access denied: Manager only</div>;

  return children;
};

export default ManagerGuard;