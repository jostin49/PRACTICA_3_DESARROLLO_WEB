# Práctica 3 – API REST con Node.js, Express y PostgreSQL

**Asignatura:** Desarrollo Web · **Unidad 3:** Lenguaje del lado del servidor (Back-End)
**Autor:** Jostin Chalán

---

## Descripción del proyecto

API REST desarrollada con **Node.js** y **Express**, conectada a una base de datos **PostgreSQL**, que permite registrar, consultar, actualizar y eliminar **usuarios** (operaciones CRUD).

Los datos corresponden al formulario de registro de las prácticas anteriores, con los mismos campos y reglas de validación:

- Práctica 1: [FORMULARIO](https://github.com/jostin49/FORMULARIO) – formulario en HTML, CSS y JavaScript.
- Práctica 2: [TECH-STUDIO](https://github.com/jostin49/TECH-STUDIO) – formulario en React + Vite.

En esta práctica, el back-end recibe esos datos en formato JSON, los valida y los guarda en PostgreSQL.

---

## Tecnologías utilizadas

| Tecnología | Versión | Uso en el proyecto |
|---|---|---|
| Node.js | 20 | Entorno de ejecución de JavaScript en el servidor |
| Express | 5 | Servidor HTTP, rutas y middlewares de la API |
| PostgreSQL | 18 | Base de datos relacional |
| pg (node-postgres) | 8 | Conexión entre Node.js y PostgreSQL (pool de conexiones) |
| bcryptjs | 3 | Cifrado (hash) de las contraseñas |
| dotenv | 18 | Lectura de variables de entorno desde `.env` |
| cors | 2 | Permite que el front-end consuma la API |
| morgan | 1 | Registro de cada petición en la consola |
| nodemon | 3 | Reinicio automático del servidor en desarrollo |
| Postman | – | Pruebas de los endpoints |

---

## Funcionalidades implementadas

### 1. Operaciones CRUD

| Método | Endpoint | Funcionalidad | Respuesta correcta |
|---|---|---|---|
| POST | `/usuarios` | Registrar un usuario | 201 Created |
| GET | `/usuarios` | Consultar todos los usuarios | 200 OK |
| GET | `/usuarios/:id` | Consultar un usuario por ID | 200 OK |
| PUT | `/usuarios/:id` | Actualizar un usuario (solo los campos enviados) | 200 OK |
| DELETE | `/usuarios/:id` | Eliminar un usuario | 200 OK |

### 2. Validación de datos

Se aplican las mismas reglas de los formularios de las prácticas 1 y 2:

- **Nombre:** obligatorio, de 3 a 50 caracteres, solo letras y espacios (acepta tildes y ñ).
- **Correo:** formato `nombre@dominio.com`, único en la base de datos.
- **Teléfono:** exactamente 10 dígitos.
- **Edad:** número entero entre 18 y 120.
- **Ciudad:** Quito, Guayaquil, Cuenca, Santo Domingo, Ambato u Otra.
- **Contraseña:** mínimo 8 caracteres, con al menos una letra y un número; `confirmPassword` debe coincidir.
- **Términos:** deben aceptarse al registrarse (`"terminos": true`).

Si hay errores, la API indica qué falla en cada campo.

### 3. Respuestas HTTP adecuadas

| Código | Cuándo se devuelve |
|---|---|
| 200 OK | Consulta, actualización o eliminación correcta |
| 201 Created | Usuario registrado correctamente |
| 400 Bad Request | Datos inválidos, ID no numérico o JSON mal formado |
| 404 Not Found | El usuario o la ruta no existe |
| 409 Conflict | El correo ya está registrado |
| 500 Internal Server Error | Error inesperado del servidor |
| 503 Service Unavailable | No hay conexión con PostgreSQL |

### 4. Seguridad

- Las contraseñas se guardan cifradas con **bcrypt** y nunca se devuelven en las respuestas.
- Todas las consultas SQL usan **parámetros** (`$1, $2, ...`) para evitar la inyección SQL.
- Las credenciales de la base de datos están en `.env`, que no se sube al repositorio.
- La tabla tiene restricciones `CHECK` y `UNIQUE` como segunda capa de validación.

### 5. Pruebas con Postman

Incluye una colección con **11 peticiones** y **tests automáticos** que cubren los casos correctos (200 y 201) y los de error (400, 404 y 409).

---

## Estructura del proyecto

```
PRACTICA_3_DESARROLLO_WEB/
├── database/schema.sql                     # Script SQL de la tabla usuarios
├── postman/                                # Colección de Postman
├── scripts/initDb.js                       # Crea la base de datos y la tabla
├── src/
│   ├── config/db.js                        # Conexión a PostgreSQL
│   ├── controllers/usuarios.controller.js  # Lógica de las operaciones CRUD
│   ├── middlewares/validarUsuario.js       # Validación del ID y de los datos JSON
│   ├── middlewares/manejoErrores.js        # Manejo de errores y rutas no encontradas
│   ├── routes/usuarios.routes.js           # Definición de los endpoints
│   ├── utils/validaciones.js               # Reglas de validación
│   ├── app.js                              # Configuración de Express
│   └── server.js                           # Punto de entrada del servidor
├── .env.example                            # Plantilla de variables de entorno
└── package.json
```

---

## Base de datos

**Base:** `practica3_usuarios` · **Tabla:** `usuarios`

| Columna | Tipo | Restricción |
|---|---|---|
| id | SERIAL | PRIMARY KEY |
| nombre | VARCHAR(50) | NOT NULL, mínimo 3 caracteres |
| correo | VARCHAR(100) | NOT NULL, UNIQUE |
| telefono | CHAR(10) | NOT NULL, exactamente 10 dígitos |
| edad | SMALLINT | NOT NULL, entre 18 y 120 |
| ciudad | VARCHAR(30) | Valores permitidos de la lista de ciudades |
| password_hash | VARCHAR(255) | NOT NULL, contraseña cifrada |
| terminos | BOOLEAN | NOT NULL |
| fecha_registro | TIMESTAMPTZ | DEFAULT NOW() |
| fecha_actualizacion | TIMESTAMPTZ | DEFAULT NOW() |

---

## Instalación y ejecución

**Requisitos:** Node.js 18 o superior y PostgreSQL instalado.

```bash
# 1. Instalar las dependencias
npm install

# 2. Crear el archivo .env a partir de la plantilla y poner la contraseña de PostgreSQL
copy .env.example .env

# 3. Crear la base de datos y la tabla
npm run db:init

# 4. Iniciar el servidor
npm run dev
```

La API queda disponible en **http://localhost:3000**.

---

## Ejemplos de uso

**Registrar un usuario** – `POST /usuarios`

```json
{
  "nombre": "Jostin Chalán",
  "correo": "jostin.prueba@correo.com",
  "telefono": "0991234567",
  "edad": 22,
  "ciudad": "Quito",
  "password": "Clave1234",
  "confirmPassword": "Clave1234",
  "terminos": true
}
```

Respuesta `201 Created`:

```json
{
  "ok": true,
  "mensaje": "Usuario registrado correctamente.",
  "data": {
    "id": 1,
    "nombre": "Jostin Chalán",
    "correo": "jostin.prueba@correo.com",
    "telefono": "0991234567",
    "edad": 22,
    "ciudad": "Quito",
    "terminos": true,
    "fecha_registro": "2026-11-12T03:45:25.980Z",
    "fecha_actualizacion": "2026-11-12T03:45:25.980Z"
  }
}
```

**Actualizar un usuario** – `PUT /usuarios/1`

```json
{ "ciudad": "Guayaquil", "edad": 23 }
```

**Error de validación** – respuesta `400 Bad Request`:

```json
{
  "ok": false,
  "mensaje": "Datos inválidos.",
  "errores": {
    "telefono": "El teléfono debe tener exactamente 10 dígitos (ej. 0991234567).",
    "edad": "Debes ser mayor de edad (entre 18 y 120 años)."
  }
}
```

---

## Pruebas con Postman

1. Descargar Postman desde https://www.postman.com/downloads/
2. **Import** → seleccionar `postman/Practica3_API_Usuarios.postman_collection.json`.
3. Con el servidor encendido, ejecutar las peticiones en orden o usar **Run collection**.

Resultado obtenido: **11 de 11 peticiones y 15 de 15 tests aprobados.**
