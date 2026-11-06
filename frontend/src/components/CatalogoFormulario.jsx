import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import Cargando from './Cargando';
import { alertaAdvertencia, alertaError, alertaExito, mensajeDeError } from '../utils/alertas';

// Formulario genérico para crear y editar. Si la URL trae un :id (/generos/editar/3)
// estamos editando; si no (/generos/nuevo) estamos creando.
export default function CatalogoFormulario({ modulo }) {
  const { id } = useParams(); // lee el parámetro :id de la URL
  const history = useHistory(); // permite navegar por código (volver al listado)
  const esEdicion = Boolean(id);

  // Valores iniciales: cadena vacía en cada campo y estado "Activo" por defecto.
  const valoresIniciales = Object.fromEntries(
    modulo.campos.map((c) => [c.nombre, c.tipo === 'estado' ? 'Activo' : ''])
  );
  const [datos, setDatos] = useState(valoresIniciales);
  const [cargando, setCargando] = useState(esEdicion);
  const [guardando, setGuardando] = useState(false);

  // En modo edición, traemos el registro actual para rellenar el formulario.
  useEffect(() => {
    if (!esEdicion) {
      setDatos(valoresIniciales);
      return;
    }
    async function cargarRegistro() {
      try {
        const registro = await modulo.servicio.obtener(id);
        // null (campo vacío en BD) se convierte en '' porque los inputs controlados no aceptan null
        setDatos(
          Object.fromEntries(modulo.campos.map((c) => [c.nombre, registro[c.nombre] ?? '']))
        );
      } catch (error) {
        alertaError(mensajeDeError(error));
        history.replace(modulo.ruta);
      } finally {
        setCargando(false);
      }
    }
    cargarRegistro();
  }, [modulo.clave, id]);

  // Un solo manejador para todos los inputs: usa el atributo "name" para saber qué campo cambió.
  function manejarCambio(e) {
    const { name, value } = e.target;
    setDatos((anterior) => ({ ...anterior, [name]: value }));
  }

  async function manejarEnvio(e) {
    e.preventDefault(); // evita que el navegador recargue la página

    // Validación en el cliente (el backend vuelve a validar, pero así damos respuesta inmediata).
    for (const campo of modulo.campos) {
      if (campo.requerido && !String(datos[campo.nombre]).trim()) {
        return alertaAdvertencia(`El campo "${campo.etiqueta}" es obligatorio.`);
      }
    }

    // Construimos el cuerpo JSON: texto recortado y los campos opcionales vacíos se envían como null.
    const cuerpo = {};
    for (const campo of modulo.campos) {
      const valor = String(datos[campo.nombre]).trim();
      cuerpo[campo.nombre] = valor === '' && !campo.requerido ? null : valor;
    }

    setGuardando(true);
    try {
      const respuesta = esEdicion
        ? await modulo.servicio.actualizar(id, cuerpo) // PUT
        : await modulo.servicio.crear(cuerpo); // POST
      await alertaExito(respuesta.message);
      history.push(modulo.ruta); // volvemos al listado
    } catch (error) {
      // 409 = nombre duplicado, 400 = validación del backend, etc.
      alertaError(mensajeDeError(error));
    } finally {
      setGuardando(false);
    }
  }

  // Dibuja el input adecuado según el tipo de campo.
  function renderCampo(campo) {
    const propiedades = {
      id: campo.nombre,
      name: campo.nombre,
      className: 'form-control',
      value: datos[campo.nombre],
      onChange: manejarCambio,
      maxLength: campo.max,
    };
    if (campo.tipo === 'textarea') return <textarea rows="3" {...propiedades} />;
    if (campo.tipo === 'estado') {
      return (
        <select {...propiedades} className="form-select">
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>
      );
    }
    return <input type="text" {...propiedades} />;
  }

  if (cargando) return <Cargando />;

  return (
    <div className="row justify-content-center">
      <div className="col-lg-7">
        <div className="card shadow-sm">
          <div className="card-body">
            <h2 className="h4 mb-4">
              {esEdicion ? 'Editar' : 'Nuevo'} {modulo.singular}
            </h2>
            <form onSubmit={manejarEnvio} noValidate>
              {modulo.campos.map((campo) => (
                <div className="mb-3" key={campo.nombre}>
                  <label htmlFor={campo.nombre} className="form-label">
                    {campo.etiqueta}
                    {campo.requerido && <span className="text-danger"> *</span>}
                  </label>
                  {renderCampo(campo)}
                </div>
              ))}
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => history.push(modulo.ruta)}
                >
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
