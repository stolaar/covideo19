const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const path = require("path");

app.use(express.static(path.join(__dirname, "client/build/")));
app.use("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"), err => {
    if (err) return res.status(400).send(err);
  });
});

const server = app.listen(PORT, () =>
  console.log(`App is listening to port ${PORT}`)
);

const io = require("socket.io")(server);
module.exports.io = io;
const SocketManager = require("./socket/SocketManager");
io.on("connection", SocketManager);
