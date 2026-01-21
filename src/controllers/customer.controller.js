const Customer = require("../models/Customer");

/**
 * CREATE CUSTOMER (ADMIN ONLY - No role check for now)
 */
exports.createCustomer = async (req, res) => {
  try {
    const { policyholderId, policyholderName, email, phone } = req.body;
    
    if (!policyholderId || !policyholderName || !email || !phone) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["policyholderId", "policyholderName", "email", "phone"]
      });
    }

    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate entry",
        message: "policyholderId or email already exists"
      });
    }
    res.status(400).json({ error: error.message });
  }
};

/**
 * GET ALL CUSTOMERS (ADMIN ONLY)
 */
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * GET CUSTOMER BY ID
 */
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ policyholderId: Number(req.params.customerId) });
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
