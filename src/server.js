require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await pool.query('SELECT 1');
    console.log(`Conectado a PostgreSQL (base: ${process.env.DB_NAME})`);
  } catch (err) {
    console.error('No se pudo conectar a PostgreSQL:', err.message);
    console.error('Revisa el archivo .env y ejecuta "npm run db:init".');
  }
  app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
}

iniciar();
