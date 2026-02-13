# 🚀 Guía de Setup - Mascotas Salitrera María Elena

Instrucciones paso a paso para configurar y ejecutar el proyecto.

---

## ✅ Requisitos Previos

- **Node.js** 16.0.0 o superior
  - Descargar: https://nodejs.org/
  - Verificar: `node --version`

- **npm** (viene con Node.js)
  - Verificar: `npm --version`

- **Editor de código** (recomendado VS Code)
  - Descargar: https://code.visualstudio.com/

- **Git** (opcional, pero recomendado)
  - Descargar: https://git-scm.com/

---

## 📥 Paso 1: Descargar el Proyecto

**Opción A: Con Git** (recomendado)
```bash
git clone <url-repo>
cd mascotas-salitrera
```

**Opción B: Descargar ZIP**
1. Descarga el ZIP desde el repositorio
2. Descomprime en la carpeta deseada
3. Abre terminal en esa carpeta

---

## 📦 Paso 2: Instalar Dependencias del Backend

```bash
cd backend
npm install
```

**Resultado esperado:**
```
up to date, audited 194 packages in 3.2s
```

---

## ⚙️ Paso 3: Configurar Variables de Entorno (Opcional)

Los valores por defecto funcionan perfectamente para desarrollo.

Si quieres cambiar puerto o ruta de BD:

```bash
# Desde la carpeta backend/
cp .env.example .env
```

Luego edita `backend/.env` con tus valores.

---

## 🚀 Paso 4: Levantar el Backend

**Opción A: Modo Desarrollo** (recomendado)
```bash
npm run dev
```

**Opción B: Modo Producción**
```bash
npm start
```

**Resultado esperado:**
```
╔════════════════════════════════════════════╗
║  API Mascotas Salitrera escuchando        ║
║  🚀 http://localhost:3000                 ║
║  ✅ CORS habilitado para:                 ║
║     - http://127.0.0.1:5500               ║
║     - http://localhost:5500               ║
╚════════════════════════════════════════════╝
```

✅ **El backend está listo.** Deja esta terminal abierta.

---

## 🌐 Paso 5: Abrir el Frontend

**Opción A: Con VS Code + Live Server** (recomendado)

1. Abre **una nueva terminal**
2. Navega a la carpeta del proyecto:
   ```bash
   cd mascotas-salitrera
   ```
3. Abre VS Code:
   ```bash
   code .
   ```
4. En VS Code, abre el archivo `frontend/index.html`
5. Click derecho en el editor → **"Open with Live Server"**
6. Se abre automáticamente en `http://127.0.0.1:5500`

**Opción B: Con Python (si no tienes VS Code)**

1. En una **nueva terminal**, navega a frontend:
   ```bash
   cd mascotas-salitrera/frontend
   ```

2. Levanta el servidor:
   ```bash
   python -m http.server 5500
   ```

3. Abre http://localhost:5500 en tu navegador

**Opción C: Servidor Node.js local**

1. En una **nueva terminal**:
   ```bash
   cd mascotas-salitrera/frontend
   npx http-server -p 5500
   ```

2. Abre http://localhost:5500

---

## ✅ Paso 6: Verificar que Todo Funciona

1. En la página del frontend (http://127.0.0.1:5500):
   - Deberías ver el header gradiente morado
   - Formulario de registro de mascotas
   - Listado inicialmente vacío

2. Completa el formulario:
   - Nombre: "Max"
   - Tipo: "Perro"
   - Departamento: "101"
   - Contacto: "+56912345678"

3. Click "Guardar Mascota"

4. **Resultado esperado:**
   - Toast verde aparece: "✅ Max registrado exitosamente"
   - Formulario se limpia
   - Lista se actualiza con "🐕 Max • Perro • Depto 101"

✅ **¡El proyecto está funcionando!**

---

## 🧪 Pruebas Adicionales (Opcional)

### Test de API directo

Abre otra terminal y prueba los endpoints:

```bash
# Health check
curl http://localhost:3000/health

# Listar mascotas
curl http://localhost:3000/mascotas

# Crear mascota
curl -X POST http://localhost:3000/mascotas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Fluffy",
    "tipo": "gato",
    "departamento": "Depto 202",
    "contacto": "+56987654321"
  }'
```

Deberías recibir respuestas JSON en cada caso.

---

## 📁 Estructura de Carpetas

Después del setup, tendrás:

```
mascotas-salitrera/
├── backend/
│   ├── node_modules/         ← Instalado por npm install
│   ├── data/
│   │   └── mascotas.db       ← Se crea automáticamente
│   ├── src/
│   │   ├── index.js
│   │   └── db.js
│   ├── .env                  ← Variables reales (no commit)
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── styles.css
│
├── .gitignore
├── README.md
├── SETUP.md                  ← Este archivo
└── ...
```

---

## 🆘 Troubleshooting

### Problema: "npm command not found"
**Solución:**
- Node.js no está instalado
- Descarga de https://nodejs.org/
- Reinicia la terminal después de instalar

### Problema: "Error: listen EADDRINUSE: address already in use :::3000"
**Solución:**
- Puerto 3000 está en uso
- Opción 1: Cierra lo que esté usando el puerto
- Opción 2: Cambia PORT en `.env` a otro número (ej: 3001)

### Problema: "Cannot GET /mascotas"
**Solución:**
- El backend no está corriendo
- Verifica que hayas ejecutado `npm run dev` en la carpeta `backend/`
- Verifica que veas el banner de inicio

### Problema: "No se puede conectar a la API"
**Solución:**
- Abre Console en el navegador (F12)
- Verifica que el error tenga algo sobre `http://localhost:3000`
- Revisa Troubleshooting en README.md

### Problema: "Cannot find module 'express'"
**Solución:**
- No ejecutaste `npm install` en la carpeta `backend/`
- En terminal, desde `backend/`, ejecuta: `npm install`

---

## 📚 Próximos Pasos

1. Familiarízate con la interfaz
2. Lee el README.md para entender la API
3. Experimenta editando y borrando mascotas
4. Prueba búsquedas y filtros

---

## 💡 Tips

- **Guarda datos:** Backeap de `backend/data/mascotas.db` regularmente
- **Desarrollo:** Usa `npm run dev` siempre durante desarrollo
- **Logs:** Abre DevTools (F12) para ver logs del frontend
- **Consola backend:** Verás logs de API calls en la terminal

---

## ❓ ¿Necesitas ayuda?

1. Revisa el README.md
2. Verifica los logs (terminal del backend + F12 en navegador)
3. Revisa este archivo (SETUP.md)
4. Contacta al desarrollador

---

**Última actualización:** 13 de febrero de 2026
