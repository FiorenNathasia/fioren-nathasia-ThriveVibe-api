const router = require("express").Router();
const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile"));

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

  // TODO: Get user_id from auth
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

//PUT request for upvote//
// get the video id from the url
// get ^that video from the table
// get the current upvote count of ^that video (access that column)
// calculate what the NEW upvote count will be (current upvote + 1)
// EDIT that video entry, by replacing the current upvote count with the NEW upvote count
const updateUpvote = async (req, res) => {
  const videoId = req.params.id;

  try {
    const video = await knex("videos").where({ id: videoId }).first();

    if (!video) {
      return res
        .status(404)
        .json({ message: `Video with ID ${videoId} not found` });
    }

    // Get the current upvote count
    const currentUpvotes = video.upvote || 0;

    // Calculate the new upvote count
    const newUpvotes = currentUpvotes + 1;

    // Update the video entry
    await knex("videos").where({ id: videoId }).update({ upvote: newUpvotes });

    // Fetch the updated video entry
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

    // Get the current downvote count
    const currentDownvotes = video.downvote || 0;

    // Calculate the new dowmvote count
    const newDownvotes = currentDownvotes + 1;

    // Update the video entry
    await knex("videos")
      .where({ id: videoId })
      .update({ downvote: newDownvotes });

    // Fetch the updated video entry
    const updatedVideo = await knex("videos").where({ id: videoId }).first();

    res.status(200).json(updatedVideo);
  } catch (error) {
    console.error(
      `Error updating downvote for video with ID ${videoId}: ${error}`
    );
    res.status(500).json({ message: `Error updating downvote count` });
  }
};

module.exports = {
  createVideoEntry,
  updateUpvote,
  updateDownvote,
  getVideos,
};
