const { randomBytes } = require('node:crypto');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { crearSesion } = require('../middleware/autorizacion');

const formatoBcrypt = /^\$2[aby]\$(?:0[4-9]|[12]\d|3[01])\$[./A-Za-z0-9]{53}$/;
const hashSinCuenta = bcrypt.hashSync(randomBytes(32).toString('hex'), 12);

class AuthController {
  async iniciarSesion(req, res) {
    res.set('Cache-Control', 'no-store');
    const { usuario, password } = req.body ?? {};
    const nombre = typeof usuario === 'string' ? usuario.trim() : '';

    if (!nombre || nombre.length > 80 || typeof password !== 'string' ||
        !password || Buffer.byteLength(password) > 72) {
      return res.status(400).json({ message: 'Ingresa un usuario y una contraseña válidos' });
    }

    let cuenta;
    try {
      cuenta = await Usuario.obtenerPorNombre(nombre);
    } catch (error) {
      console.error('Error al consultar la cuenta de usuario', error.code);
      return res.status(503).json({ message: 'El inicio de sesión no está disponible' });
    }

    const hashValido = formatoBcrypt.test(cuenta?.password_hash ?? '');
    const coincide = await bcrypt.compare(password, hashValido ? cuenta.password_hash : hashSinCuenta);
    if (!hashValido || !coincide || cuenta.estado !== 'Activo') {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const { id_usuario, nombre_usuario, rol } = cuenta;
    return res.json({
      ...crearSesion(cuenta),
      usuario: { id_usuario, nombre_usuario, rol }
    });
  }
}

module.exports = new AuthController();
