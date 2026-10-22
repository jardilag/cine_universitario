const conexion = require('../database/conexion');

class Productora {
  // Consultar todos los registros.
  static obtenerTodos(callback) {
    const sql = 'SELECT id_productora, nombre, estado, slogan, descripcion, fecha_creacion, fecha_actualizacion FROM productora ORDER BY id_productora ASC';
    conexion.query(sql, callback);
  }

  // Consultar un registro por su identificador.
  static obtenerPorId(id, callback) {
    const sql = 'SELECT id_productora, nombre, estado, slogan, descripcion, fecha_creacion, fecha_actualizacion FROM productora WHERE id_productora = ?';
    conexion.query(sql, [id], callback);
  }

  // Insertar un registro.
  static crear(nombre, estado, slogan, descripcion, callback) {
    const sql = 'INSERT INTO productora (nombre, estado, slogan, descripcion) VALUES (?, ?, ?, ?)';
    conexion.query(sql, [nombre, estado, slogan, descripcion], callback);
  }

  // Actualizar un registro.
  static actualizar(id, nombre, estado, slogan, descripcion, callback) {
    const sql = 'UPDATE productora SET nombre = ?, estado = ?, slogan = ?, descripcion = ? WHERE id_productora = ?';
    conexion.query(sql, [nombre, estado, slogan, descripcion, id], callback);
  }

  // Inactivar sin eliminar el registro.
  static inactivar(id, callback) {
    const sql = "UPDATE productora SET estado = 'Inactivo' WHERE id_productora = ?";
    conexion.query(sql, [id], callback);
  }
}

module.exports = Productora;
