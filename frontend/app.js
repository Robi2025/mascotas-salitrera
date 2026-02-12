const API_URL = "http://localhost:3000";

const form = document.getElementById("form-mascota");
const lista = document.getElementById("lista");
const msg = document.getElementById("msg");

async function cargarMascotas() {
  const res = await fetch(`${API_URL}/mascotas`);
  const data = await res.json();
  lista.innerHTML = "";
  data.forEach((m) => {
    const li = document.createElement("li");
    li.textContent = `${m.nombre} (${m.tipo}) - Depto ${m.departamento} - ${m.contacto}`;
    lista.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  const res = await fetch(`${API_URL}/mascotas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    msg.textContent = "Error al registrar la mascota.";
    return;
  }

  form.reset();
  msg.textContent = "Mascota registrada.";
  cargarMascotas();
});

cargarMascotas();
