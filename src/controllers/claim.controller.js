const Claim = require("../models/Claim");

/**
 * CREATE CLAIM (CUSTOMER ONLY)
 * Customer submits a new claim
 */
const createClaim = async (req, res) => {
  try {
    // Customer can only create claim for themselves
    if (req.body.policyholderId !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only create claims for yourself"
      });
    }

    const claim = await Claim.create(req.body);
    res.status(201).json(claim);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * READ CLAIMS WITH ROLE-BASED FILTERING
 * - customer: sees only their own claims
 * - agent: sees claims associated with them (via agentId)
 * - claimOfficer: sees all claims or filtered by claimOfficerId
 */
const getClaims = async (req, res) => {
  try {
    const filters = {};

    // Apply role-based filters
    if (req.user.role === "customer") {
      // Customers can only see their own claims
      filters.policyholderId = req.user.id;
    } else if (req.user.role === "agent") {
      // Agents can only see claims assigned to them
      filters.agentId = req.user.id;
    }
    // claimOfficer can see all claims (apply no role-based filter)

    // Apply user-provided filters
    if (req.query.claimId) filters.claimId = Number(req.query.claimId);
    if (req.query.claimStatus) filters.claimStatus = req.query.claimStatus;

    // These filters only work for claim officers
    if (req.user.role === "claimOfficer") {
      if (req.query.policyholderId) filters.policyholderId = Number(req.query.policyholderId);
      if (req.query.agentId) filters.agentId = Number(req.query.agentId);
      if (req.query.claimOfficerId) filters.claimOfficerId = Number(req.query.claimOfficerId);
    }

    const claims = await Claim.find(filters);
    res.json(claims);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * UPDATE CLAIM STATUS (CLAIM OFFICER ONLY)
 * Only claim officers can approve/reject/set to pending
 */
const updateClaimStatus = async (req, res) => {
  try {
    const { claimStatus, statusReason, approvedAmt, claimOfficerId } = req.body;

    // Verify claimOfficerId matches user
    if (claimOfficerId !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
        message: "claimOfficerId must match your user ID"
      });
    }

    // Validate status
    if (!["Pending", "Approved", "Rejected"].includes(claimStatus)) {
      return res.status(400).json({
        error: "Invalid status",
        message: "Status must be Pending, Approved, or Rejected"
      });
    }

    const update = {
      claimStatus,
      statusReason,
      claimOfficerId,
      statusUpdatedDate: new Date()
    };

    if (claimStatus === "Approved") {
      if (!approvedAmt) {
        return res.status(400).json({
          error: "Missing field",
          message: "approvedAmt is required when status is Approved"
        });
      }
      update.approvedAmt = approvedAmt;
    }

    const claim = await Claim.findOneAndUpdate(
      { claimId: Number(req.params.claimId) },
      update,
      { new: true }
    );

    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    res.json(claim);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * UPDATE SUPPORTING DOCUMENTS (CUSTOMER ONLY)
 * Only customers can upload documents for their claims
 */
const updateDocuments = async (req, res) => {
  try {
    const claimId = Number(req.params.claimId);

    // Find claim to verify ownership
    const claim = await Claim.findOne({ claimId });
    if (!claim) {
      return res.status(404).json({ error: "Claim not found" });
    }

    if (claim.policyholderId !== req.user.id) {
      return res.status(403).json({
        error: "Forbidden",
        message: "You can only upload documents for your own claims"
      });
    }

    // Prevent document upload if claim is already decided
    if (["Approved", "Rejected"].includes(claim.claimStatus)) {
      return res.status(400).json({
        error: "Invalid operation",
        message: "Cannot upload documents for approved/rejected claims"
      });
    }

    if (!req.body.documents || !Array.isArray(req.body.documents)) {
      return res.status(400).json({
        error: "Invalid input",
        message: "documents must be an array"
      });
    }

    const updatedClaim = await Claim.findOneAndUpdate(
      { claimId },
      {
        $push: { supportingDocuments: { $each: req.body.documents } }
      },
      { new: true }
    );

    res.json(updatedClaim);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createClaim,
  getClaims,
  updateClaimStatus,
  updateDocuments
};
