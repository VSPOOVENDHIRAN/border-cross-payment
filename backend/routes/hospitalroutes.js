const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const authenticate = require("../middleware/authmiddleware");

const { registerHospitalRequest, updateRequestStatus } = require("../controllers/hospitalcontroller");

router.post( "/register", upload.single("registration_certificate"), registerHospitalRequest);

const { getHospitalRequests,getPendingRequests, createEmergencyCase,addHospitalSettlementAccount,updateHospitalSettlementAccount  } = require("../controllers/hospitalcontroller");
router.get("/show_requests", getHospitalRequests);
router.get("/pending_requests", getPendingRequests);
router.put("/update_account",authenticate,updateHospitalSettlementAccount);
router.post("/add_settlement_account", authenticate, addHospitalSettlementAccount);

//const updateRequestStatus = require("../controllers/hospitalcontroller").updateRequestStatus;
router.post("/update_request/:id", updateRequestStatus);
router.post("/create_emergency_case", createEmergencyCase);
module.exports = router;
