# 🏀 Hoop Manager

Hoop Manager es un proyecto para gestionar clubes de baloncesto. Pensado para aprender de forma práctica cómo montar servidores, endpoints y lógica básica de backend.

---

## 🌐 Descripción

**Hoop Manager** es un servidor modular hecho con Node.js y Express, conectado a MongoDB.
Creado para el bootcamp de **Neoland** como práctica full-stack.

---

## 🔧 Tecnologías usadas

| Tecnología     | Versión Requerida | Uso principal                  |
|----------------|-------------------|--------------------------------|
| Node.js        | `>= 20`           | Runtime JS                     |
| Express        | `^5.1.0`          | Servidor web                   |
| MongoDB        | `^6.16.0`         | Base de datos                  |
| TypeScript     | `^5.8.2`          | Tipado y mantenimiento         |
| Jest           | `^29.7.0`         | Testing                        |
| Lit            | `^3.3.0`          | Web components |
| ESLint/Stylelint | `^9+ / ^16+`    | Linter de código y estilos     |

---

## 📦 Scripts disponibles

### ▶️ Servidores

```bash
npm run server:express:start     # Server Express completo
```

## 🧪 Tests y documentación

```bash
npm test                         # Ejecuta los tests con JEST
npm run test:watch               # Ejecuta tests en modo watch
npm run docs                     # Genera documentación con JSDoc
```

## 📁 Estructura del proyecto

```bash
hoop-manager/
├── server/               # Diferentes versiones del servidor
├── src/                  # Código fuente (componentes, lógica, etc.)
├── .env                  # Variables de entorno
├── package.json          # Config y scripts del proyecto
├── tsconfig.json         # Configuración
└── readme.md             # Este archivo

```

## ⚙️ Requisitos de entorno

* Node.js >= 20

* MongoDB en local o remoto

* Archivo .env con tu conexión

## 👨‍💻 Autor

Hecho con mucho café ☕ por
[David Galindo](https://github.com/davidglnd)
