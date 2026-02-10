const express = require("express");
const router = express.Router();
const { handleBFHL } = require("../controllers/bhflcontroller");

router.post("/", handleBFHL);

module.exports = router;
