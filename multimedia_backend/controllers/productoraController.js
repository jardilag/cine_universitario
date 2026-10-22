const Productora = require('../models/Productora');

function idValido(id) {
  return /^[1-9]\d*$/.test(id) && Number(id) <= 4294967295;
}

function validarDatos(datos, actualizar = false) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return 'Debes enviar un objeto JSON';
  if (Object.keys(datos).length === 0) return 'Debes enviar datos';
  if (actualizar && !['nombre', 'estado', 'slogan', 'descripcion'].some(campo => datos[campo] !== undefined)) {
    return 'Debes enviar un campo modificable';
  }
  if ((!actualizar || datos.nombre !== undefined) && (typeof datos.nombre !== 'string' || !datos.nombre.trim() || datos.nombre.trim().length > 150)) {
    return 'nombre es obligatorio y admite hasta 150 caracteres';
  }
  if (datos.slogan != null && (typeof datos.slogan !== 'string' || datos.slogan.length > 255)) {
    return 'slogan debe ser texto de hasta 255 caracteres';
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

class ProductoraController {
  getAllProductoras(req, res) {
    Productora.obtenerTodos((error, results) => {
      if (error) return manejarError(res, error);
      return res.status(200).json({ message: 'Lista de productoras', data: results });
    });
  }

  getProductoraById(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido' });
    Productora.obtenerPorId(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.length === 0) return res.status(404).json({ message: 'No existe el registro de productora' });
      return res.status(200).json({ message: 'Registro de productora', data: results[0] });
    });
  }

  insertProductora(req, res) {
    const datos = req.body;
    const validacion = validarDatos(datos);
    if (validacion) return res.status(400).json({ message: validacion });
    Productora.crear(
      datos.nombre.trim(), datos.estado ?? 'Activo', datos.slogan ?? null, datos.descripcion ?? null,
      (error, results) => {
        if (error) return manejarError(res, error);
        return res.status(201).json({ message: 'Registro creado correctamente', id_productora: results.insertId });
      }
    );
  }

  updateProductora(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido' });
    const datos = req.body;
    const validacion = validarDatos(datos, true);
    if (validacion) return res.status(400).json({ message: validacion });
    Productora.obtenerPorId(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.length === 0) return res.status(404).json({ message: 'No existe el registro de productora' });
      const actual = results[0];
      const nombre = datos.nombre === undefined ? actual.nombre : datos.nombre.trim();
      const estado = datos.estado === undefined ? actual.estado : datos.estado;
      const slogan = datos.slogan === undefined ? actual.slogan : datos.slogan;
      const descripcion = datos.descripcion === undefined ? actual.descripcion : datos.descripcion;
      Productora.actualizar(
        id, nombre, estado, slogan, descripcion,
        (error, resultado) => {
          if (error) return manejarError(res, error);
          if (resultado.affectedRows === 0) return res.status(404).json({ message: 'No existe el registro de productora' });
          return res.status(200).json({ message: 'Registro actualizado correctamente', id_productora: Number(id) });
        }
      );
    });
  }

  deleteProductora(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'ID inválido' });
    Productora.obtenerPorId(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.length === 0) return res.status(404).json({ message: 'No existe el registro de productora' });
      Productora.inactivar(id, (error) => {
        if (error) return manejarError(res, error);
        return res.status(200).json({ message: 'Registro inactivado correctamente', id_productora: Number(id), estado: 'Inactivo' });
      });
    });
  }
}

module.exports = new ProductoraController();
