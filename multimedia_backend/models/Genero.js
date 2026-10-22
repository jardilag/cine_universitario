const conexion = require('../database/conexion');

class Genero {
  // Consultar todos los registros.
  static obtenerTodos(callback) {
    const sql = 'SELECT id_genero, nombre, estado, descripcion, fecha_creacion, fecha_actualizacion FROM genero ORDER BY id_genero ASC';
    conexion.query(sql, callback);
  }

  // Consultar un registro por su identificador.
  static obtenerPorId(id, callback) {
    const sql = 'SELECT id_genero, nombre, estado, descripcion, fecha_creacion, fecha_actualizacion FROM genero WHERE id_genero = ?';
    conexion.query(sql, [id], callback);
  }

  // Insertar un registro.
  static crear(nombre, estado, descripcion, callback) {
    const sql = 'INSERT INTO genero (nombre, estado, descripcion) VALUES (?, ?, ?)';
    conexion.query(sql, [nombre, estado, descripcion], callback);
  }

  // Actualizar un registro.
  static actualizar(id, nombre, estado, descripcion, callback) {
    const sql = 'UPDATE genero SET nombre = ?, estado = ?, descripcion = ? WHERE id_genero = ?';
    conexion.query(sql, [nombre, estado, descripcion, id], callback);
  }

  // Inactivar sin eliminar el registro.
  static inactivar(id, callback) {
    const sql = "UPDATE genero SET estado = 'Inactivo' WHERE id_genero = ?";
    conexion.query(sql, [id], callback);
  }
}

module.exports = Genero;
