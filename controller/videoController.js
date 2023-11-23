const router = require("express").Router();
const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile"));

//POST request for new feature//
const createVideoEntry = async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send("Please login");
    return;
  }
  const authToken = req.headers.authorization.split(" ")[1];
  let userId;
  try {
    const decodedToken = jwt.verify(authToken, process.env.JWT_KEY);
    userId = decodedToken.id;
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid auth token");
  }
  const { url, prompt } = req.body;

  if (!url || !prompt) {
    res.status(400).json({ message: `Please fill in all fields` });
  }
  try {
    const newVideoEntry = {
      user_id: userId,
      url,
      prompt,
    };
    const [id] = await knex("videos").insert(newVideoEntry).returning("id");
    const insertedVideo = await knex("videos").where({ id }).first();

    res.status(201).json(insertedVideo);
  } catch (error) {
    res.status(500).json({ message: `Error adding Item: ${error}` });
  }
};

//GET request for user's videos//
const getVideos = async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send("Please login");
    return;
  }
  const authToken = req.headers.authorization.split(" ")[1];
  let userId;
  try {
    const decodedToken = jwt.verify(authToken, process.env.JWT_KEY);
    userId = decodedToken.id;
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid auth token");
  }

  try {
    const videos = await knex("videos").where({ user_id: userId }).select();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving videos: ${error}` });
  }
};

//GET request for a single video by id//
const getVideo = async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send("Please login");
    return;
  }

  const authToken = req.headers.authorization.split(" ")[1];
  let userId;

  try {
    const decodedToken = jwt.verify(authToken, process.env.JWT_KEY);
    userId = decodedToken.id;
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid auth token");
    return;
  }

  const videoId = req.params.id;

  if (!videoId) {
    res.status(400).json({ message: "Video ID is required" });
    return;
  }

  try {
    const video = await knex("videos")
      .where({ id: videoId, user_id: userId })
      .select()
      .first();

    if (!video) {
      res.status(404).json({ message: "Video not found" });
      return;
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving video: ${error}` });
  }
};

//PUT request for upvote//
const updateUpvote = async (req, res) => {
  const videoId = req.params.id;

  try {
    const video = await knex("videos").where({ id: videoId }).first();

    if (!video) {
      return res
        .status(404)
        .json({ message: `Video with ID ${videoId} not found` });
    }

    const currentUpvotes = video.upvote || 0;
    const newUpvotes = currentUpvotes + 1;
    await knex("videos").where({ id: videoId }).update({ upvote: newUpvotes });
    const updatedVideo = await knex("videos").where({ id: videoId }).first();
    res.status(200).json(updatedVideo);
  } catch (error) {
    console.error(
      `Error updating upvote for video with ID ${videoId}: ${error}`
    );
    res.status(500).json({ message: `Error updating upvote count` });
  }
};

//PUT request for downvote//
const updateDownvote = async (req, res) => {
  const videoId = req.params.id;

  try {
    const video = await knex("videos").where({ id: videoId }).first();

    if (!video) {
      return res
        .status(404)
        .json({ message: `Video with ID ${videoId} not found` });
    }

    const currentDownvotes = video.downvote || 0;
    const newDownvotes = currentDownvotes + 1;
    await knex("videos")
      .where({ id: videoId })
      .update({ downvote: newDownvotes });
    const updatedVideo = await knex("videos").where({ id: videoId }).first();
    res.status(200).json(updatedVideo);
  } catch (error) {
    console.error(
      `Error updating downvote for video with ID ${videoId}: ${error}`
    );
    res.status(500).json({ message: `Error updating downvote count` });
  }
};

//PUT Request for vote
const updateVote = async (req, res) => {
  const videoId = req.params.id;
  const voteType = req.body.voteType;

  try {
    const video = await knex("videos").where({ id: videoId }).first();

    if (!video) {
      return res
        .status(404)
        .json({ message: `Video with ID ${videoId} not found` });
    }

    let currentVotes, newVotes;

    if (voteType === "upvote") {
      currentVotes = video.upvote || 0;
      newVotes = currentVotes + 1;
      await knex("videos").where({ id: videoId }).update({ upvote: newVotes });
    } else if (voteType === "downvote") {
      currentVotes = video.downvote || 0;
      newVotes = currentVotes + 1;
      await knex("videos")
        .where({ id: videoId })
        .update({ downvote: newVotes });
    } else {
      return res
        .status(400)
        .json({ message: 'Invalid voteType. Use "upvote" or "downvote".' });
    }

    const updatedVideo = await knex("videos").where({ id: videoId }).first();

    res.status(200).json(updatedVideo);
  } catch (error) {
    console.error(`Error updating vote for video with ID ${videoId}: ${error}`);
    res.status(500).json({ message: `Error updating vote count` });
  }
};

module.exports = {
  createVideoEntry,
  getVideos,
  getVideo,
  updateUpvote,
  updateDownvote,
  updateVote,
};
