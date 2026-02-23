// ====== CONFIGURACIÓN ======
const DEFAULT_API_BASE_URL = "http://localhost:3000";
const API_BASE_URL =
  window.APP_CONFIG?.apiBaseUrl ||
  localStorage.getItem("api_base_url") ||
  DEFAULT_API_BASE_URL;
const TOAST_DURATION = 3000; // ms

// ====== ELEMENTOS DEL DOM ======
const form = document.getElementById("formMascota");
const lista = document.getElementById("lista");
const toastContainer = document.getElementById("toast-container");
const errorBox = document.getElementById("error-box");
const errorMessage = document.getElementById("error-message");

// Elementos para herramientas de lista
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");
const sortBy = document.getElementById("sortBy");
const clearFiltersBtn = document.getElementById("clearFilters");
const listCount = document.getElementById("listCount");

// Elementos para modales
const editModal = document.getElementById("editModal");
const formEditMascota = document.getElementById("formEditMascota");
const btnCancelEdit = document.getElementById("btnCancelEdit");
const btnSaveEdit = document.getElementById("btnSaveEdit");
const deleteModal = document.getElementById("deleteModal");
const deletePetName = document.getElementById("deletePetName");
const btnCancelDelete = document.getElementById("btnCancelDelete");
const btnConfirmDelete = document.getElementById("btnConfirmDelete");

// ====== ESTADO GLOBAL ======
let mascotasData = []; // Guardar datos originales de API
let editingId = null; // ID de la mascota siendo editada
let deletingId = null; // ID de la mascota para eliminar

// ====== SISTEMA DE NOTIFICACIONES (TOAST) ======
function showToast(message, type = "info", duration = TOAST_DURATION) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "error") icon = "❌";
  if (type === "warning") icon = "⚠️";
  
  toast.textContent = `${icon} ${message}`;
  toastContainer.appendChild(toast);
  
  if (duration > 0) {
    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
  
  return toast;
}

// Mostrar error box con mensaje
function showErrorBox(message) {
  errorMessage.textContent = message;
  errorBox.classList.add("show");
  lista.classList.add("loading");
}

// Ocultar error box
function hideErrorBox() {
  errorBox.classList.remove("show");
  lista.classList.remove("loading");
}

// Validar un campo individual
function validateField(fieldId) {
  const field = document.getElementById(fieldId);
  const formGroup = field.closest(".form-group");
  const isValid = field.checkValidity() && field.value.trim() !== "";
  
  if (!isValid) {
    formGroup.classList.add("error");
  } else {
    formGroup.classList.remove("error");
  }
  
  return isValid;
}

// Validar todos los campos
function validateForm() {
  const nombre = document.getElementById("nombre");
  const tipo = document.getElementById("tipo");
  const depto = document.getElementById("depto");
  const contacto = document.getElementById("contacto");
  
  const fields = [
    { id: "nombre", minLength: 2 },
    { id: "tipo" },
    { id: "depto" },
    { id: "contacto" }
  ];
  
  let isValid = true;
  
  fields.forEach(({ id, minLength }) => {
    const field = document.getElementById(id);
    const formGroup = field.closest(".form-group");
    let fieldValid = field.checkValidity() && field.value.trim() !== "";
    
    if (minLength && field.value.trim().length < minLength) {
      fieldValid = false;
    }
    
    if (!fieldValid) {
      formGroup.classList.add("error");
      isValid = false;
    } else {
      formGroup.classList.remove("error");
    }
  });
  
  return isValid;
}

// Validación en tiempo real
["nombre", "tipo", "depto", "contacto"].forEach(fieldId => {
  const field = document.getElementById(fieldId);
  field.addEventListener("blur", () => validateField(fieldId));
  field.addEventListener("input", () => {
    if (field.closest(".form-group").classList.contains("error")) {
      validateField(fieldId);
    }
  });
});

// ====== MODALES - EDITAR ======
function openEditModal(mascota) {
  editingId = mascota.id;
  
  // Precargar datos
  document.getElementById("editNombre").value = mascota.nombre;
  document.getElementById("editTipo").value = mascota.tipo;
  
  // Limpiar "Depto" de departamento si existe
  let depto = mascota.departamento.replace(/^Depto\s*/i, '').trim();
  document.getElementById("editDepto").value = depto;
  
  document.getElementById("editContacto").value = mascota.contacto;
  
  // Limpiar errores del modal
  formEditMascota.querySelectorAll(".form-group").forEach(group => {
    group.classList.remove("error");
  });
  
  // Mostrar modal
  editModal.classList.add("active");
}

function closeEditModal() {
  editModal.classList.remove("active");
  editingId = null;
  formEditMascota.reset();
}

async function saveEdit() {
  if (!editingId) return;
  
  const nombre = document.getElementById("editNombre").value.trim();
  const tipo = document.getElementById("editTipo").value;
  let departamento = document.getElementById("editDepto").value.trim();
  const contacto = document.getElementById("editContacto").value.trim();
  
  // Validar
  if (!nombre || !tipo || !departamento || !contacto) {
    showToast("Por favor completa todos los campos", "warning");
    return;
  }
  
  if (nombre.length < 2) {
    showToast("El nombre debe tener al menos 2 caracteres", "warning");
    return;
  }
  
  // Normalizar departamento
  if (!departamento.toLowerCase().startsWith("depto")) {
    departamento = `Depto ${departamento}`;
  }
  
  btnSaveEdit.disabled = true;
  btnSaveEdit.textContent = "Guardando...";
  
  try {
    const res = await fetch(`${API_BASE_URL}/mascotas/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, tipo, departamento, contacto })
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${res.status}`);
    }
    
    showToast(`${nombre} actualizado exitosamente`, "success");
    closeEditModal();
    cargarMascotas();
    
  } catch (err) {
    console.error("[API] Error actualizando:", err.message);
    showToast(`Error: ${err.message}`, "error");
  } finally {
    btnSaveEdit.disabled = false;
    btnSaveEdit.textContent = "Guardar Cambios";
  }
}

// ====== MODALES - ELIMINAR ======
function openDeleteModal(mascota) {
  deletingId = mascota.id;
  deletePetName.textContent = mascota.nombre;
  deleteModal.classList.add("active");
}

function closeDeleteModal() {
  deleteModal.classList.remove("active");
  deletingId = null;
}

async function confirmDelete() {
  if (!deletingId) return;
  
  btnConfirmDelete.disabled = true;
  btnConfirmDelete.innerHTML = '<span class="spinner"></span> Eliminando...';
  
  try {
    const res = await fetch(`${API_BASE_URL}/mascotas/${deletingId}`, {
      method: "DELETE"
    });
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${res.status}`);
    }
    
    showToast("Mascota eliminada correctamente", "success");
    closeDeleteModal();
    cargarMascotas();
    
  } catch (err) {
    console.error("[API] Error eliminando:", err.message);
    showToast(`Error: ${err.message}`, "error");
  } finally {
    btnConfirmDelete.disabled = false;
    btnConfirmDelete.textContent = "Eliminar";
  }
}

// ====== VERIFICAR CONEXIÓN A API ======
async function checkAPIConnection() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error("API no responde correctamente");
    return true;
  } catch (err) {
    console.error("[API] Connection check failed:", err.message);
    return false;
  }
}

// ====== FUNCIÓN DE RENDERIZACIÓN CON FILTROS ======
function renderMascotas() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const typeFilter = filterType.value;
  const sortOption = sortBy.value;

  // Paso 1: Filtrar
  let filtered = mascotasData.filter(m => {
    // Filtro por tipo
    if (typeFilter && m.tipo !== typeFilter) return false;

    // Filtro por búsqueda (nombre, depto, contacto)
    if (searchTerm) {
      const nombre = m.nombre.toLowerCase();
      const depto = m.departamento.toLowerCase();
      const contacto = m.contacto.toLowerCase();
      
      if (!nombre.includes(searchTerm) && 
          !depto.includes(searchTerm) && 
          !contacto.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });

  // Paso 2: Ordenar
  if (sortOption === "nombre-asc") {
    filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else if (sortOption === "nombre-desc") {
    filtered.sort((a, b) => b.nombre.localeCompare(a.nombre));
  } else if (sortOption === "depto-asc") {
    filtered.sort((a, b) => {
      const deptoA = parseInt(a.departamento.replace(/\D/g, '')) || 0;
      const deptoB = parseInt(b.departamento.replace(/\D/g, '')) || 0;
      return deptoA - deptoB;
    });
  } else if (sortOption === "depto-desc") {
    filtered.sort((a, b) => {
      const deptoA = parseInt(a.departamento.replace(/\D/g, '')) || 0;
      const deptoB = parseInt(b.departamento.replace(/\D/g, '')) || 0;
      return deptoB - deptoA;
    });
  } else {
    // Por defecto, más reciente (mismo orden de API que es descendente)
    // Ya vienen en ese orden, no hacer nada
  }

  // Paso 3: Renderizar
  lista.innerHTML = "";

  if (filtered.length === 0) {
    lista.innerHTML = '<li style="text-align: center; color: #999;">📭 No se encontraron mascotas</li>';
    listCount.textContent = "0 mascotas";
    return;
  }

  filtered.forEach(m => {
    const li = document.createElement("li");
    const icon = m.tipo === "perro" ? "🐕" : "🐈";
    
    li.innerHTML = `
      <div class="pet-info">
        <span>${icon} <strong>${m.nombre}</strong> • ${m.tipo.charAt(0).toUpperCase() + m.tipo.slice(1)} • Depto ${m.departamento}</span>
      </div>
      <div class="pet-actions">
        <button type="button" class="btn-action btn-edit" data-id="${m.id}">✎ Editar</button>
        <button type="button" class="btn-action btn-delete" data-id="${m.id}">🗑 Eliminar</button>
      </div>
    `;
    
    // Event listeners para botones
    li.querySelector(".btn-edit").addEventListener("click", () => openEditModal(m));
    li.querySelector(".btn-delete").addEventListener("click", () => openDeleteModal(m));
    
    lista.appendChild(li);
  });

  // Actualizar contador
  listCount.textContent = `${filtered.length} mascota${filtered.length !== 1 ? 's' : ''}`;
}

// ====== CARGAR MASCOTAS ======
async function cargarMascotas() {
  lista.innerHTML = '';
  const loadingItem = document.createElement("li");
  loadingItem.style.textAlign = "center";
  loadingItem.style.color = "#999";
  loadingItem.innerHTML = '<span class="spinner"></span> Cargando mascotas...';
  lista.appendChild(loadingItem);
  
  hideErrorBox();

  try {
    const res = await fetch(`${API_BASE_URL}/mascotas`);
    
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }
    
    const mascotas = await res.json();

    if (!mascotas || mascotas.length === 0) {
      mascotasData = [];
      listCount.textContent = "0 mascotas";
      lista.innerHTML = '<li style="text-align: center; color: #999;">📭 No hay mascotas registradas aún</li>';
      return;
    }

    // Guardar datos y renderizar
    mascotasData = mascotas;
    renderMascotas();

  } catch (err) {
    console.error("[API] Error cargando mascotas:", err.message);
    const isConnectionError = err.message.includes("Failed to fetch");
    const message = isConnectionError 
      ? `No se puede conectar a la API en ${API_BASE_URL}. Verifica que esté corriendo.`
      : `Error al cargar mascotas: ${err.message}`;
    
    showErrorBox(message);
    lista.innerHTML = '';
  }
}

// ====== SUBMIT FORMULARIO ======
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validar formulario
  if (!validateForm()) {
    showToast("Por favor completa todos los campos correctamente", "warning", 4000);
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  const tipo = document.getElementById("tipo").value;
  let departamento = document.getElementById("depto").value.trim();
  const contacto = document.getElementById("contacto").value.trim();

  // Normalizar departamento (agregar "Depto " si no tiene)
  if (!departamento.toLowerCase().startsWith("depto")) {
    departamento = `Depto ${departamento}`;
  }

  const submitBtn = form.querySelector("button[type='submit']");
  const originalText = submitBtn.textContent;
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Guardando...';

  try {
    const res = await fetch(`${API_BASE_URL}/mascotas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, tipo, departamento, contacto })
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.error || `HTTP ${res.status}`);
    }

    showToast(`${nombre} registrado exitosamente`, "success");
    form.reset();
    cargarMascotas();

  } catch (err) {
    console.error("[API] Error al guardar:", err.message);
    
    if (err.message.includes("Failed to fetch")) {
      showToast(`No se puede conectar a ${API_BASE_URL}`, "error");
    } else {
      showToast(`Error: ${err.message}`, "error");
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});

// ====== EVENT LISTENERS PARA MODALES ======
btnCancelEdit.addEventListener("click", closeEditModal);
btnSaveEdit.addEventListener("click", saveEdit);

btnCancelDelete.addEventListener("click", closeDeleteModal);
btnConfirmDelete.addEventListener("click", confirmDelete);

// Cerrar modal al hacer click en el overlay
editModal.addEventListener("click", (e) => {
  if (e.target === editModal) closeEditModal();
});

deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) closeDeleteModal();
});

// Cerrar modales con tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeEditModal();
    closeDeleteModal();
  }
});

// ====== EVENT LISTENERS PARA HERRAMIENTAS DE LISTA ======
searchInput.addEventListener("input", () => {
  renderMascotas();
});

filterType.addEventListener("change", () => {
  renderMascotas();
});

sortBy.addEventListener("change", () => {
  renderMascotas();
});

clearFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  filterType.value = "";
  sortBy.value = "reciente";
  renderMascotas();
  showToast("Filtros limpios", "info");
});

// ====== INICIALIZACIÓN ======
document.addEventListener("DOMContentLoaded", async () => {
  console.log(`[INFO] API URL: ${API_BASE_URL}`);
  
  const apiOk = await checkAPIConnection();
  if (!apiOk) {
    console.warn(`[WARN] API no accesible en ${API_BASE_URL}`);
    showToast(`⚠️ API no responde. Intenta más tarde.`, "warning");
  } else {
    console.log("[INFO] API conectada");
  }
  
  cargarMascotas();
});

