# Guía de Contribución - Mascotas Salitrera

Gracias por tu interés en contribuir a este proyecto. Esta guía explica cómo hacer cambios de forma responsable.

## Principios del Proyecto

- **Simplicidad primero**: Sin frameworks o herramientas de build innecesarias
- **Funcionamiento verificado**: Cada cambio se prueba manualmente antes de confirmar
- **Documentación clara**: El código explica su propósito
- **Compatibilidad**: Mantener soporte para navegadores modernos y Node.js 16+

## Configuración del Entorno

```bash
# Clonar repositorio
git clone <url-repo>
cd mascotas-salitrera

# Backend
cd backend
npm install
npm run dev    # Inicia en puerto 3000

# Frontend (en otra terminal)
cd frontend
# Usar Live Server extension en VS Code o:
npx http-server -p 5500
```

## Workflow de Cambios

### 1. Crear rama feautre
```bash
git checkout -b feature/descripcion-corta
# Ejemplo: feature/agregar-historial-ediciones
```

### 2. Realizar cambios

**Para cambios en el backend:**
- Modificar solo archivos en `backend/src/`
- No cambiar estructura de base de datos sin migración
- Mantener CORS actualizado si agregas nuevos orígenes
- Probar con curl: `curl http://localhost:3000/mascotas`

**Para cambios en el frontend:**
- Modificar archivos en `frontend/`
- Mantener app.js orgánico (sin minificar)
- No agregar dependencias externas sin justificación
- Probar en navegador (F12 console para errores)

### 3. Pruebas Manuales

Antes de hacer commit, verificar:

```bash
# Backend
✓ npm run dev sin errores
✓ GET /health responde {ok: true}
✓ GET /mascotas retorna array completo
✓ Las notificaciones toast aparecen en el frontend

# Frontend
✓ No hay errores en console (F12)
✓ Form validation funciona (campos requeridos)
✓ Búsqueda filtra en tiempo real
✓ Edit/Delete modals abren y cierran correctamente
✓ CRUD completo: crear, editar, ver, eliminar mascotas
```

### 4. Commit

```bash
git add .
git commit -m "tipo: descripción breve

Descripción más detallada de cambios si es necesario.
Referencia a issue: #123"
```

**Tipos válidos de commit:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato de código (sin cambio de funcionalidad)
- `refactor:` Reorganización sin cambios funcionales
- `perf:` Mejoras de performance
- `test:` Agregar o mejorar pruebas

### 5. Push y Pull Request

```bash
git push origin feature/descripcion-corta
```

En GitHub, crear PR con:
- **Título**: Breve descripción del cambio
- **Descripción**: 
  - Qué cambió y por qué
  - Cómo pruebabar los cambios
  - Screenshots si aplica (UI changes)
- **Checklist**:
  - [ ] Probé en backend
  - [ ] Probé en frontend
  - [ ] Actualicé documentación si fue necesario
  - [ ] No tengo conflictos con `main`

## Patrones de Código

### JavaScript

```javascript
// ✅ Preferir nombres descriptivos
const obtenerMascotasPorTipo = (tipo) => {
  return mascotasData.filter(m => m.tipo === tipo);
};

// ❌ Evitar
const getByType = (t) => mascotasData.filter(m => m.tipo === t);

// ✅ Usar async/await para API calls
const cargarMascotas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/mascotas`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    mascotasData = data;
    renderMascotas();
  } catch (error) {
    showToast(`Error al cargar: ${error.message}`, 'error');
  }
};

// ✅ Agregar comentarios para lógica compleja
// Filtrar mascotas que coincidan con búsqueda y tipo seleccionado
const filtradas = mascotasData.filter(m => {
  return (m.nombre.toLowerCase().includes(busqueda) ||
          m.departamento.toLowerCase().includes(busqueda) ||
          m.contacto.toLowerCase().includes(busqueda)) &&
         (tipoSeleccionado === 'todos' || m.tipo === tipoSeleccionado);
});
```

### CSS

```css
/* ✅ Usar variables configurables */
:root {
  --primary: #0f766e;
  --success: #10b981;
  --spacing: 1rem;
}

/* ✅ Mobile-first approach */
.button {
  padding: 0.5rem;
}

@media (min-width: 768px) {
  .button {
    padding: 1rem;
  }
}

/* ✅ Clases semánticas */
.pet-card.danger { /* Cuando está marcado para eliminar */ }

/* ❌ Evitar */
.red { color: red; } /* No descriptivo */
```

### HTML

```html
<!-- ✅ IDs para JS, clases para CSS -->
<input id="searchInput" class="search-bar" type="text">

<!-- ✅ Atributos semánticos -->
<button type="button" class="btn btn-delete" data-pet-id="5">
  Eliminar
</button>

<!-- ❌ Evitar -->
<input id="i1" style="color: red">
<button onclick="delete()">Del</button>
```

## Estructura de Carpetas

```
mascotas-salitrera/
├── backend/
│   ├── src/
│   │   ├── index.js       (API Express)
│   │   └── db.js          (SQLite setup)
│   ├── data/
│   │   └── mascotas.db    (generado)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── index.html         (Estructura)
│   ├── app.js             (Lógica)
│   └── styles.css         (Diseño)
├── README.md
├── SETUP.md
├── CONTRIBUTING.md        (este archivo)
├── .gitignore
└── .editorconfig
```

**Regla:** No agregar nuevas carpetas sin justificación y actualizar la documentación.

## Reportar Bugs

Si encuentras un bug, describe:

1. **Pasos para reproducir**
   ```
   1. Ir a http://localhost:5500
   2. Ingresar nombre con caracteres especiales: ño, é, ñ
   3. Hacer clic en Agregar
   ```

2. **Comportamiento esperado**
   - El pet debe guardarse con nombre correcto

3. **Comportamiento actual**
   - Error en la consola: "UTF-8 encoding failed"

4. **Entorno**
   - Node.js: v18.0.0
   - Browser: Chrome 120
   - OS: Windows 11

## Solicitar Funcionalidades

Usa la etiqueta `enhancement` en GitHub Issues con:
- **Descripción clara** de la funcionalidad
- **Caso de uso** (para qué la necesitan en el condominio)
- **Ejemplo** de uso si aplica
- **¿Afecta al backend o frontend?**

## Preguntas Frecuentes

**¿Puedo agregar React/Vue?**
No. El proyecto prioriza simplicidad. Si necesitas complejidad, considera un fork.

**¿Puedo cambiar la base de datos a PostgreSQL?**
Solo con una guía de migración clara en la documentación.

**¿Se puede deployar en producción?**
Sí, pero agrega autenticación y usa variables de entorno seguras (.env no en git).

**¿Hay tests?**
No actualmente. Se aceptan contribuciones que agreguen tests sin complejidad innecesaria.

## Contacto

- Issues: GitHub Issues
- Preguntas: Abre una Discussion
- Email: [contacto del proyecto]

---

**Último commit documentado:** Message 8 - Documentation y Setup
**Rama activa:** main
**Fecha última actualización:** 2024
