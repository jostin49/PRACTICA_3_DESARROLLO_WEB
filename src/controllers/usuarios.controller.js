const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// Columnas públicas (nunca se devuelve el hash de la contraseña)
const COLUMNAS = 'id, nombre, correo, telefono, edad, ciudad, terminos, fecha_registro, fecha_actualizacion';

const noEncontrado = (res, id) =>
  res.status(404).json({ ok: false, mensaje: `No existe un usuario con ID ${id}.` });

// POST /usuarios -> Registrar
async function crearUsuario(req, res, next) {
  try {
    const { nombre, correo, telefono, edad, ciudad, password, terminos } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
      `INSERT INTO usuarios (nombre, correo, telefono, edad, ciudad, password_hash, terminos)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${COLUMNAS}`,
      [
        nombre.trim(),
        correo.trim().toLowerCase(),
        String(telefono).trim(),
        Number(edad),
        ciudad.trim(),
        passwordHash,
        terminos,
      ]
    );

    res.status(201).json({ ok: true, mensaje: 'Usuario registrado correctamente.', data: rows[0] });
  } catch (err) {
    next(err);
  }
}

// GET /usuarios -> Consultar todos
async function obtenerUsuarios(req, res, next) {
  try {
    const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM usuarios ORDER BY id`);
    res.status(200).json({ ok: true, total: rows.length, data: rows });
  } catch (err) {
    next(err);
  }
}

// GET /usuarios/:id -> Consultar por ID
async function obtenerUsuarioPorId(req, res, next) {
  try {
    const { rows } = await pool.query(`SELECT ${COLUMNAS} FROM usuarios WHERE id = $1`, [req.params.id]);
    if (rows.length === 0) return noEncontrado(res, req.params.id);
    res.status(200).json({ ok: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
}

// PUT /usuarios/:id -> Actualizar (solo los campos enviados)
async function actualizarUsuario(req, res, next) {
  try {
    const b = req.body;
    const campos = [];
    const valores = [];
    const agregar = (columna, valor) => {
      valores.push(valor);
      campos.push(`${columna} = $${valores.length}`);
    };

    if (b.nombre !== undefined) agregar('nombre', b.nombre.trim());
    if (b.correo !== undefined) agregar('correo', b.correo.trim().toLowerCase());
    if (b.telefono !== undefined) agregar('telefono', String(b.telefono).trim());
    if (b.edad !== undefined) agregar('edad', Number(b.edad));
    if (b.ciudad !== undefined) agregar('ciudad', b.ciudad.trim());
    if (b.password !== undefined) agregar('password_hash', await bcrypt.hash(b.password, 10));

    valores.push(req.params.id);
    const { rows } = await pool.query(
      `UPDATE usuarios SET ${campos.join(', ')}, fecha_actualizacion = NOW()
       WHERE id = $${valores.length}
       RETURNING ${COLUMNAS}`,
      valores
    );

    if (rows.length === 0) return noEncontrado(res, req.params.id);
    res.status(200).json({ ok: true, mensaje: 'Usuario actualizado correctamente.', data: rows[0] });
  } catch (err) {
    next(err);
  }
}

// DELETE /usuarios/:id -> Eliminar
async function eliminarUsuario(req, res, next) {
  try {
    const { rows } = await pool.query(`DELETE FROM usuarios WHERE id = $1 RETURNING ${COLUMNAS}`, [req.params.id]);
    if (rows.length === 0) return noEncontrado(res, req.params.id);
    res.status(200).json({ ok: true, mensaje: 'Usuario eliminado correctamente.', data: rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { crearUsuario, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario };
