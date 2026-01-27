const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authmiddleware");
const resolveIdentity = require("../middleware/rolemiddleware");
//const requireHospitalAdmin = require("../middleware/requireHospitalAdmin");

const { getEmergencyCasesByHospital,getEmergenciesForDestinationHospital } = require("../controllers/historycontroller.js");
//router.get(
// "/hos",
//getEmergencyCasesByHospital
//);

router.get(
  "/hos",
  authenticate,
  getEmergencyCasesByHospital
);

router.get(
  "/dest",
  authenticate,
  getEmergenciesForDestinationHospital
);

module.exports = router;