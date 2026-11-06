import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Cargando from '../components/Cargando';
import {
  directorService,
  generoService,
  mediaService,
  productoraService,
  tipoService,
} from '../services/servicios';
import { alertaError, alertaExito, confirmar, mensajeDeError } from '../utils/alertas';

// Convierte un arreglo de catálogo en un diccionario { id: nombre } para buscar nombres rápido.
const aMapa = (lista, idCampo, nombreCampo) =>
  Object.fromEntries(lista.map((x) => [x[idCampo], x[nombreCampo]]));

export default function MediaLista() {
  const [items, setItems] = useState([]);
  const [catalogos, setCatalogos] = useState({ generos: {}, directores: {}, productoras: {}, tipos: {} });
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  async function cargar() {
    setCargando(true);
    try {
      // Promise.all lanza las 5 peticiones al mismo tiempo y espera a que todas terminen.
      const [media, generos, directores, productoras, tipos] = await Promise.all([
        mediaService.listar(),
        generoService.listar(),
        directorService.listar(),
        productoraService.listar(),
        tipoService.listar(),
      ]);
      setItems(media);
      setCatalogos({
        generos: aMapa(generos, 'id_genero', 'nombre'),
        directores: aMapa(directores, 'id_director', 'nombres'),
        productoras: aMapa(productoras, 'id_productora', 'nombre'),
        tipos: aMapa(tipos, 'id_tipo', 'nombre'),
      });
    } catch (error) {
      alertaError(mensajeDeError(error));
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function manejarEliminar(item) {
    const ok = await confirmar(
      `¿Eliminar "${item.titulo}"?`,
      'Esta acción no se puede deshacer.',
      'Sí, eliminar'
    );
    if (!ok) return;
    try {
      const respuesta = await mediaService.eliminar(item.serial);
      alertaExito(respuesta.message);
      cargar();
    } catch (error) {
      alertaError(mensajeDeError(error));
    }
  }

  // useMemo evita recalcular el filtro en cada render si no cambian items/busqueda/filtroTipo.
  const filtrados = useMemo(
    () =>
      items.filter(
        (i) =>
          i.titulo.toLowerCase().includes(busqueda.toLowerCase()) &&
          (filtroTipo === '' || String(i.id_tipo) === filtroTipo)
      ),
    [items, busqueda, filtroTipo]
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Películas y series</h2>
        <Link className="btn btn-primary" to="/media/nuevo">
          + Nueva producción
        </Link>
      </div>

      {/* Filtros: por título y por tipo (Película / Serie) */}
      <div className="row g-2 mb-4">
        <div className="col-md-8">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por título..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="">Todos los tipos</option>
            {Object.entries(catalogos.tipos).map(([id, nombre]) => (
              <option key={id} value={id}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando ? (
        <Cargando />
      ) : filtrados.length === 0 ? (
        <div className="alert alert-info">No hay producciones para mostrar.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {filtrados.map((item) => (
            <div className="col" key={item.serial}>
              <div className="card h-100 shadow-sm">
                {/* Si no hay portada o la imagen falla, se muestra un recuadro gris */}
                {item.portada ? (
                  <img
                    src={item.portada}
                    alt={`Portada de ${item.titulo}`}
                    className="card-img-top portada-card"
                    onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                  />
                ) : (
                  <div className="portada-card d-flex align-items-center justify-content-center text-muted">
                    Sin portada
                  </div>
                )}
                <div className="card-body">
                  <span className="badge bg-primary me-1">{catalogos.tipos[item.id_tipo] || 'Tipo'}</span>
                  <span className="badge bg-info text-dark">{catalogos.generos[item.id_genero] || 'Género'}</span>
                  <h5 className="card-title mt-2">
                    {item.titulo} <small className="text-muted">({item.anio_estreno})</small>
                  </h5>
                  <p className="card-text sinopsis-corta">{item.sinopsis}</p>
                  <ul className="list-unstyled small text-muted mb-0">
                    <li>
                      <strong>Director:</strong> {catalogos.directores[item.id_director] || '—'}
                    </li>
                    <li>
                      <strong>Productora:</strong> {catalogos.productoras[item.id_productora] || '—'}
                    </li>
                    <li>
                      <strong>Serial:</strong> {item.serial}
                    </li>
                  </ul>
                </div>
                <div className="card-footer d-flex gap-2">
                  <a className="btn btn-sm btn-success" href={item.url} target="_blank" rel="noreferrer">
                    Ver
                  </a>
                  <Link className="btn btn-sm btn-outline-primary" to={`/media/editar/${item.serial}`}>
                    Editar
                  </Link>
                  <button className="btn btn-sm btn-outline-danger ms-auto" onClick={() => manejarEliminar(item)}>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
