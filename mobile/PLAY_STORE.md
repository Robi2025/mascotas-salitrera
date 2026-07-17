# Publicación en Google Play

## Estado técnico

- ID definitivo: `cl.salitrera.mascotas`. Google Play no permite cambiarlo después de publicar.
- Versión inicial: `versionCode 1`, `versionName 1.0.0`.
- Destino: Android API 36; compilación con SDK 36.1.
- Formato de publicación: Android App Bundle (`.aab`).
- Tráfico sin cifrar y copias de seguridad de datos desactivados.

## Antes de compilar

1. Instala Android Studio, Java 17, Android SDK Platform 36.1 y Build Tools 36.x.
2. Publica el backend con HTTPS.
3. Cambia `frontend/config.js` para usar la URL HTTPS real.
4. Crea el primer administrador y residentes. La API ya aplica sesiones,
   contraseñas con hash y aislamiento de mascotas por propietario.
5. Publica una política de privacidad accesible por URL y reemplaza los campos
   pendientes de `PRIVACY_POLICY.md`.

## Generar el paquete

```powershell
cd mobile
npm install
npm run android:sync
npm run android:open
```

En Android Studio usa **Build > Generate Signed Bundle / APK > Android App
Bundle**. Crea una clave de carga, guárdala fuera del repositorio y activa Play
App Signing. Nunca subas archivos `.jks`, `.keystore` ni sus contraseñas a Git.

Cada actualización debe incrementar `versionCode` en
`android/app/build.gradle`.

## Play Console

1. Crea la aplicación con el ID `cl.salitrera.mascotas`.
2. Completa ficha, categoría, correo de soporte y URL de privacidad.
3. Completa **Seguridad de los datos** declarando nombre de mascota,
   departamento y teléfono de contacto, su finalidad, cifrado y eliminación.
4. Completa acceso a la app y entrega credenciales de revisión si existe login.
5. Carga primero el `.aab` en **Prueba interna** y revisa el informe previo al lanzamiento.
6. Prueba registro, edición, eliminación, rotación, botón Atrás y pérdida de red
   en al menos un teléfono real antes de producción.

La configuración ya cumple anticipadamente el requisito de API 36 que Google
Play aplicará desde el 31 de agosto de 2026.
