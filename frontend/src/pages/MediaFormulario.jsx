import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import Cargando from '../components/Cargando';
import {
  directorService,
  generoService,
  mediaService,
  productoraService,
  tipoService,
} from '../services/servicios';
import { alertaAdvertencia, alertaError, alertaExito, mensajeDeError } from '../utils/alertas';

const vacio = {
  serial: '',
  titulo: '',
  sinopsis: '',
  url: '',
  portada: '',
  estado: 'Activo',
  anio_estreno: '',
  id_genero: '',
  id_director: '',
  id_productora: '',
  id_tipo: '',
};

// Muestra los activos y, en edición, también el valor actual aunque esté inactivo.
const opcionesDisponibles = (lista, idCampo, actual) =>
  lista.filter((x) => x.estado === undefined || x.estado === 'Activo' || String(x[idCampo]) === String(actual));

export default function MediaFormulario({ esEdicion = false }) {
  const { id: serialRuta } = useParams();
  const { search } = useLocation();
  const id = serialRuta ?? new URLSearchParams(search).get('serial');
  const history = useHistory();
  const anioActual = new Date().getFullYear();

  const [datos, setDatos] = useState(vacio);
  const [anioOriginal, setAnioOriginal] = useState('');
  const [catalogos, setCatalogos] = useState({ generos: [], directores: [], productoras: [], tipos: [] });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const anioAnteriorInvalido = esEdicion && (Number(anioOriginal) < 1900 || Number(anioOriginal) > anioActual);

  // Al abrir: cargamos los 4 catálogos (para los <select>) y, si es edición, la producción.
  useEffect(() => {
    if (esEdicion && !id) {
      history.replace('/');
      return;
    }

    async function inicializar() {
      try {
        const [generos, directores, productoras, tipos] = await Promise.all([
          generoService.listar(),
          directorService.listar(),
          productoraService.listar(),
          tipoService.listar(),
        ]);
        setCatalogos({ generos, directores, productoras, tipos });

        if (esEdicion) {
          const m = await mediaService.obtener(id);
          setAnioOriginal(String(m.anio_estreno));
          setDatos({
            serial: m.serial,
            titulo: m.titulo,
            sinopsis: m.sinopsis,
            url: m.url,
            portada: m.portada ?? '',
            estado: m.estado,
            anio_estreno: m.anio_estreno,
            id_genero: m.id_genero,
            id_director: m.id_director,
            id_productora: m.id_productora,
            id_tipo: m.id_tipo,
          });
        }
      } catch (error) {
        alertaError(mensajeDeError(error));
        history.replace('/');
      } finally {
        setCargando(false);
      }
    }
    inicializar();
  }, [esEdicion, history, id]);

  function manejarCambio(e) {
    const { name, value } = e.target;
    setDatos((anterior) => ({ ...anterior, [name]: value }));
  }

  async function manejarEnvio(e) {
    e.preventDefault();

    // Validaciones básicas en el cliente
    const obligatorios = [
      ['serial', 'Serial'], ['titulo', 'Título'], ['sinopsis', 'Sinopsis'], ['url', 'URL'],
      ['id_genero', 'Género'], ['id_director', 'Director'],
      ['id_productora', 'Productora'], ['id_tipo', 'Tipo'],
    ];
    for (const [campo, etiqueta] of obligatorios) {
      if (!String(datos[campo]).trim()) return alertaAdvertencia(`El campo "${etiqueta}" es obligatorio.`);
    }
    if (!esEdicion && !/^[A-Za-z0-9_-]{1,50}$/.test(datos.serial)) {
      return alertaAdvertencia('El serial debe contener de 1 a 50 letras sin tilde, números, guiones o guiones bajos.');
    }
    const enviarAnio = !esEdicion || String(datos.anio_estreno) !== anioOriginal;
    const anio = Number(datos.anio_estreno);
    if (enviarAnio && (!Number.isInteger(anio) || anio < 1900 || anio > anioActual)) {
      return alertaAdvertencia(`El año de estreno debe ser un entero entre 1900 y ${anioActual}.`);
    }

    // El backend espera números en el año y en los ids, por eso los convertimos con Number().
    const cuerpo = {
      titulo: datos.titulo.trim(),
      sinopsis: datos.sinopsis.trim(),
      url: datos.url.trim(),
      portada: datos.portada.trim() || null,
      estado: datos.estado,
      id_genero: Number(datos.id_genero),
      id_director: Number(datos.id_director),
      id_productora: Number(datos.id_productora),
      id_tipo: Number(datos.id_tipo),
    };
    if (enviarAnio) cuerpo.anio_estreno = anio;

    setGuardando(true);
    try {
      const respuesta = esEdicion
        ? await mediaService.actualizar(id, cuerpo)
        : await mediaService.crear({ serial: datos.serial, ...cuerpo });
      await alertaExito(respuesta.message);
      history.push('/');
    } catch (error) {
      alertaError(mensajeDeError(error));
    } finally {
      setGuardando(false);
    }
  }

  // Select reutilizable para los 4 catálogos
  function renderSelect(nombre, etiqueta, lista, idCampo, textoCampo) {
    return (
      <div className="col-md-6">
        <label htmlFor={nombre} className="form-label">
          {etiqueta} <span className="text-danger">*</span>
        </label>
        <select id={nombre} name={nombre} className="form-select" value={datos[nombre]} onChange={manejarCambio}>
          <option value="">Selecciona...</option>
          {opcionesDisponibles(lista, idCampo, datos[nombre]).map((x) => (
            <option key={x[idCampo]} value={x[idCampo]}>
              {x[textoCampo]}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (cargando) return <Cargando />;

  return (
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h4 mb-4">{esEdicion ? 'Editar' : 'Nueva'} producción</h2>
            <form onSubmit={manejarEnvio} noValidate>
              <div className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="serial" className="form-label">
                    Serial <span className="text-danger">*</span>
                  </label>
                  <input
                    id="serial" name="serial" className="form-control" maxLength={50}
                    value={datos.serial} onChange={manejarCambio}
                    disabled={esEdicion} // la llave primaria no se puede cambiar
                    aria-describedby={esEdicion ? undefined : 'ayuda-serial'}
                  />
                  {!esEdicion && (
                    <div id="ayuda-serial" className="form-text">Letras sin tilde, números, guiones (-) y guiones bajos (_).</div>
                  )}
                </div>
                <div className="col-md-5">
                  <label htmlFor="titulo" className="form-label">
                    Título <span className="text-danger">*</span>
                  </label>
                  <input id="titulo" name="titulo" className="form-control" maxLength={200}
                    value={datos.titulo} onChange={manejarCambio} />
                </div>
                <div className="col-md-3">
                  <label htmlFor="anio_estreno" className="form-label">
                    Año de estreno <span className="text-danger">*</span>
                  </label>
                  <input id="anio_estreno" name="anio_estreno" type="number" min={1900} max={anioActual}
                    className="form-control" value={datos.anio_estreno} onChange={manejarCambio}
                    aria-describedby={anioAnteriorInvalido ? 'ayuda-anio' : undefined} />
                  {anioAnteriorInvalido && (
                    <div id="ayuda-anio" className="form-text">
                      El año registrado está fuera del rango. Puedes corregirlo o guardar los demás cambios.
                    </div>
                  )}
                </div>

                <div className="col-12">
                  <label htmlFor="sinopsis" className="form-label">
                    Sinopsis <span className="text-danger">*</span>
                  </label>
                  <textarea id="sinopsis" name="sinopsis" rows="3" className="form-control"
                    value={datos.sinopsis} onChange={manejarCambio} />
                </div>

                <div className="col-md-6">
                  <label htmlFor="url" className="form-label">
                    URL de la producción <span className="text-danger">*</span>
                  </label>
                  <input id="url" name="url" type="url" className="form-control" maxLength={2048}
                    placeholder="https://..." value={datos.url} onChange={manejarCambio} aria-describedby="ayuda-url" />
                  <div id="ayuda-url" className="form-text">Pega el enlace de reproducción. La ruta del catálogo se genera desde el serial.</div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="portada" className="form-label">URL de la portada</label>
                  <input id="portada" name="portada" type="url" className="form-control" maxLength={2048}
                    placeholder="https://..." value={datos.portada} onChange={manejarCambio} />
                </div>

                {renderSelect('id_genero', 'Género', catalogos.generos, 'id_genero', 'nombre')}
                {renderSelect('id_director', 'Director', catalogos.directores, 'id_director', 'nombres')}
                {renderSelect('id_productora', 'Productora', catalogos.productoras, 'id_productora', 'nombre')}
                {renderSelect('id_tipo', 'Tipo', catalogos.tipos, 'id_tipo', 'nombre')}

                <div className="col-md-6">
                  <label htmlFor="estado" className="form-label">Estado</label>
                  <select id="estado" name="estado" className="form-select" value={datos.estado} onChange={manejarCambio}>
                    <option value="Activo">Activo (visible en la página principal)</option>
                    <option value="Inactivo">Inactivo (oculta para visitantes)</option>
                  </select>
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button type="submit" className="btn btn-primary" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => history.push('/')}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
