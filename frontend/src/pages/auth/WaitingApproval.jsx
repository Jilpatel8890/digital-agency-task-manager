import { Clock, Mail, Zap, LogOut } from "lucide-react";
import { useClerk } from "@clerk/clerk-react";
import "../../Styles/waitingApproval.css";

const WaitingApproval = () => {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return (
    <div className="waiting-container">
      {/* LEFT PANEL */}
      <div className="waiting-left">
        <div className="brand">
          <div className="brand-icon">
            <Zap size={28} strokeWidth={2.5} />
          </div>
          <span className="brand-text">TaskFlow</span>
        </div>

        <div className="left-content">
          <h1>Your journey with TaskFlow begins soon</h1>
          <p>
            We're reviewing your account to ensure the best experience for you and your team. 
            This process helps maintain a secure and productive workspace for all our users.
          </p>
        </div>

        <div className="trust">
          <div className="avatars">
            <div>AJ</div>
            <div>SC</div>
            <div>MR</div>
            <div>EW</div>
          </div>
          <span>Join 500+ approved agencies</span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="waiting-right">
        <div className="waiting-card">
          <div className="mobile-brand">
            <Zap size={24} strokeWidth={2.5} />
            <span>TaskFlow</span>
          </div>

          {/* Main Icon */}
          <div className="waiting-icon">
            <Clock size={64} strokeWidth={1.5} />
          </div>

          {/* Content */}
          <h2>Account Pending Approval</h2>
          <p className="waiting-description">
            Your account has been created successfully and is currently waiting
            for manager approval.
          </p>

          {/* Info Box */}
          <div className="waiting-info-box">
            <Mail size={20} />
            <div className="waiting-info-text">
              <strong>What happens next?</strong>
              <span>
                A manager will review your account within 24–48 hours.
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="waiting-actions">
            <button className="waiting-logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingApproval;