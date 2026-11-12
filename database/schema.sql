-- ==========================================================
-- Práctica 3 - Base de datos: practica3_usuarios
-- Tabla basada en el formulario de registro de las
-- Prácticas 1 (FORMULARIO) y 2 (TECH-STUDIO).
-- ==========================================================

-- Si se hace manualmente en psql, primero crear la base:
-- CREATE DATABASE practica3_usuarios;

CREATE TABLE IF NOT EXISTS usuarios (
    id                  SERIAL PRIMARY KEY,
    nombre              VARCHAR(50)  NOT NULL CHECK (char_length(nombre) >= 3),
    correo              VARCHAR(100) NOT NULL UNIQUE,
    telefono            CHAR(10)     NOT NULL CHECK (telefono ~ '^[0-9]{10}$'),
    edad                SMALLINT     NOT NULL CHECK (edad BETWEEN 18 AND 120),
    ciudad              VARCHAR(30)  NOT NULL CHECK (ciudad IN ('Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Ambato', 'Otra')),
    password_hash       VARCHAR(255) NOT NULL,
    terminos            BOOLEAN      NOT NULL DEFAULT TRUE,
    fecha_registro      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    fecha_actualizacion TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
