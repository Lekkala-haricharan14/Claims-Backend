const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
  claimId: { type: Number, unique: true, required: true },

  // References to other microservices
  policyId: { type: Number, required: true },
  policyholderId: { type: Number, required: true },  // From Customers MS
  agentAssignmentId: Number,

  claimReason: { type: String, required: true },
  claimType: { type: String, required: true },

  claimStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },

  incidentDate: { type: Date, required: true },
  claimDate: { type: Date, default: Date.now },

  claimAmtRequested: { type: Number, required: true },
  approvedAmt: Number,

  statusReason: String,
  statusUpdatedDate: Date,

  supportingDocuments: [String],
  
  // Claim Officer assignment
  claimOfficerId: Number,
  
  // Agent reference from Agents MS
  agentId: Number
}, { timestamps: true });

module.exports = mongoose.model("Claim", claimSchema);
