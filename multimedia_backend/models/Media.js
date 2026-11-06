const conexion = require('../database/conexion');

class Media {
  // Consultar todos los registros.
  static obtenerTodos(callback) {
    const sql = 'SELECT serial, titulo, sinopsis, url, portada, estado, anio_estreno, id_genero, id_director, id_productora, id_tipo, fecha_creacion, fecha_actualizacion FROM media ORDER BY serial ASC';
    conexion.query(sql, callback);
  }

  // Consultar un registro por su identificador.
  static obtenerPorId(id, callback) {
    const sql = 'SELECT serial, titulo, sinopsis, url, portada, estado, anio_estreno, id_genero, id_director, id_productora, id_tipo, fecha_creacion, fecha_actualizacion FROM media WHERE serial = ?';
    conexion.query(sql, [id], callback);
  }

  // Insertar un registro.
  static crear(serial, titulo, sinopsis, url, portada, estado, anio_estreno, id_genero, id_director, id_productora, id_tipo, callback) {
    const sql = 'INSERT INTO media (serial, titulo, sinopsis, url, portada, estado, anio_estreno, id_genero, id_director, id_productora, id_tipo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    conexion.query(sql, [serial, titulo, sinopsis, url, portada, estado, anio_estreno, id_genero, id_director, id_productora, id_tipo], callback);
  }

  // Actualizar un registro.
  static actualizar(id, titulo, sinopsis, url, portada, estado, anio_estreno, id_genero, id_director, id_productora, id_tipo, callback) {
    const sql = 'UPDATE media SET titulo = ?, sinopsis = ?, url = ?, portada = ?, estado = ?, anio_estreno = ?, id_genero = ?, id_director = ?, id_productora = ?, id_tipo = ? WHERE serial = ?';
    conexion.query(sql, [titulo, sinopsis, url, portada, estado, anio_estreno, id_genero, id_director, id_productora, id_tipo, id], callback);
  }

  // Inactivar sin eliminar el registro.
  static inactivar(id, callback) {
    const sql = "UPDATE media SET estado = 'Inactivo' WHERE serial = ?";
    conexion.query(sql, [id], callback);
  }
}

module.exports = Media;
