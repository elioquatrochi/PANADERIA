document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const contrasenia = document.getElementById("contrasenia").value.trim();

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, contrasenia })
    });

    const data = await res.json();

    if (data.success) {
      if (data.rol === "admin") {
        window.location.href = "/html/index.html"; // admin
      } else {
        window.location.href = "/html/indexCliente.html"; // cliente
      }
    } else {
      alert("❌ Usuario o contraseña incorrectos");
    }
  } catch (err) {
    console.error("Error en login:", err);
    alert("⚠️ Error en el servidor");
  }
});
