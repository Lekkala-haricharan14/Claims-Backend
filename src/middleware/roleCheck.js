/**
 * Role-based access control middleware
 * Passes user role via request header: X-User-Role and X-User-Id
 * 
 * Roles:
 * - customer (policyholder) - can apply, update own claims, upload documents
 * - claimOfficer - can view all claims, accept/decline/pending
 * - agent - can view claims (read-only)
 * 
 * Note: Customer and Agent data is fetched from other microservices
 * This middleware only validates role and user ID headers
 */

// Check if user has required role(s)
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.headers["x-user-role"];
    const userId = req.headers["x-user-id"];

    if (!userRole || !userId) {
      return res.status(401).json({
        error: "Missing credentials",
        message: "Please provide X-User-Role and X-User-Id headers"
      });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Access denied. Required role(s): ${allowedRoles.join(", ")}`,
        userRole
      });
    }

    // Attach user info to request
    req.user = { role: userRole, id: Number(userId) };
    next();
  };
};

// Only customer can modify their own claim
const checkOwnershipCustomer = async (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({
      error: "Forbidden",
      message: "Only customers can perform this action"
    });
  }

  const Claim = require("../models/Claim");
  const claim = await Claim.findOne({ claimId: Number(req.params.claimId) });

  if (!claim) {
    return res.status(404).json({ error: "Claim not found" });
  }

  if (claim.policyholderId !== req.user.id) {
    return res.status(403).json({
      error: "Forbidden",
      message: "You can only modify your own claims"
    });
  }

  next();
};

module.exports = {
  checkRole,
  checkOwnershipCustomer
};
