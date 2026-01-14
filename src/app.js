const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/**
 * ROOT ENDPOINT
 */
app.get("/", (req, res) => {
  res.status(200).json({
    service: "Claims Service",
    status: "Running",
    version: "1.0.0"
  });
});

app.use("/api/claims", require("./routes/claim.routes"));
app.use("/api/claimofficers", require("./routes/claimOfficer.routes"));

module.exports = app;
