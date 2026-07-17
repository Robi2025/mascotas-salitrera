# Android (Capacitor)

Este directorio empaqueta la app web en Android usando Capacitor.

## Prerrequisitos

- Node.js 18+
- Android Studio (incluyendo Android SDK 36.1, Build Tools 36.x y platform-tools)
- Java 17 (normalmente viene con Android Studio)

## 1) Configurar API para mobile

Edita `frontend/config.js` y cambia:

```js
apiBaseUrl: "https://TU_BACKEND_PUBLICO"
```

Importante: para Play Store, la API debe estar en internet y usar HTTPS. La
aplicación Android bloquea conexiones HTTP por seguridad. `localhost` no
funciona en celulares de residentes.

## 2) Instalar y sincronizar

```bash
cd mobile
npm install
npm run android:sync
```

El script `android:sync` hace:

- Copia `assets/condominio` a `frontend/assets/condominio`
- Sincroniza web assets a `mobile/android`

## 3) Abrir Android Studio

```bash
npm run android:open
```

## 4) Generar paquete para Play Store

En Android Studio:

1. `Build > Generate Signed Bundle / APK`
2. Elegir `Android App Bundle`
3. Crear o seleccionar keystore
4. Build variant: `release`

Salida esperada:

- `mobile/android/app/build/outputs/bundle/release/app-release.aab`

Ese `.aab` es el que se sube a Google Play Console.

También puedes comprobar la compilación debug desde PowerShell:

```powershell
npm run android:debug
```

Antes de publicar sigue [PLAY_STORE.md](PLAY_STORE.md). La API incluye acceso
por administrador/residente; crea el primer administrador mediante el proceso
descrito en `../DEPLOY.md`.
