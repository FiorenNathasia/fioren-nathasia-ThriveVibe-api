const bcrypt = require("bcryptjs");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("users").del();
  await knex("users").insert([
    {
      id: 1,
      username: "FiorenNathasia",
      email: "fioren@yahoo.com",
      password: bcrypt.hashSync("123456"),
    },
    {
      id: 2,
      username: "Fnathasia",
      email: "fioren@gmail.com",
      password: bcrypt.hashSync("789101"),
    },
    {
      id: 3,
      username: "FiorenN",
      email: "fiorennn@gmail.com",
      password: bcrypt.hashSync("111213"),
    },
  ]);
};
