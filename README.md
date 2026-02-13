# 🐾 Mascotas Salitrera María Elena

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.19-blue?logo=express)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite3-5.1-003B57?logo=sqlite)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success)](#)

**Sistema moderno de registro de mascotas para condominios**

[Características](#-características) • [Instalación](#-instalación-rápida) • [API](#-documentación-api) • [Arquitectura](#-arquitectura-del-sistema) • [Contribuir](#-contribuir)

</div>

---

## 📖 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura-del-sistema)
- [Instalación](#-instalación-rápida)
- [Uso](#-guía-de-uso)
- [API](#-documentación-api)
- [Desarrollo](#-desarrollo)
- [Troubleshooting](#-troubleshooting)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 📌 Descripción General

**Mascotas Salitrera María Elena** es una aplicación web de propósito específico diseñada para facilitar el registro y administración de mascotas en el condominio Salitrera María Elena (región de Antofagasta, Chile).

### Problema que Resuelve
- 🏘️ **Registros desorganizados**: Mantener un control centralizado de mascotas por departamento
- 📱 **Acceso rápido**: Consultar contactos de dueños de mascotas instantáneamente
- 🔍 **Búsqueda eficiente**: Encontrar mascotas por nombre, departamento o tipo
- ✏️ **Administración flexible**: Actualizar información de mascotas sin perder historial

### Ventajas Clave
✅ **Zero Dependencies Frontend** - No requiere frameworks pesados  
✅ **Instalación Rápida** - Setup en menos de 5 minutos  
✅ **Offline Capable** - Funciona sin internet después del primer uso (datos locales)  
✅ **Seguro para Intranet** - Diseñado para uso interno del condominio  
✅ **Completamente Documentado** - Código limpio y fácil de mantener  

---

## 📸 Galería

### Condominio Salitrera María Elena

<div align="center">

**Ubicado en la región de Antofagasta, Chile**

| Fachada | Áreas Comunes | Interior |
|---------|---------------|----------|
| ![Fachada](assets/condominio/fachada.jpg) | ![Areas](assets/condominio/areas-comunes.jpg) | ![Interior](assets/condominio/interior.jpg) |

</div>

### Interfaz de la Aplicación

<div align="center">

| Dashboard | Formulario | Edición |
|-----------|-----------|---------|
| ![Dashboard](assets/screenshots/dashboard.png) | ![Formulario](assets/screenshots/formulario.png) | ![Editar](assets/screenshots/editar.png) |

**Panel de búsqueda y filtros** | **Gestión de mascotas** | **Notificaciones en tiempo real** |

</div>

---

## ⚙️ Stack Tecnológico

<table>
<tr>
<td align="center"><b>Backend</b></td>
<td align="center"><b>Frontend</b></td>
<td align="center"><b>Database</b></td>
<td align="center"><b>DevTools</b></td>
</tr>
<tr>
<td>
<br>
🟢 <b>Node.js</b> v16+<br>
📦 <b>Express</b> 4.19<br>
🔄 <b>CORS</b> 2.8<br>
🛠️ <b>SQLite3</b> 5.1<br>
</td>
<td>
<br>
📄 <b>HTML5</b><br>
🎨 <b>CSS3</b> (Custom)<br>
⚡ <b>Vanilla JS</b><br>
✨ <b>Fetch API</b><br>
</td>
<td>
<br>
🗄️ <b>SQLite3</b><br>
📊 Table: mascotas<br>
🔐 Constraints CHECK<br>
⏱️ Timestamps<br>
</td>
<td>
<br>
📋 <b>npm</b> 7+<br>
🚀 <b>Git</b> 2.0<br>
🔧 <b>VS Code</b><br>
🌐 <b>Live Server</b><br>
</td>
</tr>
</table>

---

## 🎯 Características

### 1. **CRUD Completo** 
Gestión total del ciclo de vida de registros:
- ✅ **Create** (POST /mascotas) - Agregar nuevas mascotas con validación
- 📖 **Read** (GET /mascotas) - Listar todas las mascotas registradas
- ✏️ **Update** (PUT /mascotas/:id) - Editar información existente
- 🗑️ **Delete** (DELETE /mascotas/:id) - Eliminar registros con confirmación

### 2. **Búsqueda y Filtros Avanzados**
```
🔍 Búsqueda en tiempo real por:
  ├─ Nombre de mascota
  ├─ Número de departamento
  └─ Contacto del dueño

🏷️ Filtros:
  ├─ Tipo: Perro / Gato / Todos
  └─ Ordenamiento: 5 opciones personalizables

📊 Contador dinámico:
  └─ "Mostrando 3 de 12 mascotas"
```

### 3. **Interfaz Moderna y Responsiva**
- 📱 **Responsive Design**: Funciona perfecto en mobile, tablet y desktop
- 🎨 **Diseño SaaS**: Gradientes modernos, bordes redondeados, sombras suaves
- ⚡ **Animaciones Fluidas**: Transiciones de 300ms para mejor UX
- 🔔 **Toast Notifications**: Feedback visual de todas las acciones
- ⏳ **Loading States**: Spinner durante operaciones API
- 🎭 **Modales Accesibles**: Editar y confirmar con overlay claro

### 4. **Validación Robusta**
```
Frontend:
├─ Minlength (2 caracteres)
├─ Campos requeridos (*)
├─ Validación en tiempo real
└─ Mensajes de error claros

Backend:
├─ Revalidación de todos los campos
├─ Check de tipo válido (perro|gato)
├─ ID existence check
└─ Error handling completo
```

### 5. **API REST Profesional**
- ✅ Respuestas JSON consistentes
- ✅ Códigos HTTP semánticos (201, 400, 404, 500)
- ✅ CORS configurado para desarrollo
- ✅ Documentación integrada
- ✅ Ejemplos con curl incluidos

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────┐
│          NAVEGADOR DEL USUARIO              │
│  (Chrome, Firefox, Safari, Edge)            │
└────────────┬────────────────────────────────┘
             │
             │ HTTP/REST (JSON)
             │
     ┌───────▼─────────┐
     │   FRONTEND      │
     │                 │
     │ ┌─────────────┐ │
     │ │ index.html  │ │ Estructura semántica
     │ ├─────────────┤ │
     │ │ styles.css  │ │ Diseño responsivo
     │ ├─────────────┤ │
     │ │   app.js    │ │ Lógica interactiva
     │ └─────────────┘ │
     │                 │
     │ Puerto 5500     │
     │ (Live Server)   │
     └────────┬────────┘
              │
              │ fetch() → GET, POST, PUT, DELETE
              │
     ┌────────▼──────────────────┐
     │    BACKEND (Express)       │
     │                            │
     │  ┌──────────────────────┐  │
     │  │ src/index.js         │  │
     │  │ API REST Routes      │  │
     │  │ CORS Middleware      │  │
     │  └──────────────────────┘  │
     │                            │
     │  ┌──────────────────────┐  │
     │  │ src/db.js            │  │
     │  │ SQLite Connection    │  │
     │  │ Table Init           │  │
     │  └──────────────────────┘  │
     │                            │
     │ Puerto 3000                │
     │ Node.js v16+               │
     └────────┬───────────────────┘
              │
              │ File I/O
              │
     ┌────────▼──────────────┐
     │  SQLite Database      │
     │                       │
     │  data/mascotas.db     │
     │                       │
     │  ┌─────────────────┐  │
     │  │ TABLE: mascotas │  │
     │  │ ├─ id (PK)      │  │
     │  │ ├─ nombre       │  │
     │  │ ├─ tipo         │  │
     │  │ ├─ departamento │  │
     │  │ ├─ contacto     │  │
     │  │ └─ created_at   │  │
     │  └─────────────────┘  │
     └───────────────────────┘
```

### Flujo de Datos (Ejemplo: Crear Mascota)

```
Usuario en Frontend
       ↓
Completa formulario (nombre, tipo, depto, contacto)
       ↓
Hace clic en "Agregar Mascota"
       ↓
JavaScript valida campos localmente
       ↓
Muestra spinner "Guardando..."
       ↓
fetch(POST /mascotas) con JSON
       ↓
Backend Express recibe request
       ↓
Re-valida datos + tipo ENUM
       ↓
Inserta en SQLite DB
       ↓
Retorna 201 + id
       ↓
Frontend recibe respuesta
       ↓
Toast "✓ Mascota agregada!"
       ↓
Recarga lista con nueva mascota
       ↓
Limpia formulario
```

---

## 🚀 Instalación Rápida

### Requisitos Previos
- **Node.js** v16 o superior ([descargar](https://nodejs.org/))
- **npm** 7 o superior (viene con Node.js)
- **Git** 2.0+ (opcional, para clonar)
- Editor de código (VS Code recomendado)

### Paso 1: Obtener el Proyecto
```bash
# Opción A: Clonar desde GitHub
git clone https://github.com/Robi2025/mascotas-salitrera.git
cd mascotas-salitrera

# Opción B: Descargar ZIP
# https://github.com/Robi2025/mascotas-salitrera/archive/refs/heads/main.zip
# Descomprimiry abrir carpeta
```

### Paso 2: Instalar Dependencias Backend
```bash
cd backend
npm install
```

**Output esperado:**
```
added 63 packages in 8s
```

### Paso 3: Configurar Entorno (Opcional)
```bash
# Solo si necesitas valores diferentes a los defaults
cp .env.example .env

# Editar .env:
# PORT=3000
# DB_PATH=./data/mascotas.db
```

### Paso 4: Iniciar Servidor Backend
```bash
npm run dev
```

**Output esperado:**
```json
[14:32:15] API Mascotas Salitrera escuchando en puerto 3000
[14:32:15] DB inicializado en: ./data/mascotas.db
```

### Paso 5: Abrir Frontend
**Opción A: Live Server (VS Code)**
1. Instalar extensión "Live Server" (ID: ritwickdey.LiveServer)
2. Click derecho en `frontend/index.html` → "Open with Live Server"
3. Se abre automáticamente en http://localhost:5500

**Opción B: Python (si tienes Python 3)**
```bash
cd frontend
python -m http.server 5500
```

**Opción C: Node (sin dependencias extra)**
```bash
cd frontend
npx http-server -p 5500
```

✅ **¡Listo!** Abre http://localhost:5500 en tu navegador

---

## 🎮 Guía de Uso

### Crear una Mascota
1. Completa el formulario en la parte superior:
   - **Nombre**: mín. 2 caracteres
   - **Tipo**: Selecciona "Perro" o "Gato"
   - **Departamento**: Número (ej: 401)
   - **Contacto**: Teléfono o email del dueño
2. Haz clic en "➕ Agregar Mascota"
3. Recibirás una notificación verde confirmando
4. La mascota aparecerá al tope de la lista

### Buscar Mascotas
- Escribe en el campo **Buscar** (arriba de la lista)
- Búsqueda en tiempo real por:
  - Nombre de la mascota
  - Número de departamento
  - Contacto del dueño
- La búsqueda es **case-insensitive**

### Filtrar y Ordenar
**Filtro por tipo:**
- Todos (reset)
- Perros (solo tipo='perro')
- Gatos (solo tipo='gato')

**Ordenamiento (5 opciones):**
- **Más reciente**: Agregadas recientemente primero
- **Nombre A→Z**: Orden alfabético ascendente
- **Nombre Z→A**: Orden alfabético descendente
- **Depto ↑**: Número de departamento ascendente
- **Depto ↓**: Número de departamento descendente

### Editar una Mascota
1. Haz clic en el botón **✏️ Editar** en la mascota
2. Se abre un modal con los datos actuales
3. Modifica lo que necesites
4. Haz clic en **Guardar cambios**
5. Recibe confirmación "✓ Mascota actualizada"

### Eliminar una Mascota
1. Haz clic en **🗑️ Eliminar** en la mascota
2. Se abre modal de confirmación
3. Revisa el nombre mostrado
4. Haz clic en **Confirmar eliminación**
5. Recibe confirmación "✓ Mascota eliminada"

### Limpiar Filtros
- Haz clic en **🔄 Limpiar** para resetear búsqueda y filtros

---

## 📡 Documentación API

### Endpoints Base
**Base URL:** `http://localhost:3000`

### 1. Health Check
```http
GET /health
```
**Respuesta:**
```json
{
  "ok": true
}
```
**Caso de uso:** Verificar que el servidor esté activo.

---

### 2. Listar Mascotas
```http
GET /mascotas
```

**Respuesta (200 OK):**
```json
[
  {
    "id": 5,
    "nombre": "Max",
    "tipo": "perro",
    "departamento": "301",
    "contacto": "912345678",
    "created_at": "2024-02-13 14:32:10"
  },
  {
    "id": 4,
    "nombre": "Misi",
    "tipo": "gato",
    "departamento": "205",
    "contacto": "998765432",
    "created_at": "2024-02-12 10:15:45"
  }
]
```

**Con curl:**
```bash
curl -X GET http://localhost:3000/mascotas
```

---

### 3. Crear Mascota
```http
POST /mascotas
Content-Type: application/json

{
  "nombre": "Bella",
  "tipo": "gato",
  "departamento": "502",
  "contacto": "987654321"
}
```

**Respuesta (201 Created):**
```json
{
  "id": 6,
  "nombre": "Bella",
  "tipo": "gato",
  "departamento": "502",
  "contacto": "987654321",
  "created_at": "2024-02-13 15:45:22"
}
```

**Error (400 Bad Request):**
```json
{
  "error": "missing_fields",
  "message": "Falta: nombre, contacto"
}
```

**Error (400 Invalid Tipo):**
```json
{
  "error": "invalid_tipo",
  "message": "Tipo debe ser 'perro' o 'gato'"
}
```

**Con curl:**
```bash
curl -X POST http://localhost:3000/mascotas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Bella",
    "tipo": "gato",
    "departamento": "502",
    "contacto": "987654321"
  }'
```

---

### 4. Actualizar Mascota
```http
PUT /mascotas/6
Content-Type: application/json

{
  "nombre": "Bella Actualizada",
  "tipo": "gato",
  "departamento": "503",
  "contacto": "987654321"
}
```

**Respuesta (200 OK):**
```json
{
  "id": 6,
  "nombre": "Bella Actualizada",
  "tipo": "gato",
  "departamento": "503",
  "contacto": "987654321",
  "created_at": "2024-02-13 15:45:22",
  "updated_at": "2024-02-13 16:20:00"
}
```

**Error (404 Not Found):**
```json
{
  "error": "not_found",
  "message": "Mascota con ID 999 no existe"
}
```

**Con curl:**
```bash
curl -X PUT http://localhost:3000/mascotas/6 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Bella Actualizada",
    "tipo": "gato",
    "departamento": "503",
    "contacto": "987654321"
  }'
```

---

### 5. Eliminar Mascota
```http
DELETE /mascotas/6
```

**Respuesta (200 OK):**
```json
{
  "success": true,
  "id": 6,
  "message": "Mascota eliminada correctamente"
}
```

**Error (404 Not Found):**
```json
{
  "error": "not_found",
  "message": "Mascota con ID 999 no existe"
}
```

**Con curl:**
```bash
curl -X DELETE http://localhost:3000/mascotas/6
```

---

### 6. Root Endpoint
```http
GET /
```

**Respuesta (200 OK):**
```
API Mascotas Salitrera funcionando 🐶🐱
```

---

## 🛠️ Desarrollo

### Scripts Disponibles

```bash
# Backend
cd backend

npm run dev      # Inicia servidor con auto-reload (nodemon recomendado)
npm start        # Inicia servidor (sin reload)

# Frontend
cd frontend
# Just open index.html with Live Server o:
npx http-server -p 5500
```

### Estructura de Carpetas

```
mascotas-salitrera/
│
├── 📄 README.md            # Documentación (este archivo)
├── 📄 SETUP.md             # Guía de instalación paso a paso
├── 📄 CONTRIBUTING.md      # Guía para contribuidores
├── 📄 LICENSE              # MIT License
├── .editorconfig           # Configuración de editor unificada
├── .gitignore              # Git ignore patterns
│
├── backend/                # 🔧 Servidor Node.js/Express
│   ├── src/
│   │   ├── index.js        # API REST endpoints + middleware
│   │   └── db.js           # SQLite setup y schema
│   ├── data/
│   │   └── mascotas.db     # Base de datos (generada automáticamente)
│   ├── package.json        # Dependencias backend
│   ├── .env.example        # Plantilla de variables de entorno
│   └── .env                # Variables reales (no en git)
│
└── frontend/               # 🎨 HTML/CSS/JS puro
    ├── index.html          # Estructura (170 líneas)
    ├── styles.css          # Diseño moderno SaaS (632 líneas)
    ├── app.js              # Lógica interactiva (500 líneas)
    └── .editorconfig       # Para evitar tabs/spaces
```

### Estándares de Código

**JavaScript:**
- ✅ Usar `const` por defecto, `let` si es necesario
- ✅ Arrow functions para callbacks
- ✅ Template literals para strings
- ✅ Comentarios para lógica compleja
- ❌ No minificar (mantener legible)

**CSS:**
- ✅ Usar CSS variables para colores
- ✅ Mobile-first approach
- ✅ BEM para clases cuando sea aplicable
- ❌ Evitar clases genéricas (no usar .red, .big)

**HTML:**
- ✅ IDs para JavaScript, clases para CSS
- ✅ Elementos semánticos (<header>, <main>, <section>)
- ✅ ARIA labels para accesibilidad
- ❌ No usar onclick inline

### Variables de Entorno Disponibles

```bash
# backend/.env
PORT=3000                           # Puerto del servidor
DB_PATH=./data/mascotas.db          # Ruta de la BD
NODE_ENV=development                # development|production
FRONTEND_ORIGIN=http://localhost:5500 # CORS origin
```

Más detalles en `backend/.env.example`

---

## 🐛 Troubleshooting

### Error: "Cannot find module express"
```
❌ Error: Cannot find module 'express'

✅ Solución:
cd backend
npm install
```

### Error: "EADDRINUSE: address already in use :::3000"
```
❌ El puerto 3000 ya está en uso

✅ Soluciones:
1. Termina el proceso que use el puerto:
   Windows: netstat -ano | findstr :3000
           taskkill /PID <PID> /F
   
2. Cambia el puerto en .env:
   PORT=3001

3. Espera 1 minuto (el puerto se libera automáticamente)
```

### Error: "Failed to fetch from http://localhost:3000"
```
❌ El frontend no puede conectar con el backend

✅ Verifica:
1. Backend está corriendo:
   cd backend && npm run dev
   
2. Abre en navegador: http://localhost:3000/health
   Debe responder: {"ok": true}
   
3. Revisa CORS en backend/.env o src/index.js
   Asegúrate que tu origen esté permitido
   
4. Console del navegador (F12):
   Busca errores CORS en pestañaNetwork
```

### Error: "database is locked"
```
❌ Error: database disk image malformed

✅ Soluciones:
1. Borra la BD:
   rm backend/data/mascotas.db
   
2. Reinicia backend:
   npm run dev
   
3. Se creará nueva BD automáticamente
```

### Los cambios no se guardan
```
❌ Edité una mascota pero no cambió

✅ Verifica:
1. La notificación toast dice "✓ Mascota actualizada"?
   Si no, hay error en API
   
2. Abre F12 > Network
   Haz clic en Edit
   Revisa la request PUT /mascotas/:id
   
3. ¿Status 200?
   Check respuesta en JSON
   
4. Si falla, revisa backend logs:
   cd backend && npm run dev
```

### El formulario no valida
```
❌ Puedo enviar campos vacíos

✅ El navegador debe soportar HTML5 validation:
- Chrome 5+
- Firefox 4+
- Safari 5+
- Edge/IE 10+

Si usas navegador muy antiguo, actualiza.
```

### Acceso denegado a BD
```
❌ Error: EACCES: permission denied

✅ Soluciones (Linux/Mac):
sudo chown -R $USER:$USER backend/data/
chmod -R 755 backend/data/

WindowsEl propietario de la carpeta debe ser tu usuario
```

---

## 🗺️ Roadmap

### Fase 1: MVP ✅ (Completado)
- [x] CRUD básico
- [x] Búsqueda y filtros
- [x] Interfaz HTML/CSS/JS
- [x] API REST
- [x] Documentación

### Fase 2: Mejoras UX (Pendiente)
- [ ] Exportar a CSV
- [ ] Búsqueda avanzada (regex)
- [ ] Historial de cambios
- [ ] Backup automático
- [ ] Dark mode
- [ ] Multidioma (ES/EN)

### Fase 3: Escalabilidad (Futuro)
- [ ] Autenticación + roles
- [ ] PostgreSQL en lugar de SQLite
- [ ] Docker + deployment
- [ ] Notificaciones por email
- [ ] Sincronización en tiempo real
- [ ] Móvil (React Native)

### Fase 4: Comunidad
- [ ] User testing con residentes
- [ ] Feedback y iteración
- [ ] Documentación en video
- [ ] Chat de soporte

---

## 🤝 Contribuir

¿Quieres mejorar este proyecto? ¡Bienvenido!

Lee la guía completa: [CONTRIBUTING.md](CONTRIBUTING.md)

**Pasos rápidos:**
1. Fork el repositorio
2. Crea rama: `git checkout -b feature/tu-idea`
3. Realiza cambios + pruebas
4. Commit: `git commit -m "feat: descripción"`
5. Push: `git push origin feature/tu-idea`
6. Pull Request a `main`

**Áreas donde podemos ayuda:**
- 🐛 Reportar bugs
- 🎨 Mejoras de diseño
- 📝 Documentación
- 🌐 Traducciones
- ⚡ Performance
- 🔒 Seguridad

---

## 📜 Licencia

MIT License © 2024 Robi2025

Eres libre de usar, modificar y distribuir este software bajo los términos de la MIT License.

Ver [LICENSE](LICENSE) para detalles completos.

---

## 📞 Contacto y Soporte

### Reportar un Bug
👉 [GitHub Issues](https://github.com/Robi2025/mascotas-salitrera/issues)

### Preguntas o Sugerencias
👉 [GitHub Discussions](https://github.com/Robi2025/mascotas-salitrera/discussions)

### Contacto Directo
- **Email**: contacto@salitreramariahellena.cl
- **Responsable**: Equipo de Residentes
- **Ubicación**: Antofagasta, Región de Antofagasta, Chile

---

## 🎓 Créditos

**Desarrolladores:**
- Diseño & Código: Robi2025 🎨💻

**Stack Inspirado en:**
- Express.js Best Practices
- SQLite3 Production Patterns
- Web Components Standards

**Testeado en:**
- ✅ Chrome 120
- ✅ Firefox 121
- ✅ Safari 17
- ✅ Edge 120

---

## 📊 Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Líneas de Código** | ~1,300 |
| **Dependencias Backend** | 3 |
| **Dependencias Frontend** | 0 |
| **Tamaño Mínimo** | ~450 KB (con BD vacía) |
| **Endpoints** | 6 |
| **Campos por Registro** | 5 |
| **Tiempo Instalación** | ~3 minutos |
| **Supported Browsers** | 99%+ |

---

<div align="center">

**⭐ Si este proyecto te fue útil, no olvides dejar una estrella en GitHub** ⭐

Hecho con ❤️ para la comunidad de Salitrera María Elena

[Volver al inicio](#-mascotas-salitrera-maría-elena)

</div>

### 4️⃣ Levantar el backend
```bash
# Opción A: Desarrollo (modo watch)
npm run dev

# Opción B: Producción
npm start
```

Deberías ver:
```
╔════════════════════════════════════════════╗
║  API Mascotas Salitrera escuchando        ║
║  🚀 http://localhost:3000                 ║
║  ✅ CORS habilitado para:                 ║
║     - http://127.0.0.1:5500               ║
║     - http://localhost:5500               ║
╚════════════════════════════════════════════╝
```

### 5️⃣ Abrir el frontend

**Opción A: Con VS Code + Live Server (recomendado)**
1. Abre `frontend/index.html` en VS Code
2. Click derecho → **"Open with Live Server"**
3. Se abre automáticamente en http://127.0.0.1:5500

**Opción B: Con Python (si tienes instalado)**
```bash
cd frontend
python -m http.server 5500
```

Luego abre http://localhost:5500

---

## 📡 API Endpoints

Base URL: `http://localhost:3000`

### `GET /`
Prueba básica de conexión
```
Respuesta: "API Mascotas Salitrera funcionando 🐶🐱"
```

### `GET /health`
Health check
```json
Respuesta: { "ok": true }
```

### `GET /mascotas`
Listar todas las mascotas
```json
Respuesta: [
  {
    "id": 1,
    "nombre": "Max",
    "tipo": "perro",
    "departamento": "Depto 101",
    "contacto": "+56912345678",
    "created_at": "2026-02-13T10:30:00.000Z"
  },
  ...
]
```

### `POST /mascotas`
Crear nueva mascota
```json
Body: {
  "nombre": "Max",
  "tipo": "perro",
  "departamento": "Depto 101",
  "contacto": "+56912345678"
}

Respuesta: { "id": 1, "nombre": "Max", ... }
Status: 201 Created
```

### `PUT /mascotas/:id`
Actualizar mascota
```json
Body: {
  "nombre": "Max Rosa",
  "tipo": "perro",
  "departamento": "Depto 202",
  "contacto": "+56987654321"
}

Respuesta: { "id": 1, "nombre": "Max Rosa", ... }
Status: 200 OK
```

### `DELETE /mascotas/:id`
Eliminar mascota
```json
Respuesta: { "success": true, "id": 1 }
Status: 200 OK
```

---

## 🛠️ Scripts npm (Backend)

```bash
# Desarrollo (modo watch, auto-reinicia)
npm run dev

# Producción (sin watch)
npm start
```

---

## 📁 Estructura del Proyecto

```
mascotas-salitrera/
├── backend/
│   ├── data/
│   │   └── mascotas.db        # Base de datos SQLite
│   ├── src/
│   │   ├── index.js           # Servidor Express
│   │   └── db.js              # Inicialización SQLite
│   ├── package.json
│   ├── .env.example           # Variables de entorno
│   └── .env                   # Variables reales (no commit)
│
├── frontend/
│   ├── index.html             # Estructura HTML
│   ├── app.js                 # Lógica JS (CRUD + filtros)
│   ├── styles.css             # Estilos CSS3
│
└── README.md                  # Este archivo
```

---

## 🔧 Configuración (Optional)

Si necesitas cambiar puertos o ruta de BD, crea `backend/.env`:

```env
# Puerto del servidor (default: 3000)
PORT=3000

# Ruta de la base de datos (default: ./data/mascotas.db)
DB_PATH=./data/mascotas.db

# Origen del frontend para CORS (desarrollo)
FRONTEND_ORIGIN=http://127.0.0.1:5500
```

**Nota:** Los valores por defecto funcionan bien para desarrollo local. Solo cambia si necesitas algo específico.

---

## ✅ Checklist de Setup

- [ ] `npm install` en `backend/` completó sin errores
- [ ] Backend levantado con `npm run dev`
- [ ] Frontend abierto en http://127.0.0.1:5500
- [ ] Puedo crear una mascota en el formulario
- [ ] La mascota aparece en el listado
- [ ] Puedo editar la mascota
- [ ] Puedo eliminar la mascota
- [ ] Búsqueda y filtros funcionan
- [ ] Console (F12) no muestra errores

---

## 🚨 Troubleshooting

### "No se puede conectar a la API"
**Problema:** El frontend no encuentra el backend en `http://localhost:3000`

**Soluciones:**
1. Verifica que el backend esté corriendo (`npm run dev` en terminal)
2. Revisa que no haya otro proceso en puerto 3000: 
   ```bash
   netstat -ano | findstr :3000  # Windows
   lsof -i :3000                 # Mac/Linux
   ```
3. Recarga la página del frontend (F5)

### "CORS policy error"
**Problema:** El frontend está en un origen que no está permitido

**Solución:**
Verifica que tu origin esté en la lista de `allowedOrigins` en `backend/src/index.js`:
```javascript
const allowedOrigins = [
  "http://127.0.0.1:5500",  // ← Tu origen debe estar aquí
  "http://localhost:5500",
]
```

### "Base de datos vacía después de reiniciar"
**Problema:** SQLite crea una BD nueva cada vez

**Nota:** Es normal. Los datos se persisten en `backend/data/mascotas.db`. Si limpias eso, pierdes datos.

---

## 📝 Ejemplo de Uso - Curl

```bash
# Crear mascota
curl -X POST http://localhost:3000/mascotas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Fluffy",
    "tipo": "gato",
    "departamento": "Depto 101",
    "contacto": "+56912345678"
  }'

# Listar mascotas
curl http://localhost:3000/mascotas

# Actualizar mascota (id=1)
curl -X PUT http://localhost:3000/mascotas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Fluffy Rosa",
    "tipo": "gato",
    "departamento": "Depto 202",
    "contacto": "+56987654321"
  }'

# Eliminar mascota (id=1)
curl -X DELETE http://localhost:3000/mascotas/1
```

---

## 💾 Backup y Datos

Los datos se guardan en `backend/data/mascotas.db` (SQLite).

**Para hacer backup:**
```bash
cp backend/data/mascotas.db backend/data/mascotas.backup.db
```

**Para restaurar:**
```bash
cp backend/data/mascotas.backup.db backend/data/mascotas.db
```

---

## � Cómo Agregar Fotos a Este README

### Fotos del Condominio
1. Prepara tus fotos (JPG o PNG, máx 5MB)
2. Renómalas como:
   - `fachada.jpg` - Foto de la fachada principal
   - `areas-comunes.jpg` - Áreas comunes/patio
   - `interior.jpg` - Interior del condominio
3. Coloca en carpeta: `assets/condominio/`
4. Haz commit y push:
   ```bash
   git add assets/condominio/
   git commit -m "assets: agregar fotos del condominio"
   git push origin main
   ```

### Screenshots de la App
1. Toma capturas de pantalla:
   - `dashboard.png` - Vista principal con mascotas
   - `formulario.png` - Vista del formulario de registro
   - `editar.png` - Modal de edición
2. Coloca en: `assets/screenshots/`
3. Haz commit y push:
   ```bash
   git add assets/screenshots/
   git commit -m "assets: agregar capturas de la aplicación"
   git push origin main
   ```

Las fotos se mostrarán automáticamente en la sección de **Galería** del README.

---

## 📦 Dependencias

**Backend:**
- `express` - Framework web minimalista
- `cors` - Soporte para CORS
- `sqlite3` - Base de datos local

**Frontend:**
- HTML5 + CSS3 + Vanilla JavaScript (sin dependencias)

---

## 📄 Licencia

Proyecto interno para el condominio Salitrera María Elena.  
**Licencia:** MIT

Ver archivo [LICENSE](LICENSE) para detalles completos.

---

## 🤝 Contribuir

¿Quieres mejorar este proyecto? Consulta [CONTRIBUTING.md](CONTRIBUTING.md)

**Formas de contribuir:**
- 📸 Agregar fotos del condominio (sistema > Galería)
- 🐛 Reportar bugs en [Issues](https://github.com/Robi2025/mascotas-salitrera/issues)
- 💡 Sugerir funcionalidades nuevas
- 📝 Mejorar documentación
- 🎨 Mejoras de diseño
- 🌐 Traducciones

---

## 📞 Contacto y Soporte

### Problemas Técnicos
1. Revisa la consola del navegador (F12)
2. Revisa los logs del backend (terminal)
3. Consulta la sección [Troubleshooting](#-troubleshooting)
4. Abre un [Issue en GitHub](https://github.com/Robi2025/mascotas-salitrera/issues)

### Información de Contacto
- **Organización:** Condominio Salitrera María Elena
- **Ubicación:** Antofagasta, Chile
- **Desarrollador:** Robi2025
- **Email:** [Tu email]
- **Teléfono:** [Tu teléfono]

### Comunidad
- 💬 [Discussions en GitHub](https://github.com/Robi2025/mascotas-salitrera/discussions)
- 📧 Puedes contactar directamente a administración
- 🔔 Star el proyecto si te gustó ⭐

---

<div align="center">

## Por Favor, Contribuye 💚

Este proyecto es un esfuerzo comunitario. Si encuentras valor en él:

1. ⭐ **Dale una estrella** en GitHub
2. 📸 **Comparte fotos** del condominio
3. 🐛 **Reporta bugs** que encuentres
4. 💡 **Sugiere ideas** para mejorar
5. 👥 **Invita a otros residentes** a usarlo

---

**Última actualización:** 13 de febrero de 2026  
**Versión:** 1.0.0  
**Estado:** Production Ready ✅

Hecho con ❤️ para Salitrera María Elena

</div>
