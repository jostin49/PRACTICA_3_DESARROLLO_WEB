// Crea la base de datos (si no existe) y la tabla "usuarios"
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
};
const DB_NAME = process.env.DB_NAME || 'practica3_usuarios';

async function main() {
  // 1. Conectarse a la base "postgres" para crear la base de la práctica
  const admin = new Client({ ...config, database: 'postgres' });
  await admin.connect();
  const existe = await admin.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]);
  if (existe.rowCount === 0) {
    await admin.query(`CREATE DATABASE "${DB_NAME}"`);
    console.log(`Base de datos "${DB_NAME}" creada.`);
  } else {
    console.log(`La base de datos "${DB_NAME}" ya existe.`);
  }
  await admin.end();

  // 2. Crear la tabla usuarios
  const db = new Client({ ...config, database: DB_NAME });
  await db.connect();
  const sql = fs.readFileSync(path.join(__dirname, '..', 'database', 'schema.sql'), 'utf8');
  await db.query(sql);
  console.log('Tabla "usuarios" lista.');
  await db.end();
}

main().catch((err) => {
  console.error('Error inicializando la base de datos:', err.message);
  process.exit(1);
});
