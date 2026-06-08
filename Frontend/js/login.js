const GOOGLE_CLIENT_ID = "183209466249-u9sdjn40gtsai35cdluva8jqtnir92r8.apps.googleusercontent.com";

function login() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  fetch("https://access-learning-platform.onrender.com/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);

      if (data.success === true) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userEmail", data.email);

        window.location.href = "04-dashboard.html";
      }
    })
    .catch(err => {
      alert("Backend is not connected");
      console.log(err);
    });
}

window.onload = function () {
  if (typeof google !== "undefined") {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin
    });

    google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      {
        theme: "outline",
        size: "large",
        text: "continue_with",
        width: 320
      }
    );
  }
};

function handleGoogleLogin(response) {
  fetch("https://access-learning-platform.onrender.com/api/google-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      credential: response.credential
    })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);

      if (data.success === true) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userEmail", data.email);

        window.location.href = "04-dashboard.html";
      }
    })
    .catch(err => {
      alert("Google login backend error" + err.message);
      console.log("Google frontend error:", err);
    });
}