const router = require("express").Router();
const controller = require("../controllers/claimOfficer.controller");

router.post("/", controller.createClaimOfficer);

module.exports = router;
