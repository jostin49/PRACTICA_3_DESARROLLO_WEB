// Ruta no encontrada -> 404
function rutaNoEncontrada(req, res) {
  res.status(404).json({ ok: false, mensaje: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

// Manejador global de errores
// eslint-disable-next-line no-unused-vars
function manejadorErrores(err, req, res, next) {
  // JSON mal formado enviado por el cliente
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ ok: false, mensaje: 'JSON mal formado en el cuerpo de la petición.' });
  }
  // Violación de UNIQUE en PostgreSQL (correo repetido)
  if (err.code === '23505') {
    return res.status(409).json({ ok: false, mensaje: 'El correo electrónico ya está registrado.' });
  }
  // Violación de CHECK en PostgreSQL
  if (err.code === '23514') {
    return res.status(400).json({ ok: false, mensaje: 'Los datos no cumplen las restricciones de la base de datos.' });
  }
  // Base de datos no disponible / credenciales incorrectas / base inexistente
  if (['ECONNREFUSED', '28P01', '3D000'].includes(err.code)) {
    console.error('Error de conexión a PostgreSQL:', err.message);
    return res.status(503).json({ ok: false, mensaje: 'Base de datos no disponible.' });
  }

  console.error(err);
  res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
}

module.exports = { rutaNoEncontrada, manejadorErrores };
