require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const videoRouter = require("./routes/video");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const feedRouter = require("./routes/feed");

app.use(cors());
app.use(express.json());

app.use("/api/video", videoRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/feed", feedRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`this server is running on port ${port}`);
});
