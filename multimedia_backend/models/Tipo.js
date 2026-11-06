const conexion = require('../database/conexion');

class Tipo {
  // Consultar todos los registros.
  static obtenerTodos(callback) {
    const sql = 'SELECT id_tipo, nombre, estado, descripcion, fecha_creacion, fecha_actualizacion FROM tipo ORDER BY id_tipo ASC';
    conexion.query(sql, callback);
  }

  // Consultar un registro por su identificador.
  static obtenerPorId(id, callback) {
    const sql = 'SELECT id_tipo, nombre, estado, descripcion, fecha_creacion, fecha_actualizacion FROM tipo WHERE id_tipo = ?';
    conexion.query(sql, [id], callback);
  }

  // Insertar un registro.
  static crear(nombre, estado, descripcion, callback) {
    const sql = 'INSERT INTO tipo (nombre, estado, descripcion) VALUES (?, ?, ?)';
    conexion.query(sql, [nombre, estado, descripcion], callback);
  }

  // Actualizar un registro.
  static actualizar(id, nombre, estado, descripcion, callback) {
    const sql = 'UPDATE tipo SET nombre = ?, estado = ?, descripcion = ? WHERE id_tipo = ?';
    conexion.query(sql, [nombre, estado, descripcion, id], callback);
  }

  // Inactivar sin eliminar el registro.
  static inactivar(id, callback) {
    const sql = "UPDATE tipo SET estado = 'Inactivo' WHERE id_tipo = ?";
    conexion.query(sql, [id], callback);
  }
}

module.exports = Tipo;
