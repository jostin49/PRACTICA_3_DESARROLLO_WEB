const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const usuariosRoutes = require('./routes/usuarios.routes');
const { rutaNoEncontrada, manejadorErrores } = require('./middlewares/manejoErrores');

const app = express();

// Middlewares globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'API REST - Práctica 3 (Node.js + Express + PostgreSQL)',
    endpoints: {
      registrar: 'POST /usuarios',
      consultar: 'GET /usuarios',
      consultarPorId: 'GET /usuarios/:id',
      actualizar: 'PUT /usuarios/:id',
      eliminar: 'DELETE /usuarios/:id',
    },
  });
});

// Rutas de la API
app.use('/usuarios', usuariosRoutes);

// Manejo de errores
app.use(rutaNoEncontrada);
app.use(manejadorErrores);

module.exports = app;
