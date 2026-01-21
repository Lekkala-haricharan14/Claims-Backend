const express = require("express");
const router = express.Router();

const {
  createClaim,
  getClaims,
  updateClaimStatus,
  updateDocuments
} = require("../controllers/claim.controller");

const { checkRole, checkOwnershipCustomer } = require("../middleware/roleCheck");

/**
 * POST /api/claims - Create a new claim (CUSTOMER ONLY)
 */
router.post("/", checkRole(["customer"]), createClaim);

/**
 * GET /api/claims - Read claims (all roles, but filtered by role)
 * - customer: sees only their claims
 * - agent: sees only claims assigned to them
 * - claimOfficer: sees all claims
 */
router.get("/", checkRole(["customer", "agent", "claimOfficer"]), getClaims);

/**
 * PUT /api/claims/{claimId}/status - Update claim status (CLAIM OFFICER ONLY)
 */
router.put(
  "/:claimId/status",
  checkRole(["claimOfficer"]),
  updateClaimStatus
);

/**
 * PUT /api/claims/{claimId}/documents - Update documents (CUSTOMER ONLY)
 */
router.put(
  "/:claimId/documents",
  checkRole(["customer"]),
  checkOwnershipCustomer,
  updateDocuments
);

module.exports = router;
