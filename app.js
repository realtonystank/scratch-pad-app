const express = require("express");
const socket = require("socket.io");
const path = require("path");
const app = express();
const port = 3003;
// -------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));
// -------------------------------------------------------
const server = app.listen(port, () => {
  console.log("Listening to port " + port);
});
// -------------------------------------------------------
const io = socket(server);
io.on("connection", (socket) => {
  console.log("socket connection established");
  socket.on("beginPath", (data) => {
    io.sockets.emit("beginPath", data);
  });
  socket.on("drawStroke", (data) => {
    io.sockets.emit("drawStroke", data);
  });
  socket.on("undoRedoCanvas", (data) => {
    io.sockets.emit("undoRedoCanvas", data);
  });
});
// -------------------------------------------------------
