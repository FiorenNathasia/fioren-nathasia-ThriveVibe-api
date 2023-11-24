const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
  if (!req.headers.authorization) {
    res.status(401).send("Please login");
    return;
  }
  const authToken = req.headers.authorization.split(" ")[1];
  try {
    const decodedToken = jwt.verify(authToken, process.env.JWT_KEY);
    const userId = decodedToken.id;
    const user = await knex("users").where({ id: userId }).first();
    delete user.password;
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid auth token");
    return;
  }
};

module.exports = {
  getUser,
};
