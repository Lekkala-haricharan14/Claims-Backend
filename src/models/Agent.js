const mongoose = require("mongoose");

const agentSchema = new mongoose.Schema({
  agentId: { type: Number, unique: true, required: true },
  agentName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  agencyCode: String,
  createdDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Agent", agentSchema);
