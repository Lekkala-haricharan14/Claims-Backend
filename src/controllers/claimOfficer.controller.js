const ClaimOfficer = require("../models/ClaimOfficer");

/**
 * CREATE CLAIM OFFICER (ADMIN ONLY - No role check for now, will add later)
 */
exports.createClaimOfficer = async (req, res) => {
  try {
    // Validate required fields
    const { claimOfficerId, claimOfficerName, email, phone } = req.body;
    
    if (!claimOfficerId || !claimOfficerName || !email || !phone) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["claimOfficerId", "claimOfficerName", "email", "phone"]
      });
    }

    const officer = await ClaimOfficer.create(req.body);
    res.status(201).json(officer);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate entry",
        message: "claimOfficerId or email already exists"
      });
    }
    res.status(400).json({ error: error.message });
  }
};

