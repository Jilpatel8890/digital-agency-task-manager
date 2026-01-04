import { SignIn } from "@clerk/clerk-react";
import { Zap } from "lucide-react";
import "../../Styles/login.css";

const Login = () => {
  return (
    <div className="login-container">
      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="brand">
          <div className="brand-icon">
            <Zap size={28} strokeWidth={2.5} />
          </div>
          <span className="brand-text">TaskFlow</span>
        </div>

        <div className="left-content">
          <h1>Manage your agency's social media work in one place</h1>
          <p>
            Track tasks, store post proofs, and monitor progress across all your clients.
          </p>
        </div>

        <div className="trust">
          <div className="avatars">
            <div>AJ</div>
            <div>SC</div>
            <div>MR</div>
            <div>EW</div>
          </div>
          <span>Trusted by 500+ agencies</span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-card">
          <div className="mobile-brand">
            <Zap size={24} strokeWidth={2.5} />
            <span>TaskFlow</span>
          </div>

          <h2>Welcome back</h2>
          <p className="subtitle">Sign in to your account to continue</p>

          <SignIn
            routing="path"
            path="/login"
            appearance={{
              elements: {
                card: "clerk-card",
                rootBox: "clerk-rootBox",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "clerk-socialButtonsBlockButton",
                formButtonPrimary: "clerk-formButtonPrimary",
                formFieldInput: "clerk-formFieldInput",
                formFieldLabel: "clerk-formFieldLabel",
                dividerLine: "clerk-dividerLine",
                dividerText: "clerk-dividerText",
              },
            }}
          />

          <p className="footer-text">
            Don't have an account? <span>Contact your admin</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;