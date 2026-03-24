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
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let users = [];

// test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// register
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const existingUser = users.find((u) => u.username === username);
  if (existingUser) {
    return res.json({ success: false, message: "User already exists" });
  }

  users.push({ username, password });
  res.json({ success: true });
});

// login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

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
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});