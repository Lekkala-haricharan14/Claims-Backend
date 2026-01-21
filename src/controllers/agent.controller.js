const Agent = require("../models/Agent");

/**
 * CREATE AGENT (ADMIN ONLY - No role check for now)
 */
exports.createAgent = async (req, res) => {
  try {
    const { agentId, agentName, email, phone } = req.body;
    
    if (!agentId || !agentName || !email || !phone) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["agentId", "agentName", "email", "phone"]
      });
    }

    const agent = await Agent.create(req.body);
    res.status(201).json(agent);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Duplicate entry",
        message: "agentId or email already exists"
      });
    }
    res.status(400).json({ error: error.message });
  }
};

/**
 * GET ALL AGENTS (ADMIN ONLY)
 */
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * GET AGENT BY ID
 */
exports.getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findOne({ agentId: Number(req.params.agentId) });
    if (!agent) {
      return res.status(404).json({ error: "Agent not found" });
    }
    res.json(agent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
