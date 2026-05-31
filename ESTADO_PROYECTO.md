# Estado del proyecto PrivateSnap
*Última actualización: Mayo 2026*

---

## ¿Qué es esta app?
App de intercambio de fotos y vídeos íntimos para la comunidad liberal/swinger.
Anónima, segura, efímera. Sin email, sin teléfono — solo username y contraseña.

---

## Tecnología
- **Frontend**: React Native con Expo SDK 54 — carpeta `PrivateSnap`
- **Backend**: Node.js + Express + Socket.io + PostgreSQL — carpeta `PrivateSnap-backend`
- **Base de datos**: PostgreSQL en Railway (ya creada y funcionando)
- **Hosting backend**: Railway (pendiente de desplegar)

---

## Lo que está hecho ✅

### App (frontend)
- App corriendo en Android con Expo Go
- Registro y login con username + contraseña (actualmente en local, pendiente conectar al backend)
- Lista de conversaciones
- Añadir contacto por username → abre el chat directamente
- Chat con mensajes de texto (local por ahora)
- Pantalla de envío de foto/vídeo con **3 niveles de seguridad**
- Visor seguro (placeholder visual, sin reproducción real aún)
- Safe area correcta en todas las pantallas
- Todo en inglés

### Backend
- Servidor Node.js + TypeScript creado y funcionando localmente
- Base de datos PostgreSQL en Railway conectada y con tablas creadas
- Rutas de autenticación: registro, login, buscar usuario
- Rutas de conversaciones: listar, crear, mensajes
- Socket.io configurado para mensajería en tiempo real
- Código commiteado en Git local (falta subir a GitHub)

---

## Los 3 niveles de seguridad diseñados
1. 🔒 **Standard** — vídeo en servidor, se borra tras verlo
2. 🔒🔒 **Private** — streaming desde el móvil del emisor, notificación cuando se reproduce
3. 🔒🔒🔒 **Max security** — igual que Private + cámara frontal del receptor visible para el emisor en tiempo real

---

## LO QUE FALTA — Por orden de prioridad

### 🔴 Paso inmediato (mañana primero)
1. Crear repositorio en GitHub llamado `privatesnap-backend` (privado)
   - Ir a https://github.com/new
   - Nombre: `privatesnap-backend`, marcar Private
   - Crear repositorio
2. Subir el código al repositorio:
   ```
   cd "C:\Users\alfon\Documents\Claude\Projects\app\PrivateSnap-backend"
   git remote add origin https://github.com/TU_USUARIO/privatesnap-backend.git
   git push -u origin master
   ```
3. Conectar Railway al repositorio de GitHub para desplegar automáticamente
4. Añadir variables de entorno en Railway:
   - `JWT_SECRET` = una cadena secreta larga
   - `DATABASE_URL` = (Railway la pone automáticamente al conectar PostgreSQL)
5. Obtener la URL pública del backend en Railway (algo como `https://privatesnap-backend.up.railway.app`)
6. Actualizar `api.ts` en la app con esa URL pública

### 🟡 Una vez el backend esté en Railway
- Conectar registro y login de la app al backend real
- Conectar el chat al backend (mensajes reales entre usuarios)
- Conectar Socket.io para mensajes en tiempo real
- Probar con dos móviles

### 🟢 Después
- Reproducción real de vídeo en el visor
- Streaming P2P entre móviles (WebRTC) para niveles 2 y 3
- Cámara frontal en tiempo real (nivel 3)
- Notificación "alguien está viendo tu vídeo ahora"

---

## Cómo arrancar todo

### App (frontend)
```
cd "C:\Users\alfon\Documents\Claude\Projects\app\PrivateSnap"
npx expo start --lan
```
Escanear QR con Expo Go en Android.

### Backend (local, solo para pruebas)
```
cd "C:\Users\alfon\Documents\Claude\Projects\app\PrivateSnap-backend"
npm run dev
```

---

## Notas técnicas importantes
- Usar siempre `--legacy-peer-deps` al instalar paquetes en el frontend
- `babel-preset-expo` debe ser `~54.0.10`
- `react-native-reanimated` debe ser `~3.16.x` (la v4 no es compatible con Expo Go)
- `SafeAreaView` siempre importar de `react-native-safe-area-context`, nunca de `react-native`
- La IP local del PC es `192.168.18.18` pero el PC va por cable y el móvil por WiFi — por eso hay que usar Railway
- Base de datos Railway URL pública: `postgresql://postgres:TBnjkWFiMTtQDtiuzmuNMWNWkvCkvHko@switchyard.proxy.rlwy.net:40625/railway`
- El backend tiene Git inicializado pero aún NO está en GitHub
