const router = require("express").Router();
const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile"));

const getFeed = async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send("Please login");
    return;
  }

  const authToken = req.headers.authorization.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(authToken, process.env.JWT_KEY);
  } catch (error) {
    res.status(401).send("Invalid auth token");
    return;
  }

  try {
    const videos = await knex("videos")
      .select("*")
      .where("user_id", "!=", decoded.id);

    const sortedVideos = videos.sort((a, b) => b.timestamp - a.timestamp);
    const newestVideos = sortedVideos.slice(0, 30);
    res.status(200).json(newestVideos);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error retrieving videos: ${error.message || error}` });
  }
};

module.exports = { getFeed };
