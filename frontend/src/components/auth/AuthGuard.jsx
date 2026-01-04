import { useUser } from "@clerk/clerk-react";
import WaitingApproval from "../../pages/auth/WaitingApproval";

const AuthGuard = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    window.location.href = "/login";
    return null;
  }

  const { approved } = user.publicMetadata || {};

  if (!approved) {
    return <WaitingApproval />;
  }

  return children;
};

export default AuthGuard;
