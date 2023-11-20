const express = require("express");
const router = express.Router();
const videoController = require("../controller/videoController");

//post /video/:id/upvote
//post /video/:id/downvote

router.post("/newvideo", videoController.createVideoEntry);
router.get("/", videoController.getVideos);
router.put("/:id/upvote", videoController.updateUpvote);
router.put("/:id/downvote", videoController.updateDownvote);

module.exports = router;
