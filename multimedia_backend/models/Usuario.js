const conexion = require('../database/conexion').promise();

class Usuario {
  static async obtenerPorNombre(nombreUsuario) {
    const sql = 'SELECT id_usuario, nombre_usuario, password_hash, rol, estado FROM usuario WHERE nombre_usuario = ? LIMIT 1';
    const [filas] = await conexion.execute(sql, [nombreUsuario]);
    return filas[0];
  }
}

module.exports = Usuario;
