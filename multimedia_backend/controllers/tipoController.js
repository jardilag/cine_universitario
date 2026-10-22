const Tipo = require('../models/Tipo');

function idValido(id) {
  return /^[1-9]\d*$/.test(id) && Number(id) <= 4294967295;
}

function validarDatos(datos, actualizar = false) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return 'Debes enviar un objeto JSON';
  if (Object.keys(datos).length === 0) return 'Debes enviar datos';
  if (actualizar && !['nombre', 'descripcion'].some(campo => datos[campo] !== undefined)) {
    return 'Debes enviar un campo modificable';
  }
  if ((!actualizar || datos.nombre !== undefined) && (typeof datos.nombre !== 'string' || !datos.nombre.trim() || datos.nombre.trim().length > 80)) {
    return 'nombre es obligatorio y admite hasta 80 caracteres';
  }
  if (datos.descripcion != null && (typeof datos.descripcion !== 'string')) {
    return 'descripcion debe ser texto';
  }
  return null;
}

function manejarError(res, error) {
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Ya existe un registro con esos datos' });
  }
  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ message: 'No se puede eliminar un tipo asociado a multimedia' });
  }
  console.error('Error de MySQL:', error);
  return res.status(500).json({ message: 'Error interno de base de datos' });
}

class TipoController {
  getAllTipos(req, res) {
    Tipo.obtenerTodos((error, results) => {
      if (error) return manejarError(res, error);
      return res.status(200).json({ message: 'Lista de tipos', data: results });
    });
  }

  getTipoById(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido' });
    Tipo.obtenerPorId(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.length === 0) return res.status(404).json({ message: 'No existe el registro de tipo' });
      return res.status(200).json({ message: 'Registro de tipo', data: results[0] });
    });
  }

  insertTipo(req, res) {
    const datos = req.body;
    const validacion = validarDatos(datos);
    if (validacion) return res.status(400).json({ message: validacion });
    Tipo.crear(
      datos.nombre.trim(), datos.descripcion ?? null,
      (error, results) => {
        if (error) return manejarError(res, error);
        return res.status(201).json({ message: 'Registro creado correctamente', id_tipo: results.insertId });
      }
    );
  }

  updateTipo(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido' });
    const datos = req.body;
    const validacion = validarDatos(datos, true);
    if (validacion) return res.status(400).json({ message: validacion });
    Tipo.obtenerPorId(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.length === 0) return res.status(404).json({ message: 'No existe el registro de tipo' });
      const actual = results[0];
      const nombre = datos.nombre === undefined ? actual.nombre : datos.nombre.trim();
      const descripcion = datos.descripcion === undefined ? actual.descripcion : datos.descripcion;
      Tipo.actualizar(
        id, nombre, descripcion,
        (error, resultado) => {
          if (error) return manejarError(res, error);
          if (resultado.affectedRows === 0) return res.status(404).json({ message: 'No existe el registro de tipo' });
          return res.status(200).json({ message: 'Registro actualizado correctamente', id_tipo: Number(id) });
        }
      );
    });
  }

  deleteTipo(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido' });
    Tipo.eliminar(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.affectedRows === 0) return res.status(404).json({ message: 'No existe el registro de tipo' });
      return res.status(200).json({ message: 'Registro eliminado correctamente', id_tipo: Number(id) });
    });
  }
}

module.exports = new TipoController();
