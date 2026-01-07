import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import WaitingApproval from "../../pages/auth/WaitingApproval";

const AuthGuard = ({ children }) => {
  const { isSignedIn, isLoaded, getToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchUser = async () => {
      try {
        const token = await getToken(); // ✅ NO TEMPLATE

        const res = await fetch("http://localhost:5000/api/protected/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setUserData(data);
      } catch (err) {
        console.error("AuthGuard error:", err);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  if (loading) return <div>Loading...</div>;
  if (!userData?.approved) return <WaitingApproval />;

  return children;
};

export default AuthGuard;
