const API = "https://real-time-chat-444b.onrender.com";

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
      window.location.href = "/index.html";
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

    // TEMPORARY TEST: socket code fully disabled
    const room = "general";

    window.sendMessage = function () {
      const message = msgInput.value.trim();
      if (!message) return;

      // For testing only, do not send to backend
      msgInput.value = "";
    };

    msgInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }
}