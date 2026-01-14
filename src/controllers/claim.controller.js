const Claim = require("../models/Claim");

// CREATE CLAIM
const createClaim = async (req, res) => {
  const claim = await Claim.create(req.body);
  res.status(201).json(claim);
};

// READ CLAIMS WITH FILTERS
const getClaims = async (req, res) => {
  const filters = {};

  if (req.query.claimId) filters.claimId = Number(req.query.claimId);
  if (req.query.agentId) filters.agentId = Number(req.query.agentId);
  if (req.query.policyholderId) filters.policyholderId = Number(req.query.policyholderId);
  if (req.query.claimOfficerId) filters.claimOfficerId = Number(req.query.claimOfficerId);
  if (req.query.claimStatus) filters.claimStatus = req.query.claimStatus;

  const claims = await Claim.find(filters);
  res.json(claims);
};

// UPDATE CLAIM STATUS (CLAIM OFFICER ONLY)
const updateClaimStatus = async (req, res) => {
  const { claimStatus, statusReason, approvedAmt, claimOfficerId } = req.body;

  const update = {
    claimStatus,
    statusReason,
    claimOfficerId,
    statusUpdatedDate: new Date()
  };

  if (claimStatus === "Approved") {
    update.approvedAmt = approvedAmt;
  }

  const claim = await Claim.findOneAndUpdate(
    { claimId: Number(req.params.claimId) },
    update,
    { new: true }
  );

  res.json(claim);
};

// UPDATE SUPPORTING DOCUMENTS (POLICYHOLDER)
const updateDocuments = async (req, res) => {
  const claim = await Claim.findOneAndUpdate(
    { claimId: Number(req.params.claimId) },
    {
      $push: { supportingDocuments: { $each: req.body.documents } }
    },
    { new: true }
  );

  res.json(claim);
};

module.exports = {
  createClaim,
  getClaims,
  updateClaimStatus,
  updateDocuments
};
