const { validarUsuario } = require('../utils/validaciones');

// Valida que :id sea un entero positivo
function validarId(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0 || id > 2147483647) {
    return res.status(400).json({ ok: false, mensaje: 'El ID debe ser un número entero positivo.' });
  }
  req.params.id = id;
  next();
}

// Valida el cuerpo según la operación (registro completo o actualización parcial)
const validarBody = (parcial) => (req, res, next) => {
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ ok: false, mensaje: 'El cuerpo de la petición debe ser un objeto JSON.' });
  }
  const errores = validarUsuario(req.body, parcial);
  if (Object.keys(errores).length > 0) {
    return res.status(400).json({ ok: false, mensaje: 'Datos inválidos.', errores });
  }
  next();
};

module.exports = {
  validarId,
  validarCreacion: validarBody(false),
  validarActualizacion: validarBody(true),
};
