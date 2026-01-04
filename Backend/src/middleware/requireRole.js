export const requireRole = (roles = []) => {
    return (req, res, next) => {
      const { publicMetadata } = req.auth?.sessionClaims || {};
      const role = publicMetadata?.role;
  
      if (!roles.includes(role)) {
        return res.status(403).json({
          message: "You do not have permission to access this resource",
        });
      }
  
      next();
    };
  };
  