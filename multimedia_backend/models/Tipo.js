const conexion = require('../database/conexion');

class Tipo {
  // Consultar todos los registros.
  static obtenerTodos(callback) {
    const sql = 'SELECT id_tipo, nombre, descripcion, fecha_creacion, fecha_actualizacion FROM tipo ORDER BY id_tipo ASC';
    conexion.query(sql, callback);
  }

  // Consultar un registro por su identificador.
  static obtenerPorId(id, callback) {
    const sql = 'SELECT id_tipo, nombre, descripcion, fecha_creacion, fecha_actualizacion FROM tipo WHERE id_tipo = ?';
    conexion.query(sql, [id], callback);
  }

  // Insertar un registro.
  static crear(nombre, descripcion, callback) {
    const sql = 'INSERT INTO tipo (nombre, descripcion) VALUES (?, ?)';
    conexion.query(sql, [nombre, descripcion], callback);
  }

  // Actualizar un registro.
  static actualizar(id, nombre, descripcion, callback) {
    const sql = 'UPDATE tipo SET nombre = ?, descripcion = ? WHERE id_tipo = ?';
    conexion.query(sql, [nombre, descripcion, id], callback);
  }

  // Eliminar físicamente: esta tabla no tiene estado.
  static eliminar(id, callback) {
    const sql = 'DELETE FROM tipo WHERE id_tipo = ?';
    conexion.query(sql, [id], callback);
  }
}

module.exports = Tipo;
