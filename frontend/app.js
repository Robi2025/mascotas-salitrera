const API_URL = "http://localhost:3000";

const form = document.getElementById("formMascota");
const lista = document.getElementById("lista");

async function cargarMascotas() {
  lista.innerHTML = "<li>Cargando...</li>";

  try {
    const res = await fetch(`${API_URL}/mascotas`);
    const mascotas = await res.json();

    if (!mascotas.length) {
      lista.innerHTML = "<li>No hay mascotas registradas.</li>";
      return;
    }

    lista.innerHTML = "";
    mascotas.forEach(m => {
      const li = document.createElement("li");
      li.textContent = `${m.nombre} (${m.tipo}) - Depto ${m.departamento}`;
      lista.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    lista.innerHTML = "<li>Error conectando con la API</li>";
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    nombre: document.getElementById("nombre").value,
    tipo: document.getElementById("tipo").value,
    departamento: document.getElementById("depto").value,
    contacto: document.getElementById("contacto").value
  };

  await fetch(`${API_URL}/mascotas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  form.reset();
  cargarMascotas();
});

cargarMascotas();
