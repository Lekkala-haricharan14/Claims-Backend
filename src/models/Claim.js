const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  claimId: { type: Number, unique: true, required: true },

  policyId: Number,
  policyholderId: Number,
  agentId: Number,
  claimOfficerId: Number,

  claimReason: String,
  claimType: String,

  claimStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },

  incidentDate: Date,
  claimDate: { type: Date, default: Date.now },

  claimAmtRequested: { type: Number, required: true },
  approvedAmt: Number,

  statusReason: String,
  statusUpdatedDate: Date,

  supportingDocuments: [String]
}, { timestamps: true });

module.exports = mongoose.model("Claim", claimSchema);
