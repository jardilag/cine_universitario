import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BadgeEstado from './BadgeEstado';
import Cargando from './Cargando';
import { alertaError, alertaExito, confirmar, mensajeDeError } from '../utils/alertas';
import { formatearFecha } from '../utils/formato';

// Pantalla de listado genérica. Recibe un "modulo" (ver config/modulos.js) y dibuja
// la tabla con sus columnas, el botón "Nuevo" y las acciones Editar / Inactivar / Eliminar.
export default function CatalogoLista({ modulo }) {
  // Estado del componente: los registros y si todavía se están cargando.
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);

  const esInactivar = modulo.accion === 'inactivar';

  // Pide los registros a la API y los guarda en el estado.
  async function cargar() {
    setCargando(true);
    try {
      setRegistros(await modulo.servicio.listar());
    } catch (error) {
      alertaError(mensajeDeError(error));
    } finally {
      setCargando(false);
    }
  }

  // useEffect se ejecuta al montar el componente y cada vez que cambia el módulo
  // (por ejemplo, al pasar de Géneros a Directores).
  useEffect(() => {
    cargar();
  }, [modulo.clave]);

  // Inactivar o eliminar, siempre pidiendo confirmación con SweetAlert2.
  async function manejarEliminar(registro) {
    const verbo = esInactivar ? 'inactivar' : 'eliminar';
    const ok = await confirmar(
      `¿Deseas ${verbo} este ${modulo.singular}?`,
      esInactivar
        ? 'El registro no se borra, solo cambia a estado Inactivo.'
        : 'Esta acción no se puede deshacer.',
      `Sí, ${verbo}`
    );
    if (!ok) return;

    try {
      const respuesta = await modulo.servicio.eliminar(registro[modulo.idCampo]);
      alertaExito(respuesta.message);
      cargar(); // recargamos la tabla para ver el cambio
    } catch (error) {
      // Por ejemplo: un tipo que ya tiene películas asociadas devuelve 409.
      alertaError(mensajeDeError(error));
    }
  }

  // Dibuja el contenido de una celda según el tipo de columna.
  function renderCelda(registro, columna) {
    const valor = registro[columna.campo];
    if (columna.tipo === 'estado') return <BadgeEstado estado={valor} />;
    if (columna.tipo === 'fecha') return formatearFecha(valor);
    return valor || '—';
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">{modulo.titulo}</h2>
        <Link className="btn btn-primary" to={`${modulo.ruta}/nuevo`}>
          + Nuevo {modulo.singular}
        </Link>
      </div>

      {cargando ? (
        <Cargando />
      ) : registros.length === 0 ? (
        <div className="alert alert-info">No hay registros todavía.</div>
      ) : (
        <div className="table-responsive card shadow-sm">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                {modulo.columnas.map((c) => (
                  <th key={c.campo}>{c.titulo}</th>
                ))}
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r[modulo.idCampo]}>
                  <td>{r[modulo.idCampo]}</td>
                  {modulo.columnas.map((c) => (
                    <td key={c.campo}>{renderCelda(r, c)}</td>
                  ))}
                  <td className="text-end text-nowrap">
                    <Link
                      className="btn btn-sm btn-outline-primary me-2"
                      to={`${modulo.ruta}/editar/${r[modulo.idCampo]}`}
                    >
                      Editar
                    </Link>
                    {/* Si ya está inactivo no tiene sentido mostrar "Inactivar" */}
                    {!(esInactivar && r.estado === 'Inactivo') && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => manejarEliminar(r)}
                      >
                        {esInactivar ? 'Inactivar' : 'Eliminar'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
