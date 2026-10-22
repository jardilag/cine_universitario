const conexion = require('../database/conexion');

class Director {
  // Consultar todos los registros.
  static obtenerTodos(callback) {
    const sql = 'SELECT id_director, nombres, estado, fecha_creacion, fecha_actualizacion FROM director ORDER BY id_director ASC';
    conexion.query(sql, callback);
  }

  // Consultar un registro por su identificador.
  static obtenerPorId(id, callback) {
    const sql = 'SELECT id_director, nombres, estado, fecha_creacion, fecha_actualizacion FROM director WHERE id_director = ?';
    conexion.query(sql, [id], callback);
  }

  // Insertar un registro.
  static crear(nombres, estado, callback) {
    const sql = 'INSERT INTO director (nombres, estado) VALUES (?, ?)';
    conexion.query(sql, [nombres, estado], callback);
  }

  // Actualizar un registro.
  static actualizar(id, nombres, estado, callback) {
    const sql = 'UPDATE director SET nombres = ?, estado = ? WHERE id_director = ?';
    conexion.query(sql, [nombres, estado, id], callback);
  }

  // Inactivar sin eliminar el registro.
  static inactivar(id, callback) {
    const sql = "UPDATE director SET estado = 'Inactivo' WHERE id_director = ?";
    conexion.query(sql, [id], callback);
  }
}

module.exports = Director;
