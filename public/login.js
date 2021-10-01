function enviarLogin(e) {
  e.preventDefault();
  let username = document.getElementById("username").value;

  fetch("/productos/login/", {
    method: "POST",
    body: JSON.stringify({ username }),
    headers: { "content-type": "application/json" },
  }).then((res) => console.log(res));
}
