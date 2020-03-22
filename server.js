const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

const path = require("path");

const io = require("socket.io")(app);

io.on("connection", socket => {
  console.log("Connected");
  console.log("Socket", socket);
});

app.use(express.static(path.join(__dirname, "client/build/")));
app.use("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"), err => {
    if (err) return res.status(400).send(err);
  });
});

app.listen(PORT, () => console.log(`App is listening to port ${PORT}`));
