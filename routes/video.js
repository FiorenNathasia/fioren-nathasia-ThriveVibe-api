const express = require("express");
const router = express.Router();
const videoController = require("../controller/videoController");
const commentController = require("../controller/commentController");

//post /video/:id/upvote
//post /video/:id/downvote

router.post("/newvideo", videoController.createVideoEntry);
router.get("/", videoController.getVideos);
router.get("/:id", videoController.getVideo);
router.put("/:id/upvote", videoController.updateUpvote);
router.put("/:id/downvote", videoController.updateDownvote);
router.put("/:id/vote", videoController.updateVote);
router.post("/:id/comment", commentController.createComment);
router.get("/:id/comments", commentController.getComments);

module.exports = router;
