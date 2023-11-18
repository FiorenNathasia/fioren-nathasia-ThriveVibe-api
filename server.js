require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const videoRouter = require("./routes/video");

app.use(express.json());
app.use(cors());
app.use("/api/video", videoRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`this server is running on port ${port}`);
});
