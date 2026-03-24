const API = "https://your-backend.onrender.com"; // <-- ikkada nee Render backend URL pettu

function showAlert(message) {
  alert(message);
}

function logout() {
  localStorage.removeItem("username");
  window.location.href = "/login.html";
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

// CHAT PAGE
let socket;
const msgInput = document.getElementById("msg");
const messagesBox = document.getElementById("messages");
const typingBox = document.getElementById("typing");
const currentUser = document.getElementById("currentUser");

if (msgInput && messagesBox) {
  const sender = localStorage.getItem("username");

  if (!sender) {
    window.location.href = "/login.html";
  } else {
    if (currentUser) {
      currentUser.innerText = sender;
    }

    socket = io(API);
    const room = "general";

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
      const isMine = data.sender === sender;

      const wrapper = document.createElement("div");
      wrapper.className = `flex ${isMine ? "justify-end" : "justify-start"}`;

      const bubble = document.createElement("div");
      bubble.className = isMine
        ? "max-w-[75%] bg-gradient-to-r from-cyan-500 to-indigo-500 text-white rounded-2xl rounded-br-md px-4 py-3 shadow-lg"
        : "max-w-[75%] bg-white/10 text-white border border-white/10 rounded-2xl rounded-bl-md px-4 py-3 shadow";

      bubble.innerHTML = `
        <div class="text-xs mb-1 ${isMine ? "text-cyan-100" : "text-slate-300"} font-semibold">
          ${data.sender}
        </div>
        <div class="break-words">${data.content}</div>
      `;

      wrapper.appendChild(bubble);
      messagesBox.appendChild(wrapper);
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
  }
}