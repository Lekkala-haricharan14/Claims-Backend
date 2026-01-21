const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  getCustomerById
} = require("../controllers/customer.controller");

/**
 * POST /api/customers - Create a new customer (ADMIN)
 */
router.post("/", createCustomer);

/**
 * GET /api/customers - Get all customers (ADMIN)
 */
router.get("/", getCustomers);

/**
 * GET /api/customers/:customerId - Get customer by ID (ADMIN)
 */
router.get("/:customerId", getCustomerById);

module.exports = router;
