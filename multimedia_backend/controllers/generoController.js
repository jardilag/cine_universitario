const Genero = require('../models/Genero');

function idValido(id) {
  return /^[1-9]\d*$/.test(id) && Number(id) <= 4294967295;
}

function validarDatos(datos, actualizar = false) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return 'Debes enviar un objeto JSON';
  if (Object.keys(datos).length === 0) return 'Debes enviar datos';
  if (actualizar && !['nombre', 'estado', 'descripcion'].some(campo => datos[campo] !== undefined)) {
    return 'Debes enviar un campo modificable';
  }
  if ((!actualizar || datos.nombre !== undefined) && (typeof datos.nombre !== 'string' || !datos.nombre.trim() || datos.nombre.trim().length > 100)) {
    return 'nombre es obligatorio y admite hasta 100 caracteres';
  }
  if (datos.descripcion != null && (typeof datos.descripcion !== 'string')) {
    return 'descripcion debe ser texto';
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

class GeneroController {
  getAllGeneros(req, res) {
    Genero.obtenerTodos((error, results) => {
      if (error) return manejarError(res, error);
      return res.status(200).json({ message: 'Lista de géneros', data: results });
    });
  }

  getGeneroById(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido' });
    Genero.obtenerPorId(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.length === 0) return res.status(404).json({ message: 'No existe el registro de género' });
      return res.status(200).json({ message: 'Registro de género', data: results[0] });
    });
  }

  insertGenero(req, res) {
    const datos = req.body;
    const validacion = validarDatos(datos);
    if (validacion) return res.status(400).json({ message: validacion });
    Genero.crear(
      datos.nombre.trim(), datos.estado ?? 'Activo', datos.descripcion ?? null,
      (error, results) => {
        if (error) return manejarError(res, error);
        return res.status(201).json({ message: 'Registro creado correctamente', id_genero: results.insertId });
      }
    );
  }

  updateGenero(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido' });
    const datos = req.body;
    const validacion = validarDatos(datos, true);
    if (validacion) return res.status(400).json({ message: validacion });
    Genero.obtenerPorId(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.length === 0) return res.status(404).json({ message: 'No existe el registro de género' });
      const actual = results[0];
      const nombre = datos.nombre === undefined ? actual.nombre : datos.nombre.trim();
      const estado = datos.estado === undefined ? actual.estado : datos.estado;
      const descripcion = datos.descripcion === undefined ? actual.descripcion : datos.descripcion;
      Genero.actualizar(
        id, nombre, estado, descripcion,
        (error, resultado) => {
          if (error) return manejarError(res, error);
          if (resultado.affectedRows === 0) return res.status(404).json({ message: 'No existe el registro de género' });
          return res.status(200).json({ message: 'Registro actualizado correctamente', id_genero: Number(id) });
        }
      );
    });
  }

  deleteGenero(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido' });
    Genero.obtenerPorId(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.length === 0) return res.status(404).json({ message: 'No existe el registro de género' });
      Genero.inactivar(id, (error) => {
        if (error) return manejarError(res, error);
        return res.status(200).json({ message: 'Registro inactivado correctamente', id_genero: Number(id), estado: 'Inactivo' });
      });
    });
  }
}

module.exports = new GeneroController();
