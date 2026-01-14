const ClaimOfficer = require("../models/ClaimOfficer");

// CREATE CLAIM OFFICER
exports.createClaimOfficer = async (req, res) => {
  const officer = await ClaimOfficer.create(req.body);
  res.status(201).json(officer);
};
