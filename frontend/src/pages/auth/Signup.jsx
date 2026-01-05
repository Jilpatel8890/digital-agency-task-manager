import { SignUp } from "@clerk/clerk-react";
import { Zap, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import "../../Styles/signup.css";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate Clerk loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="signup-container">
      {/* LEFT BRAND PANEL */}
      <div className="signup-left">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>

        <div className="brand">
          <div className="brand-icon">
            <Zap size={26} />
          </div>
          <span className="brand-text">TaskFlow</span>
        </div>

        <div className="left-content">
          <h1>
            Join your agency's <br /> social media workspace
          </h1>
          <p>
            Create an account to collaborate with your team, manage tasks, and
            track social media progress across all clients.
          </p>
        </div>

        <div className="trust">
          <span>Used by modern digital agencies</span>
        </div>
      </div>

      {/* RIGHT SIGNUP PANEL */}
      <div className="signup-right">
        <div className="signup-card">
          <div className="mobile-brand">
            <Zap size={22} />
            <span>TaskFlow</span>
          </div>

          <h2>Create your account</h2>
          <p className="subtitle">
            Get started with your agency workspace
          </p>

          {isLoading ? (
            <div className="loading-container">
              <Loader2 className="loading-spinner" size={32} />
              <p className="loading-text">Please wait...</p>
            </div>
          ) : (
            <SignUp
              routing="path"
              path="/signup"
              appearance={{
                elements: {
                  card: "clerk-card",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "clerk-google-btn",
                  formButtonPrimary: "clerk-primary-btn",
                  formFieldInput: "clerk-input",
                  formFieldLabel: "clerk-label",
                  dividerLine: "clerk-divider",
                  dividerText: "clerk-divider-text",
                  footerActionLink: "clerk-footer-link",
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;