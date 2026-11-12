const { Router } = require('express');
const ctrl = require('../controllers/usuarios.controller');
const { validarId, validarCreacion, validarActualizacion } = require('../middlewares/validarUsuario');

const router = Router();

router.post('/', validarCreacion, ctrl.crearUsuario);                        // Registrar
router.get('/', ctrl.obtenerUsuarios);                                       // Consultar todos
router.get('/:id', validarId, ctrl.obtenerUsuarioPorId);                     // Consultar por ID
router.put('/:id', validarId, validarActualizacion, ctrl.actualizarUsuario); // Actualizar
router.delete('/:id', validarId, ctrl.eliminarUsuario);                      // Eliminar

module.exports = router;
