const router = require("express").Router();
const jwt = require("jsonwebtoken");
const knex = require("knex")(require("../knexfile"));

//POST request for new comment//
const createComment = async (req, res) => {
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
  const { comments } = req.body;

  console.log(videoId);

  if (!comments) {
    res.status(400).json({ message: `Please fill in all fields` });
    return;
  }
  try {
    const newComment = {
      user_id: userId,
      video_id: videoId,
      comments,
    };
    const [id] = await knex("comments").insert(newComment).returning("id");
    const insertedComment = await knex("comments").where({ id }).first();

    res.status(201).json(insertedComment);
    return;
  } catch (error) {
    res.status(500).json({ message: `Error adding comment: ${error}` });
    return;
  }
};

//GET request of comments for a single video by id//
const getComments = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ message: `Error retrieving video: ${error}` });
    return;
  }

  try {
    const comments = await knex("comments")
      .where({ video_id: videoId })
      .select("*");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: `Error retrieving comments: ${error}` });
    return;
  }
};

module.exports = {
  createComment,
  getComments,
};
