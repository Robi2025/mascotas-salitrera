const API_BASE_URL = window.APP_CONFIG?.apiBaseUrl || "http://localhost:3000";
const TOKEN_KEY = "mascotas_session";
let token = localStorage.getItem(TOKEN_KEY);
let currentUser = null;
let pets = [];
let editingId = null;
let deletingId = null;

const $ = (id) => document.getElementById(id);
const form = $("formMascota");
const lista = $("lista");
const loginCard = $("loginCard");
const userBar = $("userBar");
const adminCard = $("adminCard");
const editModal = $("editModal");
const deleteModal = $("deleteModal");

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  $("toast-container").appendChild(toast);
  setTimeout(() => { toast.classList.add("fade-out"); setTimeout(() => toast.remove(), 300); }, 3200);
}

async function api(path, options = {}) {
  const headers = { ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401) { clearSession(); throw new Error("Tu sesión venció. Ingresa nuevamente."); }
  if (!response.ok) throw new Error(errorMessage(data.error));
  return data;
}

function errorMessage(code) {
  const messages = {
    invalid_credentials: "Correo o contraseña incorrectos.", too_many_attempts: "Demasiados intentos. Espera 15 minutos.",
    email_exists: "Ese correo ya está registrado.", invalid_user_data: "Revisa los datos y la seguridad de la contraseña.",
    invalid_pet_data: "Revisa los datos de la mascota.", forbidden: "No tienes permiso para esa acción.",
    admin_required: "Esta acción requiere una cuenta administradora.", invalid_current_password: "La contraseña actual es incorrecta.",
    weak_password: "La nueva contraseña debe tener 10 caracteres, mayúscula, minúscula y número."
  };
  return messages[code] || "No fue posible completar la operación.";
}

function clearSession() {
  token = null; currentUser = null; localStorage.removeItem(TOKEN_KEY);
  document.body.classList.remove("authenticated"); loginCard.classList.remove("hidden"); $("passwordCard").classList.add("hidden"); userBar.classList.add("hidden"); adminCard.classList.add("hidden");
}

function showApp(user) {
  currentUser = user; document.body.classList.add("authenticated"); loginCard.classList.add("hidden"); $("passwordCard").classList.remove("hidden"); userBar.classList.remove("hidden");
  $("currentUser").textContent = `${user.name} · ${user.role === "admin" ? "Administrador" : `Depto ${user.department}`}`;
  const depto = $("depto");
  if (user.role === "resident") { depto.value = user.department || ""; depto.readOnly = true; adminCard.classList.add("hidden"); }
  else { depto.readOnly = false; adminCard.classList.remove("hidden"); loadUsers(); }
  loadPets();
}

$("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault(); const button = event.currentTarget.querySelector("button"); button.disabled = true;
  try {
    const data = await api("/auth/login", { method: "POST", body: JSON.stringify({ email: $("loginEmail").value.trim(), password: $("loginPassword").value }) });
    token = data.token; localStorage.setItem(TOKEN_KEY, token); event.currentTarget.reset(); showApp(data.user); showToast("Sesión iniciada.", "success");
  } catch (error) { showToast(error.message, "error"); } finally { button.disabled = false; }
});

$("logoutBtn").addEventListener("click", async () => { try { await api("/auth/logout", { method: "POST" }); } catch {} clearSession(); });
$("passwordForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await api("/auth/password", { method: "PUT", body: JSON.stringify({ currentPassword: $("currentPassword").value, newPassword: $("newPassword").value }) });
    event.currentTarget.reset(); showToast("Contraseña actualizada.", "success");
  } catch (error) { showToast(error.message, "error"); }
});

function filteredPets() {
  const search = $("searchInput").value.toLowerCase().trim(); const type = $("filterType").value;
  const result = pets.filter((pet) => !type || pet.tipo === type).filter((pet) => !search || [pet.nombre, pet.departamento, pet.contacto, pet.owner_name].some((v) => String(v || "").toLowerCase().includes(search)));
  const sort = $("sortBy").value;
  if (sort === "nombre-asc") result.sort((a, b) => a.nombre.localeCompare(b.nombre));
  if (sort === "nombre-desc") result.sort((a, b) => b.nombre.localeCompare(a.nombre));
  if (sort.startsWith("depto")) result.sort((a, b) => a.departamento.localeCompare(b.departamento, undefined, { numeric: true }) * (sort.endsWith("desc") ? -1 : 1));
  return result;
}

function renderPets() {
  lista.replaceChildren(); const visible = filteredPets(); $("listCount").textContent = `${visible.length} mascota${visible.length === 1 ? "" : "s"}`;
  if (!visible.length) { const empty = document.createElement("li"); empty.textContent = "No hay mascotas registradas."; lista.appendChild(empty); return; }
  visible.forEach((pet) => {
    const li = document.createElement("li"); const info = document.createElement("div"); info.className = "pet-info";
    info.textContent = `${pet.tipo === "perro" ? "🐕" : "🐈"} ${pet.nombre} · ${pet.tipo} · ${pet.departamento}${currentUser.role === "admin" ? ` · ${pet.owner_name || "Sin asignar"}` : ""}`;
    const actions = document.createElement("div"); actions.className = "pet-actions";
    const edit = document.createElement("button"); edit.className = "btn-action btn-edit"; edit.textContent = "Editar"; edit.onclick = () => openEdit(pet);
    const remove = document.createElement("button"); remove.className = "btn-action btn-delete"; remove.textContent = "Eliminar"; remove.onclick = () => { deletingId = pet.id; $("deletePetName").textContent = pet.nombre; deleteModal.classList.add("active"); };
    actions.append(edit, remove); li.append(info, actions); lista.appendChild(li);
  });
}

async function loadPets() {
  lista.textContent = "Cargando...";
  try { pets = await api("/mascotas"); renderPets(); } catch (error) { lista.textContent = ""; showToast(error.message, "error"); }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault(); const button = form.querySelector("button[type=submit]"); button.disabled = true;
  try {
    await api("/mascotas", { method: "POST", body: JSON.stringify({ nombre: $("nombre").value.trim(), tipo: $("tipo").value, departamento: $("depto").value.trim(), contacto: $("contacto").value.trim() }) });
    form.reset(); if (currentUser.role === "resident") $("depto").value = currentUser.department; showToast("Mascota registrada.", "success"); loadPets();
  } catch (error) { showToast(error.message, "error"); } finally { button.disabled = false; }
});

function openEdit(pet) {
  editingId = pet.id; $("editNombre").value = pet.nombre; $("editTipo").value = pet.tipo; $("editDepto").value = pet.departamento; $("editContacto").value = pet.contacto;
  $("editDepto").readOnly = currentUser.role === "resident"; editModal.classList.add("active");
}
$("btnSaveEdit").addEventListener("click", async () => {
  try {
    await api(`/mascotas/${editingId}`, { method: "PUT", body: JSON.stringify({ nombre: $("editNombre").value.trim(), tipo: $("editTipo").value, departamento: $("editDepto").value.trim(), contacto: $("editContacto").value.trim() }) });
    editModal.classList.remove("active"); showToast("Mascota actualizada.", "success"); loadPets();
  } catch (error) { showToast(error.message, "error"); }
});
$("btnCancelEdit").onclick = () => editModal.classList.remove("active");
$("btnCancelDelete").onclick = () => deleteModal.classList.remove("active");
$("btnConfirmDelete").addEventListener("click", async () => { try { await api(`/mascotas/${deletingId}`, { method: "DELETE" }); deleteModal.classList.remove("active"); showToast("Mascota eliminada.", "success"); loadPets(); } catch (error) { showToast(error.message, "error"); } });

async function loadUsers() {
  try {
    const users = await api("/users"); const list = $("usersList"); list.replaceChildren();
    users.forEach((user) => {
      const li = document.createElement("li"); const text = document.createElement("span"); text.textContent = `${user.name} · ${user.email} · ${user.role === "admin" ? "Administrador" : `Depto ${user.department}`} · ${user.active ? "Activo" : "Desactivado"}`;
      li.appendChild(text);
      if (user.id !== currentUser.id) { const button = document.createElement("button"); button.className = "btn-action"; button.textContent = user.active ? "Desactivar" : "Activar"; button.onclick = async () => { try { await api(`/users/${user.id}/status`, { method: "PUT", body: JSON.stringify({ active: !user.active }) }); loadUsers(); } catch (error) { showToast(error.message, "error"); } }; li.appendChild(button); }
      list.appendChild(li);
    });
  } catch (error) { showToast(error.message, "error"); }
}

$("residentForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  try {
    await api("/users", { method: "POST", body: JSON.stringify({ name: $("residentName").value.trim(), email: $("residentEmail").value.trim(), department: $("residentDepartment").value.trim(), password: $("residentPassword").value, role: "resident" }) });
    event.currentTarget.reset(); showToast("Residente creado.", "success"); loadUsers();
  } catch (error) { showToast(error.message, "error"); }
});

["searchInput", "filterType", "sortBy"].forEach((id) => $(id).addEventListener(id === "searchInput" ? "input" : "change", renderPets));
$("clearFilters").onclick = () => { $("searchInput").value = ""; $("filterType").value = ""; $("sortBy").value = "reciente"; renderPets(); };
editModal.onclick = (event) => { if (event.target === editModal) editModal.classList.remove("active"); };
deleteModal.onclick = (event) => { if (event.target === deleteModal) deleteModal.classList.remove("active"); };

document.addEventListener("DOMContentLoaded", async () => {
  if (!token) return clearSession();
  try { const data = await api("/auth/me"); showApp(data.user); } catch { clearSession(); }
});
