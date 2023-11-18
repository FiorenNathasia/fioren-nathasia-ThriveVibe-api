const router = require("express").Router();
const knex = require("knex")(require("../knexfile"));

const createVideoEntry = async (req, res) => {
  // TODO: Get user_id from authå
  const { user_id, url, prompt } = req.body;

  if (!url || !prompt) {
    res.status(400).json({ message: `Please fill in all fields` });
  }
  try {
    const newVideoEntry = {
      user_id,
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

module.exports = {
  createVideoEntry,
};
