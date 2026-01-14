const express = require("express");
const router = express.Router();

const {
  createClaim,
  getClaims,
  updateClaimStatus,
  updateDocuments
} = require("../controllers/claim.controller");

router.post("/", createClaim);
router.get("/", getClaims);
router.put("/:claimId/status", updateClaimStatus);
router.put("/:claimId/documents", updateDocuments);

module.exports = router;
