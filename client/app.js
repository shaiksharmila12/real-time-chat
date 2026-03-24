const API = "https://real-time-chat-444b.onrender.com/"; // change this to your Render backend URL

function showAlert(message) {
  alert(message);
}

// LOGIN
async function login() {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  if (!usernameInput || !passwordInput) return;

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showAlert("Please enter username and password");
    return;
  }

  try {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("username", username);
      window.location.href = "/";
    } else {
      showAlert("Invalid username or password");
    }
  } catch (error) {
    showAlert("Login failed. Check backend connection.");
  }
}

// REGISTER
async function register() {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  if (!usernameInput || !passwordInput) return;

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    showAlert("Please enter username and password");
    return;
  }

  try {
    const res = await fetch(`${API}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      showAlert("Registered successfully");
      window.location.href = "/login.html";
    } else {
      showAlert("Registration failed");
    }
  } catch (error) {
    showAlert("Registration failed. Check backend connection.");
  }
}

// CHAT PAGE ONLY
let socket;
const msgInput = document.getElementById("msg");
const messagesBox = document.getElementById("messages");
const typingBox = document.getElementById("typing");
const currentUser = document.getElementById("currentUser");

if (msgInput && messagesBox) {
  socket = io(API);
  const room = "general";
  const sender = localStorage.getItem("username") || "Guest";

  if (currentUser) {
    currentUser.innerText = sender;
  }

  socket.emit("joinRoom", room);

  window.sendMessage = function () {
    const message = msgInput.value.trim();

    if (!message) return;

    socket.emit("sendMessage", {
      sender,
      content: message,
      room
    });

    msgInput.value = "";
  };

  socket.on("receiveMessage", (data) => {
    messagesBox.innerHTML += `
      <div class="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
        <span class="font-semibold text-indigo-600">${data.sender}:</span>
        <span class="text-gray-700">${data.content}</span>
      </div>
    `;
    messagesBox.scrollTop = messagesBox.scrollHeight;
  });

  msgInput.addEventListener("input", () => {
    socket.emit("typing", room);
  });

  socket.on("typing", () => {
    typingBox.innerText = "Someone is typing...";
    setTimeout(() => {
      typingBox.innerText = "";
    }, 1000);
  });

  msgInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
}https://real-time-chat-444b.onrender.com/