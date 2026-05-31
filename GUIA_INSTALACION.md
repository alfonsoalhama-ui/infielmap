# 🚀 Guía de Instalación — PrivateSnap

Sigue estos pasos **en orden**. No necesitas saber programar para hacerlo.

---

## Paso 1 — Instalar Node.js

Node.js es el motor que ejecuta el código de la app en tu ordenador.

1. Ve a **https://nodejs.org**
2. Descarga la versión **LTS** (la de la izquierda, más estable)
3. Instálala como cualquier programa (siguiente, siguiente, finalizar)
4. Para verificar que se instaló bien, abre el **Terminal** (en Mac: busca "Terminal"; en Windows: busca "PowerShell") y escribe:
   ```
   node --version
   ```
   Debería aparecer algo como `v20.x.x`

---

## Paso 2 — Instalar la app Expo Go en tu móvil

Expo Go te permite ver la app en tu teléfono real mientras la desarrollas.

- **iPhone**: busca "Expo Go" en la App Store e instálala
- **Android**: busca "Expo Go" en Google Play e instálala

---

## Paso 3 — Abrir la carpeta del proyecto en Terminal

### En Mac:
1. Abre **Finder** y ve a la carpeta `PrivateSnap` (donde está este archivo)
2. Haz clic derecho sobre la carpeta → **"Abrir en Terminal"**

### En Windows:
1. Abre la carpeta `PrivateSnap` en el Explorador de archivos
2. Haz clic en la barra de dirección y escribe `powershell`, pulsa Enter

---

## Paso 4 — Instalar las dependencias

Con el Terminal abierto **dentro de la carpeta PrivateSnap**, escribe este comando y pulsa Enter:

```
npm install
```

Esto descargará todos los paquetes necesarios (puede tardar 2-5 minutos la primera vez).

---

## Paso 5 — Arrancar la app

En el mismo Terminal, escribe:

```
npx expo start
```

Aparecerá un código QR en el Terminal.

---

## Paso 6 — Ver la app en tu móvil

1. Abre **Expo Go** en tu teléfono
2. Escanea el código QR que aparece en el Terminal
3. ¡La app se cargará en tu teléfono!

> ⚠️ Tu móvil y tu ordenador deben estar conectados a la **misma red WiFi**

---

## Solución de problemas comunes

### "npm: command not found"
→ Node.js no se instaló correctamente. Repite el Paso 1.

### La app no carga en el móvil
→ Asegúrate de que el móvil y el ordenador están en la misma WiFi.
→ En el Terminal donde está el QR, pulsa `w` para abrirlo en el navegador web.

### Error al hacer npm install
→ Borra la carpeta `node_modules` si existe y vuelve a ejecutar `npm install`.

---

## Estructura del proyecto

```
PrivateSnap/
├── App.tsx                    ← Punto de entrada de la app
├── app.json                   ← Configuración de la app (nombre, icono, etc.)
├── package.json               ← Lista de dependencias
└── src/
    ├── screens/
    │   ├── auth/              ← Bienvenida, Login, Registro, Verificación SMS
    │   ├── main/              ← Conversaciones, Chat, Cámara, Perfil, Enviar
    │   └── viewer/            ← Visualizador seguro (pantalla principal)
    ├── navigation/            ← Estructura de navegación entre pantallas
    ├── hooks/
    │   ├── useScreenCapture   ← Detección de capturas de pantalla
    │   └── useCameraDetection ← IA anti-cámara (tu idea)
    ├── services/
    │   ├── api.ts             ← Comunicación con el servidor
    │   └── store.ts           ← Estado global de la app
    └── theme/                 ← Colores y tipografía
```

---

## Próximos pasos de desarrollo

Con esta base funcionando, los siguientes sprints serán:

1. **Backend**: Crear el servidor Node.js con autenticación y base de datos
2. **Cámara real**: Implementar captura y subida de fotos/vídeos
3. **FLAG_SECURE nativo**: Módulo nativo para bloqueo de capturas en Android
4. **IA anti-cámara**: Integrar modelo YOLO para detección de dispositivos
5. **Streaming DRM**: FairPlay (iOS) + Widevine (Android)

---

*Proyecto creado con Claude — Mayo 2026*
