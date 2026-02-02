const express = require("express");
const router = express.Router();

const { buildAmlDashboard } = require("../controllers/tokencontroller");

router.get("/aml", buildAmlDashboard);

const { runDemoPayment } = require("../controllers/tokencontroller");

router.post("/run_demo_payment", runDemoPayment);
module.exports = router;