function login() {
  const role = document.getElementById("role").value;

  if (role === "Admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "agent.html";
  }
}
``
