# PrivateSnap — Explicación técnica para no programadores
*Documento para entender qué estamos haciendo, por qué y si es seguro*

---

## ¿Es esto legal y ético?

**Sí, completamente.**

Lo que estamos construyendo es una aplicación de mensajería privada para adultos. Esto es exactamente lo mismo que WhatsApp, Telegram o Snapchat, con la diferencia de que está orientada a contenido íntimo entre adultos que consienten.

- No hacemos nada ilegal
- No accedemos a datos de terceros sin permiso
- No instalamos nada malicioso en ningún dispositivo
- El contenido solo lo ven las personas que lo envían y reciben

**Lo único que debes garantizar tú como operador de la app** es que los usuarios sean mayores de edad (18+) y que el contenido sea entre adultos que consienten. Eso se gestiona con los Términos de Uso que aceptan al registrarse.

---

## ¿Estamos abriendo puertas a los malos?

**No.** Vamos a explicar cada cosa que hemos instalado o hecho:

### Node.js
Es el motor que ejecuta código JavaScript en el ordenador. Como instalar Java para ejecutar programas Java. No abre ningún puerto, no hace nada por sí solo.

### npm (Node Package Manager)
Es como una "tienda de piezas" para programadores. Cuando hacemos `npm install` descargamos piezas de código que otros programadores han creado y que usamos en nuestra app. Es exactamente lo mismo que instalar extensiones en Chrome.

### Las librerías que instalamos (express, socket.io, etc.)
Son herramientas de programación que se quedan dentro de la carpeta del proyecto. No hacen nada hasta que el programador las usa explícitamente en el código.

### El servidor local (puerto 3001)
Cuando ejecutamos `npm run dev`, abrimos un "servicio" en el puerto 3001 de tu ordenador. Es como abrir una ventana de tu casa — solo es accesible desde dentro de tu red WiFi/cable mientras el programa está abierto. En cuanto cierras el PowerShell, la ventana se cierra.

### El firewall que abrimos
Abrimos el puerto 3001 en el firewall de Windows para que tu móvil (en la misma red) pueda hablar con el servidor. Esto es exactamente lo mismo que ocurre cuando juegas online o usas un servidor de Minecraft en casa. No es accesible desde internet.

### Railway (el servidor en la nube)
Railway es una empresa de hosting profesional (como Amazon AWS o Google Cloud pero más sencilla). Les "alquilamos" un ordenador en internet donde corre nuestro servidor. Es la misma empresa que usan miles de startups reales.

### GitHub
Es donde guardamos el código del servidor. Como Google Drive pero para código. Es privado — nadie puede ver tu código.

### PostgreSQL (la base de datos)
Es donde se guardan los usuarios y mensajes. Como un Excel muy potente y seguro. Está alojado en Railway, protegido con contraseña.

---

## ¿Qué datos guardamos de los usuarios?

Solo estos:
- **Username** (el nombre que eligen ellos)
- **Contraseña** (guardada cifrada — ni nosotros podemos verla)
- **Mensajes de texto** (mientras no expiren)

**NO guardamos:**
- Email
- Teléfono
- Localización
- Contactos del móvil
- Nada del dispositivo

---

## ¿Cómo funciona la seguridad de las contraseñas?

Cuando alguien se registra con una contraseña, nosotros nunca la guardamos tal cual. La pasamos por un proceso llamado **bcrypt** que la convierte en una cadena de caracteres incomprensible. Por ejemplo:

```
"micontraseña123" → "$2b$10$xK9mN2pL8qR5vT7uW3yZ1eHjKlMnOpQrStUvWxYzAbCdEfGhIjKlM"
```

Esto es irreversible — ni nosotros podemos saber cuál era la contraseña original. Por eso si la pierdes no podemos recuperarla.

---

## ¿Cómo viajan los datos de forma segura?

Usamos **JWT (JSON Web Token)**. Cuando un usuario inicia sesión, el servidor le da un "carnet de identidad digital" firmado. Cada vez que la app hace una petición al servidor, muestra ese carnet. Si alguien interceptara el carnet no podría falsificarlo porque está firmado con una clave secreta que solo tiene el servidor.

---

## ¿Qué es el cifrado de extremo a extremo que prometemos?

Es la tecnología más segura que existe para comunicaciones. Significa que el contenido se cifra en el dispositivo del emisor y solo se puede descifrar en el dispositivo del receptor. Ni el servidor (nosotros) puede ver el contenido.

**Estado actual:** Lo tenemos diseñado y es el objetivo, pero aún estamos construyendo las bases. Se implementará en la fase de vídeo real.

---

## ¿Qué es WebRTC y por qué lo usaremos?

WebRTC es la tecnología que usan WhatsApp y Google Meet para las videollamadas. Permite que dos dispositivos se conecten **directamente** entre sí sin que el contenido pase por ningún servidor. Es la base del Nivel 2 y 3 de seguridad:

- El vídeo sale de tu móvil → va directo al otro móvil → nunca toca nuestro servidor
- Es imposible que nosotros (o cualquier hacker que intercepte el servidor) vea el contenido

---

## ¿Qué hace exactamente cada parte del sistema?

```
TU MÓVIL (app)
    ↕ envía/recibe mensajes cifrados
RAILWAY (servidor en internet)
    ↕ guarda usuarios y coordina conexiones
RAILWAY (base de datos PostgreSQL)
    → guarda usuarios, mensajes de texto

Para vídeos (nivel 2 y 3):
TU MÓVIL → directo → OTRO MÓVIL
(el servidor solo les presenta, no ve el contenido)
```

---

## ¿Por qué usamos GitHub?

GitHub es como Google Drive para código. Guardamos el código del servidor ahí por dos razones:
1. **Seguridad**: si se rompe algo, tenemos copia
2. **Despliegue**: Railway lee el código de GitHub y lo ejecuta automáticamente en sus servidores

El repositorio es **privado** — nadie puede ver tu código.

---

## ¿Qué es Expo y Expo Go?

**Expo** es un conjunto de herramientas que simplifica el desarrollo de apps para Android e iOS. En vez de necesitar Android Studio (enorme y complejo), Expo nos permite desarrollar más rápido.

**Expo Go** es una app que actúa como "contenedor" para nuestra app durante el desarrollo. Es como un navegador web que carga nuestra app en vez de páginas web. Cuando la app esté lista para publicar, la compilaremos en un APK/AAB real que no necesita Expo Go.

---

## ¿Es seguro tener el código en mi PC?

Sí. El código es solo texto. No puede hacer nada por sí solo. Solo "cobra vida" cuando ejecutas `npm run dev` o `npx expo start`. Cuando cierras los PowerShell, todo para.

---

## Resumen de riesgos reales (muy bajos)

| Riesgo | Probabilidad | Mitigación |
|--------|-------------|------------|
| Alguien hackea la base de datos | Muy baja | Railway tiene seguridad profesional, contraseñas cifradas |
| Alguien intercepta el tráfico | Muy baja | HTTPS en producción cifra todo |
| Alguien accede al servidor local | Muy baja | Solo accesible en tu red local, firewall activo |
| Pérdida de datos | Muy baja | Railway hace backups automáticos |

---

*Documento generado en Mayo 2026 durante el desarrollo de PrivateSnap*
