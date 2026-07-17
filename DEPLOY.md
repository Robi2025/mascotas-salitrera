# Despliegue HTTPS

El repositorio incluye `render.yaml` para crear el backend en Render con HTTPS
y un disco persistente para SQLite. Render puede cobrar por el servicio y el
disco; revisa el precio antes de confirmar.

## 1. Crear el servicio

1. Sube este repositorio a una cuenta privada de GitHub.
2. En Render elige **New > Blueprint** y conecta el repositorio.
3. Confirma el servicio `mascotas-salitrera-api` y su disco persistente.
4. En **Environment**, conserva en secreto `BOOTSTRAP_SECRET`.
5. Copia la URL HTTPS que entrega Render.

## 2. Crear el primer administrador

Ejecuta una sola vez, reemplazando URL, datos y secreto:

```powershell
$body = @{
  bootstrapSecret = "SECRETO_DE_RENDER"
  email = "admin@condominio.cl"
  name = "Administración"
  password = "UnaClaveSegura123"
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "https://TU-API.onrender.com/auth/bootstrap" -ContentType "application/json" -Body $body
```

Después elimina `BOOTSTRAP_SECRET` de Render y vuelve a desplegar. La ruta no
permite crear otro administrador una vez que ya existe un usuario.

## 3. Conectar Android

Actualiza `frontend/config.js` con la URL HTTPS, ejecuta
`cd mobile; npm run android:sync` y genera una nueva compilación.

No uses almacenamiento efímero para `DB_PATH`: perderías usuarios y mascotas
al reiniciar o desplegar. Realiza copias de seguridad periódicas del archivo
SQLite del disco.
