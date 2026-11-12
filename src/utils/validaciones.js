// Reglas de validación reutilizadas de las Prácticas 1 y 2 (formulario de registro)
const REGEX = {
  NOMBRE: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  CORREO: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  TELEFONO: /^[0-9]{10}$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/, // mínimo 8 caracteres, al menos 1 letra y 1 número
};

const CIUDADES = ['Quito', 'Guayaquil', 'Cuenca', 'Santo Domingo', 'Ambato', 'Otra'];

const reglas = {
  nombre(v) {
    if (typeof v !== 'string' || v.trim() === '') return 'El nombre completo es obligatorio.';
    const s = v.trim();
    if (s.length < 3) return 'El nombre debe tener mínimo 3 caracteres.';
    if (s.length > 50) return 'El nombre no puede exceder los 50 caracteres.';
    if (!REGEX.NOMBRE.test(s)) return 'El nombre solo puede contener letras y espacios.';
    return null;
  },
  correo(v) {
    if (typeof v !== 'string' || v.trim() === '') return 'El correo electrónico es obligatorio.';
    if (v.trim().length > 100) return 'El correo no puede exceder los 100 caracteres.';
    if (!REGEX.CORREO.test(v.trim())) return 'Ingresa un correo válido con formato nombre@dominio.com.';
    return null;
  },
  telefono(v) {
    if (v === undefined || v === null || String(v).trim() === '') return 'El teléfono celular es obligatorio.';
    if (!REGEX.TELEFONO.test(String(v).trim())) return 'El teléfono debe tener exactamente 10 dígitos (ej. 0991234567).';
    return null;
  },
  edad(v) {
    if (v === undefined || v === null || v === '') return 'La edad es obligatoria.';
    const n = Number(v);
    if (!Number.isInteger(n)) return 'La edad debe ser un número entero.';
    if (n < 18 || n > 120) return 'Debes ser mayor de edad (entre 18 y 120 años).';
    return null;
  },
  ciudad(v) {
    if (typeof v !== 'string' || v.trim() === '') return 'La ciudad de residencia es obligatoria.';
    if (!CIUDADES.includes(v.trim())) return `Ciudad no válida. Opciones: ${CIUDADES.join(', ')}.`;
    return null;
  },
  password(v) {
    if (typeof v !== 'string' || v === '') return 'La contraseña es obligatoria.';
    if (!REGEX.PASSWORD.test(v)) return 'La contraseña debe tener mínimo 8 caracteres, con al menos una letra y un número.';
    return null;
  },
};

const CAMPOS = Object.keys(reglas);

/**
 * Valida el cuerpo de la petición.
 * @param {object} body - datos recibidos en JSON
 * @param {boolean} parcial - true para PUT (solo se validan los campos enviados)
 * @returns {object} errores { campo: mensaje } (vacío si todo es válido)
 */
function validarUsuario(body, parcial = false) {
  const errores = {};

  for (const campo of CAMPOS) {
    if (parcial && body[campo] === undefined) continue;
    const error = reglas[campo](body[campo]);
    if (error) errores[campo] = error;
  }

  // Confirmación de contraseña (igual que en el formulario)
  if (body.password !== undefined && body.password !== body.confirmPassword) {
    errores.confirmPassword = 'Las contraseñas no coinciden.';
  }

  // Términos y condiciones: obligatorios al registrar
  if (!parcial && body.terminos !== true) {
    errores.terminos = 'Debes aceptar los términos y condiciones.';
  }

  if (parcial && !CAMPOS.some((c) => body[c] !== undefined)) {
    errores.general = `Envía al menos un campo para actualizar: ${CAMPOS.join(', ')}.`;
  }

  return errores;
}

module.exports = { validarUsuario, CIUDADES, CAMPOS };
