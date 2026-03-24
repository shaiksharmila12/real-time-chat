const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

let users = [];

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// REGISTER
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  users.push({ username, password });

  res.json({ success: true });
});

// SOCKET
io.on("connection", (socket) => {

  socket.on("joinRoom", (room) => {
    socket.join(room);
  });

  socket.on("sendMessage", (data) => {
    io.to(data.room).emit("receiveMessage", data);
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("typing");
  });

});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server running"));