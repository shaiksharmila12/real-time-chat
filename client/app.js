const API = "http://localhost:5000/api/auth";

function register() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  fetch(`${API}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert(data.message);
      window.location.href = "login.html";
    })
    .catch((err) => {
      alert(err.message);
    });
}

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  fetch(`${API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then(async (res) => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);

      alert(data.message);
      window.location.href = "index.html";
    })
    .catch((err) => {
      alert(err.message);
    });
}