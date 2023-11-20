const router = require("express").Router();
const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile"));

const getFeed = async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send("Please login");
    return;
  }

  const authToken = req.headers.authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_KEY);
    // You can use the decoded payload if needed
  } catch (error) {
    res.status(401).send("Invalid auth token");
    return;
  }

  try {
    // Assuming 'videos' is your database table name
    const videos = await knex("videos").select("*");

    // Sorting videos based on timestamp
    const sortedVideos = videos.sort((a, b) => b.timestamp - a.timestamp);

    // Take the first 30 videos
    const newestVideos = sortedVideos.slice(0, 30);

    // Now newestVideos contains the 30 newest videos, sorted from latest to oldest
    res.status(200).json(newestVideos);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error retrieving videos: ${error.message || error}` });
  }
};

module.exports = { getFeed };
