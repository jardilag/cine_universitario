const Media = require('../models/Media');

function idValido(id) {
  return typeof id === 'string' && id.trim().length > 0 && id.length <= 50;
}

function validarDatos(datos, actualizar = false) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) return 'Debes enviar un objeto JSON';
  if (Object.keys(datos).length === 0) return 'Debes enviar datos';
  if (actualizar && datos.serial !== undefined) return 'El serial no se puede modificar';
  if (actualizar && !['titulo', 'sinopsis', 'url', 'portada', 'anio_estreno', 'id_genero', 'id_director', 'id_productora', 'id_tipo'].some(campo => datos[campo] !== undefined)) {
    return 'Debes enviar un campo modificable';
  }
  if (!actualizar) {
    if ((typeof datos.serial !== 'string' || !datos.serial.trim() || datos.serial.trim().length > 50)) {
      return 'serial es obligatorio y admite hasta 50 caracteres';
    }
  }
  if ((!actualizar || datos.titulo !== undefined) && (typeof datos.titulo !== 'string' || !datos.titulo.trim() || datos.titulo.trim().length > 200)) {
    return 'titulo es obligatorio y admite hasta 200 caracteres';
  }
  if ((!actualizar || datos.sinopsis !== undefined) && (typeof datos.sinopsis !== 'string' || !datos.sinopsis.trim())) {
    return 'sinopsis es obligatorio';
  }
  if ((!actualizar || datos.url !== undefined) && (typeof datos.url !== 'string' || !datos.url.trim() || datos.url.trim().length > 2048)) {
    return 'url es obligatorio y admite hasta 2048 caracteres';
  }
  if (datos.portada != null && (typeof datos.portada !== 'string' || datos.portada.length > 2048)) {
    return 'portada debe ser texto de hasta 2048 caracteres';
  }
  if ((!actualizar || datos.anio_estreno !== undefined) &&
      (!Number.isInteger(datos.anio_estreno) || (datos.anio_estreno !== 0 && (datos.anio_estreno < 1901 || datos.anio_estreno > 2155)))) {
    return 'anio_estreno debe ser un entero entre 1901 y 2155, o 0';
  }
  for (const campo of ['id_genero', 'id_director', 'id_productora', 'id_tipo']) {
    if ((!actualizar || datos[campo] !== undefined) &&
        (!/^[1-9]\d*$/.test(datos[campo]) || Number(datos[campo]) > 4294967295)) {
      return campo + ' debe ser un entero positivo';
    }
  }
  return null;
}

function manejarError(res, error) {
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ message: 'Ya existe un registro con esos datos' });
  }
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ message: 'El género, director, productora o tipo indicado no existe' });
  }
  console.error('Error de MySQL:', error);
  return res.status(500).json({ message: 'Error interno de base de datos' });
}

class MediaController {
  getAllMedia(req, res) {
    Media.obtenerTodos((error, results) => {
      if (error) return manejarError(res, error);
      return res.status(200).json({ message: 'Lista de multimedia', data: results });
    });
  }

  getMediaById(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'Serial inválido' });
    Media.obtenerPorId(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.length === 0) return res.status(404).json({ message: 'No existe el registro de multimedia' });
      return res.status(200).json({ message: 'Registro de multimedia', data: results[0] });
    });
  }

  insertMedia(req, res) {
    const datos = req.body;
    const validacion = validarDatos(datos);
    if (validacion) return res.status(400).json({ message: validacion });
    Media.crear(
      datos.serial.trim(), datos.titulo.trim(), datos.sinopsis.trim(), datos.url.trim(), datos.portada ?? null, datos.anio_estreno, datos.id_genero, datos.id_director, datos.id_productora, datos.id_tipo,
      (error, results) => {
        if (error) return manejarError(res, error);
        return res.status(201).json({ message: 'Registro creado correctamente', serial: datos.serial.trim() });
      }
    );
  }

  updateMedia(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'Serial inválido' });
    const datos = req.body;
    const validacion = validarDatos(datos, true);
    if (validacion) return res.status(400).json({ message: validacion });
    Media.obtenerPorId(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.length === 0) return res.status(404).json({ message: 'No existe el registro de multimedia' });
      const actual = results[0];
      const titulo = datos.titulo === undefined ? actual.titulo : datos.titulo.trim();
      const sinopsis = datos.sinopsis === undefined ? actual.sinopsis : datos.sinopsis.trim();
      const url = datos.url === undefined ? actual.url : datos.url.trim();
      const portada = datos.portada === undefined ? actual.portada : datos.portada;
      const anio_estreno = datos.anio_estreno === undefined ? actual.anio_estreno : datos.anio_estreno;
      const id_genero = datos.id_genero === undefined ? actual.id_genero : datos.id_genero;
      const id_director = datos.id_director === undefined ? actual.id_director : datos.id_director;
      const id_productora = datos.id_productora === undefined ? actual.id_productora : datos.id_productora;
      const id_tipo = datos.id_tipo === undefined ? actual.id_tipo : datos.id_tipo;
      Media.actualizar(
        id, titulo, sinopsis, url, portada, anio_estreno, id_genero, id_director, id_productora, id_tipo,
        (error, resultado) => {
          if (error) return manejarError(res, error);
          if (resultado.affectedRows === 0) return res.status(404).json({ message: 'No existe el registro de multimedia' });
          return res.status(200).json({ message: 'Registro actualizado correctamente', serial: id });
        }
      );
    });
  }

  deleteMedia(req, res) {
    const { id } = req.params;
    if (!idValido(id)) return res.status(400).json({ message: 'Serial inválido' });
    Media.eliminar(id, (error, results) => {
      if (error) return manejarError(res, error);
      if (results.affectedRows === 0) return res.status(404).json({ message: 'No existe el registro de multimedia' });
      return res.status(200).json({ message: 'Registro eliminado correctamente', serial: id });
    });
  }
}

module.exports = new MediaController();
