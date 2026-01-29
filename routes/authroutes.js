const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authcontroller");
router.post("/login", login);

const {createUserAndSendPasswordLink} =
  require("../controllers/authcontroller");

router.post("/users", createUserAndSendPasswordLink);
 
module.exports = router;
