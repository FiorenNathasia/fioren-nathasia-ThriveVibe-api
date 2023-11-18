const express = require("express");
const router = express.Router();
const videoController = require("../controller/videoController");

//post /video/:id/upvote
//post /video/:id/downvote

router.post("/", videoController.createVideoEntry);
router.put("/:id/upvote");
router.put("/:id/downvote");

module.exports = router;
