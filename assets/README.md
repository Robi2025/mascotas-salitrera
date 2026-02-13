# 📁 Carpeta Assets - Guía de Uso

Esta carpeta contiene todos los recursos multimedia del proyecto (fotos, screenshots, iconos, etc.).

## 📁 Estructura

```
assets/
├── condominio/          # Fotos del condominio Salitrera María Elena
│   ├── fachada.jpg              # Foto de la fachada principal
│   ├── areas-comunes.jpg        # Áreas comunes, patios, etc.
│   └── interior.jpg             # Vistas del interior
│
└── screenshots/         # Capturas de la aplicación funcionando
    ├── dashboard.png            # Vista principal (listado de mascotas)
    ├── formulario.png           # Formulario de registro
    ├── editar.png               # Modal de edición
    ├── filtros.png              # Panel de búsqueda y filtros
    └── movil.png                # Vista en mobile
```

## 🖼️ Cómo Subir Fotos

### 1. Fotos del Condominio

**Requisitos:**
- Formato: JPG, PNG
- Tamaño máximo: 5MB
- Resolución recomendada: 1280x720px o superior
- Tema: Fachada, áreas comunes, interior del condominio

**Procedimiento:**
```bash
# 1. Coloca la foto en assets/condominio/
mv tu-foto.jpg assets/condominio/fachada.jpg

# 2. Agrega a git
git add assets/condominio/fachada.jpg

# 3. Haz commit
git commit -m "assets: agregar foto de fachada del condominio"

# 4. Push a GitHub
git push origin main
```

### 2. Screenshots de la Aplicación

**Requisitos:**
- Formato: PNG (mejor compresión)
- Tamaño máximo: 3MB
- Muestra la app funcionando en Chrome/Firefox
- Sin información sensible (email, teléfono real)

**Procedimiento:**
```bash
# 1. En navegador: F12 > Ctrl+Shift+J (inspecciona elemento)
#    O usa: Ctrl+Shift+S (screenshot del navegador)

# 2. Guarda en assets/screenshots/
mv screenshot.png assets/screenshots/dashboard.png

# 3. Agrega a git
git add assets/screenshots/

# 4. Haz commit y push
git commit -m "assets: agregar screenshot del dashboard"
git push origin main
```

## 🎨 Recomendaciones

### Fotos de Condominio
- ✅ Luz natural o buena iluminación
- ✅ Ángulos claros y descriptivos
- ✅ Sin personas identific ables (privacidad)
- ✅ Enfoca áreas relevantes (entrada, áreas verdes, etc.)
- ❌ Evita fotos borrosas o pixeladas

### Screenshots
- ✅ Resuelve máxima del monitor
- ✅ Muestra todas las funciones (formulario, lista, editar, eliminar)
- ✅ Indica con flechas o cuadros los elementos importantes
- ✅ Diferentes estados (vacío, cargando, con datos)
- ❌ No incluyas URLs sensibles o IPs

## 📊 Compresión de Imágenes

**Si las fotos pesan mucho:**

### Windows (Usando VS Code):
1. Instala extensión "Image Optimizer"
2. Click derecho en la imagen > Optimize Image

### Line (Usando comando):
```bash
# Instala ImageMagick primero
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: sudo apt install imagemagick

# Comprime a 80% calidad
convert fachada.jpg -quality 80 fachada-compressed.jpg

# O con ffmpeg (si tienes)
ffmpeg -i fachada.jpg -q:v 5 fachada-compressed.jpg
```

### Online:
- TinyPNG: https://tinypng.com/
- ImageOptim: https://imageoptim.com/
- Squoosh: https://squoosh.app/

## ✅ Checklist Antes de Push

- [ ] La imagen está en la carpeta correcta (condominio/ o screenshots/)
- [ ] El nombre del archivo es descriptivo y en minúscula
- [ ] La imagen pesa menos de 5MB (preferible 1-2MB)
- [ ] La resolución es adecuada (mínimo 800x600)
- [ ] No hay información sensible en la foto
- [ ] El commit tiene mensaje claro
- [ ] Hiciste `git push` hacia `origin main`

## 🔍 Verificación

Después de push, verifica que aparezca en GitHub:

1. Ve a: https://github.com/Robi2025/mascotas-salitrera
2. Navega a: `assets/condominio/` o `assets/screenshots/`
3. Confirma que tu imagen se ve correctamente
4. Verifica el README principal que la referencia en la Galería

## 📝 Licencia de Fotos

Al contribuir fotos:
- ✅ Debes tener derecho a usarlas (fotos propias o con permiso)
- ✅ Se distribuirán bajo la misma licencia MIT del proyecto
- ✅ El proyecto es de uso interno del condominio
- ❌ No incluyas fotos de terceros sin permiso
- ❌ No incluyas caras de personas sin consentimiento

## 🎯 Próximos Step

Una vez agregues las fotos:
1. Actualiza la sección "Galería" en `README.md` si es necesario
2. Verifica que los links funcionen
3. Comparte con residentes del condominio
4. Recopila feedback

---

**Preguntas?** Abre un [Issue en GitHub](https://github.com/Robi2025/mascotas-salitrera/issues)
