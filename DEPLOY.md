# Despliegue HTTPS

El repositorio incluye `render.yaml` para crear gratuitamente el backend en
Render con HTTPS. Los datos persistentes se guardan en Neon PostgreSQL Free,
porque el sistema de archivos de Render Free se elimina al reiniciar.

## 1. Crear el servicio

1. Sube este repositorio a una cuenta privada de GitHub.
2. En Render elige **New > Blueprint** y conecta el repositorio.
3. Crea un proyecto gratuito en Neon y copia su cadena de conexión.
4. Confirma el servicio Free `mascotas-salitrera-api` e introduce la cadena de
   Neon únicamente en la variable secreta `DATABASE_URL`.
5. En **Environment**, conserva en secreto `BOOTSTRAP_SECRET`.
6. Copia la URL HTTPS que entrega Render.

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

No publiques ni compartas `DATABASE_URL`: contiene la contraseña de la base.
El servicio gratuito de Render puede tardar cerca de un minuto en responder
después de 15 minutos sin actividad. Exporta copias periódicas desde Neon.
