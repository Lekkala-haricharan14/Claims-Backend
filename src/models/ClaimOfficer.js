const mongoose = require("mongoose");

const claimOfficerSchema = new mongoose.Schema({
  claimOfficerId: { type: Number, unique: true, required: true },
  claimOfficerName: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String, required: true }
});

module.exports = mongoose.model("ClaimOfficer", claimOfficerSchema);
