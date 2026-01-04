export const requireApproval = (req, res, next) => {
    const { publicMetadata } = req.auth?.sessionClaims || {};
  
    if (!publicMetadata?.approved) {
      return res.status(403).json({
        message: "Account not approved by admin",
      });
    }
  
    next();
  };
  