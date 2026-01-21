const express = require("express");
const router = express.Router();

const {
  createAgent,
  getAgents,
  getAgentById
} = require("../controllers/agent.controller");

/**
 * POST /api/agents - Create a new agent (ADMIN)
 */
router.post("/", createAgent);

/**
 * GET /api/agents - Get all agents (ADMIN)
 */
router.get("/", getAgents);

/**
 * GET /api/agents/:agentId - Get agent by ID (ADMIN)
 */
router.get("/:agentId", getAgentById);

module.exports = router;
