const API = "https://real-time-chat-444b.onrender.com/"; // change this

// LOGIN
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/login`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.success) {
    localStorage.setItem("username", username);
    window.location.href = "/";
  } else {
    alert("Login failed");
  }
}

// REGISTER
async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  await fetch(`${API}/register`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, password })
  });

  alert("Registered!");
  window.location.href = "/login.html";
}

// SOCKET
const socket = io(API);
const room = "general";
const sender = localStorage.getItem("username") || "User";

socket.emit("joinRoom", room);

function sendMessage() {
  const message = document.getElementById("msg").value.trim();

  if (!message) return;

  socket.emit("sendMessage", {
    sender,
    content: message,
    room
  });

  document.getElementById("msg").value = "";
}

socket.on("receiveMessage", (data) => {
  document.getElementById("messages").innerHTML +=
    `<div><b>${data.sender}:</b> ${data.content}</div>`;
});