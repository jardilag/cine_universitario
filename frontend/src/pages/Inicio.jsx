import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import BadgeEstado from '../components/BadgeEstado';
import Cargando from '../components/Cargando';
import { useAdmin } from '../context/AdminContext';
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

// Página principal: galería de películas y series.
//  - Visitante: solo ve las producciones ACTIVAS y no puede modificar nada.
//  - Administrador: ve todas (también las inactivas) y puede agregar, editar e inactivar.
export default function Inicio() {
  const { esAdmin } = useAdmin();
  const [items, setItems] = useState([]);
  const [catalogos, setCatalogos] = useState({ generos: {}, directores: {}, productoras: {}, tipos: {} });
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroGenero, setFiltroGenero] = useState('');

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

  // "Eliminar" en realidad INACTIVA: el backend cambia el estado a Inactivo y conserva el registro.
  async function manejarInactivar(item) {
    const ok = await confirmar(
      `¿Inactivar "${item.titulo}"?`,
      'No se borra: dejará de verse para los visitantes y podrás reactivarla editándola.',
      'Sí, inactivar'
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

  // useMemo evita recalcular el filtro en cada render si no cambian sus dependencias.
  const visibles = useMemo(
    () =>
      items.filter(
        (i) =>
          (esAdmin || i.estado === 'Activo') && // los visitantes solo ven las activas
          i.titulo.toLowerCase().includes(busqueda.toLowerCase()) &&
          (filtroTipo === '' || String(i.id_tipo) === filtroTipo) &&
          (filtroGenero === '' || String(i.id_genero) === filtroGenero)
      ),
    [items, esAdmin, busqueda, filtroTipo, filtroGenero]
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Películas y series</h2>
        {/* El botón de agregar solo existe en modo administrador */}
        {esAdmin && (
          <Link className="btn btn-primary" to="/media/nuevo">
            + Nueva producción
          </Link>
        )}
      </div>

      {esAdmin && (
        <div className="alert alert-warning py-2">
          Estás en <strong>modo administrador</strong>: puedes agregar, editar e inactivar.
        </div>
      )}

      {/* Filtros: por título, tipo (Película / Serie) y género */}
      <div className="row g-2 mb-4">
        <div className="col-md-6">
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por título..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="">Todos los tipos</option>
            {Object.entries(catalogos.tipos).map(([id, nombre]) => (
              <option key={id} value={id}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" value={filtroGenero} onChange={(e) => setFiltroGenero(e.target.value)}>
            <option value="">Todos los géneros</option>
            {Object.entries(catalogos.generos).map(([id, nombre]) => (
              <option key={id} value={id}>
                {nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {cargando ? (
        <Cargando />
      ) : visibles.length === 0 ? (
        <div className="alert alert-info">No hay producciones para mostrar.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {visibles.map((item) => (
            <div className="col" key={item.serial}>
              {/* Las inactivas (solo visibles para el admin) se muestran atenuadas */}
              <div className={`card h-100 shadow-sm ${item.estado === 'Inactivo' ? 'opacity-50' : ''}`}>
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
                  <span className="badge bg-info text-dark me-1">{catalogos.generos[item.id_genero] || 'Género'}</span>
                  {esAdmin && <BadgeEstado estado={item.estado} />}
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
                  {/* Editar e Inactivar solo aparecen en modo administrador */}
                  {esAdmin && (
                    <>
                      <Link className="btn btn-sm btn-outline-primary" to={`/media/editar/${item.serial}`}>
                        Editar
                      </Link>
                      {item.estado === 'Activo' && (
                        <button className="btn btn-sm btn-outline-danger ms-auto" onClick={() => manejarInactivar(item)}>
                          Inactivar
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
