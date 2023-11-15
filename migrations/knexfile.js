// Import dotenv to process environment variables from `.env` file.
require("dotenv").config();

console.log(process.env.DB_USER);

module.exports = {
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    charset: "utf8",
  },
};
