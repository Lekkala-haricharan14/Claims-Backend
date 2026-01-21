const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  policyholderId: { type: Number, unique: true, required: true },
  policyholderName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true },
  policyNumber: String,
  address: String,
  createdDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
