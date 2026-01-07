import { ClerkProvider } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const ClerkProviderWrapper = ({ children }) => {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
      signInUrl="/login"
      signUpUrl="/signup"
      fallbackRedirectUrl="/"
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkProviderWrapper;
