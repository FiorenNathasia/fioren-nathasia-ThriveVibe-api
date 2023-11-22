const express = require("express");
const router = express.Router();
const feedController = require("../controller/feedController");

router.get("/feedlist", feedController.getFeed);

module.exports = router;
