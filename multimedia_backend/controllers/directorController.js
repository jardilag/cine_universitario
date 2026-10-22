const Director = require('../models/Director');

function idValido(id) {
  return /^[1-9]\d*$/.test(id) && Number(id) <= 4294967295;
}

function validarDatos(datos, actualizar = false) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return 'Debes enviar un objeto JSON';
  if (Object.keys(datos).length === 0) return 'Debes enviar datos';
  if (actualizar && !['nombres', 'estado'].some(campo => datos[campo] !== undefined)) {
    return 'Debes enviar un campo modificable';
  }
  if ((!actualizar || datos.nombres !== undefined) && (typeof datos.nombres !== 'string' || !datos.nombres.trim() || datos.nombres.trim().length > 180)) {
    return 'nombres es obligatorio y admite hasta 180 caracteres';
  }
  if (datos.estado !== undefined && datos.estado !== 'Activo' && datos.estado !== 'Inactivo') {
    return 'El estado debe ser Activo o Inactivo';
  }
  return null;
}

function manejarError(res, error) {
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Ya existe un registro con esos datos' });
  }
  console.error('Error de MySQL:', error);
  return res.status(500).json({ message: 'Error interno de base de datos' });
}

class DirectorController {
  getAllDirectors(req, res) {
    Director.obtenerTodos((error, results) => {
      if (error) return manejarError(res, error);
      return res.status(200).json({ message: 'Lista de directores', data: results });
    });
  }

  getDirectorById(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido' });
    Director.obtenerPorId(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.length === 0) return res.status(404).json({ message: 'No existe el registro de director' });
      return res.status(200).json({ message: 'Registro de director', data: results[0] });
    });
  }

  insertDirector(req, res) {
    const datos = req.body;
    const validacion = validarDatos(datos);
    if (validacion) return res.status(400).json({ message: validacion });
    Director.crear(
      datos.nombres.trim(), datos.estado ?? 'Activo',
      (error, results) => {
        if (error) return manejarError(res, error);
        return res.status(201).json({ message: 'Registro creado correctamente', id_director: results.insertId });
      }
    );
  }

  updateDirector(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido' });
    const datos = req.body;
    const validacion = validarDatos(datos, true);
    if (validacion) return res.status(400).json({ message: validacion });
    Director.obtenerPorId(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.length === 0) return res.status(404).json({ message: 'No existe el registro de director' });
      const actual = results[0];
      const nombres = datos.nombres === undefined ? actual.nombres : datos.nombres.trim();
      const estado = datos.estado === undefined ? actual.estado : datos.estado;
      Director.actualizar(
        id, nombres, estado,
        (error, resultado) => {
          if (error) return manejarError(res, error);
          if (resultado.affectedRows === 0) return res.status(404).json({ message: 'No existe el registro de director' });
          return res.status(200).json({ message: 'Registro actualizado correctamente', id_director: Number(id) });
        }
      );
    });
  }

  deleteDirector(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido' });
    Director.obtenerPorId(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.length === 0) return res.status(404).json({ message: 'No existe el registro de director' });
      Director.inactivar(id, (error) => {
        if (error) return manejarError(res, error);
        return res.status(200).json({ message: 'Registro inactivado correctamente', id_director: Number(id), estado: 'Inactivo' });
      });
    });
  }
}

module.exports = new DirectorController();
